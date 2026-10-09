import type { Metadata } from "next";
import Link from "next/link";

const acousticUrl =
  "https://drive.google.com/file/d/17cL4zrxVgh62jX6MEY7w5225fBXpIllt/view?usp=drivesdk";
const acousticPreviewUrl =
  "https://drive.google.com/file/d/17cL4zrxVgh62jX6MEY7w5225fBXpIllt/preview";

export const metadata: Metadata = {
  title: "OUR LOST DREAMS — Stripped Down Acoustic Version",
  description:
    "Official KAM DRIDI listening page for OUR LOST DREAMS — Stripped Down Acoustic Version.",
  alternates: { canonical: "/our-lost-dreams-acoustic" },
};

export default function OurLostDreamsAcousticPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="relative overflow-hidden border-b border-red-900/40 px-5 py-16 md:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-35"
          style={{ backgroundImage: "url('/images/our-lost-dreams-bg.jpg')" }}
        />
        <div className="relative mx-auto max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.36em] text-red-500">
            KAM DRIDI · Official Listening Page
          </p>
          <h1 className="mt-6 font-display text-5xl uppercase leading-[0.9] tracking-[0.04em] md:text-7xl">
            OUR LOST DREAMS
          </h1>
          <p className="mt-5 text-lg font-black uppercase tracking-[0.16em] text-red-400 md:text-2xl">
            Stripped Down Acoustic Version
          </p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-200">
            A stripped-down acoustic interpretation of OUR LOST DREAMS, presented as an official KAM DRIDI listening sketch.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-5 py-10 md:py-14">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] p-4 shadow-[0_30px_100px_rgba(0,0,0,0.4)] md:p-7">
          <iframe
            src={acousticPreviewUrl}
            title="OUR LOST DREAMS — Stripped Down Acoustic Version"
            className="h-[190px] w-full rounded-2xl border-0 bg-black md:h-[220px]"
            allow="autoplay"
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={acousticUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-red-600 px-6 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-white transition hover:bg-red-500"
            >
              Listen / Open Audio
            </a>
            <Link
              href="/our-lost-dreams"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-red-500/45 px-6 py-3 text-center text-xs font-black uppercase tracking-[0.16em] text-red-100 transition hover:border-red-400 hover:bg-red-500/10"
            >
              OUR LOST DREAMS Hub
            </Link>
          </div>
        </div>

        <p className="mt-8 text-xs uppercase tracking-[0.2em] text-stone-500">
          KAM DRIDI · Montreal, Canada · Official artist website
        </p>
      </section>
    </main>
  );
}
