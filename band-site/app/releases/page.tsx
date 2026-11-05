import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAiArtist } from "@/data/ai-artists";
import { warMachinesCover } from "@/data/site";
import { KamdridiRecordsLogo } from "@/components/label/KamdridiRecordsLogo";

export const metadata: Metadata = {
  title: "KAMDRIDI RECORDS Releases",
  description: "KAM DRIDI studio albums in sequence, off-series projects, singles and KAMDRIDI RECORDS releases."
};

const submissionHref = "mailto:kamdridi@proton.me?subject=Artist Submission - KAMDRIDI RECORDS";

function ActionLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const className = primary
    ? "inline-flex justify-center rounded-full bg-[#f4c66a] px-6 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#ffe09a]"
    : "inline-flex justify-center rounded-full border border-[#f4c66a]/35 px-6 py-3 text-center text-xs font-black uppercase tracking-[0.18em] text-[#f4c66a] transition hover:border-[#f4c66a] hover:bg-[#f4c66a]/10";

  if (href.startsWith("/")) {
    return <Link href={href} className={className}>{children}</Link>;
  }

  return <a href={href} className={className}>{children}</a>;
}

export default function ReleasesPage() {
  const ironCountyGhosts = getAiArtist("iron-county-ghosts")!;

  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <section className="mx-auto max-w-7xl">
        <KamdridiRecordsLogo size="section" priority className="mx-0" />
        <h1 className="mt-8 font-display text-5xl uppercase leading-none tracking-[0.06em] md:text-7xl">Releases</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
          The KAM DRIDI studio albums are numbered separately from off-series projects. Work in preparation is identified as such; it is not presented as an official release.
        </p>
      </section>

      <section aria-labelledby="studio-album-series" className="mx-auto mt-12 max-w-7xl">
        <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
          <h2 id="studio-album-series" className="font-display text-3xl uppercase tracking-[0.06em] text-[#f1e4d0] sm:text-4xl">The numbered studio albums</h2>
          <p className="text-xs uppercase tracking-[0.18em] text-stone-400">A continuous artistic series</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {[
            { number: "01", title: "ECHOES UNEARTHED", status: "Released · 2026", href: "/releases/echoes-unearthed", description: "The first chapter · songs unearthed from the past" },
            { number: "02", title: "TWICE UPON A TIME", status: "In preparation", href: "", description: "The next official studio album" },
            { number: "03", title: "PERSPECTIVE THREE", status: "Future album", href: "", description: "Third chapter · not yet released" },
            { number: "04", title: "THE FOURTH DIMENSION OF DARK AMBITION DRIVEN BY DISTANT MEMORIES", status: "In development", href: "", description: "Fourth chapter · not yet released" }
          ].map((record) => (
            <div key={record.number} className="flex flex-col border border-[#b69d7b]/35 bg-[#161210] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.17em] text-[#d3ba97]">STUDIO ALBUM · Nº {record.number}</p>
              <h3 className="mt-4 font-display text-2xl uppercase leading-tight text-[#f3e9d9]">{record.title}</h3>
              <p className="mt-3 text-xs uppercase tracking-[0.12em] text-[#b8c0c8]">{record.status}</p>
              <p className="mb-5 mt-3 flex-1 text-sm leading-6 text-stone-400">{record.description}</p>
              {record.href ? <Link href={record.href} className="text-xs font-bold uppercase tracking-[0.15em] text-[#f4c66a] hover:underline">Open album ↗</Link> : null}
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="off-series-recordings" className="mx-auto mt-12 max-w-7xl">
        <h2 id="off-series-recordings" className="font-display text-3xl uppercase tracking-[0.06em] text-[#f1e4d0] sm:text-4xl">Off-series & special projects</h2>
        <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-400">These releases and works have their own identities. They do not change the studio-album numbering.</p>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <Link href="/releases/echoes-un-live-in-brasil" className="block border border-[#7c858e]/40 bg-[#101217] p-5 transition hover:border-[#ccd0d4]">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#bfc9d3]">OFF-SERIES ALBUM · CONCEPTUAL PERFORMANCE</p>
            <h3 className="mt-3 font-display text-2xl uppercase text-white">ECHOES UN LIVE IN BRASIL</h3>
            <p className="mt-2 text-sm leading-6 text-stone-400">UNLIVE — NOT LIVE. A conceptual extension of the ECHOES UNEARTHED era, not evidence of a Brazilian concert.</p>
          </Link>
          <div className="border border-[#7c858e]/40 bg-[#101217] p-5">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#bfc9d3]">OFF-SERIES ALBUM · IN PREPARATION</p>
            <h3 className="mt-3 font-display text-2xl uppercase text-white">UNDER COVER</h3>
            <p className="mt-2 text-sm leading-6 text-stone-400">A personal collection of covers. No release date or physical stock is announced.</p>
          </div>
          <a href="/in-senistre/index.html" className="block border border-[#7c858e]/40 bg-[#101217] p-5 transition hover:border-[#ccd0d4]">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#bfc9d3]">OFF-SERIES ALBUM · INTERACTIVE EXPERIENCE</p>
            <h3 className="mt-3 font-display text-2xl uppercase text-white">IN | SENISTRE</h3>
            <p className="mt-2 text-sm leading-6 text-stone-400">Eight letters, eight compositions and The Ninth Discovery. Enter the interactive portal.</p>
          </a>
          <Link href="/releases/salieris-hands" className="block border border-[#7c858e]/40 bg-[#101217] p-5 transition hover:border-[#ccd0d4]">
            <p className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#bfc9d3]">OFF-SERIES · CLASSICAL PROJECT</p>
            <h3 className="mt-3 font-display text-2xl uppercase text-white">SALIERI'S HANDS</h3>
            <p className="mt-2 text-sm leading-6 text-stone-400">An independent classical project outside the numbered rock-album sequence.</p>
          </Link>
        </div>
      </section>


      <section className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-2">
        <article className="overflow-hidden rounded-[2rem] border border-[#f4c66a]/20 bg-[radial-gradient(circle_at_18%_0%,rgba(244,198,106,0.12),transparent_34%),rgba(8,6,4,0.78)] shadow-[0_30px_100px_rgba(0,0,0,0.36)]">
          <div className="relative bg-black p-4">
            <div className="relative mx-auto aspect-square max-w-[520px]">
              <Image src={ironCountyGhosts.images.cover} alt="Dust on the Altar cover art" fill priority className="object-contain" sizes="(max-width: 768px) 100vw, 48vw" />
            </div>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">Single / Released</p>
            <h2 translate="no" className="notranslate mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">Dust on the Altar</h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">IRON COUNTY GHOSTS</p>
            <p className="mt-2 text-sm leading-7 text-stone-400">
              The first KAMDRIDI RECORDS artist project release: dark country, ghost-road atmosphere, and cinematic storytelling from IRON COUNTY GHOSTS.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink href="/iron-county-ghosts/music" primary>Listen</ActionLink>
              <ActionLink href="/iron-county-ghosts">Artist Site</ActionLink>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-[2rem] border border-[#f4c66a]/30 bg-[radial-gradient(circle_at_18%_0%,rgba(244,198,106,0.14),transparent_34%),rgba(8,6,4,0.78)] shadow-[0_30px_100px_rgba(0,0,0,0.36)]">
          <div className="relative bg-black p-4">
            <div className="relative mx-auto aspect-square max-w-[520px]">
              <Image
                src="/assets/images/releases/echoes-unearthed-cover.jpg"
                alt="Echoes Unearthed cover art"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 48vw"
              />
              <span className="pointer-events-none absolute left-3 top-3 z-10 border border-[#f4c66a]/45 bg-[#15100b]/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#f4c66a]">STUDIO ALBUM · Nº 1</span>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">STUDIO ALBUM · Nº 1 · RELEASED</p>
            <h2 translate="no" className="notranslate mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">Echoes Unearthed</h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">KAM DRIDI</p>
            <p className="mt-2 text-sm leading-7 text-stone-400">
              Nine verified 24-bit / 48 kHz WAV masters. Buy the complete digital album for CA$16 or any individual track for CA$2.99. Track buyers qualify for a private 20% album-upgrade offer.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink href="/releases/echoes-unearthed" primary>BUY / OPEN RELEASE</ActionLink>
              <ActionLink href="/store?filter=echoes-unearthed">STORE</ActionLink>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-[2rem] border border-[#f4c66a]/20 bg-[radial-gradient(circle_at_18%_0%,rgba(244,198,106,0.1),transparent_34%),rgba(8,6,4,0.72)] shadow-[0_30px_100px_rgba(0,0,0,0.32)]">
          <div className="relative bg-black p-4">
            <div className="relative mx-auto aspect-square max-w-[520px]">
              <Image src={warMachinesCover} alt="War Machines cover art" fill className="object-contain" sizes="(max-width: 768px) 100vw, 48vw" />
            </div>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">SINGLE · KAM DRIDI</p>
            <h2 translate="no" className="notranslate mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">War Machines</h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">KAM DRIDI</p>
            <p className="mt-2 text-sm leading-7 text-stone-400">
              A KAM DRIDI cinematic rock release connected to the wider KAMDRIDI creative universe.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink href="/music" primary>Listen</ActionLink>
              <ActionLink href="/">KAM DRIDI Home</ActionLink>
            </div>
          </div>
        </article>

        <article className="overflow-hidden rounded-[2rem] border border-[#f4c66a]/20 bg-[radial-gradient(circle_at_18%_0%,rgba(244,198,106,0.10),transparent_34%),rgba(8,6,4,0.72)] shadow-[0_30px_100px_rgba(0,0,0,0.32)]">
          <div className="relative bg-black p-4">
            <div className="relative mx-auto aspect-square max-w-[520px]">
              <Image
                src="/echoes-un-live-in-brasil/assets/images/front-cover.webp"
                alt="ECHOES UN LIVE IN BRASIL front cover"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 48vw"
              />
              <span className="pointer-events-none absolute left-3 top-3 z-10 border border-[#c3c9cd]/45 bg-[#101217]/90 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#c7d0d8]">OFF-SERIES ALBUM</span>
            </div>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">OFF-SERIES ALBUM · CONCEPTUAL UNLIVE EDITION</p>
            <h2 translate="no" className="notranslate mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">ECHOES UN LIVE IN BRASIL</h2>
            <p className="mt-3 text-sm leading-7 text-stone-300">KAM DRIDI</p>
            <p className="mt-2 text-sm leading-7 text-stone-400">
              A conceptual UNLIVE performance with semi-acoustic arrangements, expanded editions and an imagined Brazilian stage atmosphere. Not a recording of an actual concert in Brazil.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink href="/releases/echoes-un-live-in-brasil" primary>OPEN RELEASE</ActionLink>
              <ActionLink href="/store">STORE</ActionLink>
            </div>
          </div>
        </article>
      </section>

      <section className="mx-auto mt-12 max-w-7xl rounded-[2rem] border border-[#f4c66a]/20 bg-black/35 p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">For artists</p>
        <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">Submit a release-ready project</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">
          KAMDRIDI RECORDS reviews selected rock, dark country, cinematic, Americana and strong visual music projects.
        </p>
        <div className="mt-7">
          <ActionLink href={submissionHref}>Submit Music</ActionLink>
        </div>
      </section>
    </main>
  );
}
