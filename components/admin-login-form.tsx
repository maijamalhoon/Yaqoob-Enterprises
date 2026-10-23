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

    if (error?.code === "over_email_send_rate_limit" || error?.status === 429) {
      setMessage("Too many login link requests. Please wait a few minutes before requesting another link.");
      return;
    }

    if (error?.code === "otp_disabled") {
      setMessage("Email login is currently unavailable. Please contact the site administrator.");
      return;
    }

    setMessage(
      error
        ? "We could not send a login link. Please verify the email and try again later."
        : "If this email is authorised, a secure login link will arrive shortly. Check the inbox and spam folder. Use the newest link; repeated requests may be temporarily rate-limited.",
    );
  }

  return (
    <form className="admin-login-card" onSubmit={submit}>
      <div className="admin-login-mark">YE</div>
      <h1>Admin Centre</h1>
      <p id="admin-login-help">Enter an authorised admin email to receive a secure one-time login link.</p>
      <label htmlFor="admin-login-email">
        Admin email
      </label>
      <input
          id="admin-login-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          aria-describedby={message ? "admin-login-message" : "admin-login-help"}
          required
      />
      <button className="button button--primary" disabled={loading} aria-busy={loading} type="submit">
        {loading ? "Sending…" : "Send secure login link"}
      </button>
      {message && <p className="form-message" id="admin-login-message" role="status" aria-live="polite" aria-atomic="true">{message}</p>}
    </form>
  );
}
