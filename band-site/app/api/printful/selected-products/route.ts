import { NextResponse } from "next/server";
import { getPrintfulCatalog, getPrintfulProduct } from "@/lib/printful";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const selected = [71, 146, 300, 19, 1] as const;

export async function GET() {
  try {
    const payload = (await getPrintfulCatalog()) as { result?: Array<Record<string, unknown>>; data?: Array<Record<string, unknown>> };
    const products = Array.isArray(payload.result) ? payload.result : Array.isArray(payload.data) ? payload.data : [];

    const hatMatches = products
      .filter((product) => {
        const text = [product.name, product.brand, product.model, product.type].filter(Boolean).join(" ").toLowerCase();
        return text.includes("yupoong") || text.includes("flexfit") || text.includes("snapback") || text.includes("6089");
      })
      .slice(0, 25)
      .map((product) => ({
        id: product.id ?? null,
        name: product.name ?? null,
        brand: product.brand ?? null,
        model: product.model ?? null,
        type: product.type ?? null,
        variantCount: product.variant_count ?? null
      }));

    const details = [];
    for (const id of selected) {
      const detail = (await getPrintfulProduct(id)) as Record<string, unknown>;
      const result = (detail.result ?? detail.data ?? detail) as Record<string, unknown>;
      const variants = Array.isArray(result.variants) ? result.variants : [];
      details.push({
        id,
        product: result.product ?? null,
        variantCount: variants.length,
        variants: variants.slice(0, 40).map((variant) => {
          const v = variant as Record<string, unknown>;
          return {
            id: v.id ?? null,
            name: v.name ?? null,
            size: v.size ?? null,
            color: v.color ?? null,
            colorCode: v.color_code ?? null,
            price: v.price ?? null,
            inStock: v.in_stock ?? null,
            availabilityRegions: v.availability_regions ?? null
          };
        })
      });
    }

    return NextResponse.json(
      { ok: true, selected: details, hatMatches },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Robots-Tag": "noindex, nofollow"
        }
      }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Printful selected product lookup failed." },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Robots-Tag": "noindex, nofollow"
        }
      }
    );
  }
}
