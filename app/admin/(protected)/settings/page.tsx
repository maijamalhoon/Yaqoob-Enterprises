import { Megaphone, Plus, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { createAnnouncement, deleteAnnouncement, updateHour, updateSettings } from "../actions";

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();
  const [{ data: settings }, { data: hours }, { data: announcements }] = await Promise.all([
    supabase.from("business_settings").select("*").eq("id", true).single(),
    supabase.from("business_hours").select("*").order("display_order"),
    supabase.from("announcements").select("*").order("display_order"),
  ]);

  return (
    <div className="admin-content">
      <div className="admin-page-heading"><div><span className="eyebrow">Configuration</span><h1>Business settings</h1><p>Update the public contact details, hours, pricing wording and temporary notices.</p></div></div>
      <section className="admin-panel">
        <h2>Business information</h2>
        <form className="admin-form-grid" action={updateSettings}>
          <label>Business name<input name="business_name" defaultValue={settings?.business_name} required /></label>
          <label>Tagline<input name="tagline" defaultValue={settings?.tagline} /></label>
          <label>Phone display<input name="phone_display" defaultValue={settings?.phone_display} /></label>
          <label>Phone E.164<input name="phone_e164" defaultValue={settings?.phone_e164} /></label>
          <label>WhatsApp E.164<input name="whatsapp_e164" defaultValue={settings?.whatsapp_e164} /></label>
          <label>Google Maps URL<input name="map_url" defaultValue={settings?.map_url} /></label>
          <label className="admin-span-2">Address<textarea name="address" defaultValue={settings?.address} /></label>
          <label className="admin-span-2">Pricing message<textarea name="pricing_message" defaultValue={settings?.pricing_message} /></label>
          <label className="admin-span-2">Concept-image notice<textarea name="concept_image_notice" defaultValue={settings?.concept_image_notice} /></label>
          <button className="button button--primary" type="submit">Save settings</button>
        </form>
      </section>
      <section className="admin-panel">
        <h2>Opening hours</h2>
        <div className="hours-admin-list">
          {hours?.map((hour) => <form action={updateHour} key={hour.id}><input type="hidden" name="id" value={hour.id} /><strong>{hour.label}</strong><label>Open<input type="time" name="opens_at" defaultValue={hour.opens_at?.slice(0, 5)} /></label><label>Close<input type="time" name="closes_at" defaultValue={hour.closes_at?.slice(0, 5)} /></label><label className="checkbox-line"><input type="checkbox" name="is_closed" defaultChecked={hour.is_closed} /> Closed</label><button className="button button--secondary" type="submit">Save</button></form>)}
        </div>
      </section>
      <section className="admin-panel">
        <div className="admin-panel__heading"><div><h2>Announcements</h2><p>Show temporary opening, system or service notices above the website header.</p></div><Megaphone /></div>
        <form className="admin-form-grid" action={createAnnouncement}>
          <label>Title<input name="title" required /></label>
          <label>Link label<input name="link_label" /></label>
          <label className="admin-span-2">Message<textarea name="message" required /></label>
          <label className="admin-span-2">Optional link URL<input name="link_url" /></label>
          <button className="button button--primary" type="submit"><Plus size={17} /> Add announcement</button>
        </form>
        <div className="admin-card-list">
          {announcements?.map((announcement) => <article className="announcement-admin-card" key={announcement.id}><div><strong>{announcement.title}</strong><p>{announcement.message}</p></div><form action={deleteAnnouncement}><input type="hidden" name="id" value={announcement.id} /><button className="danger-button" type="submit"><Trash2 size={16} /> Delete</button></form></article>)}
        </div>
      </section>
    </div>
  );
}
