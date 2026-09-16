import type { CommerceProduct, RawCheckoutItem, ResolvedCheckoutItem } from "@/data/commerce-products";
import { getCommerceProductBySlug } from "@/data/commerce-products";

const CATALOG_URL = "https://retoydsgsuvznlps.supabase.co/functions/v1/commerce-catalog";

const DIRECT_EXCAVATION_SLUG = "echoes-unearthed-excavation-tee";
const DIRECT_WORDMARK_SLUG = "echoes-unearthed-wordmark-tee";

const EXCAVATION_TEE: CommerceProduct = {
  id: "echoes-unearthed-excavation-tee",
  slug: DIRECT_EXCAVATION_SLUG,
  name: "ECHOES UNEARTHED / EXCAVATION TEE",
  subtitle: "ECHOES UNEARTHED",
  project: "ECHOES UNEARTHED",
  projectSlug: "echoes-unearthed",
  category: "Apparel",
  description: "Official ECHOES UNEARTHED Excavation T-Shirt. Made to order with the excavation artwork and KAM DRIDI identity.",
  images: ["/store/merch/official-tee-picture.png"],
  priceCents: 5200,
  currency: "CAD",
  saleMode: "buy_now",
  visible: true,
  checkoutEnabled: true,
  fulfillmentMode: "printful",
  requiresShipping: true,
  productPath: `/store/${DIRECT_EXCAVATION_SLUG}`,
  releasePath: "/store",
  badge: "Echoes Capsule",
  fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
  colors: ["Black", "White"],
  sizes: ["S", "M", "L", "XL", "XXL"]
};

type RemoteProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  project: string;
  project_slug: string;
  category: string;
  description: string;
  images?: string[] | null;
  price_cents: number;
  currency: string;
  sale_mode: CommerceProduct["saleMode"];
  visible: boolean;
  checkout_enabled: boolean;
  fulfillment_mode: CommerceProduct["fulfillmentMode"];
  requires_shipping: boolean;
  quantity_limit?: number | null;
  product_path?: string | null;
  release_path?: string | null;
  badge?: string | null;
  fulfillment_note?: string | null;
  colors?: string[] | null;
  sizes?: string[] | null;
  formats?: string[] | null;
  production_components?: CommerceProduct["productionComponents"] | null;
};

function normalizeRemoteProduct(product: RemoteProduct): CommerceProduct | null {
  const currency = product.currency.toUpperCase();
  if (currency !== "CAD" && currency !== "JPY") return null;
  if (!product.visible) return null;
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle || "",
    project: product.project,
    projectSlug: product.project_slug,
    category: product.category,
    description: product.description,
    images: Array.isArray(product.images) ? product.images : [],
    priceCents: product.price_cents,
    currency: currency as CommerceProduct["currency"],
    saleMode: product.sale_mode,
    visible: true,
    checkoutEnabled: product.checkout_enabled,
    fulfillmentMode: product.fulfillment_mode,
    requiresShipping: product.requires_shipping,
    quantityLimit: product.quantity_limit ?? undefined,
    productPath: product.product_path || `/store#${product.id}`,
    releasePath: product.release_path || "/store",
    badge: product.badge || undefined,
    fulfillmentNote: product.fulfillment_note || undefined,
    colors: product.colors || undefined,
    sizes: product.sizes || undefined,
    formats: product.formats || undefined,
    productionComponents: product.production_components || undefined
  };
}

export async function getUnifiedCommerceProducts(): Promise<CommerceProduct[]> {
  const localDirectProducts = [
    EXCAVATION_TEE,
    getCommerceProductBySlug(DIRECT_WORDMARK_SLUG)
  ].filter((product): product is CommerceProduct => Boolean(product));

  try {
    const response = await fetch(CATALOG_URL, {
      cache: "no-store",
      headers: { accept: "application/json" }
    });
    if (!response.ok) throw new Error("UNIFIED_CATALOG_UNAVAILABLE");
    const payload = await response.json();
    if (!Array.isArray(payload?.products)) throw new Error("UNIFIED_CATALOG_INVALID");

    const products = (payload.products as RemoteProduct[])
      .map(normalizeRemoteProduct)
      .filter((product): product is CommerceProduct => Boolean(product));

    for (const localProduct of localDirectProducts) {
      if (!products.some((product) => product.slug === localProduct.slug)) {
        products.push(localProduct);
      }
    }

    return products;
  } catch (error) {
    if (localDirectProducts.length > 0) return localDirectProducts;
    throw error;
  }
}

