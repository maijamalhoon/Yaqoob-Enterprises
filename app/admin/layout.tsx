import type { Metadata } from "next";
import "../admin-control-center.css";
import "../admin-safety-analytics.css";
import "./admin-ui.css";
import "../admin-redesign.css";
import "../admin-premium.css";

export const metadata: Metadata = { manifest: "/admin/manifest.webmanifest" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
