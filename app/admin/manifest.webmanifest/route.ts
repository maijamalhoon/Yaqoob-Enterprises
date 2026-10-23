import { getSiteData } from "@/lib/data";

export async function GET() {
  const { settings } = await getSiteData();
  const appName = `${settings.business_name} Admin`;

  return Response.json(
    {
      name: appName,
      short_name: "Admin",
      start_url: "/admin",
      scope: "/admin",
      display: "standalone",
      background_color: "#ffffff",
      theme_color: "#0f295f",
      icons: [
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
