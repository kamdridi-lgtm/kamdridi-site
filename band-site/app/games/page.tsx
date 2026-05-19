import type { Metadata } from "next";
import Link from "next/link";
import { GamesPanel } from "@/components/games-panel";
import { Section } from "@/components/ui";

const gamesHeroVideo = "/videos/games-hero-20260516.mp4";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Launch game experiences inside the KAMDRIDI fan universe, including The Gilded Null and deeper protocol access for members."
};

export default function GamesPage() {
  return (
    <>
      <section className="overflow-hidden border-b border-white/10">
        <div className="relative isolate">
          <video
            className="h-[56vh] min-h-[420px] w-full object-cover object-[center_28%] brightness-[0.82] contrast-[1.08] saturate-[0.92] md:h-[74vh] lg:h-[80vh]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/official-game-poster.png"
            aria-label="KAMDRIDI games trailer"
          >
            <source src={gamesHeroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.22)_38%,rgba(0,0,0,0.64))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.16),transparent_28%)]" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.65))]" />
        </div>

        <Section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Games</p>
            <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-7xl">
              Protocols, launchers, and fan-universe game access
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300">
              A clean launcher interface for the interactive side of Echoes Unearthed,
              including The Gilded Null and deeper collector protocol access.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/play/the-gilded-null/index.html"
                className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-6 py-3 text-sm uppercase tracking-[0.25em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989]"
              >
                Launch The Gilded Null
              </Link>
              <Link
                href="/games/vault-sequence"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                Open Vault Sequence
              </Link>
              <Link
                href="/visual-album#featured-sequence"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                View Visual Album
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.28em] text-stone-400">
              <span className="rounded-full border border-[#f4c66a]/35 bg-[#f4c66a]/10 px-4 py-2 text-[#f4c66a]">
                Browser game access
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2">Public preview</span>
              <span className="rounded-full border border-white/10 px-4 py-2">Member unlock</span>
              <span className="rounded-full border border-white/10 px-4 py-2">Store license</span>
            </div>
          </div>
        </Section>
      </section>
      <GamesPanel />
    </>
  );
}
