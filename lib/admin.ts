import { redirect } from "next/navigation";
import type { Database } from "@/lib/database.types";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminRole = Database["public"]["Enums"]["admin_role"];

function assertAdminWritesAllowed() {
  const isNonProductionVercel = process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production";
  const isLocalDevelopment = !process.env.VERCEL_ENV && process.env.NODE_ENV !== "production";

  if (
    (isNonProductionVercel || isLocalDevelopment)
    && process.env.ALLOW_NON_PRODUCTION_ADMIN_WRITES !== "true"
  ) {
    throw new Error(
      "Admin changes are read-only in this environment. Use an isolated Supabase project and explicitly enable non-production writes.",
    );
  }
}

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { data: profile, error } = await supabase
    .from("admin_profiles")
    .select("user_id, role, display_name")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error("Admin access could not be verified. Please try again.");
  }

  if (!profile) {
    await supabase.auth.signOut();
    redirect("/admin/login?error=not-authorised");
  }

  return { supabase, user, profile };
}

export async function requireAdminMutation() {
  assertAdminWritesAllowed();
  return requireAdmin();
}

export async function requireOwnerMutation() {
  const admin = await requireAdminMutation();
  if (admin.profile.role !== "owner") {
    throw new Error("Only the business owner can perform this action.");
  }
  return admin;
}
