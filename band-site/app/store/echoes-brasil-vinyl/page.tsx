import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EchoesBrasilProductPage from "@/components/echoes-brasil-product-page";
import { getUnifiedCommerceProducts } from "@/lib/unified-commerce";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ECHOES UN LIVE IN BRASIL - Collector Vinyl Edition",
  description: "Edição de colecionador em vinil preto de 12 polegadas, produzida sob encomenda."
};

const includedItems = [
  "12-inch black vinyl",
  "Full-color jacket and labels",
  "Made-to-order collector edition"
] as const;

export default async function BrasilVinylPage() {
  const products = await getUnifiedCommerceProducts();
  const product = products.find((item) => item.id === "echoes-brasil-vinyl-2026" && item.visible);
  if (!product) notFound();

  return <EchoesBrasilProductPage product={product} includedItems={[...includedItems]} />;
}
