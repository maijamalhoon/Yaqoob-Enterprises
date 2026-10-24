import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

type JsonRecord = Record<string, unknown>;
type DailyPoint = { date: string; value: number };

function asRecord(value: unknown): JsonRecord {
  return value && typeof value === "object" ? value as JsonRecord : {};
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function asText(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function asNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function dateParts(date: Date) {
  return {
    year: String(date.getUTCFullYear()),
    month: String(date.getUTCMonth() + 1),
    day: String(date.getUTCDate()),
  };
}

function resourceId(value: string | undefined, prefix: "accounts" | "locations") {
  const normalized = (value || "").trim().replace(new RegExp("^" + prefix + "/"), "");
  return /^[A-Za-z0-9_-]+$/.test(normalized) ? normalized : "";
}

async function readJson<T extends JsonRecord>(response: Response): Promise<T> {
  if (!response.ok) {
    // Keep upstream response bodies and any authorization detail out of admin logs/UI.
    throw new Error(`Google API request failed (${response.status}).`);
  }
  return await response.json() as T;
}

async function getAccessToken() {
  const clientId = process.env.GOOGLE_BUSINESS_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_BUSINESS_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_BUSINESS_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) return null;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });
  const data = await readJson<JsonRecord>(response);
  return asText(data.access_token) || null;
}

async function googleGet(url: string, token: string) {
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    cache: "no-store",
    signal: AbortSignal.timeout(12_000),
  });
  return readJson<JsonRecord>(response);
}

function summarizeDailyMetrics(payload: JsonRecord) {
  const metricPoints = new Map<string, Map<string, number>>();
  for (const groupValue of asArray(payload.multiDailyMetricTimeSeries)) {
    const group = asRecord(groupValue);
    for (const seriesValue of asArray(group.dailyMetricTimeSeries)) {
      const series = asRecord(seriesValue);
      const metric = asText(series.dailyMetric);
      if (!metric) continue;
      const points = metricPoints.get(metric) || new Map<string, number>();
      const timeSeries = asRecord(series.timeSeries);
      for (const pointValue of asArray(timeSeries.datedValues)) {
        const point = asRecord(pointValue);
        const date = [point.year, String(point.month || "").padStart(2, "0"), String(point.day || "").padStart(2, "0")].join("-");
        points.set(date, (points.get(date) || 0) + asNumber(point.value));
      }
      metricPoints.set(metric, points);
    }
  }

  const total = (metrics: string[]) => metrics.reduce((sum, metric) => {
    return sum + [...(metricPoints.get(metric)?.values() || [])].reduce((subtotal, value) => subtotal + value, 0);
  }, 0);
  const dates = new Set<string>();
  for (const points of metricPoints.values()) for (const date of points.keys()) dates.add(date);
  const daily = [...dates].sort().map((date) => {
    const get = (metrics: string[]) => metrics.reduce((sum, metric) => sum + (metricPoints.get(metric)?.get(date) || 0), 0);
    return {
      date,
      searchViews: get(["BUSINESS_IMPRESSIONS_DESKTOP_SEARCH", "BUSINESS_IMPRESSIONS_MOBILE_SEARCH"]),
      mapsViews: get(["BUSINESS_IMPRESSIONS_DESKTOP_MAPS", "BUSINESS_IMPRESSIONS_MOBILE_MAPS"]),
      calls: get(["CALL_CLICKS"]),
      directions: get(["BUSINESS_DIRECTION_REQUESTS"]),
      websiteClicks: get(["WEBSITE_CLICKS"]),
      messages: get(["MESSAGING_CLICKS"]),
    };
  });

  return {
    totals: {
      searchViews: total(["BUSINESS_IMPRESSIONS_DESKTOP_SEARCH", "BUSINESS_IMPRESSIONS_MOBILE_SEARCH"]),
      mapsViews: total(["BUSINESS_IMPRESSIONS_DESKTOP_MAPS", "BUSINESS_IMPRESSIONS_MOBILE_MAPS"]),
      calls: total(["CALL_CLICKS"]),
      directions: total(["BUSINESS_DIRECTION_REQUESTS"]),
      websiteClicks: total(["WEBSITE_CLICKS"]),
      messages: total(["MESSAGING_CLICKS"]),
    },
    daily,
  };
}

function normalizeKeywords(payload: JsonRecord) {
  return asArray(payload.searchKeywordsCounts).map((value) => {
    const row = asRecord(value);
    const insight = asRecord(row.insightsValue);
    const threshold = asText(insight.threshold);
    const actual = asText(insight.value);
    return {
      keyword: asText(row.searchKeyword),
      count: actual ? asNumber(actual) : null,
      displayCount: threshold ? `<${threshold}` : actual || "—",
      isThreshold: Boolean(threshold),
    };
  }).filter((row) => row.keyword).sort((a, b) => (b.count ?? -1) - (a.count ?? -1)).slice(0, 20);
}

