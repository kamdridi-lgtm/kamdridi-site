import type { Metadata } from "next";
import { MusicHub } from "@/components/music-hub";
import { Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Explore the official KAMDRIDI music hub with video, gallery, discography, and Echoes Unearthed campaign content."
};

export default function MusicPage() {
  return (
    <>
      <section className="overflow-hidden border-b border-white/10">
        <div className="relative isolate">
          <video
            className="h-[58vh] w-full object-cover brightness-[1.12] contrast-[1.08] saturate-[1.05] md:h-[72vh]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/images/gallery/p01_hero.jpg"
            aria-label="KAMDRIDI trailer"
          >
            <source src="/videos/Trailer_TVxaNOjn.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),rgba(0,0,0,0.18))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.12),transparent_30%)]" />
        </div>

        <Section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Music</p>
            <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-7xl">
              Echoes Unearthed in sound, image, and atmosphere
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300">
              The official music hub for KAMDRIDI with embedded video, gallery imagery, release
              history, and the visual world around the album.
            </p>
          </div>
        </Section>
      </section>
      <MusicHub />
    </>
  );
}
