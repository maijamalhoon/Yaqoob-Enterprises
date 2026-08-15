import type { Metadata } from "next";
import "./globals.css";
import "./brand.css";
import "./design-system.css";
import "./admin-shell.css";
import "./global-polish.css";
import "./responsive.css";
import "./hero-ticker.css";
import "./service-discovery.css";
import { PageTracker } from "@/components/page-tracker";
import { SITE_URL } from "@/lib/env";

const description =
  "Printing, biometric verification, online forms, documentation, payments, ticket booking, stationery and laptop support in Akhtar Colony, Karachi.";
const homeTitle = "Yaqoob Enterprises | Printing & Digital Services in Akhtar Colony";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "Yaqoob Enterprises",
  title: {
    default: homeTitle,
    template: "%s | Yaqoob Enterprises",
  },
  description,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "Yaqoob Enterprises",
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
