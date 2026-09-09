import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const scriptSources = ["'self'", "'unsafe-inline'", ...(isDevelopment ? ["'unsafe-eval'"] : [])].join(" ");

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://kzikyufuyanfjlddyepo.supabase.co https://images.unsplash.com",
  "media-src 'self' https://kzikyufuyanfjlddyepo.supabase.co",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  `script-src ${scriptSources}`,
  "connect-src 'self' https://kzikyufuyanfjlddyepo.supabase.co wss://kzikyufuyanfjlddyepo.supabase.co",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  ...(process.env.VERCEL ? {} : { output: "standalone" }),
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kzikyufuyanfjlddyepo.supabase.co",
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
