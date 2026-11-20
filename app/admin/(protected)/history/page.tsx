import { DatabaseBackup, Download, History, RotateCcw, ShieldCheck } from "lucide-react";
import { AdminActionForm } from "@/components/admin-action-form";
import { AdminCancelButton, AdminDeleteButton, AdminSubmitButton } from "@/components/admin-form-buttons";
import { requireAdmin } from "@/lib/admin";
import { canUndoAdminAudit } from "@/lib/admin-history-fields";
import { createSnapshotWithFeedback, deleteSnapshotWithFeedback, restoreSnapshotWithFeedback, rollbackEntryWithFeedback } from "./actions";

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
  const [{ data: history, error: historyError }, { data: snapshots, error: snapshotsError }] = await Promise.all([
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

  if (historyError || snapshotsError) throw new Error("History and backups could not be loaded. Please retry.");

  const historyRows = history || [];
  const backupRows = snapshots || [];
  const liveChanges = historyRows.filter((entry) => !entry.reverted_at).length;

  const renderHistoryRow = (entry: (typeof historyRows)[number]) => {
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
          ) : !canUndoAdminAudit(entry.table_name, entry.operation) ? (
            <span className="admin-state is-hidden" title="This record is read-only in the history tool.">View only</span>
          ) : (
            <AdminActionForm action={rollbackEntryWithFeedback}>
              <input type="hidden" name="id" value={entry.id} />
              <AdminSubmitButton
                variant="secondary"
                pendingLabel="Undoing…"
                confirmMessage={`Undo this ${entry.operation.toLowerCase()} change to “${label}”?`}
              >
                <RotateCcw size={14} /> Undo
              </AdminSubmitButton>
            </AdminActionForm>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Safety</span>
          <h1>History & backups</h1>
          <p>See tracked website changes, undo safe edits, or restore a saved content snapshot.</p>
        </div>
        <div className="admin-heading-metrics">
          <span><strong>{liveChanges}</strong> recent changes</span>
          <span><strong>{backupRows.length}</strong> backups</span>
        </div>
      </div>

      <section className="admin-panel admin-panel--control admin-offline-backup-panel" aria-labelledby="admin-offline-backup-title">
        <div className="admin-panel__heading">
          <div>
            <span className="admin-panel-kicker"><Download size={15} aria-hidden="true" /> Offline protection</span>
            <h2 id="admin-offline-backup-title">Offline backup</h2>
            <p>Keep an independent copy outside the website.</p>
          </div>
          <ShieldCheck size={20} aria-hidden="true" />
        </div>
        <div className="admin-offline-backup-panel__body">
          <div>
            <p>Content + original images · keep a copy off-site.</p>
            <details className="admin-backup-details">
              <summary>What is included?</summary>
              <p>Includes current website content, announcements, section settings, and both media buckets, including retained gallery images. Private JSON recovery file; manual restore only. Accounts, analytics, audit history and previous snapshots are excluded. Limit: 120 files / 32 MB raw media.</p>
            </details>
          </div>
          <a className="button button--primary admin-offline-backup-download" href="/admin/history/export" rel="nofollow">
            <Download size={17} aria-hidden="true" /> Download offline backup
          </a>
        </div>
      </section>

      <section className="admin-panel admin-panel--control admin-backup-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><DatabaseBackup size={15} /> Backups</span><h2>Content snapshots</h2><p>Settings, hours, categories, services, gallery details and coverage.</p></div>
          <ShieldCheck size={20} aria-hidden="true" />
        </div>

        <details className="admin-backup-scope"><summary>Snapshot scope · 6 content tables</summary><p>In-app snapshots exclude announcements, section settings and original image files. Download a separate offline backup for complete manual recovery.</p></details>

        <AdminActionForm className="admin-backup-create" action={createSnapshotWithFeedback}>
          <label>Backup name<input name="label" maxLength={100} placeholder="Before major changes" /></label>
          <div className="admin-form-actions"><AdminSubmitButton pendingLabel="Creating…">Create backup</AdminSubmitButton><AdminCancelButton /></div>
        </AdminActionForm>

        <div className="admin-backup-list">
          {backupRows.map((backup) => (
            <article className="admin-backup-row" key={backup.id}>
              <div><strong>{backup.label}</strong><small>{new Date(backup.created_at).toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</small></div>
              <div className="admin-backup-actions">
                <AdminActionForm action={restoreSnapshotWithFeedback}>
                  <input type="hidden" name="id" value={backup.id} />
                  <AdminSubmitButton
                    variant="secondary"
                    pendingLabel="Restoring…"
                    confirmMessage="Restore these saved database records? Current settings, hours, categories, services, gallery details and coverage will be replaced. Announcements and image files are NOT part of this snapshot. A safety backup will be saved first."
                  >
                    <RotateCcw size={15} /> Restore
                  </AdminSubmitButton>
                </AdminActionForm>
                <AdminActionForm action={deleteSnapshotWithFeedback}>
                  <input type="hidden" name="id" value={backup.id} />
                  <AdminDeleteButton label="Delete" confirmMessage={`Permanently delete backup “${backup.label}”? This cannot be undone.`} />
                </AdminActionForm>
              </div>
            </article>
          ))}
          {backupRows.length === 0 && <div className="admin-empty-state admin-empty-state--compact"><DatabaseBackup size={21} /><p>No backups yet.</p></div>}
        </div>
      </section>

      <section className="admin-panel admin-panel--control admin-history-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><History size={15} /> Audit trail</span><h2>Recent admin changes</h2><p>Newest tracked changes appear first. Undo is blocked if a newer edit would be overwritten. Announcements are not included in this audit trail.</p></div>
        </div>

        <div className="admin-history-list">
          {historyRows.slice(0, 8).map(renderHistoryRow)}
          {historyRows.length === 0 && <div className="admin-empty-state admin-empty-state--compact"><History size={21} /><p>No admin changes recorded yet.</p></div>}
        </div>
        {historyRows.length > 8 && (
          <details className="admin-history-more">
            <summary>Show {historyRows.length - 8} older changes</summary>
            <div className="admin-history-list">
              {historyRows.slice(8).map(renderHistoryRow)}
            </div>
          </details>
        )}
      </section>
    </div>
  );
}
