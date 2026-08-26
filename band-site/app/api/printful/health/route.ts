import { NextResponse } from "next/server";
import { getPrintfulCatalog, getPrintfulStores } from "@/lib/printful";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const stores = await getPrintfulStores();
  const catalog = await getPrintfulCatalog();

  const storesOk = !stores || typeof stores !== "object" ? false : !("error" in stores);
  const catalogOk = !catalog || typeof catalog !== "object" ? false : !("error" in catalog);

  const storeCount = storesOk && Array.isArray((stores as any).result)
    ? (stores as any).result.length
    : storesOk && Array.isArray((stores as any).data)
      ? (stores as any).data.length
      : null;

  const catalogCount = catalogOk && Array.isArray((catalog as any).result)
    ? (catalog as any).result.length
    : catalogOk && Array.isArray((catalog as any).data)
      ? (catalog as any).data.length
      : null;

  return NextResponse.json(
    {
      configured: storesOk || catalogOk,
      printful: {
        storesReachable: storesOk,
        catalogReachable: catalogOk,
        storeCount,
        catalogCount
      }
    },
    {
      status: storesOk || catalogOk ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow"
      }
    }
  );
}
