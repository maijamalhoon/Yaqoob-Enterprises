# Phase 8 — Admin reliability & security verification

**Target:** Yaqoob Enterprises WEBSITE. Never reuse Shop Pro infrastructure.

## Findings verified from the live project (2026-11-20, read-only)
- Authenticated History route loads in the linked browser. This does not prove authenticated create/update/delete or export.
- Analytics shows substantial unknown-city and international desktop events. They **cannot be classified definitively as bots**, and historical measurements must not be silently deleted or re-labelled as verified human visits.
- Next.js previously treated Vercel previews as production because \`NODE_ENV\` is production on preview builds. This allowed preview/test events into shared analytics infrastructure if configured. Server now requires canonical domain plus Vercel production environment, and the browser tracker avoids alternate hosts.
- Admin audit contains account-profile events, while \`app_private.rollback_admin_audit\` only supports six content tables. The History UI must not offer Undo for unsupported events.
- Supabase security advisor: \`auth_leaked_password_protection\` warning; check the Email provider/Auth settings in the Supabase dashboard. This is a hosted Auth setting, **not** a SQL migration, and may require a paid plan. No Auth credentials/settings were changed here.
- Supabase info advisory: RLS enabled without a policy for private \`analytics_internal.ingest_credential\`. This is **intentional deny-all** storage for the secret hash; anonymous/authenticated roles have no table privileges.
- Other performance advisories identify unused indexes; do not remove indexes without representative workload evaluation.

## Offline recovery acceptance criteria
\`node --experimental-strip-types scripts/verify-portable-backup.mjs <private-backup.json>\`

- Validates portable format v1, export timestamp, all eight content-table sections, gallery file references, media file counts, raw-byte totals and every media SHA-256 digest.
- Reads only the local file. It neither connects to Supabase nor restores data.
- Retain an encrypted/offline copy; uploaded media are included in base64 and may contain private customer material. Do not commit downloaded copies to Git.
- In-app snapshots continue to cover only six tables; portable JSON is manual recovery, not an in-app import.

## Authenticated staging E2E — still required
1. Provision an **isolated** Supabase project and Vercel preview with staging-only credentials. Never point destructive tests at the production Supabase URL or production domain.
2. Seed only disposable data and a staging admin identity; verify admin sign-in, role/RLS denial and route protection.
3. Test creation, edit, failed validation, concurrency and deletion for Services, Coverage, Gallery and Announcements. Restore from a fresh in-app snapshot and compare resulting rows. Validate original Storage bytes separately.
4. Download a portable JSON copy, run verifier locally, and rehearse manual restore on an isolated project. Recheck permissions, public page rendering and image links.
5. Check 280–430 px mobile layouts, keyboard navigation, failures/offline state and server errors. Record failures and screenshots before declaring recovery readiness.

**Important:** The automated CI only covers unit tests, public/anonymous browser smoke and outage scenarios. A real authenticated staging CRUD + disaster recovery rehearsal has NOT yet been executed; do not mark it passed in release communications.
