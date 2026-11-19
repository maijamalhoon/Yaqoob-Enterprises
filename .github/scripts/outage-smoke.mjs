import { chromium } from "playwright";

const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");

function assert(condition, reason) {
  if (!condition) throw new Error(reason);
}

async function readJsonLd(page) {
  return page.locator('script[type="application/ld+json"]').evaluateAll((nodes) =>
    nodes.flatMap((node) => {
      try { return [JSON.parse(node.textContent || "{}")]; } catch { return []; }
    }),
  );
}

const browser = await chromium.launch({ headless: true });

try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.route("**/api/analytics", (route) => route.fulfill({ status: 204, body: "" }));
  await page.route("https://www.googletagmanager.com/**", (route) => route.abort());

  async function open(path) {
    const response = await page.goto(baseUrl + path, { waitUntil: "domcontentloaded", timeout: 25_000 });
    assert(response?.status() === 200, path + " returned " + (response?.status() ?? "no response"));
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15_000 });
    const bounds = await page.evaluate(() => ({
      viewport: document.documentElement.clientWidth,
      body: document.documentElement.scrollWidth,
    }));
    assert(bounds.body <= bounds.viewport + 1, path + " overflows narrow phone: " + JSON.stringify(bounds));
  }

  // This build points ALL Supabase requests to the unreachable localhost :9;
  // real Supabase credentials, data, services and production are never touched.
  await open("/");
  assert((await page.locator('[role="status"]').allTextContents()).some((text) =>
    text.includes("Live service information is temporarily unavailable")), "Homepage did not show outage notice");
  assert((await page.locator("#services .home-service-list li").count()) === 8, "Home services missing during outage");
  assert((await page.locator("#quick-request form").count()) === 1, "WhatsApp form unavailable during outage");
  assert((await page.locator('#rates-preview a[href="/rates"]').count()) === 1, "Price navigation unavailable during outage");
  const homeText = await page.locator("main:not([aria-busy='true'])").last().innerText();
  assert(!homeText.includes("Open now"), "Homepage falsely claims the shop is open");
  const homeData = await readJsonLd(page);
  const businessData = homeData.find((item) => Array.isArray(item["@type"]) && item["@type"].includes("LocalBusiness"));
  assert(Boolean(businessData), "Homepage lost LocalBusiness identity during outage");
  assert(!businessData.hasOfferCatalog, "Homepage publishes unverified live services during outage");
  assert(!homeData.some((item) => item["@type"] === "FAQPage"), "Homepage publishes unverified FAQs during outage");

  await open("/services");
  assert((await page.locator("#services-search-input").count()) === 1, "Service search unavailable during outage");
  assert((await page.locator(".service-directory-item").count()) === 10, "Conservative catalogue is incomplete");
  assert((await page.locator('[role="status"]').count()) === 1, "Service catalogue outage notice missing");
  assert(!(await readJsonLd(page)).some((item) => item["@type"] === "ItemList"),
    "Unverified service ItemList emitted during outage");

  await open("/services/biometric");
  assert((await page.locator('[role="status"]').count()) === 1, "Category outage notice missing");
  await page.getByText("Confirm availability", { exact: true }).first().waitFor({ state: "visible", timeout: 15_000 });
  const categoryText = await page.locator("main:not([aria-busy='true'])").last().innerText();
  assert(categoryText.includes("Confirm availability"),
    "Category lacks availability confirmation: " + categoryText.slice(0, 600));

  await open("/services/biometric/general-biometric-esahulat");
  const serviceText = await page.locator("main:not([aria-busy='true'])").last().innerText();
  assert(serviceText.includes("Confirm availability"), "Detail page claims live availability");
  assert(serviceText.includes("Live availability could not be checked"), "Service safety note missing");
  assert(!(await readJsonLd(page)).some((item) => item["@type"] === "Service"),
    "Unverified Service schema emitted during outage");
  assert((await page.locator('a[href^="https://wa.me/"]').count()) >= 1,
    "Customer cannot reach WhatsApp during outage");

  await open("/rates");
  const rateText = await page.locator("main:not([aria-busy='true'])").last().innerText();
  assert(rateText.includes("A4 Photocopy") && rateText.includes("Rs. 10"), "Published offline rates missing");
  assert((await page.locator('main a[href^="https://wa.me/"]').count()) === 1, "Rates quotation CTA missing");

  await open("/contact");
  assert((await page.locator('main a[href^="tel:"]').count()) >= 1, "Contact phone missing");
  assert((await page.locator('main a[href^="https://wa.me/"]').count()) >= 1, "Contact WhatsApp missing");
  assert(!(await page.locator("main:not([aria-busy='true'])").last().innerText()).includes("Open now"), "Unknown hours presented as live");

  const sitemap = await page.request.get(baseUrl + "/sitemap.xml");
  assert(sitemap.status() === 200, "Sitemap failed with Supabase offline");
  const xml = await sitemap.text();
  assert(xml.includes("/services/biometric/general-biometric-esahulat"), "Sitemap lost conservative service detail URL");
  assert(!xml.includes("/services/typing-online/cv-preparation"), "Sitemap exposed intentionally hidden service");

  assert(errors.length === 0, "Browser runtime errors during outage: " + errors.join(" | "));
  console.log("OUTAGE E2E PASS: homepage, catalogue, category, detail, rates, contact, sitemap; no fabricated availability");
  await context.close();
} finally {
  await browser.close();
}
