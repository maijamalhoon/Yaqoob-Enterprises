import { BarChart3, Globe2, MonitorSmartphone, MousePointerClick, Users } from "lucide-react";
import { requireAdmin } from "@/lib/admin";

export default async function AdminAnalyticsPage() {
  const { supabase } = await requireAdmin();
  const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { data: events } = await supabase
    .from("analytics_events")
    .select("event_name,page_path,country_code,city_name,device_type,session_hash,created_at")
    .gte("created_at", start)
    .order("created_at", { ascending: false })
    .limit(5000);

  const rows = events || [];
  const visitors = new Set(rows.map((event) => event.session_hash).filter(Boolean)).size;
  const pageViews = rows.filter((event) => event.event_name === "page_view").length;
  const contactClicks = rows.filter((event) => ["whatsapp_click", "call_click", "directions_click"].includes(event.event_name)).length;
  const cities = Object.entries(rows.reduce<Record<string, number>>((acc, event) => {
    const city = event.city_name || "Unknown";
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const pages = Object.entries(rows.reduce<Record<string, number>>((acc, event) => {
    if (event.event_name === "page_view") acc[event.page_path] = (acc[event.page_path] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const devices = Object.entries(rows.reduce<Record<string, number>>((acc, event) => {
    const device = event.device_type || "Unknown";
    acc[device] = (acc[device] || 0) + 1;
    return acc;
  }, {})).sort((a, b) => b[1] - a[1]);

  const cards = [
    ["Estimated visitors", visitors, Users],
    ["Page views", pageViews, BarChart3],
    ["Contact clicks", contactClicks, MousePointerClick],
    ["Recorded events", rows.length, Globe2],
  ] as const;

  return (
    <div className="admin-content">
      <div className="admin-page-heading"><div><span className="eyebrow">Insights</span><h1>Website analytics</h1><p>Last 30 days. Visitor count is an estimate based on anonymous session hashes.</p></div></div>
      <div className="admin-stats">{cards.map(([label, value, Icon]) => <article key={label}><span><Icon size={20} /></span><strong>{value}</strong><p>{label}</p></article>)}</div>
      <div className="admin-two-column">
        <section className="admin-panel"><div className="admin-panel__heading"><div><h2>Popular pages</h2><p>Page views by route</p></div><BarChart3 /></div><div className="rank-list">{pages.map(([page, count]) => <div key={page}><span>{page}</span><strong>{count}</strong></div>)}{pages.length === 0 && <p>No data yet.</p>}</div></section>
        <section className="admin-panel"><div className="admin-panel__heading"><div><h2>Approximate cities</h2><p>Supplied by the hosting network where available</p></div><Globe2 /></div><div className="rank-list">{cities.map(([city, count]) => <div key={city}><span>{city}</span><strong>{count}</strong></div>)}</div></section>
        <section className="admin-panel"><div className="admin-panel__heading"><div><h2>Device mix</h2><p>Basic user-agent classification</p></div><MonitorSmartphone /></div><div className="rank-list">{devices.map(([device, count]) => <div key={device}><span>{device}</span><strong>{count}</strong></div>)}</div></section>
      </div>
    </div>
  );
}
