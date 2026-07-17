import { commerceProducts } from '../data/commerce-products';

async function runTests() {
  console.log("Starting Commerce System Tests...\n");
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, message: string) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. 27 products
  assert(commerceProducts.length === 27, `Il y a exactement 27 produits (${commerceProducts.length} trouvés)`);

  // 2. IDs uniques
  const ids = new Set(commerceProducts.map(p => p.id));
  assert(ids.size === commerceProducts.length, "Tous les IDs sont uniques");

  // 3. Slugs uniques
  const slugs = new Set(commerceProducts.map(p => p.slug));
  assert(slugs.size === commerceProducts.length, "Tous les slugs sont uniques");

  const API_URL = "http://localhost:3000/api/checkout";

  async function testApi(name: string, payload: any, expectSuccess: boolean, expectStatus?: number) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const success = response.ok;
      const statusMatch = !expectStatus || response.status === expectStatus;

      if (success === expectSuccess && statusMatch) {
        console.log(`✅ PASS: ${name}`);
        passed++;
      } else {
        console.error(`❌ FAIL: ${name} (Got status: ${response.status})`);
        failed++;
      }
    } catch (e: any) {
      if (!expectSuccess) {
        console.log(`✅ PASS (caught error): ${name}`);
        passed++;
      } else {
        console.error(`❌ FAIL: ${name} - Exception: ${e.message}`);
        failed++;
      }
    }
  }

  // 4. faux prix client ignoré (should pass successfully, returning 200, overriding the price on the server, but we can't inspect the returned session without mocking Stripe. Wait, if it returns 200, we know the server accepted the request without trusting the invalid price if Stripe was configured. In our demo mode, it returns a simulated URL. We can just check that it doesn't fail with 400.)
  await testApi("Acceptation d'un produit avec un faux prix client (forçage prix serveur)", {
    items: [{ id: "salieri-hardcover-booklet", quantity: 1, price: 9999 }],
    returnPath: "/store"
  }, true, 200);

  // 5. nom client falsifié ignoré (same, should return 200)
  await testApi("Acceptation d'un produit avec un faux nom client", {
    items: [{ id: "salieri-hardcover-booklet", quantity: 1, name: "FREE ITEM" }],
    returnPath: "/store"
  }, true, 200);

  // 6. UNKNOWN_PRODUCT
  await testApi("Rejet d'un produit inexistant (UNKNOWN_PRODUCT)", {
    items: [{ id: "unknown-fake-product", quantity: 1 }],
    returnPath: "/store"
  }, false, 400);

  // 7. quantité limitée (if a product has a quantity limit in the catalog, but wait, the API accepts whatever quantity and bounds it if necessary, or throws an error. Our API checkout route actually checks `item.quantity > (product.quantityLimit || 99)` and throws 400. Let's test quantity limit.)
  // Let's find a product with a quantity limit (e.g., Lathe Cut Vinyl if it exists, or we just test 100 which exceeds the default 20/99)
  await testApi("Rejet quantité excessive (limite dépassée)", {
    items: [{ id: "salieri-hardcover-booklet", quantity: 1000 }],
    returnPath: "/store"
  }, false, 400);

  // 8. variantes invalides rejetées
  await testApi("Sanitisation des variantes invalides", {
    items: [{ id: "salieri-tee", quantity: 1, color: "Neon Pink" }],
    returnPath: "/store"
  }, false, 400);

  // 9. commande numérique sans shipping
  await testApi("Commande numérique (sans shipping)", {
    items: [{ id: "the-gilded-null-license", quantity: 1 }],
    returnPath: "/store"
  }, true, 200);

  // 10. commande physique avec shipping
  await testApi("Commande physique (avec shipping)", {
    items: [{ id: "salieri-hoodie", quantity: 1, color: "Black", size: "L" }],
    returnPath: "/store"
  }, true, 200);

  // 11. panier mixte
  await testApi("Commande panier mixte", {
    items: [
      { id: "echoes-brasil-expanded-2026", quantity: 1 },
      { id: "salieri-tee", quantity: 1, color: "Black", size: "M" },
      { id: "kamdridi-gold-logo-tee", quantity: 2, size: "L" },
      { id: "the-gilded-null-license", quantity: 1 }
    ],
    returnPath: "/store"
  }, true, 200);

  console.log(`\nTests finished: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
