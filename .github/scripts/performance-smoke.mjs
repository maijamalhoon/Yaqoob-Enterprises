import { chromium } from "playwright";

const baseUrl = (process.env.BASE_URL || "http://127.0.0.1:3000").replace(/\/$/, "");
const budgets = {
  ttfbMs: 4_500, // Local CI sanity threshold; NOT a field Core Web Vitals score
  lcpMs: 6_000, // Lab only, unthrottled runner; real-world target is tighter
  cls: 0.25, // Guard against major layout shifts
  firstPartyJsCssKb: 2_200, // Transfer size; excludes images, third-party traffic
};

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const browser = await chromium.launch({ headless: true });
try {
  for (const config of [
    { name: "mobile-home", path: "/", viewport: { width: 390, height: 844 }, isMobile: true },
    { name: "mobile-services", path: "/services", viewport: { width: 390, height: 844 }, isMobile: true },
    { name: "mobile-rates", path: "/rates", viewport: { width: 390, height: 844 }, isMobile: true },
    { name: "desktop-home", path: "/", viewport: { width: 1366, height: 768 }, isMobile: false },
  ]) {
    const context = await browser.newContext({
      viewport: config.viewport,
      isMobile: config.isMobile,
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/api/analytics", (route) => route.fulfill({ status: 204, body: "" }));
    await page.route("https://www.googletagmanager.com/**", (route) => route.abort());
    await page.route(/https:\/\/[^/]*google-analytics\.com\/.*/, (route) => route.abort());

    // Observe metrics from navigation start; observing after page load loses LCP.
    await page.addInitScript(() => {
      window.__labVitals = { lcp: 0, cls: 0 };
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) window.__labVitals.lcp = entry.startTime;
        }).observe({ type: "largest-contentful-paint", buffered: true });
      } catch { /* unsupported browser metric */ }
      try {
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) window.__labVitals.cls += entry.value;
          }
        }).observe({ type: "layout-shift", buffered: true });
      } catch { /* unsupported browser metric */ }
    });

    const response = await page.goto(baseUrl + config.path, {
      waitUntil: "domcontentloaded",
      timeout: 30_000,
    });
    assert(response?.status() === 200, config.name + ": HTTP " + (response?.status() ?? "no response"));
    await page.locator("h1").first().waitFor({ state: "visible", timeout: 15_000 });
    await page.waitForTimeout(1_300);

    const metrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType("navigation")[0];
      const assets = performance.getEntriesByType("resource").filter((entry) =>
        entry.name.startsWith(location.origin + "/_next/static/") &&
        /\.(js|css)(\?|$)/.test(entry.name),
      );
      const bytes = assets.reduce((total, entry) =>
        total + (entry.transferSize || entry.encodedBodySize || 0), 0);
      return {
        ttfbMs: Math.round(navigation?.responseStart || 0),
        lcpMs: Math.round(window.__labVitals?.lcp || 0),
        cls: Number((window.__labVitals?.cls || 0).toFixed(4)),
        firstPartyJsCssKb: Math.round(bytes / 1024),
        assetCount: assets.length,
        bodyScrollWidth: document.documentElement.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
      };
    });

    console.log("PERF LAB " + config.name + " " + JSON.stringify(metrics));
    assert(errors.length === 0, config.name + ": browser exceptions " + errors.join(" | "));
    assert(metrics.viewportWidth + 1 >= metrics.bodyScrollWidth, config.name + ": horizontal overflow");
    assert(metrics.ttfbMs > 0 && metrics.ttfbMs <= budgets.ttfbMs,
      config.name + ": TTFB exceeded local CI budget: " + metrics.ttfbMs + "ms");
    assert(metrics.assetCount > 0, config.name + ": no first-party JS/CSS assets observed");
    assert(metrics.firstPartyJsCssKb <= budgets.firstPartyJsCssKb,
      config.name + ": JS/CSS transfer exceeded budget: " + metrics.firstPartyJsCssKb + "KB");
    assert(metrics.cls <= budgets.cls, config.name + ": CLS exceeded lab budget: " + metrics.cls);
    if (metrics.lcpMs > 0) {
      assert(metrics.lcpMs <= budgets.lcpMs, config.name + ": LCP exceeded lab budget: " + metrics.lcpMs + "ms");
    }
    await context.close();
  }
  console.log("PERF LAB PASS: budgets are local unthrottled regression guards, NOT real-user CWV / INP");
} finally {
  await browser.close();
}
