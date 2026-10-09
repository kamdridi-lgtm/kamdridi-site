import Stripe from "stripe";

function normalizeStripeSecret(value: string | undefined) {
  if (!value) return null;

  const normalized = value
    .trim()
    .replace(/^["']/, "")
    .replace(/["']$/, "")
    .replace(/\s+/g, "");

  return normalized || null;
}

export function hasStripeServerCredentials() {
  return Boolean(normalizeStripeSecret(process.env.STRIPE_SECRET_KEY));
}

export function getStripeWebhookSecret() {
  return normalizeStripeSecret(process.env.STRIPE_WEBHOOK_SECRET);
}

export function getStripeServer() {
  const secretKey = normalizeStripeSecret(process.env.STRIPE_SECRET_KEY);
  if (!secretKey) {
    return null;
  }

  return new Stripe(secretKey, {
    // Keep the account on Basil while satisfying the current SDK's latest-version-only type.
    apiVersion: "2025-08-27.basil" as Stripe.LatestApiVersion
  });
}