function normalizeReviews(payload: JsonRecord) {
  return {
    averageRating: asNumber(payload.averageRating),
    totalReviewCount: asNumber(payload.totalReviewCount),
    reviews: asArray(payload.reviews).map((value) => {
      const review = asRecord(value);
      const reviewer = asRecord(review.reviewer);
      const reply = asRecord(review.reviewReply);
      return {
        name: asText(reviewer.displayName) || "Google user",
        rating: asText(review.starRating),
        comment: asText(review.comment),
        createdAt: asText(review.createTime),
        updatedAt: asText(review.updateTime),
        reply: asText(reply.comment),
      };
    }),
  };
}

export async function GET() {
  await requireAdmin();

  const missing = [
    !process.env.GOOGLE_BUSINESS_CLIENT_ID && "GOOGLE_BUSINESS_CLIENT_ID",
    !process.env.GOOGLE_BUSINESS_CLIENT_SECRET && "GOOGLE_BUSINESS_CLIENT_SECRET",
    !process.env.GOOGLE_BUSINESS_REFRESH_TOKEN && "GOOGLE_BUSINESS_REFRESH_TOKEN",
    !resourceId(process.env.GOOGLE_BUSINESS_ACCOUNT_ID, "accounts") && "GOOGLE_BUSINESS_ACCOUNT_ID",
    !resourceId(process.env.GOOGLE_BUSINESS_LOCATION_ID, "locations") && "GOOGLE_BUSINESS_LOCATION_ID",
  ].filter(Boolean);

  if (missing.length) {
    return NextResponse.json({ configured: false, missing, message: "Google Business Profile connection is not configured yet." });
  }

  try {
    const token = await getAccessToken();
    if (!token) return NextResponse.json({ configured: false, missing: ["Google OAuth refresh token"], message: "Google authorization is not configured." });

    const accountId = resourceId(process.env.GOOGLE_BUSINESS_ACCOUNT_ID, "accounts");
    const locationId = resourceId(process.env.GOOGLE_BUSINESS_LOCATION_ID, "locations");
    const now = new Date();
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 3));
    const start = new Date(end);
    start.setUTCDate(start.getUTCDate() - 29);
    const from = dateParts(start);
    const to = dateParts(end);
    const metricParams = new URLSearchParams();
    for (const metric of [
      "BUSINESS_IMPRESSIONS_DESKTOP_SEARCH",
      "BUSINESS_IMPRESSIONS_MOBILE_SEARCH",
      "BUSINESS_IMPRESSIONS_DESKTOP_MAPS",
      "BUSINESS_IMPRESSIONS_MOBILE_MAPS",
      "CALL_CLICKS",
      "BUSINESS_DIRECTION_REQUESTS",
      "WEBSITE_CLICKS",
      "MESSAGING_CLICKS",
    ]) metricParams.append("dailyMetrics", metric);
    for (const [key, value] of Object.entries({ startDate: from, endDate: to })) {
      for (const [part, partValue] of Object.entries(value)) {
        metricParams.set(`dailyRange.${key}.${part}`, partValue);
      }
    }

    const keywordStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
    const keywordEnd = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1));
    const keywordParams = new URLSearchParams({
      "monthlyRange.startMonth.year": String(keywordStart.getUTCFullYear()),
      "monthlyRange.startMonth.month": String(keywordStart.getUTCMonth() + 1),
      "monthlyRange.endMonth.year": String(keywordEnd.getUTCFullYear()),
      "monthlyRange.endMonth.month": String(keywordEnd.getUTCMonth() + 1),
      pageSize: "100",
    });

    const parent = `accounts/${accountId}/locations/${locationId}`;
    const [metricsResult, keywordsResult, reviewsResult] = await Promise.allSettled([
      googleGet(`https://businessprofileperformance.googleapis.com/v1/locations/${locationId}:fetchMultiDailyMetricsTimeSeries?${metricParams.toString()}`, token),
      googleGet(`https://businessprofileperformance.googleapis.com/v1/locations/${locationId}/searchkeywords/impressions/monthly?${keywordParams.toString()}`, token),
      googleGet(`https://mybusiness.googleapis.com/v4/${parent}/reviews?pageSize=20&orderBy=updateTime%20desc`, token),
    ]);

    const metrics = metricsResult.status === "fulfilled"
      ? summarizeDailyMetrics(metricsResult.value)
      : null;
    const keywords = keywordsResult.status === "fulfilled"
      ? normalizeKeywords(keywordsResult.value)
      : null;
    const reviews = reviewsResult.status === "fulfilled"
      ? normalizeReviews(reviewsResult.value)
      : null;

    return NextResponse.json({
      configured: true,
      range: { from: `${from.year}-${from.month}-${from.day}`, to: `${to.year}-${to.month}-${to.day}` },
      metrics,
      keywords,
      reviews,
      errors: {
        metrics: metricsResult.status === "rejected" ? "Google performance metrics are unavailable. Check API access and location permissions." : null,
        keywords: keywordsResult.status === "rejected" ? "Google search keywords are unavailable for this location or period." : null,
        reviews: reviewsResult.status === "rejected" ? "Google reviews are unavailable. Check verified location and API access." : null,
      },
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({
      configured: true,
      error: "Google authorization or API access failed. Check the configured OAuth credentials and enabled APIs.",
    }, { status: 200, headers: { "Cache-Control": "private, no-store" } });
  }
}
