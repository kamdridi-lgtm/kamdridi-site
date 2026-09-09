"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const CATALOG_URL = "https://retoydsgsuvznlpsguts.supabase.co/functions/v1/commerce-catalog";

type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  description: string;
  images?: string[] | null;
  price_cents: number;
  currency: string;
  sale_mode: string;
  visible: boolean;
  checkout_enabled: boolean;
  fulfillment_mode: string;
  colors?: string[] | null;
  sizes?: string[] | null;
};

function money(cents: number, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: currency.toUpperCase()
  }).format(cents / 100);
}

export default function DirectMerchProductPage() {
  const params = useParams<{ slug: string }>();
  const slug = decodeURIComponent(String(params?.slug || ""));
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    void fetch(CATALOG_URL, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Store catalog is temporarily unavailable.");
        const payload = await response.json();
        const products = Array.isArray(payload?.products) ? (payload.products as Product[]) : [];
        const match = products.find((item) => item.visible && item.slug === slug);
        if (!match) throw new Error("This product could not be found.");
        if (!cancelled) setProduct(match);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load this product.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const sizes = useMemo(() => product?.sizes?.filter(Boolean) || [], [product]);
  const colors = useMemo(() => product?.colors?.filter(Boolean) || [], [product]);
  const needsSize = sizes.length > 0;
  const needsColor = colors.length > 0;
  const canBuy = Boolean(
    product &&
    product.checkout_enabled &&
    product.sale_mode !== "sold_out" &&
    product.sale_mode !== "coming_soon" &&
    (!needsSize || selectedSize) &&
    (!needsColor || selectedColor)
  );

  async function buyNow() {
    if (!product || !canBuy || checkoutLoading) return;
    setCheckoutLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              id: product.id,
              quantity: 1,
              size: selectedSize || undefined,
              color: selectedColor || undefined
            }
          ],
          returnPath: `/store/${product.slug}`
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Unable to start secure checkout.");
      }
      window.location.href = payload.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to start secure checkout.");
      setCheckoutLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050403] px-5 py-12 text-white md:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link href="/store" className="text-xs font-bold uppercase tracking-[0.22em] text-stone-400 hover:text-[#f4c66a]">
            ← Store
          </Link>
          <span className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#f4c66a]">
            Official KAM DRIDI merch
          </span>
        </div>

        {loading && (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-stone-300">Loading product…</div>
        )}

        {!loading && error && !product && (
          <div className="rounded-3xl border border-red-500/25 bg-red-500/[0.06] p-8">
            <h1 className="text-2xl font-bold">Product unavailable</h1>
            <p className="mt-3 text-stone-300">{error}</p>
            <Link href="/store" className="mt-6 inline-flex rounded-full bg-[#f4c66a] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-black">
              Back to store
            </Link>
          </div>
        )}

        {product && (
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-black">
              {product.images?.[0] ? (
                <img src={product.images[0]} alt={product.name} className="aspect-square h-full w-full object-cover" />
              ) : (
                <div className="aspect-square bg-white/[0.03]" />
              )}
            </div>

            <section>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-[#f4c66a]">Buy direct</p>
              <h1 className="mt-3 font-display text-4xl uppercase leading-tight tracking-[0.04em] md:text-5xl">{product.name}</h1>
              {product.subtitle && <p className="mt-3 text-sm uppercase tracking-[0.18em] text-stone-400">{product.subtitle}</p>}
              <p className="mt-7 text-3xl font-bold text-[#f4c66a]">{money(product.price_cents, product.currency)}</p>
              <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-300">{product.description}</p>

              {needsColor && (
                <div className="mt-8">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Choose color</p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${selectedColor === color ? "border-[#f4c66a] bg-[#f4c66a] text-black" : "border-white/15 bg-white/[0.03] text-stone-300"}`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {needsSize && (
                <div className="mt-8">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-stone-400">Choose size</p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] ${selectedSize === size ? "border-[#f4c66a] bg-[#f4c66a] text-black" : "border-white/15 bg-white/[0.03] text-stone-300"}`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {error && <p className="mt-6 rounded-xl border border-red-500/25 bg-red-500/[0.06] p-4 text-sm text-red-200">{error}</p>}

              <button
                type="button"
                onClick={buyNow}
                disabled={!canBuy || checkoutLoading}
                className="mt-9 w-full rounded-full bg-[#f4c66a] px-6 py-5 text-sm font-black uppercase tracking-[0.22em] text-black transition hover:bg-[#ffd989] disabled:cursor-not-allowed disabled:opacity-40"
              >
                {checkoutLoading ? "Opening secure checkout…" : "Buy now — secure Stripe checkout"}
              </button>

              {(needsSize && !selectedSize) || (needsColor && !selectedColor) ? (
                <p className="mt-3 text-center text-xs text-stone-500">Choose the required variant above, then checkout opens directly in Stripe.</p>
              ) : (
                <p className="mt-3 text-center text-xs text-stone-500">One product. One checkout. No store search required.</p>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
