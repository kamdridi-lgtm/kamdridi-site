import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EchoesBrasilProductPage from "@/components/echoes-brasil-product-page";
import { getUnifiedCommerceProducts } from "@/lib/unified-commerce";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "ECHOES UN LIVE IN BRASIL - Expanded Edition",
  description: "Apresentação refinada do álbum com visual principal, faixas bônus incluídas e pedido direto.",
};

const includedItems = [
  "Jewel-case CD presentation",
  "Current 14-track programme including bonus sessions",
  "Full-color disc, insert and tray-card artwork"
] as const;

export default async function ExpandedEditionPage() {
  const products = await getUnifiedCommerceProducts();
  const product = products.find((item) => item.id === "echoes-brasil-expanded-2026" && item.visible);
  if (!product) notFound();

  return <EchoesBrasilProductPage product={product} includedItems={[...includedItems]} />;
}
