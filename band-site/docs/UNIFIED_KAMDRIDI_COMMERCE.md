# Unified KAMDRIDI Commerce System

## 1. Single Source of Truth
The central repository for all products in the KAMDRIDI store is `band-site/data/commerce-products.ts`.
This file (`commerceProducts`) defines the *canonical catalog*. 

There must be exactly **27 unique products** maintained in the catalog (3 Echoes, 11 Salieri's Hands, 13 Store/Digital Access products). No products should be deleted.

## 2. Server-Side Integrity
Under no circumstances should the server trust the `price`, `name`, `image`, or validation rules sent from the client-side (`localStorage` or cart state).
The client only sends the `id` and the selected `color`/`size` variants.
The server explicitly resolves these via the `resolveCommerceCheckoutItems` function, overriding whatever the client provided with the canonical values.

## 3. Product Statuses & Sale Modes
Products have different `saleMode` states:
- `buy_now`: Available for immediate fulfillment (e.g. Kamdridi Core, Tees). Button: ADD TO CART
- `preorder`: Physical collector campaigns (e.g. Salieri's Hands, Echoes Brasil). Button: PRE-ORDER
- `digital`: Digital delivery only. Button: ORDER DIGITAL
- `sold_out`: No longer available. Button: SOLD OUT (cannot be added to cart).

## 4. No Dummy Databases
There is no local dummy database. State is maintained completely statelessly on the server using Stripe Checkout Sessions. The `metadata` field of the Stripe session is used to pass variants (size, color) securely to the webhook.

## 5. Non-Blocking Fulfillment
Fulfillment notifications (like sending an email to `kam@kamdridi.com`) in the Stripe Webhook (`band-site/app/api/stripe/webhook/route.ts`) must **not** block the `200 OK` response to Stripe.
If an email fails to send, the order is still recorded and paid successfully in Stripe.

## 6. Cart Safety
The `Providers` (`cart-drawer` state) parses `localStorage` defensively:
- Validates that the payload is an array.
- Look up every product via `getCommerceProductById`.
- Drops unknown products.
- Validates colors and sizes against canonical arrays.
- Limits quantity (hard cap at 20 or `quantityLimit`).

## 7. Unified Storefront
The main store page (`band-site/components/storefront.tsx`) dynamically renders the unified catalog grouped into categories:
- FEATURED
- ECHOES UN LIVE IN BRASIL
- SALIERI'S HANDS
- ECHOES UNEARTHED
- KAMDRIDI CORE
- DIGITAL ACCESS

All products use the same unified Cart Drawer and Checkout process.

## 8. Stripe & Printful
Stripe is the canonical financial ledger. Print-on-demand fulfillment for supported products is requested immediately when the `checkout.session.completed` event is verified. 
For artisanal made-to-order products (Lathe Cut, Collector Bundles), they are tagged for manual KAMDRIDI fulfillment.
