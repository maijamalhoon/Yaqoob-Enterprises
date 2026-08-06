import { createHash, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const allowedEvents = new Set(["page_view", "whatsapp_click", "call_click", "directions_click", "service_view"]);
const botPattern = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|uptimerobot/i;
const rateLimitWindowMs = 60_000;
const rateLimitMaximum = 30;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

type HeaderReader = { get(name: string): string | null };

function deviceType(userAgent: string) {
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "mobile";
  return "desktop";
}

function safeDecode(value: string | null) {
  if (!value) return null;
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
}

function safeReferrerHost(value: string | null) {
  if (!value) return null;
  try {
    return new URL(value).hostname.slice(0, 160);
  } catch {
    return null;
  }
}

function clientIp(requestHeaders: HeaderReader) {
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();

  if (rateLimitBuckets.size > 1_000) {
    for (const [bucketKey, bucket] of rateLimitBuckets) {
      if (bucket.resetAt <= now) rateLimitBuckets.delete(bucketKey);
    }
  }

  const current = rateLimitBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + rateLimitWindowMs });
    return false;
  }

  current.count += 1;
  return current.count > rateLimitMaximum;
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > 2_048) {
    return NextResponse.json({ ok: false }, { status: 413 });
  }
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json({ ok: false }, { status: 415 });
  }

  let body: { eventName?: string; pagePath?: string };
  try {
    body = (await request.json()) as { eventName?: string; pagePath?: string };
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!body.eventName || !allowedEvents.has(body.eventName)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const pagePath = String(body.pagePath || "/").trim().slice(0, 240);
  if (!pagePath.startsWith("/") || pagePath === "/admin" || pagePath.startsWith("/admin/")) {
    return NextResponse.json({ ok: true, ignored: true });
  }

  try {
    const requestHeaders = await headers();
    const userAgent = requestHeaders.get("user-agent") || "";
    if (
      botPattern.test(userAgent) ||
      requestHeaders.get("dnt") === "1" ||
      requestHeaders.get("sec-gpc") === "1"
    ) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const supabase = await createServerSupabaseClient();
    const { data: authData } = await supabase.auth.getUser();
    if (authData.user) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const cookieStore = await cookies();
    let sessionId = cookieStore.get("ye_session")?.value;
    if (!sessionId) {
      sessionId = randomUUID();
      cookieStore.set("ye_session", sessionId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    const sessionHash = createHash("sha256").update(sessionId).digest("hex");
    const limitKey = `${clientIp(requestHeaders)}:${sessionHash.slice(0, 20)}`;
    if (isRateLimited(limitKey)) {
      return NextResponse.json(
        { ok: false },
        { status: 429, headers: { "Retry-After": String(rateLimitWindowMs / 1_000) } },
      );
    }

    const { error } = await supabase.from("analytics_events").insert({
      event_name: body.eventName,
      page_path: pagePath,
      referrer_host: safeReferrerHost(requestHeaders.get("referer")),
      country_code: requestHeaders.get("x-vercel-ip-country")?.slice(0, 8) || null,
      city_name: safeDecode(requestHeaders.get("x-vercel-ip-city"))?.slice(0, 120) || null,
      device_type: deviceType(userAgent),
      session_hash: sessionHash,
    });

    if (error) {
      console.error("Analytics insert failed", { code: error.code });
      return NextResponse.json({ ok: false }, { status: 503 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Analytics request failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
