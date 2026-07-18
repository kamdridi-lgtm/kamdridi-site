export interface FulfillmentProviderAdapter {
  validateConfiguration(): "CONFIGURED" | "NOT_CONFIGURED";
  validateProductMapping(productId: string): { valid: boolean; errors: string[] };
  estimateOrder(productId: string, destination: any): Promise<any>;
  createDraftOrder(productId: string, details: any): Promise<any>;
  submitOrder(productId: string, details: any): Promise<any>;
}
