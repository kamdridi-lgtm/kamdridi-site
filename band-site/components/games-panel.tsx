import Image from "next/image";
import Link from "next/link";
import { GlassCard, Section, SectionHeading } from "@/components/ui";
import { gameExperiences } from "@/data/site";

export function GamesPanel() {
  const gildedNull = gameExperiences.find((game) => game.id === "the-gilded-null");

  return (
    <>
      <Section id="games-protocol">
        <SectionHeading
          eyebrow="Games Protocol"
          title="Launcher access for the Echoes Unearthed fan universe"
          description="Two protocol entries, clean launch actions, and membership-aware access notes built to slot directly into the live fan-club ecosystem."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {gameExperiences.map((game) => (
            <GlassCard key={game.id} className="overflow-hidden p-0">
              <div className="relative h-80">
                <Image
                  src={game.poster}
                  alt={`${game.title} poster`}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.92))]" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">
                    {game.subtitle}
                  </p>
                  <h3 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">
                    {game.title}
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-7 text-stone-300">
                    {game.description}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-stone-400">
                  <span className="rounded-full border border-white/10 px-3 py-2">
                    {game.membership}
                  </span>
                  {game.comingSoon ? (
                    <span className="rounded-full border border-[#f4c66a]/30 bg-[#f4c66a]/10 px-3 py-2 text-[#f4c66a]">
                      Collector Preview
                    </span>
                  ) : null}
                </div>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={game.launchUrl}
                    target={game.launchUrl.startsWith("/") ? undefined : "_blank"}
                    rel={game.launchUrl.startsWith("/") ? undefined : "noreferrer"}
                    className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-6 py-3 text-xs uppercase tracking-[0.25em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989]"
                  >
                    {game.launcherLabel}
                  </a>
                  <Link
                    href="/fan-club"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
                  >
                    Unlock Access
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      {gildedNull ? (
        <Section id="the-gilded-null" className="pt-0">
          <div className="game-banner overflow-hidden rounded-[32px] border border-[#f4c66a]/20 bg-black">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="relative min-h-[460px]">
                <Image
                  src={gildedNull.poster}
                  alt="The Gilded Null poster"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.15),rgba(0,0,0,0.78))]" />
              </div>
              <div className="relative flex flex-col justify-center p-8 sm:p-12">
                <p className="text-xs uppercase tracking-[0.55em] text-[#f4c66a]">
                  Corridor Protocol
                </p>
                <h2 className="mt-6 font-display text-5xl uppercase tracking-[0.08em] text-white md:text-7xl">
                  THE GILDED NULL
                </h2>
                <p className="mt-4 text-xl uppercase tracking-[0.28em] text-stone-300">
                  Corridor Protocol
                </p>
                <p className="mt-8 max-w-xl text-base leading-8 text-stone-300">
                  Hold the line. Collect the gold. Outrun the darkness.
                </p>
                <div className="mt-10">
                  <a
                    href={gildedNull.launchUrl}
                    target={gildedNull.launchUrl.startsWith("/") ? undefined : "_blank"}
                    rel={gildedNull.launchUrl.startsWith("/") ? undefined : "noreferrer"}
                    className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-6 py-3 text-sm uppercase tracking-[0.25em] text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffd989]"
                  >
                    INITIATE PROTOCOL
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}
