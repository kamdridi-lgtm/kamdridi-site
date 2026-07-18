import { fulfillmentProfiles, ProductFulfillmentProfile, FulfillmentProvider } from "../data/fulfillment-products";

export function getFulfillmentProfile(productId: string): ProductFulfillmentProfile | undefined {
  return fulfillmentProfiles.find(p => p.productId === productId);
}

export function getProductsByProvider(provider: FulfillmentProvider): ProductFulfillmentProfile[] {
  return fulfillmentProfiles.filter(p => p.provider === provider);
}

export function validateFulfillmentReadiness(productId: string): { ready: boolean; blockers: string[] } {
  const profile = getFulfillmentProfile(productId);
  if (!profile) {
    return { ready: false, blockers: ["UNKNOWN_PRODUCT"] };
  }

  const blockers: string[] = [];

  if (profile.provider !== "digital_internal" && profile.provider !== "manual_supplier") {
    if (!profile.providerProductId) {
      blockers.push("providerProductId is missing");
    }
  }

  if (profile.assetStatus !== "print_ready") {
    blockers.push(`assetStatus is ${profile.assetStatus} (must be print_ready)`);
  }

  if (profile.prototypeStatus !== "approved") {
    blockers.push(`prototypeStatus is ${profile.prototypeStatus} (must be approved)`);
  }

  if (profile.supplierStatus !== "ready") {
    blockers.push(`supplierStatus is ${profile.supplierStatus} (must be ready)`);
  }

  if (profile.automaticSubmission !== true) {
    blockers.push("automaticSubmission is not explicitly approved");
  }

  if (profile.missingRequirements && profile.missingRequirements.length > 0) {
    blockers.push(`${profile.missingRequirements.length} missing requirements must be resolved`);
  }

  return {
    ready: blockers.length === 0,
    blockers
  };
}

export function isAutomaticFulfillmentAllowed(productId: string): boolean {
  return validateFulfillmentReadiness(productId).ready;
}
