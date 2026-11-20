import assert from "node:assert/strict";
import test from "node:test";
import { normalizeAdminAnalyticsRange, analyticsSelectedDays, filterEventsForDays, contactConversionRate } from "../lib/admin-analytics-range.ts";

test("only supported ranges are accepted", () => {
  assert.equal(normalizeAdminAnalyticsRange("7"), 7);
  assert.equal(normalizeAdminAnalyticsRange("30"), 30);
  assert.equal(normalizeAdminAnalyticsRange("garbage"), 30);
  assert.equal(normalizeAdminAnalyticsRange(null), 30);
});
test("all dashboard panels share the exact selected days", () => {
  const days = Array.from({ length: 30 }, (_, i) => String(i + 1).padStart(2, "0"));
  assert.deepEqual(analyticsSelectedDays(days, 7), ["24", "25", "26", "27", "28", "29", "30"]);
  assert.equal(analyticsSelectedDays(days, 30).length, 30);
});
test("Pakistan midnight correctly assigns events to calendar days", () => {
  const rows = [
    { created_at: "2026-11-19T18:59:59Z", id: "before" },
    { created_at: "2026-11-19T19:00:01Z", id: "after" },
    { created_at: "broken", id: "invalid" },
  ];
  assert.deepEqual(filterEventsForDays(rows, ["2026-11-20"]).map(x => x.id), ["after"]);
});
test("conversion rate retains a meaningful small percentage", () => {
  assert.equal(contactConversionRate(3, 1685), 0.2);
  assert.equal(contactConversionRate(0, 0), 0);
  assert.equal(contactConversionRate(100, 100), 100);
});
