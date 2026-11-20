import type { CSSProperties } from "react";
import { BarChart3, Building2, ExternalLink, Globe2, MousePointerClick, Users } from "lucide-react";
import { AnalyticsRefreshButton } from "@/components/analytics-refresh-button";
import { AdminTrendChart } from "@/components/admin-trend-chart";
import { AdminMixDonut } from "@/components/admin-mix-donut";
import { requireAdmin } from "@/lib/admin";
import { SITE_URL } from "@/lib/env";
import { karachiAnalyticsWindow, karachiDayKey } from "@/lib/admin-analytics-window";
import { normalizeAdminAnalyticsRange, analyticsSelectedDays, filterEventsForDays, contactConversionRate } from "@/lib/admin-analytics-range";

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

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const { range } = await searchParams;
  const selectedRange = normalizeAdminAnalyticsRange(range);
  const { supabase } = await requireAdmin();
  // Server-only admin page: request-time wall clock defines the reporting period.
  // eslint-disable-next-line react-hooks/purity
  const now = new Date();
  const { since, until, days } = karachiAnalyticsWindow(now);
  const selectedDays = analyticsSelectedDays(days, selectedRange);
  const [{ events, truncated }, { data: settings, error: settingsError }, { data: categories, error: categoryError }] = await Promise.all([
    loadTrackedEvents(supabase, since, until),
    supabase.from("business_settings").select("business_name,google_business_profile_url").eq("id", true).single(),
    supabase.from("service_categories").select("slug,title"),
  ]);
  if (settingsError || categoryError) throw new Error("Analytics settings could not be loaded. Please retry.");

  const categoryTitles = new Map((categories || []).map((category) => [category.slug, category.title]));
  const publicRows = events.filter((event) => {
    const path = String(event.page_path || "/");
    return path !== "/admin" && !path.startsWith("/admin/");
  });
  // Important: every KPI, source, device and contact panel shares one selected date range.
  const rows = filterEventsForDays(publicRows, selectedDays);
  const pageViewRows = rows.filter((event) => event.event_name === "page_view");
  // A complete 30-day series allows the chart to compare the two latest weeks
  // while the rest of the page uses the selected 7- or 30-day window.
  const allPageViewRows = publicRows.filter((event) => event.event_name === "page_view");
  const dailyPageViews = days.map((key) => ({
    key,
    label: analyticsTickFormatter.format(new Date(key + "T12:00:00Z")),
    count: 0,
  }));
  const dailyPageViewsByDay = new Map(dailyPageViews.map((entry) => [entry.key, entry]));
  for (const event of allPageViewRows) {
    const entry = dailyPageViewsByDay.get(karachiDayKey(new Date(event.created_at)));
    if (entry) entry.count += 1;
  }
  const selectedDailyPageViews = dailyPageViews.slice(-selectedRange);
  const totalDailyPageViews = selectedDailyPageViews.reduce((total, day) => total + day.count, 0);
  const busiestDay = selectedDailyPageViews.reduce((highest, day) => day.count > highest.count ? day : highest);
  const busiestShare = totalDailyPageViews > 0 ? Math.round(busiestDay.count / totalDailyPageViews * 100) : 0;

  const contactRows = rows.filter((event) => contactEvents.has(event.event_name));
  const visitors = new Set(rows.map((event) => event.session_hash).filter(Boolean)).size;
  const pageViews = pageViewRows.length;
  const contactVisitors = new Set(contactRows.map((event) => event.session_hash).filter(Boolean)).size;
  const conversionRate = contactConversionRate(contactVisitors, visitors);

  const googleRows = rows.filter((event) =>
    event.utm_source?.toLowerCase() === "google" && event.utm_campaign?.toLowerCase() === "gbp",
  );
  const googleVisitors = new Set(googleRows.map((event) => event.session_hash).filter(Boolean)).size;
  const googlePageViews = googleRows.filter((event) => event.event_name === "page_view").length;
  const googleContactVisitors = new Set(
    googleRows.filter((event) => contactEvents.has(event.event_name)).map((event) => event.session_hash).filter(Boolean),
  ).size;
  const googleConversion = contactConversionRate(googleContactVisitors, googleVisitors);

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
    ["Tracked browsers", visitors, Users],
    ["Page views", pageViews, BarChart3],
    ["Contact visitors", contactVisitors, MousePointerClick],
    ["Contact rate", `${conversionRate}%`, Globe2],
  ] as const;

  const topService = serviceInterest[0];
  const topSource = sources[0];

  const trackingUrl = `${SITE_URL.replace(/\/$/, "")}/?utm_source=google&utm_medium=organic&utm_campaign=gbp`;

  return (
    <div className="admin-content admin-control-page">
      <div className="admin-page-heading admin-page-heading--control">
        <div><span className="eyebrow">Website intelligence</span><h1>Analytics</h1><p>Real event data · consistent reporting period · Pakistan time</p></div>
        <AnalyticsRefreshButton />
      </div>

      <div className="admin-analytics-period" role="status"><span>{selectedDays[0]} — {selectedDays.at(-1)} · PKT · {selectedRange} days</span><strong>{truncated ? "Partial data · latest 5,000 events" : "All recorded events loaded"}</strong></div>
      <details className="admin-data-quality"><summary>How accurate is this data?</summary><p>Visits are tracked browser estimates, not verified people. Historical data may contain automated or test traffic; previews are now excluded. Counts are not a sales total.</p></details>

      <div className="admin-stats admin-stats--control">{cards.map(([label, value, Icon]) => <article key={label}><span><Icon size={19} /></span><strong>{value}</strong><p>{label}</p></article>)}</div>

      <section className="admin-panel admin-panel--control admin-traffic-panel" aria-labelledby="admin-traffic-trend-title">
        <div className="admin-panel__heading">
          <div><h2 id="admin-traffic-trend-title">Traffic trend</h2><p>Page views · all dashboard metrics follow the 7/30-day selection</p></div>
        </div>
        <AdminTrendChart points={dailyPageViews.map((day) => ({ key: day.key, label: day.label, count: day.count }))} range={selectedRange} partial={truncated} />
        {busiestShare >= 35 && totalDailyPageViews >= 20 && (
          <p className="admin-traffic-outlier" role="note">
            <strong>Traffic concentration</strong>
            {busiestShare}% of {truncated ? "sampled" : "recorded"} page views came on {busiestDay.label} ({busiestDay.count.toLocaleString("en-PK")} views). Large spikes can include repeated or automated requests.
          </p>
        )}
        {truncated && <p className="admin-traffic-note">Partial sample: only the latest 5,000 tracked events are included.</p>}
      </section>

      <section className="admin-analytics-highlights" aria-label="Traffic highlights">
        <article>
          <span>BUSIEST DAY</span>
          <strong>{busiestDay.count.toLocaleString("en-PK")}</strong>
          <small>{busiestDay.label} · {truncated ? "sampled page views" : "recorded page views"}</small>
        </article>
        <article>
          <span>MOST-VIEWED SERVICE</span>
          <strong title={topService?.[0]}>{topService?.[0] || "No service visits"}</strong>
          <small>{topService ? topService[1].toLocaleString("en-PK") + " page views" : "No data in this period"}</small>
        </article>
        <article>
          <span>TOP TRAFFIC SOURCE</span>
          <strong title={topSource?.[0]}>{topSource?.[0] || "No traffic source"}</strong>
          <small>{topSource ? topSource[1].toLocaleString("en-PK") + " page views" : "No data in this period"}</small>
        </article>
      </section>

      <section className="admin-panel admin-panel--control admin-google-panel">
        <div className="admin-panel__heading">
          <div><span className="admin-panel-kicker"><Building2 size={15} /> Google Business</span><h2>{settings?.business_name || "Business profile"}</h2><p>Website traffic attributed to your Google Business Profile.</p></div>
          {settings?.google_business_profile_url && <a className="admin-inline-link" href={settings.google_business_profile_url} target="_blank" rel="noopener noreferrer">Open profile <ExternalLink size={13} /></a>}
        </div>
        <div className="admin-google-metrics">
          <span><strong>{googleVisitors}</strong><small>Tracked browsers</small></span>
          <span><strong>{googlePageViews}</strong><small>Page views</small></span>
          <span><strong>{googleContactVisitors}</strong><small>Contact visitors</small></span>
          <span><strong>{googleConversion}%</strong><small>Contact rate</small></span>
        </div>
        <details className="admin-tracking-details">
          <summary>Google tracking link</summary>
          <div className="admin-tracking-link">
            <div><strong>Tracked website link</strong><small>Use as your Google Business Profile website link.</small></div>
            <code>{trackingUrl}</code>
            <a className="admin-inline-link" href={trackingUrl} target="_blank" rel="noopener noreferrer">Test <ExternalLink size={13} /></a>
          </div>
        </details>
      </section>

      <div className="admin-analytics-overview-grid">
        <section className="admin-panel admin-panel--control">
          <div className="admin-panel__heading"><h2>Contact actions</h2></div>
          <InsightBars rows={contactActions} emptyMessage="No contact clicks yet." />
        </section>
        <section className="admin-panel admin-panel--control">
          <div className="admin-panel__heading"><h2>Device mix</h2></div>
          <AdminMixDonut rows={devices} label="Page views by device" />
        </section>
        <section className="admin-panel admin-panel--control">
          <div className="admin-panel__heading"><h2>Top services</h2></div>
          <InsightBars rows={serviceInterest.slice(0, 6)} emptyMessage="No service visits yet." />
        </section>
        <section className="admin-panel admin-panel--control">
          <div className="admin-panel__heading"><h2>Traffic sources</h2></div>
          <InsightBars rows={sources.slice(0, 6)} emptyMessage="No source data yet." />
        </section>
      </div>
      <details className="admin-analytics-deep-dive">
        <summary>More insights <span>Pages & locations</span></summary>
        <div className="admin-two-column admin-insights-grid">
          <section className="admin-panel admin-panel--control"><div className="admin-panel__heading"><h2>Popular pages</h2></div><InsightBars rows={pages} emptyMessage="No public data yet." /></section>
          <section className="admin-panel admin-panel--control"><div className="admin-panel__heading"><h2>Approximate cities</h2></div><InsightBars rows={cities} emptyMessage="No location data yet." /></section>
        </div>
      </details>

    </div>
  );
}
