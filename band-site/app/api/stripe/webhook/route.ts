import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";
import { createPrintfulOrderFromSession } from "@/lib/printful";
import { updateLabelApplication } from "@/lib/label-storage";
import { processCommerceOrder, NotificationStatus } from "@/lib/commerce-order-processing";

async function sendAdminOrderNotification(session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>): Promise<NotificationStatus> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  
  if (adminEmail) {
    // We would prepare the payload here, but no real provider is connected yet.
    const customerEmail = session.customer_details?.email || "Unknown";
    const total = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00";
    console.log(`[Webhook] Prepared email payload for ${adminEmail}: Session ${session.id}, Customer ${customerEmail}, Total $${total}`);
  }

  console.warn(`[Webhook] ADMIN ORDER EMAIL NOT SENT — PROVIDER NOT CONFIGURED`);
  
  return "skipped_not_configured";
}

export async function POST(request: Request) {
  const stripe = getStripeServer();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not configured." },
      { status: 500 }
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing Stripe signature." }, { status: 400 });
  }

  const payload = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook signature." },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // LABEL APPLICATION
    if (session.metadata?.type === "label_application" && session.metadata.labelApplicationId) {
      await updateLabelApplication(session.metadata.labelApplicationId, {
        paymentStatus: "paid",
        status: "pending_review",
        stripeSessionId: session.id
      });
      return NextResponse.json({ received: true });
    }

    // COMMERCE
    if (session.metadata?.orderType === "kamdridi-commerce" || session.metadata?.campaignType) {
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        expand: ["data.price.product"]
      });

      try {
        await processCommerceOrder({
          session,
          lineItems,
          sendNotification: sendAdminOrderNotification,
          createPrintfulOrder: async (sess, items) => {
            await createPrintfulOrderFromSession(sess, { ...items, has_more: false, object: "list", url: "" });
          }
        });
      } catch (error) {
        return NextResponse.json(
          {
            error:
              error instanceof Error ? error.message : "Commerce processing failed."
          },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
