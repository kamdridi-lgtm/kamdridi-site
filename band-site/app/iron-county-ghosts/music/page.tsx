import type { Metadata } from "next";
import Link from "next/link";
import { getAiArtist } from "@/data/ai-artists";

export const metadata: Metadata = {
  title: "Music | IRON COUNTY GHOSTS",
  description: "Listen to Dust on the Altar by IRON COUNTY GHOSTS."
};

export default function IronCountyGhostsMusicPage() {
  const artist = getAiArtist("iron-county-ghosts")!;
  const single = artist.releases.find((release) => release.audioUrl)!;
  const audioUrl = "https://kamdridi.com/audio/dust-on-the-altar.mp3";

  return (
    <main className="px-5 pb-24 pt-28 md:pt-36">
      <section className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="rounded-[1.8rem] border border-[#d9a95d]/25 bg-[#120b06] p-3 shadow-[0_35px_110px_rgba(0,0,0,.52)]">
            <img
              src={artist.images.cover}
              alt="Dust on the Altar cover art"
              className="max-h-[82vh] w-full rounded-[1.35rem] object-contain object-center"
            />
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.34em] text-[#d9a95d]">Single / Released / 2026</p>
          <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.07em] md:text-7xl">
            Dust on the Altar
          </h1>
          <p className="mt-5 text-sm uppercase tracking-[0.2em] text-stone-400">Artist: IRON COUNTY GHOSTS</p>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-stone-500">Label: KAMDRIDI RECORDS</p>
          <p className="mt-2 text-sm uppercase tracking-[0.2em] text-[#d9a95d]">Released May 23, 2026</p>
          <p className="mt-7 max-w-2xl text-base leading-8 text-stone-300">{single.description}</p>
          <div className="mt-7 rounded-[1.5rem] border border-[#d9a95d]/25 bg-black/45 p-5">
            <audio controls preload="metadata" src={audioUrl} className="w-full accent-[#d9a95d]">
              Your browser does not support the audio element.
            </audio>
          </div>
          <div className="mt-7 flex flex-wrap gap-2">
            {artist.genres.map((genre) => (
              <span key={genre} className="rounded-full border border-[#d9a95d]/25 px-3 py-2 text-[10px] uppercase tracking-[0.17em] text-[#d9a95d]">
                {genre}
              </span>
          ))}
        </div>
          <p className="mt-7 max-w-2xl text-sm leading-7 text-stone-400">
            Sonic direction: low toms, baritone guitars, pedal steel atmosphere, church-bell shadows, and a
            young powerful lead voice cutting through a burnt-gold country-rock mix.
          </p>
          <div className="mt-7">
            <Link
              href="/iron-county-ghosts/videos"
              className="inline-flex rounded-full border border-[#d9a95d]/35 px-6 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#d9a95d]"
            >
              View Videos
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-7xl">
        <h2 className="font-display text-4xl uppercase tracking-[0.08em]">Dust on the Altar EP</h2>
        <div className="mt-6 grid gap-3">
          {artist.tracklist.map((track, index) => (
            <div key={track.title} className="flex flex-col gap-2 rounded-2xl border border-[#d9a95d]/15 bg-black/25 p-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold text-white">{String(index + 1).padStart(2, "0")} / {track.title}</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-[#d9a95d] sm:text-right sm:tracking-[0.2em]">
                {track.status === "ready" ? "released" : track.status}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
