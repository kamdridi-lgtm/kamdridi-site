import { commerceProducts, buildCommerceCheckoutPlan } from "../data/commerce-products";
import { processCommerceOrder } from "../lib/commerce-order-processing";
import Stripe from "stripe";

async function runTests() {
  console.log("Starting Hardened Commerce Tests...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, msg: string) {
    if (condition) {
      console.log(`✅ PASS: ${msg}`);
      passed++;
    } else {
      console.log(`❌ FAIL: ${msg}`);
      failed++;
    }
  }

  // 1. Complete catalog, including the three Australia 2027 editions
  assert(commerceProducts.length === 34, `Il y a exactement 34 produits (${commerceProducts.length} trouvés)`);

  // 2. IDs uniques
  const ids = new Set(commerceProducts.map(p => p.id));
  assert(ids.size === commerceProducts.length, "Tous les IDs sont uniques");

  // 3. Slugs uniques
  const slugs = new Set(commerceProducts.map(p => p.slug));
  assert(slugs.size === commerceProducts.length, "Tous les slugs sont uniques");

  // 4. prix entiers en cents
  const nonIntegerPrices = commerceProducts.filter(p => p.priceCents % 1 !== 0);
  assert(nonIntegerPrices.length === 0, "Tous les prix sont des entiers en cents");

  const australiaProducts = commerceProducts.filter(p => p.projectSlug === "australia-17-for-ever");
  assert(
    australiaProducts.length === 3 &&
      australiaProducts.find(p => p.id === "17-for-ever-maxi-single")?.priceCents === 15900 &&
      australiaProducts.find(p => p.id === "17-for-ever-maxi-single")?.checkoutEnabled === true &&
      australiaProducts.find(p => p.id === "17-for-ever-maxi-single")?.saleMode === "preorder" &&
      australiaProducts.filter(p => p.id !== "17-for-ever-maxi-single").every(p => !p.checkoutEnabled && p.saleMode === "coming_soon"),
    "Le maxi single australien est en précommande à 159 $ CA; le CD et la cassette restent à annoncer"
  );

  // Tests via pure function
  try {
    const rawItems = [
      { id: "echoes-brasil-expanded-2026", quantity: 1, price: 1, name: "Fake Product", image: "/fake.jpg" }
    ] as any;
    const plan = buildCommerceCheckoutPlan(rawItems);
    
    // 5. faux prix ignoré et 6900 confirmé
    assert(plan.lineItems[0].price_data.unit_amount === 6900, "faux prix ignoré et 6900 confirmé");
    
    // 6. faux nom ignoré
    assert(plan.lineItems[0].price_data.product_data.name.includes("ECHOES UN LIVE IN BRASIL"), "faux nom ignoré");
  } catch (err: any) {
    console.log(`❌ FAIL: Testing fake price/name threw error: ${err.message}`);
    failed += 2;
  }

  // 7. UNKNOWN_PRODUCT
  try {
    buildCommerceCheckoutPlan([{ id: "non-existent-id", quantity: 1 }]);
    assert(false, "Rejet d'un produit inexistant (UNKNOWN_PRODUCT)");
  } catch (err: any) {
    assert(err.message === "UNKNOWN_PRODUCT", "UNKNOWN_PRODUCT");
  }

  // 8. INVALID_COLOR
  try {
    buildCommerceCheckoutPlan([{ id: "salieri-tee", quantity: 1, color: "Neon Pink" }]);
    assert(false, "INVALID_COLOR");
  } catch (err: any) {
    assert(err.message === "INVALID_COLOR", "INVALID_COLOR");
  }

  // 9. INVALID_SIZE
  try {
    buildCommerceCheckoutPlan([{ id: "salieri-tee", quantity: 1, color: "Black", size: "XXXS" }]);
    assert(false, "INVALID_SIZE");
  } catch (err: any) {
    assert(err.message === "INVALID_SIZE", "INVALID_SIZE");
  }

  // 10. INVALID_FORMAT
  try {
    const formatPlan = buildCommerceCheckoutPlan([{ id: "salieri-collector-bundle", quantity: 1, format: "Digital" }]);
    assert(formatPlan.resolvedItems[0].format === undefined && formatPlan.lineItems[0].price_data.product_data.metadata.format === "", "INVALID_FORMAT réel : format supprimé car non défini dans le produit");
  } catch (err: any) {
    assert(err.message === "INVALID_FORMAT", "INVALID_FORMAT handled (stripped or rejected)");
  }

  // 11. quantité excessive
  try {
    buildCommerceCheckoutPlan([{ id: "salieri-tee", quantity: 21, color: "Black", size: "M" }]);
    assert(false, "Rejet quantité excessive");
  } catch (err: any) {
    assert(err.message === "EXCESSIVE_QUANTITY", "quantité excessive");
  }

  // 12. commande numérique sans adresse
  const digiPlan = buildCommerceCheckoutPlan([{ id: "the-gilded-null-license", quantity: 1 }]);
  assert(digiPlan.requiresShipping === false && digiPlan.containsDigital === true, "commande numérique sans adresse");

  // 13. commande physique avec adresse
  const physPlan = buildCommerceCheckoutPlan([{ id: "salieri-tee", quantity: 1, color: "Black", size: "L" }]);
  assert(physPlan.requiresShipping === true && physPlan.containsPhysical === true, "commande physique avec adresse");

  // 14. panier mixte
  const mixPlan = buildCommerceCheckoutPlan([
    { id: "echoes-brasil-expanded-2026", quantity: 1 },
    { id: "salieri-tee", quantity: 1, color: "Black", size: "M" },
    { id: "kamdridi-gold-logo-tee", quantity: 2, size: "L" },
    { id: "the-gilded-null-license", quantity: 1 }
  ]);
  assert(mixPlan.requiresShipping === true && mixPlan.containsDigital === true, "panier mixte");

  // 15, 16, 17 - Mocking webhook behavior
  const mockSession = { id: "cs_test_123" } as Stripe.Checkout.Session;
  
  // TEST A — NOTIFICATION NON CONFIGURÉE
  const resA = await processCommerceOrder({
    session: mockSession,
    lineItems: { data: [{ price: { product: { metadata: { fulfillmentMode: "manual_physical" } } } }] } as any,
    sendNotification: async () => "skipped_not_configured",
    createPrintfulOrder: async () => {}
  });
  assert(resA.notificationStatus === "skipped_not_configured", "notification non configurée sans échec");

  // TEST B — ERREUR DE NOTIFICATION
  const resB = await processCommerceOrder({
    session: mockSession,
    lineItems: { data: [{ price: { product: { metadata: { fulfillmentMode: "manual_physical" } } } }] } as any,
    sendNotification: async () => { throw new Error("Mock Email Error"); },
    createPrintfulOrder: async () => {}
  });
  assert(resB.notificationStatus === "failed" && resB.printfulStatus === "not_required", "erreur simulée de notification sans HTTP 500");

  // TEST C — AUCUN PRODUIT PRINTFUL
  let printfulCallsC = 0;
  const resC = await processCommerceOrder({
    session: mockSession,
    lineItems: { data: [
      { price: { product: { metadata: { fulfillmentMode: "manual_preorder" } } } },
      { price: { product: { metadata: { fulfillmentMode: "digital_manual" } } } }
    ] } as any,
    sendNotification: async () => "sent",
    createPrintfulOrder: async () => { printfulCallsC++; }
  });
  assert(printfulCallsC === 0 && resC.printfulStatus === "not_required", "aucun appel Printful sans produit Printful");

  // TEST D — PRODUIT PRINTFUL SIMULÉ
  let printfulCallsD = 0;
  const resD = await processCommerceOrder({
    session: mockSession,
    lineItems: { data: [{ price: { product: { metadata: { fulfillmentMode: "printful" } } } }] } as any,
    sendNotification: async () => "sent",
    createPrintfulOrder: async (sess) => {
      assert(sess.id === "cs_test_123", "session.id transmis");
      printfulCallsD++; 
    }
  });
  assert(printfulCallsD === 1 && resD.printfulStatus === "created", "appel Printful avec produit Printful simulé");

  // TEST E — ERREUR PRINTFUL
  try {
    await processCommerceOrder({
      session: mockSession,
      lineItems: { data: [{ price: { product: { metadata: { fulfillmentMode: "printful" } } } }] } as any,
      sendNotification: async () => "sent",
      createPrintfulOrder: async () => { throw new Error("Printful 500"); }
    });
    assert(false, "Printful error should throw");
  } catch (err: any) {
    assert(err.message === "Printful 500", "erreur Printful lève exception pour HTTP 500 Stripe retry");
  }

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
