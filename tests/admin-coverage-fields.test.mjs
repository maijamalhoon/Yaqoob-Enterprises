import test from "node:test";
import assert from "node:assert/strict";
import { parseAdminCoverage } from "../lib/admin-coverage-fields.ts";

function form(fields) {
  const d = new FormData();
  for (const [k, v] of Object.entries(fields)) d.set(k, v);
  return d;
}

test("coverage create defaults active and handles flags", () => {
  const payload = parseAdminCoverage(form({ name: "Akhtar Colony", display_order: "0", pickup_available: "on" }), true);
  assert.equal(payload.is_active, true);
  assert.equal(payload.pickup_available, true);
  assert.equal(payload.delivery_available, false);
  assert.equal(payload.display_order, 0);
});

test("coverage update can hide an area", () => {
  const payload = parseAdminCoverage(form({ name: "DHA Phase 2", display_order: "10", delivery_available: "true" }), false);
  assert.equal(payload.is_active, false);
  assert.equal(payload.delivery_available, true);
});

test("coverage validation prevents malformed entries", () => {
  assert.throws(() => parseAdminCoverage(form({ name: "X", display_order: "0" }), true), /Area name/);
  assert.throws(() => parseAdminCoverage(form({ name: "Akhtar Colony", display_order: "-1" }), true), /Display order/);
  assert.throws(() => parseAdminCoverage(form({ name: "Akhtar Colony", display_order: "2.1" }), true), /Display order/);
  assert.throws(() => parseAdminCoverage(form({ name: "Akhtar Colony", display_order: "10001" }), true), /Display order/);
});
