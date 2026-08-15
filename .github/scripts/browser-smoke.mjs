import { chromium } from "playwright";

const baseUrl = (process.env.BASE_URL || "https://yaqoob-enterprises.vercel.app").replace(/\/$/, "");
const expectedMainServices = 10;

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

async function assertHomepage(page, label, { columns, mobileNav, stackedHero }) {
  await openHealthy(page, "/");
  await assertNoHorizontalOverflow(page, `${label} homepage`);

  const serviceCards = page.locator("#services .minimal-service-item");
  assert((await serviceCards.count()) === expectedMainServices, `${label}: expected ${expectedMainServices} admin-selected main services.`);
  assert((await serviceCards.first().getAttribute("href"))?.includes("/services/"), `${label}: main service cards must link to service detail pages.`);
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
    const gridColumns = getComputedStyle(node).gridTemplateColumns;
    return gridColumns.split(" ").filter(Boolean).length;
  });
  assert(serviceColumnCount === columns, `${label}: expected ${columns} service column(s), found ${serviceColumnCount}.`);

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
  const csp = homepageResponse.headers()["content-security-policy"] || "";
  assert(csp.includes("script-src"), "Homepage is missing its Content-Security-Policy script directive.");
  assert(!csp.includes("'unsafe-eval'"), "Production CSP must not allow unsafe-eval.");

  const structuredData = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.flatMap((node) => {
      try {
        return [JSON.parse(node.textContent || "{}")];
      } catch {
        return [];
      }
    }),
  );
  const websiteData = structuredData.find((item) => item?.["@type"] === "WebSite");
  const businessData = structuredData.find((item) => Array.isArray(item?.["@type"]) && item["@type"].includes("LocalBusiness"));
  assert(Boolean(websiteData?.name), "Homepage is missing configured WebSite structured data.");
  assert(Boolean(businessData), "Homepage is missing LocalBusiness structured data.");
  assert(Boolean(businessData?.address?.streetAddress), "Homepage is missing LocalBusiness address data.");
  assert(Array.isArray(businessData?.sameAs), "Business entity is missing sameAs identity links.");
  assert(businessData.sameAs.some((url) => String(url).includes("facebook.com/yaqoobenterprises1")), "Facebook profile is missing from business schema.");
  assert(businessData.sameAs.some((url) => String(url).includes("instagram.com/yaqoobenterprises1")), "Instagram profile is missing from business schema.");

  const catalogCategories = businessData?.hasOfferCatalog?.itemListElement || [];
  const catalogServices = catalogCategories.flatMap((category) => category?.itemListElement || []);
  assert(catalogCategories.length >= 8, `Expected at least 8 service categories in OfferCatalog; found ${catalogCategories.length}.`);
  assert(catalogServices.length >= 10, `Expected at least 10 public services in OfferCatalog; found ${catalogServices.length}.`);
  assert((await page.locator("#services .minimal-service-item").count()) === expectedMainServices, "Homepage must show exactly 10 admin-selected main services.");
  assert((await page.title()).includes(websiteData.name), "Homepage title should follow the configured business identity.");
  assert((await page.locator("body").innerText()).includes(websiteData.name), "Homepage is missing the configured business identity.");
  await assertNoHorizontalOverflow(page, "Desktop homepage");

  const sitemapResponse = await page.request.get(`${baseUrl}/sitemap.xml`);
  assert(sitemapResponse.ok(), `Sitemap returned ${sitemapResponse.status()}.`);
  const sitemapText = await sitemapResponse.text();
  const categoryEntries = sitemapText.match(/<loc>[^<]*\/services\/[^/<]+<\/loc>/g) || [];
  const detailEntries = sitemapText.match(/<loc>[^<]*\/services\/[^/<]+\/[^/<]+<\/loc>/g) || [];
  assert(categoryEntries.length >= 8, `Expected at least 8 active service categories in sitemap; found ${categoryEntries.length}.`);
  assert(detailEntries.length >= 10, `Expected at least 10 public service detail URLs in sitemap; found ${detailEntries.length}.`);

  for (const [source, destination] of [
    ["/services/printing-photos/photocopy-scanning", "/services/printing-photos/colour-black-white-printing"],
    ["/services/typing-online/cv-preparation", "/services/typing-online/urdu-english-typing"],
    ["/services/biometric/fbr-sales-tax-biometric", "/services/biometric/general-biometric-esahulat"],
    ["/services/biometric/fbr-psw-biometric", "/services/biometric/general-biometric-esahulat"],
    ["/services/biometric/eto-vehicle-biometric", "/services/biometric/general-biometric-esahulat"],
  ]) {
    const response = await page.request.get(`${baseUrl}${source}`, { maxRedirects: 0 });
    assert([301, 307, 308].includes(response.status()), `${source} should permanently redirect; received ${response.status()}.`);
    const location = response.headers().location || "";
    assert(location.endsWith(destination), `${source} redirects to the wrong destination: ${location}`);
  }

  await openHealthy(page, "/contact");
  await assertNoHorizontalOverflow(page, "Desktop contact page");
  assert((await page.locator("h1").first().innerText()).includes("Tell us what you need"), "Contact heading changed unexpectedly.");
  assert((await page.locator('input[name="name"]').getAttribute("maxlength")) === "100", "Name input boundary is missing.");
  assert((await page.locator('textarea[name="details"]').getAttribute("maxlength")) === "1600", "Request details boundary is missing.");
  const categoryLabels = await page.locator('select[name="category"] option').allTextContents();
  assert(categoryLabels.some((label) => label.includes("not sure which service")), "Guided request lost its top-level service guidance option.");
  await page.locator('select[name="category"]').selectOption("printing-photos");
  const modeLabels = await page.locator('select[name="mode"] option').allTextContents();
  assert(modeLabels.some((label) => label.includes("Visit the shop")), "Guided request lost the shop-visit option.");
  assert(modeLabels.some((label) => label.includes("Not sure")), "Guided request lost the fallback guidance option.");

  await openHealthy(page, "/services/printing-photos");
  await assertNoHorizontalOverflow(page, "Desktop printing category page");
  assert((await page.locator("h1").first().innerText()).includes("Printing"), "Printing category page did not render its heading.");
  assert((await page.locator(".service-detail-link").count()) >= 2, "Printing category should expose its public service detail pages.");

  await openHealthy(page, "/services/printing-photos/colour-black-white-printing");
  await assertNoHorizontalOverflow(page, "Desktop printing SEO page");
  assert((await page.locator("h1").first().innerText()).includes("Printing"), "Printing detail page lost its search heading.");
  assert((await page.locator("main").innerText()).includes("Common requests we handle"), "Printing detail page is missing search-intent content.");

  await openHealthy(page, "/services/biometric/general-biometric-esahulat");
  await assertNoHorizontalOverflow(page, "Desktop biometric SEO page");
  const biometricText = await page.locator("main").innerText();
  assert((await page.locator("h1").first().innerText()).includes("NADRA e-Sahulat"), "Biometric detail page lost its priority search heading.");
  assert((await page.title()).includes("Biometric Verification"), "Biometric detail page title is not search-focused.");
  assert(biometricText.includes("FBR Sales Tax"), "Grouped biometric page must cover FBR Sales Tax biometric intent.");
  assert(biometricText.includes("PSW"), "Grouped biometric page must cover PSW biometric intent.");
  assert(biometricText.includes("Vehicle / ETO"), "Grouped biometric page must cover Vehicle / ETO biometric intent.");
  assert((await page.locator(".seo-official-reference").count()) === 1, "Priority biometric page is missing official-source context.");
  const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
  assert(Boolean(canonical?.endsWith("/services/biometric/general-biometric-esahulat")), "Biometric canonical URL is incorrect.");

  const serviceStructuredData = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.flatMap((node) => {
      try {
        return [JSON.parse(node.textContent || "{}")];
      } catch {
        return [];
      }
    }),
  );
  const serviceData = serviceStructuredData.find((item) => item?.["@type"] === "Service");
  assert(Boolean(serviceData), "Service detail page is missing Service structured data.");
  assert(Array.isArray(serviceData?.areaServed) && serviceData.areaServed.length > 1, "Service schema should expose city and configured service areas.");
  assert(serviceStructuredData.some((item) => item?.["@type"] === "BreadcrumbList"), "Service detail page is missing Breadcrumb structured data.");

  await openHealthy(page, "/privacy");
  await assertNoHorizontalOverflow(page, "Desktop privacy page");
  assert((await page.locator("main").innerText()).includes("campaign"), "Privacy page must disclose campaign attribution cookies.");

  const adminLoginResponse = await openHealthy(page, "/admin/login");
  await assertNoHorizontalOverflow(page, "Desktop admin login");
  assert(adminLoginResponse.status() < 400, "Admin login route is unavailable.");
  for (const protectedPath of ["/admin", "/admin/analytics", "/admin/history"]) {
    const response = await page.request.get(`${baseUrl}${protectedPath}`, { maxRedirects: 0 });
    assert([302, 303, 307, 308].includes(response.status()), `${protectedPath} must remain protected for signed-out visitors.`);
  }

  assert(pageErrors.length === 0, `Browser page errors detected: ${pageErrors.join(" | ")}`);
  await desktop.close();

  const viewportMatrix = [
    { label: "280px phone", width: 280, height: 653, columns: 1, mobileNav: true, stackedHero: true },
    { label: "320px phone", width: 320, height: 658, columns: 1, mobileNav: true, stackedHero: true },
    { label: "360px phone", width: 360, height: 800, columns: 1, mobileNav: true, stackedHero: true },
    { label: "390px phone", width: 390, height: 844, columns: 1, mobileNav: true, stackedHero: true },
    { label: "430px phone", width: 430, height: 932, columns: 1, mobileNav: true, stackedHero: true },
    { label: "768px tablet", width: 768, height: 1024, columns: 1, mobileNav: true, stackedHero: true },
    { label: "1024px tablet", width: 1024, height: 768, columns: 2, mobileNav: true, stackedHero: false },
    { label: "1366px laptop", width: 1366, height: 768, columns: 2, mobileNav: false, stackedHero: false },
    { label: "1440px desktop", width: 1440, height: 900, columns: 2, mobileNav: false, stackedHero: false },
    { label: "1920px desktop", width: 1920, height: 1080, columns: 2, mobileNav: false, stackedHero: false },
  ];

  for (const viewport of viewportMatrix) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.width <= 430,
      hasTouch: viewport.width <= 1024,
    });
    const viewportPage = await context.newPage();
    await assertHomepage(viewportPage, viewport.label, viewport);
    if (viewport.width <= 430) {
      await openHealthy(viewportPage, "/contact");
      await assertNoHorizontalOverflow(viewportPage, `${viewport.label} contact page`);
      const formFontSize = await viewportPage.locator('select[name="category"]').evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
      assert(formFontSize >= 16, `${viewport.label}: mobile form controls must stay at 16px to avoid browser zoom.`);

      await openHealthy(viewportPage, "/services/biometric/general-biometric-esahulat");
      await assertNoHorizontalOverflow(viewportPage, `${viewport.label} biometric SEO page`);
      assert((await viewportPage.locator("h1").first().innerText()).includes("Biometric"), `${viewport.label}: biometric SEO heading is missing.`);
    }
    await context.close();
  }

  console.log(`Browser smoke passed against ${baseUrl}`);
} finally {
  await browser.close();
}
