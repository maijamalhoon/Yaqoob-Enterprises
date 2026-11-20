#!/usr/bin/env node
// Disposable Supabase + Next.js E2E. NEVER run against hosted or production endpoints.
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import { chromium } from "playwright";
import { createClient } from "@supabase/supabase-js";
import { verifyPortableBackup } from "../../lib/admin-portable-backup.ts";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const appUrl = process.env.LOCAL_ADMIN_QA_URL || "http://127.0.0.1:3000";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceKey = process.env.LOCAL_SUPABASE_SERVICE_ROLE_KEY;

function requireLoopback(url, allowedPort) {
  const value = new URL(url);
  assert(["127.0.0.1", "localhost"].includes(value.hostname), "E2E must never run against hosted services");
  assert.equal(value.protocol, "http:", "E2E only supports localhost HTTP");
  assert.equal(value.port, String(allowedPort), "E2E endpoint port must match disposable local stack");
}
assert.equal(process.env.LOCAL_ADMIN_QA_ONLY, "1", "Explicit local-only E2E guard missing");
assert.notEqual(process.env.VERCEL_ENV, "production", "Never run E2E under a production environment");
const githubRun = process.env.GITHUB_RUN_ID;
const expectedLocalApiPort = githubRun && /^[0-9]+$/.test(githubRun)
  ? 24000 + Number(githubRun) % 10000
  : 54321;
requireLoopback(supabaseUrl, expectedLocalApiPort);
requireLoopback(appUrl, 3000);
assert(anonKey?.length > 20 && serviceKey?.length > 20, "Local-only Supabase credentials required");

