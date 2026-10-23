import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const supabaseUrl = new URL(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://ienwbrrzsutbispaiymi.supabase.co",
);
const supabaseProtocol = supabaseUrl.protocol === "http:" ? "http" : "https";
const supabaseOrigin = `${supabaseProtocol}://${supabaseUrl.host}`;
const supabaseRealtimeOrigin = `${supabaseProtocol === "http" ? "ws" : "wss"}://${supabaseUrl.host}`;
const scriptSources = ["'self'", "'unsafe-inline'", ...(isDevelopment ? ["'unsafe-eval'"] : [])].join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  "frame-src 'self' https://www.google.com",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  `img-src 'self' data: blob: ${supabaseOrigin} https://images.unsplash.com https://www.googletagmanager.com https://*.google-analytics.com`,
  `media-src 'self' ${supabaseOrigin}`,
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src ${scriptSources} https://www.googletagmanager.com`,
  `connect-src 'self' ${supabaseOrigin} ${supabaseRealtimeOrigin} https://www.googletagmanager.com https://*.google-analytics.com https://*.google.com`,
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_DEPLOYMENT_ENV: process.env.VERCEL_ENV || "",
  },
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: supabaseProtocol,
        hostname: supabaseUrl.hostname,
        ...(supabaseUrl.port ? { port: supabaseUrl.port } : {}),
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
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
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
