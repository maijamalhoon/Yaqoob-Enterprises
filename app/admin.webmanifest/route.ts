import type { MetadataRoute } from "next";
import { NextResponse } from "next/server";

const adminManifest: MetadataRoute.Manifest = {
  id: "/admin",
  name: "Yaqoob Admin Centre",
  short_name: "Yaqoob Admin",
  description: "Secure mobile access to Yaqoob Enterprises business operations.",
  start_url: "/admin",
  scope: "/",
  display: "standalone",
  background_color: "#f7f9fc",
  theme_color: "#001f56",
  lang: "en-PK",
  categories: ["business", "productivity"],
  icons: [
    { src: "/icons/pwa-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icons/pwa-512.png", sizes: "512x512", type: "image/png" },
    { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
  ],
  shortcuts: [
    { name: "Dashboard", short_name: "Dashboard", url: "/admin" },
    { name: "Services", short_name: "Services", url: "/admin/services" },
    { name: "History", short_name: "History", url: "/admin/history" },
  ],
};

export function GET() {
  return NextResponse.json(adminManifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
    },
  });
}
