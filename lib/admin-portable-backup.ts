import { createHash } from "node:crypto";

export const PORTABLE_BACKUP_TABLES = [
  "business_settings",
  "business_hours",
  "service_categories",
  "services",
  "gallery_images",
  "coverage_areas",
  "announcements",
  "site_sections",
] as const;

export const PORTABLE_MEDIA_BUCKETS = ["shop-media", "site-media"] as const;
export const MAX_PORTABLE_FILES = 120;
export const MAX_PORTABLE_MEDIA_BYTES = 32 * 1024 * 1024;
export const MAX_PORTABLE_SINGLE_FILE_BYTES = 10 * 1024 * 1024;
export const MAX_PORTABLE_TABLE_ROWS = 5000;

export type PortableTable = (typeof PORTABLE_BACKUP_TABLES)[number];
export type PortableBucket = (typeof PORTABLE_MEDIA_BUCKETS)[number];
export type PortableContent = Record<PortableTable, Record<string, unknown>[]>;
export type PortableMedia = {
  bucket: PortableBucket;
  path: string;
  mime_type: string;
  size_bytes: number;
  sha256: string;
  data_base64: string;
};

export function safePortablePath(path: string): string {
  if (
    !path ||
    path.length > 1024 ||
    path.startsWith("/") ||
    path.includes("\\") ||
    /[\x00-\x1f\x7f]/.test(path) ||
    path.split("/").some((part) => !part || part === "." || part === "..")
  ) {
    throw new Error("An invalid Storage object path prevented a complete export.");
  }
  return path;
}

export function validateMediaBudget(fileCount: number, bytes: number) {
  if (fileCount > MAX_PORTABLE_FILES || bytes > MAX_PORTABLE_MEDIA_BYTES) {
    throw new Error("Media exceeds the portable backup size limit. Use the Supabase Storage export tools.");
  }
}

export async function encodePortableMedia(
  bucket: PortableBucket,
  path: string,
  file: Blob,
): Promise<PortableMedia> {
  safePortablePath(path);
  if (file.size > MAX_PORTABLE_SINGLE_FILE_BYTES) {
    throw new Error("A media file exceeds the portable backup single-file limit.");
  }
  const content = Buffer.from(await file.arrayBuffer());
  if (content.length !== file.size) {
    throw new Error("A media file changed while it was being exported.");
  }
  return {
    bucket,
    path,
    mime_type: file.type || "application/octet-stream",
    size_bytes: content.length,
    sha256: createHash("sha256").update(content).digest("hex"),
    data_base64: content.toString("base64"),
  };
}

export function assemblePortableBackup(
  content: PortableContent,
  media: PortableMedia[],
  exportedAt: string,
) {
  for (const table of PORTABLE_BACKUP_TABLES) {
    if (!Array.isArray(content[table]) || content[table].length > MAX_PORTABLE_TABLE_ROWS) {
      throw new Error("A content table is incomplete or exceeds the export limit.");
    }
  }
  if (content.business_settings.length !== 1) {
    throw new Error("Business details could not be verified. Export stopped.");
  }
  const seen = new Set<string>();
  let totalBytes = 0;
  for (const item of media) {
    if (!(PORTABLE_MEDIA_BUCKETS as readonly string[]).includes(item.bucket)) {
      throw new Error("An unexpected Storage bucket prevented the export.");
    }
    safePortablePath(item.path);
    const key = item.bucket + "/" + item.path;
    if (seen.has(key)) throw new Error("A Storage file was listed twice. Export stopped.");
    seen.add(key);
    if (!Number.isSafeInteger(item.size_bytes) || item.size_bytes < 0 || item.size_bytes > MAX_PORTABLE_SINGLE_FILE_BYTES) {
      throw new Error("An invalid media size prevented the export.");
    }
    totalBytes += item.size_bytes;
    validateMediaBudget(media.length, totalBytes);
  }

  // Database gallery metadata without a corresponding image byte stream is not a real backup.
  for (const image of content.gallery_images) {
    const path = image.storage_path;
    if (typeof path !== "string" || !PORTABLE_MEDIA_BUCKETS.some((bucket) => seen.has(bucket + "/" + path))) {
      throw new Error("A gallery image was missing from Storage. No incomplete backup was delivered.");
    }
  }

  return {
    format: "yaqoob-website-portable-backup",
    version: 1,
    exported_at: exportedAt,
    contents: content,
    media,
    media_count: media.length,
    media_total_bytes: totalBytes,
    // This download is an offline recovery copy, NOT an automatic import/restore file.
    exclusions: ["analytics_events", "admin_audit_log", "admin_snapshots", "authentication_users"],
    restore_mode: "manual-recovery-only",
  };
}
