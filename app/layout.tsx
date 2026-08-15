import type { Metadata } from "next";
import "./globals.css";
import "./brand.css";
import "./design-system.css";
import "./global-polish.css";
import "./responsive.css";
import "./service-discovery.css";
import "./quick-request-polish.css";
import { PageTracker } from "@/components/page-tracker";
import { businessLocationLabel } from "@/lib/business-display";
import { getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const location = businessLocationLabel(settings.address);
  const description = `${settings.business_name} in ${location} offers agreement and affidavit preparation, NADRA e-Sahulat biometrics, online forms, printing, payments, tickets and digital support.`;
  const homeTitle = `${settings.business_name} | Services in Akhtar Colony, Karachi`;

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
