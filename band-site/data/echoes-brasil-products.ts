export type EchoesDraftProduct = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  images: string[];
  includedItems: string[];
  category: string;
  project: string;
  active: boolean;
  visible: boolean;
  priceCents: number | null;
  currency: string | null;
  stripePriceId: string | null;
  inventoryStatus: "unconfirmed" | "in_stock" | "preorder" | "sold_out";
};

export const echoesDraftProducts: EchoesDraftProduct[] = [
  {
    id: "echoes-brasil-expanded-2026",
    slug: "echoes-brasil-expanded",
    title: "ECHOES UN LIVE IN BRASIL",
    subtitle: "Expanded Edition",
    description:
      "Apresentação refinada do álbum com visual principal, faixas bônus incluídas e pedido direto.",
    images: ["/echoes-un-live-in-brasil/assets/images/edition-expanded.webp"],
    includedItems: ["Versão padrão + bônus"],
    category: "Physical Music",
    project: "ECHOES UN LIVE IN BRASIL",
    active: false,
    visible: false,
    priceCents: null,
    currency: null,
    stripePriceId: null,
    inventoryStatus: "unconfirmed"
  },
  {
    id: "echoes-brasil-livreto-2026",
    slug: "echoes-brasil-livreto",
    title: "ECHOES UN LIVE IN BRASIL",
    subtitle: "Collector Booklet",
    description:
      "Páginas internas com imagens ao vivo, créditos e o universo visual da Edição Expandida.",
    images: ["/echoes-un-live-in-brasil/assets/images/edition-livret.webp"],
    includedItems: ["Livreto de colecionador"],
    category: "Collector Item",
    project: "ECHOES UN LIVE IN BRASIL",
    active: false,
    visible: false,
    priceCents: null,
    currency: null,
    stripePriceId: null,
    inventoryStatus: "unconfirmed"
  },
  {
    id: "echoes-brasil-deluxe-2026",
    slug: "echoes-brasil-deluxe",
    title: "ECHOES UN LIVE IN BRASIL",
    subtitle: "Deluxe Edition",
    description:
      "Apresentação de coleção com estojo premium, disco preto e cartão da edição.",
    images: ["/echoes-un-live-in-brasil/assets/images/edition-deluxe.webp"],
    includedItems: ["Box deluxe + vinil"],
    category: "Physical Music",
    project: "ECHOES UN LIVE IN BRASIL",
    active: false,
    visible: false,
    priceCents: null,
    currency: null,
    stripePriceId: null,
    inventoryStatus: "unconfirmed"
  }
];
