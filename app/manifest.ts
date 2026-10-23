import type { MetadataRoute } from "next";
import { getSiteData } from "@/lib/data";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { settings } = await getSiteData();

  return {
    name: settings.business_name,
    short_name: settings.business_name,
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0f295f",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
