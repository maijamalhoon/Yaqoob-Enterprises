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

async function assertHomepageLayout(page, label, { mobileNav, servicesColumns, stackedHero }) {
  await openHealthy(page, "/");
  await assertNoHorizontalOverflow(page, `${label} homepage`);

  assert((await page.locator("#services .minimal-service-item").count()) === 8, `${label}: homepage must expose all 8 service categories.`);
  assert((await page.locator('[aria-roledescription="carousel"]').count()) === 0, `${label}: services must not use an autoplay carousel.`);
  assert((await page.locator("#get-in-touch form[data-home-contact-form]").count()) === 1, `${label}: homepage quick-request form is missing.`);
  assert((await page.locator("footer.site-footer--minimal").count()) === 1, `${label}: homepage footer is missing.`);
  assert((await page.locator(".mobile-action-bar").count()) === 0, `${label}: homepage should not use a persistent mobile action bar.`);

  const mobileMenuDisplay = await page.locator(".mobile-nav").evaluate((node) => getComputedStyle(node).display);
  if (mobileNav) {
    assert(mobileMenuDisplay !== "none", `${label}: mobile navigation should be available.`);
  } else {
    assert(mobileMenuDisplay === "none", `${label}: desktop should not show mobile navigation.`);
    const whatsapp = page.locator(".header-text-action--primary");
    assert((await whatsapp.count()) === 1, `${label}: desktop WhatsApp header action is missing.`);
    assert((await whatsapp.innerText()).includes("WhatsApp"), `${label}: desktop WhatsApp action lost its visible label.`);
  }

  const serviceColumnCount = await page.locator(".minimal-services__list").evaluate((node) => {
    const columns = getComputedStyle(node).gridTemplateColumns;
    return columns.split(" ").filter(Boolean).length;
  });
  assert(serviceColumnCount === servicesColumns, `${label}: expected ${servicesColumns} service column(s), found ${serviceColumnCount}.`);

  const heroColumns = await page.locator(".home-hero-grid").evaluate((node) => getComputedStyle(node).gridTemplateColumns);
  const heroColumnCount = heroColumns.split(" ").filter(Boolean).length;
  assert(stackedHero ? heroColumnCount === 1 : heroColumnCount === 2, `${label}: hero breakpoint is not aligned as expected.`);

  const heroHeading = await page.locator(".home-hero h1").boundingBox();
  assert(heroHeading && heroHeading.width <= page.viewportSize().width, `${label}: hero heading exceeds viewport width.`);
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
  assert((await page.locator("#services .minimal-service-item").count()) === 8, "Homepage must show all 8 service categories.");
  assert((await page.locator('[aria-roledescription="carousel"]').count()) === 0, "Homepage services should not use an autoplay carousel.");
  assert((await page.locator('.service-stage__pause').count()) === 0, "Homepage services should not ship autoplay controls.");
  assert((await page.locator('#get-in-touch form[data-home-contact-form]').count()) === 1, "Homepage must contain one quick-request form.");
  assert((await page.locator('#get-in-touch select[name="service"] option').count()) === 10, "Homepage contact form must expose guidance plus all 8 service categories.");
  assert((await page.locator('.announcement-bar').count()) === 0, "Homepage should not show an announcement strip.");
  assert((await page.locator('.journey-strip').count()) === 0, "Homepage should not show the old process strip.");
  assert((await page.locator('.experience-section').count()) === 0, "Homepage should not show the old quotation section.");
  assert((await page.locator('#coverage').count()) === 0, "Homepage should not show a separate coverage section.");
  assert((await page.locator('footer.site-footer--minimal').count()) === 1, "Homepage must render the current minimal footer.");
  await assertNoHorizontalOverflow(page, "Desktop homepage");

  const desktopWhatsapp = page.locator(".header-text-action--primary");
  assert((await desktopWhatsapp.count()) === 1, "Desktop WhatsApp header action is missing.");
  assert((await desktopWhatsapp.innerText()).includes("WhatsApp"), "Desktop WhatsApp header action is blank.");

  const sitemapResponse = await page.request.get(`${baseUrl}/sitemap.xml`);
  assert(sitemapResponse.ok(), `Sitemap returned ${sitemapResponse.status()}.`);
  const sitemapText = await sitemapResponse.text();
  const serviceSitemapEntries = sitemapText.match(/<loc>[^<]*\/services\//g) || [];
  assert(serviceSitemapEntries.length === 8, `Expected 8 active service URLs in sitemap; found ${serviceSitemapEntries.length}.`);

  await openHealthy(page, "/contact");
  await assertNoHorizontalOverflow(page, "Desktop contact page");
  assert((await page.locator("h1").first().innerText()).includes("Tell us what you need"), "Contact heading changed unexpectedly.");
  assert((await page.locator('input[name="name"]').getAttribute("maxlength")) === "100", "Name input boundary is missing.");
  assert((await page.locator('textarea[name="details"]').getAttribute("maxlength")) === "1600", "Request details boundary is missing.");
  const categoryLabels = await page.locator('select[name="category"] option').allTextContents();
  assert(categoryLabels.length >= 10, `Expected placeholder, guidance option and 8 service categories; found ${categoryLabels.length}.`);
  assert(categoryLabels.some((label) => label.includes("not sure which service")), "Guided request lost the top-level service guidance option.");

  await page.locator('select[name="category"]').selectOption("printing-photos");
  const modeLabels = await page.locator('select[name="mode"] option').allTextContents();
  assert(modeLabels.some((label) => label.includes("Visit the shop")), "Guided request lost the shop-visit option.");
  assert(modeLabels.some((label) => label.includes("Not sure")), "Guided request lost the fallback guidance option.");

  await openHealthy(page, "/services/printing-photos");
  await assertNoHorizontalOverflow(page, "Desktop printing service page");
  assert((await page.locator("h1").first().innerText()).includes("Printing"), "Printing service page did not render its heading.");

  await openHealthy(page, "/privacy");
  await assertNoHorizontalOverflow(page, "Desktop privacy page");
  assert(await page.locator("main").count(), "Privacy page did not render its main content.");

  await openHealthy(page, "/admin/login");
  await assertNoHorizontalOverflow(page, "Desktop admin login");
  assert(pageErrors.length === 0, `Browser page errors detected: ${pageErrors.join(" | ")}`);
  await desktop.close();

  const viewportMatrix = [
    { label: "280px phone", width: 280, height: 653, mobileNav: true, servicesColumns: 1, stackedHero: true },
    { label: "320px phone", width: 320, height: 658, mobileNav: true, servicesColumns: 1, stackedHero: true },
    { label: "360px phone", width: 360, height: 800, mobileNav: true, servicesColumns: 1, stackedHero: true },
    { label: "390px phone", width: 390, height: 844, mobileNav: true, servicesColumns: 1, stackedHero: true },
    { label: "430px phone", width: 430, height: 932, mobileNav: true, servicesColumns: 1, stackedHero: true },
    { label: "768px tablet", width: 768, height: 1024, mobileNav: true, servicesColumns: 1, stackedHero: true },
    { label: "1024px landscape tablet", width: 1024, height: 768, mobileNav: true, servicesColumns: 2, stackedHero: false },
    { label: "1366px laptop", width: 1366, height: 768, mobileNav: false, servicesColumns: 2, stackedHero: false },
    { label: "1440px desktop", width: 1440, height: 900, mobileNav: false, servicesColumns: 2, stackedHero: false },
    { label: "1920px desktop", width: 1920, height: 1080, mobileNav: false, servicesColumns: 2, stackedHero: false },
  ];

  for (const viewport of viewportMatrix) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.width <= 430,
      hasTouch: viewport.width <= 1024,
    });
    const viewportPage = await context.newPage();
    await assertHomepageLayout(viewportPage, viewport.label, viewport);

    if (viewport.width <= 430) {
      await openHealthy(viewportPage, "/contact");
      await assertNoHorizontalOverflow(viewportPage, `${viewport.label} contact page`);
      assert(await viewportPage.locator('form.request-form').count(), `${viewport.label}: guided request form is missing.`);
      assert((await viewportPage.locator(".contact-hours__row").count()) === 7, `${viewport.label}: opening hours should render one weekly schedule.`);

      const formFontSize = await viewportPage.locator('select[name="category"]').evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
      assert(formFontSize >= 16, `${viewport.label}: mobile form controls must stay at 16px to avoid browser zoom.`);
    }

    await context.close();
  }

  console.log(`Browser smoke passed against ${baseUrl}`);
} finally {
  await browser.close();
}
