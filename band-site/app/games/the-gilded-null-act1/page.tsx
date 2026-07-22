import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { act1Checkpoints, currentAct1Checkpoint } from "@/data/act1-checkpoints";

export const metadata: Metadata = {
  title: "The Gilded Null - ACT I Development",
  description:
    "Track verified development checkpoints for KAMDRIDI - The Gilded Null - ACT I 3D Runner."
};

export default function TheGildedNullAct1Page() {
  const checkpoint = currentAct1Checkpoint;
  const previousCheckpoints = act1Checkpoints.slice(1);

  return (
    <>
      <section className="relative overflow-hidden border-b border-[#f4c66a]/20 bg-black">
        <div className="relative min-h-[68svh]">
          <Image
            src="/assets/images/games/gilded-null-master.png"
            alt="The Gilded Null ACT I"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.35)_38%,#050403_94%)]" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10 sm:px-8 md:pb-14">
            <p className="text-[11px] uppercase tracking-[0.42em] text-[#f4c66a]">
              The Gilded Null - Corridor Protocol
            </p>
            <h1 className="mt-4 max-w-5xl font-display text-5xl uppercase leading-[0.92] tracking-[0.06em] text-[#f3dfb6] md:text-7xl">
              ACT I 3D Development Checkpoints
            </h1>
            <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-300 md:text-base">
              Every public checkpoint is tied to a saved Git commit. The previous version stays
              recoverable, so progress can be inspected without risking the stable game.
            </p>
          </div>
        </div>
      </section>

      <main className="bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.07),transparent_34%),#030303] px-5 py-10 sm:px-8 md:py-14">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-px border border-[#f4c66a]/20 bg-[#f4c66a]/20 lg:grid-cols-[1.15fr_0.85fr]">
            <section className="bg-[#080604] p-6 md:p-9">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">
                  {checkpoint.label}
                </span>
                <span className="border border-amber-300/30 bg-amber-300/10 px-3 py-2 text-[9px] uppercase tracking-[0.22em] text-amber-200">
                  {checkpoint.statusLabel}
                </span>
              </div>
              <h2 className="mt-6 font-display text-4xl uppercase leading-none tracking-[0.07em] text-white md:text-5xl">
                Current verified state
              </h2>
              <ul className="mt-7 grid gap-3 text-sm leading-6 text-stone-300 sm:grid-cols-2">
                {checkpoint.verified.map((item) => (
                  <li key={item} className="border border-white/10 bg-white/[0.025] p-4">
                    <span className="mr-2 text-[#f4c66a]">◆</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-3">
                {checkpoint.playUrl ? (
                  <Link
                    href={checkpoint.playUrl}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f4c66a] px-7 py-3 text-xs font-bold uppercase tracking-[0.22em] text-black transition hover:bg-[#ffd989]"
                  >
                    Play this checkpoint
                  </Link>
                ) : (
                  <span className="inline-flex min-h-12 items-center justify-center rounded-full border border-amber-300/35 bg-amber-300/10 px-7 py-3 text-xs uppercase tracking-[0.2em] text-amber-100">
                    Browser build under validation
                  </span>
                )}
                <Link
                  href="/games"
                  className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/20 px-7 py-3 text-xs uppercase tracking-[0.22em] text-white transition hover:border-white/50"
                >
                  Back to Games
                </Link>
              </div>
            </section>

            <aside className="bg-black p-6 md:p-9">
              <p className="text-[10px] uppercase tracking-[0.32em] text-stone-500">
                Immutable checkpoint record
              </p>
              <dl className="mt-5 grid gap-4 text-sm">
                <div className="border-b border-white/10 pb-4">
                  <dt className="text-[10px] uppercase tracking-[0.24em] text-stone-500">Updated</dt>
                  <dd className="mt-2 text-stone-200">{checkpoint.updatedAt}</dd>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <dt className="text-[10px] uppercase tracking-[0.24em] text-stone-500">Gameplay source</dt>
                  <dd className="mt-2 font-mono text-[#f4c66a]">{checkpoint.sourceCommit}</dd>
                </div>
                <div className="border-b border-white/10 pb-4">
                  <dt className="text-[10px] uppercase tracking-[0.24em] text-stone-500">Export pipeline</dt>
                  <dd className="mt-2 font-mono text-[#f4c66a]">{checkpoint.pipelineCommit}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.24em] text-stone-500">Source branch</dt>
                  <dd className="mt-2 break-all font-mono text-xs text-stone-300">{checkpoint.branch}</dd>
                </div>
              </dl>
            </aside>
          </div>

          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-[#f4c66a]">Visual record</p>
                <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white md:text-4xl">
                  Latest development captures
                </h2>
              </div>
              <p className="max-w-xl text-xs leading-6 text-stone-500">
                Raw development captures, not final marketing art. They document the actual running build.
              </p>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {checkpoint.captures.map((capture) => (
                <figure key={capture.src} className="overflow-hidden border border-white/10 bg-black">
                  <div className="relative aspect-video">
                    <Image src={capture.src} alt={capture.alt} fill className="object-cover" sizes="(min-width: 1024px) 50vw, 100vw" />
                  </div>
                  <figcaption className="border-t border-white/10 px-5 py-4 text-[10px] uppercase tracking-[0.24em] text-stone-400">
                    {capture.caption}
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>

          <section className="mt-10 border border-white/10 bg-black p-6 md:p-9">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#f4c66a]">Checkpoint archive</p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
              Previous playable builds
            </h2>
            <div className="mt-6 grid gap-3">
              {previousCheckpoints.map((previous) => (
                <Link
                  key={previous.id}
                  href={previous.playUrl ?? "/games/the-gilded-null-act1"}
                  className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-white/[0.025] p-5 transition hover:border-[#f4c66a]/50"
                >
                  <span>
                    <span className="block text-xs uppercase tracking-[0.28em] text-[#f4c66a]">
                      {previous.label}
                    </span>
                    <span className="mt-2 block text-xs text-stone-500">
                      Source {previous.sourceCommit} · {previous.statusLabel}
                    </span>
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.24em] text-stone-300">
                    Play archive →
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-10 border border-white/10 bg-white/[0.025] p-6 md:p-9">
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#f4c66a]">Next checkpoint</p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
              Promotion requirements
            </h2>
            <ul className="mt-6 grid gap-3 text-sm text-stone-300 md:grid-cols-3">
              {checkpoint.next.map((item) => (
                <li key={item} className="border-l border-[#f4c66a]/50 pl-4 leading-6">
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </main>
    </>
  );
}
