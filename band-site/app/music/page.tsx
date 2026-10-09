import type { Metadata } from "next";
import Image from "next/image";
import { MusicHub } from "@/components/music-hub";
import { Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Explore the official KAMDRIDI music hub with video, gallery, discography, and Echoes Unearthed campaign content."
};

export default function MusicPage() {
  return (
    <div className="music-premium">
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

        <div className="relative isolate overflow-hidden">
          <Image
            src="/assets/images/music/echoes-signal-background.jpg"
            alt=""
            fill
            sizes="100vw"
            className="-z-20 object-cover object-[78%_center] sm:object-center"
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(3,3,3,0.66)_0%,rgba(3,3,3,0.42)_54%,rgba(3,3,3,0.2)_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(3,3,3,0.46),transparent_34%,rgba(3,3,3,0.58))]" />

          <Section className="relative py-12 md:py-16">
            <div className="mx-auto max-w-4xl">
              <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f4c66a]">
                Music
              </p>
              <h1 className="music-hero-title mt-5 max-w-[18ch] font-display text-[clamp(2.1rem,7.5vw,4.8rem)] uppercase leading-[0.9] tracking-[0.045em] text-white">
                <span className="block">
                  Echoes <span className="block sm:inline">Unearthed in</span>
                </span>
                <span className="block">Sound, image, and</span>
                <span className="block">atmosphere</span>
              </h1>
              <p className="music-copy mt-6 max-w-2xl text-[15px] leading-7 text-stone-300 sm:text-base sm:leading-8">
                The official music hub for KAMDRIDI with embedded video, gallery imagery, release
                history, and the visual world around the album.
              </p>
            </div>
          </Section>
        </div>
      </section>
      <MusicHub />
    </div>
  );
}
