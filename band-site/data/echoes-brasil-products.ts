import { getVisibleCommerceProducts } from "./commerce-products";

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

const echoesCommerceProducts = getVisibleCommerceProducts().filter(p => p.projectSlug === "echoes-un-live-in-brasil");

export const echoesDraftProducts: EchoesDraftProduct[] = echoesCommerceProducts.map(p => {
  let includedItems: string[] = [];
  if (p.slug === "echoes-brasil-expanded") {
    includedItems = ["Versão padrão + bônus"];
  } else if (p.slug === "echoes-brasil-livreto") {
    includedItems = ["Livreto de colecionador"];
  } else if (p.slug === "echoes-brasil-deluxe") {
    includedItems = ["Box deluxe + vinil"];
  }

  return {
    id: p.id,
    slug: p.slug,
    title: p.name,
    subtitle: p.subtitle,
    description: p.description,
    images: [...p.images],
    includedItems,
    category: p.category,
    project: p.project,
    active: true,
    visible: p.visible,
    priceCents: p.priceCents,
    currency: p.currency,
    stripePriceId: null,
    inventoryStatus: p.saleMode === "preorder" ? "preorder" : "unconfirmed"
  };
});
