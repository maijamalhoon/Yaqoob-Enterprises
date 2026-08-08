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

  await openHealthy(page, "/");
  assert((await page.locator("body").innerText()).includes("Yaqoob Enterprises"), "Homepage is missing the business identity.");
  assert(await page.locator('a[href="/contact"]').count(), "Homepage is missing the contact/request route.");

  await openHealthy(page, "/contact");
  assert((await page.locator("h1").first().innerText()).includes("Tell us what you need"), "Contact heading changed unexpectedly.");
  assert((await page.locator('input[name="name"]').getAttribute("maxlength")) === "100", "Name input boundary is missing.");
  assert((await page.locator('textarea[name="details"]').getAttribute("maxlength")) === "1600", "Request details boundary is missing.");
  const categoryOptions = await page.locator('select[name="category"] option').count();
  assert(categoryOptions >= 9, `Expected 8 service categories plus placeholder; found ${categoryOptions}.`);

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
  assert(await mobilePage.locator(".mobile-action-bar").count(), "Mobile quick-action bar is missing.");

  await openHealthy(mobilePage, "/contact");
  await assertNoHorizontalOverflow(mobilePage, "Mobile contact page");
  assert(await mobilePage.locator('form.request-form').count(), "Mobile guided request form is missing.");
  await mobile.close();

  console.log(`Browser smoke passed against ${baseUrl}`);
} finally {
  await browser.close();
}
