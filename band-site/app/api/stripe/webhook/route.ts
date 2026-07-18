import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";
import { createPrintfulOrderFromSession } from "@/lib/printful";
import { updateLabelApplication } from "@/lib/label-storage";

async function sendAdminOrderNotification(session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>) {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  
  if (!adminEmail) {
    console.warn(`[Webhook] WARNING: ADMIN_NOTIFICATION_EMAIL not set. Order ${session.id} recorded in Stripe but email notification omitted.`);
    return;
  }
  
  // Collect order variables for potential email API
  const customerEmail = session.customer_details?.email || "Unknown";
  const total = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00";
  const projects = session.metadata?.projects || "Unknown";
  const hasPreorder = session.metadata?.containsPreorder === "true";
  const isPhysical = session.metadata?.containsPhysical === "true";
  const dashboardLink = `https://dashboard.stripe.com/payments/${session.payment_intent || session.id}`;
  
  const sessionAny = session as any;
  const address = sessionAny.shipping_details?.address 
    ? `${sessionAny.shipping_details.address.line1}, ${sessionAny.shipping_details.address.city}, ${sessionAny.shipping_details.address.country}` 
    : (session.customer_details?.address ? `${session.customer_details.address.line1}, ${session.customer_details.address.city}, ${session.customer_details.address.country}` : "No address");
  
  const itemsList = lineItems.data.map(item => {
    const p = item.price?.product as Stripe.Product;
    return `${item.quantity}x ${p.name}`;
  }).join(", ");

  console.log(`[Webhook] Prepared email payload for ${adminEmail}: Session ${session.id}, Customer ${customerEmail}, Total $${total}`);
  console.log(`[Webhook] Products: ${itemsList}, Projects: ${projects}, Preorder: ${hasPreorder}, Physical: ${isPhysical}, Address: ${address}`);
  console.log(`[Webhook] Stripe Link: ${dashboardLink}`);
  // External email sending (e.g. Resend, Nodemailer) would execute here when configured.
}

async function processCommerceOrderFromSession(session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>) {
  // Classification
  const manualItems = lineItems.data.filter(item => {
    const fm = item.price?.product && (item.price.product as Stripe.Product).metadata?.fulfillmentMode;
    return fm === "manual_physical" || fm === "manual_preorder" || fm === "digital_manual" || fm === "game_access" || !fm;
  });
  
  const printfulItems = lineItems.data.filter(item => {
    const fm = item.price?.product && (item.price.product as Stripe.Product).metadata?.fulfillmentMode;
    return fm === "printful";
  });

  // Non-blocking notification for manual and digital orders
  if (manualItems.length > 0) {
    Promise.allSettled([sendAdminOrderNotification(session, lineItems)]).then(results => {
      if (results[0].status === 'rejected') {
        console.error(`[Webhook] Failed to send admin notification for session ${session.id}`, results[0].reason);
      }
    });
  }

  // Printful fulfillment for printful items
  if (printfulItems.length > 0) {
    try {
      // NOTE: Using session.id as external_id to prevent duplicate orders
      await createPrintfulOrderFromSession(session, { data: printfulItems, has_more: false, object: "list", url: "" });
    } catch (error) {
      console.error(`[Webhook] Failed Printful fulfillment for session ${session.id}`, error);
      // HTTP 500 is ONLY used here to allow Stripe to retry the Printful fulfillment
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
