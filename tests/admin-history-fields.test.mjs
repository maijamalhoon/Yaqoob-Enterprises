import test from "node:test";
import assert from "node:assert/strict";
import {
  BACKUP_TABLES,
  assertRestorableBackup,
  completeBackupRows,
  parseAuditId,
  parseBackupId,
  parseBackupLabel,
} from "../lib/admin-history-fields.ts";

test("backup and audit references reject malformed input", () => {
  assert.equal(parseBackupId("a1b2c3d4-1111-2222-3333-444455556666"), "a1b2c3d4-1111-2222-3333-444455556666");
  for (const value of ["", "1234", "x".repeat(36), null]) {
    assert.throws(() => parseBackupId(value), /Backup reference is invalid/);
  }
  assert.equal(parseAuditId("46"), 46);
  for (const value of ["", "0", "-1", "1.5", "2e3", "9007199254740993", null]) {
    assert.throws(() => parseAuditId(value), /History entry is invalid/);
  }
});

test("backup label enforces database length and supports default names", () => {
  assert.equal(parseBackupLabel("  Before redesign  ", "Automatic"), "Before redesign");
  assert.equal(parseBackupLabel("", "Automatic"), "Automatic");
  assert.throws(() => parseBackupLabel("a".repeat(101), "Automatic"), /100 characters/);
});

test("snapshot export refuses capped or failed database reads", () => {
  assert.deepEqual(completeBackupRows({ data: [{ id: 1 }], count: 1, error: null }, "services"), [{ id: 1 }]);
  assert.deepEqual(completeBackupRows({ data: [], count: 0, error: null }, "gallery_images"), []);
  assert.throws(
    () => completeBackupRows({ data: Array.from({ length: 1000 }), count: 1001, error: null }, "services"),
    /No backup was created/,
  );
  assert.throws(
    () => completeBackupRows({ data: null, count: null, error: { message: "permission denied" } }, "services"),
    /No backup was created/,
  );
});

test("restore refuses invalid, incomplete and incompatible snapshots before any mutation", () => {
  const valid = Object.fromEntries(BACKUP_TABLES.map((table) => [table, []]));
  valid.business_settings = [{ id: true }];
  assert.doesNotThrow(() => assertRestorableBackup({ version: 1, ...valid }));
  assert.throws(() => assertRestorableBackup(null), /format is invalid/);
  assert.throws(() => assertRestorableBackup({ version: 2, ...valid }), /unsupported or incomplete/);
  assert.throws(() => assertRestorableBackup({ version: 1, ...valid, services: undefined }), /unsupported or incomplete/);
  assert.throws(() => assertRestorableBackup({ version: 1, ...valid, business_settings: [] }), /missing the business settings/);
});
