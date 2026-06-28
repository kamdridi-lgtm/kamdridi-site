import type { Metadata } from "next";
import Link from "next/link";
import { listLabelApplications, listLabelReleases } from "@/lib/label-storage";

export function buildLabelMetadata(path = "/label"): Metadata {
  const url = `https://kamdridi.com${path}`;
  return {
    title: "KAMDRIDI RECORDS - Digital Label",
    description: "Official KAMDRIDI RECORDS roster, releases, artist applications, and cinematic music catalog.",
    alternates: { canonical: url },
    openGraph: {
      title: "KAMDRIDI RECORDS",
      description: "Digital label for cinematic heavy artists and the Echoes Unearthed universe.",
      url,
      type: "website"
    }
  };
}

export async function LabelSeoHome() {
  const [applications, releases] = await Promise.all([listLabelApplications(), listLabelReleases()]);
  const signed = applications.filter((app) => app.status === "signed");
  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-20 lg:grid-cols-2">
      <div className="label-panel">
        <p className="text-xs uppercase tracking-[0.32em] text-[#f4c66a]">Roster</p>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">Signed Artists</h2>
        <div className="mt-6 grid gap-3">
          {signed.map((artist) => (
            <Link key={artist.id} href={`/label/artist/${artist.id}`} className="rounded-2xl border border-white/10 p-4 text-sm text-stone-300 hover:border-[#f4c66a]/40">
              {artist.artistName}
            </Link>
          ))}
          {!signed.length ? <p className="text-sm text-stone-500">Roster opens after the first signature.</p> : null}
        </div>
      </div>
      <div className="label-panel">
        <p className="text-xs uppercase tracking-[0.32em] text-[#f4c66a]">Catalog</p>
        <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">Releases</h2>
        <div className="mt-6 grid gap-3">
          {releases.slice(0, 8).map((release) => (
            <div key={release.id} className="rounded-2xl border border-white/10 p-4 text-sm text-stone-300">
              {release.title} / {release.status}
            </div>
          ))}
          {!releases.length ? <p className="text-sm text-stone-500">No public release yet.</p> : null}
        </div>
      </div>
    </section>
  );
}
