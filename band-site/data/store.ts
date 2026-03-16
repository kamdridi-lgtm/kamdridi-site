export const storeSizes = ["S", "M", "L", "XL", "XXL"] as const;
export const teeColors = ["Black", "White"] as const;

export type StoreSize = (typeof storeSizes)[number];
export type StoreColor = (typeof teeColors)[number];

export type StoreProduct = {
  id: string;
  name: string;
  category: string;
  image: string;
  price: number;
  priceLabel: string;
  description: string;
  badge?: string;
  featured?: boolean;
  colors?: readonly StoreColor[];
  sizes?: readonly StoreSize[];
  fulfillmentMode: "printful" | "manual";
  printfulEnvPrefix?: string;
};

export const featuredArtifact: StoreProduct & {
  kicker: string;
  ctaLabel: string;
  includes: string[];
} = {
  id: "war-machines-collector-artifact",
  name: "Echoes Unearthed - War Machines Collector Artifact",
  category: "Collector Bundle",
  image: "/store/artifact-bundle.jpg",
  price: 125,
  priceLabel: "$125",
  description: "Extremely limited collector bundle. No restock.",
  badge: "EXTREMELY LIMITED",
  featured: true,
  fulfillmentMode: "manual",
  kicker: "Collector Artifact",
  ctaLabel: "ACQUIRE THE ARTIFACT",
  includes: [
    "180g 4-Record Vinyl Set",
    "War Machines Official T-Shirt",
    "Signed Mini Poster",
    "Collector packaging",
    "Numbered metal seal artifact"
  ]
};

export const storeProducts: StoreProduct[] = [
  featuredArtifact,
  {
    id: "war-machines-artifact-tee",
    name: "War Machines Artifact Tee",
    category: "Apparel",
    image: "/store/war-machines-helmet.jpg",
    price: 35,
    priceLabel: "$35",
    description: "Helmet-front War Machines campaign tee in black or white with collector-grade print.",
    colors: teeColors,
    sizes: storeSizes,
    fulfillmentMode: "printful",
    printfulEnvPrefix: "WAR_MACHINES_ARTIFACT_TEE"
  },
  {
    id: "echoes-unearthed-vinyl",
    name: "Echoes Unearthed Vinyl",
    category: "Physical Music",
    image: "/store/vinyl-product.jpg",
    price: 40,
    priceLabel: "$40",
    description: "Echoes Unearthed on heavyweight vinyl with cinematic black-gold packaging.",
    fulfillmentMode: "manual"
  },
  {
    id: "echoes-unearthed-cd",
    name: "Echoes Unearthed CD",
    category: "Physical Music",
    image: "/store/cd-product.jpg",
    price: 18,
    priceLabel: "$18",
    description: "Official Echoes Unearthed CD in premium digipack format.",
    fulfillmentMode: "manual"
  }
];

export const storefrontGrid = storeProducts.filter((product) => !product.featured);

export const autoFulfillmentProducts = [
  "War Machines Artifact Tee",
  "Echoes Unearthed Tee",
  "Posters"
];
