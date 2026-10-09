import type { Metadata } from "next";
import Link from "next/link";
import { IronCountyGhostsLogo } from "@/components/iron-county-ghosts-logo";
import { LiveTeaserVideo } from "@/components/live-teaser-video";
import { getAiArtist } from "@/data/ai-artists";

export const metadata: Metadata = {
  title: "IRON COUNTY GHOSTS | Official Band Site",
  description:
    "Official IRON COUNTY GHOSTS website. Dust on the Altar is out now from KAMDRIDI RECORDS."
};

export default function IronCountyGhostsHomePage() {
  const artist = getAiArtist("iron-county-ghosts")!;
  const single = artist.releases.find((release) => release.audioUrl)!;

  return (
    <main>
      <section className="relative overflow-hidden px-5 pb-16 pt-28 md:pb-20 md:pt-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_12%,rgba(217,169,93,.18),transparent_32%),linear-gradient(180deg,#160d07,#080503_74%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 pt-4 md:pt-2 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="order-2 lg:order-1 lg:-mt-10">
            <p className="text-xs uppercase tracking-[0.34em] text-[#d9a95d]">KAMDRIDI RECORDS</p>
            <h1 className="sr-only">IRON COUNTY GHOSTS</h1>
            <div className="mt-5 flex flex-wrap gap-3">
              <span className="rounded-full border border-[#d9a95d]/35 bg-black/35 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#d9a95d]">
                Dark Country / Outlaw Americana
              </span>
              <span className="rounded-full border border-stone-500/30 bg-black/35 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-stone-200">
                Dust on the Altar - Out Now
              </span>
            </div>
            <div className="mt-4 max-w-[360px] md:max-w-3xl">
              <IronCountyGhostsLogo className="max-h-28 drop-shadow-[0_18px_34px_rgba(0,0,0,.75)] md:max-h-56" />
            </div>
            <p className="mt-6 max-w-3xl text-2xl leading-9 text-[#d9a95d]">{artist.slogan}</p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">{artist.positioningLine}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/iron-county-ghosts/music" className="rounded-full bg-[#d9a95d] px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-black">
                Listen Now
              </Link>
              <Link href="/iron-county-ghosts/epk" className="rounded-full border border-[#d9a95d]/40 px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#d9a95d]">
                View EPK
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="overflow-hidden rounded-[1.7rem] border border-[#d9a95d]/25 bg-[#120b06] p-3 shadow-[0_35px_110px_rgba(0,0,0,.55)]">
              <img
                src={artist.images.hero}
                alt="IRON COUNTY GHOSTS band with June Marlowe front and center"
                className="max-h-[72vh] w-full rounded-[1.25rem] object-contain object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#080503] px-5 pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[1.8rem] border border-[#d9a95d]/20 bg-black/30 p-4 md:grid-cols-[0.45fr_0.55fr] md:p-6">
          <div className="rounded-[1.35rem] border border-[#d9a95d]/15 bg-[#120b06] p-3">
            <img
              src={artist.images.cover}
              alt="Dust on the Altar cover art"
              className="max-h-[78vh] w-full rounded-[1rem] object-contain object-center"
            />
          </div>
          <div className="flex flex-col justify-center p-2 md:p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d9a95d]">Featured release</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] text-white md:text-6xl">
              {single.title}
            </h2>
            <p className="mt-4 text-sm uppercase tracking-[0.18em] text-stone-400">
              Single / Released / 2026
            </p>
            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#d9a95d]">Released May 23, 2026</p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300">{single.description}</p>
            <Link
              href="/iron-county-ghosts/music"
              className="mt-8 w-fit rounded-full bg-[#d9a95d] px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-black"
            >
              Listen to the single
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#080503] px-5 pb-20">
        <LiveTeaserVideo />
      </section>

      <section className="bg-[#080503] px-5 pb-24">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.9fr_1.1fr]">
          <figure className="rounded-[1.7rem] border border-[#d9a95d]/20 bg-[#120b06] p-3">
            <img
              src={artist.images.altWide}
              alt="IRON COUNTY GHOSTS live stage portrait"
              className="max-h-[68vh] w-full rounded-[1.25rem] object-contain object-top brightness-[1.05] contrast-[1.03] md:max-h-[72vh]"
            />
          </figure>
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Band profile</p>
            <h2 className="mt-5 font-display text-4xl uppercase tracking-[0.06em] text-white md:text-5xl">
              Dark country from Iron County
            </h2>
            <p className="mt-6 text-base leading-8 text-stone-300">
              Built around June Marlowe&apos;s young powerful lead voice, IRON COUNTY GHOSTS blends outlaw country,
              southern gothic Americana, and cinematic country-rock with dusty revenge stories and road-worn hooks.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
