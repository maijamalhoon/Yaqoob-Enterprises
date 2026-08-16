import type { NextConfig } from "next";
import { SITE_URL, SUPABASE_URL } from "./lib/env";

const isDevelopment = process.env.NODE_ENV === "development";
const scriptSources = ["'self'", "'unsafe-inline'", ...(isDevelopment ? ["'unsafe-eval'"] : [])].join(" ");
const supabaseUrl = new URL(SUPABASE_URL);
const siteUrl = new URL(SITE_URL);
const supabaseImageProtocol: "http" | "https" = supabaseUrl.protocol === "http:" ? "http" : "https";
const supabaseRealtimeOrigin = `${supabaseImageProtocol === "https" ? "wss" : "ws"}://${supabaseUrl.host}`;

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "form-action 'self'",
  `img-src 'self' data: blob: ${supabaseUrl.origin}`,
  `media-src 'self' ${supabaseUrl.origin}`,
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src ${scriptSources}`,
  `connect-src 'self' ${supabaseUrl.origin} ${supabaseRealtimeOrigin}`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  ...(!isDevelopment && siteUrl.protocol === "https:" ? ["upgrade-insecure-requests"] : []),
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: supabaseImageProtocol,
        hostname: supabaseUrl.hostname,
        port: supabaseUrl.port,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/services/printing-photos/photocopy-scanning",
        destination: "/services/printing-photos/colour-black-white-printing",
        permanent: true,
      },
      {
        source: "/services/typing-online/cv-preparation",
        destination: "/services/typing-online/urdu-english-typing",
        permanent: true,
      },
      {
        source: "/services/biometric/fbr-sales-tax-biometric",
        destination: "/services/biometric/general-biometric-esahulat",
        permanent: true,
      },
      {
        source: "/services/biometric/fbr-psw-biometric",
        destination: "/services/biometric/general-biometric-esahulat",
        permanent: true,
      },
      {
        source: "/services/biometric/eto-vehicle-biometric",
        destination: "/services/biometric/general-biometric-esahulat",
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: contentSecurityPolicy },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
