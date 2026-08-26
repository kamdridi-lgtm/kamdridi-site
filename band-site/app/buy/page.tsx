"use client";

import { useState } from "react";

export default function BuyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function buyNow() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: "our-lost-dreams-digital-single", quantity: 1 }],
          returnPath: "/buy"
        })
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || "Checkout unavailable.");
      }

      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout unavailable.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black px-5 py-10 text-white">
      <section className="mx-auto flex min-h-[78vh] max-w-3xl items-center justify-center">
        <div className="w-full rounded-[30px] border border-white/10 bg-[#0b0b0b] p-7 text-center shadow-2xl sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#f4c66a]">
            Official KAM DRIDI Digital Single
          </p>

          <h1 className="mt-6 text-5xl font-black uppercase leading-none tracking-[0.04em] sm:text-7xl">
            OUR LOST DREAMS
          </h1>

          <p className="mt-5 text-lg text-stone-300">
            Achat numérique officiel / Official digital purchase
          </p>

          <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[#f4c66a]/30 bg-[#f4c66a]/[0.06] p-6">
            <p className="text-sm uppercase tracking-[0.22em] text-stone-400">
              Digital single
            </p>
            <p className="mt-2 text-4xl font-black text-[#f4c66a]">
              $2.99 CAD
            </p>
            <p className="mt-3 text-sm leading-6 text-stone-400">
              Secure Stripe payment • Receipt by email
            </p>
          </div>

          <button
            type="button"
            onClick={buyNow}
            disabled={loading}
            className="mt-8 inline-flex min-h-16 w-full max-w-md items-center justify-center rounded-full bg-[#f4c66a] px-7 py-4 text-sm font-black uppercase tracking-[0.14em] text-black transition hover:bg-[#ffd989] disabled:opacity-70 sm:text-base"
          >
            {loading ? "Opening secure checkout…" : "BUY / ACHETER — $2.99 CAD"}
          </button>

          {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

          <p className="mx-auto mt-6 max-w-lg text-xs leading-6 text-stone-500">
            One real purchase = one official digital music sale. Payment is processed securely by Stripe.
          </p>
        </div>
      </section>
    </main>
  );
}
