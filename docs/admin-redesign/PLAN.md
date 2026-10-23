# Admin Center redesign

Branch: admin-ui-redesign

## Baseline and audit

- Code inventory: /admin/login, /admin, /admin/services, /admin/coverage, /admin/gallery, /admin/settings, /admin/analytics, and /admin/history existed. /admin/announcements was missing; its table and secured create/delete actions existed.
- Protected routes use requireAdmin() in server components/actions. Login remains Supabase OTP with the existing callback and logout routes.
- Supabase URL project ref: ienwbrrzsutbispaiymi. No credentials or URL values are recorded here.
- Baseline npm run typecheck: pass. Baseline npm run lint: pass.
- Baseline npm run build in the working tree stopped on .next/standalone/.next/cache/fetch-cache with ENOTEMPTY while other Node processes were running. A pre-edit copy built successfully with npm run build -- --webpack; it reported the existing tracing warning caused by node_modules being linked outside that copy.
- There is no package-manager lockfile. Checks use the npm scripts in package.json.
- Reference images are present in docs/design-references/; the navy Mboard-style image is the primary style reference. Other provided images inform spacing and chart legibility only.
- Existing public screenshot artifacts were present in %TEMP%/yaqoob-admin-redesign-public-baseline/ for /, /services, /about, and /contact at 390px and 1440px. They are the pre-redesign comparison set.
- No protected-route test session or dedicated test Supabase project is available. The configured project is treated as production; no remote writes are permitted.

## Route checklist

| Route | Status | Viewports checked | Notes |
| --- | --- | --- | --- |
| /admin/login | Shared styles applied; browser check pending | Not checked yet | OTP behavior retained. |
| /admin | Dashboard markup redesigned; browser check pending | Not checked yet | Metrics use the existing dashboard queries. |
| /admin/services | Shared shell/styles applied; review pending | Not checked yet | Existing CRUD forms/actions retained. |
| /admin/announcements | Added from existing schema/actions; browser check pending | Not checked yet | One read-only list query uses the existing server client. |
| /admin/coverage | Shared shell/styles applied; review pending | Not checked yet | Existing CRUD forms/actions retained. |
| /admin/gallery | Shared shell/styles applied; review pending | Not checked yet | Upload optimization and focal-position fields retained. |
| /admin/settings | Shared shell/styles applied; review pending | Not checked yet | Existing settings and hours forms/actions retained. |
| /admin/analytics | Shared shell/styles applied; review pending | Not checked yet | Existing event-derived summaries retained; chart styling is CSS-based. |
| /admin/history | Shared shell/styles applied; review pending | Not checked yet | Backup, restore, delete, and undo actions retained. |
| /admin/* loading | Shared loading state added | Not checked yet | Uses the admin token system. |
| /admin/* error | Shared protected-route error state added | Not checked yet | Retry remains available. |

## Decisions

- New tokens and component styles live in app/admin/admin-ui.css, scoped under .admin-root; the public root layout and public styles are unchanged by this redesign.
- Use the installed Lucide icons, a local next/font Geist face already shipped with Next, and native dialog for the mobile drawer and destructive confirmations.
- Add Cancel controls that reset unsaved form values. Existing server-action handlers and Supabase query/write contracts stay in place.
- Do not add a dashboard query or derive metrics from invented data.

## Open verification items

- Complete route-specific review and screenshots.
- Run browser checks at 360, 375, 390, 430, 768, 1024, 1280, 1440, and 1920px; inspect full-page screenshots, page width, keyboard navigation, drawer and confirmation dialog behavior.
- Recheck public screenshots against the baseline and confirm there is no public visual change.
- Authenticated CRUD and upload flows remain unverified unless a safe local or dedicated test environment becomes available.
- Run final typecheck, lint, build, and available accessibility checks. Never submit a write to the configured Supabase project.
