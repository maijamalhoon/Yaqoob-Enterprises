import Link from "next/link";
import { Activity, ArrowRight, ImageIcon, MapPin, MousePointerClick, Phone, Settings2, Wrench } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { businessLocationLabel } from "@/lib/business-display";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  // Server-only admin page: request-time wall clock intentionally defines the rolling 30-day activity window.
  // eslint-disable-next-line react-hooks/purity
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [services, categories, featured, settings, events, recent] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }).neq("status", "hidden"),
    supabase.from("service_categories").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("gallery_images").select("id,alt_text").eq("is_active", true).eq("is_featured", true).eq("media_kind", "real").limit(1).maybeSingle(),
    supabase.from("business_settings").select("business_name,phone_display,address").eq("id", true).single(),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("analytics_events").select("event_name,page_path,city_name,device_type,created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const location = businessLocationLabel(settings.data?.address || "");
  const publicServiceCount = services.count || 0;
  const categoryCount = categories.count || 0;
  const featuredReady = Boolean(featured.data?.id);

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Control centre</span>
          <h1>{settings.data?.business_name || "Website admin"}</h1>
          <p>Manage the information customers see on the public website.</p>
        </div>
      </div>

      <div className="admin-stats admin-stats--control">
        <article><span><Wrench size={19} /></span><strong>{publicServiceCount}</strong><p>Public services</p></article>
        <article><span><Settings2 size={19} /></span><strong>{categoryCount}</strong><p>Categories</p></article>
        <article className={featuredReady ? "is-ready" : "is-warning"}><span><ImageIcon size={19} /></span><strong>{featuredReady ? "Ready" : "Missing"}</strong><p>Homepage image</p></article>
        <article><span><Activity size={19} /></span><strong>{events.count || 0}</strong><p>30-day events</p></article>
      </div>

      <section className="admin-control-links" aria-label="Website controls">
        <Link className="admin-control-link" href="/admin/settings">
          <span className="admin-control-link__icon"><Settings2 size={20} /></span>
          <span><strong>Business details</strong><small>{settings.data?.phone_display || "Set phone"} · {location || "Set location"}</small></span>
          <ArrowRight size={17} />
        </Link>
        <Link className="admin-control-link" href="/admin/services">
          <span className="admin-control-link__icon"><Wrench size={20} /></span>
          <span><strong>Services</strong><small>{publicServiceCount} public across {categoryCount} categories</small></span>
          <ArrowRight size={17} />
        </Link>
        <Link className="admin-control-link" href="/admin/gallery">
          <span className="admin-control-link__icon"><ImageIcon size={20} /></span>
          <span><strong>Homepage image</strong><small>{featuredReady ? featured.data?.alt_text || "Featured image selected" : "Choose a featured shop photo"}</small></span>
          <ArrowRight size={17} />
        </Link>
        <Link className="admin-control-link" href="/admin/coverage">
          <span className="admin-control-link__icon"><MapPin size={20} /></span>
          <span><strong>Service coverage</strong><small>Delivery and home-visit areas</small></span>
          <ArrowRight size={17} />
        </Link>
      </section>

      <section className="admin-panel admin-panel--control admin-activity-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><MousePointerClick size={15} /> Activity</span><h2>Recent website activity</h2></div>
          <Link className="admin-inline-link" href="/admin/analytics">Full analytics <ArrowRight size={14} /></Link>
        </div>
        <div className="admin-table-wrap">
          <table><thead><tr><th>Event</th><th>Page</th><th>City</th><th>Device</th><th>Time</th></tr></thead><tbody>
            {(recent.data || []).map((event, index) => <tr key={`${event.created_at}-${index}`}><td>{event.event_name.replaceAll("_", " ")}</td><td>{event.page_path}</td><td>{event.city_name || "Unknown"}</td><td>{event.device_type || "Unknown"}</td><td>{new Date(event.created_at).toLocaleString("en-PK")}</td></tr>)}
            {(recent.data || []).length === 0 && <tr><td colSpan={5}>No activity recorded yet.</td></tr>}
          </tbody></table>
        </div>
      </section>

      <div className="admin-dashboard-contact" aria-label="Current public contact">
        <Phone size={15} /> <span>{settings.data?.phone_display || "Phone not set"}</span>
        <MapPin size={15} /> <span>{location || "Location not set"}</span>
      </div>
    </div>
  );
}
