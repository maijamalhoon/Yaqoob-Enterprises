import type { CSSProperties } from "react";
import { BarChart3, Building2, ExternalLink, Globe2, MessageCircle, MonitorSmartphone, MousePointerClick, Users } from "lucide-react";
import { AnalyticsRefreshButton } from "@/components/analytics-refresh-button";
import { requireAdmin } from "@/lib/admin";
import { SITE_URL } from "@/lib/env";
import { karachiAnalyticsWindow, karachiDayKey } from "@/lib/admin-analytics-window";

const contactEvents = new Set(["whatsapp_click", "call_click", "directions_click"]);
const contactLabels: Record<string, string> = {
  whatsapp_click: "WhatsApp",
  call_click: "Calls",
  directions_click: "Directions",
};
const analyticsTickFormatter = new Intl.DateTimeFormat("en-PK", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function decodeLabel(value: string | null | undefined, fallback: string) {
  if (!value) return fallback;
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function sourceLabel(event: {
  utm_source: string | null;
  utm_campaign: string | null;
  referrer_host: string | null;
}) {
  if (event.utm_source) {
    return event.utm_campaign ? `${event.utm_source} · ${event.utm_campaign}` : event.utm_source;
  }
  if (event.referrer_host && !event.referrer_host.includes("yaqoob-enterprises")) return event.referrer_host;
  return "Direct / unknown";
}

function serviceLabel(path: string) {
  const slug = path.split("/services/")[1]?.split("/")[0];
  if (!slug) return path;
  return slug.split("-").map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

function InsightBars({ rows, emptyMessage }: { rows: [string, number][]; emptyMessage: string }) {
  const max = Math.max(1, ...rows.map(([, count]) => count));

  return (
    <div className="rank-list admin-bar-chart">
      {rows.map(([label, count]) => {
        const width = Math.round((count / max) * 100);
        return (
          <div key={label} style={{ "--rank-fill": width + "%" } as CSSProperties}>
            <span>{label}</span><strong>{count}</strong>
          </div>
        );
      })}
      {rows.length === 0 && <p>{emptyMessage}</p>}
    </div>
  );
}

const ANALYTICS_LIMIT = 5000;
const ANALYTICS_PAGE_SIZE = 1000;
const EVENT_COLUMNS = "id,event_name,page_path,referrer_host,country_code,city_name,device_type,session_hash,utm_source,utm_medium,utm_campaign,created_at";

type TrackedEvent = {
  id: string;
  event_name: string;
  page_path: string | null;
  referrer_host: string | null;
  country_code: string | null;
  city_name: string | null;
  device_type: string | null;
  session_hash: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
};

async function loadTrackedEvents(
  supabase: Awaited<ReturnType<typeof requireAdmin>>["supabase"],
  since: string,
  until: string,
) {
  const events: TrackedEvent[] = [];
  let total: number | null = null;

  // The Supabase Data API can cap results below the requested range size.
  // Paginate against an exact count, rather than silently reporting the first 1,000 as the full month.
  while (events.length < ANALYTICS_LIMIT) {
    const { data, count, error } = await supabase.from("analytics_events")
      .select(EVENT_COLUMNS, { count: "exact" })
      .gte("created_at", since)
      .lte("created_at", until)
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(events.length, Math.min(events.length + ANALYTICS_PAGE_SIZE - 1, ANALYTICS_LIMIT - 1));

    if (error || count === null || !data) {
      throw new Error("Analytics data could not be loaded. Please retry.");
    }
    total = count;
    if (data.length === 0 && events.length < total) {
      throw new Error("Analytics results were incomplete. Please retry.");
    }
    events.push(...(data as TrackedEvent[]));
    if (events.length >= total) break;
  }
  return { events, truncated: total !== null && events.length < total };
}

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();
  // Server-only admin page: request-time wall clock defines the reporting period.
  // eslint-disable-next-line react-hooks/purity
  const now = new Date();
  const { since, until, days } = karachiAnalyticsWindow(now);
  const [{ events, truncated }, { data: settings, error: settingsError }, { data: categories, error: categoryError }] = await Promise.all([
    loadTrackedEvents(supabase, since, until),
    supabase.from("business_settings").select("business_name,google_business_profile_url").eq("id", true).single(),
    supabase.from("service_categories").select("slug,title"),
  ]);
  if (settingsError || categoryError) throw new Error("Analytics settings could not be loaded. Please retry.");

  const categoryTitles = new Map((categories || []).map((category) => [category.slug, category.title]));
  const rows = events.filter((event) => {
    const path = String(event.page_path || "/");
    return path !== "/admin" && !path.startsWith("/admin/");
  });
  const pageViewRows = rows.filter((event) => event.event_name === "page_view");
  const dailyPageViews = days.map((key) => ({
    key,
    label: analyticsTickFormatter.format(new Date(key + "T12:00:00Z")),
    count: 0,
  }));
  const dailyPageViewsByDay = new Map(dailyPageViews.map((entry) => [entry.key, entry]));
  for (const event of pageViewRows) {
    const entry = dailyPageViewsByDay.get(karachiDayKey(new Date(event.created_at)));
    if (entry) entry.count += 1;
  }
  const dailyViewsTotal = dailyPageViews.reduce((total, entry) => total + entry.count, 0);
  const busiestDay = dailyPageViews.reduce((busiest, entry) => entry.count > busiest.count ? entry : busiest);
  const dailyViewsMax = Math.max(1, ...dailyPageViews.map((entry) => entry.count));
  const contactRows = rows.filter((event) => contactEvents.has(event.event_name));
  const visitors = new Set(rows.map((event) => event.session_hash).filter(Boolean)).size;
  const pageViews = pageViewRows.length;
  const contactVisitors = new Set(contactRows.map((event) => event.session_hash).filter(Boolean)).size;
  const conversionRate = visitors > 0 ? Math.round((contactVisitors / visitors) * 100) : 0;

  const googleRows = rows.filter((event) =>
    event.utm_source?.toLowerCase() === "google" && event.utm_campaign?.toLowerCase() === "gbp",
  );
  const googleVisitors = new Set(googleRows.map((event) => event.session_hash).filter(Boolean)).size;
  const googlePageViews = googleRows.filter((event) => event.event_name === "page_view").length;
  const googleContactVisitors = new Set(
    googleRows.filter((event) => contactEvents.has(event.event_name)).map((event) => event.session_hash).filter(Boolean),
  ).size;
  const googleConversion = googleVisitors > 0 ? Math.round((googleContactVisitors / googleVisitors) * 100) : 0;

  const contactActions = Object.entries(contactRows.reduce<Record<string, number>>((acc, event) => {
    const label = contactLabels[event.event_name] || event.event_name.replaceAll("_", " ");
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

  const serviceInterest = Object.entries(pageViewRows.reduce<Record<string, number>>((acc, event) => {
    const path = String(event.page_path || "");
    if (!path.startsWith("/services/")) return acc;
    const slug = path.split("/services/")[1]?.split("/")[0] || "";
    const label = categoryTitles.get(slug) || serviceLabel(path);
    acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const cities = Object.entries(pageViewRows.reduce<Record<string, number>>((acc, event) => {
    const city = decodeLabel(event.city_name, "Unknown");
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const pages = Object.entries(pageViewRows.reduce<Record<string, number>>((acc, event) => {
    const path = String(event.page_path || "/");
    acc[path] = (acc[path] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const devices = Object.entries(pageViewRows.reduce<Record<string, number>>((acc, event) => {
    const device = decodeLabel(event.device_type, "Unknown");
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

  const sources = Object.entries(pageViewRows.reduce<Record<string, number>>((acc, event) => {
    const source = sourceLabel(event);
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 10);

  const cards = [
    ["Visitors", visitors, Users],
    ["Page views", pageViews, BarChart3],
    ["Contact visitors", contactVisitors, MousePointerClick],
    ["Contact rate", `${conversionRate}%`, Globe2],
  ] as const;

  const trackingUrl = `${SITE_URL.replace(/\/$/, "")}/?utm_source=google&utm_medium=organic&utm_campaign=gbp`;

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div><span className="eyebrow">Insights</span><h1>Analytics</h1><p>Last 30 calendar days · Pakistan time.</p></div>
        <AnalyticsRefreshButton />
      </div>

      <div className="admin-analytics-period" role="status"><span>{days[0]} — {days[29]} · PKT</span><strong>{truncated ? "Partial data: latest 5,000 events" : "All tracked events loaded"}</strong></div>

      <div className="admin-stats admin-stats--control">{cards.map(([label, value, Icon]) => <article key={label}><span><Icon size={19} /></span><strong>{value}</strong><p>{label}</p></article>)}</div>

      <section className="admin-panel admin-panel--control admin-traffic-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><BarChart3 size={15} /> Traffic trend</span><h2>Daily page views</h2><p>Public page views across the last 30 days, grouped by Pakistan time.</p></div>
          <span className="admin-traffic-total"><strong>{dailyViewsTotal.toLocaleString("en-PK")}</strong><small>page views</small></span>
        </div>
        <div className="admin-traffic-chart" role="img" aria-label={dailyViewsTotal ? `Daily page views in the last 30 calendar days${truncated ? " (latest 5,000 events only)" : ""}. ${dailyViewsTotal.toLocaleString("en-PK")} shown; busiest day ${busiestDay.label} with ${busiestDay.count.toLocaleString("en-PK")} views.` : "No page views recorded during this period."}>
          <div className="admin-traffic-chart__scale" aria-hidden="true"><span>{dailyViewsMax.toLocaleString("en-PK")}</span><span>{(dailyViewsMax / 2).toLocaleString("en-PK", { maximumFractionDigits: 1 })}</span><span>0</span></div>
          <div className="admin-traffic-chart__plot">
            {dailyPageViews.map((entry) => <span key={entry.key} title={`${entry.label}: ${entry.count.toLocaleString("en-PK")} page views`} style={{ height: `${entry.count ? Math.max(4, (entry.count / dailyViewsMax) * 100) : 0}%` }} />)}
            {dailyViewsTotal === 0 && <p>No page views recorded during this period.</p>}
          </div>
        </div>
        <div className="admin-traffic-chart__dates" aria-hidden="true"><span>{dailyPageViews[0].label}</span><span>{dailyPageViews[15].label}</span><span>{dailyPageViews[29].label}</span></div>
        {truncated && <p className="admin-traffic-note">More than 5,000 events were tracked. These counts show a partial sample, not full-period totals.</p>}
      </section>

      <section className="admin-panel admin-panel--control admin-google-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><Building2 size={15} /> Google Business</span><h2>{settings?.business_name || "Business profile"}</h2><p>Website traffic attributed to your Google Business Profile.</p></div>
          {settings?.google_business_profile_url && <a className="admin-inline-link" href={settings.google_business_profile_url} target="_blank" rel="noopener noreferrer">Open profile <ExternalLink size={13} /></a>}
        </div>
        <div className="admin-google-metrics">
          <span><strong>{googleVisitors}</strong><small>Visitors</small></span>
          <span><strong>{googlePageViews}</strong><small>Page views</small></span>
          <span><strong>{googleContactVisitors}</strong><small>Contact visitors</small></span>
          <span><strong>{googleConversion}%</strong><small>Contact rate</small></span>
        </div>
        <div className="admin-tracking-link">
          <div><strong>Tracked website link</strong><small>Use this as the Website link in Google Business Profile.</small></div>
          <code>{trackingUrl}</code>
          <a className="admin-inline-link" href={trackingUrl} target="_blank" rel="noopener noreferrer">Test <ExternalLink size={13} /></a>
        </div>
      </section>

      <div className="admin-two-column admin-insights-grid">
        <section className="admin-panel admin-panel--control"><div className="admin-panel__heading"><div><span className="admin-panel-kicker"><MessageCircle size={15} /> Conversion</span><h2>Contact actions</h2></div></div><InsightBars rows={contactActions} emptyMessage="No contact actions yet." /></section>
        <section className="admin-panel admin-panel--control"><div className="admin-panel__heading"><div><span className="admin-panel-kicker"><BarChart3 size={15} /> Services</span><h2>Service interest</h2></div></div><InsightBars rows={serviceInterest} emptyMessage="No service-page views yet." /></section>
        <section className="admin-panel admin-panel--control"><div className="admin-panel__heading"><div><span className="admin-panel-kicker"><Globe2 size={15} /> Sources</span><h2>Traffic sources</h2></div></div><InsightBars rows={sources} emptyMessage="No source data yet." /></section>
        <section className="admin-panel admin-panel--control"><div className="admin-panel__heading"><div><span className="admin-panel-kicker"><BarChart3 size={15} /> Pages</span><h2>Popular pages</h2></div></div><InsightBars rows={pages} emptyMessage="No public data yet." /></section>
        <section className="admin-panel admin-panel--control"><div className="admin-panel__heading"><div><span className="admin-panel-kicker"><Globe2 size={15} /> Location</span><h2>Approximate cities</h2></div></div><InsightBars rows={cities} emptyMessage="No location data yet." /></section>
        <section className="admin-panel admin-panel--control"><div className="admin-panel__heading"><div><span className="admin-panel-kicker"><MonitorSmartphone size={15} /> Devices</span><h2>Device mix</h2></div></div><InsightBars rows={devices} emptyMessage="No device data yet." /></section>
      </div>
    </div>
  );
}
