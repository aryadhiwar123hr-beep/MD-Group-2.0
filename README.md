# MD Group — Facility & Workforce Solutions

A front-end prototype for the MD Group platform: marketing homepage, client portal, worker portal, and admin dashboard. Static HTML/CSS/JS — open `index.html` in a browser, no build step needed.

## What's in this prototype

| File | Purpose |
|---|---|
| `index.html` | Homepage — hero, live service catalog (5 categories, add-to-quote), how it works, dual CTA, industries, trust section |
| `client-portal.html` | Client dashboard, book-a-service / quote request form, active contracts, invoices, support tickets |
| `worker-portal.html` | Worker onboarding form (role select, document upload, background-check consent), schedule/verification tracker, earnings view |
| `admin-dashboard.html` | Revenue & KPI overview, service request queue, staff deployment table, worker verification queue, invoicing |
| `css/main.css` | Design system — colors, type, components |
| `js/main.js` | Service catalog rendering, tab/panel switching, form-to-confirmation flow, mobile nav |

Everything is functional in-browser (tabs, forms, chip selectors, sidebar navigation) but **not connected to a backend** — form submissions simulate success locally and nothing is persisted.

## Design system

- **Palette**: navy `#0b1f3a` (primary/trust), slate `#3e4c59` (structure/text), gold `#c9a227` (client CTA / premium accent), emerald `#0f6e56` (worker CTA / verified status)
- **Type**: Space Grotesk (headings), Inter (body), IBM Plex Mono (stats, statuses, badges — the "operations data" feel)
- **Signature motif**: a dot-grid "coverage field" used behind the hero and section dividers — a nod to site/roster mapping rather than a generic gradient

## What this is *not* yet — production roadmap

This is UI/UX only. To become the real product described in the brief, you'd add:

### 1. Backend & data layer
- API (Node/Express or NestJS, or Django/FastAPI) with a Postgres database
- Core tables: `clients`, `sites`, `contracts`, `services`, `service_requests`, `workers`, `worker_documents`, `shifts`, `invoices`, `payments`
- Auth: role-based (client / worker / admin), e.g. via Auth0, Clerk, or a custom JWT flow

### 2. Client portal — real functionality
- Quote request → routes to admin queue, generates a proposal record
- Contract & shift data pulled live from `contracts`/`shifts` tables
- **Stripe** (or Razorpay for INR) integration for invoice payment — Checkout Sessions or Payment Intents, with webhook handling for payment confirmation

### 3. Worker portal — real functionality
- Document upload → object storage (S3 / Cloudflare R2), linked to `worker_documents`
- Background-check integration (third-party verification API)
- Shift assignment synced from admin deployment actions
- Payout handling — Stripe Connect (or a payroll provider) for worker earnings disbursement

### 4. Admin dashboard — real functionality
- Service request triage → assign staff from a worker pool filtered by role/verification/location
- Verification workflow with document review and approve/reject actions
- Invoice generation tied to contract billing cycles
- Revenue reporting from real transaction data

### 5. Mobile app
The same information architecture (client portal / worker portal / admin) maps directly to a **React Native** (or Flutter) app sharing the API built above:
- Worker app: onboarding, push notifications for shift assignment, GPS check-in/out for shifts, earnings
- Client app: lighter version — request services, view contracts, pay invoices, raise tickets
- Consider starting mobile with the **worker app first** — it has the highest daily-use frequency (shift check-in, schedule) and benefits most from being native vs. a mobile web view

### 6. Suggested stack summary
- **Frontend**: migrate this prototype to React/Next.js for real state management and routing
- **Backend**: Node.js (NestJS) + PostgreSQL + Redis (for shift/session caching)
- **Payments**: Stripe (or Razorpay)
- **File storage**: S3-compatible bucket for ID/document uploads
- **Mobile**: React Native (shares types/logic with the Next.js frontend if using TypeScript throughout)
- **Hosting**: Vercel (frontend) + Railway/Render/AWS (API + DB)
