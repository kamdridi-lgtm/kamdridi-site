export type EchoesCostPlan = {
  productSlug: string;
  salePriceCents: number;
  currency: string;

  manufacturingCostCents: number | null;
  printingCostCents: number | null;
  packagingCostCents: number | null;
  inboundFreightCents: number | null;
  assemblyCostCents: number | null;
  paymentFeePercent: number | null;
  paymentFeeFixedCents: number | null;
  shippingSubsidyCents: number | null;
  returnsReservePercent: number | null;
  marketingCostPerUnitCents: number | null;
  otherVariableCostCents: number | null;

  oneTimeArtworkCostCents: number | null;
  oneTimeSetupCostCents: number | null;
  oneTimePrototypeCostCents: number | null;
  plannedQuantity: number | null;
};

export const defaultEchoesCostPlans: EchoesCostPlan[] = [
  {
    productSlug: "echoes-brasil-expanded",
    salePriceCents: 6900,
    currency: "CAD",
    manufacturingCostCents: null,
    printingCostCents: null,
    packagingCostCents: null,
    inboundFreightCents: null,
    assemblyCostCents: null,
    paymentFeePercent: null,
    paymentFeeFixedCents: null,
    shippingSubsidyCents: null,
    returnsReservePercent: null,
    marketingCostPerUnitCents: null,
    otherVariableCostCents: null,
    oneTimeArtworkCostCents: null,
    oneTimeSetupCostCents: null,
    oneTimePrototypeCostCents: null,
    plannedQuantity: null,
  },
  {
    productSlug: "echoes-brasil-livreto",
    salePriceCents: 3900,
    currency: "CAD",
    manufacturingCostCents: null,
    printingCostCents: null,
    packagingCostCents: null,
    inboundFreightCents: null,
    assemblyCostCents: null,
    paymentFeePercent: null,
    paymentFeeFixedCents: null,
    shippingSubsidyCents: null,
    returnsReservePercent: null,
    marketingCostPerUnitCents: null,
    otherVariableCostCents: null,
    oneTimeArtworkCostCents: null,
    oneTimeSetupCostCents: null,
    oneTimePrototypeCostCents: null,
    plannedQuantity: null,
  },
  {
    productSlug: "echoes-brasil-deluxe",
    salePriceCents: 22900,
    currency: "CAD",
    manufacturingCostCents: null,
    printingCostCents: null,
    packagingCostCents: null,
    inboundFreightCents: null,
    assemblyCostCents: null,
    paymentFeePercent: null,
    paymentFeeFixedCents: null,
    shippingSubsidyCents: null,
    returnsReservePercent: null,
    marketingCostPerUnitCents: null,
    otherVariableCostCents: null,
    oneTimeArtworkCostCents: null,
    oneTimeSetupCostCents: null,
    oneTimePrototypeCostCents: null,
    plannedQuantity: null,
  }
];

export function calculateFinancials(plan: EchoesCostPlan) {
  // Check required variable fields
  const requiredVariable = [
    plan.manufacturingCostCents,
    plan.packagingCostCents,
    plan.paymentFeePercent,
    plan.paymentFeeFixedCents,
    plan.plannedQuantity,
  ];

  const isComplete = requiredVariable.every((v) => v !== null);

  if (!isComplete) {
    return { isComplete: false };
  }

  const paymentFee =
    plan.salePriceCents * (plan.paymentFeePercent! / 100) + plan.paymentFeeFixedCents!;

  const returnsReserve = plan.returnsReservePercent
    ? plan.salePriceCents * (plan.returnsReservePercent / 100)
    : 0;

  const variableCost =
    (plan.manufacturingCostCents || 0) +
    (plan.printingCostCents || 0) +
    (plan.packagingCostCents || 0) +
    (plan.inboundFreightCents || 0) +
    (plan.assemblyCostCents || 0) +
    paymentFee +
    (plan.shippingSubsidyCents || 0) +
    returnsReserve +
    (plan.marketingCostPerUnitCents || 0) +
    (plan.otherVariableCostCents || 0);

  const profitPerUnit = plan.salePriceCents - variableCost;
  const grossMarginPercent = plan.salePriceCents > 0 ? (profitPerUnit / plan.salePriceCents) * 100 : 0;

  const fixedCosts =
    (plan.oneTimeArtworkCostCents || 0) +
    (plan.oneTimeSetupCostCents || 0) +
    (plan.oneTimePrototypeCostCents || 0);

  const totalProfit = profitPerUnit * plan.plannedQuantity! - fixedCosts;

  const breakEvenUnits = profitPerUnit > 0 ? Math.ceil(fixedCosts / profitPerUnit) : null;

  return {
    isComplete: true,
    variableCost,
    profitPerUnit,
    grossMarginPercent,
    fixedCosts,
    totalProfit,
    breakEvenUnits,
  };
}
