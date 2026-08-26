import type Stripe from "stripe";
import { printfulMappedProducts, storeProducts } from "@/data/store";

type PrintfulLineItem = {
  variant_id?: number;
  sync_variant_id?: number;
  quantity: number;
  retail_price: string;
  name: string;
  files?: Array<{ type?: string; url: string }>;
};

type PrintfulStore = {
  id: number;
  type?: string;
  name?: string;
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
  if (!product || !("printfulEnvPrefix" in product) || !product.printfulEnvPrefix) return null;
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

function getPrintfulToken() {
  return process.env.PRINTFUL_API_TOKEN || process.env.PRINTFUL_API_KEY;
}

function baseHeaders() {
  const token = getPrintfulToken();
  if (!token) throw new Error("Missing Printful API token.");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  } as Record<string, string>;
}

export async function listPrintfulStores(): Promise<PrintfulStore[]> {
  const response = await fetch(`${getPrintfulApiBase()}/stores`, {
    headers: baseHeaders(),
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Printful stores request failed (${response.status}).`);
  const payload = (await response.json()) as { result?: PrintfulStore[] };
  return Array.isArray(payload.result) ? payload.result : [];
}

async function resolvePrintfulStoreId() {
  const configured = process.env.PRINTFUL_STORE_ID?.trim();
  if (configured) return configured;

  const stores = await listPrintfulStores();
  if (stores.length === 1) return String(stores[0].id);
  if (!stores.length) throw new Error("No Printful store is available for this token.");
  throw new Error("Multiple Printful stores are available; PRINTFUL_STORE_ID must be configured.");
}

async function storeHeaders() {
  const headers = baseHeaders();
  headers["X-PF-Store-Id"] = await resolvePrintfulStoreId();
  return headers;
}

function buildRecipient(session: Stripe.Checkout.Session) {
  const shippingSession = session as Stripe.Checkout.Session & {
    shipping_details?: { name?: string | null; address?: Stripe.Address | null };
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

export async function getPrintfulStore() {
  const stores = await listPrintfulStores();
  const selectedId = await resolvePrintfulStoreId();
  return stores.find((store) => String(store.id) === selectedId) ?? null;
}

export async function getPrintfulCatalog() {
  const res = await fetch(`${getPrintfulApiBase()}/products`, {
    headers: baseHeaders(),
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Printful catalog request failed (${res.status}).`);
  return res.json();
}

export async function getPrintfulProduct(productId: number) {
  const res = await fetch(`${getPrintfulApiBase()}/products/${productId}`, {
    headers: baseHeaders(),
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Printful product request failed (${res.status}).`);
  return res.json();
}

export async function getPrintfulVariant(variantId: number) {
  const res = await fetch(`${getPrintfulApiBase()}/products/variant/${variantId}`, {
    headers: baseHeaders(),
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Printful variant request failed (${res.status}).`);
  return res.json();
}

export async function getPrintfulStoreProducts() {
  const res = await fetch(`${getPrintfulApiBase()}/store/products`, {
    headers: await storeHeaders(),
    cache: "no-store"
  });
  if (!res.ok) throw new Error(`Printful store products request failed (${res.status}).`);
  return res.json();
}

export async function calculateShippingRates(recipient: unknown, items: PrintfulLineItem[]) {
  const res = await fetch(`${getPrintfulApiBase()}/shipping/rates`, {
    method: "POST",
    headers: await storeHeaders(),
    body: JSON.stringify({ recipient, items })
  });
  if (!res.ok) throw new Error(`Printful shipping request failed (${res.status}).`);
  return res.json();
}

export async function createPrintfulOrderFromSession(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.ApiList<Stripe.LineItem>
) {
  if (!getPrintfulToken()) return { skipped: true, reason: "PRINTFUL_API_TOKEN is not configured." };

  const recipient = buildRecipient(session);
  if (!recipient) return { skipped: true, reason: "Shipping recipient details were not available." };

  const items: PrintfulLineItem[] = [];
  for (const lineItem of lineItems.data) {
    const product = lineItem.price?.product;
    if (!product || typeof product === "string" || "deleted" in product) continue;
    const metadata = product.metadata ?? {};
    if (metadata.fulfillmentMode !== "printful") continue;

    const variantId = getPrintfulVariantId(metadata.productId, metadata.color, metadata.size);
    if (!variantId) continue;

    items.push({
      variant_id: variantId,
      quantity: lineItem.quantity ?? 1,
      retail_price: ((lineItem.amount_total ?? 0) / 100).toFixed(2),
      name: product.name
    });
  }

  if (!items.length) return { skipped: true, reason: "No Printful-eligible items were found in this order." };

  const response = await fetch(`${getPrintfulApiBase()}/orders?confirm=false`, {
    method: "POST",
    headers: await storeHeaders(),
    body: JSON.stringify({
      external_id: `stripe_${session.id}`,
      shipping: process.env.PRINTFUL_SHIPPING_SPEED || "STANDARD",
      recipient,
      items
    })
  });

  if (!response.ok) throw new Error(`Printful draft order failed (${response.status}).`);
  const payload = await response.json();
  return { skipped: false, draft: true, payload };
}

function getForgeVariantId(gender: string, sleeves: string) {
  if (gender === "women") return sleeves === "long" ? 9341 : 11211;
  return sleeves === "long" ? 6056 : 4012;
}

export async function createCustomForgeOrder(session: Stripe.Checkout.Session) {
  if (!getPrintfulToken()) return { skipped: true, reason: "PRINTFUL_API_TOKEN is not configured." };
  const recipient = buildRecipient(session);
  if (!recipient) return { skipped: true, reason: "Shipping recipient details were not available." };

  const meta = session.metadata || {};
  const imageUrl = meta.imageUrl;
  if (!imageUrl) return { skipped: true, reason: "No generated image URL found in session metadata." };

  const variantId = getForgeVariantId(meta.gender || "men", meta.sleeves || "short");
  const files: Array<{ type?: string; url: string }> = [];
  const printSides = meta.printSides || "front";
  if (printSides === "front" || printSides === "both") files.push({ type: "front", url: imageUrl });
  if (printSides === "back" || printSides === "both") files.push({ type: "back", url: imageUrl });

  const response = await fetch(`${getPrintfulApiBase()}/orders?confirm=false`, {
    method: "POST",
    headers: await storeHeaders(),
    body: JSON.stringify({
      external_id: `forge_${session.id}`,
      shipping: process.env.PRINTFUL_SHIPPING_SPEED || "STANDARD",
      recipient,
      items: [{ variant_id: variantId, quantity: 1, retail_price: "0.00", name: "Forge Custom Item", files }]
    })
  });

  if (!response.ok) throw new Error(`Printful Forge draft order failed (${response.status}).`);
  return { skipped: false, draft: true };
}

export async function getPrintfulTrackingForSession(sessionId: string) {
  if (!getPrintfulToken()) return { configured: false, shipped: false };

  const response = await fetch(`${getPrintfulApiBase()}/v2/orders/@stripe_${sessionId}/shipments`, {
    headers: await storeHeaders(),
    cache: "no-store"
  });
  if (response.status === 404) return { configured: true, shipped: false };
  if (!response.ok) throw new Error(`Printful tracking lookup failed (${response.status}).`);

  const payload = (await response.json()) as { data?: Array<Record<string, unknown>> };
  const shipments = payload.data ?? [];
  const latest = shipments.find((shipment) => shipment.tracking_number || shipment.tracking_url);
  if (!latest) return { configured: true, shipped: false };

  return {
    configured: true,
    shipped: true,
    trackingNumber: latest.tracking_number ?? null,
    trackingUrl: latest.tracking_url ?? null,
    status: latest.shipment_status ?? latest.status ?? null,
    shippedAt: latest.shipped_at ?? null
  };
}
