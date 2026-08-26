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
    return NextResponse.json({ error: "Secure checkout is unavailable." }, { status: 503 });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const paid =
      session.metadata?.orderType === "kamdridi-direct-single" &&
      session.status === "complete" &&
      session.payment_status === "paid";

    return NextResponse.json(
      {
        paid,
        status: paid ? "confirmed" : "pending",
        amount: session.amount_total,
        currency: session.currency
      },
      {
        status: paid ? 200 : 402,
        headers: { "Cache-Control": "no-store" }
      }
    );
  } catch (error) {
    console.error("[OUR LOST DREAMS] Unable to verify checkout", error);
    return NextResponse.json(
      { error: "Unable to verify this payment." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  }
}
