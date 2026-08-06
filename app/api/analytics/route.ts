import { createHash, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const allowedEvents = new Set(["page_view", "whatsapp_click", "call_click", "directions_click", "service_view"]);
const botPattern = /bot|crawler|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|uptimerobot/i;

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
    return new URL(value).hostname;
  } catch {
    return null;
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { eventName?: string; pagePath?: string };
    if (!body.eventName || !allowedEvents.has(body.eventName)) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const pagePath = String(body.pagePath || "/").slice(0, 240);
    if (!pagePath.startsWith("/") || pagePath === "/admin" || pagePath.startsWith("/admin/")) {
      return NextResponse.json({ ok: true, ignored: true });
    }

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
    await supabase.from("analytics_events").insert({
      event_name: body.eventName,
      page_path: pagePath,
      referrer_host: safeReferrerHost(requestHeaders.get("referer")),
      country_code: requestHeaders.get("x-vercel-ip-country"),
      city_name: safeDecode(requestHeaders.get("x-vercel-ip-city")),
      device_type: deviceType(userAgent),
      session_hash: sessionHash,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
