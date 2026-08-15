# Yaqoob Enterprises

Customer website and admin centre for Yaqoob Enterprises, built with Next.js and Supabase.

## Current UI branch

The `agent/premium-ui-system` branch contains the current customer/admin visual redesign and responsive QA work.

### Hero refinement

The homepage hero uses a concise static headline with a lightweight CSS-only rotating service cue for Printing, Documents, Online forms, Payments, Tickets and Biometric services. The rotation respects `prefers-reduced-motion` and does not add a JavaScript carousel or timer.

### Responsive validation

Browser smoke coverage checks the homepage across 280, 320, 360, 390, 430, 768, 1024, 1366, 1440 and 1920px viewport widths, including horizontal-overflow protection, service visibility, mobile navigation, forms and the desktop WhatsApp action.

## Development

```bash
npm install
npm run dev
```

## Production checks

```bash
npm run typecheck
npm run lint
npm run build
```
