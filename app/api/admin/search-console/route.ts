import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { SITE_URL } from "@/lib/env";

export const dynamic = "force-dynamic";

type SearchRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

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
  if (!response.ok) throw new Error("Google authorization failed.");
  const data = await response.json() as { access_token?: string };
  return data.access_token || null;
}

async function querySearchConsole(siteUrl: string, token: string, dimensions: string[]) {
  const end = new Date();
  end.setUTCDate(end.getUTCDate() - 3);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - 27);
  const dateString = (date: Date) => date.toISOString().slice(0, 10);
  const response = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: {
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        startDate: dateString(start),
        endDate: dateString(end),
        dimensions,
        rowLimit: 10,
        type: "web",
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(12_000),
    },
  );
  if (!response.ok) throw new Error(`Search Console request failed (${response.status}).`);
  const payload = await response.json() as { rows?: SearchRow[] };
  return (payload.rows || []).map((row) => ({
    key: (row.keys || []).join(" · "),
    clicks: Math.max(0, Math.round(Number(row.clicks) || 0)),
    impressions: Math.max(0, Math.round(Number(row.impressions) || 0)),
    ctr: Math.max(0, Number(row.ctr) || 0),
    position: Math.max(0, Number(row.position) || 0),
  }));
}

export async function GET() {
  await requireAdmin();

  const clientReady = Boolean(
    process.env.GOOGLE_BUSINESS_CLIENT_ID
    && process.env.GOOGLE_BUSINESS_CLIENT_SECRET
    && process.env.GOOGLE_BUSINESS_REFRESH_TOKEN,
  );
  if (!clientReady) {
    return NextResponse.json({
      configured: false,
      message: "Connect Google Search Console to view real search queries and clicks.",
    }, { headers: { "Cache-Control": "private, no-store" } });
  }

  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_PROPERTY_URL || `${SITE_URL.replace(/\/$/, "")}/`;
  try {
    const token = await getAccessToken();
    if (!token) return NextResponse.json({ configured: false, message: "Google authorization is not configured." });
    const [queries, pages, countries, devices] = await Promise.allSettled([
      querySearchConsole(siteUrl, token, ["query"]),
      querySearchConsole(siteUrl, token, ["page"]),
      querySearchConsole(siteUrl, token, ["country"]),
      querySearchConsole(siteUrl, token, ["device"]),
    ]);
    const rows = (result: PromiseSettledResult<Awaited<ReturnType<typeof querySearchConsole>>>) =>
      result.status === "fulfilled" ? result.value : null;
    const failed = [queries, pages, countries, devices].some((result) => result.status === "rejected");
    return NextResponse.json({
      configured: true,
      siteUrl,
      range: {
        from: (() => { const date = new Date(); date.setUTCDate(date.getUTCDate() - 30); return date.toISOString().slice(0, 10); })(),
        to: (() => { const date = new Date(); date.setUTCDate(date.getUTCDate() - 3); return date.toISOString().slice(0, 10); })(),
      },
      queries: rows(queries),
      pages: rows(pages),
      countries: rows(countries),
      devices: rows(devices),
      warning: failed ? "Some Search Console reports could not be loaded. Check property verification and API access." : null,
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({
      configured: true,
      error: "Search Console data is unavailable. Confirm the property is verified and the OAuth account has read access.",
    }, { headers: { "Cache-Control": "private, no-store" } });
  }
}
