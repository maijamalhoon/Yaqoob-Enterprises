"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, MonitorSmartphone, MousePointerClick, RefreshCw, Search } from "lucide-react";

type Row = { key: string; clicks: number; impressions: number; ctr: number; position: number };
type Payload = {
  configured: boolean;
  message?: string;
  error?: string;
  siteUrl?: string;
  range?: { from: string; to: string };
  queries?: Row[] | null;
  pages?: Row[] | null;
  countries?: Row[] | null;
  devices?: Row[] | null;
  warning?: string | null;
};

const number = (value: number) => value.toLocaleString("en-PK");

function RankingTable({ title, rows, emptyLabel, metric }: {
  title: string;
  rows: Row[] | null | undefined;
  emptyLabel: string;
  metric: "clicks" | "impressions";
}) {
  return (
    <section className="admin-gbp-subpanel">
      <div className="admin-gbp-subheading"><h3>{title}</h3><span>{metric === "clicks" ? "Clicks" : "Impressions"}</span></div>
      {rows?.length ? (
        <ol className="admin-gbp-keywords">
          {rows.slice(0, 10).map((row, index) => (
            <li key={`${row.key}-${index}`}>
              <span>{row.key}</span>
              <strong>{number(row[metric])}</strong>
            </li>
          ))}
        </ol>
      ) : <p className="admin-gbp-empty">{emptyLabel}</p>}
    </section>
  );
}

export function AdminSearchConsoleInsights() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    try {
      const response = await fetch("/api/admin/search-console", { cache: "no-store" });
      setData(await response.json() as Payload);
    } catch {
      setData({ configured: true, error: "Search Console data could not be loaded. Try refreshing." });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    void fetch("/api/admin/search-console", { cache: "no-store" })
      .then(async (response) => await response.json() as Payload)
      .then((payload) => { if (active) setData(payload); })
      .catch(() => {
        if (active) setData({ configured: true, error: "Search Console data could not be loaded. Try refreshing." });
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const queryRows = data?.queries || [];
  const totalClicks = queryRows.reduce((sum, row) => sum + row.clicks, 0);
  const totalImpressions = queryRows.reduce((sum, row) => sum + row.impressions, 0);

  return (
    <section className="admin-panel admin-panel--control admin-gbp-panel" aria-labelledby="admin-search-console-title">
      <div className="admin-panel__heading">
        <div>
          <span className="admin-panel-kicker"><Search size={15} /> Google Search Console</span>
          <h2 id="admin-search-console-title">Organic search</h2>
          <p>{data?.range ? `${data.range.from} — ${data.range.to} · latest available data` : "Search terms that bring people to your website."}</p>
        </div>
        <div className="admin-gbp-actions">
          {data?.siteUrl && <a className="admin-inline-link" href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">Open report <ExternalLink size={13} /></a>}
          <button type="button" className="admin-icon-button" onClick={() => void load(true)} disabled={loading || refreshing} aria-label="Refresh Search Console data" title="Refresh">
            <RefreshCw size={16} className={refreshing ? "admin-gbp-spin" : undefined} />
          </button>
        </div>
      </div>

      {loading && <div className="admin-gbp-state" role="status">Loading search performance…</div>}
      {!loading && data && !data.configured && <div className="admin-gbp-state"><strong>Search Console connection needed</strong><p>Connect a verified Search Console property to see real Google queries, clicks, impressions and device/country breakdowns. No estimates are shown.</p></div>}
      {!loading && data?.error && <div className="admin-gbp-state" role="status">{data.error}</div>}

      {!loading && data?.configured && !data.error && (
        <>
          <div className="admin-gbp-metrics admin-search-console-metrics">
            <article><span><MousePointerClick size={16} /></span><strong>{number(totalClicks)}</strong><small>Clicks in top query rows</small></article>
            <article><span><Search size={16} /></span><strong>{number(totalImpressions)}</strong><small>Impressions in top query rows</small></article>
            <article><span><MonitorSmartphone size={16} /></span><strong>{number(queryRows.length)}</strong><small>Queries returned</small></article>
          </div>
          {data.warning && <p className="admin-gbp-notice">{data.warning}</p>}
          <div className="admin-gbp-columns">
            <RankingTable title="Search queries" rows={data.queries} emptyLabel="No query rows returned for this period." metric="clicks" />
            <RankingTable title="Top landing pages" rows={data.pages} emptyLabel="No landing page data returned." metric="clicks" />
            <RankingTable title="Countries" rows={data.countries} emptyLabel="No country data returned." metric="clicks" />
            <RankingTable title="Devices" rows={data.devices} emptyLabel="No device data returned." metric="clicks" />
          </div>
          <p className="admin-gbp-notice">Search Console may omit low-volume queries for privacy. Click totals above summarize the displayed top query rows, not all site clicks.</p>
        </>
      )}
    </section>
  );
}
