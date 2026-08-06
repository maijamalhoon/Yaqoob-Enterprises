# Yaqoob Enterprises

Production-oriented Next.js website and Supabase-backed admin centre for Yaqoob Enterprises in Akhtar Colony, Karachi.

## Included

- Responsive customer-facing website
- Eight service-category pages with service modes and requirements
- WhatsApp request builder with service-aware delivery options
- Coverage, pricing, hours and contact content from Supabase
- Passwordless admin authentication restricted by an email allowlist
- Service, category, coverage, gallery, settings, announcements and analytics management
- Privacy-conscious page-view and contact-action analytics
- Supabase Storage gallery with image focal-point controls
- Temporary storefront concept image clearly labelled until real photos are uploaded

## Environment

Public Supabase values have safe defaults in `lib/env.ts`, and may be overridden using `.env.local`:

```bash
cp .env.example .env.local
```

## Development

```bash
npm install
npm run dev
```

## Validation

```bash
npm run typecheck
npm run lint
npm run build
```

## Admin access

The owner email is allowlisted in Supabase. The login page sends a passwordless email link. Configure Supabase Auth redirect URLs for the production domain and Vercel previews before final launch.
