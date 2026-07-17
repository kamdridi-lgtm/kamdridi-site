import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { siteMeta } from "@/data/site";
import { resolveCommerceCheckoutItems, RawCheckoutItem } from "@/data/commerce-products";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rawItems = (body.items ?? []) as RawCheckoutItem[];

    if (!rawItems.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const siteUrl = rawSiteUrl.trim().replace(/\\r|\\n/g, "").replace(/\/$/, "");
    const requestedReturnPath = typeof body.returnPath === "string" ? body.returnPath : "/store";
    const returnPath = requestedReturnPath.startsWith("/") && !requestedReturnPath.startsWith("//") ? requestedReturnPath : "/store";
    const stripe = getStripeServer();

    // 1. RESOLVE AND VALIDATE (Throws Error if unknown or disabled product)
    let checkoutItems;
    try {
      checkoutItems = resolveCommerceCheckoutItems(rawItems);
    } catch (err: any) {
      if (["UNKNOWN_PRODUCT", "EXCESSIVE_QUANTITY", "INVALID_QUANTITY", "INVALID_VARIANT"].includes(err.message)) {
        return NextResponse.json({ error: err.message }, { status: 400 });
      }
      throw err;
    }

    if (!checkoutItems || checkoutItems.length === 0) {
      return NextResponse.json({ error: "No valid items found." }, { status: 400 });
    }

    const checkoutTotal = checkoutItems.reduce((total, item) => total + (item.product.priceCents * item.quantity), 0);
    const checkoutProductIds = checkoutItems.map((item) => item.product.id).join(",").slice(0, 500);
    const projects = Array.from(new Set(checkoutItems.map((item) => item.product.project))).join(",").slice(0, 500);

    const containsPreorder = checkoutItems.some(item => item.product.saleMode === "preorder");
    const containsDigital = checkoutItems.some(item => item.product.saleMode === "digital");
    const containsPhysical = checkoutItems.some(item => item.product.requiresShipping);

    if (!stripe) {
      return NextResponse.json({
        mode: "simulated",
        message: "Stripe is not configured. Redirecting to local demo checkout.",
        url: `${siteUrl}${returnPath}?purchase=demo&session_id=simulated_session`,
        items: checkoutItems.map((item) => ({ id: item.product.id, name: item.product.name, price: item.product.priceCents, quantity: item.quantity })),
        total: checkoutTotal
      });
    }

    const submitMessage = containsPreorder 
      ? "This order includes pre-order items. Production and fulfillment details are shown on the corresponding product pages."
      : "Official KAMDRIDI order.";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}${returnPath}?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${returnPath}?purchase=cancelled`,
      billing_address_collection: "required",
      shipping_address_collection: containsPhysical ? {
        allowed_countries: ["US", "CA", "GB", "FR", "DE", "AU"]
      } : undefined,
      phone_number_collection: {
        enabled: containsPhysical
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
        orderType: "kamdridi-commerce",
        productIds: checkoutProductIds,
        projects: projects,
        containsPreorder: containsPreorder ? "true" : "false",
        containsDigital: containsDigital ? "true" : "false",
        containsPhysical: containsPhysical ? "true" : "false",
        returnPath: returnPath,
        orderTotalCad: (checkoutTotal / 100).toFixed(2)
      },
      line_items: checkoutItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "cad",
          unit_amount: item.product.priceCents,
          product_data: {
            name: [item.product.name, item.color, item.size, item.format].filter(Boolean).join(" / "),
            images: item.product.images[0] ? [`${siteUrl}${item.product.images[0]}`] : undefined,
            metadata: {
              productId: item.product.id,
              color: item.color ?? "",
              size: item.size ?? "",
              format: item.format ?? "",
              fulfillmentMode: item.product.fulfillmentMode
            }
          }
        }
      }))
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start checkout." },
      { status: 500 }
    );
  }
}
