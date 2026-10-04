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
import "./skeleton.css";
import "./stitch.css";
import { PageTracker } from "@/components/page-tracker";
import { getSiteData } from "@/lib/data";
import { SITE_URL } from "@/lib/env";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const homeTitle = `Yaqoob Enterprises | Printing & Photocopying in Akhtar Colony, Karachi`;
  const description = `${settings.business_name} provides printing, photocopying, color printing, notes printing, photo printing, bulk printing and NADRA e-Sahulat services in Akhtar Colony, Karachi.`;

  return {
    metadataBase: new URL(SITE_URL),
    applicationName: settings.business_name,
    title: {
      default: homeTitle,
      template: `%s | ${settings.business_name}`,
    },
    description,
    keywords: [
      "Printing in Akhtar Colony",
      "Photocopy shop Akhtar Colony",
      "Photocopy near me",
      "Printing near me",
      "Color printing Akhtar Colony",
      "Color photocopy Akhtar Colony",
      "Black and white printing Akhtar Colony",
      "Notes printing Akhtar Colony",
      "School notes printing",
      "College notes printing",
      "University notes printing",
      "Bulk printing Akhtar Colony",
      "Bulk photocopying Akhtar Colony",
      "Office printing Akhtar Colony",
      "Photo printing Akhtar Colony",
      "Passport size photos Karachi",
      "NADRA e-Sahulat Akhtar Colony",
      "NADRA biometric Akhtar Colony",
      "Biometric verification Akhtar Colony",
      "Vehicle biometric transfer Karachi",
      "FBR sales tax biometric Karachi",
      "PSW biometric Karachi",
      "Yaqoob Enterprises Karachi",
      "Sector B Akhtar Colony Karachi",
      "Near Jamia Masjid Muhammadi",
    ],
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
