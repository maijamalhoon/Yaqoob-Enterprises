# Analytics ingestion security — staged release

This change removes public direct access to `public.analytics_events`, while keeping visitor analytics behind the existing `/api/analytics` request validation.

## Rollout order (mandatory)
1. Apply additive `20261120190000_analytics_gateway.sql` to the **Yaqoob Enterprises Web** Supabase project. Do not apply the second migration yet.
2. Generate a fresh high-entropy 32-byte hex secret **outside Git**, store only its SHA-256 hash in `analytics_internal.ingest_credential`, and set `ANALYTICS_INGEST_SECRET` as a Vercel **server-only encrypted** environment variable for preview and production. Never use `NEXT_PUBLIC_`.
3. Deploy the updated Next.js API and verify analytics RPC insertion works. Use a transactional rollback for a synthetic database check; inspect operational metrics for real requests. Do not log or expose the secret.
4. Only after verifying real ingestion, apply `20261120191000_analytics_lockdown.sql` to revoke `anon` and `authenticated` direct inserts.
5. Verify `has_table_privilege('anon','public.analytics_events','INSERT') = false`, that the public RPC still exists, and that events continue arriving normally.

## Access model
- Only the private `analytics_internal.record_event` function is privileged. It checks a 256-bit server-only secret, validates a strict payload, and writes only event fields.
- The Data API-facing `public.record_public_analytics_event` wrapper is **SECURITY INVOKER**, executable by the `anon` role only.
- The private credential table has RLS enabled and no anonymous read policies.
- The older direct INSERT policy is removed after verification.

## Recovery if analytics stops
- Roll back the Next.js API to the old version **only if** direct-insert grants/policy are restored temporarily from the earlier historical migration. This reopens the old bypass, so use it only during incident recovery.
- Preferred fix is to restore `ANALYTICS_INGEST_SECRET`/RPC availability without restoring public INSERT access.
- Rotate the secret by updating its hashed DB value and the matching Vercel env var in a coordinated deploy.

No service-role key is used or exposed; this is a narrowly scoped ingestion credential.
