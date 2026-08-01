import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Australia — 17 FOR EVER | KAM DRIDI",
  description: "The official Australian edition of KAM DRIDI's 17 FOR EVER maxi single."
};

const tracks = [
  ["01", "17 FOR EVER", "Exclusive Australian Version"],
  ["02", "17 FOR EVER", "Different Mix / Album Version"],
  ["03", "17 FOR EVER", "Unplugged — UN LIVE IN BRASIL / Night #2 Version"],
  ["04", "17 FOR EVER", "Demo Version"]
] as const;

export default function AustraliaPage() {
  return (
    <main
      className="min-h-screen text-white"
      style={{
        backgroundImage: "linear-gradient(rgba(5,5,5,.42),rgba(5,5,5,.62)),url('/australia/17-for-ever-background.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed"
      }}
    >
      <section className="bg-black">
        <img
          src="/australia/17-for-ever-hero.webp"
          alt="KAMDRIDI Australia — 17 FOR EVER Limited Edition Maxi Single"
          className="block h-auto w-full"
        />
      </section>

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-5 py-8 sm:flex-row sm:justify-center">
        <Link
          href="#edition"
          className="w-full rounded-full border border-[#d9ad5a] bg-black/80 px-8 py-4 text-center text-sm font-black uppercase tracking-[0.2em] text-[#f0c56d] backdrop-blur transition hover:bg-black sm:w-auto"
        >
          Explore the edition
        </Link>
        <Link
          href="/store"
          className="w-full rounded-full bg-[#d7a640] px-10 py-4 text-center text-base font-black uppercase tracking-[0.22em] text-black shadow-[0_0_30px_rgba(215,166,64,.48)] transition hover:bg-[#f0c56d] sm:w-auto"
        >
          Buy now
        </Link>
      </section>

      <section id="edition" className="mx-auto max-w-5xl px-5 pb-24 pt-10">
        <div className="rounded-[2rem] border border-white/15 bg-black/75 p-6 shadow-2xl backdrop-blur-md md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-[#f0c56d]">Limited Edition Maxi Single</p>
          <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] md:text-6xl">17 FOR EVER</h1>
          <p className="mt-5 max-w-3xl text-base leading-8 text-stone-300">
            Teenage memories, first demos, loud nights and the versions that kept the song alive.
          </p>

          <div className="mt-10 divide-y divide-white/15 border-y border-white/15">
            {tracks.map(([number, title, version]) => (
              <article key={number} className="grid grid-cols-[54px_1fr] gap-4 py-5">
                <span className="font-display text-2xl text-[#f0c56d]">{number}</span>
                <div>
                  <h2 className="text-lg font-black tracking-[0.08em]">{title}</h2>
                  <p className="mt-1 text-sm leading-6 text-stone-400">{version}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
