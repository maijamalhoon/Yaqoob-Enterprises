import Link from "next/link";
import { Activity, Images, MapPinned, MousePointerClick, Settings2, Wrench } from "lucide-react";
import { requireAdmin } from "@/lib/admin";

export default async function AdminDashboardPage() {
  const { supabase } = await requireAdmin();
  // Server-only admin page: request-time wall clock intentionally defines the rolling 30-day activity window.
  // eslint-disable-next-line react-hooks/purity
  const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const [services, coverage, gallery, events, recent] = await Promise.all([
    supabase.from("services").select("id", { count: "exact", head: true }),
    supabase.from("coverage_areas").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("gallery_images").select("id", { count: "exact", head: true }).eq("is_active", true),
    supabase.from("analytics_events").select("id", { count: "exact", head: true }).gte("created_at", since),
    supabase.from("analytics_events").select("event_name,page_path,city_name,device_type,created_at").order("created_at", { ascending: false }).limit(8),
  ]);

  const cards = [
    ["Services", services.count || 0, Wrench],
    ["Coverage areas", coverage.count || 0, MapPinned],
    ["Gallery images", gallery.count || 0, Images],
    ["30-day events", events.count || 0, Activity],
  ] as const;

  return (
    <div className="admin-content">
      <div className="admin-page-heading">
        <div>
          <span className="eyebrow">Overview</span>
          <h1>Admin dashboard</h1>
          <p>See website activity and jump straight into the tasks you use most.</p>
        </div>
      </div>

      <div className="admin-stats">
        {cards.map(([label, value, Icon]) => <article key={label}><span><Icon size={20} /></span><strong>{value}</strong><p>{label}</p></article>)}
      </div>

      <section className="admin-panel">
        <div className="admin-panel__heading">
          <div><h2>Common tasks</h2><p>Keep routine updates one click away.</p></div>
          <Settings2 />
        </div>
        <div className="admin-quick-actions">
          <Link className="button button--primary" href="/admin/services"><Wrench size={16} /> Edit services</Link>
          <Link className="button button--secondary" href="/admin/settings"><Settings2 size={16} /> Hours & settings</Link>
          <Link className="button button--secondary" href="/admin/gallery"><Images size={16} /> Manage gallery</Link>
        </div>
      </section>

      <section className="admin-panel">
        <div className="admin-panel__heading"><div><h2>Recent website activity</h2><p>Approximate aggregated activity only—no exact visitor address or full IP is stored.</p></div><MousePointerClick /></div>
        <div className="admin-table-wrap">
          <table><thead><tr><th>Event</th><th>Page</th><th>City</th><th>Device</th><th>Time</th></tr></thead><tbody>
            {(recent.data || []).map((event, index) => <tr key={`${event.created_at}-${index}`}><td>{event.event_name.replaceAll("_", " ")}</td><td>{event.page_path}</td><td>{event.city_name || "Unknown"}</td><td>{event.device_type || "Unknown"}</td><td>{new Date(event.created_at).toLocaleString("en-PK")}</td></tr>)}
            {(recent.data || []).length === 0 && <tr><td colSpan={5}>No activity recorded yet.</td></tr>}
          </tbody></table>
        </div>
      </section>
    </div>
  );
}
