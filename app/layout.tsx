import type { Metadata } from "next";
import "./globals.css";
import "./brand.css";
import "./design-system.css";
import "./admin-shell.css";
import "./global-polish.css";
import "./responsive.css";
import "./hero-ticker.css";
import "./service-discovery.css";
import "./service-page-polish.css";
import "./seo-service-pages.css";
import "./quick-request-polish.css";
import "./guided-request-polish.css";
import "./admin-control-center.css";
import "./admin-safety-analytics.css";
import { PageTracker } from "@/components/page-tracker";
import { businessLocationLabel } from "@/lib/business-display";
import { getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const location = businessLocationLabel(settings.address);
  const description = `NADRA e-Sahulat and biometric verification, printing, photocopy, online forms, documents, payments, tickets, stationery and laptop support in ${location}.`;
  const homeTitle = `NADRA e-Sahulat & Biometric Verification Karachi | ${settings.business_name}`;

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: settings.business_name,
    title: {
      default: homeTitle,
      template: `%s | ${settings.business_name}`,
    },
    description,
    alternates: { canonical: "/" },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
    verification: {
      google: "W-UmHqy2sJyd2xbsdPdPeqJLOhLS2cf_aszWJf15aMk",
    },
    openGraph: {
      type: "website",
      locale: "en_PK",
      siteName: settings.business_name,
      url: "/",
      title: homeTitle,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: homeTitle,
      description,
    },
    icons: { icon: "/icon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <PageTracker />
        {children}
      </body>
    </html>
  );
}
