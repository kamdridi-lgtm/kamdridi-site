import type Stripe from "stripe";
import { printfulMappedProducts, storeProducts } from "@/data/store";

type PrintfulLineItem = {
  variant_id: number;
  quantity: number;
  retail_price: string;
  name: string;
  files?: Array<{ type: string; url: string }>;
};

function normalizeToken(value: string | null | undefined) {
  return (value ?? "default").replace(/[^a-z0-9]+/gi, "_").toUpperCase();
}

function getProductById(productId: string) {
  return (
    storeProducts.find((product) => product.id === productId) ||
    printfulMappedProducts.find((product) => product.id === productId)
  );
}

function getVariantEnvKey(productId: string, color?: string, size?: string) {
  const product = getProductById(productId);
  if (!product || !('printfulEnvPrefix' in product) || !product.printfulEnvPrefix) {
    return null;
  }
  return `PRINTFUL_VARIANT_${product.printfulEnvPrefix}_${normalizeToken(color)}_${normalizeToken(size)}`;
}

function getPrintfulVariantId(productId: string, color?: string, size?: string) {
  const envKey = getVariantEnvKey(productId, color, size);
  if (!envKey) return null;
  const value = process.env[envKey];
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getPrintfulApiBase() {
  return process.env.PRINTFUL_API_BASE_URL || "https://api.printful.com";
}

// SECURE TOKEN READ
function getPrintfulToken() {
  return process.env.PRINTFUL_API_TOKEN || process.env.PRINTFUL_API_KEY; // fallback if needed, but token is preferred
}

function getPrintfulHeaders() {
  const token = getPrintfulToken();
  if (!token) {
    throw new Error("Missing Printful API Token.");
  }
  
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  };

  if (process.env.PRINTFUL_STORE_ID) {
    headers["X-PF-Store-Id"] = process.env.PRINTFUL_STORE_ID;
  }
  return headers;
}

function buildRecipient(session: Stripe.Checkout.Session) {
  const shippingSession = session as Stripe.Checkout.Session & {
    shipping_details?: {
      name?: string | null;
      address?: Stripe.Address | null;
    };
  };
  const shipping = shippingSession.shipping_details;
  const customer = session.customer_details;
  const address = shipping?.address ?? customer?.address;
  const recipientName = shipping?.name ?? customer?.name;

  if (!address || !recipientName) return null;

  return {
    name: recipientName,
    email: customer?.email ?? undefined,
    phone: customer?.phone ?? undefined,
    address1: address.line1,
    address2: address.line2 ?? undefined,
    city: address.city ?? "",
    state_code: address.state ?? undefined,
    country_code: address.country ?? "",
    zip: address.postal_code ?? ""
  };
}

// ---------------------------------------------------------
// NEW SAFE FUNCTIONS FOR CATALOG / VARIANTS / SHIPPING
// ---------------------------------------------------------

export async function getPrintfulStore() {
  if (!getPrintfulToken()) return { error: "Missing token" };
  try {
    const res = await fetch(`${getPrintfulApiBase()}/store/info`, { headers: getPrintfulHeaders() });
    if (!res.ok) return { error: "Failed to fetch store" };
    return await res.json();
  } catch {
    return { error: "Network error" };
  }
}

export async function getPrintfulCatalog() {
  if (!getPrintfulToken()) return { error: "Missing token" };
  try {
    const res = await fetch(`${getPrintfulApiBase()}/catalog/products`, { headers: getPrintfulHeaders() });
    if (!res.ok) return { error: "Failed to fetch catalog" };
    return await res.json();
  } catch {
    return { error: "Network error" };
  }
}

export async function getPrintfulVariant(variantId: number) {
  if (!getPrintfulToken()) return { error: "Missing token" };
  try {
    const res = await fetch(`${getPrintfulApiBase()}/catalog/variants/${variantId}`, { headers: getPrintfulHeaders() });
    if (!res.ok) return { error: "Failed to fetch variant" };
    return await res.json();
  } catch {
    return { error: "Network error" };
  }
}

export async function calculateShippingRates(recipient: any, items: PrintfulLineItem[]) {
  if (!getPrintfulToken()) return { error: "Missing token" };
  try {
    const res = await fetch(`${getPrintfulApiBase()}/shipping/rates`, {
      method: "POST",
      headers: getPrintfulHeaders(),
      body: JSON.stringify({ recipient, items })
    });
    if (!res.ok) return { error: "Failed to calculate shipping" };
    return await res.json();
  } catch {
    return { error: "Network error" };
  }
}

// ---------------------------------------------------------
// ORDER CREATION
// ---------------------------------------------------------

