# Contributing

Thanks for helping improve Yaqoob Enterprises.

## Workflow

1. Create a focused branch from the latest `main`: `feat/short-description`, `fix/short-description` or `chore/short-description`.
2. Keep each pull request limited to one concern where practical.
3. Explain the problem, intended behaviour, any user-visible changes and risks.
4. Never commit real credentials, `.env.local`, production exports or customer data.
5. Do not bypass authentication/authorization checks or weaken Row Level Security (RLS) to make a test pass.
6. Database changes must be additive and reviewed carefully. Do not reset or destructively reseed production data.
7. Wait for required checks to finish and address failures before merging.

## Before opening a pull request

Run the applicable checks:

```bash
npm ci
npm run typecheck
npm run lint
npm run build
```

For changes to navigation, forms, authentication, admin routes, CSP/security headers or responsive layouts, include browser-smoke evidence and manually verify affected behaviour in a preview deployment.

For SQL, Supabase Auth, RLS, storage policies or admin permissions, explain the security impact and how it was tested without exposing secrets or production data.

## Pull request expectations

- Link the related issue when one exists.
- Document behaviour changes and update README/docs when needed.
- Add or update automated regression coverage for bug fixes when practical.
- Include screenshots for meaningful visual changes, without personal or sensitive information.
- Do not merge a conflicted, stale or failing pull request. Rebase/refresh it onto latest `main`, resolve conflicts deliberately, and rerun checks.
