# KAMDRIDI Official Website

Dark cinematic artist website for **KAMDRIDI** and **Echoes Unearthed**, built with Next.js, Tailwind CSS, hosted checkout support, fan-club flows, and Vercel-compatible server routes.

## What is included

- Premium dark metal / cinematic visual design
- Responsive pages for Home, Music, News, Band, Tour, Store, Fan Club, Games, Visual Album, Who is Kam Dridi, and Contact
- Dropdown navigation, icon-based social header, and global cart drawer
- Cart-based merch store with featured collector artifact, product grid, and hosted checkout support
- Membership tier links for fan-club access when live checkout links are configured
- Stripe webhook route prepared for Printful auto-fulfillment
- Fan club signup/login with signed server-side sessions
- KAMDRIDI RECORDS label system with applications, admin review, artist dashboard, release workflow, contracts, royalties, payouts, analytics, messaging, and simulation-safe email automation
- Games launcher page and comic-style reader layout
- Neon Postgres support for fan-club accounts and contact submissions
- Multi-agent orchestration layer with local JSON fallback and optional Supabase persistence
- SEO metadata, sitemap, robots, and manifest routes

## Tech stack

- Next.js App Router
- React 19
- Tailwind CSS v4
- Next.js Route Handlers for backend logic
- Hosted checkout support
- Printful API
- Neon serverless Postgres

## Project structure

```text
band-site/
  app/
    api/
      checkout/
      contact/
      fan-club/
      stripe/
      tour/
    band/
    contact/
    fan-club/
    games/
    media/
    music/
    news/
    store/
    tour/
    visual-album/
    who-is-kam-dridi/
    globals.css
    layout.tsx
    manifest.ts
    page.tsx
    robots.ts
    sitemap.ts
  components/
    cart-drawer.tsx
    contact-form.tsx
    comic-reader.tsx
    fan-club.tsx
    first-knight-easter-egg.tsx
    games-panel.tsx
    music-hub.tsx
    providers.tsx
    site-shell.tsx
    storefront.tsx
    ui.tsx
  data/
    store.ts
    site.ts
  lib/
    printful.ts
    session.ts
    storage.ts
    stripe.ts
    utils.ts
  public/
    assets/
    store/
  .env.example
  next.config.ts
  package.json
  postcss.config.mjs
  tsconfig.json
```

## Local installation

1. Open a terminal in `C:\Users\Administrator\.openclaw\tmp\kamdridi-site-deploy\band-site`
2. Copy `.env.example` to `.env.local`
3. Install dependencies:

```powershell
cmd /c npm install --cache .npm-cache
```

4. Start development:

```powershell
cmd /c npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Environment variables

Create `.env.local` with:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
NEXT_PUBLIC_STRIPE_LINK_INNER_CIRCLE=https://buy.stripe.com/your-inner-circle-link
NEXT_PUBLIC_STRIPE_LINK_COLLECTOR=https://buy.stripe.com/your-collector-link
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_example
PRINTFUL_API_KEY=printful_api_key
PRINTFUL_SHIPPING_SPEED=STANDARD
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_BLACK_S=100001
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_BLACK_M=100002
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_BLACK_L=100003
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_BLACK_XL=100004
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_BLACK_XXL=100005
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_WHITE_S=100006
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_WHITE_M=100007
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_WHITE_L=100008
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_WHITE_XL=100009
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_WHITE_XXL=100010
DATABASE_URL=postgres://user:password@host:5432/dbname
FAN_CLUB_SESSION_SECRET=replace-with-a-long-random-string
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

## Agent system

The recovered advanced site now includes the autonomous agent layer directly inside the Next.js app.

Core files:

- `ops/agent-manifest.json`
- `lib/agents/store.ts`
- `lib/agents/system.ts`
- `app/api/agents/intake/route.ts`
- `app/api/agents/status/route.ts`
- `app/api/agents/reset/route.ts`
- `app/api/agents/orchestrator/route.ts`
- `app/agents/page.tsx`
- `supabase/multi-agent-system.sql`
- `supabase/verify-agent-system.sql`

How it runs:

- Local with no Supabase env vars: persists to `data/agent-system.json`
- With `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`: persists to Supabase through REST
- On Vercel: `vercel.json` schedules `/api/agents/orchestrator` every 5 minutes

Manual endpoints:

- `POST /api/agents/intake`
- `GET /api/agents/status`
- `POST /api/agents/restart`
- `GET /api/agents/orchestrator`

Control page:

- `/agents`

## Store automation

The merch store uses a cart-based hosted checkout flow and a Stripe webhook for automatic fulfillment when live credentials are configured.

For production:

1. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`
2. Set `NEXT_PUBLIC_SITE_URL` to your production domain
3. In Stripe, create a webhook endpoint for:
   `https://your-domain.com/api/stripe/webhook`
4. Subscribe the webhook to `checkout.session.completed`
5. Add `STRIPE_WEBHOOK_SECRET` from Stripe
6. Add `PRINTFUL_API_KEY`
7. Add `PRINTFUL_STORE_ID` if the Printful token is account-scoped instead of store-scoped
8. Fill in the `PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_*`, `PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_*`, and `PRINTFUL_VARIANT_POSTERS_DEFAULT_DEFAULT` env vars with the real Printful variant IDs
9. Test checkout in Stripe test mode before switching to live keys

Apple Pay and Google Pay are surfaced automatically by hosted checkout when the Stripe account and production domain are configured for wallet support.
After Stripe completes payment, the webhook can create the Printful order automatically, and `/api/store/tracking?session_id=...` can return shipment tracking once Printful ships the order.

## KAMDRIDI RECORDS label system

Routes:

