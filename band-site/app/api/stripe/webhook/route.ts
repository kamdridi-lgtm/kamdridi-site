import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";
import { createPrintfulOrderFromSession } from "@/lib/printful";
import { updateLabelApplication } from "@/lib/label-storage";

async function sendAdminOrderNotification(session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>) {
  // Try to use a configured email system, otherwise log
  // If no email configured, do not fail webhook.
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  if (!adminEmail) {
    console.warn("[Webhook] ADMIN_NOTIFICATION_EMAIL not set. Order recorded in Stripe but email omitted for session:", session.id);
    return;
  }
  
  // Implementation of email sending goes here (using Resend, SendGrid, etc if available in kamdridi-site)
  console.log(`[Webhook] Sending admin notification to ${adminEmail} for session ${session.id}...`);
}

async function processCommerceOrderFromSession(session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>) {
  // Classification
  const manualItems = lineItems.data.filter(item => {
    const fm = item.price?.product && (item.price.product as Stripe.Product).metadata?.fulfillmentMode;
    return fm === "manual_physical" || fm === "manual_preorder" || fm === "digital_manual" || fm === "game_access";
  });
  
  const printfulItems = lineItems.data.filter(item => {
    const fm = item.price?.product && (item.price.product as Stripe.Product).metadata?.fulfillmentMode;
    return fm === "printful";
  });

  // Non-blocking notification for manual orders
  if (manualItems.length > 0) {
    try {
      await sendAdminOrderNotification(session, lineItems);
    } catch (error) {
      console.error("[Webhook] Failed to send admin notification for session", session.id, error);
      // DO NOT throw error, Stripe is the official register.
    }
  }

  // Printful fulfillment for printful items
  if (printfulItems.length > 0) {
    // We only send the printful items to Printful
    try {
      await createPrintfulOrderFromSession(session, { data: printfulItems, has_more: false, object: "list", url: "" });
    } catch (error) {
      console.error("[Webhook] Failed Printful fulfillment for session", session.id, error);
      // Stripe will retry if we throw, but we should decide if we block webhook completion.
      // Usually, printful errors can be retried. Throwing here might retry the entire webhook.
      throw error; 
    }
  }
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
        await processCommerceOrderFromSession(session, lineItems);
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