export async function createPrintfulOrderFromSession(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.ApiList<Stripe.LineItem>
) {
  const token = getPrintfulToken();
  if (!token) {
    return { skipped: true, reason: "PRINTFUL_API_TOKEN is not configured." };
  }

  const recipient = buildRecipient(session);
  if (!recipient) {
    return { skipped: true, reason: "Shipping recipient details were not available." };
  }

  const items: PrintfulLineItem[] = [];

  for (const lineItem of lineItems.data) {
    const product = lineItem.price?.product;
    if (!product || typeof product === "string" || "deleted" in product) continue;

    const metadata = product.metadata ?? {};
    if (metadata.fulfillmentMode !== "printful") continue;

    const productId = metadata.productId;
    const color = metadata.color;
    const size = metadata.size;
    const variantId = getPrintfulVariantId(productId, color, size);

    if (!variantId) continue;

    items.push({
      variant_id: variantId,
      quantity: lineItem.quantity ?? 1,
      retail_price: ((lineItem.amount_total ?? 0) / 100).toFixed(2),
      name: product.name
    });
  }

  if (!items.length) {
    return { skipped: true, reason: "No Printful-eligible items were found in this order." };
  }

  // SAFETY: confirm: false ensures this is only a DRAFT order and won't charge/manufacture.
  const response = await fetch(`${getPrintfulApiBase()}/orders`, {
    method: "POST",
    headers: getPrintfulHeaders(),
    body: JSON.stringify({
      external_id: `stripe_${session.id}`,
      shipping: process.env.PRINTFUL_SHIPPING_SPEED || "STANDARD",
      confirm: false, // DO NOT COMMIT A REAL ORDER
      recipient,
      items
    })
  });

  if (!response.ok) {
    // DO NOT expose token or raw payload if it contains secrets. Just log a generic error.
    throw new Error("Printful draft order failed to create.");
  }

  return { skipped: false, draft: true };
}

function getForgeVariantId(gender: string, sleeves: string) {
  if (gender === 'women') {
    return sleeves === 'long' ? 9341 : 11211;
  }
  return sleeves === 'long' ? 6056 : 4012; 
}

export async function createCustomForgeOrder(session: Stripe.Checkout.Session) {
  const token = getPrintfulToken();
  if (!token) return { skipped: true, reason: "PRINTFUL_API_TOKEN is not configured." };

  const recipient = buildRecipient(session);
  if (!recipient) return { skipped: true, reason: "Shipping recipient details were not available." };

  const meta = session.metadata || {};
  const gender = meta.gender || 'men';
  const sleeves = meta.sleeves || 'short';
  const printSides = meta.printSides || 'front';
  const imageUrl = meta.imageUrl;

  if (!imageUrl) {
    return { skipped: true, reason: "No generated image URL found in session metadata." };
  }

  const variantId = getForgeVariantId(gender, sleeves);
  
  const files = [];
  if (printSides === 'front' || printSides === 'both') {
    files.push({ type: 'front', url: imageUrl });
  }
  if (printSides === 'back' || printSides === 'both') {
    files.push({ type: 'back', url: imageUrl });
  }

  const items = [{
    variant_id: variantId,
    quantity: 1,
    retail_price: "0.00",
    name: "Forge Custom Item",
    files
  }];

  // SAFETY: confirm: false ensures this is only a DRAFT order and won't charge/manufacture.
  const response = await fetch(`${getPrintfulApiBase()}/orders`, {
    method: "POST",
    headers: getPrintfulHeaders(),
    body: JSON.stringify({
      external_id: `forge_${session.id}`,
      shipping: process.env.PRINTFUL_SHIPPING_SPEED || "STANDARD",
      confirm: false, // DO NOT COMMIT A REAL ORDER
      recipient,
      items
    })
  });

  if (!response.ok) {
    throw new Error("Printful Forge draft order failed to create.");
  }

  return { skipped: false, draft: true };
}

export async function getPrintfulTrackingForSession(sessionId: string) {
  const token = getPrintfulToken();
  if (!token) {
    return { configured: false, shipped: false };
  }

  const response = await fetch(`${getPrintfulApiBase()}/v2/orders/@stripe_${sessionId}/shipments`, {
    headers: getPrintfulHeaders(),
    cache: "no-store"
  });

  if (response.status === 404) {
    return { configured: true, shipped: false };
  }

  if (!response.ok) {
    throw new Error("Printful tracking lookup failed.");
  }

  const payload = (await response.json()) as any;
  const shipments = payload.data ?? [];
  const latest = shipments.find((shipment: any) => shipment.tracking_number || shipment.tracking_url);

  if (!latest) {
    return { configured: true, shipped: false };
  }

  return {
    configured: true,
    shipped: true,
    trackingNumber: latest.tracking_number ?? null,
    trackingUrl: latest.tracking_url ?? null,
    status: latest.status ?? null,
    shippedAt: latest.shipped_at ?? null
  };
}
