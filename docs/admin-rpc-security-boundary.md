# Admin RPC Security Boundary — 20 Nov 2026

## Scope
Harden the three public `SECURITY DEFINER` functions reported by the Supabase Security Advisor, preserving the Next.js `supabase.rpc(...)` names and user roles.

- `public.admin_set_featured_gallery_image(uuid)` now **SECURITY INVOKER**; existing admin-only `gallery_images` SELECT/UPDATE RLS and the internal admin check still enforce access.
- `public.restore_admin_snapshot(uuid)` and `public.rollback_admin_audit(bigint)` now **SECURITY INVOKER** wrappers. Their only privileged calls are `app_private.owner_*` functions, which enforce **active owner** access in a non-exposed database schema.
- The existing `app_private.restore_admin_snapshot` and `app_private.rollback_admin_audit` implementations and grants are unchanged. All public-facing RPC names, parameters, and return types are preserved.
- No user records, gallery data, snapshots or audit rows are changed by the migration.

## Verification
1. Confirm all three public functions have `prosecdef=false`, while private `owner_*` are `prosecdef=true`.
2. Verify `anon` cannot execute any public admin RPC and `authenticated` can.
3. Verify `authenticated` cannot directly execute the *lower-level* private restore/rollback functions.
4. Test unauthenticated/invalid-role calls fail with 42501 without altering records.
5. Run Supabase Security Advisor. The three `authenticated_security_definer_function_executable` warnings should disappear.
6. Smoke test public website and check no runtime errors.

**Note**: Do not execute real restore/rollback on production to test permissions. Those actions deliberately modify customer-facing CMS data. Test allowed-owner flows only against a non-production database or with explicit manual verification in the admin UI.

## Password protection
The Supabase organization currently uses the Free tier. Supabase's HaveIBeenPwned leaked-password protection setting is Pro-only, so it cannot be enabled here without a paid upgrade. Keep strong account passwords and MFA enabled; this remains a separate platform warning.
