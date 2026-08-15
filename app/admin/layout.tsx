import type { Metadata } from "next";
import "../admin-shell.css";
import "../admin-control-center.css";
import "../admin-safety-analytics.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
