export const storeSizes = ["S", "M", "L", "XL", "XXL"] as const;
export const teeColors = ["Black", "White"] as const;
export const signalTargetColors = ["Black", "White", "Sand"] as const;

export type StoreSize = (typeof storeSizes)[number];
export type StoreColor = (typeof teeColors | typeof signalTargetColors)[number];

export type StoreProduct = {
  id: string;
  name: string;
  category: string;
  image: string;
  imagePosition?: string;
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

export type PrintfulMappedProduct = {
  id: string;
  name: string;
  printfulEnvPrefix: string;
  colors?: readonly StoreColor[];
  sizes?: readonly StoreSize[];
};

export const featuredArtifact: StoreProduct & {
  kicker: string;
  ctaLabel: string;
  includes: string[];
} = {
  id: "war-machines-collector-artifact",
  name: "Echoes Unearthed - War Machines Collector Artifact",
  category: "Collector Bundle",
  image: "/assets/images/releases/war-machines-cover.png",
  price: 165,
  priceLabel: "$165",
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
  {
    id: "echoes-unearthed-collector-cd",
    name: "Echoes Unearthed - Collector CD",
    category: "Physical Collector Edition",
    image: "/store/cd-product.jpg",
    price: 34,
    priceLabel: "$34",
    description:
      "Physical collector CD edition with 9 official tracks, hidden bonus archive track, premium booklet, and collector artwork.",
    badge: "Available Now",
    fulfillmentMode: "manual"
  },
  featuredArtifact,
  {
    id: "the-gilded-null-license",
    name: "The Gilded Null - Protocol License",
    category: "Digital Access",
    image: "/official-game-poster.png",
    price: 19,
    priceLabel: "$19",
    description: "Browser game access for The Gilded Null outside the Fan Club membership path.",
    fulfillmentMode: "manual"
  },
  {
    id: "vault-sequence-license",
    name: "Vault Sequence - Chapter II License",
    category: "Digital Access",
    image: "/assets/images/games/vault-sequence-poster.png",
    price: 29,
    priceLabel: "$29",
    description: "Chapter II browser access for Vault Sequence outside the Fan Club path.",
    fulfillmentMode: "manual"
  },
  {
    id: "kamdridi-gold-logo-tee",
    name: "KAMDRIDI Gold Logo Tee",
    category: "Apparel",
    image: "/store/merch/gold-logo-tee-glow.png",
    price: 38,
    priceLabel: "$38",
    description: "Black tee with the glowing gold KAMDRIDI logo across the chest.",
    badge: "Core Drop",
    sizes: storeSizes,
    colors: ["Black"] as const,
    fulfillmentMode: "manual"
  },
  {
    id: "kamdridi-gold-logo-hoodie",
    name: "KAMDRIDI Gold Logo Hoodie",
    category: "Apparel",
    image: "/store/merch/logo-essentials-grid.png",
    imagePosition: "75% 25%",
    price: 78,
    priceLabel: "$78",
    description: "Heavy black hoodie with the gold KAMDRIDI logo in the essentials capsule.",
    sizes: storeSizes,
    colors: ["Black"] as const,
    fulfillmentMode: "manual"
  },
  {
    id: "kamdridi-logo-snapback",
    name: "KAMDRIDI Logo Snapback",
    category: "Accessories",
    image: "/store/merch/logo-essentials-grid.png",
    imagePosition: "25% 75%",
    price: 32,
    priceLabel: "$32",
    description: "Black snapback with the gold KAMDRIDI logo and matching underside sticker.",
    fulfillmentMode: "manual"
  },
  {
    id: "kamdridi-logo-mug",
    name: "KAMDRIDI Logo Mug",
    category: "Accessories",
    image: "/store/merch/logo-essentials-grid.png",
    imagePosition: "75% 75%",
    price: 24,
    priceLabel: "$24",
    description: "Black ceramic mug from the gold-logo essentials drop.",
    fulfillmentMode: "manual"
  },
  {
    id: "echoes-unearthed-crest-tee",
    name: "Echoes Unearthed Crest Tee",
    category: "Apparel",
    image: "/store/merch/echoes-crest-tee-duo.png",
    price: 46,
    priceLabel: "$46",
    description: "Front-print crest tee from the Echoes Unearthed capsule in black or white.",
    badge: "Echoes Capsule",
    sizes: storeSizes,
    colors: teeColors,
    fulfillmentMode: "manual"
  },
  {
    id: "echoes-unearthed-wordmark-tee",
    name: "KAM DRIDI / Echoes Unearthed Wordmark Tee",
    category: "Apparel",
    image: "/store/merch/echoes-wordmark-tee-duo.png",
    price: 42,
    priceLabel: "$42",
    description: "Clean front-print wordmark tee pairing the KAM DRIDI mark with the Echoes Unearthed title.",
    badge: "Echoes Capsule",
    sizes: storeSizes,
    colors: teeColors,
    fulfillmentMode: "manual"
  },
  {
    id: "signal-target-tee-collection",
    name: "Signal Target Capsule",
    category: "Capsule",
    image: "/store/merch/signal-target-collection.png",
    price: 44,
    priceLabel: "$44",
    description:
      "Multi-look tee capsule built around the signal target symbol, Echoes Unearthed wordmark, and black, white, and sand back-print variants.",
    badge: "Variant Set",
    sizes: storeSizes,
    colors: signalTargetColors,
    fulfillmentMode: "manual"
  },
  {
    id: "war-machines-mini-poster",
    name: "War Machines Mini Poster",
    category: "Print",
    image: "/assets/images/releases/war-machines-cover.png",
    price: 22,
    priceLabel: "$22",
    description: "Gloss mini poster built from the official War Machines single cover.",
    badge: "Single Art Print",
    fulfillmentMode: "manual"
  },
  {
    id: "official-tee-picture",
    name: "Echoes Unearthed Excavation Tee",
    category: "Collector Apparel",
    image: "/store/merch/official-tee-picture.png",
    price: 52,
    priceLabel: "$52",
    description:
      "Collector apparel variant pairing excavation artwork on black with a reverse wordmark and target layout.",
    badge: "Collector Variant",
    sizes: storeSizes,
    colors: teeColors,
    fulfillmentMode: "manual"
  }
];

export const storefrontGrid = storeProducts.filter((product) => !product.featured);

export const catalogProductNames = storeProducts.map((product) => product.name);

export const autoFulfillmentProducts = catalogProductNames;

export const printfulMappedProducts: PrintfulMappedProduct[] = [];
