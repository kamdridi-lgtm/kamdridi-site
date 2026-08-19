import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Press Kit / EPK — KAM DRIDI",
  description:
    "Official KAM DRIDI electronic press kit: bio, quick facts, OUR LOST DREAMS audio, media assets, and contact information.",
};

const radioMp3 = "/audio/radio/03-our-lost-dreams-radio.mp3";
const contactHref =
  "mailto:kamdridi@hotmail.com?subject=KAM%20DRIDI%20-%20Press%20%2F%20Booking%20Inquiry";

const buttonBase =
  "inline-flex items-center justify-center rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.18em] transition";

export default function PressPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-red-900/40 px-5 py-20 md:py-28">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(220,38,38,0.18),transparent_34%),radial-gradient(circle_at_82%_20%,rgba(120,53,15,0.12),transparent_30%),linear-gradient(180deg,#090606_0%,#050505_74%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-red-500">
            Official Electronic Press Kit
          </p>
          <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-[0.04em] md:text-8xl">
            KAM DRIDI
          </h1>
          <p className="mt-6 max-w-3xl text-xl font-bold uppercase tracking-[0.12em] text-stone-100 md:text-3xl">
            Cinematic melodic hard rock · Montreal, Canada
          </p>
          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-300 md:text-lg">
            Official web EPK for radio, press, booking, licensing, and music-industry review.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/our-lost-dreams"
              className={`${buttonBase} bg-red-600 text-white hover:bg-red-500`}
            >
              OUR LOST DREAMS
            </Link>
            <Link
              href="/media#press-stills"
              className={`${buttonBase} border border-red-500/45 text-red-100 hover:border-red-400 hover:bg-red-500/10`}
            >
              Approved Media
            </Link>
            <a
              href={contactHref}
              className={`${buttonBase} border border-white/15 text-stone-100 hover:border-white/35 hover:bg-white/5`}
            >
              Contact
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-12 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[2rem] border border-red-900/40 bg-white/[0.035] p-6 md:p-9">
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-500">
            Artist Bio
          </p>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.05em]">
            Melodic hard rock with cinematic scale
          </h2>
          <p className="mt-5 text-sm leading-7 text-stone-300 md:text-base md:leading-8">
            KAM DRIDI is an independent melodic hard rock artist from Montreal, Canada.
            The project combines melody, heavy guitars, cinematic atmosphere, and
            emotionally direct songwriting across music, live visuals, and a broader
            story-driven creative universe.
          </p>
          <p className="mt-4 text-sm leading-7 text-stone-300 md:text-base md:leading-8">
            OUR LOST DREAMS centers on heartbreak, memory, and the loss of the future
            two people once imagined together. It is the current focus for radio,
            media, creator, booking, and licensing outreach.
          </p>
        </article>

        <aside className="rounded-[2rem] border border-white/10 bg-black/35 p-6 md:p-9">
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-500">
            Quick Facts
          </p>
          <dl className="mt-5 space-y-4 text-sm">
            <div className="border-b border-white/10 pb-4">
              <dt className="uppercase tracking-[0.2em] text-stone-500">Artist</dt>
              <dd className="mt-1 font-bold text-white">KAM DRIDI</dd>
            </div>
            <div className="border-b border-white/10 pb-4">
              <dt className="uppercase tracking-[0.2em] text-stone-500">Based in</dt>
              <dd className="mt-1 font-bold text-white">Montreal, Canada</dd>
            </div>
            <div className="border-b border-white/10 pb-4">
              <dt className="uppercase tracking-[0.2em] text-stone-500">Genre</dt>
              <dd className="mt-1 font-bold text-white">Cinematic melodic hard rock</dd>
            </div>
            <div className="border-b border-white/10 pb-4">
              <dt className="uppercase tracking-[0.2em] text-stone-500">Status</dt>
              <dd className="mt-1 font-bold text-white">Independent / unsigned</dd>
            </div>
            <div>
              <dt className="uppercase tracking-[0.2em] text-stone-500">Official site</dt>
              <dd className="mt-1 font-bold text-white">kamdridi.com</dd>
            </div>
          </dl>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12">
        <article className="rounded-[2rem] border border-red-900/45 bg-[radial-gradient(circle_at_10%_0%,rgba(220,38,38,0.10),transparent_34%),rgba(12,9,9,0.86)] p-6 md:p-9">
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-500">
            Featured Campaign Track
          </p>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.05em] md:text-5xl">
            OUR LOST DREAMS
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            ISRC: QZZ7M2627618 · Official radio audio available below.
          </p>

          <audio className="mt-7 w-full" controls preload="metadata">
            <source src={radioMp3} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/our-lost-dreams"
              className={`${buttonBase} bg-red-600 text-white hover:bg-red-500`}
            >
              Open Track Page
            </Link>
            <a
              href={radioMp3}
              download
              className={`${buttonBase} border border-red-500/45 text-red-100 hover:border-red-400 hover:bg-red-500/10`}
            >
              Download Radio MP3
            </a>
          </div>
        </article>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 pb-20 md:grid-cols-3">
        <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Photos + Visuals
          </p>
          <h2 className="mt-4 text-2xl font-black uppercase">Approved Media</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Current public-facing campaign stills and visual assets.
          </p>
          <Link
            href="/media#press-stills"
            className="mt-6 inline-flex text-xs font-black uppercase tracking-[0.18em] text-red-400 hover:text-red-300"
          >
            Open Media Gallery →
          </Link>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Music
          </p>
          <h2 className="mt-4 text-2xl font-black uppercase">Discography + Audio</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Explore the official music hub and current KAM DRIDI releases.
          </p>
          <Link
            href="/music"
            className="mt-6 inline-flex text-xs font-black uppercase tracking-[0.18em] text-red-400 hover:text-red-300"
          >
            Open Music Hub →
          </Link>
        </article>

        <article className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-500">
            Press · Booking · Licensing
          </p>
          <h2 className="mt-4 text-2xl font-black uppercase">Direct Contact</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            For interviews, features, radio, booking, licensing, and professional requests.
          </p>
          <a
            href={contactHref}
            className="mt-6 inline-flex text-xs font-black uppercase tracking-[0.18em] text-red-400 hover:text-red-300"
          >
            kamdridi@hotmail.com →
          </a>
        </article>
      </section>
    </main>
  );
}