const localService = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
const anonymous = createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
function client() {
  return createClient(supabaseUrl, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
}
function dataOrFail(result, label) {
  if (result.error || result.data === null || result.data === undefined) {
    throw new Error(label + ": " + (result.error?.message || "missing result"));
  }
  return result.data;
}
function denied(result, label) {
  assert(result.error, label + ": access was incorrectly allowed");
}
const unique = randomUUID().replace(/-/g, "").slice(0, 12);
const email = "qa-owner-" + unique + "@example.invalid";
const outsiderEmail = "qa-outsider-" + unique + "@example.invalid";
const password = randomBytes(24).toString("hex") + "A!";
const browser = await chromium.launch({ headless: true });

try {
  // The service key exists ONLY inside disposable localhost. Never pass it to Next.js.
  const adminUser = dataOrFail(await localService.auth.admin.createUser({
    email, password, email_confirm: true,
  }), "Create disposable user").user;
  assert(adminUser?.id, "Local admin identity was not created");
  dataOrFail(await localService.from("admin_profiles").insert({
    user_id: adminUser.id, role: "owner", is_active: true, display_name: "Local QA Owner",
  }).select("user_id").single(), "Grant localhost-only admin rights");
  const outsiderUser = dataOrFail(await localService.auth.admin.createUser({
    email: outsiderEmail, password, email_confirm: true,
  }), "Create non-admin user").user;
  assert(outsiderUser?.id, "Local non-admin identity was not created");

  const owner = client();
  dataOrFail(await owner.auth.signInWithPassword({ email, password }), "Sign in admin with real local Auth");
  const outsider = client();
  dataOrFail(await outsider.auth.signInWithPassword({ email: outsiderEmail, password }), "Sign in outsider");

  const serviceSlug = "qa-service-" + unique;
  const areaName = "QA Area " + unique;
  const noticeTitle = "QA Notice " + unique;
  const galleryPath = "qa/" + unique + ".png";
  const { data: categories, error: categoryError } = await owner.from("service_categories")
    .select("id").order("display_order").limit(1);
  assert(!categoryError && categories?.length, "Expected seeded category in local migrations");

  // An anonymous or merely signed-in user must not gain CMS write privileges.
  denied(await anonymous.from("announcements").insert({ title: "Unauthorised", message: "Should fail" }), "anonymous insert");
  denied(await outsider.from("coverage_areas").insert({ name: areaName }), "non-admin insert");
  denied(await outsider.rpc("restore_admin_snapshot", { target_snapshot_id: randomUUID() }), "non-admin privileged restore");
  const outsiderProfile = dataOrFail(await outsider.from("admin_profiles").select("user_id"), "non-admin profile access");
  assert.equal(outsiderProfile.length, 0, "Non-admin gained access to admin profiles");

  const context = await browser.newContext({ viewport: { width: 1280, height: 800 }, acceptDownloads: true });
  const page = await context.newPage();
  const jsErrors = [];
  page.on("pageerror", (error) => jsErrors.push(error.message));

  // Unauthenticated browser must be blocked, even if given the export URL.
  const unauthenticated = await page.request.get(appUrl + "/admin/history/export", { maxRedirects: 0 });
  assert([302, 303, 307, 308, 401, 403].includes(unauthenticated.status()),
    "Portable download was exposed to a signed-out visitor");

  // Real Next.js sign-in via the browser (not a mocked session).
  await page.goto(appUrl + "/admin/login", { waitUntil: "domcontentloaded" });
  await page.locator("#admin-login-email").fill(email);
  await page.locator("#admin-login-password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await page.getByRole("heading", { name: "Website overview", exact: true }).waitFor({ timeout: 20_000 });
  assert(page.url().includes("/admin"), "Browser sign-in did not open admin");
  console.log("PASS: real login, anonymous denial, outsider denial and owner authorization");

  // Snapshot every authenticated Admin page at desktop and mobile widths.
  // This validates the actual rendered layout, not a fake design mock.
  const adminRoutes = [
    ["overview", "/admin"], ["services", "/admin/services"],
    ["coverage", "/admin/coverage"], ["gallery", "/admin/gallery"],
    ["announcements", "/admin/announcements"], ["settings", "/admin/settings"],
    ["analytics", "/admin/analytics"], ["history", "/admin/history"],
  ];
  await mkdir("test-results/admin-ui", { recursive: true });
  for (const viewport of [
    { name: "desktop", width: 1440, height: 900 },
    { name: "tablet", width: 820, height: 1024 },
    { name: "mobile", width: 390, height: 844 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    for (const [label, route] of adminRoutes) {
      await page.goto(appUrl + route, { waitUntil: "domcontentloaded" });
      await page.locator("#admin-main h1").first().waitFor({ timeout: 15_000 });
      const widths = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
      }));
      assert(
        widths.document <= widths.viewport + 3 && widths.body <= widths.viewport + 3,
        "Horizontal page overflow at " + viewport.name + " " + route + ": " + JSON.stringify(widths),
      );
      await page.screenshot({ path: "test-results/admin-ui/" + viewport.name + "-" + label + ".png", fullPage: true });
    }
  }

  // Review desktop-only breadcrumb semantics at desktop width after 3 responsive viewport snapshots.
  await page.setViewportSize({ width: 1280, height: 800 });
  // Dashboard decisions stay usable after the visual overhaul.
  await page.goto(appUrl + "/admin", { waitUntil: "domcontentloaded" });
  await page.getByRole("heading", { name: "Website overview", exact: true }).waitFor();
  assert(await page.getByRole("link", { name: /Open section|View analytics/ }).isVisible(), "Priority action is missing");
  await page.goto(appUrl + "/admin/analytics", { waitUntil: "domcontentloaded" });
  const lastWeekTab = page.getByRole("button", { name: "7 days", exact: true });
  await lastWeekTab.click();
  await page.waitForURL(/\/admin\/analytics\?range=7$/);
  assert.equal(await page.getByRole("button", { name: "7 days", exact: true }).getAttribute("aria-pressed"), "true",
    "7-day report selection did not update");
  assert.match(await page.locator(".admin-analytics-period").innerText(), /7 days/, "7-day reporting period was not updated");
  assert.equal(await page.locator(".admin-metric-card__body strong").nth(1).innerText(),
    await page.locator(".admin-trend__summary strong").innerText(),
    "7-day KPI and chart totals must agree");
  const monthTab = page.getByRole("button", { name: "30 days", exact: true });
  await monthTab.click();
  await page.waitForURL(/\/admin\/analytics\?range=30$/);
  assert.equal(await page.getByRole("button", { name: "30 days", exact: true }).getAttribute("aria-pressed"), "true",
    "30-day report selection did not update");
  assert.match(await page.locator(".admin-analytics-period").innerText(), /30 days/, "30-day reporting period was not updated");
  assert.equal(await page.locator(".admin-metric-card__body strong").nth(1).innerText(),
    await page.locator(".admin-trend__summary strong").innerText(),
    "30-day KPI and chart totals must agree");
  await page.goto(appUrl + "/admin/services", { waitUntil: "domcontentloaded" });
  const categoryJumpLinks = page.locator(".admin-service-jump a");
  assert((await categoryJumpLinks.count()) > 0, "Category jump shortcuts are missing");
  const firstJump = await categoryJumpLinks.first().getAttribute("href");
  assert(firstJump?.startsWith("#admin-category-"), "Category jump target malformed");
  assert(await page.locator(firstJump).count() === 1, "Category target section missing");
  await page.goto(appUrl + "/admin", { waitUntil: "networkidle" });
  // Verify both entry points after hydration, without racing Next.js client startup.
  await page.getByRole("button", { name: "Search admin pages" }).click();
  const commandInput = page.getByRole("combobox", { name: "Find an admin section" });
  await commandInput.waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  await commandInput.waitFor({ state: "hidden" });
  await page.keyboard.press("Control+k");
  await commandInput.waitFor({ state: "visible" });
  await commandInput.fill("history");
  await page.getByRole("option", { name: /History/ }).click();
  await page.waitForURL("**/admin/history");
  await page.getByRole("heading", { name: "History & backups" }).waitFor();
  // RSC route content may render before client-side usePathname updates the breadcrumb.
  await page.locator(".admin-topbar__location").getByText("System", { exact: true })
    .waitFor({ state: "visible", timeout: 15_000 });
  console.log("PASS: report-wide 7/30 filters, exact KPI/chart agreement, command search and breadcrumbs");

  await page.setViewportSize({ width: 1280, height: 800 });
  console.log("PASS: authenticated desktop/mobile screenshots for all eight admin routes, no horizontal overflow");

  // Overview focuses on actionable content; detailed checks are still available on demand.
  await page.goto(appUrl + "/admin", { waitUntil: "domcontentloaded" });
  const readiness = page.locator("details.admin-readiness-disclosure");
  assert.equal(await readiness.getAttribute("open"), null, "Readiness should be collapsed by default");
  await readiness.locator("summary").click();
  assert.equal(await readiness.locator("nav a").count(), 7, "All seven website checks must remain accessible");
  await readiness.locator("summary").click();

  await page.goto(appUrl + "/admin/settings", { waitUntil: "domcontentloaded" });
  const notices = page.locator("details.admin-settings-optional");
  await notices.locator("summary").click();
  assert(await notices.locator('textarea[name="pricing_message"]').isVisible(), "Optional notice editor must be usable");
  console.log("PASS: condensed Overview and progressive Settings keep complete accessible actions");



  // Exercise actual Next.js Server Actions for announcement create/edit.
  await page.goto(appUrl + "/admin/announcements", { waitUntil: "domcontentloaded" });
  await page.locator("details.admin-announcement-create > summary").click();
  await page.locator("details.admin-announcement-create input[name='title']").fill(noticeTitle);
  await page.locator("details.admin-announcement-create textarea[name='message']")
    .fill("Created with the real isolated admin form");
  await page.locator("details.admin-announcement-create input[name='is_active']").uncheck();
  await page.getByRole("button", { name: "Save announcement" }).click();
  await page.getByText("Announcement created.", { exact: true }).waitFor({ timeout: 20_000 });
  const notice = dataOrFail(await owner.from("announcements")
    .select("id,title,message,is_active").eq("title", noticeTitle).single(), "Announcement created via UI");
  assert.equal(notice.is_active, false, "Hidden UI announcement was incorrectly published");

  await page.reload({ waitUntil: "domcontentloaded" });
  const noticeRow = page.locator(".admin-announcement-row").filter({ hasText: noticeTitle });
  await noticeRow.locator("summary").click();
  await noticeRow.locator("textarea[name='message']").fill("Updated in browser using a server action");
  await noticeRow.getByRole("button", { name: "Save changes" }).click();
  await page.getByText("Announcement saved.", { exact: true }).waitFor({ timeout: 20_000 });
  const editedNotice = dataOrFail(await owner.from("announcements")
    .select("message").eq("id", notice.id).single(), "Announcement edited via UI");
  assert.equal(editedNotice.message, "Updated in browser using a server action");
  console.log("PASS: authenticated announcement create/edit with live Next.js forms");

  // Real owner RLS, not the service-role client, for all CMS CRUD.
  const createdService = dataOrFail(await owner.from("services").insert({
    category_id: categories[0].id, slug: serviceSlug,
    title: "QA Original Service", short_description: "Disposable RLS test service",
    status: "hidden",
  }).select("id,title").single(), "Create service");
  dataOrFail(await owner.from("services").update({ title: "QA Edited Service" })
    .eq("id", createdService.id).select("id").single(), "Update service");

  const area = dataOrFail(await owner.from("coverage_areas").insert({
    name: areaName, notes: "Disposable CI data", is_active: false,
  }).select("id,name").single(), "Create coverage");
  dataOrFail(await owner.from("coverage_areas").update({ notes: "Edited CI coverage" })
    .eq("id", area.id).select("id").single(), "Update coverage");

  const tinyPng = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQIHWP4z8DwHwAFgAI/ScL5bQAAAABJRU5ErkJggg==",
    "base64",
  );
  const upload = await owner.storage.from("shop-media").upload(galleryPath, tinyPng, {
    upsert: false, contentType: "image/png",
  });
  assert.ifError(upload.error);
  const gallery = dataOrFail(await owner.from("gallery_images").insert({
    storage_path: galleryPath, alt_text: "Disposable QA photo", media_kind: "real", is_active: true,
  }).select("id").single(), "Create Gallery metadata");
  const feature = await owner.rpc("admin_set_featured_gallery_image", { target_id: gallery.id });
  assert.ifError(feature.error);
  const featured = dataOrFail(await owner.from("gallery_images").select("is_featured")
    .eq("id", gallery.id).single(), "Featured image status");
  assert.equal(featured.is_featured, true);
  console.log("PASS: service, coverage and gallery owner CRUD plus real Storage upload and featured selection");

  // Create a real in-app snapshot via its protected server action.
  await page.goto(appUrl + "/admin/history", { waitUntil: "domcontentloaded" });
  const snapshotLabel = "Local QA snapshot " + unique;
  const snapshotForm = page.locator("form.admin-backup-create");
  await snapshotForm.locator("input[name='label']").fill(snapshotLabel);
  await snapshotForm.getByRole("button", { name: "Create backup" }).click();
  await page.getByText("Backup created and saved.", { exact: true }).waitFor({ timeout: 20_000 });
  const snapshot = dataOrFail(await owner.from("admin_snapshots").select("id,snapshot")
    .eq("label", snapshotLabel).single(), "Create real in-app snapshot");
  assert.equal(snapshot.snapshot.version, 1);

  // A malformed backup must fail before any data loss.
  const invalidBackup = dataOrFail(await owner.from("admin_snapshots").insert({
    label: "QA invalid snapshot " + unique,
    snapshot: { version: 1, business_settings: [] },
    created_by: adminUser.id,
  }).select("id").single(), "Stage malformed snapshot");
  const invalidRestore = await owner.rpc("restore_admin_snapshot", { target_snapshot_id: invalidBackup.id });
  assert(invalidRestore.error, "Malformed snapshot unexpectedly restored");

  // A structurally valid backup with an invalid FK must fail atomically.
  const brokenSnapshot = structuredClone(snapshot.snapshot);
  assert(brokenSnapshot.services.length > 0, "Seeded services required for FK rollback test");
  brokenSnapshot.services[0].category_id = randomUUID();
  const corruptedBackup = dataOrFail(await owner.from("admin_snapshots").insert({
    label: "QA broken FK snapshot " + unique,
    snapshot: brokenSnapshot,
    created_by: adminUser.id,
  }).select("id").single(), "Stage intentionally broken FK snapshot");
  const failedRestore = await owner.rpc("restore_admin_snapshot", { target_snapshot_id: corruptedBackup.id });
  assert(failedRestore.error, "Broken FK backup unexpectedly restored");
  const unchanged = dataOrFail(await owner.from("services")
    .select("title").eq("id", createdService.id).single(), "Verify rollback is atomic");
  assert.equal(unchanged.title, "QA Edited Service", "Failed restore destroyed existing data");
  console.log("PASS: malformed snapshots are blocked; failed FK restoration is atomic");

  // Modify a record and run the actual owner-only restore RPC. 
  dataOrFail(await owner.from("services").update({ title: "MUTATED AFTER BACKUP" })
    .eq("id", createdService.id).select("id").single(), "Mutate before restoring");
  const restore = await owner.rpc("restore_admin_snapshot", { target_snapshot_id: snapshot.id });
  assert.ifError(restore.error);
  const restoredService = dataOrFail(await owner.from("services")
    .select("title").eq("id", createdService.id).single(), "Read restored content");
  assert.equal(restoredService.title, "QA Edited Service", "Snapshot did not restore real database data");
  console.log("PASS: in-app backup created through UI and SQL restoration under owner privileges");

  // Signed-in export includes original bytes, announcements and all eight content tables.
  await page.reload({ waitUntil: "domcontentloaded" });
  const [download] = await Promise.all([
    page.waitForEvent("download", { timeout: 30_000 }),
    page.getByRole("link", { name: "Download offline backup" }).click(),
  ]);
  assert(download.suggestedFilename().endsWith(".json"), "Export did not return a JSON attachment");
  const exported = JSON.parse(await readFile(await download.path(), "utf8"));
  const verified = verifyPortableBackup(exported);
  assert.equal(verified.mediaCount, 1, "Export omitted uploaded photo");
  assert(exported.contents.announcements.some((row) => row.id === notice.id),
    "Export omitted announcement data");
  const archivedMedia = exported.media.find((item) => item.path === galleryPath);
  assert(archivedMedia, "Export omitted exact Storage image key");
  console.log("PASS: authenticated backup download; original bytes, 8 tables and hashes validated");

  // Offline disaster-recovery drill: delete local-only Storage object, recover its
  // verified original bytes, and recover announcement metadata from JSON.
  const removedFile = await owner.storage.from("shop-media").remove([galleryPath]);
  assert.ifError(removedFile.error);
  const absentFile = await owner.storage.from("shop-media").download(galleryPath);
  assert(absentFile.error, "Storage deletion did not occur in disposable environment");
  const recovered = await owner.storage.from("shop-media").upload(
    galleryPath, Buffer.from(archivedMedia.data_base64, "base64"),
    { contentType: archivedMedia.mime_type, upsert: false },
  );
  assert.ifError(recovered.error);
  const recoveredBytes = dataOrFail(await owner.storage.from("shop-media").download(galleryPath), "Recover Storage original");
  assert.equal(Buffer.compare(Buffer.from(await recoveredBytes.arrayBuffer()), tinyPng), 0);

  dataOrFail(await owner.from("announcements").delete().eq("id", notice.id)
    .select("id").single(), "Delete staging announcement");
  const archivedNotice = exported.contents.announcements.find((row) => row.id === notice.id);
  dataOrFail(await owner.from("announcements").insert(archivedNotice)
    .select("id").single(), "Restore excluded announcement from portable copy");
  const reimportedNotice = dataOrFail(await owner.from("announcements")
    .select("message").eq("id", notice.id).single(), "Verify recovered announcement");
  assert.equal(reimportedNotice.message, editedNotice.message);
  console.log("PASS: local-only deleted Storage byte recovery and excluded announcement recovery");

  // Finish with genuine DELETE tests, all on the disposable local DB.
  dataOrFail(await owner.from("gallery_images").delete().eq("id", gallery.id)
    .select("id").single(), "Delete gallery");
  dataOrFail(await owner.from("services").delete().eq("id", createdService.id)
    .select("id").single(), "Delete service");
  dataOrFail(await owner.from("coverage_areas").delete().eq("id", area.id)
    .select("id").single(), "Delete coverage");
  dataOrFail(await owner.from("announcements").delete().eq("id", notice.id)
    .select("id").single(), "Delete announcement");
  assert.equal(jsErrors.length, 0, "JavaScript browser errors: " + jsErrors.join(" | "));
  await context.close();
  console.log("PASS: full ephemeral QA completed — NO production data or services were modified");
} finally {
  await browser.close();
}
