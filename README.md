# Yaqoob Enterprises

Production-oriented Next.js website and Supabase-backed admin centre for Yaqoob Enterprises in Akhtar Colony, Karachi.

## Project overview

- Responsive customer-facing website and service-category pages.
- Service-aware WhatsApp request flow.
- Business hours, pricing, coverage and contact content managed through Supabase.
- Admin centre for managing services, categories, coverage, gallery, settings, announcements and analytics.
- Supabase Storage gallery with image focal-point controls.
- Privacy-conscious page-view and contact-action analytics.
- Server-side admin authorization backed by Supabase Auth and the `admin_profiles` table.

## Technology

- Next.js 16, React 19 and TypeScript.
- Tailwind CSS 4.
- Supabase Auth, Postgres and Storage.
- GitHub Actions for type-checking, linting, production builds, browser smoke checks and security automation.
- Vercel for production hosting.

## Requirements

- Node.js 22 (the same major version used in CI).
- npm.
- A Supabase project for the CMS/admin functionality.

## Local development

1. Clone this repository and enter the project directory.
2. Install dependencies:

   ```bash
   npm ci
   ```

3. Copy the example environment file to `.env.local` and review the values. In PowerShell:

   ```powershell
   Copy-Item .env.example .env.local
   ```

   Public Supabase URL and publishable-key values are used by the app and may have safe project defaults. Set `NEXT_PUBLIC_SITE_URL` to your local URL when needed. Never put a Supabase service-role key, database password, access token or other server secret in a `NEXT_PUBLIC_*` variable or commit real secrets.

4. Start the development server:

   ```bash
   npm run dev
   ```

   Then open http://localhost:3000.

## Validation

Run these locally before opening a pull request:

```bash
npm run typecheck
npm run lint
npm run build
```

Pull requests targeting `main` also run the Quality Gate and browser smoke checks through GitHub Actions. Scheduled workflows check dependency advisories and run CodeQL analysis. CI passing is necessary but does not replace testing critical changes against a safe preview environment.

## Admin access

The admin login uses **email and password** through Supabase Auth. A successful sign-in alone is not sufficient: protected admin routes independently require an authorized row in `admin_profiles`. Use an already-authorized admin account and make sure a password is configured for that account in Supabase Auth. Do not share credentials or place them in repository files, screenshots, issues or pull requests.

If access fails, check the Supabase Auth account, the admin-profile authorization record and the production environment configuration. Never bypass the `requireAdmin` guard to troubleshoot access.

## Database and deployment safety

- SQL changes belong in timestamped, reviewed files under `supabase/migrations/`.
- Review every migration for destructive operations, permissions and Row Level Security (RLS) effects before applying it.
- Do not reset, truncate or reseed production data as a troubleshooting shortcut.
- Test database changes against a non-production/staging project where available and verify a backup/restore path before high-impact changes.
- Configure the required environment variables in Vercel for each environment. Keep service-role credentials server-side only.
- Verify the Vercel preview and production deployment after a merge; a green GitHub run alone does not prove the deployed site or live authentication flow works end to end.

## Contributing

Use a short-lived branch such as `feat/...`, `fix/...` or `chore/...`; open a pull request into `main`; explain the reason for the change; and include test evidence. Avoid direct pushes to `main`. Keep pull requests focused, review database/security changes carefully, and update documentation whenever product behaviour or setup changes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the pull-request checklist, [SECURITY.md](SECURITY.md) for responsible vulnerability reporting, and [dependency security notes](docs/dependency-security-notes.md) for the current upstream advisory exception.

## Repository license

No license file is currently included. Do not assume that public visibility grants permission to reuse, redistribute or commercialize this project's code or assets.
