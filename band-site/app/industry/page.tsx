import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "KAM DRIDI — Industry Hub | Radio, Sync, Festivals, Press",
  description: "Official professional access point for KAM DRIDI: radio, sync licensing, festival booking, press, EPK and verified music metadata.",
  alternates: { canonical: "https://kamdridi.com/industry" },
};

const cards = [
  ["Radio", "/radio", "Broadcast-ready information, priority single, metadata and EPK."],
  ["Sync Licensing", "/sync", "Music licensing for film, TV, trailers, games and advertising."],
  ["Festival Booking", "/festival-booking", "Live availability, artist positioning and booking materials."],
  ["Press / EPK", "/press", "Official biography, assets, music and professional contact."],
  ["Discovery Network", "/discover", "Market-specific professional routes for radio, sync, festivals and press."],
];

export default function IndustryPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "KAM DRIDI",
    url: "https://kamdridi.com",
    genre: ["Melodic Hard Rock", "Cinematic Melodic Hard Rock"],
    foundingLocation: { "@type": "Place", name: "Montreal, Quebec, Canada" },
    sameAs: [
      "https://youtube.com/@kamdridi",
      "https://instagram.com/kamdridi",
      "https://tiktok.com/@kamdridi",
      "https://x.com/kamdridi"
    ],
    track: {
      "@type": "MusicRecording",
      name: "OUR LOST DREAMS",
      duration: "PT4M55S",
      isrcCode: "QZZ7M2627617",
      byArtist: { "@type": "MusicGroup", name: "KAM DRIDI" },
      inAlbum: { "@type": "MusicAlbum", name: "Echoes Unearthed" },
      url: "https://kamdridi.com/our-lost-dreams"
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-20 text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-6xl">
        <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">Official professional access</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none md:text-7xl">KAM DRIDI — Industry Hub</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">Montreal-based independent artist working in melodic hard rock and cinematic melodic hard rock. This page is the canonical professional entry point for radio programmers, music supervisors, festival buyers, press, promoters, distributors and licensing professionals.</p>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {cards.map(([title, href, text]) => (
            <Link key={href} href={href} className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-7 transition hover:border-red-500/50">
              <h2 className="text-2xl font-black uppercase">{title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-300">{text}</p>
            </Link>
          ))}
        </div>

        <section className="mt-10 rounded-[2rem] border border-red-900/40 bg-black/40 p-7 md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">Priority international single</p>
          <h2 className="mt-4 text-3xl font-black uppercase">OUR LOST DREAMS</h2>
          <div className="mt-5 grid gap-2 text-sm text-stone-300 md:grid-cols-2">
            <p>Artist: KAM DRIDI</p><p>Album: Echoes Unearthed</p>
            <p>Genre: Cinematic Melodic Hard Rock</p><p>Duration: 4:55</p>
            <p>ISRC: QZZ7M2627617</p><p>Origin: Montreal, Canada</p>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/our-lost-dreams" className="rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">Open radio/media page</Link>
            <Link href="/press" className="rounded-full border border-red-500/40 px-6 py-3 text-xs font-black uppercase tracking-[0.16em]">Open EPK</Link>
          </div>
        </section>
      </section>
    </main>
  );
}
