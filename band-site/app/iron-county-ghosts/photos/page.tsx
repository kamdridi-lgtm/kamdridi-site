import type { Metadata } from "next";
import Link from "next/link";
import { getAiArtist } from "@/data/ai-artists";

export const metadata: Metadata = {
  title: "Photos | IRON COUNTY GHOSTS",
  description: "Official photo gallery for IRON COUNTY GHOSTS."
};

export default function IronCountyGhostsPhotosPage() {
  const artist = getAiArtist("iron-county-ghosts")!;
  const officialBandPortrait = "/assets/images/label/iron-county-ghosts/official-band-portrait-wide.png";
  const closeupPortrait = "/assets/images/label/iron-county-ghosts/epk-band-closeup.png";
  const livePhotos = [
    { label: "Live performance - outdoor festival", src: "/assets/images/label/iron-county-ghosts/outdoor-festival-performance.png" },
    { label: "Live performance - arena stage", src: "/assets/images/label/iron-county-ghosts/live-arena-performance.png" },
    { label: "Live performance - crowd shot", src: "/assets/images/label/iron-county-ghosts/live-crowd-shot.png" },
    { label: "Live performance - stage spotlight", src: artist.images.altWide },
    { label: "Live performance - side stage angle", src: artist.images.darkChurch }
  ];
  const promoPhotos = [
    { label: "EPK press portrait", src: closeupPortrait, position: "center top" },
    { label: "Barn press portrait", src: "/assets/images/label/iron-county-ghosts/barn-press-portrait.png" },
    { label: "Lead portrait", src: artist.images.portrait },
    { label: "Release cover", src: artist.images.cover }
  ];

  return (
    <main className="px-5 pb-24 pt-28 md:pt-36">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.34em] text-[#d9a95d]">Press Gallery</p>
        <h1 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.07em] md:mt-5 md:text-7xl">
          Photos / Press Gallery
        </h1>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/iron-county-ghosts/videos"
            className="rounded-full border border-[#d9a95d]/35 px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#d9a95d]"
          >
            View Videos
          </Link>
          <Link
            href="/iron-county-ghosts/epk"
            className="rounded-full border border-stone-500/35 px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-stone-300"
          >
            View EPK
          </Link>
        </div>
        <figure className="mt-7 rounded-[1.7rem] border border-[#d9a95d]/20 bg-[#120b06] p-3 md:mt-10">
          <img
            src={officialBandPortrait}
            alt="Official band portrait"
            className="w-full rounded-[1.25rem] object-cover object-center brightness-[1.05] contrast-[1.03]"
          />
          <figcaption className="p-4 text-xs uppercase tracking-[0.2em] text-[#d9a95d]">Official band portrait</figcaption>
        </figure>

        <h2 className="mt-12 text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Live photos</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {livePhotos.map((photo) => (
            <figure key={photo.src} className="rounded-[1.7rem] border border-[#d9a95d]/20 bg-[#120b06] p-3">
              <img
                src={photo.src}
                alt={photo.label}
                className="max-h-[72vh] w-full rounded-[1.25rem] object-contain object-top brightness-[1.05] contrast-[1.03]"
              />
              <figcaption className="p-4 text-xs uppercase tracking-[0.2em] text-[#d9a95d]">{photo.label}</figcaption>
            </figure>
          ))}
        </div>

        <h2 className="mt-12 text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Promo photos</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {promoPhotos.map((photo) => (
            <figure key={`${photo.label}-${photo.src}`} className="rounded-[1.7rem] border border-[#d9a95d]/20 bg-[#120b06] p-3">
              <img
                src={photo.src}
                alt={photo.label}
                className="max-h-[72vh] w-full rounded-[1.25rem] object-contain brightness-[1.05] contrast-[1.03]"
                style={{ objectPosition: photo.position ?? "center top" }}
              />
              <figcaption className="p-4 text-xs uppercase tracking-[0.2em] text-[#d9a95d]">{photo.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </main>
  );
}
