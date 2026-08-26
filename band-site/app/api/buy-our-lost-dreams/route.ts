import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";

export const runtime = "nodejs";

const PRICE_CENTS = 299;
const TRACK_TITLE = "OUR LOST DREAMS";
const ISRC = "QZZ7M2627617";

export async function POST(request: Request) {
  try {
    const stripe = getStripeServer();
    if (!stripe) {
      return NextResponse.json(
        { error: "Secure checkout is temporarily unavailable." },
        { status: 503 }
      );
    }

    const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
    const rawSiteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ||
      (productionHost ? `https://${productionHost}` : new URL(request.url).origin);
    const siteUrl = rawSiteUrl.trim().replace(/[\r\n]/g, "").replace(/\/$/, "");

    const commonMetadata = {
      orderType: "kamdridi-direct-single",
      artist: "KAM DRIDI",
      track_title: TRACK_TITLE,
      isrc: ISRC,
      product_type: "digital_music_sale",
      source_page: "/buy"
    };

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/buy/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/buy?cancelled=1`,
      billing_address_collection: "auto",
      customer_creation: "always",
      allow_promotion_codes: false,
      metadata: commonMetadata,
      payment_intent_data: {
        description: "KAM DRIDI — OUR LOST DREAMS digital single",
        metadata: commonMetadata
      },
      custom_text: {
        submit: {
          message:
            "Official KAM DRIDI digital music purchase. Keep your Stripe receipt; the digital copy is delivered using the email entered at checkout."
        }
      },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: PRICE_CENTS,
            product_data: {
              name: "OUR LOST DREAMS — Digital Download",
              description: "Official KAM DRIDI digital single",
              metadata: {
                artist: "KAM DRIDI",
                track_title: TRACK_TITLE,
                isrc: ISRC
              }
            }
          }
        }
      ]
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[OUR LOST DREAMS] Unable to create checkout session", error);
    return NextResponse.json(
      { error: "Unable to start secure checkout. Please try again." },
      { status: 500 }
    );
  }
}
