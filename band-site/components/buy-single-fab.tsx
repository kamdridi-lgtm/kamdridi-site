"use client";

import { useState } from "react";
import { ShoppingBag } from "lucide-react";

export function BuySingleFab() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function buyNow() {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [
            {
              id: "our-lost-dreams-digital-single",
              quantity: 1
            }
          ],
          returnPath: "/"
        })
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || typeof payload.url !== "string") {
        throw new Error(payload.error || "Checkout unavailable.");
      }

      const checkoutUrl = new URL(payload.url, window.location.origin);
      if (checkoutUrl.protocol !== "https:" && checkoutUrl.origin !== window.location.origin) {
        throw new Error("Invalid checkout destination.");
      }

      window.location.assign(checkoutUrl.toString());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout unavailable.");
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-24 right-4 z-[70] flex flex-col items-end gap-2 sm:bottom-6 sm:right-6">
      {error ? (
        <div className="max-w-[220px] rounded-xl border border-red-500/30 bg-black/90 px-3 py-2 text-[11px] leading-4 text-red-100 shadow-2xl">
          {error}
        </div>
      ) : null}

      <button
        type="button"
        onClick={buyNow}
        disabled={loading}
        aria-label="Buy OUR LOST DREAMS for 2.99 Canadian dollars"
        title="Buy OUR LOST DREAMS · CA$2.99"
        className="group flex h-24 w-24 flex-col items-center justify-center rounded-full border border-[#f4c66a]/70 bg-[radial-gradient(circle_at_35%_25%,#f7c66f,#b85d12_45%,#5a2308_100%)] text-center text-black shadow-[0_0_0_5px_rgba(0,0,0,0.35),0_18px_50px_rgba(212,103,23,0.42)] transition duration-300 hover:-translate-y-1 hover:scale-[1.03] hover:border-[#ffe2a5] disabled:cursor-wait disabled:opacity-70 sm:h-28 sm:w-28"
      >
        <ShoppingBag className="mb-1 h-5 w-5" />
        <span className="text-[10px] font-black uppercase leading-tight tracking-[0.12em]">
          {loading ? "Opening..." : "Buy Single"}
        </span>
        <span className="mt-1 text-[13px] font-black">CA$2.99</span>
      </button>
    </div>
  );
}
