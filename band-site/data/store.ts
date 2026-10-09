import { getVisibleCommerceProducts, CommerceProduct } from "./commerce-products";

export const storeSizes = ["S", "M", "L", "XL", "XXL"] as const;
export const teeColors = ["Black", "White"] as const;
export const signalTargetColors = ["Black", "White", "Sand"] as const;

export type StoreSize = (typeof storeSizes)[number];
export type StoreColor = (typeof teeColors | typeof signalTargetColors)[number];

// Legacy type mapping for backward compatibility if needed in old components
export type StoreProduct = CommerceProduct & {
  price: number;
  priceLabel: string;
  featured?: boolean;
};

const allCommerce = getVisibleCommerceProducts();

export const storeProducts: StoreProduct[] = allCommerce
  .map(p => ({
    ...p,
    price: p.priceCents / 100,
    priceLabel: `$${p.priceCents / 100}`,
    featured: p.id === "war-machines-collector-artifact"
  }));

export const featuredArtifact = storeProducts.find(p => p.id === "war-machines-collector-artifact") as StoreProduct & {
  kicker: string;
  ctaLabel: string;
  includes: string[];
};

if (featuredArtifact) {
  featuredArtifact.kicker = "Collector Artifact";
  featuredArtifact.ctaLabel = "ACQUIRE THE ARTIFACT";
  featuredArtifact.includes = [
    "180g 4-Record Vinyl Set",
    "War Machines Official T-Shirt",
    "Signed Mini Poster",
    "Collector packaging",
    "Numbered metal seal artifact"
  ];
}

export const storefrontGrid = storeProducts.filter((product) => !product.featured);
export const catalogProductNames = storeProducts.map((product) => product.name);
export const autoFulfillmentProducts = catalogProductNames;

export type PrintfulMappedProduct = {
  id: string;
  name: string;
  printfulEnvPrefix: string;
  colors?: readonly StoreColor[];
  sizes?: readonly StoreSize[];
};

export const printfulMappedProducts: PrintfulMappedProduct[] = [];
