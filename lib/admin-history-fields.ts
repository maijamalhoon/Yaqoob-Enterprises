export const BACKUP_TABLES = [
  "business_settings",
  "business_hours",
  "service_categories",
  "services",
  "gallery_images",
  "coverage_areas",
] as const;

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function parseBackupId(value: FormDataEntryValue | null): string {
  const id = typeof value === "string" ? value.trim() : "";
  if (!UUID_PATTERN.test(id)) throw new Error("Backup reference is invalid. Refresh the page.");
  return id;
}

export function parseAuditId(value: FormDataEntryValue | null): number {
  const raw = typeof value === "string" ? value.trim() : "";
  if (!/^[1-9]\d*$/.test(raw)) throw new Error("History entry is invalid. Refresh the page.");
  const id = Number(raw);
  if (!Number.isSafeInteger(id)) throw new Error("History entry is invalid. Refresh the page.");
  return id;
}

export function parseBackupLabel(value: FormDataEntryValue | null, fallback: string): string {
  const name = typeof value === "string" ? value.trim() : "";
  if (name.length > 100) throw new Error("Backup name must be 100 characters or fewer.");
  return name || fallback;
}

export function completeBackupRows<T>(
  result: { data: T[] | null; count: number | null; error: { message: string } | null },
  name: string,
): T[] {
  // Supabase projects may cap rows per REST response. Never save a partial export.
  if (result.error || !Array.isArray(result.data) || result.count === null || result.data.length !== result.count) {
    throw new Error("Backup could not confirm all " + name.replaceAll("_", " ") + " records. No backup was created.");
  }
  return result.data;
}

export function assertRestorableBackup(value: unknown): void {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("This backup format is invalid. Nothing was restored.");
  }
  const payload = value as Record<string, unknown>;
  if (payload.version !== 1 || BACKUP_TABLES.some((table) => !Array.isArray(payload[table]))) {
    throw new Error("This backup version is unsupported or incomplete. Nothing was restored.");
  }
  if ((payload.business_settings as unknown[]).length !== 1) {
    throw new Error("This backup is missing the business settings record. Nothing was restored.");
  }
}


// The private rollback RPC supports only the six CMS tables.
// Other audit entries (e.g. account authorization changes) remain visible,
// but must never offer a button that will always fail.
export function canUndoAdminAudit(table: string, operation: string): boolean {
  return (BACKUP_TABLES as readonly string[]).includes(table)
    && (operation === "INSERT" || operation === "UPDATE" || operation === "DELETE");
}
