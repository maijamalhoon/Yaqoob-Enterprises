import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Yaqoob Enterprises",
    short_name: "Yaqoob",
    description: "Local biometric, document, printing and business services in Karachi.",
    start_url: "/",
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
      { name: "Admin Centre", short_name: "Admin", url: "/admin" },
      { name: "Request a service", short_name: "Request", url: "/#get-in-touch" },
      { name: "Visit the shop", short_name: "Visit", url: "/#visit" },
    ],
  };
}
