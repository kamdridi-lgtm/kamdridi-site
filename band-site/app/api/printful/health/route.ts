import { NextResponse } from "next/server";
import { getPrintfulCatalog, listPrintfulStores } from "@/lib/printful";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  let storesReachable = false;
  let catalogReachable = false;
  let storeCount: number | null = null;
  let catalogCount: number | null = null;

  try {
    const stores = await listPrintfulStores();
    storesReachable = true;
    storeCount = stores.length;
  } catch {
    storesReachable = false;
  }

  try {
    const catalog = await getPrintfulCatalog();
    catalogReachable = true;
    const payload = catalog as { result?: unknown[]; data?: unknown[] };
    if (Array.isArray(payload.result)) catalogCount = payload.result.length;
    else if (Array.isArray(payload.data)) catalogCount = payload.data.length;
  } catch {
    catalogReachable = false;
  }

  const configured = storesReachable || catalogReachable;

  return NextResponse.json(
    {
      configured,
      printful: {
        storesReachable,
        catalogReachable,
        storeCount,
        catalogCount
      }
    },
    {
      status: configured ? 200 : 503,
      headers: {
        "Cache-Control": "no-store, max-age=0",
        "X-Robots-Tag": "noindex, nofollow"
      }
    }
  );
}
