import type { Metadata } from "next";
import Link from "next/link";
import { discoveryAudiences, discoveryMarkets, discoveryRegions, discoveryRouteCount, discoveryTrackHubs } from "@/data/discovery";

export const metadata: Metadata = {
  title: "KAM DRIDI Professional Discovery Network",
  description:
    "Professional discovery routes for KAM DRIDI radio, sync, festivals and press across international markets.",
  alternates: { canonical: "/discover" }
};

export default function DiscoverIndexPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-20 text-white">
      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">Professional discovery network</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.05em] md:text-7xl">KAM DRIDI · DISCOVER</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">
          A structured professional access layer for radio programmers, music supervisors, festival buyers and media professionals.
          The network currently publishes {discoveryRouteCount} focused market routes from one verified data source.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-6xl">
        <h2 className="text-2xl font-black uppercase tracking-[0.05em]">Priority tracks</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {discoveryTrackHubs.map((track) => (
            <Link
              key={track.slug}
              href={`/discover/track/${track.slug}`}
              className="rounded-[2rem] border border-red-900/35 bg-black/45 p-6 transition hover:border-red-500/50 md:p-8"
            >
              <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">{track.subtitle}</p>
              <h3 className="mt-4 text-3xl font-black uppercase tracking-[0.05em]">{track.title}</h3>
              <p className="mt-4 text-sm leading-7 text-stone-300">{track.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2">
        {discoveryAudiences.map((audience) => (
          <article key={audience.slug} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.28em] text-red-500">{audience.eyebrow}</p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.05em]">{audience.label}</h2>
            <p className="mt-4 text-sm leading-7 text-stone-300">{audience.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {discoveryMarkets.slice(0, 6).map((market) => (
                <Link
                  key={market.slug}
                  href={`/discover/${audience.slug}/${market.slug}`}
                  className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-200 hover:border-red-500/50 hover:text-white"
                >
                  {market.name}
                </Link>
              ))}
            </div>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-12 max-w-6xl">
        <h2 className="text-2xl font-black uppercase tracking-[0.05em]">Regional hubs</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {discoveryRegions.map((region) => (
            <Link
              key={region.slug}
              href={`/discover/region/${region.slug}`}
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-stone-200 hover:border-red-500/50"
            >
              {region.name}
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl rounded-[2rem] border border-red-900/35 bg-black/40 p-6 md:p-9">
        <h2 className="text-2xl font-black uppercase tracking-[0.05em]">International market coverage</h2>
        <div className="mt-6 flex flex-wrap gap-2">
          {discoveryMarkets.map((market) => (
            <span key={market.slug} className="rounded-full border border-white/10 px-4 py-2 text-xs text-stone-300">
              {market.name}
            </span>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/industry" className="rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-red-500">Industry hub</Link>
          <Link href="/press" className="rounded-full border border-red-500/45 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-100 hover:bg-red-500/10">Press / EPK</Link>
        </div>
      </section>
    </main>
  );
}
