import assert from "node:assert/strict";
import test from "node:test";
import { buildPublicFallbackData } from "../lib/public-site-fallback.ts";

const fallback = buildPublicFallbackData({ business_name: "Yaqoob Enterprises" });

test("fallback contains only baseline public category and service routes", () => {
  assert.equal(fallback.categories.length, 8);
  assert.equal(fallback.services.length, 10);
  assert.equal(fallback.isFallback, true);
  assert.equal(new Set(fallback.services.map((service) => service.slug)).size, 10);
  assert.ok(fallback.categories.every((category) => category.services.length > 0));
  for (const service of fallback.services) {
    assert.ok(fallback.categories.some((category) => category.id === service.category_id));
    assert.equal(service.status, "temporarily_unavailable");
    assert.equal(service.available_at_shop, false);
    assert.equal(service.delivery_available, false);
    assert.equal(service.doorstep_available, false);
    assert.ok(!service.short_description.includes("Guaranteed"));
  }
});

test("admin-hidden service routes never leak into the outage catalogue", () => {
  const excluded = ["photocopy-scanning", "cv-preparation", "fbr-registration-assistance", "fbr-sales-tax-biometric", "fbr-psw-biometric", "eto-vehicle-biometric", "windows-software-support"];
  for (const slug of excluded) assert.equal(fallback.services.some((service) => service.slug === slug), false);
});

test("no fabricated hours, coverage, gallery or announcements", () => {
  assert.deepEqual(fallback.hours, []);
  assert.deepEqual(fallback.coverage, []);
  assert.deepEqual(fallback.gallery, []);
  assert.deepEqual(fallback.announcements, []);
  assert.ok(fallback.settings.business_name);
});
