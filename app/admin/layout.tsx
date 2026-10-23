import type { Metadata } from "next";
import "./admin-ui.css";

export const metadata: Metadata = { manifest: "/admin/manifest.webmanifest" };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root">{children}</div>;
}
