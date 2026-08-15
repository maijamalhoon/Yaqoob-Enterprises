import Link from "next/link";
import { Activity, ArrowRight, BarChart3, CheckCircle2, History, ImageIcon, MapPin, MousePointerClick, Phone, Settings2, ShieldCheck, TriangleAlert, Wrench } from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { businessLocationLabel } from "@/lib/business-display";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  // Server-only admin page: request-time wall clock intentionally defines the rolling 30-day activity window.
  // eslint-disable-next-line react-hooks/purity
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [services, categories, featured, settings, hours, events, recent, latestBackup] = await Promise.all([
    supabase.from("services").select("id,category_id,status"),
    supabase.from("service_categories").select("id,is_active"),
    supabase.from("gallery_images").select("id,alt_text").eq("is_active", true).eq("is_featured", true).eq("media_kind", "real").limit(1).maybeSingle(),
    supabase.from("business_settings").select("business_name,tagline,phone_display,phone_e164,whatsapp_e164,address,map_url,google_business_profile_url").eq("id", true).single(),
    supabase.from("business_hours").select("id,is_closed,periods").order("display_order"),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("analytics_events").select("event_name,page_path,city_name,device_type,created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("admin_snapshots").select("id,created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const activeCategoryIds = new Set((categories.data || []).filter((category) => category.is_active).map((category) => category.id));
  const publicServiceCount = (services.data || []).filter((service) => service.status !== "hidden" && activeCategoryIds.has(service.category_id)).length;
  const categoryCount = activeCategoryIds.size;
  const featuredReady = Boolean(featured.data?.id);
  const settingsData = settings.data;
  const location = businessLocationLabel(settingsData?.address || "");
  const hoursReady = (hours.data || []).length === 7 && (hours.data || []).every((hour) =>
    hour.is_closed || (Array.isArray(hour.periods) && hour.periods.length > 0),
  );

  const healthChecks = [
    ["Contact", Boolean(settingsData?.phone_e164 && settingsData?.whatsapp_e164), "/admin/settings"],
    ["Location", Boolean(settingsData?.address && settingsData?.map_url), "/admin/settings"],
    ["Opening hours", hoursReady, "/admin/settings"],
    ["Public services", publicServiceCount > 0 && categoryCount > 0, "/admin/services"],
    ["Homepage image", featuredReady, "/admin/gallery"],
    ["Google Business", Boolean(settingsData?.google_business_profile_url), "/admin/analytics"],
    ["Backup", Boolean(latestBackup.data?.id), "/admin/history"],
  ] as const;
  const healthyCount = healthChecks.filter(([, ready]) => ready).length;

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Control centre</span>
          <h1>{settingsData?.business_name || "Website admin"}</h1>
          <p>Manage the information customers see on the public website.</p>
        </div>
        <div className="admin-heading-metrics">
          <span className={healthyCount === healthChecks.length ? "is-good" : "is-warning"}><strong>{healthyCount}/{healthChecks.length}</strong> health checks</span>
        </div>
      </div>

      <div className="admin-stats admin-stats--control">
        <article><span><Wrench size={19} /></span><strong>{publicServiceCount}</strong><p>Public services</p></article>
        <article><span><Settings2 size={19} /></span><strong>{categoryCount}</strong><p>Categories</p></article>
        <article className={featuredReady ? "is-ready" : "is-warning"}><span><ImageIcon size={19} /></span><strong>{featuredReady ? "Ready" : "Missing"}</strong><p>Homepage image</p></article>
        <article><span><Activity size={19} /></span><strong>{events.count || 0}</strong><p>30-day events</p></article>
      </div>

      <section className="admin-panel admin-panel--control admin-health-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><ShieldCheck size={15} /> Health</span><h2>Website readiness</h2></div>
        </div>
        <div className="admin-health-grid">
          {healthChecks.map(([label, ready, href]) => (
            <Link className={ready ? "is-ready" : "is-warning"} href={href} key={label}>
              {ready ? <CheckCircle2 size={16} /> : <TriangleAlert size={16} />}
              <span>{label}</span>
              <small>{ready ? "Ready" : "Check"}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-control-links" aria-label="Website controls">
        <Link className="admin-control-link" href="/admin/settings">
          <span className="admin-control-link__icon"><Settings2 size={20} /></span>
          <span><strong>Business details</strong><small>{settingsData?.phone_display || "Set phone"} · {location || "Set location"}</small></span>
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
        <Link className="admin-control-link" href="/admin/analytics">
          <span className="admin-control-link__icon"><BarChart3 size={20} /></span>
          <span><strong>Analytics</strong><small>Traffic, contact actions and Google Business attribution</small></span>
          <ArrowRight size={17} />
        </Link>
        <Link className="admin-control-link" href="/admin/history">
          <span className="admin-control-link__icon"><History size={20} /></span>
          <span><strong>History & backups</strong><small>{latestBackup.data?.id ? `Latest backup ${new Date(latestBackup.data.created_at).toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" })}` : "Create your first backup"}</small></span>
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
            {(recent.data || []).map((event, index) => <tr key={`${event.created_at}-${index}`}><td>{event.event_name.replaceAll("_", " ")}</td><td>{event.page_path}</td><td>{event.city_name || "Unknown"}</td><td>{event.device_type || "Unknown"}</td><td>{new Date(event.created_at).toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</td></tr>)}
            {(recent.data || []).length === 0 && <tr><td colSpan={5}>No activity recorded yet.</td></tr>}
          </tbody></table>
        </div>
      </section>

      <div className="admin-dashboard-contact" aria-label="Current public contact">
        <Phone size={15} /> <span>{settingsData?.phone_display || "Phone not set"}</span>
        <MapPin size={15} /> <span>{location || "Location not set"}</span>
      </div>
    </div>
  );
}
