import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { siteMeta } from "@/data/site";

type CheckoutItem = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  color?: string;
  size?: string;
  id: string;
  fulfillmentMode?: "printful" | "manual";
};


type CanonicalCheckoutProduct = {
  name: string;
  price: number;
  image?: string;
  fulfillmentMode?: "printful" | "manual";
};

const salieriCheckoutCatalog: Record<string, CanonicalCheckoutProduct> = {
  "salieri-digital-release": {
    name: "Digital Deluxe Release",
    price: 16,
    image: "/assets/images/salieris-hands/front-cover-approved.png"
  },
  "salieri-collector-cd": {
    name: "Collector CD",
    price: 49,
    image: "/assets/images/salieris-hands/jewelcase-mockup.png"
  },
  "salieri-vinyl-edition": {
    name: "Limited Vinyl Edition",
    price: 199,
    image: "/assets/images/salieris-hands/pack-back-front-spine.png"
  },
  "salieri-hardcover-booklet": {
    name: "Hardcover Booklet",
    price: 69,
    image: "/assets/images/salieris-hands/booklet-mockup.png"
  },
  "salieri-special-edition-box": {
    name: "Special Edition Box",
    price: 249,
    image: "/assets/images/salieris-hands/full-collector-pack.png"
  },
  "salieri-collector-coin": {
    name: "Collector Coin - Box Edition",
    price: 89,
    image: "/assets/images/salieris-hands/salieri-collector-coin-box.jpg"
  },
  "salieri-hoodie": {
    name: "Salieri Hoodie",
    price: 119,
    image: "/assets/images/salieris-hands/salieri-hoodie-mockup.jpg"
  },
  "salieri-tee": {
    name: "Salieri Tee",
    price: 59,
    image: "/assets/images/salieris-hands/salieri-tee-mockup.jpg"
  },
  "salieri-mug": {
    name: "Salieri Mug",
    price: 39,
    image: "/assets/images/salieris-hands/salieri-mug-mockup.jpg"
  },
  "salieri-poster": {
    name: "Salieri Poster",
    price: 49,
    image: "/assets/images/salieris-hands/salieri-poster-mockup.jpg"
  },
  "salieri-collector-bundle": {
    name: "Collector Bundle",
    price: 349,
    image: "/assets/images/salieris-hands/full-collector-pack.png"
  }
};

function resolveCheckoutItem(item: CheckoutItem): CheckoutItem {
  const canonical = salieriCheckoutCatalog[item.id];
  const quantity = Math.max(1, Math.min(10, Math.floor(Number(item.quantity) || 1)));

  if (!canonical) {
    return {
      ...item,
      quantity,
      price: Number(item.price) || 0
    };
  }

  return {
    ...item,
    quantity,
    name: canonical.name,
    price: canonical.price,
    image: canonical.image,
    fulfillmentMode: canonical.fulfillmentMode ?? "manual"
  };
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = (body.items ?? []) as CheckoutItem[];

    if (!items.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const siteUrl = rawSiteUrl.trim().replace(/\\r|\\n/g, "").replace(/\/$/, "");
    const requestedReturnPath = typeof body.returnPath === "string" ? body.returnPath : "/store";
    const returnPath = requestedReturnPath.startsWith("/") && !requestedReturnPath.startsWith("//") ? requestedReturnPath : "/store";
    const stripe = getStripeServer();
    const checkoutItems = items.map(resolveCheckoutItem);
    const checkoutTotal = checkoutItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const checkoutProductIds = checkoutItems.map((item) => item.id).join(",").slice(0, 500);

    if (!stripe) {
      return NextResponse.json({
        mode: "simulated",
        message: "Stripe is not configured. Redirecting to local demo checkout.",
        url: `${siteUrl}${returnPath}?purchase=demo&session_id=simulated_session`,
        items: checkoutItems.map((item) => ({ id: item.id, name: item.name, price: item.price, quantity: item.quantity })),
        total: checkoutTotal
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}${returnPath}?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}${returnPath}?purchase=cancelled`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "FR", "DE", "AU"]
      },
      phone_number_collection: {
        enabled: true
      },
      customer_creation: "always",
      allow_promotion_codes: true,
      custom_text: {
        submit: {
          message: "Salieri's Hands is a July 2026 collector campaign. Physical fulfillment begins after campaign inventory is confirmed."
        }
      },
      metadata: {
        artist: siteMeta.bandName,
        campaign: siteMeta.albumName,
        campaignPage: returnPath,
        campaignType: "salieri-collector-campaign",
        productIds: checkoutProductIds,
        orderTotalCad: checkoutTotal.toFixed(2)
      },
      line_items: checkoutItems.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "cad",
          unit_amount: Math.round(item.price * 100),
          product_data: {
            name: [item.name, item.color, item.size].filter(Boolean).join(" / "),
            images: item.image ? [`${siteUrl}${item.image}`] : undefined,
            metadata: {
              productId: item.id,
              color: item.color ?? "",
              size: item.size ?? "",
              fulfillmentMode: item.fulfillmentMode ?? "manual"
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
