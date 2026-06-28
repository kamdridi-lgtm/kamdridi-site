import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAiArtist } from "@/data/ai-artists";
import { warMachinesCover } from "@/data/site";
import { KamdridiRecordsLogo } from "@/components/label/KamdridiRecordsLogo";

export const metadata: Metadata = {
  title: "KAMDRIDI RECORDS Releases",
  description: "Official KAMDRIDI RECORDS release index featuring IRON COUNTY GHOSTS and KAM DRIDI releases."
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
          Selected releases, artist projects, and archive-linked music from the KAMDRIDI RECORDS ecosystem. This page only shows confirmed releases and real links when available.
        </p>
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
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">Dust on the Altar</h2>
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

        <article className="overflow-hidden rounded-[2rem] border border-[#f4c66a]/20 bg-[radial-gradient(circle_at_18%_0%,rgba(244,198,106,0.1),transparent_34%),rgba(8,6,4,0.72)] shadow-[0_30px_100px_rgba(0,0,0,0.32)]">
          <div className="relative bg-black p-4">
            <div className="relative mx-auto aspect-square max-w-[520px]">
              <Image src={warMachinesCover} alt="War Machines cover art" fill className="object-contain" sizes="(max-width: 768px) 100vw, 48vw" />
            </div>
          </div>
          <div className="p-6 md:p-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">Featured KAM DRIDI release</p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">War Machines</h2>
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
