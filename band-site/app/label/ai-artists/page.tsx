import type { Metadata } from "next";
import Link from "next/link";
import { IronCountyGhostsLogo } from "@/components/iron-county-ghosts-logo";
import { aiArtists } from "@/data/ai-artists";

export const metadata: Metadata = {
  title: "AI Artists - KAMDRIDI RECORDS",
  description:
    "Transparent AI-assisted artist projects created and produced by KAMDRIDI RECORDS across country, rap, hip-hop, cinematic metal, and more."
};

export default function AiArtistsPage() {
  return (
    <main className="min-h-screen bg-[#050403] text-white">
      <section className="px-5 py-20 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">KAMDRIDI RECORDS</p>
          <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] md:text-8xl">
            AI Artist
            <br />
            Roster
          </h1>
          <p className="mt-7 max-w-3xl text-base leading-8 text-stone-300">
            A transparent roster of fictional AI-assisted music projects created and produced by KAMDRIDI RECORDS. Every
            project is clearly labeled, directed by the label, and built for real songs, real releases, and premium visual
            worlds.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link href="/label" className="rounded-full border border-[#f4c66a]/35 px-7 py-4 text-xs font-bold uppercase tracking-[0.24em] text-[#f4c66a]">
              Back to Label
            </Link>
            <Link href="/label/apply" className="rounded-full bg-[#f4c66a] px-7 py-4 text-xs font-bold uppercase tracking-[0.24em] text-black">
              Submit Human Artist
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2 xl:grid-cols-3">
          {aiArtists.map((artist) => (
            <Link key={artist.slug} href={`/label/ai-artists/${artist.slug}`} className="label-panel group block min-h-[420px] overflow-hidden">
              <div className="flex h-full flex-col justify-between">
                <div>
                  {artist.releases.some((release) => release.audioUrl) ? (
                    <div className="mb-4 inline-flex rounded-full border border-[#f4c66a]/35 bg-[#f4c66a]/10 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#f4c66a]">
                      First song online
                    </div>
                  ) : null}
                  <div
                    className="mb-6 aspect-[4/3] rounded-2xl border border-[#f4c66a]/25 bg-[radial-gradient(circle_at_30%_20%,rgba(244,198,106,0.2),transparent_32%),linear-gradient(135deg,rgba(244,198,106,0.12),rgba(0,0,0,0.55))] bg-cover bg-center"
                    style={{ backgroundImage: `linear-gradient(180deg, transparent 42%, rgba(0,0,0,.64)), url(${artist.images.hero})` }}
                  />
                  <p className="text-[10px] uppercase tracking-[0.3em] text-[#f4c66a]">{artist.badge}</p>
                  {artist.slug === "iron-county-ghosts" ? (
                    <IronCountyGhostsLogo className="mt-3 drop-shadow-[0_14px_26px_rgba(0,0,0,.7)]" />
                  ) : (
                    <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">{artist.name}</h2>
                  )}
                  <p className="mt-2 text-xs uppercase tracking-[0.22em] text-stone-500">{artist.genre}</p>
                  <p className="mt-5 text-sm leading-7 text-stone-300">{artist.shortBio}</p>
                </div>
                <p className="mt-8 text-xs uppercase tracking-[0.25em] text-[#f4c66a] transition group-hover:text-white">{artist.slogan}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
