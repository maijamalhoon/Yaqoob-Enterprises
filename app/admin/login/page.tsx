import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin-login-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/admin");
  const { error } = await searchParams;

  return (
    <main className="admin-login-page">
      <div>
        {error === "not-authorised" && <p className="admin-error" role="alert">This email is not authorised for the admin centre.</p>}
        {error === "invalid-link" && (
          <p className="admin-error" role="alert">
            That login link is invalid, expired, or already used. Request a fresh link and open it in the same browser.
          </p>
        )}
        <AdminLoginForm />
        <Link className="admin-back-link" href="/">← Return to website</Link>
      </div>
    </main>
  );
}
