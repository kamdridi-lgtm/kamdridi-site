import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KAM DRIDI — Radio Airplay & Broadcast Assets",
  description: "Official radio page for KAM DRIDI with priority single metadata, broadcast assets and press access.",
  alternates: { canonical: "https://kamdridi.com/radio" },
};

export default function RadioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicRecording",
    name: "OUR LOST DREAMS",
    url: "https://kamdridi.com/our-lost-dreams",
    duration: "PT4M55S",
    isrcCode: "QZZ7M2627617",
    genre: ["Melodic Hard Rock", "Cinematic Melodic Hard Rock"],
    byArtist: { "@type": "MusicGroup", name: "KAM DRIDI", url: "https://kamdridi.com" },
    inAlbum: { "@type": "MusicAlbum", name: "Echoes Unearthed" },
  };

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">Radio programmers · Music directors · Specialty shows</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none md:text-7xl">KAM DRIDI — Radio</h1>
        <p className="mt-6 text-lg leading-8 text-stone-300">Official broadcast information for KAM DRIDI. Priority track outside Japan: OUR LOST DREAMS. Japan campaign priority: WAR MACHINES.</p>
        <section className="mt-10 rounded-[2rem] border border-red-900/40 bg-black/40 p-7 md:p-9">
          <h2 className="text-3xl font-black uppercase">OUR LOST DREAMS</h2>
          <div className="mt-5 grid gap-2 text-sm text-stone-300 md:grid-cols-2">
            <p>Artist: KAM DRIDI</p><p>Album: Echoes Unearthed</p>
            <p>Genre: Cinematic Melodic Hard Rock</p><p>Duration: 4:55</p>
            <p>ISRC: QZZ7M2627617</p><p>Location: Montreal, Canada</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/our-lost-dreams" className="rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">Listen / Download</Link>
            <Link href="/press" className="rounded-full border border-red-500/40 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">Press / EPK</Link>
            <a href="mailto:management@kamdridi.com?subject=KAM%20DRIDI%20Radio%20Inquiry" className="rounded-full border border-white/15 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">Radio contact</a>
          </div>
        </section>
      </section>
    </main>
  );
}
