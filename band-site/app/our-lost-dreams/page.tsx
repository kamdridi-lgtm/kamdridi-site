import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "OUR LOST DREAMS — KAM DRIDI",
  description:
    "Official KAM DRIDI radio and media hub for OUR LOST DREAMS: the cinematic original and unplugged live interpretation.",
};

const radioMp3 = "/audio/radio/03-our-lost-dreams-radio.mp3";
const contactHref =
  "mailto:kamdridi@hotmail.com?subject=OUR%20LOST%20DREAMS%20-%20KAM%20DRIDI";

function ActionLink({
  href,
  children,
  primary = false,
  download = false,
}: {
  href: string;
  children: React.ReactNode;
  primary?: boolean;
  download?: boolean;
}) {
  const className = primary
    ? "inline-flex items-center justify-center rounded-full bg-red-600 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:bg-red-500"
    : "inline-flex items-center justify-center rounded-full border border-red-500/45 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-red-100 transition hover:border-red-400 hover:bg-red-500/10";

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className} download={download || undefined}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} className={className} download={download || undefined}>
      {children}
    </a>
  );
}

export default function OurLostDreamsPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-red-900/40 px-5 py-20 md:py-28">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/our-lost-dreams-hero.webp')" }}
        />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(0,0,0,0.76)_0%,rgba(0,0,0,0.54)_48%,rgba(0,0,0,0.66)_100%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,5,5,0.18)_0%,rgba(5,5,5,0.34)_48%,rgba(5,5,5,0.88)_100%)]" />
        <div className="relative mx-auto max-w-6xl">
          <p className="text-xs font-black uppercase tracking-[0.38em] text-red-500">
            KAM DRIDI · Montreal, Canada
          </p>
          <h1 className="mt-6 font-display text-5xl uppercase leading-[0.92] tracking-[0.04em] md:text-8xl">
            OUR LOST DREAMS
          </h1>
          <p className="mt-7 text-2xl font-black uppercase tracking-[0.12em] text-red-500 md:text-4xl">
            BE EARLY.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-8 text-stone-100 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)] md:text-xl">
            One request: listen before you decide. Be among the first stations,
            media outlets and music professionals in your market to discover
            OUR LOST DREAMS.
          </p>
          <p className="mt-4 max-w-3xl text-sm uppercase tracking-[0.2em] text-stone-300 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
            One song. Two worlds. The cinematic original and the unplugged live interpretation.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-6 px-5 py-12 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-[2rem] border border-red-900/45 bg-[radial-gradient(circle_at_10%_0%,rgba(220,38,38,0.10),transparent_34%),rgba(12,9,9,0.86)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.38)] md:p-9">
          <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-500">
            Original US Album Version · 4:55
          </p>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.05em] md:text-4xl">
            From Echoes Unearthed
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-300">
            Emotional cinematic melodic hard rock / crossover. This is the primary radio and
            media version of OUR LOST DREAMS.
          </p>

          <audio className="mt-8 w-full" controls preload="metadata">
            <source src={radioMp3} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>

          <div className="mt-7 flex flex-wrap gap-3">
            <ActionLink href={radioMp3} primary download>
              Download Radio MP3
            </ActionLink>
            <ActionLink href="/press">Press / EPK</ActionLink>
            <ActionLink href={contactHref}>Request WAV Master</ActionLink>
          </div>

          <div className="mt-7 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm leading-7 text-stone-300">
            <p className="font-bold text-white">Broadcast assets available:</p>
            <p className="mt-2">Radio MP3: 320 kbps · 48 kHz · stereo</p>
            <p>Broadcast master: 24-bit · 48 kHz · stereo WAV</p>
          </div>
        </article>

        <aside className="space-y-6">
          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-500">
              Version 02
            </p>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.05em]">
              Unplugged Live
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              From Echoes UNlive in Brasil · 4:25. A stripped-back live
              interpretation offering a second emotional world around the same song.
            </p>
            <div className="mt-6">
              <ActionLink href={contactHref}>Request Live Version</ActionLink>
            </div>
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-white/[0.035] p-6 md:p-8">
            <p className="text-[10px] font-black uppercase tracking-[0.34em] text-red-500">
              Artist
            </p>
            <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.05em]">
              KAM DRIDI
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-300">
              Independent artist · Montreal, Canada. Cinematic melodic hard rock,
              industrial energy and emotional songwriting.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ActionLink href="/">Official Site</ActionLink>
              <ActionLink href={contactHref}>Contact</ActionLink>
            </div>
          </section>
        </aside>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20">
        <div className="rounded-[2rem] border border-red-900/35 bg-black/40 p-6 md:p-9">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-red-500">
            Radio · Media · Live · Sync
          </p>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.05em]">
            International first-wave package
          </h2>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-stone-300">
            Official audio, press information and verified production assets are
            available for legitimate radio, media, booking and licensing review.
            No chart, audience, airplay or rights claims are implied on this page.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ActionLink href="/press" primary>Open EPK</ActionLink>
            <ActionLink href={contactHref}>Contact KAM DRIDI</ActionLink>
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.2em] text-stone-500">
            KAM DRIDI · Montreal, Canada · kamdridi@hotmail.com
          </p>
        </div>
      </section>
    </main>
  );
}
