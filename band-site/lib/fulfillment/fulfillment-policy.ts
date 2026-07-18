import { validateFulfillmentReadiness, getFulfillmentProfile } from "../fulfillment-resolver";

export class FulfillmentPolicyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FulfillmentPolicyError";
  }
}

export function assertFulfillmentReady(productId: string) {
  const profile = getFulfillmentProfile(productId);
  if (!profile) {
    throw new FulfillmentPolicyError("UNKNOWN_PRODUCT");
  }

  if (profile.automaticSubmission !== true) {
    throw new FulfillmentPolicyError("FULFILLMENT_NOT_READY: automaticSubmission is false");
  }

  const readiness = validateFulfillmentReadiness(productId);
  if (!readiness.ready) {
    throw new FulfillmentPolicyError(`FULFILLMENT_NOT_READY: ${readiness.blockers.join(", ")}`);
  }
}
