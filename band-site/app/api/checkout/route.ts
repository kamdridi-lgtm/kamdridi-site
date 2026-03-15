import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { siteMeta } from "@/data/site";

type CheckoutItem = {
  name: string;
  price: number;
  quantity: number;
  image?: string;
  size?: string;
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
        url: `${siteUrl}/store?checkout=success`
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/store?checkout=success`,
      cancel_url: `${siteUrl}/store?checkout=cancelled`,
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "GB", "FR", "DE"]
      },
      phone_number_collection: {
        enabled: true
      },
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
            name: item.size ? `${item.name} (${item.size})` : item.name,
            images: item.image ? [`${siteUrl}${item.image}`] : undefined,
            metadata: item.size ? { size: item.size } : undefined
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
