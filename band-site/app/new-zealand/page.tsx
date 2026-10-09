import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Mic2 } from "lucide-react";

export const metadata: Metadata = {
  title: "KAM DRIDI — New Zealand Live",
  description: "KAM DRIDI live in Wellington, New Zealand at The Fringe Bar, Tuesday 2 March 2027, 7:30 PM.",
};

const organisations = [
  {name: "Creative Capital Arts Trust", url: "https://www.ccat.org.nz/", kind: "ccat"},
  {name: "New Zealand Fringe Festival", url: "https://www.fringe.co.nz/", kind: "fringe"},
  {name: "CubaDupa", url: "https://www.cubadupa.co.nz/", kind: "cubadupa"},
  {name: "Classical on Cuba", url: "https://www.classicaloncuba.co.nz/", kind: "classical"},
] as const;

export default function NewZealandLivePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08070d] text-white">
      {/* The Moroccan concert image is the hero: do not cover it with the Wellington poster. */}
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#09080e]">
        <div className="pointer-events-none absolute inset-0 bg-[url('/nz/wellington-live-header-crowd-hd.png')] bg-cover bg-[63%_center] md:bg-center" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/65 via-black/15 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col px-5 pb-12 pt-8 sm:min-h-[640px] sm:px-8 md:min-h-[690px] lg:px-10">
          <nav aria-label="Asia-Pacific live pages" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] font-bold uppercase tracking-[.16em] text-white">
            <Link href="/live" className="text-[#f4c66a] hover:underline">← Live / Tour</Link>
            <Link href="/japan" className="hover:text-[#f4c66a]">🇯🇵 Japan</Link>
            <Link href="/live#adelaide-show" className="hover:text-[#f4c66a]">🇦🇺 Australia</Link>
          </nav>
          <div className="mt-auto max-w-2xl drop-shadow-[0_3px_12px_rgba(0,0,0,0.9)]">
            <p className="text-xs font-bold uppercase tracking-[.32em] text-[#dfc4f6]">🇳🇿 Aotearoa · New Zealand</p>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[.92] tracking-[.02em] text-white sm:text-7xl">
              KAM DRIDI <span className="mt-2 block text-[#d9b1f1]">LIVE IN NZ</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white sm:text-base">Cinematic Melodic Hard Rock · Live lead vocals · Cinematic visuals</p>
          </div>
        </div>
      </section>

      {/* Wellington show and poster belong below the concert photograph. */}
      <section id="wellington-show" className="relative isolate overflow-hidden border-b border-white/10 bg-[#120c17]">
        {/* Fringe Bar interior: atmosphere behind the Wellington details, never over the Morocco live hero. */}
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[url('/nz/fringe-bar-venue-interior.png')] bg-cover bg-center" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-[#0b0810]/35 via-[#0b0810]/20 to-[#0b0810]/40" aria-hidden="true" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 md:grid-cols-[minmax(0,.85fr)_minmax(0,1.15fr)] md:gap-12 md:py-20 lg:px-10">
          <div className="mx-auto w-full max-w-[410px]">
            <a href="/nz/kamdridi-wellington-2027-poster.png" target="_blank" rel="noopener noreferrer" aria-label="Open the original Wellington 2027 concert poster at full size" className="group block overflow-hidden rounded-2xl border border-white/20 bg-black shadow-[0_25px_65px_rgba(0,0,0,.55)]">
              <Image src="/nz/kamdridi-wellington-2027-poster.png" alt="KAM DRIDI Wellington 2027 concert poster at The Fringe Bar" width={1055} height={1491} priority sizes="(max-width: 767px) 90vw, 410px" className="block h-auto w-full transition-transform duration-300 group-hover:scale-[1.015]" />
            </a>
            <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[.16em] text-stone-400">Official show poster · Tap to enlarge ↗</p>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[.28em] text-[#d9b1f1]">Wellington · NZ Fringe Festival 2027</p>
            <h2 className="mt-4 font-display text-3xl uppercase leading-[1.05] text-white sm:text-5xl">The Fringe Bar <span className="block">Wellington</span></h2>
            <div className="mt-7 space-y-4 rounded-2xl border border-white/15 bg-black/30 p-5 sm:p-7">
              <p className="flex items-start gap-3 text-sm leading-6 text-white sm:text-base"><CalendarDays className="mt-1 h-5 w-5 shrink-0 text-[#f4c66a]" /> Tuesday 2 March 2027 · 7:30 PM</p>
              <p className="flex items-start gap-3 text-sm leading-6 text-stone-200 sm:text-base"><MapPin className="mt-1 h-5 w-5 shrink-0 text-[#f4c66a]" /> 26–32 Allen Street, Te Aro, Wellington, New Zealand</p>
              <p className="flex items-start gap-3 text-sm leading-6 text-stone-200 sm:text-base"><Mic2 className="mt-1 h-5 w-5 shrink-0 text-[#f4c66a]" /> 60-minute show · Live lead vocals with professional instrumental backing tracks and cinematic visuals</p>
            </div>
            <a href="https://www.fringe.co.nz/" target="_blank" rel="noopener noreferrer" aria-label="NZ Fringe Festival official website" className="mt-6 inline-flex max-w-full items-center gap-4 rounded-2xl border border-white/20 bg-[#2a1736] px-5 py-4 transition hover:border-[#d9b1f1]">
              <img src="/nz/fringe-official.svg" alt="NZ Fringe Festival official logo" width={130} height={65} className="h-[55px] w-[110px] shrink-0 object-contain" />
              <span className="text-xs font-bold uppercase leading-5 tracking-[.12em] text-white">NZ Fringe Festival <ArrowUpRight className="ml-1 inline h-4 w-4" /></span>
            </a>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/press" className="inline-flex items-center rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[.12em] !text-black hover:bg-stone-200">Artist EPK <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
              <a href="https://www.fringe.co.nz/" target="_blank" rel="noopener noreferrer" aria-label="Buy tickets — visit the official NZ Fringe website for ticket availability" className="inline-flex items-center rounded-full border border-white/40 bg-black/45 px-6 py-3 text-xs font-bold uppercase tracking-[.12em] text-white transition hover:bg-white/15">Buy tickets <ArrowUpRight className="ml-2 h-4 w-4" /></a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[linear-gradient(160deg,#140b1d,#09070e)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.35em] text-[#d8b5ff]">Pōneke · Wellington</p>
          <h2 className="mt-3 font-display text-3xl uppercase text-white sm:text-5xl">New Zealand arts &amp; festivals</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">Official websites of Wellington arts organisations and festivals. Select a logo to visit its website. These references do not imply KAM DRIDI is booked, sponsored, endorsed or affiliated.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {organisations.map((org) => (
              <a key={org.kind} href={org.url} target="_blank" rel="noopener noreferrer" aria-label={`Official website: ${org.name}`} className={`group flex min-h-[154px] items-center justify-center rounded-2xl border border-white/15 px-5 py-7 text-center transition hover:-translate-y-1 hover:border-[#ad76d5] hover:shadow-[0_10px_35px_rgba(148,60,170,.2)] ${org.kind === "fringe" ? "bg-[#31133d]" : "bg-white"}`}>
                {org.kind === "ccat" && <div className="text-left text-[27px] font-extrabold leading-[.9] tracking-[-.045em] text-[#7551c7] sm:text-[32px]">creative<br/>capital<br/><span className="text-[#121019]">arts</span><br/>trust</div>}
                {org.kind === "fringe" && <img src="/nz/fringe-official.svg" loading="lazy" alt="Official New Zealand Fringe Festival logo" className="max-h-[120px] max-w-full object-contain" />}
                {org.kind === "cubadupa" && <div className="rounded-xl bg-[#4f1c69] p-5"><img src="/nz/cubadupa-official.svg" loading="lazy" alt="Official CubaDupa logo" className="h-[90px] max-w-full object-contain" /></div>}
                {org.kind === "classical" && <div className="flex items-center gap-3 text-[#9b16ac]"><span className="text-7xl font-black leading-none">C</span><span className="text-left text-2xl font-bold uppercase leading-[.95] tracking-tight">Classical<br/>on Cuba</span></div>}
                <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-[#7e5597] opacity-0 transition group-hover:opacity-100" />
              </a>
            ))}
          </div>
          <p className="mt-5 text-xs leading-6 text-stone-500">Logos and names remain the property of their respective organisations; their presence is informational only.</p>
        </div>
      </section>
    </main>
  );
}