- `/label` public label page
- `/label/apply` artist application portal
- `/label/admin` private admin dashboard v2
- `/label/artist` signed artist dashboard
- `/label/artist/[slug]` public artist profile

Included modules:

- `label/analytics/advanced_stats.ts`: platform stream tracking, royalty reports, CSV/PDF text export, annual projections, Chart.js-ready payloads
- `label/releases/manager.ts`: release workflow, metadata, ISRC/UPC auto-generation, artwork and audio quality checks
- `label/notifications/email_system.ts`: bilingual simulated email automation with Resend/SendGrid readiness
- `label/messaging/chat.ts`: internal admin/artist conversations, attachments, unread tracking
- `label/legal/advanced_contracts.ts`: distribution, license, split sheet, and NDA contract templates with digital acceptance
- `label/codes/isrc_generator.ts`: unique ISRC and UPC/EAN generation
- `label/finance/payouts.ts`: royalty payable calculation, threshold checks, payout history, Stripe Connect bridge
- `label/mobile/responsive.ts`: PWA/mobile capability helpers
- `label/security/backup.ts`: activity logs, rate limits, encryption helpers, backup snapshots, 2FA/recaptcha simulation gates
- `label/marketing/automation.ts`: pre-save links, social campaigns, milestones, QR payloads
- `label/promo/playlist_pitching.ts`: playlist database, pitch templates, submission status
- `label/i18n/translations.ts`: FR/EN strings and language detection
- `label/branding/customization.ts`: label branding configuration
- `label/public/seo_pages.tsx`: SEO helpers and public label sections

Simulation is the default. With no Stripe, Resend, SendGrid, Blob, or database credentials, the system records local JSON files under `data/label/` for development. For Vercel production persistence, configure `DATABASE_URL` and run `scripts/label-migration.sql` against the database. Real demo, master, cover, attachment, and generated-contract files are stored through Vercel Blob when `BLOB_READ_WRITE_TOKEN` is configured. Without that token, local dev writes to `public/uploads/label/...`; Vercel production falls back to `simulation://` URLs so workflows stay testable without pretending files were permanently stored.

Label env vars:

```env
LABEL_ADMIN_EMAILS=contact@kamdridi.com
LABEL_APPLICATION_FEE_CENTS=2000
LABEL_PAYOUT_THRESHOLD_CENTS=5000
LABEL_ISRC_REGISTRANT=KDR
LABEL_UPC_PREFIX=628011
LABEL_EMAIL_MODE=simulation
RESEND_API_KEY=
SENDGRID_API_KEY=
LABEL_RECAPTCHA_MODE=simulation
LABEL_2FA_MODE=simulation
LABEL_ADMIN_2FA_CODE=
LABEL_ENCRYPTION_SECRET=replace-with-a-long-random-label-secret
BLOB_READ_WRITE_TOKEN=vercel_blob_rw_token_for_real_label_file_uploads
```

## Fan club and contact storage

The app supports two modes:

- Local development fallback: JSON files in `data/`
- Production / Vercel: Neon Postgres through `DATABASE_URL`

For real deployment, use a hosted Postgres database so fan-club signup and contact form submissions persist correctly in production.

## Build and production run

```powershell
cmd /c npm run build
cmd /c npm run start
```

## Deploy to Vercel

1. Push the `band-site` folder to a Git repository
2. Create a new Vercel project from that repository
3. Add a hosted Postgres database
4. Add these environment variables in Vercel Project Settings:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
NEXT_PUBLIC_STRIPE_LINK_INNER_CIRCLE
NEXT_PUBLIC_STRIPE_LINK_COLLECTOR
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
PRINTFUL_API_KEY
PRINTFUL_STORE_ID
PRINTFUL_SHIPPING_SPEED
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_BLACK_S
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_BLACK_M
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_BLACK_L
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_BLACK_XL
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_BLACK_XXL
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_WHITE_S
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_WHITE_M
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_WHITE_L
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_WHITE_XL
PRINTFUL_VARIANT_WAR_MACHINES_ARTIFACT_TEE_WHITE_XXL
PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_BLACK_S
PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_BLACK_M
PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_BLACK_L
PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_BLACK_XL
PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_BLACK_XXL
PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_WHITE_S
PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_WHITE_M
PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_WHITE_L
PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_WHITE_XL
PRINTFUL_VARIANT_ECHOES_UNEARTHED_TEE_WHITE_XXL
PRINTFUL_VARIANT_POSTERS_DEFAULT_DEFAULT
DATABASE_URL
FAN_CLUB_SESSION_SECRET
```

5. Set `NEXT_PUBLIC_SITE_URL` to your production domain, for example:

```text
https://kamdridi-site.vercel.app
```

6. Redeploy the project

## Vercel deployment notes

- No custom server is required
- Next.js App Router is ready for direct Vercel deployment
- Hosted checkout handles credit card, Apple Pay, and Google Pay when supported
- The `/api/stripe/webhook` route is ready for Stripe webhook delivery on Vercel
- Merch checkout becomes live when Stripe and Printful env vars are configured
- Contact and fan-club persistence become durable when `DATABASE_URL` is configured
- SEO routes are already included: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`

## Commercial readiness checklist

- Add live Stripe publishable and secret keys
- Add the live Stripe webhook secret
- Add Printful API credentials and real variant IDs
- Verify checkout, webhook delivery, and fulfillment creation in test mode
- Replace any remaining placeholder social and ticket links
- Configure the production domain in Vercel

## Direct production status

This project can deploy directly to Vercel as long as the required production environment variables are configured, especially:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PRINTFUL_API_KEY`
- `DATABASE_URL`
- `FAN_CLUB_SESSION_SECRET`

With those set, the site can process merch orders through live hosted checkout, accept memberships through live links, and route eligible store items into automatic fulfillment.
