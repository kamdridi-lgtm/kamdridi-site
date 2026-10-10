import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Mic2, Ticket } from "lucide-react";

export const metadata: Metadata = {
  title: "KAM DRIDI — Live in Japan 2027 | GEKIRIN Tokyo",
  description:
    "KAM DRIDI live at GEKIRIN, The Playhouse, Machida, Tokyo, Sunday 17 January 2027. Discover the concert, venue and official artwork.",
};

export default function JapanLivePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08080d] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[url('/japan/japan-header-crowd-hd.png')] bg-cover bg-[center_48%]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07080d]/75 via-[#07080d]/30 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07080d]/65 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col px-5 pb-12 pt-8 sm:min-h-[610px] sm:px-8 md:min-h-[670px] lg:px-10">
          <nav aria-label="Asia-Pacific live pages" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] font-bold uppercase tracking-[.16em]">
            <Link href="/live" className="text-[#f4c66a] hover:underline">← Live / Tour</Link>
            <Link href="/new-zealand" className="hover:text-[#f4c66a]">🇳🇿 New Zealand</Link>
            <Link href="/live#adelaide-show" className="hover:text-[#f4c66a]">🇦🇺 Australia</Link>
          </nav>
          <div className="mt-auto max-w-2xl drop-shadow-[0_3px_12px_rgba(0,0,0,.9)]">
            <p className="text-xs font-bold uppercase tracking-[.32em] text-red-300">🇯🇵 Japan · Tokyo · 2027</p>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[.92] tracking-[.02em] text-white sm:text-7xl">
              KAM DRIDI <span className="mt-2 block text-red-500">LIVE IN JAPAN</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white sm:text-base">
              GEKIRIN · 17 January 2027 · The Playhouse, Machida, Tokyo
            </p>
            <a href="#tokyo-show" className="mt-6 inline-flex rounded-full border border-white/40 bg-black/40 px-5 py-3 text-xs font-bold uppercase tracking-[.14em] text-white transition hover:bg-black/70">
              Discover the Tokyo concert ↓
            </a>
          </div>
        </div>
      </section>

      <section id="tokyo-show" className="relative isolate overflow-hidden border-b border-white/10 bg-[#10090b]">
        <div className="pointer-events-none absolute inset-y-0 right-0 -z-10 w-full bg-[url('/japan/the-playhouse-stage-tokyo.png')] bg-contain bg-right bg-no-repeat opacity-85 md:w-[62%]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#10090b]/80 via-[#10090b]/35 to-black/20" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-[minmax(0,1.1fr)_minmax(0,.9fr)] md:gap-10 md:py-20 lg:px-10">
          <div className="mx-auto w-full max-w-[550px]">
            <a href="/japan/kamdridi-gekirin-tokyo-2027.png" target="_blank" rel="noopener noreferrer" aria-label="Open the KAM DRIDI GEKIRIN Tokyo 2027 concert poster at full size" className="group block overflow-hidden rounded-2xl border border-white/20 bg-black shadow-[0_25px_65px_rgba(0,0,0,.55)]">
              <Image src="/japan/kamdridi-gekirin-tokyo-2027.png" alt="KAM DRIDI performing at GEKIRIN on 17 January 2027, The Playhouse, Tokyo, concert poster with QR code" width={1122} height={1402} priority sizes="(max-width: 767px) 90vw, 550px" className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.015]" />
            </a>
            <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[.16em] text-stone-200">GEKIRIN Tokyo · Concert poster · Tap to enlarge ↗</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[.28em] text-red-300">Tokyo · Japan · GEKIRIN 2027</p>
            <h2 className="mt-4 font-display text-3xl uppercase leading-[1.05] text-white drop-shadow-lg sm:text-5xl">
              The Playhouse <span className="block">Machida · Tokyo</span>
            </h2>
            <div className="mt-7 space-y-4 rounded-2xl border border-white/25 bg-black/50 p-5 backdrop-blur-[2px] sm:p-7">
              <p className="flex items-start gap-3 text-sm leading-6 text-white sm:text-base"><CalendarDays className="mt-1 h-5 w-5 shrink-0 text-[#f4c66a]" /> Sunday 17 January 2027</p>
              <p className="flex items-start gap-3 text-sm leading-6 text-white sm:text-base"><MapPin className="mt-1 h-5 w-5 shrink-0 text-[#f4c66a]" /> The Playhouse · Machida, Tokyo, Japan</p>
              <p className="flex items-start gap-3 text-sm leading-6 text-white sm:text-base"><Mic2 className="mt-1 h-5 w-5 shrink-0 text-[#f4c66a]" /> Melodic Hard Rock / Cinematic Melodic Hard Rock · Live lead vocals with professional instrumental backing tracks</p>
            </div>
            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-500/30 bg-black/60 px-5 py-4">
              <Ticket className="mt-1 h-5 w-5 shrink-0 text-[#f4c66a]" />
              <div className="min-w-0">
                <p className="text-sm font-bold text-white">Tickets · MOHANAK</p>
                <a href="https://mohanak.com/ticket/" target="_blank" rel="noopener noreferrer" className="mt-1 block break-all text-sm font-semibold leading-6 text-red-300 underline underline-offset-4 hover:text-white">mohanak.com/ticket/ ↗</a>
                <p className="mt-2 text-xs leading-5 text-stone-200">Official ticket reservation form · チケット予約</p>
              </div>
            </div>
            <div className="mt-7 flex flex-wrap gap-3">
              <a href="https://mohanak.com/ticket/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full border border-red-400/70 bg-red-700 px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-white transition hover:bg-red-600">
                <Ticket className="mr-2 h-4 w-4" /> Buy Tickets <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
              <Link href="/press" className="inline-flex items-center rounded-full border border-white/40 bg-black/60 px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-white hover:bg-white/15">
                Artist EPK <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0e16]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[minmax(0,390px)_1fr] md:items-center md:gap-12 md:py-16">
          <a href="/japan/17-for-ever-original-poster.png" target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl border border-white/20 bg-white transition hover:border-red-500/70" aria-label="View the original 17 FOR EVER Japanese promotional poster in full">
            <img src="/japan/17-for-ever-original-poster.png" alt="KAM DRIDI Japan 17 FOR EVER collector cassette artwork" width={1024} height={1536} loading="lazy" className="h-auto w-full" />
          </a>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.27em] text-red-300">Japan · Special edition</p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-tight text-white sm:text-5xl">17 FOR EVER</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-stone-300">Japanese promotional artwork for the 17 FOR EVER special collector cassette edition.</p>
            <a href="/japan/17-for-ever-original-poster.png" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-[.15em] text-white transition hover:bg-white/10">View Japanese poster ↗</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">More Japan dates</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">Additional 2027 performances, including Osaka, are under consideration. No further date is announced.</p>
        <div className="mt-8 rounded-3xl border border-white/15 bg-white/[.035] p-7">
          <span className="text-sm text-red-300">🇯🇵 Japan</span>
          <h3 className="mt-4 font-display text-3xl uppercase text-white">Osaka</h3>
          <p className="mt-3 text-sm text-stone-400">2027 · Date and venue to be announced</p>
        </div>
      </section>
    </main>
  );
}
