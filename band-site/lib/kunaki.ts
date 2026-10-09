import "server-only";

export type KunakiShippingOption = {
  description: string;
  deliveryTime: string | null;
  priceUsd: number | null;
};

export type KunakiOrderItem = {
  productId: string;
  quantity: number;
};

export type KunakiAddress = {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  stateProvince?: string;
  postalCode: string;
  country: string;
};

const KUNAKI_ENDPOINT = "https://kunaki.com/HTTPService.ASP";

function credentials() {
  const userId = process.env.KUNAKI_USER_ID?.trim();
  const password = process.env.KUNAKI_PASSWORD?.trim();
  if (!userId || !password) {
    throw new Error("Kunaki credentials are not configured.");
  }
  return { userId, password };
}

function cleanProductId(value: string) {
  const id = value.trim();
  if (!/^[A-Za-z0-9]{6,20}$/.test(id)) {
    throw new Error("Invalid Kunaki product id.");
  }
  return id;
}

function cleanQuantity(value: number) {
  if (!Number.isInteger(value) || value < 1 || value > 20) {
    throw new Error("Kunaki quantity must be an integer between 1 and 20.");
  }
  return value;
}

function xmlValues(xml: string, tag: string) {
  const escaped = tag.replace(/[.*+?^$()|[\]\\{}]/g, "\\$&");
  const re = new RegExp("<\\s*" + escaped + "\\s*>([\\s\\S]*?)<\\s*\\/\\s*" + escaped + "\\s*>", "gi");
  return Array.from(xml.matchAll(re), (match) =>
    String(match[1] || "")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .trim()
  );
}

function firstXmlValue(xml: string, tag: string) {
  return xmlValues(xml, tag)[0] || null;
}

async function requestKunaki(params: URLSearchParams) {
  const url = KUNAKI_ENDPOINT + "?" + params.toString();
  const response = await fetch(url, {
    method: "GET",
    cache: "no-store",
    headers: { Accept: "application/xml,text/xml,text/plain,*/*" }
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error("Kunaki HTTP error " + response.status);
  }

  const errorCode = firstXmlValue(body, "ErrorCode");
  const errorText = firstXmlValue(body, "ErrorText");
  if (errorCode && errorCode !== "0") {
    throw new Error("Kunaki error " + errorCode + ": " + (errorText || "unknown error"));
  }

  return body;
}

function appendProducts(params: URLSearchParams, items: KunakiOrderItem[]) {
  if (!items.length) throw new Error("At least one Kunaki product is required.");
  for (const item of items) {
    params.append("ProductId", cleanProductId(item.productId));
    params.append("Quantity", String(cleanQuantity(item.quantity)));
  }
}

export async function getKunakiShippingOptions(args: {
  address: Pick<KunakiAddress, "country" | "stateProvince" | "postalCode">;
  items: KunakiOrderItem[];
}) {
  const params = new URLSearchParams({
    RequestType: "ShippingOptions",
    ResponseType: "xml",
    Country: args.address.country,
    State_Province: args.address.stateProvince || "",
    PostalCode: args.address.postalCode
  });
  appendProducts(params, args.items);

  const xml = await requestKunaki(params);
  const descriptions = xmlValues(xml, "Description");
  const deliveryTimes = xmlValues(xml, "DeliveryTime");
  const prices = xmlValues(xml, "Price");

  return descriptions.map<KunakiShippingOption>((description, index) => {
    const rawPrice = prices[index];
    const parsedPrice = rawPrice === undefined ? null : Number(rawPrice);
    return {
      description,
      deliveryTime: deliveryTimes[index] || null,
      priceUsd: parsedPrice !== null && Number.isFinite(parsedPrice) ? parsedPrice : null
    };
  });
}

export async function createKunakiOrder(args: {
  address: KunakiAddress;
  items: KunakiOrderItem[];
  shippingDescription: string;
  mode?: "Test" | "Live";
}) {
  const { userId, password } = credentials();
  const mode = args.mode || "Test";

  if (mode === "Live" && process.env.KUNAKI_LIVE_ORDER_ENABLED !== "true") {
    throw new Error("Live Kunaki order submission is disabled.");
  }

  const params = new URLSearchParams({
    RequestType: "Order",
    ResponseType: "xml",
    UserId: userId,
    Password: password,
    Mode: mode,
    Name: args.address.name,
    Company: args.address.company || "",
    Address1: args.address.address1,
    Address2: args.address.address2 || "",
    City: args.address.city,
    State_Province: args.address.stateProvince || "",
    PostalCode: args.address.postalCode,
    Country: args.address.country,
    ShippingDescription: args.shippingDescription
  });
  appendProducts(params, args.items);

  const xml = await requestKunaki(params);
  const orderId = firstXmlValue(xml, "OrderId");
  if (!orderId) throw new Error("Kunaki returned no order id.");
  return { orderId, mode };
}

export async function getKunakiOrderStatus(orderId: string) {
  const { userId, password } = credentials();
  const id = orderId.trim();
  if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error("Invalid Kunaki order id.");

  const params = new URLSearchParams({
    RequestType: "OrderStatus",
    ResponseType: "xml",
    UserId: userId,
    Password: password,
    OrderId: id
  });

  const xml = await requestKunaki(params);
  return {
    orderId: firstXmlValue(xml, "OrderId") || id,
    status: firstXmlValue(xml, "OrderStatus"),
    trackingType: firstXmlValue(xml, "TrackingType"),
    trackingId: firstXmlValue(xml, "TrackingId")
  };
}

export function getKunakiIntegrationStatus() {
  return {
    credentialsConfigured: Boolean(process.env.KUNAKI_USER_ID && process.env.KUNAKI_PASSWORD),
    liveOrderSubmissionEnabled: process.env.KUNAKI_LIVE_ORDER_ENABLED === "true",
    endpoint: KUNAKI_ENDPOINT
  };
}
