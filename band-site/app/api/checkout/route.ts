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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = (body.items ?? []) as CheckoutItem[];

    if (!items.length) {
      return NextResponse.json({ error: "Your cart is empty." }, { status: 400 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const stripe = getStripeServer();

    if (!stripe) {
      return NextResponse.json({
        mode: "simulated",
        url: `${siteUrl}/store?purchase=success&session_id=simulated_session`
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/store?purchase=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/store?purchase=cancelled`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "FR", "DE", "AU"]
      },
      phone_number_collection: {
        enabled: true
      },
      allow_promotion_codes: true,
      metadata: {
        artist: siteMeta.bandName,
        campaign: siteMeta.albumName
      },
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
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

    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start checkout." },
      { status: 500 }
    );
  }
}
