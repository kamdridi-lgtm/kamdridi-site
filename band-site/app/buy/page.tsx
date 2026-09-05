"use client";

import { useEffect, useState } from "react";

export default function BuyPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [salesCount, setSalesCount] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    fetch("https://retoydsgsuvznlpsguts.supabase.co/functions/v1/sales-goal", {
      cache: "no-store"
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (active && typeof data?.count === "number") {
          setSalesCount(data.count);
        }
      })
      .catch(() => {
        // Promotional counter only; checkout remains available if it cannot load.
      });

    return () => {
      active = false;
    };
  }, []);

  async function startCheckout() {
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
    <main className="relative min-h-[900px] overflow-hidden bg-black text-white">
      <div
        className="absolute inset-0 bg-black"
        style={{
          backgroundImage: "url('/images/our-lost-dreams-bg.jpg')",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          backgroundSize: "auto 100%"
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,.94)_0%,rgba(0,0,0,.84)_40%,rgba(0,0,0,.34)_68%,rgba(0,0,0,.48)_100%)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,.40)_0%,rgba(0,0,0,.08)_45%,rgba(0,0,0,.72)_100%)]"
        aria-hidden="true"
      />

      <section className="relative z-10 mx-auto flex min-h-[900px] max-w-7xl items-center px-5 py-12 sm:px-8 lg:px-12">
        <div className="w-full max-w-xl rounded-[30px] border border-[#d6a83f]/45 bg-black/80 p-6 shadow-[0_30px_100px_rgba(0,0,0,.65)] backdrop-blur-md sm:p-8 lg:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#f4c66a]">
            SPECIAL 2-FOR-1 BUNDLE · OFFRE 2 POUR 1
          </p>

          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.92] tracking-[0.02em] text-[#f7f0e5] sm:text-6xl">
            OUR LOST
            <br />
            DREAMS
          </h1>

          <p className="mt-4 text-sm leading-6 text-stone-300 sm:text-base">
            Deux versions. Un seul prix. La version officielle de l&apos;album <strong className="text-white">ECHOES UNEARTHED</strong> + la nouvelle <strong className="text-white">Three-Guitar Acoustic Version</strong> en bonus.
          </p>

          <div className="mt-6 rounded-2xl border border-[#f4c66a]/55 bg-[#17130d]/90 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f4c66a]">YOU GET BOTH · TU REÇOIS LES DEUX</p>
            <div className="mt-4 space-y-3 text-sm text-stone-200">
              <p><strong className="text-white">01 — OUR LOST DREAMS</strong><br /><span className="text-stone-400">Official album version · HD WAV 24-bit / 48 kHz</span></p>
              <p><strong className="text-white">02 — OUR LOST DREAMS</strong><br /><span className="text-stone-400">Three-Guitar Acoustic Version · exclusive bonus · WAV 24-bit / 48 kHz</span></p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#f4c66a]/45 bg-black/60 p-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f4c66a]">
                  First 10 direct music sales
                </p>
                <p className="mt-2 text-sm text-stone-300">
                  Help KAM DRIDI reach the first 10 direct sales of OUR LOST DREAMS.
                </p>
              </div>
              <p className="shrink-0 text-3xl font-black text-white">
                {salesCount ?? 1}<span className="text-stone-500"> / 10</span>
              </p>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[#f4c66a] transition-all duration-700"
                style={{ width: `${Math.min(((salesCount ?? 1) / 10) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="mt-7 rounded-2xl border border-[#d6a83f]/35 bg-[#17130d]/90 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-stone-400">
              SPECIAL 2-FOR-1 DIGITAL BUNDLE
            </p>
            <p className="mt-2 text-4xl font-black text-[#f4c66a]">$2.99 CAD</p>
            <p className="mt-2 text-sm font-bold text-white">ONE PURCHASE · TWO FULL VERSIONS</p>
            <p className="mt-2 text-xs text-stone-400">
              Secure Stripe payment · Both versions included with purchase
            </p>

            <button
              type="button"
              onClick={startCheckout}
              disabled={loading}
              className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#f4c66a] px-6 py-4 text-sm font-black uppercase tracking-[0.13em] text-black transition hover:bg-[#ffd989] disabled:cursor-wait disabled:opacity-70"
            >
              {loading ? "Opening secure checkout…" : "GET BOTH / LES DEUX — $2.99 CAD"}
            </button>
          </div>

          <div className="mt-6 rounded-2xl border border-[#f4c66a]/35 bg-black/65 p-5">
            <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#f4c66a]">
              NEW EXCLUSIVE BONUS · THREE GUITARS
            </p>
            <h2 className="mt-2 text-xl font-black uppercase text-white">
              OUR LOST DREAMS — Three-Guitar Acoustic Version
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-300">
              The new 24-bit / 48 kHz acoustic master is included only as part of this special 2-for-1 purchase. It is no longer offered here as a free public preview.
            </p>
            <div className="mt-4 rounded-xl border border-[#f4c66a]/25 bg-[#f4c66a]/[0.06] px-4 py-3 text-center text-xs font-black uppercase tracking-[0.13em] text-[#f4c66a]">
              INCLUDED WITH PURCHASE · INCLUS AVEC L&apos;ACHAT
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-white/10 bg-black/55 px-5 py-4 text-sm leading-6 text-stone-300">
            Special direct-sale bundle: official album version + exclusive Three-Guitar Acoustic Version for <strong className="text-white">$2.99 CAD total</strong>.
          </div>

          {error ? (
            <p className="mt-4 rounded-xl border border-red-400/20 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-white/10 bg-black/45 px-2 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white">2 FOR 1</p>
              <p className="mt-1 text-[10px] text-stone-500">Two versions</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/45 px-2 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white">2 HD WAVs</p>
              <p className="mt-1 text-[10px] text-stone-500">24-bit / 48 kHz</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/45 px-2 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white">Official</p>
              <p className="mt-1 text-[10px] text-stone-500">Direct from KAM DRIDI</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
