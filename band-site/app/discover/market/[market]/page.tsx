import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  discoveryAudiences,
  discoveryMarkets,
  getMarket,
  getPriorityTrack
} from "@/data/discovery";

type PageProps = {
  params: Promise<{ market: string }>;
};

export function generateStaticParams() {
  return discoveryMarkets.map((market) => ({ market: market.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { market: marketSlug } = await params;
  const market = getMarket(marketSlug);
  if (!market) return {};

  return {
    title: `KAM DRIDI Professional Discovery — ${market.name}`,
    description: `Official KAM DRIDI professional access for ${market.name}: radio, sync licensing, festival booking and press.`,
    alternates: { canonical: `/discover/market/${market.slug}` }
  };
}

export default async function DiscoveryMarketHubPage({ params }: PageProps) {
  const { market: marketSlug } = await params;
  const market = getMarket(marketSlug);
  if (!market) notFound();

  const track = getPriorityTrack(market);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-5 py-20 text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -inset-8 scale-110 bg-cover bg-top bg-no-repeat opacity-25 blur-[3px]"
          style={{ backgroundImage: "url('/assets/images/discovery-hero-official.png')" }}
        />
        <div
          className="absolute inset-0 bg-no-repeat"
          style={{
            backgroundImage: "url('/assets/images/discovery-hero-official.png')",
            backgroundSize: "auto 118vh",
            backgroundPosition: "right 170px"
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.92)_0%,rgba(0,0,0,0.72)_42%,rgba(0,0,0,0.36)_72%,rgba(0,0,0,0.18)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14)_0%,rgba(0,0,0,0.22)_48%,rgba(0,0,0,0.74)_100%)]" />
      </div>

      <div className="relative z-10">
        <section className="mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">
            {market.region} · Professional market hub
          </p>
          <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.05em] md:text-7xl">
            KAM DRIDI · {market.name}
          </h1>
          <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">
            One official access point for professional review in {market.name}. Choose the route that matches your role.
          </p>
          {market.marketContext ? (
            <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-400">{market.marketContext}</p>
          ) : null}
        </section>

        <section className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2">
          {discoveryAudiences.map((audience) => (
            <Link
              key={audience.slug}
              href={`/discover/${audience.slug}/${market.slug}`}
              className="rounded-[2rem] border border-white/10 bg-black/60 p-6 backdrop-blur-[3px] transition hover:border-red-500/50 md:p-8"
            >
              <p className="text-xs uppercase tracking-[0.28em] text-red-500">{audience.eyebrow}</p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.05em]">{audience.label}</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">{audience.description}</p>
              <span className="mt-6 inline-flex rounded-full border border-red-500/40 px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] text-red-100">
                Open {audience.label}
              </span>
            </Link>
          ))}
        </section>

        <section className="mx-auto mt-12 max-w-6xl rounded-[2rem] border border-red-900/40 bg-black/60 p-6 backdrop-blur-[3px] md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">Priority music</p>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.05em]">{track.title}</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">{track.description}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={track.href} className="rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-red-500">
              Open track
            </Link>
            <Link href="/press" className="rounded-full border border-red-500/45 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-100 hover:bg-red-500/10">
              Press / EPK
            </Link>
            <Link href="/discover" className="rounded-full border border-white/15 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-stone-200 hover:border-red-500/40">
              Discovery network
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
