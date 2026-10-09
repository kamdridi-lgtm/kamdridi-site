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
      <section className="relative isolate overflow-hidden border-b border-white/10 bg-[#09080e]">
        <div className="pointer-events-none absolute inset-0 bg-[url('/nz/wellington-live-header-crowd-hd.png')] bg-cover bg-[65%_75%] md:bg-center" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#07060c]/45 via-[#07060c]/25 to-[#07060c]/80" aria-hidden="true" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-8 md:py-14 lg:px-10">
          <nav aria-label="Asia-Pacific live pages" className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] font-bold uppercase tracking-[.16em] text-white">
            <Link href="/live" className="text-[#f4c66a] hover:underline">← Live / Tour</Link>
            <Link href="/japan" className="hover:text-[#f4c66a]">🇯🇵 Japan</Link>
            <Link href="/live#adelaide-show" className="hover:text-[#f4c66a]">🇦🇺 Australia</Link>
          </nav>

          <div className="grid items-center gap-6 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)] lg:gap-10">
            <div className="rounded-[28px] border border-white/15 bg-[#07060d]/80 p-6 shadow-2xl shadow-black/35 backdrop-blur-[3px] sm:p-9 lg:p-11">
              <p className="text-xs font-bold uppercase tracking-[.3em] text-[#d7b1ef]">🇳🇿 Aotearoa · New Zealand</p>
              <h1 className="mt-5 font-display text-4xl font-bold uppercase leading-[.98] tracking-[.02em] text-white sm:text-6xl lg:text-[4.1rem]">
                KAM DRIDI <span className="mt-2 block text-[#d9b1f1]">LIVE IN NZ</span>
              </h1>
              <p className="mt-6 max-w-xl text-sm leading-7 text-stone-200 sm:text-base">Cinematic Melodic Hard Rock — live lead vocals, professional instrumental backing tracks and cinematic visuals.</p>

              <div className="mt-7 border-t border-white/20 pt-6">
                <p className="text-[11px] font-bold uppercase tracking-[.22em] text-[#f4c66a]">Wellington · The Fringe Bar</p>
                <p className="mt-3 text-xl font-bold text-white sm:text-2xl">Tuesday 2 March 2027</p>
                <p className="mt-1 text-sm font-semibold text-stone-200">7:30 PM · 60-minute show</p>
              </div>

              <a href="https://www.fringe.co.nz/" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex max-w-full items-center gap-4 rounded-xl border border-white/20 bg-[#27142c]/85 px-4 py-3 transition hover:border-white/50" aria-label="New Zealand Fringe Festival official website">
                <img src="/nz/fringe-official.svg" alt="NZ Fringe Festival logo" width={112} height={56} className="h-[47px] w-[94px] shrink-0 object-contain" />
                <span className="text-[10px] font-bold uppercase leading-5 tracking-[.12em] text-white sm:text-xs">NZ Fringe Festival 2027 <ArrowUpRight className="ml-1 inline h-3 w-3" /></span>
              </a>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/press" className="inline-flex items-center rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[.12em] !text-black hover:bg-stone-200">Artist EPK <ArrowUpRight className="ml-2 h-4 w-4" /></Link>
                <Link href="/tour#dates" className="inline-flex items-center rounded-full border border-white/35 bg-black/35 px-5 py-3 text-xs font-bold uppercase tracking-[.12em] text-white hover:bg-white/10">Tour dates</Link>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[380px] lg:max-w-[405px]">
              <a href="/nz/kamdridi-wellington-2027-poster.png" target="_blank" rel="noopener noreferrer" className="group block overflow-hidden rounded-2xl border border-white/25 bg-black shadow-[0_22px_65px_rgba(0,0,0,.7)]" aria-label="Open the original Wellington 2027 poster at full size">
                <Image src="/nz/kamdridi-wellington-2027-poster.png" alt="KAM DRIDI Wellington 2027 show poster — The Fringe Bar, 2 March 2027" width={1055} height={1491} priority sizes="(max-width: 1024px) 90vw, 405px" className="block h-auto w-full transition duration-300 group-hover:scale-[1.015]" />
              </a>
              <p className="mt-3 text-center text-[11px] font-semibold uppercase tracking-[.18em] text-white/85">Official show poster · Tap to enlarge ↗</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#f4c66a]">Wellington · New Zealand</span>
          <span className="text-xs uppercase tracking-[.2em] text-stone-400">Wellington 2027</span>
        </div>
        <h2 className="mt-5 font-display text-3xl uppercase tracking-wide text-white sm:text-5xl">The Fringe Bar · Wellington</h2>
        <div className="mt-6 grid gap-4 rounded-3xl border border-white/15 bg-white/[.04] p-6 sm:grid-cols-2 sm:p-8">
          <div><p className="mb-3 flex items-center gap-2 text-sm text-[#e7d7f9]"><CalendarDays className="h-4 w-4" /> Tuesday 2 March 2027 · 7:30 PM</p><p className="flex items-center gap-2 text-sm text-stone-200"><MapPin className="h-4 w-4" /> The Fringe Bar · 26–32 Allen Street, Wellington, New Zealand</p></div>
          <div><p className="flex items-center gap-2 text-sm text-stone-200"><Mic2 className="h-4 w-4" /> Solo lead vocal live · instrumental backing tracks</p><p className="mt-3 text-xs leading-6 text-stone-400">Explore the full-size Wellington 2027 poster above for show details and the festival information link.</p></div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[linear-gradient(160deg,#140b1d,#09070e)]">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <p className="text-xs font-bold uppercase tracking-[.35em] text-[#d8b5ff]">Pōneke · Wellington</p>
          <h2 className="mt-3 font-display text-3xl uppercase text-white sm:text-5xl">New Zealand arts &amp; festivals</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">Official websites of Wellington arts organisations and festivals. Select a logo to visit its website. These references do not imply KAM DRIDI is booked, sponsored, endorsed or affiliated.</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {organisations.map((org) => (
              <a key={org.kind} href={org.url} target="_blank" rel="noopener noreferrer" aria-label={`Official website: ${org.name}`} className="group flex min-h-[154px] items-center justify-center rounded-2xl border border-white/15 bg-white px-5 py-7 text-center transition hover:-translate-y-1 hover:border-[#ad76d5] hover:shadow-[0_10px_35px_rgba(148,60,170,.2)]">
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
