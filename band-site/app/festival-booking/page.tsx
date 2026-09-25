import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KAM DRIDI — Festival & Live Booking",
  description: "Official booking page for KAM DRIDI live performances, festivals and showcase opportunities.",
  alternates: { canonical: "https://kamdridi.com/festival-booking" },
};

export default function FestivalBookingPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">Festival buyers · Promoters · Showcase programmers · Venues</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none md:text-7xl">KAM DRIDI — Live Booking</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">Montreal-based independent artist presenting cinematic melodic hard rock with a live production designed around dramatic pacing, visual atmosphere and a full-band concert format.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
            <h2 className="text-2xl font-black uppercase">Artist positioning</h2>
            <p className="mt-4 text-sm leading-7 text-stone-300">Melodic Hard Rock / Cinematic Melodic Hard Rock · Montreal, Canada · Independent artist.</p>
          </section>
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
            <h2 className="text-2xl font-black uppercase">Professional materials</h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/press" className="rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">EPK / Press</Link>
              <Link href="/tour" className="rounded-full border border-red-500/40 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">Live / Tour</Link>
              <a href="mailto:management@kamdridi.com?subject=KAM%20DRIDI%20Booking%20Inquiry" className="rounded-full border border-white/15 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">Booking contact</a>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
