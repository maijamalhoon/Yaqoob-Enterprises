"use client";

import { useActionState } from "react";
import { signInAdmin } from "@/app/admin/login/actions";

export function AdminLoginForm() {
  const [state, formAction, pending] = useActionState(signInAdmin, undefined);

  return (
    <form className="admin-login-card" action={formAction}>
      <div className="admin-login-mark">YE</div>
      <h1>Admin Centre</h1>
      <p id="admin-login-help">Sign in with your authorised admin email and password.</p>
      <label htmlFor="admin-login-email">Admin email</label>
      <input
        id="admin-login-email"
        name="email"
        type="email"
        autoComplete="username"
        autoCapitalize="none"
        spellCheck={false}
        aria-describedby={state?.error ? "admin-login-message" : "admin-login-help"}
        required
      />
      <label htmlFor="admin-login-password">Password</label>
      <input
        id="admin-login-password"
        name="password"
        type="password"
        autoComplete="current-password"
        aria-describedby={state?.error ? "admin-login-message" : "admin-login-help"}
        required
      />
      <button className="button button--primary" disabled={pending} aria-busy={pending} type="submit">
        {pending ? "Signing in…" : "Sign in"}
      </button>
      {state?.error && (
        <p className="form-message" id="admin-login-message" role="alert" aria-live="polite" aria-atomic="true">
          {state.error}
        </p>
      )}
    </form>
  );
}
