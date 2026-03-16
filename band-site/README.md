# KAMDRIDI Official Website

Production-ready cinematic artist website for **KAMDRIDI** and **Echoes Unearthed**, built with Next.js, Tailwind CSS, Stripe Checkout, Printful fulfillment hooks, and Vercel-compatible server routes.

## What is included

- Premium dark metal / cinematic visual design
- Responsive pages for Home, Music, News, Band, Tour, Store, Fan Club, Games, Visual Album, Who is Kam Dridi, and Contact
- Dropdown navigation, icon-based social header, and global cart drawer
- Cart-based merch store with featured collector artifact, product grid, and Stripe Checkout
- Stripe subscription links for fan-club memberships
- Stripe webhook route prepared for Printful auto-fulfillment
- Fan club signup/login with signed server-side sessions
- Games launcher page and comic-style reader layout
- Neon Postgres support for fan-club accounts and contact submissions
- SEO metadata, sitemap, robots, and manifest routes

## Tech stack

- Next.js App Router
- React 19
- Tailwind CSS v4
- Next.js Route Handlers for backend logic
- Stripe Checkout
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

1. Open a terminal in `C:\Users\Administrator\OneDrive\Documents\EchoesEngine_complete\band-site`
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
NEXT_PUBLIC_GAME_THE_GILDED_NULL_URL=https://kamdridi.com/games/the-gilded-null
NEXT_PUBLIC_GAME_MONSTER_SYSTEM_URL=https://kamdridi.com/games/monster-system
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
CONTACT_EMAIL=management@kamdridi.com
FAN_CLUB_SESSION_SECRET=replace-with-a-long-random-string
```

## Store automation

The merch store uses cart-based Stripe Checkout and a Stripe webhook for automatic fulfillment.

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

Apple Pay and Google Pay are surfaced automatically by Stripe Checkout when the Stripe account and production domain are configured for wallet support.
After Stripe completes payment, the webhook creates the Printful order automatically, and `/api/store/tracking?session_id=...` can return shipment tracking once Printful ships the order.

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
CONTACT_EMAIL
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
- Stripe Checkout handles credit card, Apple Pay, and Google Pay when supported
- The `/api/stripe/webhook` route is ready for Stripe webhook delivery on Vercel
- Merch checkout is production-ready when Stripe and Printful env vars are configured
- Contact and fan-club persistence are production-ready when `DATABASE_URL` is configured
- SEO routes are already included: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`

## Commercial readiness checklist

- Add live Stripe publishable and secret keys
- Add the live Stripe webhook secret
- Add Printful API credentials and real variant IDs
- Verify checkout, webhook delivery, and fulfillment creation in test mode
- Replace any remaining placeholder social and ticket links
- Configure the production domain in Vercel

## Direct production status

This project is ready to deploy directly to Vercel as long as the required production environment variables are configured, especially:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PRINTFUL_API_KEY`
- `DATABASE_URL`
- `FAN_CLUB_SESSION_SECRET`

With those set, the site can process merch orders, accept memberships, and route eligible store items into automatic fulfillment.
