import type { Metadata } from "next";
import Link from "next/link";
import { listLabelApplications, listLabelReleases } from "@/lib/label-storage";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const artists = await listLabelApplications();
  const artist = artists.find((entry) => entry.id === slug);
  return {
    title: artist ? `${artist.artistName} - KAMDRIDI RECORDS` : "KAMDRIDI RECORDS Artist",
    description: artist?.bio || "KAMDRIDI RECORDS signed artist profile."
  };
}

export default async function LabelArtistPublicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [artists, releases] = await Promise.all([listLabelApplications(), listLabelReleases()]);
  const artist = artists.find((entry) => entry.id === slug && entry.status === "signed");
  if (!artist) {
    return (
      <main className="min-h-screen bg-[#050403] px-5 py-24 text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-display text-5xl uppercase tracking-[0.08em]">Artist not found</h1>
          <Link href="/label" className="mt-8 inline-flex text-[#f4c66a]">Back to label</Link>
        </div>
      </main>
    );
  }
  const artistReleases = releases.filter((release) => release.artistId === artist.id);
  return (
    <main className="min-h-screen bg-[#050403] px-5 py-24 text-white">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">KAMDRIDI RECORDS Artist</p>
        <h1 className="mt-5 font-display text-6xl uppercase tracking-[0.08em] md:text-8xl">{artist.artistName}</h1>
        <p className="mt-7 max-w-3xl text-base leading-8 text-stone-300">{artist.bio}</p>
        <p className="mt-5 text-sm text-stone-500">{artist.links}</p>
        <section className="mt-12 grid gap-4">
          {artistReleases.map((release) => (
            <div key={release.id} className="label-panel">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#f4c66a]">{release.status}</p>
                <h2 className="mt-2 text-2xl font-bold">{release.title}</h2>
                <p className="mt-2 text-sm text-stone-400">{release.releaseDate} / ISRC {release.isrc}</p>
              </div>
              <div className="rounded-full border border-[#f4c66a]/30 px-4 py-2 text-xs uppercase tracking-[0.2em] text-[#f4c66a]">Audio Player Ready</div>
            </div>
          ))}
          {!artistReleases.length ? <p className="text-sm text-stone-500">Discography coming soon.</p> : null}
        </section>
      </div>
    </main>
  );
}
