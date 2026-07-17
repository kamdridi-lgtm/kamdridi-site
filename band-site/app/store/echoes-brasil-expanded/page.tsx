import { Metadata } from "next";
import { echoesDraftProducts } from "@/data/echoes-brasil-products";
import EchoesBrasilProductPage from "@/components/echoes-brasil-product-page";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "ECHOES UN LIVE IN BRASIL - Expanded Edition",
  description: "Apresentação refinada do álbum com visual principal, faixas bônus incluídas e pedido direto.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ExpandedEditionPage() {
  const product = echoesDraftProducts.find((p) => p.slug === "echoes-brasil-expanded");
  if (!product) notFound();

  return <EchoesBrasilProductPage product={product} />;
}
