"use client";

import { FormEvent, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function AdminLoginForm() {
  const [email, setEmail] = useState("jamalarain186@gmail.com");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createBrowserSupabaseClient();
    const redirectTo = `${window.location.origin}/admin/auth/callback`;
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo, shouldCreateUser: true },
    });
    setLoading(false);
    setMessage(error ? error.message : "Secure login link sent. Check your email inbox and spam folder.");
  }

  return (
    <form className="admin-login-card" onSubmit={submit}>
      <div className="admin-login-mark">YE</div>
      <h1>Admin Centre</h1>
      <p>Use the authorised owner email. No password is sent to the website.</p>
      <label>
        Admin email
        <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <button className="button button--primary" disabled={loading} type="submit">
        {loading ? "Sending…" : "Send secure login link"}
      </button>
      {message && <p className="form-message" role="status">{message}</p>}
    </form>
  );
}
