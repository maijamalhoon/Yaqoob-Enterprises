import type { Metadata } from "next";
import { AdminNav } from "@/components/admin-nav";
import { DestructiveActionGuard } from "@/components/destructive-action-guard";
import { requireAdmin } from "@/lib/admin";

export const metadata: Metadata = { title: "Admin Centre", robots: { index: false, follow: false } };

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  const { profile, supabase } = await requireAdmin();
  const { data: settings } = await supabase.from("business_settings").select("business_name").eq("id", true).single();

  return (
    <div className="admin-shell">
      <DestructiveActionGuard />
      <a className="skip-link" href="#admin-main">Skip to main content</a>
      <AdminNav
        businessName={settings?.business_name || "Website admin"}
        displayName={profile.display_name || "Administrator"}
      />
      <main className="admin-main" id="admin-main" tabIndex={-1}>{children}</main>
    </div>
  );
}
