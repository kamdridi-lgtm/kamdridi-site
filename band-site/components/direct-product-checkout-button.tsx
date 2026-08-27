"use client";

import { LoaderCircle, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

const REMOTE_CATALOG_URL =
  "https://retoydsgsuvznlpsguts.supabase.co/functions/v1/commerce-catalog";

export function DirectProductCheckoutButton({
  productId,
  label,
  returnPath,
  className = ""
}: {
  productId: string;
  label: string;
  returnPath: string;
  className?: string;
}) {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    void fetch(REMOTE_CATALOG_URL, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Catalog unavailable");
        const payload = await response.json();
        const product = Array.isArray(payload?.products)
          ? payload.products.find((candidate: any) => candidate?.id === productId)
          : null;

        const ready = Boolean(
          product &&
          product.visible &&
          product.checkout_enabled &&
          product.active !== false &&
          product.price_cents > 0 &&
          product.sale_mode !== "sold_out" &&
          product.sale_mode !== "coming_soon"
        );

        if (!cancelled) setEnabled(ready);
      })
      .catch(() => {
        if (!cancelled) setEnabled(false);
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function startCheckout() {
    if (!enabled || loading) return;
    setLoading(true);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: productId, quantity: 1 }],
          returnPath
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || typeof payload.url !== "string") {
        throw new Error(payload.error || "Checkout unavailable");
      }

      window.location.assign(payload.url);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={startCheckout}
      disabled={!enabled || loading}
      className={`inline-flex min-h-12 items-center justify-center gap-2 border border-[#ff4b36] bg-[linear-gradient(180deg,#b81710,#4a0807)] px-5 py-3 text-xs font-black uppercase tracking-[0.16em] text-white shadow-[0_0_28px_rgba(255,31,18,0.24)] transition hover:-translate-y-0.5 hover:border-[#ff735f] disabled:cursor-not-allowed disabled:opacity-45 ${className}`}
    >
      {loading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
      {loading ? "Opening checkout…" : enabled ? label : "Unavailable"}
    </button>
  );
}
