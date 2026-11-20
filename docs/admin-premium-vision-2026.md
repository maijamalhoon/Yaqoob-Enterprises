# Admin Centre — Premium operational UI vision (2026-11-20)

## North star
A real operations control room for Yaqoob Enterprises: premium, calm and immediately scannable. Strong visual hierarchy without manufactured metrics, generic dashboard noise, fake activity or over-decoration.

## Visual language (Option A)
- **Navy** #0b1b30: one purposeful command header and existing navigation. Not an overwhelming full-dark application.
- **Emerald/teal** #087f74 and #0ca79a: actions and real-data chart lines.
- **Background** #f5f7fb and **white surfaces**: legibility, calm information density.
- **Muted purple** #8072bc: very limited secondary chart accents, never the primary action.
- Radius 9–18px; borders instead of heavy shadows; compact UI labels, generous chart space.
- Decorative gradients are restricted to an actual command header; never present fabricated graphs.
- Visible keyboard focus, reduced-motion safe interactions, tabular numbers, readable contrast, responsive layouts.

## Pages (Option B)
1. **Overview:** one dark command header with real readiness and actionable next step; truthful service/category/image metrics; concise readiness disclosure; quick access; grouped recent events, never called unique visitors.
2. **Analytics:** real data from existing tracked events. Accessible 7/30-day chart with pointer and keyboard exploration, exact selected-day counts, and a table of raw daily values. Explain truncated samples, automated traffic caveat and concentrated spikes. Highlight the actual top service, source and 7-day total.
3. **Services:** searchable catalogue with category jump navigation, readable status and simple inline editing; preserve complete service metadata/SEO fields.
4. **Coverage:** each area immediately exposes real Delivery, Pickup and Biometric capabilities; existing edit and create operations remain.
5. **Gallery:** intentional shop-photo upload surface, original optimization and preview workflow, hero image controls preserved.
6. **Announcements:** progressive notice creation and compact live/hidden presentation.
7. **Settings:** editing organized around identity, contact and hours; less-frequent fields disclosed only on demand.
8. **History:** safe audit timeline, clear backup scope and non-destructive recovery controls.

## Data integrity and release constraints
- No sample traffic, fake trends, random gradients representing data, invented baseline or unexplained smoothing.
- The trend comparison is hidden if events are a truncated sample.
- No database schema changes, no production data or Storage writes, no dangerous restore tests on production.
- Keep all authenticated permissions and existing server actions.
- Validate Next.js build, TypeScript, lints, dependency and code-security scans, anonymous browser smoke, isolated authenticated CRUD/recovery E2E and responsive screenshots before merge.

## Design research
- Nielsen Norman Group, Progressive Disclosure: https://www.nngroup.com/articles/progressive-disclosure/
- Harvard accessibility, charts and graphs: https://accessibility.huit.harvard.edu/data-viz-charts-graphs
- NHS Scotland, accessible data visualisation: https://turasdesignsystem.nhs.scot/design/data-visualisation/accessible-data/
- 2026 SaaS analytics UX patterns: https://www.saasui.design/blog/saas-analytics-reporting-dashboard-ux-patterns
