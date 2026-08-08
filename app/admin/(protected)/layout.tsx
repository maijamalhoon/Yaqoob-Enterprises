import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import { DestructiveActionGuard } from "@/components/destructive-action-guard";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Admin Centre", robots: { index: false, follow: false } };

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { profile } = await requireAdmin();
  return (
    <div className="admin-shell">
      <DestructiveActionGuard />
      <AdminNav />
      <main className="admin-main">
        <header className="admin-topbar"><div><span>Yaqoob Enterprises</span><strong>{profile.display_name || "Administrator"}</strong></div></header>
        {children}
      </main>
    </div>
  );
}