function resolveVariant(value: string | undefined, allowed: readonly string[] | undefined, errorCode: string) {
  if (!allowed || allowed.length === 0) return undefined;
  if (value && !allowed.includes(value)) throw new Error(errorCode);
  return value || allowed[0];
}

export function buildUnifiedCheckoutPlan(rawItems: RawCheckoutItem[], products: CommerceProduct[]) {
  const productMap = new Map(products.map((product) => [product.id, product]));
  const resolvedItems: ResolvedCheckoutItem[] = [];

  for (const item of rawItems) {
    const product = productMap.get(item.id);
    if (!product || !product.visible || !product.checkoutEnabled || product.saleMode === "sold_out" || product.saleMode === "coming_soon") {
      throw new Error("UNKNOWN_PRODUCT");
    }

    const color = resolveVariant(item.color, product.colors, "INVALID_COLOR");
    const size = resolveVariant(item.size, product.sizes, "INVALID_SIZE");
    const format = resolveVariant(item.format, product.formats, "INVALID_FORMAT");
    const quantity = Math.floor(Number(item.quantity) || 1);
    if (quantity < 1) throw new Error("INVALID_QUANTITY");
    if (quantity > (product.quantityLimit || 20)) throw new Error("EXCESSIVE_QUANTITY");

    resolvedItems.push({ product, quantity, color, size, format });
  }

  let requiresShipping = false;
  let containsPhysical = false;
  let containsDigital = false;
  let containsPreorder = false;
  let containsMadeToOrder = false;
  let checkoutTotal = 0;
  const projects = new Set<string>();
  const currencies = new Set<CommerceProduct["currency"]>();

  const lineItems = resolvedItems.map((item) => {
    const { product } = item;
    requiresShipping ||= product.requiresShipping;
    if (product.saleMode === "digital") containsDigital = true;
    else containsPhysical = true;
    if (product.saleMode === "preorder") containsPreorder = true;
    if ((product.fulfillmentMode as string) === "made_to_order") containsMadeToOrder = true;
    projects.add(product.project);
    currencies.add(product.currency);
    checkoutTotal += product.priceCents * item.quantity;

    const attributes = [item.color, item.size, item.format].filter(Boolean);
    let name = product.name;
    if (product.subtitle) name += ` - ${product.subtitle}`;
    if (attributes.length) name += ` (${attributes.join(", ")})`;

    return {
      price_data: {
        currency: product.currency.toLowerCase(),
        product_data: {
          name,
          description: product.description?.slice(0, 500) || undefined,
          images: product.images?.[0] ? [product.images[0]] : undefined,
          metadata: {
            productId: product.id,
            fulfillmentMode: product.fulfillmentMode,
            requiresShipping: product.requiresShipping ? "true" : "false",
            color: item.color || "",
            size: item.size || "",
            format: item.format || ""
          }
        },
        unit_amount: product.priceCents
      },
      quantity: item.quantity
    };
  });

  if (currencies.size > 1) throw new Error("MIXED_CURRENCY");
  const orderCurrency = Array.from(currencies)[0] || "CAD";

  return {
    resolvedItems,
    lineItems,
    checkoutTotal,
    orderCurrency,
    requiresShipping,
    containsPhysical,
    containsDigital,
    containsPreorder,
    containsMadeToOrder,
    projects: Array.from(projects),
    metadata: {
      orderType: "kamdridi-commerce",
      projects: Array.from(projects).join(","),
      containsPhysical: containsPhysical ? "true" : "false",
      containsPreorder: containsPreorder ? "true" : "false",
      containsMadeToOrder: containsMadeToOrder ? "true" : "false",
      containsDigital: containsDigital ? "true" : "false",
      orderCurrency,
      catalogSource: "supabase-unified-v1"
    }
  };
}
