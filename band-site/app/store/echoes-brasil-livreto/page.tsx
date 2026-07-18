import { Metadata } from "next";
import { echoesDraftProducts } from "@/data/echoes-brasil-products";
import EchoesBrasilProductPage from "@/components/echoes-brasil-product-page";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "ECHOES UN LIVE IN BRASIL - Collector Booklet",
  description: "Páginas internas com imagens ao vivo, créditos e o universo visual da Edição Expandida.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LivretoPage() {
  const product = echoesDraftProducts.find((p) => p.slug === "echoes-brasil-livreto");
  if (!product) notFound();

  return <EchoesBrasilProductPage product={product} />;
}
