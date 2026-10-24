import type { CSSProperties } from "react";
import { BarChart3, Building2, ExternalLink, Globe2, MessageCircle, MonitorSmartphone, MousePointerClick, Search, Users } from "lucide-react";
import { AnalyticsRefreshButton } from "@/components/analytics-refresh-button";
import { AdminWorldMap } from "@/components/admin-world-map";
import { AdminTrafficChart } from "@/components/admin-traffic-chart";
import { AdminGoogleBusinessInsights } from "@/components/admin-google-business-insights";
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

export default async function AdminAnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string | string[]; from?: string | string[]; to?: string | string[] }>;
}) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) => Array.isArray(value) ? value[0] : value;
  const requestedRange = first(params.range);
  const requestedFrom = first(params.from);
  const requestedTo = first(params.to);
  const isDateOnly = (value: string | undefined): value is string =>
    Boolean(value && /^\d{4}-\d{2}-\d{2}$/.test(value)
      && !Number.isNaN(Date.parse(value))
      && new Date(`${value}T00:00:00Z`).toISOString().slice(0, 10) === value);
  const validCustomRange = isDateOnly(requestedFrom) && isDateOnly(requestedTo)
    && requestedTo >= requestedFrom
    && (Date.parse(requestedTo) - Date.parse(requestedFrom)) / 86_400_000 <= 364;
  const [todayYear, todayMonth, todayDay] = analyticsDayKey(new Date()).split("-").map(Number);
  const todayKey = `${todayYear}-${String(todayMonth).padStart(2, "0")}-${String(todayDay).padStart(2, "0")}`;
  const rangeDays = validCustomRange
    ? Math.round((Date.parse(requestedTo) - Date.parse(requestedFrom)) / 86_400_000) + 1
    : requestedRange === "today" ? 1 : requestedRange === "7d" ? 7 : requestedRange === "90d" ? 90 : 30;
  const rangeKey = validCustomRange ? "custom" : rangeDays === 1 ? "today" : rangeDays === 7 ? "7d" : rangeDays === 90 ? "90d" : "30d";
  const fromKey = validCustomRange
    ? requestedFrom
    : new Date(Date.UTC(todayYear, todayMonth - 1, todayDay - (rangeDays - 1))).toISOString().slice(0, 10);
  const toKey = validCustomRange ? requestedTo : todayKey;
  const exclusiveEndKey = new Date(Date.parse(`${toKey}T00:00:00Z`) + 86_400_000).toISOString().slice(0, 10);
  const start = new Date(`${fromKey}T00:00:00+05:00`).toISOString();
  const end = new Date(`${exclusiveEndKey}T00:00:00+05:00`).toISOString();
  const { supabase } = await requireAdmin();
  const [{ data: events }, { data: settings }, { data: categories }] = await Promise.all([
    supabase
      .from("analytics_events")
      .select("event_name,page_path,referrer_host,country_code,city_name,device_type,session_hash,utm_source,utm_medium,utm_campaign,created_at")
      .gte("created_at", start)
      .lt("created_at", end)
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
  const [year, month, day] = fromKey.split("-").map(Number);
  const dailyPageViews = Array.from({ length: rangeDays }, (_, index) => {
    const date = new Date(Date.UTC(year, month - 1, day + index));
    const key = date.toISOString().slice(0, 10);
    return { key, label: analyticsTickFormatter.format(date), count: 0 };
  });
  const dailyPageViewsByDay = new Map(dailyPageViews.map((entry) => [entry.key, entry]));
  for (const event of pageViewRows) {
    const entry = dailyPageViewsByDay.get(analyticsDayKey(new Date(event.created_at)));
    if (entry) entry.count += 1;
  }
  const dailyViewsTotal = dailyPageViews.reduce((total, entry) => total + entry.count, 0);
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

  const searchQueries = Object.entries(rows
    .filter((event) => event.event_name === "service_view" && String(event.page_path || "").startsWith("/__analytics/search?"))
    .reduce<Record<string, number>>((acc, event) => {
      const queryString = String(event.page_path || "").split("?")[1] || "";
      const query = new URLSearchParams(queryString).get("q")?.trim().replace(/\s+/g, " ").slice(0, 80);
      if (!query || /@/.test(query) || /\d{7,}/.test(query)) return acc;
      acc[query] = (acc[query] || 0) + 1;
      return acc;
    }, {}))
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

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

  const countryViews = Object.entries(pageViewRows.reduce<Record<string, number>>((acc, event) => {
    const code = event.country_code?.trim().toUpperCase();
    if (!code || !/^[A-Z]{2}$/.test(code) || code === "ZZ") return acc;
    acc[code] = (acc[code] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);
  const countryViewsTotal = countryViews.reduce((total, [, count]) => total + count, 0);
  const countryNames = new Intl.DisplayNames(["en"], { type: "region" });
  const countries = countryViews.slice(0, 10).map(([code, views]) => ({
    code,
    name: countryNames.of(code) || code,
    views,
    share: countryViewsTotal > 0 ? Math.round((views / countryViewsTotal) * 100) : 0,
  }));

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
        <div><span className="eyebrow">Insights</span><h1>Analytics</h1><p>Public website activity · {fromKey} to {toKey}.</p></div>
        <div className="admin-analytics-actions">
          <form className="admin-range-form" action="/admin/analytics" method="get">
            <label className="admin-visually-hidden" htmlFor="admin-analytics-range">Analytics date range</label>
            <select id="admin-analytics-range" name="range" defaultValue={rangeKey}>
              <option value="today">Today</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="custom">Custom range</option>
            </select>
            <label className="admin-visually-hidden" htmlFor="admin-analytics-from">Start date</label>
            <input id="admin-analytics-from" name="from" type="date" defaultValue={fromKey} />
            <label className="admin-visually-hidden" htmlFor="admin-analytics-to">End date</label>
            <input id="admin-analytics-to" name="to" type="date" defaultValue={toKey} />
            <button type="submit">Apply</button>
          </form>
          <AnalyticsRefreshButton />
        </div>
      </div>

      <div className="admin-stats admin-stats--control">{cards.map(([label, value, Icon]) => <article key={label}><span><Icon size={19} /></span><strong>{value}</strong><p>{label}</p></article>)}</div>

      <section className="admin-panel admin-panel--control admin-traffic-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><BarChart3 size={15} /> Traffic trend</span><h2>Daily page views</h2><p>Public page views across the selected period, grouped by Pakistan time.</p></div>
          <span className="admin-traffic-total"><strong>{dailyViewsTotal.toLocaleString("en-PK")}</strong><small>page views</small></span>
        </div>
        <AdminTrafficChart data={dailyPageViews} maximum={dailyViewsMax} rangeDays={rangeDays} />
        {(events || []).length >= 5000 && <p className="admin-traffic-note">This view uses the latest 5,000 tracked events.</p>}
      </section>

      <section className="admin-panel admin-panel--control admin-global-panel" aria-labelledby="admin-global-title">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><Globe2 size={15} /> Global reach</span><h2 id="admin-global-title">Traffic by country</h2><p>Approximate country-level locations derived from tracked page views, not precise GPS.</p></div>
          <span className="admin-traffic-total"><strong>{countryViewsTotal.toLocaleString("en-PK")}</strong><small>views with country data</small></span>
        </div>
        <AdminWorldMap countries={countries} />
        <p className="admin-map-attribution">Map artwork by Al MacDonald and Fritz Lekschas · <a href="https://github.com/flekschas/simple-world-map" target="_blank" rel="noopener noreferrer">Simple World Map</a> · CC BY-SA 3.0.</p>
      </section>

      <AdminGoogleBusinessInsights profileUrl={settings?.google_business_profile_url} />

      <section className="admin-panel admin-panel--control admin-google-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><Building2 size={15} /> Website attribution</span><h2>{settings?.business_name || "Business profile"}</h2><p>Website visits attributed to the tracked Google Business Profile link. These are not Google Search or Maps impression counts.</p></div>
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
        <section className="admin-panel admin-panel--control"><div className="admin-panel__heading"><div><span className="admin-panel-kicker"><Search size={15} /> Search</span><h2>Top service searches</h2></div></div><InsightBars rows={searchQueries} emptyMessage="No tracked service searches yet." /></section>
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
