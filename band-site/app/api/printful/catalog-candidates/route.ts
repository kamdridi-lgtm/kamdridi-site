import { NextResponse } from "next/server";
import { getPrintfulCatalog } from "@/lib/printful";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type CatalogProduct = {
  id?: number;
  name?: string;
  brand?: string;
  model?: string;
  type?: string;
  variant_count?: number;
};

const groups = {
  tees: [/bella/i, /3001/i, /t-shirt/i, /shirt/i],
  hoodies: [/18500/i, /hoodie/i, /sweatshirt/i],
  hats: [/6089/i, /snapback/i, /cap/i, /hat/i],
  mugs: [/mug/i, /11oz/i, /11 oz/i],
  posters: [/poster/i, /matte/i]
};

function score(product: CatalogProduct, patterns: RegExp[]) {
  const haystack = [product.name, product.brand, product.model, product.type].filter(Boolean).join(" ");
  return patterns.reduce((total, pattern) => total + (pattern.test(haystack) ? 1 : 0), 0);
}

export async function GET() {
  try {
    const payload = (await getPrintfulCatalog()) as { result?: CatalogProduct[]; data?: CatalogProduct[] };
    const products = Array.isArray(payload.result)
      ? payload.result
      : Array.isArray(payload.data)
        ? payload.data
        : [];

    const candidates = Object.fromEntries(
      Object.entries(groups).map(([group, patterns]) => {
        const matches = products
          .map((product) => ({ ...product, score: score(product, patterns) }))
          .filter((product) => product.score > 0)
          .sort((a, b) => b.score - a.score || String(a.name ?? "").localeCompare(String(b.name ?? "")))
          .slice(0, 15)
          .map(({ id, name, brand, model, type, variant_count, score }) => ({
            id,
            name,
            brand,
            model,
            type,
            variantCount: variant_count,
            score
          }));
        return [group, matches];
      })
    );

    return NextResponse.json(
      { ok: true, candidates },
      {
        headers: {
          "Cache-Control": "no-store, max-age=0",
          "X-Robots-Tag": "noindex, nofollow"
        }
      }
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Printful catalog lookup failed." },
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
