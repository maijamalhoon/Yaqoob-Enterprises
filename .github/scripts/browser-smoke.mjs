import { chromium } from "playwright";

const baseUrl = (process.env.BASE_URL || "https://yaqoob-enterprises.vercel.app").replace(/\/$/, "");

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function openHealthy(page, path) {
  let lastError;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    try {
      const response = await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded", timeout: 20_000 });
      if (response && response.status() < 400) return response;
      lastError = new Error(`${path} returned ${response?.status() ?? "no response"}`);
    } catch (error) {
      lastError = error;
    }
    await page.waitForTimeout(5_000);
  }
  throw lastError || new Error(`Could not open ${path}`);
}

async function assertNoHorizontalOverflow(page, label) {
  const dimensions = await page.evaluate(() => ({
    width: window.innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert(dimensions.scrollWidth <= dimensions.width + 1, `${label} overflows horizontally: ${dimensions.scrollWidth}px > ${dimensions.width}px`);
}

const browser = await chromium.launch({ headless: true });
try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await desktop.newPage();
  const pageErrors = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  const homepageResponse = await openHealthy(page, "/");
  const contentSecurityPolicy = homepageResponse.headers()["content-security-policy"] || "";
  assert(contentSecurityPolicy.includes("script-src"), "Homepage is missing its Content-Security-Policy script directive.");
  assert(!contentSecurityPolicy.includes("'unsafe-eval'"), "Production CSP must not allow unsafe-eval.");
  assert((await page.title()).includes("Akhtar Colony"), "Homepage title should identify the Akhtar Colony location.");
  const structuredData = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.flatMap((node) => {
      try {
        return [JSON.parse(node.textContent || "{}")];
      } catch {
        return [];
      }
    }),
  );
  assert(
    structuredData.some((item) => item?.["@type"] === "WebSite" && item?.name === "Yaqoob Enterprises"),
    "Homepage is missing WebSite structured data for Yaqoob Enterprises.",
  );
  assert(
    structuredData.some((item) => Array.isArray(item?.["@type"]) && item["@type"].includes("LocalBusiness")),
    "Homepage is missing LocalBusiness structured data.",
  );
  assert((await page.locator("body").innerText()).includes("Yaqoob Enterprises"), "Homepage is missing the business identity.");
  assert((await page.locator("#services .category-card").count()) === 8, "Homepage must show all 8 service categories at once.");
  assert((await page.locator('[aria-roledescription="carousel"]').count()) === 0, "Homepage services should not use an autoplay carousel.");
  assert((await page.locator('.service-stage__pause').count()) === 0, "Homepage services should not ship autoplay controls.");
  assert((await page.locator('#get-in-touch form[data-home-contact-form]').count()) === 1, "Homepage must contain one premium get-in-touch form.");
  assert((await page.locator('#get-in-touch select[name="service"] option').count()) === 10, "Homepage contact form must expose guidance plus all 8 service categories.");
  assert((await page.locator('.announcement-bar').count()) === 0, "Homepage should not show an announcement strip.");
  assert((await page.locator('.journey-strip').count()) === 0, "Homepage should not show the old process strip.");
  assert((await page.locator('.experience-section').count()) === 0, "Homepage should not show the old quotation section.");
  assert((await page.locator('#coverage').count()) === 0, "Homepage should not show a separate coverage section.");
  assert((await page.locator('footer').count()) === 0, "Homepage should not render a footer.");

  const sitemapResponse = await page.request.get(`${baseUrl}/sitemap.xml`);
  assert(sitemapResponse.ok(), `Sitemap returned ${sitemapResponse.status()}.`);
  const sitemapText = await sitemapResponse.text();
  const serviceSitemapEntries = sitemapText.match(/<loc>[^<]*\/services\//g) || [];
  assert(serviceSitemapEntries.length === 8, `Expected 8 active service URLs in sitemap; found ${serviceSitemapEntries.length}.`);

  await openHealthy(page, "/contact");
  assert((await page.locator("h1").first().innerText()).includes("Tell us what you need"), "Contact heading changed unexpectedly.");
  assert((await page.locator('input[name="name"]').getAttribute("maxlength")) === "100", "Name input boundary is missing.");
  assert((await page.locator('textarea[name="details"]').getAttribute("maxlength")) === "1600", "Request details boundary is missing.");
  const categoryLabels = await page.locator('select[name="category"] option').allTextContents();
  assert(categoryLabels.length >= 10, `Expected placeholder, guidance option and 8 service categories; found ${categoryLabels.length}.`);
  assert(
    categoryLabels.some((label) => label.includes("not sure which service")),
    "Guided request lost the top-level service guidance option.",
  );

  await page.locator('select[name="category"]').selectOption("printing-photos");
  const modeLabels = await page.locator('select[name="mode"] option').allTextContents();
  assert(modeLabels.some((label) => label.includes("Visit the shop")), "Guided request lost the shop-visit option.");
  assert(modeLabels.some((label) => label.includes("Not sure")), "Guided request lost the fallback guidance option.");

  await openHealthy(page, "/services/printing-photos");
  assert((await page.locator("h1").first().innerText()).includes("Printing"), "Printing service page did not render its heading.");

  await openHealthy(page, "/privacy");
  assert(await page.locator("main").count(), "Privacy page did not render its main content.");
  assert(pageErrors.length === 0, `Browser page errors detected: ${pageErrors.join(" | ")}`);
  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const mobilePage = await mobile.newPage();
  await openHealthy(mobilePage, "/");
  await assertNoHorizontalOverflow(mobilePage, "Mobile homepage");
  assert((await mobilePage.locator("#services .category-card").count()) === 8, "Mobile homepage must expose all 8 service categories.");
  assert((await mobilePage.locator("#get-in-touch form[data-home-contact-form]").count()) === 1, "Mobile homepage get-in-touch form is missing.");
  assert((await mobilePage.locator(".mobile-action-bar").count()) === 0, "Simplified homepage should not use a persistent mobile action bar.");
  assert((await mobilePage.locator("footer").count()) === 0, "Mobile homepage should not render a footer.");

  await openHealthy(mobilePage, "/contact");
  await assertNoHorizontalOverflow(mobilePage, "Mobile contact page");
  assert(await mobilePage.locator('form.request-form').count(), "Mobile guided request form is missing.");
  assert((await mobilePage.locator(".contact-hours__row").count()) === 7, "Opening hours should render one weekly schedule, not duplicate rows.");
  await mobile.close();

  console.log(`Browser smoke passed against ${baseUrl}`);
} finally {
  await browser.close();
}
