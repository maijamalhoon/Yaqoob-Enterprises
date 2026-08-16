import Link from "next/link";
import { Clock3, ExternalLink, ImageIcon, MapPin, Phone, Store, Type } from "lucide-react";
import { AdminSubmitButton } from "@/components/admin-form-buttons";
import { requireAdmin } from "@/lib/admin";
import { businessLocationLabel } from "@/lib/business-display";
import { formatBusinessHours, getHourPeriods } from "@/lib/data";
import { assertQuerySucceeded } from "@/lib/supabase/query-error";
import { updateBusinessHour, updateBusinessIdentity, updateContactDetails } from "./actions";

export default async function AdminSettingsPage() {
  const { supabase } = await requireAdmin();
  const [settingsResult, hoursResult] = await Promise.all([
    supabase.from("business_settings").select("*").eq("id", true).single(),
    supabase.from("business_hours").select("*").order("display_order"),
  ]);
  assertQuerySucceeded(settingsResult.error, "business settings");
  assertQuerySucceeded(hoursResult.error, "business hours");
  const settings = settingsResult.data;
  const hours = hoursResult.data;
  const location = businessLocationLabel(settings?.address || "");

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Website settings</span>
          <h1>Public details</h1>
          <p>Business identity, contact details, location and opening hours.</p>
        </div>
        <Link className="button button--secondary admin-heading-action" href="/admin/gallery"><ImageIcon size={16} /> Homepage image</Link>
      </div>

      <div className="admin-control-grid admin-control-grid--settings">
        <section className="admin-panel admin-panel--control">
          <div className="admin-panel__heading admin-panel__heading--compact">
            <div><span className="admin-panel-kicker"><Type size={15} /> Identity</span><h2>Business name</h2></div>
          </div>
          <form className="admin-form-grid admin-form-grid--focused" action={updateBusinessIdentity}>
            <label>Business name<input name="business_name" defaultValue={settings?.business_name} maxLength={80} required /></label>
            <label>Tagline<input name="tagline" defaultValue={settings?.tagline} maxLength={120} /></label>
            <div className="admin-form-actions admin-span-2"><AdminSubmitButton>Save identity</AdminSubmitButton></div>
          </form>
        </section>

        <section className="admin-panel admin-panel--control">
          <div className="admin-panel__heading admin-panel__heading--compact">
            <div><span className="admin-panel-kicker"><Phone size={15} /> Contact</span><h2>Phone & location</h2></div>
          </div>
          <form className="admin-form-grid admin-form-grid--focused" action={updateContactDetails}>
            <label>Phone<input name="phone_number" inputMode="tel" defaultValue={settings?.phone_e164} placeholder="+923492568864" required /></label>
            <label>WhatsApp<input name="whatsapp_number" inputMode="tel" defaultValue={settings?.whatsapp_e164} placeholder="+923492568864" required /></label>
            <label className="admin-span-2">Address<textarea name="address" defaultValue={settings?.address} rows={3} maxLength={500} required /></label>
            <label className="admin-span-2">Google Maps URL<input name="map_url" type="url" maxLength={2048} defaultValue={settings?.map_url} required /></label>
            <label className="admin-span-2">Google Business Profile <small>Used for admin analysis</small><input name="google_business_profile_url" type="url" maxLength={2048} defaultValue={settings?.google_business_profile_url || ""} placeholder="https://share.google/..." /></label>
            <div className="admin-form-actions admin-form-actions--split admin-span-2">
              <AdminSubmitButton>Save contact & location</AdminSubmitButton>
              <div className="admin-settings-preview-links">
                {settings?.map_url && <a className="admin-inline-link" href={settings.map_url} target="_blank" rel="noopener noreferrer"><MapPin size={15} /> {location || "Map"}<ExternalLink size={13} /></a>}
                {settings?.google_business_profile_url && <a className="admin-inline-link" href={settings.google_business_profile_url} target="_blank" rel="noopener noreferrer">Google profile <ExternalLink size={13} /></a>}
              </div>
            </div>
          </form>
        </section>
      </div>

      <section className="admin-panel admin-panel--control admin-hours-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><Clock3 size={15} /> Schedule</span><h2>Opening hours</h2><p>Set one or two opening periods for each day.</p></div>
          <Store size={20} aria-hidden="true" />
        </div>
        <div className="admin-hours-grid">
          {hours?.map((hour) => {
            const periods = getHourPeriods(hour);
            return (
              <details className="admin-edit-card admin-hour-card" key={hour.id}>
                <summary>
                  <span><strong>{hour.label}</strong><small>{formatBusinessHours(hour)}</small></span>
                  <span>Edit</span>
                </summary>
                <form className="admin-form-grid admin-form-grid--focused" action={updateBusinessHour}>
                  <input type="hidden" name="id" value={hour.id} />
                  <label>Opens<input type="time" name="first_opens_at" defaultValue={periods[0]?.opens_at} /></label>
                  <label>Closes<input type="time" name="first_closes_at" defaultValue={periods[0]?.closes_at} /></label>
                  <label>Reopens <small>optional</small><input type="time" name="second_opens_at" defaultValue={periods[1]?.opens_at} /></label>
                  <label>Final close <small>optional</small><input type="time" name="second_closes_at" defaultValue={periods[1]?.closes_at} /></label>
                  <label className="checkbox-line admin-span-2"><input type="checkbox" name="is_closed" defaultChecked={hour.is_closed} /> Closed all day</label>
                  <div className="admin-form-actions admin-span-2"><AdminSubmitButton variant="secondary">Save {hour.label}</AdminSubmitButton></div>
                </form>
              </details>
            );
          })}
        </div>
      </section>
    </div>
  );
}
