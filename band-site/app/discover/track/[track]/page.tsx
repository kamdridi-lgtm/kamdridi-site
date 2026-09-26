import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  discoveryAudiences,
  discoveryTrackHubs,
  getDiscoveryTrackHub
} from "@/data/discovery";

type PageProps = {
  params: Promise<{ track: string }>;
};

export function generateStaticParams() {
  return discoveryTrackHubs.map((track) => ({ track: track.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { track: trackSlug } = await params;
  const track = getDiscoveryTrackHub(trackSlug);
  if (!track) return {};

  return {
    title: `KAM DRIDI — ${track.title} Professional Discovery`,
    description: track.description,
    alternates: { canonical: `/discover/track/${track.slug}` }
  };
}

export default async function DiscoveryTrackPage({ params }: PageProps) {
  const { track: trackSlug } = await params;
  const track = getDiscoveryTrackHub(trackSlug);
  if (!track) notFound();

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-20 text-white">
      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">{track.subtitle}</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.05em] md:text-7xl">
          KAM DRIDI · {track.title}
        </h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">{track.description}</p>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <article className="rounded-[2rem] border border-red-900/40 bg-black/55 p-6 md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">Verified track data</p>
          <div className="mt-6 grid gap-3 text-sm text-stone-300 sm:grid-cols-2">
            <p><span className="font-bold text-white">Artist:</span> KAM DRIDI</p>
            <p><span className="font-bold text-white">Album:</span> {track.album}</p>
            {"isrc" in track && track.isrc ? <p><span className="font-bold text-white">ISRC:</span> {track.isrc}</p> : null}
            {"duration" in track && track.duration ? <p><span className="font-bold text-white">Duration:</span> {track.duration}</p> : null}
            <p><span className="font-bold text-white">Genre:</span> {track.genre}</p>
            <p><span className="font-bold text-white">Origin:</span> Montreal, Canada</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={track.href} className="rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] hover:bg-red-500">
              Open track
            </Link>
            <Link href="/press" className="rounded-full border border-red-500/45 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-100 hover:bg-red-500/10">
              Press / EPK
            </Link>
            <Link href="/industry" className="rounded-full border border-white/10 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-stone-200 hover:border-red-500/40">
              Industry hub
            </Link>
          </div>
        </article>

        <aside className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">Professional routes</p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Open the market-specific route that matches the professional use case.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {track.markets.map((market) =>
              discoveryAudiences.map((audience) => (
                <Link
                  key={`${audience.slug}-${market.slug}`}
                  href={`/discover/${audience.slug}/${market.slug}`}
                  className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-stone-200 hover:border-red-500/50"
                >
                  {market.name} · {audience.slug}
                </Link>
              ))
            )}
          </div>
        </aside>
      </section>

      <section className="mx-auto mt-12 max-w-6xl">
        <Link href="/discover" className="text-xs font-black uppercase tracking-[0.16em] text-red-300 hover:text-white">
          ← Back to discovery network
        </Link>
      </section>
    </main>
  );
}
