import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui";
import { currentAct1Checkpoint } from "@/data/act1-checkpoints";
import { act1LiveStatus } from "@/data/act1-live-status";
import { gameExperiences } from "@/data/site";

export function GamesPanel() {
  const gildedNull = gameExperiences.find((game) => game.id === "the-gilded-null");

  return (
    <>
      {gildedNull ? (
        <Section id="the-gilded-null" className="py-10 md:py-12">
          <div className="game-banner overflow-hidden rounded-[32px] border border-[#f4c66a]/20 bg-black">
            <div className="relative aspect-[16/10] min-h-[360px] sm:aspect-[21/9]">
              <Image
                src={gildedNull.poster}
                alt="The Gilded Null launch art"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 1120px, 100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),rgba(0,0,0,0.32))]" />
            </div>
            <div className="grid gap-px border-t border-[#f4c66a]/15 bg-[#f4c66a]/15 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="bg-[linear-gradient(135deg,#120d06,#050403)] px-6 py-7 md:px-8 md:py-9">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[10px] uppercase tracking-[0.32em] text-[#f4c66a]">
                    ACT I 3D Runner - Development
                  </span>
                  <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-amber-200">
                    {currentAct1Checkpoint.label}
                  </span>
                  <span className="rounded-full border border-emerald-300/25 bg-emerald-300/10 px-3 py-1 text-[9px] uppercase tracking-[0.2em] text-emerald-200">
                    {act1LiveStatus.deploymentStatus}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-3xl uppercase leading-none tracking-[0.08em] text-[#f3dfb6] md:text-4xl">
                  Latest production checkpoint
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
                  Follow the real Godot ACT I runner as it moves from the archived Windows build
                  to a verified browser checkpoint. Existing public games remain untouched.
                </p>

                <div className="mt-6 grid gap-px overflow-hidden border border-white/10 bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
                  <div className="bg-black/80 p-4">
                    <span className="block text-[9px] uppercase tracking-[0.24em] text-stone-500">Source</span>
                    <span className="mt-2 block text-xs font-semibold text-stone-200">{act1LiveStatus.sourceRepo}</span>
                  </div>
                  <div className="bg-black/80 p-4">
                    <span className="block text-[9px] uppercase tracking-[0.24em] text-stone-500">Branch</span>
                    <span className="mt-2 block break-all text-xs font-semibold text-stone-200">{act1LiveStatus.sourceBranch}</span>
                  </div>
                  <div className="bg-black/80 p-4">
                    <span className="block text-[9px] uppercase tracking-[0.24em] text-stone-500">Verified source</span>
                    <span className="mt-2 block font-mono text-xs font-semibold text-[#f4c66a]">{act1LiveStatus.sourceCommit}</span>
                  </div>
                  <div className="bg-black/80 p-4">
                    <span className="block text-[9px] uppercase tracking-[0.24em] text-stone-500">Public build</span>
                    <span className="mt-2 block text-xs font-semibold text-stone-200">{act1LiveStatus.deployedCheckpoint}</span>
                  </div>
                </div>

                <p className="mt-4 max-w-3xl border-l border-[#f4c66a]/40 pl-4 text-xs leading-6 text-stone-400">
                  {act1LiveStatus.sourceMessage}. {act1LiveStatus.truthNote}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 text-[10px] uppercase tracking-[0.2em] text-stone-400">
                  <span className="border border-white/10 px-3 py-2">3 cameras verified</span>
                  <span className="border border-white/10 px-3 py-2">19 wall modules</span>
                  <span className="border border-white/10 px-3 py-2">500m+ tested</span>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4">
                  <Link
                    href="/games/the-gilded-null-act1"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f4c66a] px-7 py-3 text-xs font-bold uppercase tracking-[0.22em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989]"
                  >
                    View ACT I progress
                  </Link>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500">
                    Updated {act1LiveStatus.updatedAt}
                  </span>
                </div>
                <div className="mt-5 rounded-2xl border border-[#f4c66a]/15 bg-[#f4c66a]/5 p-4">
                  <span className="text-[9px] uppercase tracking-[0.24em] text-[#f4c66a]">Next production milestone</span>
                  <p className="mt-2 text-xs leading-6 text-stone-300">{act1LiveStatus.nextMilestone}</p>
                </div>
              </div>

              <div className="flex flex-col justify-between bg-black px-6 py-7 md:px-8 md:py-9">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                    Legacy playable build
                  </span>
                  <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-white">
                    Canvas 2D Corridor Protocol
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-stone-400">
                    The existing browser prototype stays online while the 3D checkpoint is validated.
                  </p>
                </div>
                <Link
                  href={gildedNull.launchUrl}
                  className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full border border-[#f4c66a]/55 px-6 py-3 text-xs uppercase tracking-[0.22em] text-[#f4c66a] transition hover:border-[#f4c66a] hover:bg-[#f4c66a]/10"
                >
                  Play Canvas prototype
                </Link>
              </div>
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}
