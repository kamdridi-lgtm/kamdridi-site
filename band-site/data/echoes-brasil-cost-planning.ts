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

export const costPlanFieldDefinitions = [
  { key: "manufacturingCostCents", label: "Manufacturing cost", type: "cents" },
  { key: "printingCostCents", label: "Printing cost", type: "cents" },
  { key: "packagingCostCents", label: "Packaging cost", type: "cents" },
  { key: "inboundFreightCents", label: "Inbound freight", type: "cents" },
  { key: "assemblyCostCents", label: "Assembly cost", type: "cents" },
  { key: "paymentFeePercent", label: "Payment fee (%)", type: "percent" },
  { key: "paymentFeeFixedCents", label: "Payment fixed fee", type: "cents" },
  { key: "shippingSubsidyCents", label: "Shipping subsidy", type: "cents" },
  { key: "returnsReservePercent", label: "Returns reserve (%)", type: "percent" },
  { key: "marketingCostPerUnitCents", label: "Marketing / unit", type: "cents" },
  { key: "otherVariableCostCents", label: "Other variable cost", type: "cents" },
  { key: "oneTimeArtworkCostCents", label: "Artwork cost", type: "cents" },
  { key: "oneTimeSetupCostCents", label: "Setup cost", type: "cents" },
  { key: "oneTimePrototypeCostCents", label: "Prototype cost", type: "cents" },
  { key: "plannedQuantity", label: "Planned quantity", type: "quantity" },
];

export function validateCostPlan(plan: EchoesCostPlan) {
  const missingFields: string[] = [];
  const invalidFields: string[] = [];

  // Sale price and currency
  if (plan.salePriceCents === null || plan.salePriceCents <= 0 || !Number.isInteger(plan.salePriceCents)) {
    invalidFields.push("Sale price must be a positive integer.");
  }
  if (plan.currency !== "CAD") {
    invalidFields.push("Currency must be CAD.");
  }

  costPlanFieldDefinitions.forEach((def) => {
    const val = plan[def.key as keyof EchoesCostPlan];

    if (val === null || val === undefined) {
      missingFields.push(def.label);
      return;
    }

    if (typeof val !== "number" || isNaN(val) || !isFinite(val)) {
      invalidFields.push(`${def.label} must be a valid number.`);
      return;
    }

    if (def.type === "cents") {
      if (val < 0 || !Number.isInteger(val)) {
        invalidFields.push(`${def.label} must be a positive integer or zero.`);
      }
    } else if (def.type === "percent") {
      if (val < 0 || val > 100) {
        invalidFields.push(`${def.label} must be between 0 and 100.`);
      }
    } else if (def.type === "quantity") {
      if (val <= 0 || !Number.isInteger(val)) {
        invalidFields.push(`${def.label} must be an integer greater than zero.`);
      }
    }
  });

  return {
    isComplete: missingFields.length === 0 && invalidFields.length === 0,
    missingFields,
    invalidFields,
  };
}

export function calculateFinancials(plan: EchoesCostPlan) {
  const validation = validateCostPlan(plan);

  if (!validation.isComplete) {
    return {
      isComplete: false,
      missingFields: validation.missingFields,
      invalidFields: validation.invalidFields,
    };
  }

  const paymentFee =
    plan.salePriceCents * (plan.paymentFeePercent! / 100) + plan.paymentFeeFixedCents!;

  const returnsReserve = plan.salePriceCents * (plan.returnsReservePercent! / 100);

  const variableCost =
    plan.manufacturingCostCents! +
    plan.printingCostCents! +
    plan.packagingCostCents! +
    plan.inboundFreightCents! +
    plan.assemblyCostCents! +
    paymentFee +
    plan.shippingSubsidyCents! +
    returnsReserve +
    plan.marketingCostPerUnitCents! +
    plan.otherVariableCostCents!;

  const profitPerUnit = plan.salePriceCents - variableCost;
  const grossMarginPercent = (profitPerUnit / plan.salePriceCents) * 100;

  const fixedCosts =
    plan.oneTimeArtworkCostCents! +
    plan.oneTimeSetupCostCents! +
    plan.oneTimePrototypeCostCents!;

  const totalProfit = profitPerUnit * plan.plannedQuantity! - fixedCosts;

  let breakEvenUnits: number | null = null;
  if (profitPerUnit > 0) {
    breakEvenUnits = fixedCosts === 0 ? 0 : Math.ceil(fixedCosts / profitPerUnit);
  }

  return {
    isComplete: true,
    missingFields: [],
    invalidFields: [],
    variableCost: Math.round(variableCost),
    profitPerUnit: Math.round(profitPerUnit),
    grossMarginPercent,
    fixedCosts: Math.round(fixedCosts),
    totalProfit: Math.round(totalProfit),
    breakEvenUnits,
  };
}

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
