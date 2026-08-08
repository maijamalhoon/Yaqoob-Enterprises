import type { Metadata } from "next";
import "./globals.css";
import "./brand.css";
import "./phase-one.css";
import "./phase-two.css";
import "./phase-three.css";
import "./phase-four.css";
import "./final-touch.css";
import "./final-lock.css";
import "./final-hardening.css";
import "./service-showcase.css";
import "./viewport-foundation.css";
import "./mobile-balance.css";
import "./closing-cta-polish.css";
import "./contact-responsive-polish.css";
import "./contact-mobile-short.css";
import { PageTracker } from "@/components/page-tracker";
import { ViewportLayoutMetrics } from "@/components/viewport-layout-metrics";
import { SITE_URL } from "@/lib/env";

const description =
  "Printing, biometric verification, online forms, documentation, payments, ticket booking, stationery and laptop support in Akhtar Colony, Karachi.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Yaqoob Enterprises",
  title: {
    default: "Yaqoob Enterprises | Everyday Services in Karachi",
    template: "%s | Yaqoob Enterprises",
  },
  description,
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "Yaqoob Enterprises",
    title: "Yaqoob Enterprises | Everyday Services in Karachi",
    description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Yaqoob Enterprises | Everyday Services in Karachi",
    description,
  },
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <ViewportLayoutMetrics />
        <PageTracker />
        {children}
      </body>
    </html>
  );
}
