import type { Metadata } from "next";
import Link from "next/link";
import { IronCountyGhostsLogo } from "@/components/iron-county-ghosts-logo";
import { aiArtists, getAiArtist } from "@/data/ai-artists";

export function generateStaticParams() {
  return aiArtists.map((artist) => ({ slug: artist.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const artist = getAiArtist(slug);
  return {
    title: artist ? `${artist.name} - KAMDRIDI RECORDS` : "Artist - KAMDRIDI RECORDS",
    description: artist?.positioningLine || "Artist project from KAMDRIDI RECORDS."
  };
}

export default async function AiArtistGatewayPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const artist = getAiArtist(slug);

  if (!artist) {
    return (
      <main className="min-h-screen bg-[#050403] px-5 py-24 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl uppercase tracking-[0.08em]">Artist not found</h1>
          <Link href="/label/ai-artists" className="mt-8 inline-flex text-[#f4c66a]">Back to AI roster</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#050403] text-white">
      <section className="relative overflow-hidden px-5 py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(5,4,3,.96), rgba(5,4,3,.68), rgba(5,4,3,.96)), url(${artist.images.hero})`,
            backgroundPosition: "center",
            backgroundSize: "cover"
          }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_18%,rgba(244,198,106,0.18),transparent_32%),linear-gradient(180deg,rgba(5,4,3,0),#050403_96%)]" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.95fr_0.7fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.38em] text-[#f4c66a]">KAMDRIDI RECORDS presents</p>
            <div className="mt-5 inline-flex rounded-full border border-[#f4c66a]/35 bg-black/35 px-4 py-2 text-[10px] uppercase tracking-[0.22em] text-[#f4c66a]">
              KAMDRIDI RECORDS ROSTER
            </div>
            {artist.slug === "iron-county-ghosts" ? (
              <div className="mt-6 max-w-4xl">
                <IronCountyGhostsLogo className="drop-shadow-[0_18px_34px_rgba(0,0,0,.75)]" />
              </div>
            ) : (
              <h1 className="mt-6 font-display text-5xl uppercase leading-none tracking-[0.07em] md:text-8xl">
                {artist.name}
              </h1>
            )}
            <p className="mt-5 max-w-3xl text-xl leading-9 text-stone-200">
              Dark country / southern gothic Americana project.
            </p>
            <p className="mt-4 text-sm uppercase tracking-[0.2em] text-[#f4c66a]">
              First single: Dust on the Altar. Released May 23, 2026.
            </p>
            <p className="mt-7 max-w-3xl text-base leading-8 text-stone-300">{artist.positioningLine}</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Link href="/iron-county-ghosts" className="rounded-full bg-[#f4c66a] px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-black">
                Visit Official Site
              </Link>
              <Link href="/iron-county-ghosts/music" className="rounded-full border border-[#f4c66a]/40 px-7 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#f4c66a]">
                Listen Now
              </Link>
            </div>
          </div>
          <div className="rounded-[1.8rem] border border-[#f4c66a]/20 bg-black/45 p-5 shadow-[0_35px_110px_rgba(0,0,0,.5)]">
            <img
              src={artist.images.cover}
              alt="Dust on the Altar cover art"
              className="h-auto w-full rounded-[1.25rem] border border-[#f4c66a]/20 object-contain object-top"
            />
            <div className="mt-5">
              <p className="text-[10px] uppercase tracking-[0.26em] text-[#f4c66a]">Release status</p>
              <p className="mt-2 text-lg font-bold text-white">Dust on the Altar / Released</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-stone-500">May 23, 2026 / KAMDRIDI RECORDS</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
