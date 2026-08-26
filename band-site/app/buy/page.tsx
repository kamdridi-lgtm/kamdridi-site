"use client";

import Link from "next/link";
import { useState } from "react";

export default function BuyOurLostDreamsPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/buy-our-lost-dreams", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const payload = await response.json();

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "Checkout unavailable.");
      }

      window.location.assign(payload.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout unavailable.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-12 text-white">
      <section className="mx-auto flex min-h-[82vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[28px] border border-white/10 bg-[#0b0b0b] p-7 text-center shadow-2xl sm:p-10 md:p-14">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f4c66a]">
            Official KAM DRIDI Digital Single
          </p>

          <h1 className="mt-6 font-display text-5xl uppercase leading-none tracking-[0.05em] sm:text-6xl md:text-7xl">
            OUR LOST DREAMS
          </h1>

          <p className="mt-5 text-base leading-7 text-stone-300 sm:text-lg">
            Achat numérique officiel / Official digital purchase
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#f4c66a]/35 bg-[#f4c66a]/[0.06] px-6 py-6">
            <p className="text-sm uppercase tracking-[0.22em] text-stone-400">
              Digital single
            </p>
            <p className="mt-2 text-4xl font-black text-[#f4c66a]">
              $2.99 CAD
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              One song • Secure Stripe payment • Receipt by email
            </p>
          </div>

          <button
            type="button"
            onClick={startCheckout}
            disabled={loading}
            className="mt-8 inline-flex min-h-16 w-full max-w-md items-center justify-center rounded-full bg-[#f4c66a] px-7 py-4 text-sm font-black uppercase tracking-[0.16em] text-black transition hover:bg-[#ffd989] disabled:cursor-wait disabled:opacity-70 sm:text-base"
          >
            {loading ? "Opening secure checkout…" : "BUY / ACHETER — $2.99 CAD"}
          </button>

          {error ? (
            <p className="mx-auto mt-4 max-w-md text-sm text-red-300">{error}</p>
          ) : null}

          <p className="mx-auto mt-6 max-w-lg text-xs leading-6 text-stone-500">
            After payment, the digital copy will be sent to the email used at checkout.
            ISRC: QZZ7M2627617.
          </p>

          <div className="mt-7">
            <Link
              href="/our-lost-dreams"
              className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              Listen / Écouter
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
