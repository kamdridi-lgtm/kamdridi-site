import type Stripe from "stripe";
import { printfulMappedProducts, storeProducts } from "@/data/store";

type PrintfulLineItem = {
  variant_id: number;
  quantity: number;
  retail_price: string;
  name: string;
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
  if (!product?.printfulEnvPrefix) {
    return null;
  }

  return `PRINTFUL_VARIANT_${product.printfulEnvPrefix}_${normalizeToken(color)}_${normalizeToken(size)}`;
}

function getPrintfulVariantId(productId: string, color?: string, size?: string) {
  const envKey = getVariantEnvKey(productId, color, size);
  if (!envKey) {
    return null;
  }

  const value = process.env[envKey];
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getPrintfulApiBase() {
  return process.env.PRINTFUL_API_BASE_URL || "https://api.printful.com";
}

function getPrintfulHeaders() {
  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.PRINTFUL_API_KEY}`,
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

  if (!address || !recipientName) {
    return null;
  }

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

export async function createPrintfulOrderFromSession(
  session: Stripe.Checkout.Session,
  lineItems: Stripe.ApiList<Stripe.LineItem>
) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
    return { skipped: true, reason: "PRINTFUL_API_KEY is not configured." };
  }

  const recipient = buildRecipient(session);
  if (!recipient) {
    return { skipped: true, reason: "Shipping recipient details were not available." };
  }

  const items: PrintfulLineItem[] = [];

  for (const lineItem of lineItems.data) {
    const product = lineItem.price?.product;
    if (!product || typeof product === "string" || "deleted" in product) {
      continue;
    }

    const metadata = product.metadata ?? {};
    if (metadata.fulfillmentMode !== "printful") {
      continue;
    }

    const productId = metadata.productId;
    const color = metadata.color;
    const size = metadata.size;
    const variantId = getPrintfulVariantId(productId, color, size);

    if (!variantId) {
      continue;
    }

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

  const response = await fetch(`${getPrintfulApiBase()}/orders`, {
    method: "POST",
    headers: getPrintfulHeaders(),
    body: JSON.stringify({
      external_id: `stripe_${session.id}`,
      shipping: process.env.PRINTFUL_SHIPPING_SPEED || "STANDARD",
      confirm: true,
      recipient,
      items
    })
  });

  if (!response.ok) {
    const payload = await response.text();
    throw new Error(`Printful order failed: ${payload}`);
  }

  return { skipped: false };
}

type PrintfulShipment = {
  tracking_number?: string | null;
  tracking_url?: string | null;
  status?: string | null;
  shipped_at?: string | null;
};

export async function getPrintfulTrackingForSession(sessionId: string) {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
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
    const payload = await response.text();
    throw new Error(`Printful tracking lookup failed: ${payload}`);
  }

  const payload = (await response.json()) as {
    data?: PrintfulShipment[];
  };
  const shipments = payload.data ?? [];
  const latest = shipments.find((shipment) => shipment.tracking_number || shipment.tracking_url);

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
