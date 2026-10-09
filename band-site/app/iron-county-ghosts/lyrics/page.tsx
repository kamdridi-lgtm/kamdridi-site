import type { Metadata } from "next";
import { getAiArtist } from "@/data/ai-artists";

export const metadata: Metadata = {
  title: "Lyrics | IRON COUNTY GHOSTS",
  description: "Dust on the Altar lyrics by IRON COUNTY GHOSTS."
};

export default function IronCountyGhostsLyricsPage() {
  const artist = getAiArtist("iron-county-ghosts")!;
  const lyrics = (artist.lyrics ?? "").replace("Dust on the Altar\nIRON COUNTY GHOSTS\n\n", "Dust on the Altar\n\n");

  return (
    <main className="px-5 pb-24 pt-28 md:pt-36">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.34em] text-[#d9a95d]">Lyrics</p>
        <h1 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.07em] md:mt-5 md:text-7xl">
          Dust on the Altar - Lyrics
        </h1>
        <p className="mt-4 text-sm uppercase tracking-[0.18em] text-stone-500">IRON COUNTY GHOSTS</p>
        <div className="mt-8 rounded-[1.7rem] border border-[#d9a95d]/20 bg-black/35 p-6 md:p-10">
          <pre className="whitespace-pre-wrap font-mono text-sm leading-8 text-stone-200">
            {lyrics}
          </pre>
        </div>
      </section>
    </main>
  );
}
