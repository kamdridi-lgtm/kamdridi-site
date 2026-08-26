import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Buy OUR LOST DREAMS | KAM DRIDI",
  description:
    "Buy the official KAM DRIDI digital download of OUR LOST DREAMS through secure Stripe checkout."
};

const CHECKOUT_URL = "https://buy.stripe.com/8x2eVdali2hKdMY6E0eEo0n";

export default function BuyOurLostDreamsPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto flex min-h-[78vh] max-w-5xl items-center px-6 py-20 md:px-10">
        <div className="w-full overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.14),transparent_35%),linear-gradient(180deg,#12100d,#050505)] p-7 shadow-2xl md:p-12">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#f4c66a]">
            Official KAM DRIDI Digital Release
          </p>

          <h1 className="mt-6 font-display text-5xl uppercase leading-[0.95] tracking-[0.06em] text-white md:text-7xl">
            OUR LOST DREAMS
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 md:text-lg">
            Own the official digital download and directly support independent melodic hard rock from KAM DRIDI.
          </p>

          <div className="mt-8 grid gap-3 text-sm text-stone-300 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <span className="block text-[10px] uppercase tracking-[0.28em] text-stone-500">Track</span>
              <span className="mt-2 block font-semibold text-white">OUR LOST DREAMS</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <span className="block text-[10px] uppercase tracking-[0.28em] text-stone-500">Price</span>
              <span className="mt-2 block font-semibold text-white">¥250 JPY</span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4">
              <span className="block text-[10px] uppercase tracking-[0.28em] text-stone-500">Checkout</span>
              <span className="mt-2 block font-semibold text-white">Secure Stripe payment</span>
            </div>
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <a
              href={CHECKOUT_URL}
              className="inline-flex min-h-14 items-center justify-center rounded-full bg-[#f4c66a] px-8 py-4 text-sm font-extrabold uppercase tracking-[0.18em] text-black transition hover:bg-[#ffd989]"
            >
              Buy OUR LOST DREAMS — ¥250
            </a>
            <Link
              href="/store"
              className="inline-flex min-h-14 items-center justify-center rounded-full border border-white/15 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-stone-200 transition hover:border-white/30 hover:bg-white/[0.05]"
            >
              Visit Official Store
            </Link>
          </div>

          <p className="mt-6 text-xs leading-6 text-stone-500">
            Payment is processed by Stripe. After successful payment, you are returned to the official KAM DRIDI download flow.
          </p>
        </div>
      </section>
    </main>
  );
}
