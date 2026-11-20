import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import {
  PORTABLE_BACKUP_TABLES, assemblePortableBackup, encodePortableMedia,
  safePortablePath, validateMediaBudget, verifyPortableBackup, MAX_PORTABLE_FILES,
} from "../lib/admin-portable-backup.ts";

function content(extra = {}) {
  return { ...Object.fromEntries(PORTABLE_BACKUP_TABLES.map((name) => [name, []])), business_settings: [{ id: true }], ...extra };
}

test("portable backup includes announcements and site content, excludes analytics and accounts", () => {
  const bundle = assemblePortableBackup(content({ announcements: [{ title: "Open tomorrow" }], site_sections: [{ section_key: "home" }] }), [], "2026-11-20T10:00:00.000Z");
  assert.equal(bundle.contents.announcements[0].title, "Open tomorrow");
  assert.equal(bundle.contents.site_sections.length, 1);
  assert.equal(bundle.media_count, 0);
  assert(bundle.exclusions.includes("authentication_users"));
  assert.equal(bundle.restore_mode, "manual-recovery-only");
});

test("portable media stores original bytes and sha256 digest", async () => {
  const bytes = new Uint8Array([0, 1, 2, 3, 254, 255]);
  const media = await encodePortableMedia("shop-media", "photos/test.png", new Blob([bytes], { type: "image/png" }));
  assert.equal(media.data_base64, Buffer.from(bytes).toString("base64"));
  assert.equal(media.sha256, createHash("sha256").update(bytes).digest("hex"));
  const result = assemblePortableBackup(content({ gallery_images: [{ storage_path: "photos/test.png" }] }), [media], new Date().toISOString());
  assert.equal(result.media_total_bytes, 6);
});

test("missing referenced image or duplicate asset blocks the download", async () => {
  assert.throws(() => assemblePortableBackup(content({ gallery_images: [{ storage_path: "missing.png" }] }), [], new Date().toISOString()), /missing from Storage/);
  const media = await encodePortableMedia("site-media", "photo.webp", new Blob(["abc"], { type: "image/webp" }));
  assert.throws(() => assemblePortableBackup(content(), [media, media], new Date().toISOString()), /listed twice/);
});

test("storage path rejects traversal and malformed keys", () => {
  for (const bad of ["", "/etc/passwd", "folder/../secret", "folder//file", "folder/./file", "folder\\name", "bad\nname"]) {
    assert.throws(() => safePortablePath(bad), /invalid Storage/);
  }
  assert.equal(safePortablePath("folder/good-image.webp"), "folder/good-image.webp");
});

test("size and content limits fail closed, without delivering a partial file", async () => {
  assert.throws(() => validateMediaBudget(MAX_PORTABLE_FILES + 1, 0), /exceeds/);
  assert.throws(() => assemblePortableBackup(content({ services: Array.from({ length: 5001 }, () => ({})) }), [], new Date().toISOString()), /incomplete/);
  await assert.rejects(() => encodePortableMedia("shop-media", "too-big.jpg", { size: 11 * 1024 * 1024 }), /single-file limit/);
  assert.throws(() => assemblePortableBackup({ ...content(), business_settings: [] }, [], new Date().toISOString()), /Business details/);
});


test("offline verifier validates a backup without access to production", async () => {
  const media = await encodePortableMedia("shop-media", "images/shop.webp", new Blob(["real image bytes"], { type: "image/webp" }));
  const exported = assemblePortableBackup(content({
    announcements: [{ title: "Holiday" }],
    gallery_images: [{ storage_path: "images/shop.webp" }],
  }), [media], "2026-11-20T06:00:00.000Z");
  assert.deepEqual(verifyPortableBackup(exported), {
    exportedAt: "2026-11-20T06:00:00.000Z",
    tables: Object.fromEntries(PORTABLE_BACKUP_TABLES.map((table) => [table, exported.contents[table].length])),
    mediaCount: 1,
    mediaBytes: 16,
  });
});

test("offline verifier fails on tampering, missing media and incorrect counts", async () => {
  const media = await encodePortableMedia("shop-media", "image.jpg", new Blob(["hello"], { type: "image/jpeg" }));
  const original = assemblePortableBackup(content({ gallery_images: [{ storage_path: "image.jpg" }] }), [media], "2026-11-20T06:00:00.000Z");
  const tamper = (change) => { const copy = structuredClone(original); change(copy); return copy; };
  assert.throws(() => verifyPortableBackup(tamper((doc) => { doc.media[0].data_base64 = Buffer.from("hullo").toString("base64"); })), /integrity verification failed/);
  assert.throws(() => verifyPortableBackup(tamper((doc) => { doc.media[0].sha256 = "0".repeat(64); })), /integrity verification failed/);
  assert.throws(() => verifyPortableBackup(tamper((doc) => { doc.media_count = 0; })), /totals do not match/);
  assert.throws(() => verifyPortableBackup(tamper((doc) => { doc.media = []; doc.media_count = 0; doc.media_total_bytes = 0; })), /missing from Storage/);
  assert.throws(() => verifyPortableBackup(tamper((doc) => { doc.version = 100; })), /Unsupported portable backup format/);
  assert.throws(() => verifyPortableBackup(tamper((doc) => { doc.media[0].data_base64 = "%"; })), /encoding or checksum/);
});
