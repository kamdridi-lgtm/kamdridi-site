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

export type CostPlanFieldDefinition = {
  key: keyof EchoesCostPlan;
  label: string;
  type: "cents" | "percent" | "quantity";
  required: boolean;
  minimum: number;
  maximum: number | null;
  integer: boolean;
};

export const costPlanFieldDefinitions: CostPlanFieldDefinition[] = [
  { key: "manufacturingCostCents", label: "Manufacturing cost", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "printingCostCents", label: "Printing cost", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "packagingCostCents", label: "Packaging cost", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "inboundFreightCents", label: "Inbound freight", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "assemblyCostCents", label: "Assembly cost", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "paymentFeePercent", label: "Payment fee (%)", type: "percent", required: true, minimum: 0, maximum: 100, integer: false },
  { key: "paymentFeeFixedCents", label: "Payment fixed fee", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "shippingSubsidyCents", label: "Shipping subsidy", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "returnsReservePercent", label: "Returns reserve (%)", type: "percent", required: true, minimum: 0, maximum: 100, integer: false },
  { key: "marketingCostPerUnitCents", label: "Marketing / unit", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "otherVariableCostCents", label: "Other variable cost", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "oneTimeArtworkCostCents", label: "Artwork cost", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "oneTimeSetupCostCents", label: "Setup cost", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "oneTimePrototypeCostCents", label: "Prototype cost", type: "cents", required: true, minimum: 0, maximum: null, integer: true },
  { key: "plannedQuantity", label: "Planned quantity", type: "quantity", required: true, minimum: 1, maximum: null, integer: true },
];

export function validateCostPlanField(def: CostPlanFieldDefinition, value: any): { isValid: boolean; error: string | null } {
  if (value === null || value === undefined) {
    if (def.required) {
      return { isValid: false, error: `${def.label} is required.` };
    }
    return { isValid: true, error: null };
  }

  if (typeof value !== "number" || isNaN(value) || !Number.isFinite(value)) {
    return { isValid: false, error: `${def.label} must be a valid finite number.` };
  }

  if (value < def.minimum) {
    return { isValid: false, error: `${def.label} must be at least ${def.minimum}.` };
  }

  if (def.maximum !== null && value > def.maximum) {
    return { isValid: false, error: `${def.label} must be at most ${def.maximum}.` };
  }

  if (def.integer && !Number.isInteger(value)) {
    return { isValid: false, error: `${def.label} must be an integer.` };
  }

  return { isValid: true, error: null };
}

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
    const val = plan[def.key];
    const validation = validateCostPlanField(def, val);
    
    if (!validation.isValid) {
      if (val === null || val === undefined || val === "") {
        missingFields.push(def.label);
      } else {
        invalidFields.push(validation.error!);
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

  const paymentFee = Math.round(
    plan.salePriceCents * (plan.paymentFeePercent! / 100) +
    plan.paymentFeeFixedCents!
  );

  const returnsReserve = Math.round(
    plan.salePriceCents * (plan.returnsReservePercent! / 100)
  );

  const variableCost = Math.round(
    plan.manufacturingCostCents! +
    plan.printingCostCents! +
    plan.packagingCostCents! +
    plan.inboundFreightCents! +
    plan.assemblyCostCents! +
    paymentFee +
    plan.shippingSubsidyCents! +
    returnsReserve +
    plan.marketingCostPerUnitCents! +
    plan.otherVariableCostCents!
  );

  const profitPerUnit = Math.round(
    plan.salePriceCents - variableCost
  );

  const fixedCosts = Math.round(
    plan.oneTimeArtworkCostCents! +
    plan.oneTimeSetupCostCents! +
    plan.oneTimePrototypeCostCents!
  );

  const totalProfit = Math.round(
    profitPerUnit * plan.plannedQuantity! - fixedCosts
  );

  const grossMarginPercent =
    (profitPerUnit / plan.salePriceCents) * 100;

  const breakEvenUnits =
    profitPerUnit > 0
      ? fixedCosts === 0
        ? 0
        : Math.ceil(fixedCosts / profitPerUnit)
      : null;

  return {
    isComplete: true,
    missingFields: [],
    invalidFields: [],
    paymentFee,
    returnsReserve,
    variableCost,
    profitPerUnit,
    grossMarginPercent,
    fixedCosts,
    totalProfit,
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
