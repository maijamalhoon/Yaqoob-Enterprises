import type { Metadata } from "next";
import "./globals.css";
import "./brand.css";
import "./phase-one.css";
import "./phase-two.css";
import "./phase-three.css";
import "./phase-four-min-1.css";
import "./phase-four-min-2.css";
import "./phase-four-min-3.css";
import "./phase-four-min-4.css";
import "./phase-four-min-5.css";
import "./phase-four-min-6.css";
import "./phase-four-min-7.css";
import "./phase-four-min-8.css";
import "./final-touch.css";
import { DestructiveActionGuard } from "@/components/destructive-action-guard";
import { PageTracker } from "@/components/page-tracker";
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
        <PageTracker />
        <DestructiveActionGuard />
        {children}
      </body>
    </html>
  );
}
