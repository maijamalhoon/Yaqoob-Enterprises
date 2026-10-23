# Admin Center redesign

Last updated: 2026-10-23

Branch: `admin-ui-redesign`

## Audit and baseline

- Confirmed the existing routes and auth flow from source: login, dashboard, services, coverage, gallery, settings, analytics, and history. Protected pages and server actions still call `requireAdmin()`; login remains Supabase OTP.
- Added `/admin/announcements`, which was absent from the route tree although the table and protected create/delete actions already existed.
- Supabase project reference extracted from the configured URL: `ienwbrrzsutbispaiymi`. No other URL or credential is recorded here. No production write was run.
- Baseline `npm run typecheck`: pass. Baseline `npm run lint`: pass.
- Baseline `npm run build` in the working tree stopped with `ENOTEMPTY` while cleaning `.next/standalone/.next/cache/fetch-cache`, with another Node process active. A pre-edit isolated copy built with `npm run build -- --webpack`; it emitted the existing tracing warning caused by linked `node_modules`.
- There is no package-manager lockfile. Checks use the npm scripts in `package.json`.
- Design references were present in `docs/design-references/`; the navy dashboard reference informed the shell and KPI/table hierarchy.
- Public baseline screenshots were already present in `%TEMP%/yaqoob-admin-redesign-public-baseline/` for `/`, `/services`, `/about`, and `/contact` at 390px and 1440px.

## Route checklist

The browser sweep used a temporary in-memory Supabase mock and a synthetic local session. It did not contact the configured project. Every route passed the width and one-`h1` checks at all nine widths. Full-page screenshots were saved outside the repository for 360, 390, 768, 1024, and 1440px and visually reviewed.

| Route | Status | Widths measured | Notes |
| --- | --- | --- | --- |
| `/admin/login` | Checked | 360, 375, 390, 430, 768, 1024, 1280, 1440, 1920 | Invalid email blocked; valid OTP response exercised against the local mock. |
| `/admin` | Checked | All nine | KPI sources documented below; recent activity uses `analytics_events`. |
| `/admin/services` | Checked | All nine | Service/category editor opens by keyboard; destructive dialog opens and closes with Escape. |
| `/admin/announcements` | Checked | All nine | Required fields, local create and confirmed local delete exercised. Added a read-only list query through `requireAdmin()`'s server client. |
| `/admin/coverage` | Checked | All nine | Existing forms and records render. |
| `/admin/gallery` | Checked | All nine | Image type rejection, optimization, local upload, and 63%/29% focal position render verified with the mock. |
| `/admin/settings` | Checked | All nine | Existing settings and opening-hour forms render. |
| `/admin/analytics` | Checked | All nine | Existing `analytics_events`-based content and chart render. |
| `/admin/history` | Checked | All nine | Existing backup, restore, audit and undo controls render. |
| Protected loading/error states | Added; browser state not forced | Not run | Shared loading UI and protected error boundary use admin tokens; their transient/failure states were not forced in the browser. |

Width checks used 360, 375, 390, 430, 768, 1024, 1280, 1440, and 1920px. No admin route exceeded the viewport width. The mobile drawer opened by touch; Escape closed it and returned focus. Tested touch target: 44px. Form input size: 16px. Console errors and unexpected failed requests during the route sweep and local create/delete/upload interactions: none.

## Dashboard data sources

- Public services: `services` rows with `status !== 'hidden'` whose `category_id` is in active `service_categories`.
- Active categories: active rows from `service_categories`.
- Homepage image: `gallery_images` with `is_active=true`, `is_featured=true`, `media_kind='real'`.
- Events in the last 30 days: exact head count from `analytics_events.created_at >= now - 30 days`.
- Recent activity table: the eight newest rows from `analytics_events`.
- Readiness checks use existing reads from `business_settings`, `business_hours`, `gallery_images`, `admin_snapshots`, and the service/category queries above. Failed reads display as unavailable.

The new announcement route reads `announcements` ordered by `display_order` and newest `created_at`. No placeholder metrics or data were added.

## Decisions and scope

- Tokens and component styling are in `app/admin/admin-ui.css`, scoped below `.admin-root` and imported by `app/admin/layout.tsx`.
- Use installed Lucide icons, the local Geist face bundled with the installed Next package, and native dialogs for drawer and destructive confirmation.
- Existing auth, authorization, queries, actions, upload/storage handling, image positioning, and analytics tracking remain on their existing server/client boundaries.
- No package or lockfile changes. The redesign did not edit `app/globals.css`, Tailwind configuration, or public-only source files. Commit `05d7b12` moved public-site edits that were already in the worktree onto the branch while I was working; I did not create or alter those files. The current unstaged auth and generated `next-env.d.ts` changes are also being left intact and out of my commit.
- Public-route screenshots were recaptured locally at 390px and 1440px. Their pixel comparison is not conclusive because the local mock supplies a 1px image and a smaller dataset than the public baseline. Exact public screenshot equality is unverified.

## Verification results

- `npm run lint` in the workspace: pass.
- `npm run typecheck` in the workspace: failed because `.next/types/validator.ts` still refers to the concurrently deleted, unstaged `/admin/auth/callback` route. The active user dev server owns the workspace `.next`, so it was left untouched.
- `npm run typecheck` in an isolated copy of the branch snapshot after type generation: pass.
- `npm run build` in the same isolated copy with the local mock: pass. The first isolated attempt stopped at page data collection because the mock was shut down; rerunning with the mock active passed.
- `git diff --check`: pass after removing trailing whitespace from this plan.
- Admin screenshots are in `%TEMP%/yaqoob-admin-redesign-local-aab2c98af94c4fdbb958dcdb17ced9d5/screenshots/`; public captures are in that directory's `public-post/` folder. All are test artifacts outside the repository.

## Open verification items

- Automated axe was not run; no axe package is installed. A full manual tab-order audit was not completed; keyboard checks covered the drawer, service editor, destructive dialog, and form validation.
- The browser used local mock data, so production CRUD, Supabase Storage, and authenticated state were not tested against real Supabase. No remote write was performed.
- Loading and error transient states were not browser-forced. Public screenshot pixel equality remains unverified for the mock-data reason above.
