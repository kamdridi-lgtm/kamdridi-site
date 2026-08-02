import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripeServer } from "@/lib/stripe";
import { createPrintfulOrderFromSession } from "@/lib/printful";
import { updateLabelApplication } from "@/lib/label-storage";
import { processCommerceOrder, NotificationStatus } from "@/lib/commerce-order-processing";

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');

function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function sendAdminOrderNotification(session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>): Promise<NotificationStatus> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || 'contact@kamdridi.com';
  
  if (!process.env.RESEND_API_KEY) {
    console.warn(`[Webhook] ADMIN ORDER EMAIL NOT SENT — RESEND_API_KEY NOT CONFIGURED. Order ${session.id} recorded in Stripe but email notification omitted.`);
    return "skipped_not_configured";
  }
  
  // Collect order variables for email
  const customerEmail = session.customer_details?.email || "Unknown";
  const customerName = session.customer_details?.name || "Customer";
  const total = session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00";
  const paymentIntentId =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : session.payment_intent?.id;
  const dashboardMode = session.livemode ? "" : "/test";
  const dashboardLink = paymentIntentId
    ? `https://dashboard.stripe.com${dashboardMode}/payments/${encodeURIComponent(paymentIntentId)}`
    : `https://dashboard.stripe.com${dashboardMode}/checkout/sessions/${encodeURIComponent(session.id)}`;
  
  const sessionAny = session as any;
  const address = sessionAny.shipping_details?.address 
    ? `${sessionAny.shipping_details.address.line1}, ${sessionAny.shipping_details.address.city}, ${sessionAny.shipping_details.address.country}` 
    : (session.customer_details?.address ? `${session.customer_details.address.line1}, ${session.customer_details.address.city}, ${session.customer_details.address.country}` : "No address");
  
  let itemsHtml = "<ul>";
  lineItems.data.forEach(item => {
    const p = item.price?.product as Stripe.Product;
    itemsHtml += `<li>${escapeHtml(item.quantity)}x ${escapeHtml(p?.name || item.description || "Item")}</li>`;
  });
  itemsHtml += "</ul>";

  const emailHtml = `
    <h1>New Order Received - $${escapeHtml(total)}</h1>
    <p><strong>Customer:</strong> ${escapeHtml(customerName)} (${escapeHtml(customerEmail)})</p>
    <p><strong>Shipping Address:</strong> ${escapeHtml(address)}</p>
    <h2>Items:</h2>
    ${itemsHtml}
    <br/>
    <a href="${dashboardLink}" style="padding:10px 20px; background:#6366f1; color:white; text-decoration:none; border-radius:5px;">View in Stripe Dashboard</a>
  `;

  try {
    await resend.emails.send({
      from: 'Kamdridi Commerce <orders@kamdridi.com>',
      to: [adminEmail],
      subject: `🚨 New Order from ${customerName} - $${total}`,
      html: emailHtml
    });
    console.log(`[Webhook] Admin notification email sent successfully.`);
    return "sent";
  } catch (err) {
    console.error(`[Webhook] Failed to send admin email via Resend:`, err);
    return "failed";
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
    const eventSession = event.data.object as Stripe.Checkout.Session;
    const session = await stripe.checkout.sessions.retrieve(eventSession.id);

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
      if (session.metadata?.fulfillmentStatus === "processed") {
        return NextResponse.json({ received: true, duplicate: true });
      }

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
        await stripe.checkout.sessions.update(session.id, {
          metadata: {
            ...session.metadata,
            fulfillmentStatus: "processed",
            fulfillmentProcessedAt: new Date().toISOString()
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
    } else if (session.metadata?.orderType === "kamdridi-custom-merch") {
      // CUSTOM FORGE MERCH
      if (session.metadata?.fulfillmentStatus === "processed") {
        return NextResponse.json({ received: true, duplicate: true });
      }

      try {
        const { createCustomForgeOrder } = await import('@/lib/printful');
        await createCustomForgeOrder(session);
        
        // Also send admin notification
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
          expand: ["data.price.product"]
        });
        await sendAdminOrderNotification(session, lineItems);
        await stripe.checkout.sessions.update(session.id, {
          metadata: {
            ...session.metadata,
            fulfillmentStatus: "processed",
            fulfillmentProcessedAt: new Date().toISOString()
          }
        });

      } catch (error) {
        return NextResponse.json(
          {
            error:
              error instanceof Error ? error.message : "Custom Forge processing failed."
          },
          { status: 500 }
        );
      }
    }
  }

  return NextResponse.json({ received: true });
}
