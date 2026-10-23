import type { CSSProperties } from "react";
import { BarChart3, Building2, ExternalLink, Globe2, MessageCircle, MonitorSmartphone, MousePointerClick, Users } from "lucide-react";
import { AnalyticsRefreshButton } from "@/components/analytics-refresh-button";
import { requireAdmin } from "@/lib/admin";
import { SITE_URL } from "@/lib/env";

const contactEvents = new Set(["whatsapp_click", "call_click", "directions_click"]);
const contactLabels: Record<string, string> = {
  whatsapp_click: "WhatsApp",
  call_click: "Calls",
  directions_click: "Directions",
};
const analyticsDayFormatter = new Intl.DateTimeFormat("en-US", {
  calendar: "gregory",
  day: "2-digit",
  month: "2-digit",
  timeZone: "Asia/Karachi",
  year: "numeric",
});
const analyticsTickFormatter = new Intl.DateTimeFormat("en-PK", {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

function analyticsDayKey(date: Date) {
  const parts = Object.fromEntries(analyticsDayFormatter.formatToParts(date).map(({ type, value }) => [type, value]));
  return `${parts.year}-${parts.month}-${parts.day}`;
}

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

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();
  // Server-only admin page: request-time wall clock intentionally defines the rolling 30-day analytics window.
  // eslint-disable-next-line react-hooks/purity
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [{ data: events }, { data: settings }, { data: categories }] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("event_name,page_path,referrer_host,country_code,city_name,device_type,session_hash,utm_source,utm_medium,utm_campaign,created_at")
      .gte("created_at", start)
      .order("created_at", { ascending: false })
      .limit(5000),
    supabase.from("business_settings").select("business_name,google_business_profile_url").eq("id", true).single(),
    supabase.from("service_categories").select("slug,title"),
  ]);

  const categoryTitles = new Map((categories || []).map((category) => [category.slug, category.title]));
  const rows = (events || []).filter((event) => {
    const path = String(event.page_path || "/");
    return path !== "/admin" && !path.startsWith("/admin/");
  });
  const pageViewRows = rows.filter((event) => event.event_name === "page_view");
  const [year, month, day] = analyticsDayKey(new Date()).split("-").map(Number);
  const dailyPageViews = Array.from({ length: 31 }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1, day + index - 30));
    const key = date.toISOString().slice(0, 10);
    return { key, label: analyticsTickFormatter.format(date), count: 0 };
  });
  const dailyPageViewsByDay = new Map(dailyPageViews.map((entry) => [entry.key, entry]));
  for (const event of pageViewRows) {
    const entry = dailyPageViewsByDay.get(analyticsDayKey(new Date(event.created_at)));
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
        <div><span className="eyebrow">Insights</span><h1>Analytics</h1><p>Public website activity from the last 30 days.</p></div>
        <AnalyticsRefreshButton />
      </div>

      <div className="admin-stats admin-stats--control">{cards.map(([label, value, Icon]) => <article key={label}><span><Icon size={19} /></span><strong>{value}</strong><p>{label}</p></article>)}</div>

      <section className="admin-panel admin-panel--control admin-traffic-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><BarChart3 size={15} /> Traffic trend</span><h2>Daily page views</h2><p>Public page views across the last 30 days, grouped by Pakistan time.</p></div>
          <span className="admin-traffic-total"><strong>{dailyViewsTotal.toLocaleString("en-PK")}</strong><small>page views</small></span>
        </div>
        <div className="admin-traffic-chart" role="img" aria-label={dailyViewsTotal ? `Daily page views over the last 30 days. ${dailyViewsTotal.toLocaleString("en-PK")} total; busiest day ${busiestDay.label} with ${busiestDay.count.toLocaleString("en-PK")} views.` : "No page views recorded during this period."}>
          <div className="admin-traffic-chart__scale" aria-hidden="true"><span>{dailyViewsMax.toLocaleString("en-PK")}</span><span>{(dailyViewsMax / 2).toLocaleString("en-PK", { maximumFractionDigits: 1 })}</span><span>0</span></div>
          <div className="admin-traffic-chart__plot">
            {dailyPageViews.map((entry) => <span key={entry.key} title={`${entry.label}: ${entry.count.toLocaleString("en-PK")} page views`} style={{ height: `${entry.count ? Math.max(4, (entry.count / dailyViewsMax) * 100) : 0}%` }} />)}
            {dailyViewsTotal === 0 && <p>No page views recorded during this period.</p>}
          </div>
        </div>
        <div className="admin-traffic-chart__dates" aria-hidden="true"><span>{dailyPageViews[0].label}</span><span>{dailyPageViews[15].label}</span><span>{dailyPageViews[30].label}</span></div>
        {(events || []).length >= 5000 && <p className="admin-traffic-note">This view uses the latest 5,000 tracked events.</p>}
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
