import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  discoveryAudiences,
  discoveryMarkets,
  getAudience,
  getMarket,
  getPriorityTrack
} from "@/data/discovery";

type PageProps = {
  params: Promise<{ audience: string; market: string }>;
};

export function generateStaticParams() {
  return discoveryAudiences.flatMap((audience) =>
    discoveryMarkets.map((market) => ({
      audience: audience.slug,
      market: market.slug
    }))
  );
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { audience: audienceSlug, market: marketSlug } = await params;
  const audience = getAudience(audienceSlug);
  const market = getMarket(marketSlug);

  if (!audience || !market) return {};

  return {
    title: `KAM DRIDI ${audience.label} — ${market.name}`,
    description: `${audience.description} Market focus: ${market.name}. KAM DRIDI is a Montreal-based independent cinematic melodic hard rock artist.`,
    alternates: { canonical: `/discover/${audience.slug}/${market.slug}` },
    openGraph: {
      title: `KAM DRIDI ${audience.label} — ${market.name}`,
      description: `${audience.description} Market focus: ${market.name}.`
    }
  };
}

export default async function DiscoveryMarketPage({ params }: PageProps) {
  const { audience: audienceSlug, market: marketSlug } = await params;
  const audience = getAudience(audienceSlug);
  const market = getMarket(marketSlug);

  if (!audience || !market) notFound();

  const track = getPriorityTrack(market);
  const contactHref = `mailto:management@kamdridi.com?subject=${encodeURIComponent(`${audience.contactSubject} - ${market.name} - KAM DRIDI`)}`;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "KAM DRIDI",
    alternateName: "KAMDRIDI",
    url: "https://kamdridi.com",
    genre: ["Melodic Hard Rock", "Cinematic Melodic Hard Rock"],
    foundingLocation: { "@type": "Place", name: "Montreal, Canada" },
    subjectOf: {
      "@type": "CreativeWork",
      name: `${audience.label} access for ${market.name}`,
      about: track.title
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050505] px-5 py-20 text-white">
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/assets/images/discovery-hero-official.png')" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.84)_0%,rgba(0,0,0,0.58)_48%,rgba(0,0,0,0.36)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.18)_0%,rgba(0,0,0,0.28)_45%,rgba(0,0,0,0.72)_100%)]" />
      </div>
      <div className="relative z-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">
          {market.region} · {market.name} · {audience.label}
        </p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.05em] md:text-7xl">
          KAM DRIDI · {market.name}
        </h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">{audience.description}</p>
        {market.marketContext ? (
          <p className="mt-3 max-w-4xl text-sm leading-7 text-stone-400">{market.marketContext}</p>
        ) : null}
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[2rem] border border-red-900/50 bg-[radial-gradient(circle_at_15%_0%,rgba(220,38,38,0.12),transparent_34%),rgba(8,6,6,0.72)] p-6 shadow-2xl backdrop-blur-[3px] md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">Priority music</p>
          <h2 className="mt-4 text-4xl font-black uppercase tracking-[0.05em]">{track.title}</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">{track.description}</p>
          <div className="mt-6 grid gap-3 text-sm text-stone-300 sm:grid-cols-2">
            <p><span className="font-bold text-white">Artist:</span> KAM DRIDI</p>
            <p><span className="font-bold text-white">Album:</span> {track.album}</p>
            {"isrc" in track && track.isrc ? <p><span className="font-bold text-white">ISRC:</span> {track.isrc}</p> : null}
            {"duration" in track && track.duration ? <p><span className="font-bold text-white">Duration:</span> {track.duration}</p> : null}
            <p><span className="font-bold text-white">Origin:</span> Montreal, Canada</p>
            <p><span className="font-bold text-white">Genre:</span> Cinematic Melodic Hard Rock</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={track.href} className="rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-white hover:bg-red-500">Open track</Link>
            <Link href="/press" className="rounded-full border border-red-500/45 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-100 hover:bg-red-500/10">Press / EPK</Link>
          </div>
        </article>

        <aside className="rounded-[2rem] border border-white/15 bg-black/60 p-6 shadow-2xl backdrop-blur-[3px] md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.28em] text-red-500">Professional review checklist</p>
          <ul className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
            {audience.needs.map((need) => (
              <li key={need} className="flex gap-3"><span className="text-red-500">•</span><span>{need}</span></li>
            ))}
          </ul>
          <a href={contactHref} className="mt-8 inline-flex rounded-full border border-red-500/45 px-6 py-3 text-xs font-black uppercase tracking-[0.16em] text-red-100 hover:bg-red-500/10">
            Contact management
          </a>
        </aside>
      </section>

      <section className="mx-auto mt-12 max-w-6xl rounded-[2rem] border border-white/10 bg-black/55 p-6 backdrop-blur-[2px] md:p-9">
        <p className="text-sm leading-7 text-stone-300">
          This page is an official KAM DRIDI professional discovery route for {audience.label.toLowerCase()} review in {market.name}.
          It is designed to make verified artist, music and contact information easier for professional search systems and human buyers to interpret.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/discover" className="rounded-full border border-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-stone-200 hover:border-red-500/40">Discovery network</Link>
          <Link href="/industry" className="rounded-full border border-white/10 px-5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-stone-200 hover:border-red-500/40">Industry hub</Link>
        </div>
      </section>
      </div>
    </main>
  );
}
