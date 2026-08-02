import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { siteMeta } from "@/data/site";
import { buildCommerceCheckoutPlan, RawCheckoutItem } from "@/data/commerce-products";

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
      plan = buildCommerceCheckoutPlan(rawItems);
    } catch (err: any) {
      if (["UNKNOWN_PRODUCT", "EXCESSIVE_QUANTITY", "INVALID_QUANTITY", "INVALID_COLOR", "INVALID_SIZE", "INVALID_FORMAT"].includes(err.message)) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
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

    const submitMessage = plan.containsPreorder 
      ? "This order includes pre-order items. Production and fulfillment details are shown on the corresponding product pages."
      : "Official KAMDRIDI order.";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}${returnPath}?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${returnPath}?purchase=cancelled`,
      billing_address_collection: "required",
      shipping_address_collection: plan.requiresShipping ? {
        allowed_countries: ["US", "CA", "GB", "FR", "DE", "AU"]
      } : undefined,
      phone_number_collection: {
        enabled: plan.requiresShipping
      },
      customer_creation: "always",
      allow_promotion_codes: true,
      custom_text: {
        submit: {
          message: submitMessage
        }
      },
      metadata: {
        artist: siteMeta.bandName,
        ...plan.metadata,
        productIds: plan.resolvedItems.map(i => i.product.id).join(",").slice(0, 500),
        returnPath: returnPath,
        orderTotalCad: (plan.checkoutTotal / 100).toFixed(2)
      },
      line_items: plan.lineItems.map(item => ({
        quantity: item.quantity,
        price_data: {
          ...item.price_data,
          product_data: {
            ...item.price_data.product_data,
            images: item.price_data.product_data.images?.[0] ? [`${siteUrl}${item.price_data.product_data.images[0]}`] : undefined
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
