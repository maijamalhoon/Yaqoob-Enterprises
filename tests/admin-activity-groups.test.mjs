import assert from "node:assert/strict";
import test from "node:test";
import { groupRecentAdminActivity } from "../lib/admin-activity-groups.ts";

const event = (time, page = "/", city = "Karachi", device = "desktop") => ({
  event_name: "page_view",
  page_path: page,
  city_name: city,
  device_type: device,
  created_at: time,
});

test("groups repeated page views within five minutes without inventing visitors", () => {
  const groups = groupRecentAdminActivity([
    event("2026-11-20T08:02:00Z"),
    event("2026-11-20T08:01:30Z"),
    event("2026-11-20T08:01:00Z"),
  ]);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].count, 3);
  assert.equal(groups[0].created_at, "2026-11-20T08:02:00Z");
});

test("keeps different routes and devices separate", () => {
  const groups = groupRecentAdminActivity([
    event("2026-11-20T08:02:00Z", "/"),
    event("2026-11-20T08:01:00Z", "/rates"),
    event("2026-11-20T08:00:00Z", "/", "Karachi", "mobile"),
  ]);
  assert.deepEqual(groups.map((entry) => entry.count), [1, 1, 1]);
});

test("never combines events outside the window", () => {
  const groups = groupRecentAdminActivity([
    event("2026-11-20T08:10:00Z"),
    event("2026-11-20T08:05:01Z"),
    event("2026-11-20T08:04:00Z"),
  ]);
  assert.deepEqual(groups.map((entry) => entry.count), [2, 1]);
});

test("interleaved events of the same route can group when timestamps overlap", () => {
  const groups = groupRecentAdminActivity([
    event("2026-11-20T08:04:00Z", "/"),
    event("2026-11-20T08:03:00Z", "/rates"),
    event("2026-11-20T08:02:00Z", "/"),
  ]);
  assert.deepEqual(groups.map((entry) => entry.count), [2, 1]);
});

test("limits displayed groups without changing the recorded event counts", () => {
  const groups = groupRecentAdminActivity([
    event("2026-11-20T08:03:00Z", "/"),
    event("2026-11-20T08:02:00Z", "/rates"),
  ], 1);
  assert.equal(groups.length, 1);
  assert.equal(groups[0].count, 1);
});

test("invalid dates are displayed individually rather than merged", () => {
  const groups = groupRecentAdminActivity([event("invalid"), event("invalid")]);
  assert.equal(groups.length, 2);
});
