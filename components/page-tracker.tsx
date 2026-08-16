"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ANALYTICS_ENABLED } from "@/lib/env";

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!ANALYTICS_ENABLED || !pathname || pathname === "/admin" || pathname.startsWith("/admin/")) return;

    const params = new URLSearchParams(window.location.search);
    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        eventName: "page_view",
        pagePath: pathname,
        utmSource: params.get("utm_source"),
        utmMedium: params.get("utm_medium"),
        utmCampaign: params.get("utm_campaign"),
      }),
      keepalive: true,
    });
  }, [pathname]);

  return null;
}
