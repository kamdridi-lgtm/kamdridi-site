# Store and Stripe readiness

## Current architecture

- Prices and product names are resolved from `data/commerce-products.ts` on the server. Values sent by the browser are not trusted.
- One-time orders use hosted Stripe Checkout Sessions.
- Physical products collect shipping details; digital products do not.
- Preorders carry an explicit preorder note and project metadata.
- Webhook processing remains the source of truth for paid fulfillment.
- Stripe Tax is intentionally not enabled until active tax registrations are confirmed in the Stripe Dashboard.

## Release readiness gates

Before a new physical edition is enabled for checkout, all of the following must be known:

1. Final manufacturing quote, including packaging and inserts.
2. Retail price approved from the real cost basis. Never estimate a live price from artwork alone.
3. Shipping countries and fulfillment method.
4. Final product image and delivery/preorder wording.
5. Stripe test checkout completed.
6. Webhook delivery verified.
7. Fulfillment notification verified.

The Australia maxi single is the only Australia edition currently enabled; the CD and cassette remain `coming_soon` with checkout disabled. This prevents a zero-price or unquoted physical product from being sold.

## Environment variables

Production secrets belong in Vercel environment variables, never in GitHub or documentation:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL` (canonical public URL)
- fulfillment and notification variables used by the existing webhook integrations

Use restricted keys where possible and rotate any credential that has ever appeared in chat, source code, screenshots, or logs.

## Verification

Run:

```bash
npm run commerce:verify
npm run lint
npm run build
```

No new price, tax rule, or fulfillment promise should go live unless the corresponding readiness gate is satisfied.
