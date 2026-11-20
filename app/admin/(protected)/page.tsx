import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  History,
  ImageIcon,
  MapPin,
  Megaphone,
  MousePointerClick,
  Settings2,
  ShieldCheck,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { requireAdmin } from "@/lib/admin";
import { businessLocationLabel } from "@/lib/business-display";
import { karachiAnalyticsWindow } from "@/lib/admin-analytics-window";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  // Server-only: use the same 30 Pakistan calendar days as the Analytics page.
  // eslint-disable-next-line react-hooks/purity
  const since = karachiAnalyticsWindow(new Date()).since;
  const [services, categories, featured, settings, hours, events, recent, latestBackup] = await Promise.all([
    supabase.from("services").select("id,category_id,status"),
    supabase.from("service_categories").select("id,is_active"),
    supabase.from("gallery_images").select("id,alt_text").eq("is_active", true).eq("is_featured", true).eq("media_kind", "real").limit(1).maybeSingle(),
    supabase.from("business_settings").select("business_name,phone_display,phone_e164,whatsapp_e164,address,map_url,google_business_profile_url").eq("id", true).single(),
    supabase.from("business_hours").select("id,is_closed,periods").order("display_order"),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("analytics_events").select("event_name,page_path,city_name,device_type,created_at").order("created_at", { ascending: false }).limit(8),
    supabase.from("admin_snapshots").select("id,created_at").order("created_at", { ascending: false }).limit(1).maybeSingle(),
  ]);

  const activeCategoryIds = new Set((categories.data || []).filter((category) => category.is_active).map((category) => category.id));
  const publicServiceCount = services.error || categories.error
    ? null
    : (services.data || []).filter((service) => service.status !== "hidden" && activeCategoryIds.has(service.category_id)).length;
  const categoryCount = categories.error ? null : activeCategoryIds.size;
  const featuredReady = featured.error ? null : Boolean(featured.data?.id);
  const settingsData = settings.data;
  const location = businessLocationLabel(settingsData?.address || "");
  const hoursReady = hours.error ? null : (hours.data || []).length === 7 && (hours.data || []).every((hour) =>
    hour.is_closed || (Array.isArray(hour.periods) && hour.periods.length > 0),
  );

  const healthChecks = [
    ["Contact", settings.error ? null : Boolean(settingsData?.phone_e164 && settingsData?.whatsapp_e164), "/admin/settings"],
    ["Location", settings.error ? null : Boolean(settingsData?.address && settingsData?.map_url), "/admin/settings"],
    ["Opening hours", hoursReady, "/admin/settings"],
    ["Public services", publicServiceCount === null || categoryCount === null ? null : publicServiceCount > 0 && categoryCount > 0, "/admin/services"],
    ["Homepage image", featuredReady, "/admin/gallery"],
    ["Google Business", settings.error ? null : Boolean(settingsData?.google_business_profile_url), "/admin/analytics"],
    ["Backup", latestBackup.error ? null : Boolean(latestBackup.data?.id), "/admin/history"],
  ] as const;
  const healthyCount = healthChecks.filter(([, ready]) => ready).length;
  const unavailableCount = healthChecks.filter(([, ready]) => ready === null).length;
  const reviewCount = healthChecks.filter(([, ready]) => ready === false).length;
  const nextPriority = healthChecks.find(([, ready]) => ready === false) || healthChecks.find(([, ready]) => ready === null);
  const activityRows = recent.data || [];

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div>
          <span className="eyebrow">Control centre</span>
          <h1>Overview</h1>
          <p>Manage the information {settingsData?.business_name || "your business"} shows on the public website.</p>
        </div>
        <div className="admin-heading-metrics">
          <span className={healthyCount === healthChecks.length ? "is-good" : "is-warning"}>
            <strong>{healthyCount}/{healthChecks.length}</strong> checks ready
          </span>
        </div>
      </div>

      <section className="admin-stats admin-stats--control" aria-label="Website summary">
        <article>
          <span><Wrench size={18} aria-hidden="true" /></span>
          <strong>{publicServiceCount?.toLocaleString("en-PK") ?? "—"}</strong>
          <p>Public services</p>
        </article>
        <article>
          <span><Settings2 size={18} aria-hidden="true" /></span>
          <strong>{categoryCount?.toLocaleString("en-PK") ?? "—"}</strong>
          <p>Active categories</p>
        </article>
        <article className={featuredReady === null ? "is-warning" : featuredReady ? "is-ready" : "is-warning"}>
          <span><ImageIcon size={18} aria-hidden="true" /></span>
          <strong>{featuredReady === null ? "—" : featuredReady ? "Ready" : "Missing"}</strong>
          <p>Homepage image</p>
        </article>
        <article>
          <span><Activity size={18} aria-hidden="true" /></span>
          <strong>{events.error ? "—" : (events.count || 0).toLocaleString("en-PK")}</strong>
          <p>Tracked events · 30 days</p>
        </article>
      </section>

      <section className="admin-dashboard-spotlight" aria-label="Recommended admin action">
        <span className="admin-dashboard-spotlight__icon"><ShieldCheck size={20} aria-hidden="true" /></span>
        <div className="admin-dashboard-spotlight__copy">
          <span>Next step</span>
          <strong>{nextPriority ? "Review " + nextPriority[0].toLowerCase() : "Website essentials are ready"}</strong>
          <p>{nextPriority
            ? nextPriority[1] === null
              ? "The status could not be verified. Open this section and check its data."
              : `${reviewCount} website check${reviewCount === 1 ? "" : "s"} need${reviewCount === 1 ? "s" : ""} attention.`
            : "Core setup is complete. Explore visitors and contact activity."}</p>
        </div>
        <Link href={nextPriority?.[2] || "/admin/analytics"}>
          {nextPriority ? "Open section" : "View insights"} <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </section>

      <section className="admin-panel admin-panel--control admin-health-panel" aria-labelledby="admin-health-title">
        <div className="admin-panel__heading">
          <div>
            <span className="admin-panel-kicker"><ShieldCheck size={15} aria-hidden="true" /> Readiness</span>
            <h2 id="admin-health-title">Website checks</h2>
            {unavailableCount > 0 && <p>{unavailableCount} status check{unavailableCount === 1 ? "" : "s"} currently unavailable.</p>}
          </div>
        </div>
        <div className="admin-health-grid">
          {healthChecks.map(([label, ready, href]) => (
            <Link className={ready ? "is-ready" : "is-warning"} href={href} key={label}>
              {ready === true
                ? <CheckCircle2 size={16} aria-hidden="true" />
                : <TriangleAlert size={16} aria-hidden="true" />}
              <span>{label}</span>
              <small>{ready === null ? "Unavailable" : ready ? "Ready" : "Review"}</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="admin-panel admin-panel--control" aria-labelledby="admin-controls-title">
        <div className="admin-panel__heading">
          <div>
            <span className="admin-panel-kicker"><Settings2 size={15} aria-hidden="true" /> Manage</span>
            <h2 id="admin-controls-title">Website content</h2>
          </div>
        </div>
        <div className="admin-control-links">
          <Link className="admin-control-link" href="/admin/settings">
            <span className="admin-control-link__icon"><Settings2 size={18} aria-hidden="true" /></span>
            <span><strong>Business details</strong><small>{settingsData?.phone_display || "Set phone"} · {location || "Set location"}</small></span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="admin-control-link" href="/admin/services">
            <span className="admin-control-link__icon"><Wrench size={18} aria-hidden="true" /></span>
            <span><strong>Services</strong><small>{publicServiceCount === null || categoryCount === null ? "Service data unavailable" : `${publicServiceCount} public in ${categoryCount} active categories`}</small></span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="admin-control-link" href="/admin/gallery">
            <span className="admin-control-link__icon"><ImageIcon size={18} aria-hidden="true" /></span>
            <span><strong>Gallery</strong><small>{featuredReady === null ? "Image data unavailable" : featuredReady ? featured.data?.alt_text || "Featured image selected" : "Choose a homepage image"}</small></span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="admin-control-link" href="/admin/coverage">
            <span className="admin-control-link__icon"><MapPin size={18} aria-hidden="true" /></span>
            <span><strong>Coverage</strong><small>Delivery, pickup and home visit areas</small></span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="admin-control-link" href="/admin/announcements">
            <span className="admin-control-link__icon"><Megaphone size={18} aria-hidden="true" /></span>
            <span><strong>Announcements</strong><small>Notices for the public website</small></span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="admin-control-link" href="/admin/analytics">
            <span className="admin-control-link__icon"><BarChart3 size={18} aria-hidden="true" /></span>
            <span><strong>Analytics</strong><small>Traffic, contact actions and Google attribution</small></span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Link className="admin-control-link" href="/admin/history">
            <span className="admin-control-link__icon"><History size={18} aria-hidden="true" /></span>
            <span><strong>History & backups</strong><small>{latestBackup.error ? "Backup data unavailable" : latestBackup.data?.id ? "Latest backup " + new Date(latestBackup.data.created_at).toLocaleDateString("en-PK", { timeZone: "Asia/Karachi" }) : "Create your first backup"}</small></span>
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="admin-panel admin-panel--control admin-activity-panel" aria-labelledby="admin-activity-title">
        <div className="admin-panel__heading">
          <div>
            <span className="admin-panel-kicker"><MousePointerClick size={15} aria-hidden="true" /> Activity</span>
            <h2 id="admin-activity-title">Recent website activity</h2>
          </div>
          <Link className="admin-inline-link" href="/admin/analytics">Full analytics <ArrowRight size={14} aria-hidden="true" /></Link>
        </div>
        <div className="admin-table-wrap" role="region" aria-label="Recent website activity" tabIndex={0}>
          <table>
            <thead>
              <tr><th scope="col">Event</th><th scope="col">Page</th><th scope="col">City</th><th scope="col">Device</th><th scope="col">Time</th></tr>
            </thead>
            <tbody>
              {activityRows.map((event, index) => (
                <tr key={event.created_at + "-" + index}>
                  <td>{event.event_name.replaceAll("_", " ")}</td>
                  <td>{event.page_path}</td>
                  <td>{event.city_name || "Unknown"}</td>
                  <td>{event.device_type || "Unknown"}</td>
                  <td>{new Date(event.created_at).toLocaleString("en-PK", { timeZone: "Asia/Karachi" })}</td>
                </tr>
              ))}
              {activityRows.length === 0 && <tr><td colSpan={5}>{recent.error ? "Activity could not be loaded." : "No activity has been recorded yet."}</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
