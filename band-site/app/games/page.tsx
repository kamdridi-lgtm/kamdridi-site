import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GamesPanel } from "@/components/games-panel";

const gamesHeroVideo = "/videos/games-hero-20260516.mp4";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Explore game development inside the KAMDRIDI fan universe, including The Gilded Null and deeper protocol access for members."
};

export default function GamesPage() {
  return (
    <>
      <section className="overflow-hidden border-b border-white/10">
        <div className="relative isolate">
          <video
            className="h-[56vh] min-h-[420px] w-full object-cover object-[center_28%] brightness-[1.02] contrast-[1.04] saturate-[1.02] md:h-[74vh] lg:h-[80vh]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/images/games/gilded-null-master.png"
            aria-label="KAMDRIDI games trailer"
          >
            <source src={gamesHeroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.08),transparent_30%)]" />
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.18))]" />
        </div>

        <div className="relative overflow-hidden border-t border-white/10 bg-black">
          <div className="relative aspect-[16/9] min-h-[320px] w-full md:min-h-[520px]">
            <Image
              src="/assets/images/games/act-ii-war-machines-wide.png"
              alt="Act II War Machines"
              fill
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="border-t border-[#f4c66a]/20 bg-[linear-gradient(180deg,#080604,#020202)] px-5 py-9 md:px-10 md:py-11">
            <div className="mx-auto grid max-w-6xl gap-7 lg:grid-cols-[1fr_0.9fr] lg:items-end">
              <div className="max-w-3xl">
                <p className="text-xs uppercase tracking-[0.42em] text-[#f4c66a]">
                  KAMDRIDI game development
                </p>
                <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.06em] text-[#f3dfb6] md:text-6xl">
                  Play the signal. Survive the machine.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-300 md:text-base">
                  The next KAMDRIDI game builds are in active production with exclusive music and
                  a larger cinematic world. Compare the Codex and Qwen War Machines experiments,
                  then follow The Gilded Null — Act I as the next build takes shape.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                <Link
                  href="/games/war-machines"
                  className="group border border-[#f4c66a]/35 bg-black/45 p-4 transition hover:-translate-y-0.5 hover:border-[#f4c66a] hover:bg-[#f4c66a]/10"
                >
                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#00f5ff]">
                    Version Codex
                  </span>
                  <span className="mt-2 block font-display text-2xl uppercase leading-none tracking-[0.08em] text-[#f3dfb6]">
                    Epic v7
                  </span>
                  <span className="mt-3 block text-xs leading-5 text-stone-300">
                    3 bosses, progression, audio reactive, ecosystem sync, overdrive and victory ranks.
                  </span>
                  <span className="mt-4 inline-flex min-h-10 items-center justify-center bg-[#f4c66a] px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-black transition group-hover:bg-[#ffd989]">
                    Open Codex
                  </span>
                </Link>

                <Link
                  href="/games/war-machines-qwen"
                  className="group border border-[#00f5ff]/30 bg-black/45 p-4 transition hover:-translate-y-0.5 hover:border-[#00f5ff] hover:bg-[#00f5ff]/10"
                >
                  <span className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">
                    Version Qwen
                  </span>
                  <span className="mt-2 block font-display text-2xl uppercase leading-none tracking-[0.08em] text-[#f3dfb6]">
                    Original Juice v4
                  </span>
                  <span className="mt-3 block text-xs leading-5 text-stone-300">
                    Qwen original file: title screen, dash, hitstop, dynamic audio, minions and powerups. Separate from Codex.
                  </span>
                  <span className="mt-4 inline-flex min-h-10 items-center justify-center bg-[#00f5ff] px-4 text-[10px] font-bold uppercase tracking-[0.22em] text-black transition group-hover:bg-[#8ff9ff]">
                    Open Qwen
                  </span>
                </Link>

                <Link
                  href="/games/the-gilded-null"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#f4c66a]/55 bg-[#f4c66a]/10 px-7 py-3 text-sm uppercase tracking-[0.24em] text-[#f4c66a] transition hover:-translate-y-0.5 hover:border-[#f4c66a] hover:bg-[#f4c66a]/15 sm:col-span-2 lg:col-span-1 xl:col-span-2"
                >
                  The Gilded Null · In Development
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <GamesPanel />
    </>
  );
}

