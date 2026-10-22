"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { SITE_URL } from "@/lib/env";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
    doNotTrack?: string;
  }
}

export function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    const isAdmin = pathname === "/admin" || pathname.startsWith("/admin/");
    if (isAdmin) return;

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

    const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-KKW7GFWCYG";
    const siteHost = new URL(SITE_URL).hostname;
    const privacySignals = navigator as Navigator & { globalPrivacyControl?: boolean };
    if (
      !measurementId ||
      process.env.NODE_ENV !== "production" ||
      window.location.hostname !== siteHost ||
      navigator.doNotTrack === "1" ||
      window.doNotTrack === "1" ||
      privacySignals.globalPrivacyControl
    ) return;

    if (!window.gtag) {
      const dataLayer = (window.dataLayer ??= []);
      window.gtag = (...args) => dataLayer.push(args);
      window.gtag("js", new Date());
      window.gtag("config", measurementId, { send_page_view: false });

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
      document.head.appendChild(script);
    }

    window.gtag("event", "page_view", {
      page_path: pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname]);

  return null;
}
