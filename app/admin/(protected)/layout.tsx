import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, LogOut } from "lucide-react";
import { AdminNav } from "@/components/admin-nav";
import { DestructiveActionGuard } from "@/components/destructive-action-guard";
import { requireAdmin } from "@/lib/admin";
import { assertQuerySucceeded } from "@/lib/supabase/query-error";

export const metadata: Metadata = {
  title: "Admin Centre",
  manifest: "/admin.webmanifest",
  robots: { index: false, follow: false },
};

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, supabase } = await requireAdmin();
  const { data: settings, error } = await supabase.from("business_settings").select("business_name").eq("id", true).single();
  assertQuerySucceeded(error, "business identity");

  return (
    <div className="admin-shell">
      <DestructiveActionGuard />
      <AdminNav />
      <main className="admin-main">
        <header className="admin-topbar">
          <div className="admin-topbar__identity">
            <span>{settings?.business_name || "Website admin"}</span>
            <strong>{profile.display_name || "Administrator"}</strong>
          </div>
          <div className="admin-topbar__actions">
            <Link href="/" target="_blank" rel="noopener noreferrer"><ExternalLink size={15} /> <span>View site</span></Link>
            <form action="/admin/logout" method="post">
              <button type="submit"><LogOut size={15} /> <span>Sign out</span></button>
            </form>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
