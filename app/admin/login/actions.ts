"use server";

import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AdminLoginState = { error?: string } | undefined;

export async function signInAdmin(
  _previousState: AdminLoginState,
  formData: FormData,
): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your admin email and password." };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "invalid_credentials") {
      return { error: "Email or password is incorrect." };
    }

    return { error: "We could not sign you in. Please try again." };
  }

  redirect("/admin");
}
