import { Metadata } from "next";
import { echoesDraftProducts } from "@/data/echoes-brasil-products";
import EchoesBrasilProductPage from "@/components/echoes-brasil-product-page";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "ECHOES UN LIVE IN BRASIL - Deluxe Edition",
  description: "Apresentação de coleção com estojo premium, disco preto e cartão da edição.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function DeluxeEditionPage() {
  const product = echoesDraftProducts.find((p) => p.slug === "echoes-brasil-deluxe");
  if (!product) notFound();

  return <EchoesBrasilProductPage product={product} />;
}
