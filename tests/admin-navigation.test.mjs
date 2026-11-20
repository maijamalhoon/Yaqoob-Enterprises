import assert from "node:assert/strict";
import test from "node:test";
import { adminNavigationItems, getAdminPage, isActiveAdminPath } from "../lib/admin-navigation.ts";

test("command palette and sidebar share all eight unique destinations", () => {
  assert.equal(adminNavigationItems.length, 8);
  assert.equal(new Set(adminNavigationItems.map((item) => item.href)).size, 8);
});
test("root only matches Overview, not every admin section", () => {
  assert.equal(isActiveAdminPath("/admin", "/admin"), true);
  assert.equal(isActiveAdminPath("/admin/services", "/admin"), false);
  assert.equal(isActiveAdminPath("/admin/services", "/admin/services"), true);
});
test("breadcrumbs report the correct IA group", () => {
  assert.equal(getAdminPage("/admin/analytics")?.section, "Workspace");
  assert.equal(getAdminPage("/admin/services")?.section, "Website");
  assert.equal(getAdminPage("/admin/history")?.section, "System");
});
