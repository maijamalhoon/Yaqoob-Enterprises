import test from "node:test";
import assert from "node:assert/strict";
import { filterAdminServices, normalizeAdminServiceFilters } from "../lib/admin-service-filters.ts";

const services = [
  { category_id: "printing", title: "Colour Printing", slug: "colour-printing", short_description: "Full colour pages", status: "active" },
  { category_id: "printing", title: "Photocopy", slug: "photocopy", short_description: "Black and white copies", status: "temporarily_unavailable" },
  { category_id: "tickets", title: "Bus ticket", slug: "bus-ticket", short_description: null, status: "hidden" },
];

test("normalizes search and ignores unsupported status parameters", () => {
  assert.deepEqual(normalizeAdminServiceFilters("  Colour  ", "active"), { query: "Colour", status: "active", active: true });
  assert.deepEqual(normalizeAdminServiceFilters("", "deleted"), { query: "", status: "all", active: false });
  assert.equal(normalizeAdminServiceFilters("x".repeat(100)).query.length, 80);
});

test("filters titles, slugs and descriptions case insensitively", () => {
  assert.deepEqual(filterAdminServices(services, "COLOUR", "all").map((service) => service.slug), ["colour-printing"]);
  assert.deepEqual(filterAdminServices(services, "black and white", "all").map((service) => service.slug), ["photocopy"]);
  assert.deepEqual(filterAdminServices(services, "bus-ticket", "all").map((service) => service.slug), ["bus-ticket"]);
});

test("status and text filters combine, without mutating source data", () => {
  assert.equal(filterAdminServices(services, "", "all").length, 3);
  assert.deepEqual(filterAdminServices(services, "", "hidden").map((service) => service.slug), ["bus-ticket"]);
  assert.equal(filterAdminServices(services, "photocopy", "active").length, 0);
  assert.equal(services.length, 3);
});
