"use client";

import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}/admin/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: redirectTo,
        shouldCreateUser: false,
      },
    });

    setLoading(false);
    setMessage(
      error
        ? "We could not send a login link. Please verify the email and try again later."
        : "If this email is authorised, a secure login link will arrive shortly. Check the inbox and spam folder.",
    );
  }

  return (
    <form className="admin-login-card" onSubmit={submit}>
      <div className="admin-login-mark">YE</div>
      <h1>Admin Centre</h1>
      <p>Enter an authorised admin email to receive a secure one-time login link.</p>
      <label>
        Admin email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
        />
      </label>
      <button className="button button--primary" disabled={loading} type="submit">
        {loading ? "Sending…" : "Send secure login link"}
      </button>
      {message && <p className="form-message" role="status">{message}</p>}
    </form>
  );
}
