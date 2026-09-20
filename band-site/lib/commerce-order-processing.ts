import Stripe from "stripe";

export type NotificationStatus = "sent" | "skipped_not_configured" | "failed";
export type PrintfulStatus = "not_required" | "created" | "failed";
export type CommerceFulfillmentStatus = "processed" | "manual_action_required";

type PrintfulCreationResult =
  | void
  | {
      skipped: boolean;
      reason?: string;
    };

export interface CommerceOrderProcessingResult {
  manualItemCount: number;
  printfulItemCount: number;
  multiVendorItemCount: number;
  notificationStatus: NotificationStatus;
  printfulStatus: PrintfulStatus;
  sessionId: string;
}

export interface CommerceOrderDependencies {
  session: Stripe.Checkout.Session;
  lineItems: Stripe.ApiList<Stripe.LineItem>;
  sendNotification: (
    session: Stripe.Checkout.Session,
    lineItems: Stripe.ApiList<Stripe.LineItem>
  ) => Promise<NotificationStatus>;
  createPrintfulOrder: (
    session: Stripe.Checkout.Session,
    lineItems: Stripe.ApiList<Stripe.LineItem>
  ) => Promise<PrintfulCreationResult>;
}

export function deriveCommerceFulfillmentStatus(
  result: CommerceOrderProcessingResult
): CommerceFulfillmentStatus {
  if (result.manualItemCount > 0 || result.multiVendorItemCount > 0) {
    return "manual_action_required";
  }

  return "processed";
}

export async function processCommerceOrder({
  session,
  lineItems,
  sendNotification,
  createPrintfulOrder
}: CommerceOrderDependencies): Promise<CommerceOrderProcessingResult> {
  const manualItems = lineItems.data.filter((item) => {
    const fulfillmentMode =
      item.price?.product &&
      typeof item.price.product !== "string" &&
      !("deleted" in item.price.product)
        ? item.price.product.metadata?.fulfillmentMode
        : undefined;

    return (
      fulfillmentMode === "manual_physical" ||
      fulfillmentMode === "manual_preorder" ||
      fulfillmentMode === "digital_manual" ||
      fulfillmentMode === "game_access" ||
      !fulfillmentMode
    );
  });

  const printfulItems = lineItems.data.filter((item) => {
    const fulfillmentMode =
      item.price?.product &&
      typeof item.price.product !== "string" &&
      !("deleted" in item.price.product)
        ? item.price.product.metadata?.fulfillmentMode
        : undefined;
    return fulfillmentMode === "printful";
  });

  const multiVendorItems = lineItems.data.filter((item) => {
    const fulfillmentMode =
      item.price?.product &&
      typeof item.price.product !== "string" &&
      !("deleted" in item.price.product)
        ? item.price.product.metadata?.fulfillmentMode
        : undefined;
    return fulfillmentMode === "multi_vendor";
  });

  let notificationStatus: NotificationStatus = "skipped_not_configured";

  // Manual and multi-vendor orders are deliberately treated as operator work.
  // The admin notification is the handoff into that workflow; we do not pretend
  // that generated vendor email aliases are a real supplier integration.
  if (manualItems.length > 0 || multiVendorItems.length > 0) {
    try {
      notificationStatus = await sendNotification(session, {
        ...lineItems,
        data: [...manualItems, ...multiVendorItems]
      });
    } catch (error) {
      console.error(
        `[Webhook] Failed to send admin notification for session ${session.id}`,
        error
      );
      notificationStatus = "failed";
    }
  }

  if (multiVendorItems.length > 0) {
    console.warn(
      `[Webhook] Session ${session.id} contains ${multiVendorItems.length} multi-vendor item(s) and requires manual vendor dispatch.`
    );
  }

  let printfulStatus: PrintfulStatus = "not_required";
  if (printfulItems.length > 0) {
    try {
      const printfulResult = await createPrintfulOrder(session, {
        ...lineItems,
        data: printfulItems
      });

      if (printfulResult?.skipped) {
        throw new Error(
          `Printful fulfillment skipped: ${printfulResult.reason || "no order was created"}`
        );
      }

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
    multiVendorItemCount: multiVendorItems.length,
    notificationStatus,
    printfulStatus,
    sessionId: session.id
  };
}
