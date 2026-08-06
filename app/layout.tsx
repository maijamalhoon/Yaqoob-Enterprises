import type { Metadata } from "next";
import "./globals.css";
import "./brand.css";
import { PageTracker } from "@/components/page-tracker";
import { SITE_URL } from "@/lib/env";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Yaqoob Enterprises | Everyday Services in Karachi",
    template: "%s | Yaqoob Enterprises",
  },
  description:
    "Printing, biometric verification, online forms, documentation, payments, ticket booking, stationery and laptop support in Akhtar Colony, Karachi.",
  openGraph: {
    type: "website",
    locale: "en_PK",
    siteName: "Yaqoob Enterprises",
    images: [{ url: "/images/storefront-concept.svg", width: 1448, height: 1086 }],
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
