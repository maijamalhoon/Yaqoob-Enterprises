import test from "node:test";
import assert from "node:assert/strict";
import { karachiAnalyticsWindow, karachiDayKey } from "../lib/admin-analytics-window.ts";

test("30-day Pakistan calendar window includes today, never 31 days", () => {
  const now = new Date("2026-11-20T20:00:00.000Z"); // Nov 21, 01:00 in Karachi
  const period = karachiAnalyticsWindow(now);
  assert.equal(period.days.length, 30);
  assert.equal(period.days[0], "2026-10-23");
  assert.equal(period.days[29], "2026-11-21");
  assert.equal(period.since, "2026-10-22T19:00:00.000Z");
  assert.equal(period.until, now.toISOString());
});

test("month and year boundaries use Karachi dates", () => {
  const beforeMidnight = new Date("2026-12-31T18:59:59.000Z");
  const afterMidnight = new Date("2026-12-31T19:00:00.000Z");
  assert.equal(karachiDayKey(beforeMidnight), "2026-12-31");
  assert.equal(karachiDayKey(afterMidnight), "2027-01-01");
  assert.equal(karachiAnalyticsWindow(afterMidnight).days[29], "2027-01-01");
  assert.equal(karachiAnalyticsWindow(afterMidnight).days[0], "2026-12-03");
});

test("invalid input date is rejected", () => {
  assert.throws(() => karachiAnalyticsWindow(new Date("invalid")), /invalid/);
});
