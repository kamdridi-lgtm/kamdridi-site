import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KAM DRIDI — Japan Live 2027",
  description: "KAM DRIDI Japanese live plans for 2027. Tokyo and Osaka are under consideration; no dates or venues announced.",
};

export default function JapanLivePage() {
  return (
    <main className="min-h-screen bg-[#07080d] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(208,31,52,.28),transparent_45%),radial-gradient(circle_at_85%_70%,rgba(30,65,132,.26),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <Link href="/live" className="text-xs font-bold uppercase tracking-[.24em] text-[#f4c66a] hover:underline">← Asia-Pacific Live</Link>
          <p className="mt-14 text-sm font-bold uppercase tracking-[.4em] text-red-300">🇯🇵 Japan · 2027</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-[.95] tracking-[.035em] sm:text-7xl">KAM DRIDI <span className="mt-3 block text-red-500">LIVE IN JAPAN</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-stone-200">Melodic Hard Rock / Cinematic Melodic Hard Rock. Live lead vocals with professional instrumental backing tracks and optional synchronized visuals.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/press" className="rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-black hover:bg-stone-200">Artist / EPK ↗</Link>
            <Link href="/new-zealand" className="rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10">🇳🇿 New Zealand</Link>
            <Link href="/live#adelaide-show" className="rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10">🇦🇺 Australia</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">Japan — live planning</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">Tokyo and Osaka are being explored for possible 2027 performances. Dates, venues and ticketing will be published here only when available.</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {["Tokyo", "Osaka"].map((city) => (
            <div key={city} className="rounded-3xl border border-white/15 bg-white/[.035] p-7">
              <span className="text-sm text-red-300">🇯🇵 Japan</span>
              <h3 className="mt-4 font-display text-3xl uppercase text-white">{city}</h3>
              <p className="mt-3 text-sm text-stone-400">2027 · Dates and venue to be announced</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
