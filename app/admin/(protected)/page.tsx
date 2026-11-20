import type { CSSProperties } from "react";
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
import { groupRecentAdminActivity } from "@/lib/admin-activity-groups";
import { AdminMetricCard } from "@/components/admin-metric-card";

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
    supabase.from("analytics_events").select("event_name,page_path,city_name,device_type,created_at").order("created_at", { ascending: false }).limit(80),
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
  // Display only: group identical events within five minutes; do not change stored analytics.
  const activityRows = groupRecentAdminActivity(recent.data || [], 7);

  return (
    <div className="admin-content admin-control-page">
      <header className="admin-premium-hero">
        <div className="admin-premium-hero__copy">
          <span className="admin-premium-hero__eyebrow"><span aria-hidden="true" /> YAQOOB ENTERPRISES / CONTROL ROOM</span>
          <h1>Website overview</h1>
          <p>Content, performance and what needs your attention.</p>
          <div className="admin-premium-hero__meta">
            <span><CheckCircle2 size={15} aria-hidden="true" /> {healthyCount} of {healthChecks.length} checks ready</span>
            <span><History size={15} aria-hidden="true" /> {latestBackup.error ? "Backup status unavailable" : latestBackup.data?.id ? "Backup available" : "Backup needed"}</span>
          </div>
        </div>
        <div className="admin-premium-hero__focus">
          <div className="admin-premium-hero__focus-top"><span>PRIORITY</span><ArrowRight size={16} aria-hidden="true" /></div>
          <strong>{nextPriority ? "Review " + nextPriority[0].toLowerCase() : "Website essentials ready"}</strong>
          <p>{nextPriority ? nextPriority[1] === null ? "Check unavailable status" : reviewCount + " item" + (reviewCount === 1 ? "" : "s") + " to review" : "Keep an eye on website engagement."}</p>
          <Link href={nextPriority?.[2] || "/admin/analytics"}>{nextPriority ? "Open section" : "View analytics"} <ArrowRight size={15} aria-hidden="true" /></Link>
        </div>
      </header>

      <section className="admin-metric-grid" aria-label="Website summary">
        <AdminMetricCard label="Public services" value={publicServiceCount ?? "—"} icon={Wrench} note="Visible website services" tone="teal" />
        <AdminMetricCard label="Active categories" value={categoryCount ?? "—"} icon={Settings2} note="Published service groups" tone="blue" />
        <AdminMetricCard label="Homepage image" value={featuredReady === null ? "—" : featuredReady ? "Ready" : "Missing"} icon={ImageIcon} note={featuredReady ? "Real shop photo featured" : "Choose a real shop photo"} tone="amber" />
        <AdminMetricCard label="Tracked events · 30 days" value={events.error ? "—" : (events.count || 0)} icon={Activity} note="Recorded website interactions" tone="violet" />
      </section>

      <details className="admin-readiness-disclosure">
        <summary>
          <span className="admin-readiness-mini" aria-hidden="true"
            style={{ "--readiness": (healthyCount / healthChecks.length * 100) + "%" } as CSSProperties}>
            <span><ShieldCheck size={17} /></span>
          </span>
          <span className="admin-readiness-title"><strong>Website readiness</strong><small>{reviewCount > 0 ? reviewCount + " item needs review" : unavailableCount > 0 ? unavailableCount + " checks unavailable" : "All essential checks passed"}</small></span>
          <span className="admin-readiness-count">{healthyCount}/{healthChecks.length} ready</span>
          <span className="admin-readiness-open">Details</span>
        </summary>
        <nav className="admin-readiness-list" aria-label="Website readiness checks">
          {healthChecks.map(([label, ready, href]) => (
            <Link className={ready ? "is-ready" : "is-warning"} href={href} key={label}>
              {ready === true ? <CheckCircle2 size={16} aria-hidden="true" /> : <TriangleAlert size={16} aria-hidden="true" />}
              <span>{label}</span>
              <small>{ready === null ? "Unavailable" : ready ? "Ready" : "Review"}</small>
            </Link>
          ))}
        </nav>
      </details>

      <section className="admin-panel admin-panel--control admin-quick-panel" aria-labelledby="admin-controls-title">
        <div className="admin-panel__heading">
          <div>
            <span className="admin-panel-kicker"><Settings2 size={15} aria-hidden="true" /> Manage</span>
            <h2 id="admin-controls-title">Quick access</h2>
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
        <div className="admin-activity-feed" role="list" aria-label="Latest grouped website events">
          {activityRows.map((event, index) => (
            <div className="admin-activity-entry" role="listitem" key={event.created_at + ":" + event.page_path + ":" + index}>
              <span className="admin-activity-entry__icon"><MousePointerClick size={17} aria-hidden="true" /></span>
              <div className="admin-activity-entry__main">
                <strong>{event.event_name.replaceAll("_", " ")}</strong>
                <small title={event.page_path || "/"}>{event.page_path === "/" || !event.page_path ? "Homepage" : event.page_path}</small>
              </div>
              {event.count > 1 && <span className="admin-activity-entry__count" aria-label={event.count + " recorded events"}>{event.count} events</span>}
              <span className="admin-activity-entry__source">{event.city_name || "Unknown city"} · {event.device_type || "Unknown device"}</span>
              <time dateTime={event.created_at}>{new Date(event.created_at).toLocaleString("en-PK", { timeZone: "Asia/Karachi", dateStyle: "medium", timeStyle: "short" })}</time>
            </div>
          ))}
          {activityRows.length === 0 && (
            <p className="admin-activity-empty">{recent.error ? "Activity could not be loaded." : "No activity recorded yet."}</p>
          )}
        </div>
        {activityRows.length > 0 && <p className="admin-activity-note">Repeated identical events within five minutes are grouped for readability. Counts are events, not unique people.</p>}
      </section>
    </div>
  );
}
