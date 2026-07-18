import { FulfillmentProviderAdapter } from "./provider-adapter";

export const DiggersAdapter: FulfillmentProviderAdapter = {
  validateConfiguration: () => "NOT_CONFIGURED",
  validateProductMapping: () => ({ valid: false, errors: ["NOT_CONFIGURED"] }),
  estimateOrder: async () => { throw new Error("NOT_CONFIGURED"); },
  createDraftOrder: async () => { throw new Error("NOT_CONFIGURED"); },
  submitOrder: async () => { throw new Error("NOT_CONFIGURED"); }
};
