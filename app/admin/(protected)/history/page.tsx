import { DatabaseBackup, History, RotateCcw, ShieldCheck } from "lucide-react";
import { AdminDeleteButton, AdminSubmitButton } from "@/components/admin-form-buttons";
import { requireAdmin } from "@/lib/admin";
import { createAdminSnapshot, deleteAdminSnapshot, restoreAdminSnapshot, rollbackAuditEntry } from "./actions";

const tableLabels: Record<string, string> = {
  business_settings: "Business details",
  business_hours: "Opening hours",
  service_categories: "Service category",
  services: "Service",
  gallery_images: "Homepage image",
  coverage_areas: "Coverage area",
};

const fieldLabels: Record<string, string> = {
  business_name: "business name",
  tagline: "tagline",
  phone_display: "phone",
  phone_e164: "phone",
  whatsapp_e164: "WhatsApp",
  address: "address",
  map_url: "map link",
  google_business_profile_url: "Google Business profile",
  title: "title",
  description: "description",
  short_description: "short description",
  detailed_description: "details",
  status: "status",
  requirements: "requirements",
  important_note: "important note",
  available_at_shop: "shop availability",
  pickup_available: "pickup",
  delivery_available: "delivery",
  doorstep_available: "home visit",
  appointment_required: "appointment",
  display_order: "order",
  is_active: "visibility",
  is_featured: "featured image",
  focal_x: "image focus",
  focal_y: "image focus",
  alt_text: "image description",
  periods: "hours",
  opens_at: "opening time",
  closes_at: "closing time",
  is_closed: "closed status",
  name: "area name",
  notes: "notes",
  icon_key: "icon",
};

const ignoredFields = new Set(["id", "created_at", "updated_at"]);

function changedFields(oldData: Record<string, unknown> | null, newData: Record<string, unknown> | null) {
  if (!oldData || !newData) return [];
  return Object.keys({ ...oldData, ...newData })
    .filter((key) => !ignoredFields.has(key))
    .filter((key) => JSON.stringify(oldData[key]) !== JSON.stringify(newData[key]));
}

function operationLabel(operation: string) {
  if (operation === "INSERT") return "Created";
  if (operation === "DELETE") return "Deleted";
  return "Updated";
}

function formatChangedFields(fields: string[]) {
  if (fields.length === 0) return "record";
  const labels = [...new Set(fields.map((field) => fieldLabels[field] || field.replaceAll("_", " ")))];
  return labels.slice(0, 4).join(", ") + (labels.length > 4 ? ` +${labels.length - 4}` : "");
}

export default async function AdminHistoryPage() {
  const { supabase } = await requireAdmin();
  const [{ data: history }, { data: snapshots }] = await Promise.all([
    supabase
      .from("admin_audit_log")
      .select("id,table_name,record_id,record_label,operation,actor_email,old_data,new_data,created_at,reverted_at")
      .order("created_at", { ascending: false })
      .limit(80),
    supabase
      .from("admin_snapshots")
      .select("id,label,created_at,created_by")
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const historyRows = history || [];
  const backupRows = snapshots || [];
  const liveChanges = historyRows.filter((entry) => !entry.reverted_at).length;

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Safety</span>
          <h1>History & backups</h1>
          <p>See important admin changes, undo the latest safe change, or restore a full website backup.</p>
        </div>
        <div className="admin-heading-metrics">
          <span><strong>{liveChanges}</strong> recent changes</span>
          <span><strong>{backupRows.length}</strong> backups</span>
        </div>
      </div>

      <section className="admin-panel admin-panel--control admin-backup-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><DatabaseBackup size={15} /> Backups</span><h2>Website snapshot</h2><p>Business details, hours, services, images and coverage.</p></div>
          <ShieldCheck size={20} aria-hidden="true" />
        </div>

        <form className="admin-backup-create" action={createAdminSnapshot}>
          <label>Backup name<input name="label" maxLength={100} placeholder="Before major changes" /></label>
          <AdminSubmitButton pendingLabel="Creating…">Create backup</AdminSubmitButton>
        </form>

        <div className="admin-backup-list">
          {backupRows.map((backup) => (
            <article className="admin-backup-row" key={backup.id}>
              <div><strong>{backup.label}</strong><small>{new Date(backup.created_at).toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</small></div>
              <div className="admin-backup-actions">
                <form action={restoreAdminSnapshot}>
                  <input type="hidden" name="id" value={backup.id} />
                  <AdminSubmitButton
                    variant="secondary"
                    pendingLabel="Restoring…"
                    confirmMessage="Restore this backup? A safety backup of the current website will be created first."
                  >
                    <RotateCcw size={15} /> Restore
                  </AdminSubmitButton>
                </form>
                <form action={deleteAdminSnapshot}>
                  <input type="hidden" name="id" value={backup.id} />
                  <AdminDeleteButton label="Delete" confirmMessage={`Delete backup “${backup.label}”?`} />
                </form>
              </div>
            </article>
          ))}
          {backupRows.length === 0 && <div className="admin-empty-state admin-empty-state--compact"><DatabaseBackup size={21} /><p>No backups yet.</p></div>}
        </div>
      </section>

      <section className="admin-panel admin-panel--control admin-history-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><History size={15} /> Audit trail</span><h2>Recent admin changes</h2><p>Newest changes appear first. Undo is blocked if a newer change would be overwritten.</p></div>
        </div>

        <div className="admin-history-list">
          {historyRows.map((entry) => {
            const fields = changedFields(
              entry.old_data as Record<string, unknown> | null,
              entry.new_data as Record<string, unknown> | null,
            );
            const reverted = Boolean(entry.reverted_at);
            const label = entry.record_label || entry.record_id;
            return (
              <article className={`admin-history-row ${reverted ? "is-reverted" : ""}`} key={entry.id}>
                <span className="admin-history-row__icon"><History size={16} /></span>
                <div className="admin-history-row__copy">
                  <strong>{operationLabel(entry.operation)} {label}</strong>
                  <small>{tableLabels[entry.table_name] || entry.table_name} · {entry.operation === "UPDATE" ? formatChangedFields(fields) : "record"}</small>
                </div>
                <div className="admin-history-row__meta">
                  <span>{new Date(entry.created_at).toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</span>
                  <small>{entry.actor_email || "System"}</small>
                </div>
                <div className="admin-history-row__action">
                  {reverted ? (
                    <span className="admin-state is-hidden">Undone</span>
                  ) : (
                    <form action={rollbackAuditEntry}>
                      <input type="hidden" name="id" value={entry.id} />
                      <AdminSubmitButton
                        variant="secondary"
                        pendingLabel="Undoing…"
                        confirmMessage={`Undo this ${entry.operation.toLowerCase()} change to “${label}”?`}
                      >
                        <RotateCcw size={14} /> Undo
                      </AdminSubmitButton>
                    </form>
                  )}
                </div>
              </article>
            );
          })}
          {historyRows.length === 0 && <div className="admin-empty-state admin-empty-state--compact"><History size={21} /><p>No admin changes recorded yet.</p></div>}
        </div>
      </section>
    </div>
  );
}
