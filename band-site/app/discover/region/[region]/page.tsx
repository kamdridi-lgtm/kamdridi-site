import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  discoveryAudiences,
  discoveryRegions,
  getMarketsForRegion,
  getRegion
} from "@/data/discovery";

type PageProps = {
  params: Promise<{ region: string }>;
};

export function generateStaticParams() {
  return discoveryRegions.map((region) => ({ region: region.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { region: regionSlug } = await params;
  const region = getRegion(regionSlug);
  if (!region) return {};

  return {
    title: `KAM DRIDI Professional Discovery — ${region.name}`,
    description: `Professional KAM DRIDI access across ${region.name}: radio, sync licensing, festival booking and press routes.`,
    alternates: { canonical: `/discover/region/${region.slug}` }
  };
}

export default async function RegionDiscoveryPage({ params }: PageProps) {
  const { region: regionSlug } = await params;
  const region = getRegion(regionSlug);
  if (!region) notFound();

  const markets = getMarketsForRegion(region.name);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-20 text-white">
      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">
          Regional professional discovery
        </p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.05em] md:text-7xl">
          KAM DRIDI · {region.name}
        </h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">
          Official regional access point for radio programmers, music supervisors, festival buyers,
          promoters, editors and other professional music contacts reviewing KAM DRIDI.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-6xl">
        <h2 className="text-2xl font-black uppercase tracking-[0.05em]">Markets</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {markets.map((market) => (
            <article key={market.slug} className="rounded-[1.5rem] border border-white/10 bg-white/[0.035] p-5">
              <h3 className="text-xl font-black uppercase tracking-[0.04em]">{market.name}</h3>
              {market.marketContext ? (
                <p className="mt-3 text-sm leading-7 text-stone-400">{market.marketContext}</p>
              ) : null}
              <div className="mt-5 flex flex-wrap gap-2">
                {discoveryAudiences.map((audience) => (
                  <Link
                    key={audience.slug}
                    href={`/discover/${audience.slug}/${market.slug}`}
                    className="rounded-full border border-white/10 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-stone-200 hover:border-red-500/50"
                  >
                    {audience.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-6xl rounded-[2rem] border border-red-900/35 bg-black/40 p-6 md:p-9">
        <div className="flex flex-wrap gap-3">
          <Link href="/discover" className="rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">
            Discovery Network
          </Link>
          <Link href="/industry" className="rounded-full border border-red-500/40 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">
            Industry Hub
          </Link>
        </div>
      </section>
    </main>
  );
}
