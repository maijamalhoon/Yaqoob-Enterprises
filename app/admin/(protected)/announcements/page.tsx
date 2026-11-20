import { Megaphone, Plus } from "lucide-react";
import { AdminActionForm } from "@/components/admin-action-form";
import { AdminCancelButton, AdminDeleteButton, AdminSubmitButton } from "@/components/admin-form-buttons";
import { requireAdmin } from "@/lib/admin";
import { currentServerTimeMs } from "@/lib/server-clock";
import {
  createAnnouncementWithFeedback,
  deleteAnnouncementWithFeedback,
  updateAnnouncementWithFeedback,
} from "./actions";

function noticeStatus(announcement: {
  is_active: boolean;
  starts_at: string | null;
  ends_at: string | null;
}, now: number) {
  if (!announcement.is_active) return { label: "Hidden", live: false };
  if (announcement.starts_at && Date.parse(announcement.starts_at) > now) {
    return { label: "Scheduled", live: false };
  }
  if (announcement.ends_at && Date.parse(announcement.ends_at) <= now) {
    return { label: "Expired", live: false };
  }
  return { label: "Live", live: true };
}

export default async function AdminAnnouncementsPage() {
  const { supabase } = await requireAdmin();
  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("id,title,message,link_label,link_url,is_active,display_order,created_at,starts_at,ends_at")
    .order("display_order")
    .order("created_at", { ascending: false });
  if (error) throw new Error("Announcements could not be loaded. Please retry.");

  const announcementList = announcements || [];
  const now = await currentServerTimeMs();
  const liveCount = announcementList.filter((announcement) => noticeStatus(announcement, now).live).length;

  return (
    <div className="admin-content admin-control-page admin-announcements">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Website content</span>
          <h1>Announcements</h1>
          <p>Create, edit, publish or hide customer notices without deleting them.</p>
        </div>
        <div className="admin-heading-metrics" aria-label="Announcement summary">
          <span><strong>{liveCount}</strong> live</span>
          <span><strong>{announcementList.length}</strong> total notices</span>
        </div>
      </div>

      <details className="admin-panel admin-create-panel admin-announcement-create">
        <summary><span><Plus size={17} aria-hidden="true" /> New announcement</span></summary>
        <AdminActionForm className="admin-form-grid admin-form-grid--focused" action={createAnnouncementWithFeedback} resetOnSuccess>
          <label className="admin-span-2">
            Title
            <input name="title" minLength={3} maxLength={120} required placeholder="e.g. Friday timings updated" />
          </label>
          <label className="admin-span-2">
            Message
            <textarea name="message" minLength={5} maxLength={2000} rows={3} required placeholder="What should customers know?" />
          </label>
          <label>
            Link label <small>optional</small>
            <input name="link_label" maxLength={100} placeholder="View rates" />
          </label>
          <label>
            Link URL <small>optional — HTTPS or /rates</small>
            <input name="link_url" type="text" inputMode="url" maxLength={1000} placeholder="https://example.com or /rates" />
          </label>
          <label>
            Display order
            <input type="number" name="display_order" min="0" max="10000" step="1" defaultValue={announcementList.length} required />
          </label>
          <label className="checkbox-line">
            <input type="checkbox" name="is_active" defaultChecked /> Publish now
          </label>
          <div className="admin-form-actions admin-span-2">
            <AdminSubmitButton pendingLabel="Creating notice…"><Megaphone size={16} aria-hidden="true" /> Save announcement</AdminSubmitButton>
            <AdminCancelButton />
          </div>
        </AdminActionForm>
      </details>

      <section className="admin-panel admin-panel--control" aria-labelledby="announcement-list-title">
        <div className="admin-panel__heading">
          <div>
            <span className="admin-panel-kicker"><Megaphone size={15} aria-hidden="true" /> All notices</span>
            <h2 id="announcement-list-title">Manage announcements</h2>
            <p>Use Edit to update wording or visibility. Delete only when a notice is no longer needed.</p>
          </div>
        </div>
        <div className="admin-announcement-list">
          {announcementList.map((announcement) => {
            const status = noticeStatus(announcement, now);
            return (
              <article className="admin-announcement-row" key={announcement.id}>
                <div className="admin-announcement-row__copy">
                  <div className="admin-announcement-row__heading">
                    <h3>{announcement.title}</h3>
                    <span className={"admin-state " + (status.live ? "is-live" : "is-hidden")}>{status.label}</span>
                  </div>
                  <p>{announcement.message}</p>
                  {announcement.link_url && (
                    <small>
                      {announcement.link_label || "Link"}: <code>{announcement.link_url}</code>
                    </small>
                  )}
                  <small>Display order {announcement.display_order}</small>
                  <details className="admin-inline-editor admin-announcement-editor">
                    <summary>Edit announcement</summary>
                    <AdminActionForm className="admin-form-grid admin-form-grid--focused" action={updateAnnouncementWithFeedback}>
                      <input type="hidden" name="id" value={announcement.id} />
                      <label className="admin-span-2">
                        Title
                        <input name="title" minLength={3} maxLength={120} defaultValue={announcement.title} required />
                      </label>
                      <label className="admin-span-2">
                        Message
                        <textarea name="message" minLength={5} maxLength={2000} rows={3} defaultValue={announcement.message} required />
                      </label>
                      <label>
                        Link label
                        <input name="link_label" maxLength={100} defaultValue={announcement.link_label || ""} />
                      </label>
                      <label>
                        Link URL
                        <input name="link_url" type="text" inputMode="url" maxLength={1000} defaultValue={announcement.link_url || ""} placeholder="https://example.com or /rates" />
                      </label>
                      <label>
                        Display order
                        <input type="number" name="display_order" min="0" max="10000" step="1" defaultValue={announcement.display_order} required />
                      </label>
                      <label className="checkbox-line">
                        <input type="checkbox" name="is_active" defaultChecked={announcement.is_active} /> Visible on website
                      </label>
                      <div className="admin-form-actions admin-span-2">
                        <AdminSubmitButton>Save changes</AdminSubmitButton>
                        <AdminCancelButton />
                      </div>
                    </AdminActionForm>
                  </details>
                </div>
                <AdminActionForm className="admin-announcement-row__action" action={deleteAnnouncementWithFeedback}>
                  <input type="hidden" name="id" value={announcement.id} />
                  <AdminDeleteButton
                    label="Delete"
                    confirmMessage={"Delete the announcement “" + announcement.title + "”? This removes it from the website and the announcement list."}
                  />
                </AdminActionForm>
              </article>
            );
          })}
          {announcementList.length === 0 && (
            <div className="admin-empty-state admin-empty-state--compact">
              <Megaphone size={21} aria-hidden="true" />
              <p>No announcements yet. Create one above.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
