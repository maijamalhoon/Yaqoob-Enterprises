"use client";

import type { AnchorHTMLAttributes, ReactNode } from "react";

export function TrackedLink({
  eventName,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & { eventName: string; children: ReactNode }) {
  const track = () => {
    const params = new URLSearchParams(window.location.search);
    const payload = JSON.stringify({
      eventName,
      pagePath: window.location.pathname,
      utmSource: params.get("utm_source"),
      utmMedium: params.get("utm_medium"),
      utmCampaign: params.get("utm_campaign"),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/analytics", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  };

  return (
    <a {...props} onClick={track}>
      {children}
    </a>
  );
}
