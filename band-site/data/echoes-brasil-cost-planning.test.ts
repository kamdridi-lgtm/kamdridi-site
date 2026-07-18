import {
  EchoesCostPlan,
  calculateFinancials,
  validateCostPlan,
} from "./echoes-brasil-cost-planning";

function runTests() {
  console.log("Running ECHOES Brasil Cost Planning Tests...");

  const basePlan: EchoesCostPlan = {
    productSlug: "echoes-brasil-expanded",
    salePriceCents: 6900,
    currency: "CAD",
    manufacturingCostCents: 0,
    printingCostCents: 0,
    packagingCostCents: 0,
    inboundFreightCents: 0,
    assemblyCostCents: 0,
    paymentFeePercent: 0,
    paymentFeeFixedCents: 0,
    shippingSubsidyCents: 0,
    returnsReservePercent: 0,
    marketingCostPerUnitCents: 0,
    otherVariableCostCents: 0,
    oneTimeArtworkCostCents: 0,
    oneTimeSetupCostCents: 0,
    oneTimePrototypeCostCents: 0,
    plannedQuantity: 1,
  };

  let passed = 0;
  let failed = 0;

  function assertEqual(name: string, actual: any, expected: any) {
    if (actual === expected) {
      console.log(`[PASS] ${name}`);
      passed++;
    } else {
      console.error(`[FAIL] ${name} | Expected ${expected}, got ${actual}`);
      failed++;
    }
  }

  // A. Tous les champs à zéro avec quantité 1
  const resultA = calculateFinancials(basePlan);
  assertEqual("A. Is Complete", resultA.isComplete, true);
  assertEqual("A. Variable Cost 0", resultA.variableCost, 0);
  assertEqual("A. Profit equal to price", resultA.profitPerUnit, 6900);
  assertEqual("A. Break-even 0", resultA.breakEvenUnits, 0);

  // B. Frais avec arrondi (6900 cents, 2.9%, 30 fixed = 6900*0.029 + 30 = 200.1 + 30 = 230.1 -> 230)
  const planB = { ...basePlan, salePriceCents: 6900, paymentFeePercent: 2.9, paymentFeeFixedCents: 30 };
  const resultB = calculateFinancials(planB);
  assertEqual("B. Payment Fee Rounding (230)", resultB.paymentFee, 230);

  // C. Réserve avec arrondi (3900 cents, 1.5% = 3900*0.015 = 58.5 -> 59)
  const planC = { ...basePlan, salePriceCents: 3900, returnsReservePercent: 1.5 };
  const resultC = calculateFinancials(planC);
  assertEqual("C. Returns Reserve Rounding (59)", resultC.returnsReserve, 59);

  // D. Valeur Infinity
  const planD = { ...basePlan, manufacturingCostCents: Infinity };
  const resultD = validateCostPlan(planD);
  assertEqual("D. Infinity is invalid", resultD.isComplete, false);

  // E. Coût -1
  const planE = { ...basePlan, manufacturingCostCents: -1 };
  const resultE = validateCostPlan(planE);
  assertEqual("E. Negative cost is invalid", resultE.isComplete, false);

  // F. Pourcentage 100.01
  const planF = { ...basePlan, paymentFeePercent: 100.01 };
  const resultF = validateCostPlan(planF);
  assertEqual("F. Percent > 100 is invalid", resultF.isComplete, false);

  // G. Quantité 1.5
  const planG = { ...basePlan, plannedQuantity: 1.5 };
  const resultG = validateCostPlan(planG);
  assertEqual("G. Decimal quantity is invalid", resultG.isComplete, false);

  // H. Marge négative
  const planH = { ...basePlan, salePriceCents: 6900, manufacturingCostCents: 7000 };
  const resultH = calculateFinancials(planH);
  assertEqual("H. Negative margin breakEvenUnits is null", resultH.breakEvenUnits, null);

  console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
}

runTests();
