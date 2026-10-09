import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { siteMeta } from "@/data/site";
import type { RawCheckoutItem } from "@/data/commerce-products";
import { buildUnifiedCheckoutPlan, getUnifiedCommerceProducts } from "@/lib/unified-commerce";

const PRINTIFY_VALIDATE_URL =
  "https://retoydsgsuvznlpsguts.supabase.co/functions/v1/commerce-printify-validate";

function sanitizeMetadataValue(value: string | undefined) {
  return (value || "").replace(/[|\r\n]/g, " ").slice(0, 120);
}

function checkoutImageUrl(siteUrl: string, value?: string) {
  if (!value) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${siteUrl}${value.startsWith("/") ? value : `/${value}`}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawItems = (body.items ?? []) as RawCheckoutItem[];

    if (!rawItems.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    const rawSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (productionHost ? `https://${productionHost}` : new URL(request.url).origin);
    const siteUrl = rawSiteUrl.trim().replace(/[\r\n]/g, "").replace(/\/$/, "");
    const requestedReturnPath = typeof body.returnPath === "string" ? body.returnPath : "/store";
    const returnPath = requestedReturnPath.startsWith("/") && !requestedReturnPath.startsWith("//") ? requestedReturnPath : "/store";
    const stripe = getStripeServer();

    let plan;
    try {
      const unifiedProducts = await getUnifiedCommerceProducts();
      plan = buildUnifiedCheckoutPlan(rawItems, unifiedProducts);
    } catch (err: any) {
      if (["UNKNOWN_PRODUCT", "EXCESSIVE_QUANTITY", "INVALID_QUANTITY", "INVALID_COLOR", "INVALID_SIZE", "INVALID_FORMAT", "MIXED_CURRENCY"].includes(err?.message)) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      console.error("[Checkout] Unified catalog unavailable; checkout blocked safely", err);
      return NextResponse.json(
        { error: "The live catalog is temporarily unavailable. Checkout has been paused to protect pricing and availability. Please try again shortly." },
        { status: 503 }
      );
    }

    if (!plan.resolvedItems || plan.resolvedItems.length === 0) {
      return NextResponse.json({ error: "No valid items found." }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json(
        { error: "Secure checkout is not configured yet. Please try again later." },
        { status: 503 }
      );
    }

    const printifyItems = plan.resolvedItems.filter(
      (item) => (item.product.fulfillmentMode as string) === "printify"
    );
    const containsPrintify = printifyItems.length > 0;
    const printifyQuantity = printifyItems.reduce(
      (sum, item) => sum + Number(item.quantity || 0),
      0
    );

    // Fail closed if a selected Printify size/color disappeared after the page loaded.
    if (containsPrintify) {
      try {
        const validateResponse = await fetch(PRINTIFY_VALIDATE_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Origin: "https://kamdridi.com"
          },
          cache: "no-store",
          body: JSON.stringify({
            items: printifyItems.map((item) => ({
              productId: item.product.id,
              color: item.color || null,
              size: item.size || null
            }))
          })
        });
        const validation = await validateResponse.json().catch(() => ({}));
        if (!validateResponse.ok || validation?.ok !== true) {
          const first = Array.isArray(validation?.unavailable) ? validation.unavailable[0] : null;
          console.warn("[Checkout] Printify live validation blocked checkout", validation);
          return NextResponse.json(
            {
              error: first?.reason === "supplier_mapping_not_ready"
                ? "This merchandise item is temporarily unavailable while its production mapping is refreshed."
                : "One of the selected merchandise variants is no longer available. Please choose another size or color and try again."
            },
            { status: 409 }
          );
        }
      } catch (err) {
        console.error("[Checkout] Printify live validation unavailable", err);
        return NextResponse.json(
          { error: "We could not verify live merchandise availability. Checkout has been paused to prevent an unfulfillable order. Please try again shortly." },
          { status: 503 }
        );
      }
    }

    const submitMessage = containsPrintify
      ? "Print-on-demand merchandise: your paid order is routed to production automatically. Tracking will follow when the supplier ships it."
      : plan.containsMadeToOrder
        ? "Made-to-order item(s): production begins after payment. Please allow several weeks for production and delivery."
        : plan.containsPreorder
          ? "This order includes pre-order items. Production and fulfillment details are shown on the corresponding product pages."
          : "Official KAMDRIDI order.";

    const itemMetadata = Object.fromEntries(
      plan.resolvedItems.slice(0, 20).map((item, index) => [
        `item_${index}`,
        [
          item.product.id,
          String(item.quantity),
          sanitizeMetadataValue(item.color),
          sanitizeMetadataValue(item.size),
          sanitizeMetadataValue(item.format)
        ].join("|").slice(0, 500)
      ])
    );

    // Conservative tracked-shipping amount for Printify merchandise.
    // Exact supplier shipping is resolved at fulfillment; this prevents under-collection while keeping checkout simple.
    const printifyShippingAmount = printifyQuantity > 0
      ? 1995 + Math.max(0, printifyQuantity - 1) * 995
      : 0;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/store/order?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${returnPath}?purchase=cancelled`,
      billing_address_collection: plan.requiresShipping ? "required" : "auto",
      shipping_address_collection: plan.requiresShipping ? {
        allowed_countries: ["US", "CA", "GB", "FR", "DE", "AU"]
      } : undefined,
      shipping_options: printifyQuantity > 0 && plan.orderCurrency === "CAD" ? [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: printifyShippingAmount, currency: "cad" },
            display_name: "Tracked print-on-demand shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 15 }
            }
          }
        }
      ] : undefined,
      phone_number_collection: {
        enabled: plan.requiresShipping
      },
      customer_creation: "always",
      allow_promotion_codes: false,
      custom_text: {
        submit: {
          message: submitMessage
        }
      },
      metadata: {
        artist: siteMeta.bandName,
        ...plan.metadata,
        ...itemMetadata,
        productIds: plan.resolvedItems.map(i => i.product.id).join(",").slice(0, 500),
        itemCount: String(plan.resolvedItems.length),
        returnPath,
        orderCurrency: plan.orderCurrency,
        orderTotalMinor: String(plan.checkoutTotal),
        printifyShippingMinor: String(printifyShippingAmount),
        ...(plan.orderCurrency === "CAD"
          ? { orderTotalCad: (plan.checkoutTotal / 100).toFixed(2) }
          : {})
      },
      line_items: plan.lineItems.map(item => ({
        quantity: item.quantity,
        price_data: {
          ...item.price_data,
          product_data: {
            ...item.price_data.product_data,
            images: item.price_data.product_data.images?.[0]
              ? [checkoutImageUrl(siteUrl, item.price_data.product_data.images[0])!]
              : undefined
          }
        }
      }))
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error("[Checkout] Unable to create Stripe Checkout session", error);
    return NextResponse.json(
      { error: "Unable to start secure checkout. Please try again." },
      { status: 500 }
    );
  }
}
