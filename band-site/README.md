# KAMDRIDI Official Website

Production-ready cinematic artist website for **KAMDRIDI** and **Echoes Unearthed**, built with Next.js, Tailwind CSS, Stripe Checkout, and Vercel-compatible server routes.

## What is included

- Premium dark metal / cinematic visual design
- Responsive pages for Home, News, Band, Tour, Media, Store, Fan Club, and Contact
- Dropdown navigation and social media header
- Stripe Checkout store with product images, size selection, and cart state
- Fan club signup/login with signed server-side sessions
- Neon Postgres support for fan-club accounts and contact submissions
- SEO metadata, sitemap, robots, and manifest routes
- Placeholder images, merch art, and release artwork

## Tech stack

- Next.js App Router
- React 19
- Tailwind CSS v4
- Next.js Route Handlers for backend logic
- Stripe Checkout
- Neon serverless Postgres

## Project structure

```text
band-site/
  app/
    api/
      checkout/
      contact/
      fan-club/
      tour/
    band/
    contact/
    fan-club/
    media/
    news/
    store/
    tour/
    globals.css
    layout.tsx
    manifest.ts
    page.tsx
    robots.ts
    sitemap.ts
  components/
    contact-form.tsx
    fan-club.tsx
    providers.tsx
    site-shell.tsx
    storefront.tsx
    ui.tsx
  data/
    contact-submissions.json
    fan-club-users.json
    site.ts
  lib/
    session.ts
    storage.ts
    stripe.ts
    utils.ts
  public/
    assets/
      images/
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
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_example
DATABASE_URL=postgres://user:password@host:5432/dbname
CONTACT_EMAIL=management@kamdridi.com
FAN_CLUB_SESSION_SECRET=replace-with-a-long-random-string
```

## Stripe configuration

Stripe Checkout is implemented in [app/api/checkout/route.ts](/C:/Users/Administrator/OneDrive/Documents/EchoesEngine_complete/band-site/app/api/checkout/route.ts).

For production:

1. Create a Stripe account
2. Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Add `STRIPE_SECRET_KEY`
4. Set your production site URL in `NEXT_PUBLIC_SITE_URL`
5. Test checkout in Stripe test mode before switching to live keys

If Stripe keys are missing in local development, the store falls back to a simulated success redirect so the UI can still be tested.

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
3. Add a **Neon Postgres** database or another hosted Postgres database
4. Add these environment variables in Vercel Project Settings:

```text
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
DATABASE_URL
CONTACT_EMAIL
FAN_CLUB_SESSION_SECRET
```

5. Set `NEXT_PUBLIC_SITE_URL` to your production domain, for example:

```text
https://kamdridi.com
```

6. Redeploy the project

## Vercel deployment notes

- No custom server is required
- Next.js App Router is ready for direct Vercel deployment
- Fan club auth uses signed cookies and works on serverless routes
- Contact and fan-club persistence are production-ready when `DATABASE_URL` is configured
- SEO routes are already included: `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest`

## Commercial readiness checklist

- Replace placeholder social/profile URLs with real KAMDRIDI links
- Replace the placeholder YouTube embed in `data/site.ts`
- Replace sample ticket links with real ticketing URLs
- Add live Stripe keys when you are ready to sell
- Configure a production domain in Vercel
- Verify checkout, signup, and contact form once production env vars are set

## Direct production status

This project is ready to deploy directly to Vercel **as long as** the required production environment variables are configured, especially:

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `DATABASE_URL`
- `FAN_CLUB_SESSION_SECRET`

With those set, the site can be deployed to production and used commercially.
