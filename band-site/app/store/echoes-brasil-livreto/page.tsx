import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EchoesBrasilProductPage from "@/components/echoes-brasil-product-page";
import { getUnifiedCommerceProducts } from "@/lib/unified-commerce";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ECHOES UN LIVE IN BRASIL - Collector Booklet",
  description: "Páginas internas com imagens ao vivo, créditos e o universo visual da Edição Expandida.",
};

const includedItems = [
  "16-page collector booklet",
  "4.75 × 4.75 in square format",
  "Full-color saddle-stitched presentation"
] as const;

export default async function LivretoPage() {
  const products = await getUnifiedCommerceProducts();
  const product = products.find((item) => item.id === "echoes-brasil-livreto-2026" && item.visible);
  if (!product) notFound();

  return <EchoesBrasilProductPage product={product} includedItems={[...includedItems]} />;
}
