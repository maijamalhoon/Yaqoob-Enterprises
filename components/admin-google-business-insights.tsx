"use client";

import { useCallback, useEffect, useState } from "react";
import { ExternalLink, MapPinned, MessageCircle, Phone, RefreshCw, Search, Star, Store } from "lucide-react";

type Keyword = { keyword: string; count: number | null; displayCount: string; isThreshold: boolean };
type Review = { name: string; rating: string; comment: string; createdAt: string; updatedAt: string; reply: string };
type InsightsPayload = {
  configured: boolean;
  missing?: string[];
  message?: string;
  error?: string;
  range?: { from: string; to: string };
  metrics?: {
    totals: { searchViews: number; mapsViews: number; calls: number; directions: number; websiteClicks: number; messages: number };
    daily: Array<{ date: string; searchViews: number; mapsViews: number; calls: number; directions: number; websiteClicks: number; messages: number }>;
  } | null;
  keywords?: Keyword[] | null;
  reviews?: { averageRating: number; totalReviewCount: number; reviews: Review[] } | null;
  errors?: { metrics?: string | null; keywords?: string | null; reviews?: string | null };
};

const number = (value: number) => value.toLocaleString("en-PK");
const ratingLabel = (rating: string) => {
  const map: Record<string, string> = {
    ONE: "1", TWO: "2", THREE: "3", FOUR: "4", FIVE: "5",
  };
  return map[rating] || rating;
};

export function AdminGoogleBusinessInsights({ profileUrl }: { profileUrl?: string | null }) {
  const [data, setData] = useState<InsightsPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (refresh = false) => {
    if (refresh) setRefreshing(true);
    else setLoading(true);
    try {
      const response = await fetch("/api/admin/google-business", { cache: "no-store" });
      const payload = await response.json() as InsightsPayload;
      setData(payload);
    } catch {
      setData({ configured: true, error: "Google Business Profile data could not be loaded. Try refreshing." });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const totals = data?.metrics?.totals;
  const cards = totals ? [
    { label: "Search views", value: totals.searchViews, Icon: Search },
    { label: "Maps views", value: totals.mapsViews, Icon: Store },
    { label: "Calls", value: totals.calls, Icon: Phone },
    { label: "Directions", value: totals.directions, Icon: MapPinned },
    { label: "Website clicks", value: totals.websiteClicks, Icon: ExternalLink },
    { label: "Message clicks", value: totals.messages, Icon: MessageCircle },
  ] : [];

  return (
    <section className="admin-panel admin-panel--control admin-gbp-panel" aria-labelledby="admin-gbp-title">
      <div className="admin-panel__heading">
        <div>
          <span className="admin-panel-kicker"><Store size={15} /> Google Business Profile</span>
          <h2 id="admin-gbp-title">Profile performance</h2>
          <p>{data?.range ? `${data.range.from} — ${data.range.to} · Google reporting may be delayed` : "Official Google Search, Maps and review data."}</p>
        </div>
        <div className="admin-gbp-actions">
          {profileUrl && <a className="admin-inline-link" href={profileUrl} target="_blank" rel="noopener noreferrer">Open profile <ExternalLink size={13} /></a>}
          <button type="button" className="admin-icon-button" onClick={() => void load(true)} disabled={loading || refreshing} aria-label="Refresh Google Business Profile insights" title="Refresh insights">
            <RefreshCw size={16} className={refreshing ? "admin-gbp-spin" : undefined} />
          </button>
        </div>
      </div>

      {loading && <div className="admin-gbp-state" role="status">Loading official Google insights…</div>}

      {!loading && data && !data.configured && (
        <div className="admin-gbp-state">
          <strong>Google connection needed</strong>
          <p>Official profile metrics, search terms and reviews will appear here after the Google API connection is configured. No sample numbers are shown.</p>
        </div>
      )}

      {!loading && data?.error && <div className="admin-gbp-state" role="status">{data.error}</div>}

      {!loading && data?.configured && !data.error && (
        <>
          {totals && (
            <div className="admin-gbp-metrics">
              {cards.map(({ label, value, Icon }) => (
                <article key={label}>
                  <span><Icon size={16} aria-hidden="true" /></span>
                  <strong>{number(value)}</strong>
                  <small>{label}</small>
                </article>
              ))}
            </div>
          )}

          {data.errors?.metrics && <p className="admin-gbp-notice">{data.errors.metrics}</p>}

          <div className="admin-gbp-columns">
            <section className="admin-gbp-subpanel">
              <div className="admin-gbp-subheading"><h3>Top Google searches</h3><span>Monthly</span></div>
              {data.keywords?.length ? (
                <ol className="admin-gbp-keywords">
                  {data.keywords.slice(0, 10).map((keyword) => (
                    <li key={keyword.keyword}>
                      <span>{keyword.keyword}</span>
                      <strong>{keyword.isThreshold ? keyword.displayCount : number(keyword.count || 0)}</strong>
                    </li>
                  ))}
                </ol>
              ) : <p className="admin-gbp-empty">{data.errors?.keywords || "No keyword data returned for this period."}</p>}
              {data.errors?.keywords && data.keywords?.length ? <p className="admin-gbp-notice">{data.errors.keywords}</p> : null}
            </section>

            <section className="admin-gbp-subpanel">
              <div className="admin-gbp-subheading"><h3>Customer reviews</h3><span>Latest first</span></div>
              {data.reviews && (
                <div className="admin-gbp-rating">
                  <strong>{data.reviews.averageRating.toFixed(1)}</strong>
                  <span aria-label={`${data.reviews.averageRating.toFixed(1)} out of 5 stars`}><Star size={16} fill="currentColor" /> Google rating</span>
                  <small>{number(data.reviews.totalReviewCount)} total reviews</small>
                </div>
              )}
              {data.reviews?.reviews.length ? (
                <div className="admin-gbp-reviews">
                  {data.reviews.reviews.slice(0, 6).map((review, index) => (
                    <article key={`${review.updatedAt}-${index}`}>
                      <div className="admin-gbp-review-meta"><strong>{review.name}</strong><span><Star size={12} fill="currentColor" /> {ratingLabel(review.rating)}/5</span></div>
                      <p>{review.comment || "No written comment."}</p>
                      {review.reply && <small className="admin-gbp-reply">Owner reply: {review.reply}</small>}
                    </article>
                  ))}
                </div>
              ) : <p className="admin-gbp-empty">{data.errors?.reviews || "No reviews returned."}</p>}
              {data.errors?.reviews && data.reviews?.reviews.length ? <p className="admin-gbp-notice">{data.errors.reviews}</p> : null}
            </section>
          </div>
        </>
      )}
    </section>
  );
}
