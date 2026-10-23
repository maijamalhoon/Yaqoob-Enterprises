import { Megaphone, Plus } from "lucide-react";
import { AdminCancelButton, AdminDeleteButton, AdminSubmitButton } from "@/components/admin-form-buttons";
import { requireAdmin } from "@/lib/admin";
import { createAnnouncement, deleteAnnouncement } from "../actions";

export default async function AdminAnnouncementsPage() {
  const { supabase } = await requireAdmin();
  const { data: announcements, error } = await supabase
    .from("announcements")
    .select("id,title,message,link_label,link_url,is_active,display_order,created_at")
    .order("display_order")
    .order("created_at", { ascending: false });
  const announcementList = announcements || [];

  return (
    <div className="admin-content admin-control-page admin-announcements">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Website content</span>
          <h1>Announcements</h1>
          <p>Create and remove notices shown to customers on the public website.</p>
        </div>
        <div className="admin-heading-metrics" aria-label="Announcement count">
          <span><strong>{error ? "—" : announcementList.length}</strong> {announcementList.length === 1 ? "announcement" : "announcements"}</span>
        </div>
      </div>

      <section className="admin-panel admin-panel--control" aria-labelledby="announcement-create-title">
        <div className="admin-panel__heading">
          <div>
            <span className="admin-panel-kicker"><Plus size={15} aria-hidden="true" /> New notice</span>
            <h2 id="announcement-create-title">Create an announcement</h2>
            <p>Keep the message clear and short. Link details are optional.</p>
          </div>
        </div>
        <form className="admin-form-grid admin-form-grid--focused" action={createAnnouncement}>
          <label className="admin-span-2">
            Title
            <input name="title" required />
          </label>
          <label className="admin-span-2">
            Message
            <textarea name="message" rows={3} required />
          </label>
          <label>
            Link label
            <input name="link_label" />
          </label>
          <label>
            Link URL
            <input name="link_url" type="url" />
          </label>
          <div className="admin-form-actions admin-span-2">
            <AdminSubmitButton><Megaphone size={16} aria-hidden="true" /> Publish announcement</AdminSubmitButton>
            <AdminCancelButton />
          </div>
        </form>
      </section>

      <section className="admin-panel admin-panel--control" aria-labelledby="announcement-list-title">
        <div className="admin-panel__heading">
          <div>
            <span className="admin-panel-kicker"><Megaphone size={15} aria-hidden="true" /> Current notices</span>
            <h2 id="announcement-list-title">All announcements</h2>
          </div>
        </div>
        <div className="admin-announcement-list">
          {error ? <p className="admin-error" role="alert">Announcements could not be loaded. Please try again later.</p> : announcementList.map((announcement) => (
            <article className="admin-announcement-row" key={announcement.id}>
              <div className="admin-announcement-row__copy">
                <div className="admin-announcement-row__heading">
                  <h3>{announcement.title}</h3>
                  <span className={"admin-state " + (announcement.is_active ? "is-live" : "is-hidden")}>
                    {announcement.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
                <p>{announcement.message}</p>
                {announcement.link_url && (
                  <small>
                    {announcement.link_label || "Link"}: <code>{announcement.link_url}</code>
                  </small>
                )}
              </div>
              <form className="admin-announcement-row__action" action={deleteAnnouncement}>
                <input type="hidden" name="id" value={announcement.id} />
                <AdminDeleteButton
                  label="Delete"
                  confirmMessage={"Delete the announcement “" + announcement.title + "”? This cannot be undone."}
                />
              </form>
            </article>
          ))}
          {!error && announcementList.length === 0 && (
            <div className="admin-empty-state admin-empty-state--compact">
              <Megaphone size={21} aria-hidden="true" />
              <p>No announcements yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
