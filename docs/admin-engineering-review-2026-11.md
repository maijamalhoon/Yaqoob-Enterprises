# Admin Centre — engineering and design review

## Positioning
A secure website-content control room for Yaqoob Enterprises, not a generic data SaaS dashboard or financial system. Product goals: *discoverability, confidence, correct data interpretation and efficient editing*. Visual sophistication is secondary to those outcomes.

## Real audit findings, November 20, 2026
| Finding | Consequence | Implemented response |
| --- | --- | --- |
| Previous 7/30-day chart selector changed the graph but **not** other report KPIs | Misleading cross-panel comparisons | One selected Pakistan calendar period filters all report panels; selector changes the report route |
| “Top services” counted category slugs, not exact service detail routes | Could point the owner to the wrong service | Route parser with catalogue-backed service title and category; excludes category-only pages |
| Four KPI cards were bespoke static HTML blocks | Styling drift and lost visual encoding | Typed reusable `AdminMetricCard`, optional sparklines strictly sourced from daily tracked events |
| Breadcrumb always said Workspace | Incorrect information architecture | One typed navigation model consumed by sidebar, breadcrumbs and search |
| Eight sections required multiple manual sidebar clicks | Slower navigation and more mental overhead | Ctrl+K searchable command dialog with mouse, keyboard and native focus/escape behavior |
| Existing CSS is spread across several large layered stylesheets | High regression risk and brittle cascade | New work uses isolated component classes and shared design tokens; CSS consolidation remains a separate tracked debt |
| Prior browser coverage was desktop + mobile only | Tablet regressions could pass unseen | Screenshot/overflow coverage at 1440px, 820px, 390px |

## Metric contracts (critical for technical review)
- **Tracked browsers** = distinct non-null `session_hash` values in the selected period. It is **not** a verified person count.
- **Page views** = public `page_view` events in the selected period.
- **Contact visitors** = distinct `session_hash` values with tracked WhatsApp/call/directions actions.
- **Contact rate** = contact visitors divided by tracked browsers, rounded to one decimal; not a verified lead-to-sale conversion rate.
- **Top services** = page-view events for three-segment `/services/{categorySlug}/{serviceSlug}` paths; catalogue titles are looked up for display.
- **City/device/source** = best-effort event metadata, not authoritative demographic facts.
- **7/30 days** use Pakistan calendar days including today; the complete 30-day timeline supports last-7 vs prior-7 chart comparison.
- If source events exceed the existing 5,000-record cap, the entire report is visibly described as a **partial sample**; comparisons not supported by complete data are withheld.
- No invented metrics, arbitrary score, fictitious data or smoothing is introduced.

## Presentation demo flow
1. Open **Overview**: talk through the actual website readiness, priority, published content, and activity summaries.
2. Use **Ctrl+K**, type “history”, navigate to **History**. Show native dialog focus and meaningful IA labels.
3. Open **Analytics**: compare 7 vs 30 days. KPI totals, chart and attribution breakdowns update together.
4. Inspect a chart point with pointer or keyboard, then open exact daily values.
5. Show the **Top services** panel referencing *specific pages*, not only service categories.
6. Open **Services**: jump to a category and edit without losing advanced metadata/SEO.
7. Open **History**: explain snapshots vs full offline recovery without claiming automatic storage restore.

## Acceptance checklist
- CI: TypeScript, ESLint, Next production build, admin unit tests, dependency audit, CodeQL, browser smoke.
- Isolated Supabase/Auth E2E: real owner sign-in, outsider rejection, CRUD and recovery safety.
- Responsive: authenticated desktop (1440), tablet (820), mobile (390) screenshots; reject horizontal document overflow.
- Accessibility: semantic headings, labeled actions, keyboard-accessible command menu and chart, visible focus, reduced-motion styles, chart data in a table.
- Data: 7/30 selection updates **all** metrics; page-view KPI matches chart period; no fake events inserted.

## Explicit limitations and follow-up engineering backlog
- Several legacy CSS layers still exist; a controlled component-token migration and removal of unused selectors is needed. Avoid a risky CSS rewrite just before a production demonstration.
- Automated screenshot **capture** is not the same as pixel-based visual regression. Add stable baselines once layouts are approved.
- No automated axe audit, independent WCAG 2.2 AA assessment, full Lighthouse performance review or security penetration test has been claimed.
- The analytics pipeline can contain legacy/test/bot activity. This UI clarifies provenance but does not retroactively sanitize events.
- No production database schema, authentication policy, CMS CRUD or recovery procedure is changed by this design work.

## Research
- [NN/g: designing complex applications](https://www.nngroup.com/articles/complex-application-design/)
- [USWDS: data visualizations](https://designsystem.digital.gov/components/data-visualizations/)
- [UK Government: testing dashboards for accessibility](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-testing-dashboards-for-design-and-accessibility/)
- [Observable Plot: interactions](https://observablehq.github.io/plot/features/interactions)
- [Tableau: visual best practices](https://help.tableau.com/current/blueprint/en-us/bp_visual_best_practices.htm)
