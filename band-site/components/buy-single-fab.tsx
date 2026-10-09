"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function BuySingleFab() {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(true), 36000);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  async function buyNow() {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: "our-lost-dreams-digital-single", quantity: 1 }],
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
    <div className="fixed bottom-4 left-4 z-[80] flex flex-col items-start gap-2 sm:bottom-5 sm:left-5">
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
        className="group relative h-[82px] w-[82px] rounded-full transition duration-300 hover:scale-105 disabled:cursor-wait disabled:opacity-70 sm:h-[96px] sm:w-[96px]"
      >
        <span className="absolute inset-0 rounded-full bg-[#d97a1f]/20 blur-xl transition group-hover:bg-[#ffac45]/30" aria-hidden="true" />
        <Image
          src="/assets/images/buy-single-vinyl.svg"
          alt=""
          fill
          priority
          sizes="96px"
          className="object-contain drop-shadow-[0_14px_24px_rgba(0,0,0,0.7)] animate-[spin_12s_linear_infinite] group-hover:[animation-play-state:paused]"
        />
        {loading ? (
          <span className="absolute inset-0 grid place-items-center rounded-full bg-black/65 text-[9px] font-black uppercase tracking-[0.14em] text-[#ffd48a]">
            Opening
          </span>
        ) : null}
      </button>
    </div>
  );
}
