import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const sessionId = new URL(request.url).searchParams.get("session_id");
  if (!sessionId || !/^cs_(test_|live_)?[A-Za-z0-9]+$/.test(sessionId)) {
    return NextResponse.json({ error: "Invalid checkout session." }, { status: 400 });
  }

  const stripe = getStripeServer();
  if (!stripe) {
    return NextResponse.json({ error: "Secure checkout is not configured." }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const isCommerceOrder = session.metadata?.orderType === "kamdridi-commerce";
    const paid =
      isCommerceOrder &&
      session.status === "complete" &&
      (session.payment_status === "paid" || session.payment_status === "no_payment_required");

    return NextResponse.json(
      {
        paid,
        status: paid ? "confirmed" : "pending"
      },
      {
        status: paid ? 200 : 402,
        headers: { "Cache-Control": "no-store" }
      }
    );
  } catch (error) {
    console.error("[Checkout] Unable to verify Stripe Checkout session", error);
    return NextResponse.json(
      { error: "Unable to verify this payment." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
