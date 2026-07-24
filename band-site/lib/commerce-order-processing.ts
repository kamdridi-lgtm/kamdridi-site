import Stripe from "stripe";

export type NotificationStatus = "sent" | "skipped_not_configured" | "failed";
export type PrintfulStatus = "not_required" | "created" | "failed";

export interface CommerceOrderProcessingResult {
  manualItemCount: number;
  printfulItemCount: number;
  notificationStatus: NotificationStatus;
  printfulStatus: PrintfulStatus;
  sessionId: string;
}

export interface CommerceOrderDependencies {
  session: Stripe.Checkout.Session;
  lineItems: Stripe.ApiList<Stripe.LineItem>;
  sendNotification: (session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>) => Promise<NotificationStatus>;
  createPrintfulOrder: (session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>) => Promise<void>;
}

export async function processCommerceOrder({
  session,
  lineItems,
  sendNotification,
  createPrintfulOrder
}: CommerceOrderDependencies): Promise<CommerceOrderProcessingResult> {
  const manualItems = lineItems.data.filter(item => {
    const fm = item.price?.product && (item.price.product as Stripe.Product).metadata?.fulfillmentMode;
    return fm === "manual_physical" || fm === "manual_preorder" || fm === "digital_manual" || fm === "game_access" || !fm;
  });
  
  const printfulItems = lineItems.data.filter(item => {
    const fm = item.price?.product && (item.price.product as Stripe.Product).metadata?.fulfillmentMode;
    return fm === "printful";
  });

  const multiVendorItems = lineItems.data.filter(item => {
    const fm = item.price?.product && (item.price.product as Stripe.Product).metadata?.fulfillmentMode;
    return fm === "multi_vendor";
  });

  let notificationStatus: NotificationStatus = "skipped_not_configured";
  if (manualItems.length > 0 || multiVendorItems.length > 0) {
    try {
      // For now, we route multi_vendor to manual notification.
      // In production, multiVendorItems would be parsed and sent to respective third-party APIs.
      notificationStatus = await sendNotification(session, {
        ...lineItems,
        data: [...manualItems, ...multiVendorItems]
      });
    } catch (error) {
      console.error(`[Webhook] Failed to send admin notification for session ${session.id}`, error);
      notificationStatus = "failed";
    }
  }

  let printfulStatus: PrintfulStatus = "not_required";
  if (printfulItems.length > 0) {
    try {
      await createPrintfulOrder(session, {
        ...lineItems,
        data: printfulItems
      });
      printfulStatus = "created";
    } catch (error) {
      console.error(`[Webhook] Failed Printful fulfillment for session ${session.id}`, error);
      printfulStatus = "failed";
      throw error; 
    }
  }

  return {
    manualItemCount: manualItems.length,
    printfulItemCount: printfulItems.length,
    notificationStatus,
    printfulStatus,
    sessionId: session.id
  };
}
