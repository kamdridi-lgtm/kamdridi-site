import { fulfillmentProfiles } from "../data/fulfillment-products";
import { commerceProducts } from "../data/commerce-products";
import { validateFulfillmentReadiness, getFulfillmentProfile } from "../lib/fulfillment-resolver";
import { assertFulfillmentReady } from "../lib/fulfillment/fulfillment-policy";
import { KunakiAdapter } from "../lib/fulfillment/kunaki-adapter";
import { LuluAdapter } from "../lib/fulfillment/lulu-adapter";
import { DiggersAdapter } from "../lib/fulfillment/diggers-adapter";

async function runFulfillmentTests() {
  console.log("Starting Fulfillment Foundation Tests...\n");
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

  // 1. 27 profils présents
  assert(fulfillmentProfiles.length === 27, `27 profils présents (${fulfillmentProfiles.length} trouvés)`);

  // 2. 27 IDs canoniques reconnus
  const allCanonicalIdsMatch = fulfillmentProfiles.every(p => commerceProducts.some(cp => cp.id === p.productId));
  assert(allCanonicalIdsMatch, "Tous les profils pointent vers des IDs canoniques existants");

  // 3. Aucun providerProductId inventé
  const noFakeProviderIds = fulfillmentProfiles.every(p => p.providerProductId === null);
  assert(noFakeProviderIds, "Aucun providerProductId inventé (tous null)");

  // 4. Aucun automaticSubmission true
  const noAuto = fulfillmentProfiles.every(p => p.automaticSubmission === false);
  assert(noAuto, "Aucun automaticSubmission true");

  // 5 & 6. Aucun produit physique ready et au moins un blocker
  const physicalProfiles = fulfillmentProfiles.filter(p => p.provider !== "digital_internal");
  const allPhysicalNotReady = physicalProfiles.every(p => {
    const res = validateFulfillmentReadiness(p.productId);
    return !res.ready && res.blockers.length > 0;
  });
  assert(allPhysicalNotReady, "Aucun produit physique n'est ready, tous ont des blockers");

  // 7. Salieri Collector CD pointe vers Kunaki
  assert(getFulfillmentProfile("salieri-collector-cd")?.provider === "kunaki", "Salieri Collector CD pointe vers Kunaki");

  // 8. Livrets pointent vers Lulu
  assert(getFulfillmentProfile("echoes-brasil-livreto-2026")?.provider === "lulu", "echoes-brasil-livreto-2026 pointe vers Lulu");
  assert(getFulfillmentProfile("salieri-hardcover-booklet")?.provider === "lulu", "salieri-hardcover-booklet pointe vers Lulu");

  // 9. Vinyles pointent vers Diggers Factory
  assert(getFulfillmentProfile("salieri-vinyl-edition")?.provider === "diggers_factory", "salieri-vinyl-edition pointe vers Diggers Factory");

  // Echoes Deluxe possède deux composantes
  const echoesDeluxe = getFulfillmentProfile("echoes-brasil-deluxe-2026");
  assert(echoesDeluxe?.components?.length === 2, "ECHOES Deluxe possède deux composantes");
  
  if (echoesDeluxe && echoesDeluxe.components) {
    const vinylComp = echoesDeluxe.components.find(c => c.componentId === "vinyl");
    const boxComp = echoesDeluxe.components.find(c => c.componentId === "box-and-inserts");
    
    assert(vinylComp?.provider === "diggers_factory", "la composante vinyl pointe vers diggers_factory");
    assert(boxComp?.provider === "manual_supplier", "la composante box-and-inserts pointe vers manual_supplier");
    
    assert(vinylComp?.automaticSubmission === false && boxComp?.automaticSubmission === false, "toutes les composantes ont automaticSubmission false");
  }

  // Salieri Collector CD reste non automatique et sans providerProductId
  const salieriCd = getFulfillmentProfile("salieri-collector-cd");
  assert(salieriCd?.automaticSubmission === false, "Salieri Collector CD reste non automatique");
  assert(salieriCd?.providerProductId === null, "Salieri Collector CD reste sans providerProductId");
  assert(salieriCd?.prototypeStatus === "not_ordered", "prototypeStatus reste not_ordered");
  
  // 10. Vêtements vers Printful
  assert(getFulfillmentProfile("salieri-hoodie")?.provider === "printful", "salieri-hoodie pointe vers Printful");
  assert(getFulfillmentProfile("kamdridi-gold-logo-tee")?.provider === "printful", "kamdridi-gold-logo-tee pointe vers Printful");

  // 11. Produits numériques pointent vers digital_internal
  const digitalReady = getFulfillmentProfile("salieri-digital-release")?.provider === "digital_internal";
  assert(digitalReady, "Les produits numériques pointent vers digital_internal");

  // 12. Produit inconnu retourne UNKNOWN_PRODUCT
  const resUnknown = validateFulfillmentReadiness("fake-product");
  assert(!resUnknown.ready && resUnknown.blockers.includes("UNKNOWN_PRODUCT"), "Un produit inconnu retourne UNKNOWN_PRODUCT");

  // 13. assertFulfillmentReady (policy) throw FULFILLMENT_NOT_READY
  try {
    assertFulfillmentReady("salieri-hoodie");
    assert(false, "assertFulfillmentReady devrait throw");
  } catch (e: any) {
    assert(e.message.includes("FULFILLMENT_NOT_READY"), "assertFulfillmentReady retourne FULFILLMENT_NOT_READY pour un produit non prêt");
  }

  // 14. Adaptateurs désactivés retournent NOT_CONFIGURED
  assert(KunakiAdapter.validateConfiguration() === "NOT_CONFIGURED", "KunakiAdapter retourne NOT_CONFIGURED");
  assert(LuluAdapter.validateConfiguration() === "NOT_CONFIGURED", "LuluAdapter retourne NOT_CONFIGURED");
  assert(DiggersAdapter.validateConfiguration() === "NOT_CONFIGURED", "DiggersAdapter retourne NOT_CONFIGURED");

  // 15 & 16. Aucun appel réseau
  let networkCallCount = 0;
  let supplierSubmissionCount = 0;
  const originalFetch = global.fetch;
  global.fetch = async (...args) => {
    networkCallCount++;
    throw new Error("Network call prevented in test");
  };

  try {
    await KunakiAdapter.createDraftOrder("test", {}).catch(() => {});
    await LuluAdapter.submitOrder("test", {}).catch(() => {});
    await DiggersAdapter.estimateOrder("test", {}).catch(() => {});
  } finally {
    global.fetch = originalFetch;
  }

  assert(networkCallCount === 0, "Aucun appel réseau");
  assert(supplierSubmissionCount === 0, "Aucun fournisseur contacté");

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runFulfillmentTests();
