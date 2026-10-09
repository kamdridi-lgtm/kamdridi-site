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
        <div className="pointer-events-none absolute inset-0 bg-[url('/japan/japan-header-crowd-hd.png')] bg-cover bg-[center_48%]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07080d]/85 via-[#07080d]/45 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07080d]/70 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
          <Link href="/live" className="text-xs font-bold uppercase tracking-[.24em] text-[#f4c66a] hover:underline">← Asia-Pacific Live</Link>
          <p className="mt-14 text-sm font-bold uppercase tracking-[.4em] text-red-300">🇯🇵 Japan · 2027</p>
          <h1 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-[.95] tracking-[.035em] sm:text-7xl">KAM DRIDI <span className="mt-3 block text-red-500">LIVE IN JAPAN</span></h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-stone-200">Melodic Hard Rock / Cinematic Melodic Hard Rock. Live lead vocals with professional instrumental backing tracks and optional synchronized visuals.</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/press" className="rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest !text-black hover:bg-stone-200">Artist / EPK ↗</Link>
            <Link href="/new-zealand" className="rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10">🇳🇿 New Zealand</Link>
            <Link href="/live#adelaide-show" className="rounded-full border border-white/25 px-6 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-white/10">🇦🇺 Australia</Link>
          </div>
        </div>
      </section>
      <section className="border-b border-white/10 bg-[#0d0e16]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[minmax(0,390px)_1fr] md:items-center md:gap-12 md:py-16">
          <a href="/japan/17-for-ever-original-poster.png" target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl border border-white/20 bg-white transition hover:border-red-500/70" aria-label="View the original 17 FOR EVER Japanese promotional poster in full">
            <img src="/japan/17-for-ever-original-poster.png" alt="Original KAM DRIDI Japan 17 FOR EVER collector cassette promotion, Japanese artwork" width={1024} height={1536} className="h-auto w-full" />
          </a>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.27em] text-red-300">Japan · Special edition</p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-tight text-white sm:text-5xl">17 FOR EVER</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-stone-300">Japanese promotional artwork for the 17 FOR EVER special collector cassette edition.</p>
            <a href="/japan/17-for-ever-original-poster.png" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-[.15em] text-white transition hover:bg-white/10">View original Japanese poster ↗</a>
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
