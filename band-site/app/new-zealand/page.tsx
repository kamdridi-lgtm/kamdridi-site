import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Mic2 } from "lucide-react";

export const metadata: Metadata = {
  title: "KAM DRIDI — New Zealand Live",
  description: "KAM DRIDI in Aotearoa New Zealand: Wellington live plans, artist photo, and official Wellington arts organisation links.",
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
      <section className="relative isolate border-b border-white/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_20%,rgba(119,36,137,.24),transparent_45%),radial-gradient(circle_at_12%_80%,rgba(33,72,125,.24),transparent_46%)]" />
        <div className="relative mx-auto grid max-w-6xl items-center gap-8 px-5 pb-12 pt-10 sm:px-8 md:grid-cols-[1fr_.8fr] md:gap-12 md:py-16">
          <div>
            <Link href="/live" className="text-xs font-bold uppercase tracking-[.25em] text-[#f4c66a] hover:underline">← Live / Tour</Link>
            <p className="mt-10 text-xs font-semibold uppercase tracking-[.38em] text-[#cda2ff]">Aotearoa · New Zealand</p>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[.95] tracking-[.02em] text-white sm:text-7xl">KAM DRIDI <span className="mt-2 block text-[#cba5f4]">LIVE IN NZ</span></h1>
            <p className="mt-7 max-w-xl text-base leading-8 text-stone-200">Cinematic Melodic Hard Rock — live lead vocals with professional instrumental backing tracks and cinematic visuals.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/press" className="rounded-full bg-white px-6 py-3 text-xs font-bold uppercase tracking-[.16em] !text-black hover:bg-[#e7d7f9]">Artist EPK <ArrowUpRight className="ml-2 inline h-4 w-4" /></Link>
              <Link href="/tour#dates" className="rounded-full border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-[.16em] text-white hover:bg-white/10">Tour dates</Link>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-[390px] overflow-hidden rounded-3xl border border-white/15 bg-black shadow-[0_25px_75px_rgba(89,38,143,.25)]">
            <Image src="/assets/images/gallery/p03_portrait_mic.jpg" alt="Official KAM DRIDI artist portrait with microphone" width={1280} height={1920} priority className="h-auto w-full object-cover" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/55 to-transparent p-6 pt-16"><p className="text-sm font-bold tracking-[.3em] text-white">KAM DRIDI</p><p className="mt-1 text-xs uppercase tracking-[.22em] text-[#dfc7fa]">Montréal → Aotearoa</p></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 md:py-16">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[.2em] text-[#f4c66a]">Provisional · Not confirmed</span>
          <span className="text-xs uppercase tracking-[.2em] text-stone-400">Wellington 2027</span>
        </div>
        <h2 className="mt-5 font-display text-3xl uppercase tracking-wide text-white sm:text-5xl">Wellington live plans</h2>
        <div className="mt-6 grid gap-4 rounded-3xl border border-white/15 bg-white/[.04] p-6 sm:grid-cols-2 sm:p-8">
          <div><p className="mb-3 flex items-center gap-2 text-sm text-[#e7d7f9]"><CalendarDays className="h-4 w-4" /> 2 March 2027 · 7:30 PM (provisional)</p><p className="flex items-center gap-2 text-sm text-stone-200"><MapPin className="h-4 w-4" /> Fringe Bar · Wellington, New Zealand</p></div>
          <div><p className="flex items-center gap-2 text-sm text-stone-200"><Mic2 className="h-4 w-4" /> Solo lead vocal live · instrumental backing tracks</p><p className="mt-3 text-xs leading-6 text-stone-400">Planning information only. The venue/date will be announced as confirmed only after written confirmation.</p></div>
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
                {org.kind === "fringe" && <img src="https://www.fringe.co.nz/wp-content/uploads/2024/08/FringeLogo.svg" loading="lazy" alt="Official New Zealand Fringe Festival logo" className="max-h-[120px] max-w-full object-contain" />}
                {org.kind === "cubadupa" && <div className="rounded-xl bg-[#4f1c69] p-5"><img src="https://www.cubadupa.co.nz/wp-content/uploads/2024/11/CubaDupa_HeaderLogo-white.svg" loading="lazy" alt="Official CubaDupa logo" className="h-[90px] max-w-full object-contain" /></div>}
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
