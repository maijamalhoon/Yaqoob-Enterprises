# Environment and deployment

The application fails fast when required public configuration is absent or malformed. Copy `.env.example` to
`.env.local`, then provide values for the development environment before running Next.js.

## Required public variables

- `NEXT_PUBLIC_SUPABASE_URL`: the Supabase project origin. Use HTTPS outside localhost.
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: a current `sb_publishable_...` key or a legacy anon JWT. Never put a
  secret/service-role key in a `NEXT_PUBLIC_` variable.
- `NEXT_PUBLIC_SITE_URL`: the canonical origin for the environment, without a path, query, or fragment.

These values are embedded in browser bundles and are configuration, not secrets. Authorization must continue to be
enforced by Supabase Row Level Security. Server-only credentials must never use a `NEXT_PUBLIC_` name.

## Analytics

Analytics is opt-in. Set `NEXT_PUBLIC_ANALYTICS_ENABLED=true` only for the Vercel Production environment. Development,
test, CI, and Vercel Preview requests are rejected by the server even if the public flag is accidentally enabled.
Production analytics also requires `SUPABASE_SECRET_KEY`, using a dedicated `sb_secret_...` key configured only on
the server. It bypasses Row Level Security, so never prefix it with `NEXT_PUBLIC_`, copy it into client code, or expose
it to Preview deployments. Direct anonymous inserts are revoked by the database migration; all events must pass the
validated application route.

For a deliberate non-production analytics test, both variables are required:

```dotenv
NEXT_PUBLIC_ANALYTICS_ENABLED=true
ANALYTICS_ALLOW_NON_PRODUCTION=true
```

`ANALYTICS_ALLOW_NON_PRODUCTION` is server-only. Do not configure it globally in Vercel.

## Vercel

Configure variables separately for Production, Preview, and Development. Production and Preview should not share a
Supabase project. Keep analytics disabled or unset in Preview. Use `vercel env pull .env.local --environment=development`
when a linked development environment is the source of truth.

Admin mutations are read-only outside Production by default. Set `ALLOW_NON_PRODUCTION_ADMIN_WRITES=true` only when
the environment points to an isolated development or Preview Supabase project. Never enable it when non-production
is connected to production data.

## GitHub Actions

Create these repository variables under **Settings > Secrets and variables > Actions > Variables**:

- `CI_SUPABASE_URL`
- `CI_SUPABASE_PUBLISHABLE_KEY`

They must reference a dedicated, non-production Supabase project whose schema and seed data match the migrations.
The publishable key is intentionally stored as a repository variable because it is browser-visible; the CI project
must still use production-equivalent RLS. Both CI workflows disable analytics explicitly and fail with a clear error
instead of silently contacting the production project when variables are missing.

## Database rollout

Never use production as the first migration target. Replay the full `supabase/migrations` directory in an isolated
Supabase project or branch, run the authorization and critical workflow tests, inspect the resulting schema, and take
a verified production backup before the release window. Regenerate `lib/database.types.ts` from the migrated schema.

The currently staged release must be coordinated in this order:

1. Review the pending service-content migration (`20260815130000_final_public_service_set.sql`) against the intended
   public catalogue. It changes business content and must not be treated as an incidental schema migration.
2. Configure the three public Vercel variables and the Production-only `SUPABASE_SECRET_KEY`. Confirm the Vercel
   project remains on Node.js 24.
3. Deploy the application build. Analytics ingestion will use the server route; gallery writes may be briefly
   unavailable until the next step, but reads and public pages remain safe.
4. Apply the pending migrations in filename order. Do not skip or manually mark migrations as applied. The owner,
   analytics, and gallery migrations contain data preflight assertions and must abort rather than repair ambiguous
   production state automatically.
5. Verify admin login/session refresh, owner-only recovery actions, analytics ingestion, direct anonymous analytics
   rejection, gallery upload/feature/archive, public rendering, and audit entries. Roll back the application if the
   database step did not complete; do not disable RLS or constraints to force the release through.

The gallery feature invariant and destructive recovery functions are transactional. Gallery audit rows intentionally
do not support single-row Undo because one homepage-image switch creates multiple rows; restore them from a verified
content snapshot instead.
