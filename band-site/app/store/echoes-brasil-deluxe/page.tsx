import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EchoesBrasilProductPage from "@/components/echoes-brasil-product-page";
import { getUnifiedCommerceProducts } from "@/lib/unified-commerce";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ECHOES UN LIVE IN BRASIL - Deluxe Edition",
  description: "Apresentação de coleção com estojo premium, disco preto e cartão da edição.",
};

const includedItems = [
  "Premium case",
  "Black disc",
  "Edition card"
] as const;

export default async function DeluxeEditionPage() {
  const products = await getUnifiedCommerceProducts();
  const product = products.find((item) => item.id === "echoes-brasil-deluxe-2026" && item.visible);
  if (!product) notFound();

  return <EchoesBrasilProductPage product={product} includedItems={[...includedItems]} />;
}
