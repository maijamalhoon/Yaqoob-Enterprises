import { createHash, randomUUID } from "node:crypto";
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

const allowedEvents = new Set(["page_view", "whatsapp_click", "call_click", "directions_click", "service_view"]);

function deviceType(userAgent: string) {
  if (/tablet|ipad/i.test(userAgent)) return "tablet";
  if (/mobile|android|iphone/i.test(userAgent)) return "mobile";
  return "desktop";
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { eventName?: string; pagePath?: string };
    if (!body.eventName || !allowedEvents.has(body.eventName)) {
      return NextResponse.json({ ok: false }, { status: 400 });
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

    const requestHeaders = await headers();
    const referrer = requestHeaders.get("referer");
    const referrerHost = referrer ? new URL(referrer).hostname : null;
    const userAgent = requestHeaders.get("user-agent") || "";
    const sessionHash = createHash("sha256").update(sessionId).digest("hex");
    const supabase = await createServerSupabaseClient();

    await supabase.from("analytics_events").insert({
      event_name: body.eventName,
      page_path: String(body.pagePath || "/").slice(0, 240),
      referrer_host: referrerHost,
      country_code: requestHeaders.get("x-vercel-ip-country"),
      city_name: requestHeaders.get("x-vercel-ip-city"),
      device_type: deviceType(userAgent),
      session_hash: sessionHash,
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}
