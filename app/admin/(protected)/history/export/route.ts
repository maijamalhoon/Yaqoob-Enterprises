import { requireAdmin } from "@/lib/admin";
import {
  PORTABLE_BACKUP_TABLES,
  PORTABLE_MEDIA_BUCKETS,
  MAX_PORTABLE_FILES,
  MAX_PORTABLE_MEDIA_BYTES,
  MAX_PORTABLE_TABLE_ROWS,
  assemblePortableBackup,
  encodePortableMedia,
  safePortablePath,
  validateMediaBudget,
  type PortableContent,
  type PortableMedia,
  type PortableBucket,
  type PortableTable,
} from "@/lib/admin-portable-backup";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

type AdminSupabase = Awaited<ReturnType<typeof requireAdmin>>["supabase"];

const PAGE_SIZE = 400;
const STORAGE_PAGE_SIZE = 100;

async function readTable(supabase: AdminSupabase, table: PortableTable) {
  const records: Record<string, unknown>[] = [];
  let expectedCount: number | null = null;

  while (true) {
    const { data, count, error } = await supabase
      .from(table)
      .select("*", { count: "exact" })
      .order("id", { ascending: true })
      .range(records.length, records.length + PAGE_SIZE - 1);

    if (error || !data || count === null || (expectedCount !== null && expectedCount !== count)) {
      throw new Error("A content table could not be read consistently.");
    }
    expectedCount = count;
    if (count > MAX_PORTABLE_TABLE_ROWS) throw new Error("Content exceeds the portable export limit.");
    if (data.length === 0 && records.length < count) {
      throw new Error("A content table returned an incomplete page.");
    }
    records.push(...(data as Record<string, unknown>[]));
    if (records.length === count) return records;
    if (records.length > count) throw new Error("A content table changed while it was being exported.");
  }
}

async function readAllContent(supabase: AdminSupabase): Promise<PortableContent> {
  const result = {} as PortableContent;
  for (const table of PORTABLE_BACKUP_TABLES) {
    result[table] = await readTable(supabase, table);
  }
  return result;
}

async function listStoragePaths(supabase: AdminSupabase, bucket: PortableBucket) {
  const storage = supabase.storage.from(bucket);
  const folders = [""];
  const visited = new Set<string>();
  const files: { path: string; size?: number }[] = [];

  while (folders.length > 0) {
    const folder = folders.shift()!;
    if (visited.has(folder)) throw new Error("A Storage folder was listed twice.");
    visited.add(folder);
    if (visited.size > MAX_PORTABLE_FILES) throw new Error("Too many Storage folders for a portable export.");

    let offset = 0;
    while (true) {
      const { data, error } = await storage.list(folder, {
        limit: STORAGE_PAGE_SIZE,
        offset,
        sortBy: { column: "name", order: "asc" },
      });
      if (error || !data) throw new Error("Storage files could not be listed.");
      for (const item of data) {
        const path = safePortablePath(folder ? folder + "/" + item.name : item.name);
        if (item.id === null) {
          if (!visited.has(path)) folders.push(path);
          if (folders.length + visited.size > MAX_PORTABLE_FILES) {
            throw new Error("Storage has too many folders for the portable backup.");
          }
        } else {
          const size = Number(item.metadata?.size);
          files.push({ path, size: Number.isFinite(size) && size >= 0 ? size : undefined });
          validateMediaBudget(files.length, 0);
        }
      }
      offset += data.length;
      if (data.length < STORAGE_PAGE_SIZE) break;
    }
  }
  return files;
}

async function readStorage(supabase: AdminSupabase): Promise<PortableMedia[]> {
  const media: PortableMedia[] = [];
  let totalBytes = 0;

  for (const bucket of PORTABLE_MEDIA_BUCKETS) {
    const storage = supabase.storage.from(bucket);
    const files = await listStoragePaths(supabase, bucket);
    if (media.length + files.length > MAX_PORTABLE_FILES) {
      throw new Error("Media exceeds the portable backup file count limit.");
    }
    for (const entry of files) {
      if (entry.size !== undefined) validateMediaBudget(media.length + 1, totalBytes + entry.size);
      const { data, error } = await storage.download(entry.path);
      if (error || !data) throw new Error("A Storage object could not be downloaded. No backup was delivered.");
      if (entry.size !== undefined && entry.size !== data.size) {
        throw new Error("A Storage object changed during export. No backup was delivered.");
      }
      const encoded = await encodePortableMedia(bucket, entry.path, data);
      totalBytes += encoded.size_bytes;
      validateMediaBudget(media.length + 1, totalBytes);
      media.push(encoded);
    }
  }
  return media;
}

function jsonDownload(body: unknown, dateKey: string) {
  // Stream a complete validated document to avoid small serverless response-body limits.
  const bytes = new TextEncoder().encode(JSON.stringify(body));
  let offset = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (offset >= bytes.length) {
        controller.close();
        return;
      }
      controller.enqueue(bytes.subarray(offset, Math.min(bytes.length, offset + 64 * 1024)));
      offset += 64 * 1024;
    },
  });
  return new Response(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": 'attachment; filename="yaqoob-website-offline-backup-' + dateKey + '.json"',
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}

export async function GET() {
  // Verify the live session and admin RLS identity on every download request.
  const { supabase } = await requireAdmin();

  try {
    const content = await readAllContent(supabase);
    const media = await readStorage(supabase);
    const now = new Date().toISOString();
    const payload = assemblePortableBackup(content, media, now);
    return jsonDownload(payload, now.slice(0, 10));
  } catch (error) {
    console.error("Admin portable backup failed", error);
    return new Response("Offline backup could not be completed. No file was exported. Review Storage limits and retry.", {
      status: 503,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "private, no-store, max-age=0",
        "X-Content-Type-Options": "nosniff",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });
  }
}
