"use client";

import { useState } from "react";

type CheckoutChoice = "digital" | "physical" | null;

export default function BuyPage() {
  const [loading, setLoading] = useState<CheckoutChoice>(null);
  const [error, setError] = useState("");

  async function startCheckout(choice: Exclude<CheckoutChoice, null>) {
    setLoading(choice);
    setError("");

    const items =
      choice === "physical"
        ? [
            { id: "our-lost-dreams-digital-single", quantity: 1 },
            { id: "our-lost-dreams-physical-upgrade", quantity: 1 }
          ]
        : [{ id: "our-lost-dreams-digital-single", quantity: 1 }];

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
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
      setLoading(null);
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
            Official KAM DRIDI Digital Single
          </p>

          <h1 className="mt-5 text-5xl font-black uppercase leading-[0.92] tracking-[0.02em] text-[#f7f0e5] sm:text-6xl">
            OUR LOST
            <br />
            DREAMS
          </h1>

          <p className="mt-4 text-sm text-stone-300 sm:text-base">
            Achat numérique officiel / Official digital purchase
          </p>

          <div className="mt-7 rounded-2xl border border-[#d6a83f]/35 bg-[#17130d]/90 p-5 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.26em] text-stone-400">
              Digital single
            </p>
            <p className="mt-2 text-4xl font-black text-[#f4c66a]">$2.99 CAD</p>
            <p className="mt-2 text-xs text-stone-400">
              Secure Stripe payment • Receipt by email
            </p>

            <button
              type="button"
              onClick={() => startCheckout("digital")}
              disabled={loading !== null}
              className="mt-5 inline-flex min-h-14 w-full items-center justify-center rounded-full bg-[#f4c66a] px-6 py-4 text-sm font-black uppercase tracking-[0.13em] text-black transition hover:bg-[#ffd989] disabled:cursor-wait disabled:opacity-70"
            >
              {loading === "digital"
                ? "Opening secure checkout…"
                : "BUY / ACHETER — $2.99 CAD"}
            </button>
          </div>

          <div className="my-6 flex items-center gap-3" aria-hidden="true">
            <span className="h-px flex-1 bg-[#d6a83f]/35" />
            <span className="text-[#f4c66a]">◆</span>
            <span className="h-px flex-1 bg-[#d6a83f]/35" />
          </div>

          <div className="rounded-2xl border border-[#d6a83f]/45 bg-black/75 p-5 sm:p-6">
            <div className="inline-flex rounded-full bg-[#f4c66a] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">
              Best value
            </div>

            <div className="mt-4 grid gap-5 sm:grid-cols-[180px_1fr] sm:items-center">
              <div className="relative mx-auto h-[170px] w-[180px]">
                <div className="absolute right-0 top-1/2 h-[126px] w-[126px] -translate-y-1/2 rounded-full border border-white/20 bg-[radial-gradient(circle_at_35%_35%,#666_0%,#1a1a1a_22%,#080808_48%,#222_60%,#050505_100%)] shadow-[0_10px_30px_rgba(0,0,0,.55)]" />
                <div className="absolute left-0 top-1/2 z-10 h-[150px] w-[150px] -translate-y-1/2 overflow-hidden rounded-[4px] border border-white/30 bg-black shadow-[0_12px_30px_rgba(0,0,0,.6)]">
                  <img
                    src="/assets/images/our-lost-dreams-cover.jpg"
                    alt="OUR LOST DREAMS physical CD cover"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-black uppercase tracking-[0.07em] text-[#f4c66a]">
                  Want the physical CD too?
                </h2>

                <p className="mt-3 text-base leading-7 text-stone-200">
                  Add the made-to-order physical CD for only{" "}
                  <strong className="text-[#f4c66a]">$8.99 more</strong>.
                </p>

                <div className="mt-4 grid gap-2 text-sm text-stone-300">
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="font-bold text-white">Made to order</span>
                    <span className="mt-1 block text-xs text-stone-400">
                      Physical CD edition
                    </span>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className="font-bold text-white">Home delivery</span>
                    <span className="mt-1 block text-xs text-stone-400">
                      Allow 6–8 weeks
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <p className="mt-5 text-center text-sm text-stone-400">
              Digital + physical total:{" "}
              <strong className="text-white">$11.98 CAD</strong>
            </p>

            <button
              type="button"
              onClick={() => startCheckout("physical")}
              disabled={loading !== null}
              className="mt-4 inline-flex min-h-14 w-full items-center justify-center rounded-full border border-[#f4c66a] bg-[#f4c66a]/10 px-6 py-4 text-sm font-black uppercase tracking-[0.11em] text-[#f4c66a] transition hover:bg-[#f4c66a] hover:text-black disabled:cursor-wait disabled:opacity-70"
            >
              {loading === "physical"
                ? "Opening secure checkout…"
                : "DIGITAL + PHYSICAL — $11.98 CAD"}
            </button>
          </div>

          {error ? (
            <p className="mt-4 rounded-xl border border-red-400/20 bg-red-950/30 px-4 py-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <div className="mt-6 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-xl border border-white/10 bg-black/45 px-2 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                Secure
              </p>
              <p className="mt-1 text-[10px] text-stone-500">Stripe checkout</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/45 px-2 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                Receipt
              </p>
              <p className="mt-1 text-[10px] text-stone-500">By email</p>
            </div>
            <div className="rounded-xl border border-white/10 bg-black/45 px-2 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                Official
              </p>
              <p className="mt-1 text-[10px] text-stone-500">Direct from KAM DRIDI</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
