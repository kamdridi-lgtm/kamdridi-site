import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAiArtist } from "@/data/ai-artists";
import { KamdridiRecordsLogo } from "@/components/label/KamdridiRecordsLogo";

export const metadata: Metadata = {
  title: "KAMDRIDI RECORDS Roster",
  description: "Current KAMDRIDI RECORDS artist projects including KAM DRIDI and IRON COUNTY GHOSTS."
};

const submissionHref = "mailto:kamdridi@proton.me?subject=Artist Submission - KAMDRIDI RECORDS";

export default function RosterPage() {
  const ironCountyGhosts = getAiArtist("iron-county-ghosts")!;

  const roster = [
    {
      name: "KAM DRIDI",
      genre: "Rock / Cinematic / Independent Artist",
      description: "The core artist identity behind Echoes Unearthed, War Machines, and the wider KAMDRIDI universe.",
      image: "/assets/images/gallery/p04_portrait_leather.jpg",
      href: "/",
      cta: "Explore KAM DRIDI",
      fit: "object-cover object-top"
    },
    {
      name: "IRON COUNTY GHOSTS",
      genre: "Dark Country / Outlaw Americana / Country-Rock",
      description: "First official KAMDRIDI RECORDS artist project. Debut single: Dust on the Altar.",
      image: ironCountyGhosts.images.hero,
      href: "/iron-county-ghosts",
      cta: "View Artist Site",
      fit: "object-contain object-top"
    }
  ];

  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white md:py-28">
      <section className="mx-auto max-w-7xl">
        <KamdridiRecordsLogo size="section" priority className="mx-0" />
        <h1 className="mt-8 font-display text-5xl uppercase leading-none tracking-[0.06em] md:text-7xl">Roster</h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
          Current official KAMDRIDI RECORDS projects.
        </p>
      </section>

      <section className="mx-auto mt-10 grid max-w-7xl gap-6 md:grid-cols-2">
        {roster.map((artist) => (
          <article
            key={artist.name}
            className="overflow-hidden rounded-[2rem] border border-[#f4c66a]/18 bg-[radial-gradient(circle_at_16%_0%,rgba(244,198,106,0.14),transparent_34%),rgba(8,6,4,0.78)] shadow-[0_30px_100px_rgba(0,0,0,0.38)]"
          >
            <div className="relative min-h-[420px] border-b border-[#f4c66a]/12 bg-black">
              <Image src={artist.image} alt={`${artist.name} official roster image`} fill className={artist.fit} sizes="(max-width: 768px) 100vw, 50vw" />
            </div>
            <div className="p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">{artist.genre}</p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">{artist.name}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">{artist.description}</p>
              <div className="mt-7">
                <Link
                  href={artist.href}
                  className="inline-flex rounded-full border border-[#f4c66a]/35 px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-[#f4c66a] transition hover:border-[#f4c66a] hover:bg-[#f4c66a]/10"
                >
                  {artist.cta}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-7xl rounded-[2rem] border border-[#f4c66a]/20 bg-black/35 p-6 text-center md:p-10">
        <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Artist submissions</p>
        <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] text-white md:text-5xl">
          Want to be considered?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-stone-300">
          Send your strongest music, links, short bio, socials, and what kind of support you need.
        </p>
        <a
          href={submissionHref}
          className="mt-7 inline-flex rounded-full bg-[#f4c66a] px-7 py-4 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#ffe09a]"
        >
          Submit Music
        </a>
      </section>
    </main>
  );
}
