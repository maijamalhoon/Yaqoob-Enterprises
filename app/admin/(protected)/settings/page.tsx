import { ExternalLink, Megaphone, Plus, Trash2 } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { formatBusinessHours, getHourPeriods } from "@/lib/data";
import { createAnnouncement, deleteAnnouncement } from "../actions";
import { updateBusinessHour, updateBusinessSettings } from "./actions";

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();
  const [{ data: settings }, { data: hours }, { data: announcements }] = await Promise.all([
    supabase.from("business_settings").select("*").eq("id", true).single(),
    supabase.from("business_hours").select("*").order("display_order"),
    supabase.from("announcements").select("*").order("display_order"),
  ]);

  return (
    <div className="admin-content">
      <div className="admin-page-heading"><div><span className="eyebrow">Configuration</span><h1>Business settings</h1><p>Update public contact details, opening hours, pricing wording and temporary notices.</p></div></div>
      <section className="admin-panel">
        <h2>Business information</h2>
        <form className="admin-form-grid" action={updateBusinessSettings}>
          <label>Business name<input name="business_name" defaultValue={settings?.business_name} required /></label>
          <label>Tagline<input name="tagline" defaultValue={settings?.tagline} /></label>
          <label>Phone number<input name="phone_number" defaultValue={settings?.phone_e164} placeholder="+923492568864" required /></label>
          <label>WhatsApp number<input name="whatsapp_number" defaultValue={settings?.whatsapp_e164} placeholder="+923492568864" required /></label>
          <label className="admin-span-2">Google Maps URL<input name="map_url" type="url" defaultValue={settings?.map_url} required /></label>
          {settings?.map_url && <a className="back-link admin-span-2" href={settings.map_url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> Preview saved location</a>}
          <label className="admin-span-2">Address<textarea name="address" defaultValue={settings?.address} required /></label>
          <label className="admin-span-2">Pricing message<textarea name="pricing_message" defaultValue={settings?.pricing_message} /></label>
          <label className="admin-span-2">Concept-image notice<textarea name="concept_image_notice" defaultValue={settings?.concept_image_notice} /></label>
          <button className="button button--primary" type="submit">Save business information</button>
        </form>
      </section>
      <section className="admin-panel">
        <div className="admin-panel__heading"><div><h2>Opening hours</h2><p>Each day can have one regular interval or a second interval for a break and reopening.</p></div></div>
        <div className="admin-card-list">
          {hours?.map((hour) => {
            const periods = getHourPeriods(hour);
            return (
              <details className="admin-edit-card" key={hour.id} open={hour.weekday === 5 || hour.weekday === 0}>
                <summary><span><strong>{hour.label}</strong><small>{formatBusinessHours(hour)}</small></span><span>Edit</span></summary>
                <form className="admin-form-grid" action={updateBusinessHour}>
                  <input type="hidden" name="id" value={hour.id} />
                  <label>First opening<input type="time" name="first_opens_at" defaultValue={periods[0]?.opens_at} /></label>
                  <label>First closing<input type="time" name="first_closes_at" defaultValue={periods[0]?.closes_at} /></label>
                  <label>Second opening (optional)<input type="time" name="second_opens_at" defaultValue={periods[1]?.opens_at} /></label>
                  <label>Second closing (optional)<input type="time" name="second_closes_at" defaultValue={periods[1]?.closes_at} /></label>
                  <label className="checkbox-line admin-span-2"><input type="checkbox" name="is_closed" defaultChecked={hour.is_closed} /> Closed for the full day</label>
                  <button className="button button--secondary" type="submit">Save {hour.label}</button>
                </form>
              </details>
            );
          })}
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
