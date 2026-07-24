import Stripe from "stripe";

import { getCommerceProductById } from "@/data/commerce-products";

export type NotificationStatus = "sent" | "skipped_not_configured" | "failed";
export type PrintfulStatus = "not_required" | "created" | "failed";

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
  sendNotification: (session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>) => Promise<NotificationStatus>;
  createPrintfulOrder: (session: Stripe.Checkout.Session, lineItems: Stripe.ApiList<Stripe.LineItem>) => Promise<void>;
}

async function dispatchMultiVendorOrder(session: Stripe.Checkout.Session, multiVendorItems: Stripe.LineItem[]) {
  // In production, this would make actual API calls to each vendor's system
  console.log(`[Webhook] Initiating Multi-Vendor Dispatch for Session: ${session.id}`);
  
  const vendorDispatches: Record<string, any[]> = {};
  
  for (const item of multiVendorItems) {
    const product = item.price?.product as Stripe.Product;
    // We assume the stripe product metadata contains our internal product ID.
    // Fallback to checking the name if metadata isn't strictly set during testing.
    const internalProductId = product.metadata?.kamdridiProductId || product.metadata?.id;
    let commerceProduct = null;
    
    if (internalProductId) {
      commerceProduct = getCommerceProductById(internalProductId);
    } else {
      // Fallback matching by name
      const { commerceProducts } = await import("@/data/commerce-products");
      commerceProduct = commerceProducts.find(p => p.name === product.name || p.name.includes(product.name));
    }

    if (commerceProduct && commerceProduct.productionComponents) {
      for (const component of commerceProduct.productionComponents) {
        if (!vendorDispatches[component.vendorId]) {
          vendorDispatches[component.vendorId] = [];
        }
        vendorDispatches[component.vendorId].push({
          orderQuantity: item.quantity,
          componentName: component.name,
          sku: component.sku,
          parentProduct: commerceProduct.name
        });
      }
    } else {
      console.warn(`[Webhook] Multi-vendor item ${product.name} had no production components mapped.`);
    }
  }

  const customerName = session.customer_details?.name || "Customer";
  const sessionAny = session as any;
  const address = sessionAny.shipping_details?.address 
    ? `${sessionAny.shipping_details.address.line1}, ${sessionAny.shipping_details.address.city}, ${sessionAny.shipping_details.address.country}` 
    : "No address provided";

  // Simulate dispatching emails/APIs to vendors
  for (const [vendorId, components] of Object.entries(vendorDispatches)) {
    console.log(`\n======================================================`);
    console.log(`[VENDOR DISPATCH] TO: ${vendorId}@kamdridi-partners.com`);
    console.log(`[VENDOR DISPATCH] SUBJECT: New Fulfillment Request - Order ${session.id}`);
    console.log(`[VENDOR DISPATCH] Ship To: ${customerName}, ${address}`);
    console.log(`[VENDOR DISPATCH] Items to fulfill:`);
    for (const comp of components) {
      console.log(`  - ${comp.orderQuantity}x ${comp.componentName} (SKU: ${comp.sku}) for ${comp.parentProduct}`);
    }
    console.log(`======================================================\n`);
    
    // NOTE: Here we would use resend or nodemailer to actually email the vendor.
  }
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
  
  // We still notify the admin for manual and multi-vendor items so they have an overview
  if (manualItems.length > 0 || multiVendorItems.length > 0) {
    try {
      notificationStatus = await sendNotification(session, {
        ...lineItems,
        data: [...manualItems, ...multiVendorItems]
      });
    } catch (error) {
      console.error(`[Webhook] Failed to send admin notification for session ${session.id}`, error);
      notificationStatus = "failed";
    }
  }

  // Handle automated Multi-Vendor routing
  if (multiVendorItems.length > 0) {
    try {
      await dispatchMultiVendorOrder(session, multiVendorItems);
    } catch (error) {
      console.error(`[Webhook] Failed Multi-Vendor dispatch for session ${session.id}`, error);
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
    multiVendorItemCount: multiVendorItems.length,
    notificationStatus,
    printfulStatus,
    sessionId: session.id
  };
}
