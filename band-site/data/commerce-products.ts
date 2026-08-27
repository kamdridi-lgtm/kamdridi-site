export type SaleMode = "buy_now" | "preorder" | "digital" | "sold_out" | "coming_soon";
export type FulfillmentMode = "manual_physical" | "manual_preorder" | "digital_manual" | "printful" | "game_access" | "multi_vendor" | "made_to_order";

export type VendorComponent = {
  name: string;
  vendorId: "printful" | "qrates_vinyl" | "custom_jeweler" | "book_printer" | "merch_supplier";
  sku: string;
};

export type CommerceProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  project: string;
  projectSlug: string;
  category: string;
  description: string;
  images: string[];
  priceCents: number;
  currency: "CAD" | "JPY";
  saleMode: SaleMode;
  visible: boolean;
  checkoutEnabled: boolean;
  fulfillmentMode: FulfillmentMode;
  requiresShipping: boolean;
  quantityLimit?: number;
  productPath: string;
  releasePath: string;
  badge?: string;
  fulfillmentNote?: string;
  colors?: readonly string[];
  sizes?: readonly string[];
  formats?: readonly string[];
  productionComponents?: VendorComponent[];
};

export const commerceProducts: CommerceProduct[] = [
  // ==========================================
  // 17 FOR EVER — AUSTRALIA 2027
  // 12-inch black vinyl supplier basis: Kunaki US$36/unit, MOQ 1; shipping excluded.
  // Live retail is CA$159. Verify destination shipping before making any landed-margin claim.
  // ==========================================
  {
    id: "17-for-ever-maxi-single",
    slug: "17-for-ever-maxi-single",
    name: "17 FOR EVER",
    subtitle: "LIMITED EDITION MAXI SINGLE",
    project: "17 FOR EVER",
    projectSlug: "australia-17-for-ever",
    category: "Physical Music",
    description: "12-inch black-vinyl maxi single with full-color labels, an inner sleeve, and a full-color jacket. Four versions, arriving January 2027.",
    images: ["/australia/17-for-ever-front-cover.webp"],
    priceCents: 15900,
    currency: "CAD",
    saleMode: "preorder",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    quantityLimit: 4,
    badge: "Pre-order · January 2027",
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store#17-for-ever-maxi-single",
    releasePath: "/australia"
  },
  {
    id: "17-for-ever-limited-cd",
    slug: "17-for-ever-limited-cd",
    name: "17 FOR EVER",
    subtitle: "LIMITED EDITION CD",
    project: "17 FOR EVER",
    projectSlug: "australia-17-for-ever",
    category: "Physical Music",
    description: "Limited CD presentation with the Australian disc face and the complete four-version tracklist.",
    images: ["/australia/17-for-ever-disc.webp"],
    priceCents: 3900,
    currency: "CAD",
    saleMode: "preorder",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    quantityLimit: 4,
    badge: "January 2027",
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store#17-for-ever-limited-cd",
    releasePath: "/australia"
  },
  {
    id: "17-for-ever-special-cassette",
    slug: "17-for-ever-special-cassette",
    name: "17 FOR EVER",
    subtitle: "SPECIAL CASSETTE EDITION",
    project: "17 FOR EVER",
    projectSlug: "australia-17-for-ever",
    category: "Collector Item",
    description: "The special collector cassette edition created for the January 2027 Australian campaign.",
    images: ["/australia/17-for-ever-cassette-mockup.webp"],
    priceCents: 4900,
    currency: "CAD",
    saleMode: "preorder",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    quantityLimit: 2,
    badge: "January 2027",
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store#17-for-ever-special-cassette",
    releasePath: "/australia"
  },
  // ==========================================
  // ECHOES UNEARTHED — DIRECT DIGITAL
  // 9-track digital programme. Track 10, ECHOES OF OUR YOUTH, is physical-only.
  // Single-track buyers qualify for one private 20% album-upgrade offer after 48 hours.
  // ==========================================
  {
    id: "war-machines-digital-track",
    slug: "war-machines-digital-track",
    name: "WAR MACHINES",
    subtitle: "ECHOES UNEARTHED HD DOWNLOAD",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Digital Music",
    description: "24-bit / 48 kHz WAV album master from ECHOES UNEARTHED.",
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"],
    priceCents: 299,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    badge: "HD WAV",
    productPath: "/releases/echoes-unearthed#buy",
    releasePath: "/releases/echoes-unearthed"
  },
  {
    id: "too-fast-too-young-digital-track",
    slug: "too-fast-too-young-digital-track",
    name: "TOO FAST TOO YOUNG",
    subtitle: "ECHOES UNEARTHED HD DOWNLOAD",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Digital Music",
    description: "24-bit / 48 kHz WAV album master from ECHOES UNEARTHED.",
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"],
    priceCents: 299,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    badge: "HD WAV",
    productPath: "/releases/echoes-unearthed#buy",
    releasePath: "/releases/echoes-unearthed"
  },
  {
    id: "our-lost-dreams-digital-single",
    slug: "our-lost-dreams-digital-single",
    name: "OUR LOST DREAMS",
    subtitle: "ECHOES UNEARTHED HD DOWNLOAD",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Digital Music",
    description: "24-bit / 48 kHz WAV album master from ECHOES UNEARTHED.",
    images: ["/assets/images/our-lost-dreams-cover.jpg"],
    priceCents: 299,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    badge: "HD WAV",
    productPath: "/buy",
    releasePath: "/releases/echoes-unearthed"
  },
  {
    id: "junction-ahead-digital-track",
    slug: "junction-ahead-digital-track",
    name: "JUNCTION AHEAD (NEW HEAVEN'S ODYSSEY)",
    subtitle: "ECHOES UNEARTHED HD DOWNLOAD",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Digital Music",
    description: "24-bit / 48 kHz WAV album master from ECHOES UNEARTHED.",
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"],
    priceCents: 299,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    badge: "HD WAV",
    productPath: "/releases/echoes-unearthed#buy",
    releasePath: "/releases/echoes-unearthed"
  },
  {
    id: "17-for-ever-echoes-digital-track",
    slug: "17-for-ever-echoes-digital-track",
    name: "17 FOR EVER",
    subtitle: "ECHOES UNEARTHED HD DOWNLOAD",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Digital Music",
    description: "24-bit / 48 kHz WAV album master from ECHOES UNEARTHED.",
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"],
    priceCents: 299,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    badge: "HD WAV",
    productPath: "/releases/echoes-unearthed#buy",
    releasePath: "/releases/echoes-unearthed"
  },
  {
    id: "the-victory-goes-on-digital-track",
    slug: "the-victory-goes-on-digital-track",
    name: "THE VICTORY GOES ON",
    subtitle: "ECHOES UNEARTHED HD DOWNLOAD",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Digital Music",
    description: "24-bit / 48 kHz WAV album master from ECHOES UNEARTHED.",
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"],
    priceCents: 299,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    badge: "HD WAV",
    productPath: "/releases/echoes-unearthed#buy",
    releasePath: "/releases/echoes-unearthed"
  },
  {
    id: "alone-apart-one-apart-digital-track",
    slug: "alone-apart-one-apart-digital-track",
    name: "ALONE APART / ONE APART",
    subtitle: "ECHOES UNEARTHED HD DOWNLOAD",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Digital Music",
    description: "24-bit / 48 kHz WAV album master from ECHOES UNEARTHED.",
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"],
    priceCents: 299,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    badge: "HD WAV",
    productPath: "/releases/echoes-unearthed#buy",
    releasePath: "/releases/echoes-unearthed"
  },
  {
    id: "michael-remembers-digital-track",
    slug: "michael-remembers-digital-track",
    name: "MICHAEL REMEMBERS",
    subtitle: "ECHOES UNEARTHED HD DOWNLOAD",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Digital Music",
    description: "24-bit / 48 kHz WAV album master from ECHOES UNEARTHED.",
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"],
    priceCents: 299,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    badge: "HD WAV",
    productPath: "/releases/echoes-unearthed#buy",
    releasePath: "/releases/echoes-unearthed"
  },
  {
    id: "the-fall-of-the-first-knight-digital-track",
    slug: "the-fall-of-the-first-knight-digital-track",
    name: "THE FALL OF THE FIRST KNIGHT",
    subtitle: "ECHOES UNEARTHED HD DOWNLOAD",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Digital Music",
    description: "24-bit / 48 kHz WAV album master from ECHOES UNEARTHED.",
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"],
    priceCents: 299,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    badge: "HD WAV",
    productPath: "/releases/echoes-unearthed#buy",
    releasePath: "/releases/echoes-unearthed"
  },
  {
    id: "echoes-unearthed-digital-album",
    slug: "echoes-unearthed-digital-album",
    name: "ECHOES UNEARTHED",
    subtitle: "9-TRACK HD DIGITAL ALBUM",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Digital Access",
    description: "Complete nine-track ECHOES UNEARTHED digital album in verified 24-bit / 48 kHz WAV. ECHOES OF OUR YOUTH remains exclusive to the physical edition.",
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"],
    priceCents: 1600,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    badge: "9 TRACKS · HD WAV",
    fulfillmentNote: "Nine-track HD WAV album. ECHOES OF OUR YOUTH is physical-edition-only.",
    productPath: "/releases/echoes-unearthed#buy",
    releasePath: "/releases/echoes-unearthed"
  },

  // ==========================================
  // ECHOES ENGINE — hidden until official artwork and product details are ready
  // ==========================================
  {
    id: "echoes-engine-cd",
    slug: "echoes-engine-cd",
    name: "ECHOES ENGINE",
    subtitle: "CD EDITION",
    project: "ECHOES ENGINE",
    projectSlug: "echoes-engine",
    category: "Physical Music",
    description: "Official CD Edition of Echoes Engine.",
    images: ["/assets/images/releases/war-machines-cover.png"], // Placeholder
    priceCents: 2900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: false,
    checkoutEnabled: false,
    fulfillmentMode: "manual_preorder",
    requiresShipping: true,
    productPath: "/store/echoes-engine-cd",
    releasePath: "/releases/echoes-engine"
  },
  {
    id: "echoes-engine-vinyl",
    slug: "echoes-engine-vinyl",
    name: "ECHOES ENGINE",
    subtitle: "VINYL EDITION",
    project: "ECHOES ENGINE",
    projectSlug: "echoes-engine",
    category: "Physical Music",
    description: "Official Vinyl Edition of Echoes Engine.",
    images: ["/assets/images/releases/war-machines-cover.png"], // Placeholder
    priceCents: 5900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: false,
    checkoutEnabled: false,
    fulfillmentMode: "manual_preorder",
    requiresShipping: true,
    productPath: "/store/echoes-engine-vinyl",
    releasePath: "/releases/echoes-engine"
  },
  {
    id: "echoes-engine-cassette",
    slug: "echoes-engine-cassette",
    name: "ECHOES ENGINE",
    subtitle: "CASSETTE EDITION",
    project: "ECHOES ENGINE",
    projectSlug: "echoes-engine",
    category: "Physical Music",
    description: "Official Cassette Edition of Echoes Engine.",
    images: ["/assets/images/releases/war-machines-cover.png"], // Placeholder
    priceCents: 2400,
    currency: "CAD",
    saleMode: "buy_now",
    visible: false,
    checkoutEnabled: false,
    fulfillmentMode: "manual_preorder",
    requiresShipping: true,
    productPath: "/store/echoes-engine-cassette",
    releasePath: "/releases/echoes-engine"
  },
  {
    id: "echoes-engine-special",
    slug: "echoes-engine-special",
    name: "ECHOES ENGINE",
    subtitle: "SPECIAL COLLECTOR EDITION",
    project: "ECHOES ENGINE",
    projectSlug: "echoes-engine",
    category: "Physical Music",
    description: "Special Collector Edition of Echoes Engine.",
    images: ["/assets/images/releases/war-machines-cover.png"], // Placeholder
    priceCents: 14900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: false,
    checkoutEnabled: false,
    fulfillmentMode: "manual_preorder",
    requiresShipping: true,
    productPath: "/store/echoes-engine-special",
    releasePath: "/releases/echoes-engine"
  },
  // ==========================================
  // ECHOES UN LIVE IN BRASIL
  // ==========================================
  {
    id: "echoes-brasil-expanded-2026",
    slug: "echoes-brasil-expanded",
    name: "ECHOES UN LIVE IN BRASIL",
    subtitle: "EXPANDED EDITION",
    project: "ECHOES UN LIVE IN BRASIL",
    projectSlug: "echoes-un-live-in-brasil",
    category: "Physical Music",
    description: "Apresentação refinada do álbum com visual principal, faixas bônus incluídas e pedido direto.",
    images: ["/echoes-un-live-in-brasil/assets/images/edition-expanded.webp"],
    priceCents: 6900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/echoes-brasil-expanded",
    releasePath: "/releases/echoes-un-live-in-brasil"
  },
  {
    id: "echoes-brasil-vinyl-2026",
    slug: "echoes-brasil-vinyl",
    name: "ECHOES UN LIVE IN BRASIL",
    subtitle: "COLLECTOR VINYL EDITION",
    project: "ECHOES UN LIVE IN BRASIL",
    projectSlug: "echoes-un-live-in-brasil",
    category: "Physical Music",
    description: "12-inch black-vinyl collector edition. The single-LP programme is curated from the canonical 14-track live edition and finalized against the 20-minute-per-side manufacturing limit before production.",
    images: ["/echoes-un-live-in-brasil/assets/images/front-cover.webp"],
    priceCents: 15900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    quantityLimit: 2,
    badge: "Made to order",
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store?filter=echoes-un-live-in-brasil#echoes-brasil-vinyl-2026",
    releasePath: "/releases/echoes-un-live-in-brasil"
  },
  {
    id: "echoes-brasil-livreto-2026",
    slug: "echoes-brasil-livreto",
    name: "ECHOES UN LIVE IN BRASIL",
    subtitle: "COLLECTOR BOOKLET",
    project: "ECHOES UN LIVE IN BRASIL",
    projectSlug: "echoes-un-live-in-brasil",
    category: "Collector Item",
    description: "Páginas internas com imagens ao vivo, créditos e o universo visual da Edição Expandida.",
    images: ["/echoes-un-live-in-brasil/assets/images/edition-livret.webp"],
    priceCents: 3900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/echoes-brasil-livreto",
    releasePath: "/releases/echoes-un-live-in-brasil"
  },
  {
    id: "echoes-brasil-deluxe-2026",
    slug: "echoes-brasil-deluxe",
    name: "ECHOES UN LIVE IN BRASIL",
    subtitle: "DELUXE EDITION",
    project: "ECHOES UN LIVE IN BRASIL",
    projectSlug: "echoes-un-live-in-brasil",
    category: "Physical Music",
    description: "Apresentação de coleção com estojo premium, disco preto e cartão da edição.",
    images: ["/echoes-un-live-in-brasil/assets/images/edition-deluxe.webp"],
    priceCents: 22900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/echoes-brasil-deluxe",
    releasePath: "/releases/echoes-un-live-in-brasil"
  },
  // ==========================================
  // SALIERI'S HANDS
  // ==========================================
  {
    id: "salieri-collector-bundle",
    slug: "salieri-collector-bundle",
    name: "Collector Bundle",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Collector Bundle",
    description: "The ultimate collector experience for Salieri's Hands.",
    images: ["/assets/images/salieris-hands/full-collector-pack.png"],
    priceCents: 34900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/salieri-collector-bundle",
    releasePath: "/releases/salieris-hands",
    productionComponents: [
      {
        name: "Collector Medallion",
        vendorId: "custom_jeweler",
        sku: "SAL-MED-01"
      },
      {
        name: "Salieri's Hands Vinyl",
        vendorId: "qrates_vinyl",
        sku: "SAL-VINYL-01"
      },
      {
        name: "Lore Booklet",
        vendorId: "book_printer",
        sku: "SAL-BOOK-01"
      }
    ]
  },
  {
    id: "salieri-special-edition-box",
    slug: "salieri-special-edition-box",
    name: "Special Edition Box",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Collector Box",
    description: "Special Edition Collector Box for Salieri's Hands.",
    images: ["/assets/images/salieris-hands/full-collector-pack.png"],
    priceCents: 24900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/salieri-special-edition-box",
    releasePath: "/releases/salieris-hands"
  },
  {
    id: "salieri-vinyl-edition",
    slug: "salieri-vinyl-edition",
    name: "Limited Vinyl Edition",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Physical Music",
    description: "Curated nine-track 12-inch black-vinyl collector edition, sequenced to stay within the single-LP side limits.",
    images: ["/assets/images/salieris-hands/pack-back-front-spine.png"],
    priceCents: 19900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/salieri-vinyl-edition",
    releasePath: "/releases/salieris-hands"
  },
  {
    id: "salieri-collector-coin",
    slug: "salieri-collector-coin",
    name: "Collector Coin - Box Edition",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Collector Item",
    description: "Exclusive collector coin presented in a box.",
    images: ["/assets/images/salieris-hands/salieri-collector-coin-box.jpg"],
    priceCents: 8900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/salieri-collector-coin",
    releasePath: "/releases/salieris-hands"
  },
  {
    id: "salieri-collector-medallion",
    slug: "salieri-collector-medallion",
    name: "Collector Medallion",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Collector Item",
    description: "Collector medallion documented as a component of the Salieri's Hands Collector Bundle; standalone fabrication is arranged manually after purchase.",
    images: ["/assets/images/salieris-hands/full-collector-pack.png"],
    priceCents: 8900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    quantityLimit: 1,
    badge: "COLLECTOR",
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store#salieri-collector-medallion",
    releasePath: "/releases/salieris-hands"
  },
  {
    id: "salieri-hardcover-booklet",
    slug: "salieri-hardcover-booklet",
    name: "Hardcover Booklet",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Collector Item",
    description: "Sixteen-page premium collector booklet built around the canonical thirteen-movement physical programme.",
    images: ["/assets/images/salieris-hands/booklet-mockup.png"],
    priceCents: 6900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/salieri-hardcover-booklet",
    releasePath: "/releases/salieris-hands"
  },
  {
    id: "salieri-collector-cd",
    slug: "salieri-collector-cd",
    name: "Collector CD",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Physical Music",
    description: "Thirteen-movement physical collector CD edition of Salieri's Hands.",
    images: ["/assets/images/salieris-hands/jewelcase-mockup.png"],
    priceCents: 4900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/salieri-collector-cd",
    releasePath: "/releases/salieris-hands"
  },
  {
    id: "salieri-digital-release",
    slug: "salieri-digital-release",
    name: "Digital Deluxe Release",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Digital Access",
    description: "Fourteen-track Digital Deluxe edition: the thirteen-movement collector programme plus the additional German Das Prisma digital-only bonus.",
    images: ["/assets/images/salieris-hands/front-cover-approved.png"],
    priceCents: 1600,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "digital_manual",
    requiresShipping: false,
    productPath: "/store/salieri-digital-release",
    releasePath: "/releases/salieris-hands"
  },
  {
    id: "salieri-hoodie",
    slug: "salieri-hoodie",
    name: "Salieri Hoodie",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Apparel",
    description: "Premium hoodie for Salieri's Hands.",
    images: ["/assets/images/salieris-hands/salieri-hoodie-mockup.jpg"],
    priceCents: 11900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    productPath: "/store/salieri-hoodie",
    releasePath: "/releases/salieris-hands"
  },
  {
    id: "salieri-tee",
    slug: "salieri-tee",
    name: "Salieri Tee",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Apparel",
    description: "Official tee for Salieri's Hands.",
    images: ["/assets/images/salieris-hands/salieri-tee-mockup.jpg"],
    priceCents: 5900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL", "2XL"],
    productPath: "/store/salieri-tee",
    releasePath: "/releases/salieris-hands"
  },
  {
    id: "salieri-mug",
    slug: "salieri-mug",
    name: "Salieri Mug",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Accessories",
    description: "Official mug for Salieri's Hands.",
    images: ["/assets/images/salieris-hands/salieri-mug-mockup.jpg"],
    priceCents: 3900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/salieri-mug",
    releasePath: "/releases/salieris-hands"
  },
  {
    id: "salieri-poster",
    slug: "salieri-poster",
    name: "Salieri Poster",
    subtitle: "SALIERI'S HANDS",
    project: "SALIERI'S HANDS",
    projectSlug: "salieris-hands",
    category: "Print",
    description: "Official poster for Salieri's Hands.",
    images: ["/assets/images/salieris-hands/salieri-poster-mockup.jpg"],
    priceCents: 4900,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/salieri-poster",
    releasePath: "/releases/salieris-hands"
  },
  // ==========================================
  // HISTORICAL KAMDRIDI STORE (13 items)
  // ==========================================
  {
    id: "war-machines-collector-artifact",
    slug: "war-machines-collector-artifact",
    name: "Echoes Unearthed - War Machines Collector Artifact",
    subtitle: "WAR MACHINES",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Collector Bundle",
    description: "Extremely limited collector bundle. No restock.",
    images: ["/assets/images/releases/war-machines-cover.png"],
    priceCents: 16500,
    currency: "CAD",
    saleMode: "buy_now",
    visible: false,
    checkoutEnabled: false,
    fulfillmentMode: "manual_preorder",
    requiresShipping: true,
    badge: "EXTREMELY LIMITED",
    productPath: "/store/war-machines-collector-artifact",
    releasePath: "/store"
  },
  {
    id: "the-gilded-null-license",
    slug: "the-gilded-null-license",
    name: "The Gilded Null - Protocol License",
    subtitle: "ACCESS KEY",
    project: "KAMDRIDI CORE",
    projectSlug: "kamdridi-core",
    category: "Digital Access",
    description: "Browser game access for The Gilded Null outside the Fan Club membership path.",
    images: ["/official-game-poster.png"],
    priceCents: 1900,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "game_access",
    requiresShipping: false,
    productPath: "/store/the-gilded-null-license",
    releasePath: "/store"
  },
  {
    id: "vault-sequence-license",
    slug: "vault-sequence-license",
    name: "Vault Sequence - Chapter II License",
    subtitle: "ACCESS KEY",
    project: "KAMDRIDI CORE",
    projectSlug: "kamdridi-core",
    category: "Digital Access",
    description: "Chapter II browser access for Vault Sequence outside the Fan Club path.",
    images: ["/assets/images/games/vault-sequence-poster.png"],
    priceCents: 2900,
    currency: "CAD",
    saleMode: "digital",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "game_access",
    requiresShipping: false,
    productPath: "/store/vault-sequence-license",
    releasePath: "/store"
  },
  {
    id: "kamdridi-gold-logo-tee",
    slug: "kamdridi-gold-logo-tee",
    name: "KAMDRIDI Gold Logo Tee",
    subtitle: "ESSENTIALS",
    project: "KAMDRIDI CORE",
    projectSlug: "kamdridi-core",
    category: "Apparel",
    description: "Black tee with the glowing gold KAMDRIDI logo across the chest.",
    images: ["/store/merch/gold-logo-tee-glow.png"],
    priceCents: 5200,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Core Drop",
    productPath: "/store/kamdridi-gold-logo-tee",
    releasePath: "/store"
  },
  {
    id: "kamdridi-gold-logo-hoodie",
    slug: "kamdridi-gold-logo-hoodie",
    name: "KAMDRIDI Gold Logo Hoodie",
    subtitle: "ESSENTIALS",
    project: "KAMDRIDI CORE",
    projectSlug: "kamdridi-core",
    category: "Apparel",
    description: "Heavy black hoodie with the gold KAMDRIDI logo in the essentials capsule.",
    images: ["/store/merch/logo-essentials-grid.png"],
    priceCents: 8400,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    colors: ["Black"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    productPath: "/store/kamdridi-gold-logo-hoodie",
    releasePath: "/store"
  },
  {
    id: "kamdridi-logo-snapback",
    slug: "kamdridi-logo-snapback",
    name: "KAMDRIDI Logo Snapback",
    subtitle: "ESSENTIALS",
    project: "KAMDRIDI CORE",
    projectSlug: "kamdridi-core",
    category: "Accessories",
    description: "Black snapback with the gold KAMDRIDI logo and matching underside sticker.",
    images: ["/store/merch/logo-essentials-grid.png"],
    priceCents: 8000,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    colors: ["Black"],
    sizes: ["One size"],
    productPath: "/store/kamdridi-logo-snapback",
    releasePath: "/store"
  },
  {
    id: "kamdridi-logo-mug",
    slug: "kamdridi-logo-mug",
    name: "KAMDRIDI Logo Mug",
    subtitle: "ESSENTIALS",
    project: "KAMDRIDI CORE",
    projectSlug: "kamdridi-core",
    category: "Accessories",
    description: "Black ceramic mug from the gold-logo essentials drop.",
    images: ["/store/merch/logo-essentials-grid.png"],
    priceCents: 5600,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/kamdridi-logo-mug",
    releasePath: "/store"
  },
  {
    id: "kamdridi-logo-keychain",
    slug: "kamdridi-logo-keychain",
    name: "KAMDRIDI Boxed Logo Keychain",
    subtitle: "ESSENTIALS",
    project: "KAMDRIDI CORE",
    projectSlug: "kamdridi-core",
    category: "Accessories",
    description: "Premium black-and-gold KAMDRIDI logo keychain presented in a collector box.",
    images: ["/store/merch/logo-essentials-grid.png"],
    priceCents: 3600,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    badge: "Boxed Accessory",
    productPath: "/store/kamdridi-logo-keychain",
    releasePath: "/store"
  },
  {
    id: "echoes-unearthed-crest-tee",
    slug: "echoes-unearthed-crest-tee",
    name: "Echoes Unearthed Crest Tee",
    subtitle: "ECHOES UNEARTHED",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Apparel",
    description: "Front-print crest tee from the Echoes Unearthed capsule in black or white.",
    images: ["/store/merch/echoes-crest-tee-duo.png"],
    priceCents: 5200,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Echoes Capsule",
    productPath: "/store/echoes-unearthed-crest-tee",
    releasePath: "/store"
  },
  {
    id: "echoes-unearthed-wordmark-tee",
    slug: "echoes-unearthed-wordmark-tee",
    name: "KAM DRIDI / Echoes Unearthed Wordmark Tee",
    subtitle: "ECHOES UNEARTHED",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Apparel",
    description: "Clean front-print wordmark tee pairing the KAM DRIDI mark with the Echoes Unearthed title.",
    images: ["/store/merch/echoes-wordmark-tee-duo.png"],
    priceCents: 5200,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Echoes Capsule",
    productPath: "/store/echoes-unearthed-wordmark-tee",
    releasePath: "/store"
  },
  {
    id: "signal-target-tee-collection",
    slug: "signal-target-tee-collection",
    name: "Signal Target Capsule",
    subtitle: "ECHOES UNEARTHED",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Capsule",
    description: "Multi-look tee capsule built around the signal target symbol.",
    images: ["/store/merch/signal-target-collection.png"],
    priceCents: 5200,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "made_to_order",
    requiresShipping: true,
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Made to order",
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    productPath: "/store/signal-target-tee-collection",
    releasePath: "/store"
  },
  {
    id: "war-machines-mini-poster",
    slug: "war-machines-mini-poster",
    name: "War Machines Mini Poster",
    subtitle: "ECHOES UNEARTHED",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Print",
    description: "Gloss mini poster built from the official War Machines single cover.",
    images: ["/assets/images/releases/war-machines-cover.png"],
    priceCents: 3400,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    badge: "Single Art Print",
    productPath: "/store/war-machines-mini-poster",
    releasePath: "/store"
  },
  {
    id: "official-tee-picture",
    slug: "official-tee-picture",
    name: "Echoes Unearthed Excavation Tee",
    subtitle: "ECHOES UNEARTHED",
    project: "ECHOES UNEARTHED",
    projectSlug: "echoes-unearthed",
    category: "Collector Apparel",
    description: "Collector apparel variant pairing excavation artwork on black with a reverse wordmark.",
    images: ["/store/merch/official-tee-picture.png"],
    priceCents: 5200,
    currency: "CAD",
    saleMode: "buy_now",
    visible: true,
    checkoutEnabled: true,
    fulfillmentMode: "printful",
    requiresShipping: true,
    fulfillmentNote: "Made to order after payment. Please allow several weeks for production and delivery.",
    colors: ["Black", "White"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    badge: "Collector Variant",
    productPath: "/store/official-tee-picture",
    releasePath: "/store"
  }
];

export function getCommerceProductById(id: string): CommerceProduct | undefined {
  return commerceProducts.find((p) => p.id === id);
}

export function getCommerceProductBySlug(slug: string): CommerceProduct | undefined {
  return commerceProducts.find((p) => p.slug === slug);
}

export function getVisibleCommerceProducts(): CommerceProduct[] {
  return commerceProducts.filter((p) => p.visible);
}

export type RawCheckoutItem = {
  id: string;
  quantity: number;
  color?: string;
  size?: string;
  format?: string;
};

export type ResolvedCheckoutItem = {
  product: CommerceProduct;
  quantity: number;
  color?: string;
  size?: string;
  format?: string;
};

export function resolveCommerceCheckoutItems(items: RawCheckoutItem[]): ResolvedCheckoutItem[] {
  const resolved: ResolvedCheckoutItem[] = [];

  for (const item of items) {
    const product = getCommerceProductById(item.id);
    if (
      !product ||
      !product.visible ||
      !product.checkoutEnabled ||
      product.saleMode === "sold_out" ||
      product.saleMode === "coming_soon"
    ) {
      throw new Error(`UNKNOWN_PRODUCT`);
    }

    // Variantes
    let validColor = item.color;
    if (product.colors && product.colors.length > 0) {
      if (validColor && !product.colors.includes(validColor)) {
        throw new Error(`INVALID_COLOR`);
      }
      validColor = validColor || product.colors[0];
    } else {
      validColor = undefined;
    }

    let validSize = item.size;
    if (product.sizes && product.sizes.length > 0) {
      if (validSize && !product.sizes.includes(validSize)) {
        throw new Error(`INVALID_SIZE`);
      }
      validSize = validSize || product.sizes[0];
    } else {
      validSize = undefined;
    }

    let validFormat = item.format;
    if (product.formats && product.formats.length > 0) {
      if (validFormat && !product.formats.includes(validFormat)) {
        throw new Error(`INVALID_FORMAT`);
      }
      validFormat = validFormat || product.formats[0];
    } else {
      validFormat = undefined;
    }

    // Limit quantity
    let quantity = Math.floor(Number(item.quantity) || 1);
    if (quantity < 1) throw new Error(`INVALID_QUANTITY`);
    
    const limit = product.quantityLimit || 20;
    if (quantity > limit) {
      throw new Error(`EXCESSIVE_QUANTITY`);
    }

    resolved.push({
      product,
      quantity,
      color: validColor,
      size: validSize,
      format: validFormat
    });
  }

  return resolved;
}

export function buildCommerceCheckoutPlan(rawItems: RawCheckoutItem[]) {
  const resolvedItems = resolveCommerceCheckoutItems(rawItems);

  let requiresShipping = false;
  let containsPhysical = false;
  let containsDigital = false;
  let containsPreorder = false;
  let checkoutTotal = 0;

  const projects = new Set<string>();

  const lineItems = resolvedItems.map((item) => {
    const product = item.product;

    if (product.requiresShipping) requiresShipping = true;
    if (product.saleMode === "digital") containsDigital = true;
    else containsPhysical = true;
    if (product.saleMode === "preorder") containsPreorder = true;

    projects.add(product.project);
    checkoutTotal += product.priceCents * item.quantity;

    const attributes = [];
    if (item.color) attributes.push(item.color);
    if (item.size) attributes.push(item.size);
    if (item.format) attributes.push(item.format);

    let name = product.name;
    if (product.subtitle) {
      name += ` - ${product.subtitle}`;
    }
    if (attributes.length > 0) {
      name += ` (${attributes.join(", ")})`;
    }

    return {
      price_data: {
        currency: product.currency.toLowerCase(),
        product_data: {
          name,
          images: product.images && product.images.length > 0 ? [product.images[0]] : undefined,
          metadata: {
            productId: product.id,
            fulfillmentMode: product.fulfillmentMode,
            requiresShipping: product.requiresShipping ? "true" : "false",
            color: item.color || "",
            size: item.size || "",
            format: item.format || ""
          }
        },
        unit_amount: product.priceCents
      },
      quantity: item.quantity
    };
  });

  const metadata = {
    orderType: "kamdridi-commerce",
    projects: Array.from(projects).join(","),
    containsPhysical: containsPhysical ? "true" : "false",
    containsPreorder: containsPreorder ? "true" : "false",
    containsDigital: containsDigital ? "true" : "false"
  };

  return {
    resolvedItems,
    lineItems,
    checkoutTotal,
    requiresShipping,
    containsPhysical,
    containsDigital,
    containsPreorder,
    projects: Array.from(projects),
    metadata
  };
}

