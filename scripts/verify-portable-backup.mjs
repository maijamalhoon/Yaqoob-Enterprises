#!/usr/bin/env node
// Usage: node scripts/verify-portable-backup.mjs path/to/downloaded-backup.json
// Local-only: no network requests, database writes, or secrets.
import { readFile, stat } from "node:fs/promises";
import { verifyPortableBackup } from "../lib/admin-portable-backup.ts";

const filepath = process.argv[2];
if (!filepath || process.argv.length !== 3) {
  console.error("Usage: node --experimental-strip-types scripts/verify-portable-backup.mjs <backup-file.json>");
  process.exitCode = 2;
} else {
  try {
    const info = await stat(filepath);
    if (!info.isFile() || info.size > 64 * 1024 * 1024) {
      throw new Error("Backup file is missing or exceeds the 64 MB verifier limit.");
    }
    const input = JSON.parse(await readFile(filepath, "utf8"));
    const result = verifyPortableBackup(input);
    console.log("Backup integrity OK — format, content references and original image SHA-256 checksums.");
    console.log(JSON.stringify(result, null, 2));
    console.log("This is a manual recovery copy; automated restore and database recovery are NOT verified.");
  } catch (error) {
    console.error("Backup verification FAILED:", error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
