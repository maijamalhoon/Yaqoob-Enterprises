import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
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
        <header className="admin-topbar">
          <div className="admin-topbar__identity">
            <span>Yaqoob Enterprises</span>
            <strong>{profile.display_name || "Administrator"}</strong>
          </div>
          <div className="admin-topbar__actions">
            <Link href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> View site</Link>
            <form action="/admin/logout" method="post">
              <button type="submit"><LogOut size={15} /> Sign out</button>
            </form>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
