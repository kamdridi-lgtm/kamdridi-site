import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KAM DRIDI — Sync Licensing | Film, TV, Games, Advertising",
  description: "Official sync licensing page for KAM DRIDI music for film, television, trailers, games, advertising and visual media.",
  alternates: { canonical: "https://kamdridi.com/sync" },
};

export default function SyncPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-5 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">Music supervisors · Agencies · Film · TV · Games · Trailers</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none md:text-7xl">KAM DRIDI — Sync Licensing</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">Cinematic melodic hard rock from Montreal, Canada. Official music and professional materials are available for legitimate synchronization and licensing review.</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
            <h2 className="text-2xl font-black uppercase">Primary track</h2>
            <p className="mt-4 text-stone-300">OUR LOST DREAMS · 4:55 · ISRC QZZ7M2627618 · Echoes Unearthed.</p>
            <Link href="/our-lost-dreams" className="mt-6 inline-flex rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">Open track package</Link>
          </section>
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7">
            <h2 className="text-2xl font-black uppercase">Use cases</h2>
            <p className="mt-4 text-stone-300">Film, television, trailers, games, advertising, branded content and other visual-media placements.</p>
            <a href="mailto:management@kamdridi.com?subject=KAM%20DRIDI%20Sync%20Licensing%20Inquiry" className="mt-6 inline-flex rounded-full border border-red-500/40 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">Licensing inquiry</a>
          </section>
        </div>
        <p className="mt-8 text-sm leading-7 text-stone-400">No placement, clearance or rights availability is implied until confirmed in writing for the specific project.</p>
      </section>
    </main>
  );
}
