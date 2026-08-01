import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Australia — 17 FOR EVER | KAM DRIDI",
  description: "The official Australian edition of KAM DRIDI's 17 FOR EVER maxi single. Teenage memories, exclusive mixes and limited-edition artwork."
};

const tracks = [
  ["01", "17 FOR EVER", "Exclusive Australian Version"],
  ["02", "17 FOR EVER", "Different Mix / Album Version"],
  ["03", "17 FOR EVER", "Unplugged — UN LIVE IN BRASIL / Night #2 Version"],
  ["04", "17 FOR EVER", "Demo Version"]
] as const;

function AustraliaMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex items-center gap-3" : "space-y-4"}>
      <div className={compact ? "text-2xl font-black italic tracking-[-0.08em]" : "text-5xl font-black italic tracking-[-0.09em] sm:text-7xl"}>
        <span className="bg-[linear-gradient(90deg,#dc1f32_0_34%,#f8f8f8_34%_45%,#154da0_45%)] bg-clip-text text-transparent drop-shadow-[0_3px_0_rgba(255,255,255,.22)]">KAMDRIDI</span>
      </div>
      {!compact && <p className="text-xs font-black uppercase tracking-[0.5em] text-[#f0c56d]">Australia</p>}
    </div>
  );
}

function CircuitBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#03070d]">
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(214,15,42,.42),transparent_42%,rgba(18,96,224,.46)),radial-gradient(circle_at_20%_20%,rgba(255,20,52,.42),transparent_30%),radial-gradient(circle_at_80%_28%,rgba(0,130,255,.42),transparent_34%)]" />
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.08)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-red-600/20 blur-3xl" />
      <div className="absolute -right-24 top-1/4 h-80 w-80 rounded-full bg-blue-600/25 blur-3xl" />
    </div>
  );
}

function EditionMockup({ back = false }: { back?: boolean }) {
  return (
    <div className="relative aspect-[1.45/1] w-full overflow-hidden rounded-2xl border border-white/20 bg-[#060b12] shadow-[0_40px_120px_rgba(0,0,0,.75)]">
      <CircuitBackdrop />
      <div className="absolute inset-0 bg-black/25" />
      <div className="relative flex h-full flex-col items-center justify-center px-8 text-center">
        <AustraliaMark compact={back} />
        {!back ? (
          <>
            <p className="mt-8 text-xs font-black uppercase tracking-[0.42em] text-white/72">Limited Edition Maxi Single</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white sm:text-6xl">17 FOR EVER</h2>
            <p className="mt-4 text-xs uppercase tracking-[0.34em] text-[#f0c56d]">Teenage years · Australian edition</p>
          </>
        ) : (
          <div className="mt-6 w-full max-w-xl space-y-3 text-left">
            {tracks.map(([number, title, version]) => (
              <div key={number} className="grid grid-cols-[34px_1fr] gap-3 border-b border-white/10 pb-2">
                <span className="font-display text-[#f0c56d]">{number}</span>
                <div><p className="text-sm font-black tracking-[0.08em]">{title}</p><p className="text-[11px] text-stone-400">{version}</p></div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AustraliaPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#02050a] text-white">
      <section className="relative isolate min-h-[92vh] overflow-hidden border-b border-white/10">
        <CircuitBackdrop />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,5,10,.96)_0%,rgba(2,5,10,.70)_45%,rgba(2,5,10,.2)_100%)]" />
        <div className="relative mx-auto grid min-h-[92vh] max-w-7xl items-center gap-12 px-5 py-24 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="z-10">
            <p className="text-xs font-black uppercase tracking-[0.42em] text-[#f0c56d]">KAMDRIDI RECORDS · AUSTRALIA</p>
            <div className="mt-8"><AustraliaMark /></div>
            <h1 className="mt-8 font-display text-5xl uppercase leading-[0.88] tracking-[0.04em] sm:text-7xl lg:text-8xl">17 <span className="text-[#f0c56d]">FOR EVER</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-stone-300">A limited Australian maxi single built from teenage memories, first demos, loud nights and the versions that kept the song alive.</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="#edition" className="rounded-full bg-[#f0c56d] px-7 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-[#ffe09a]">Explore the edition</Link>
              <Link href="/store" className="rounded-full border border-white/25 px-7 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:border-white hover:bg-white/10">Official store</Link>
            </div>
          </div>
          <div className="relative z-10 mx-auto w-full max-w-[760px] lg:translate-x-8"><EditionMockup /></div>
        </div>
      </section>

      <section id="edition" className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.36em] text-[#f0c56d]">Limited Edition Maxi Single</p>
            <h2 className="mt-5 font-display text-4xl uppercase leading-none tracking-[0.05em] md:text-6xl">Four lives of one song</h2>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300">The Australian edition presents four distinct versions of “17 FOR EVER”: the exclusive Australian cut, the album mix, an intimate unplugged performance from UN LIVE IN BRASIL, and the original demo spirit.</p>
            <div className="mt-10 divide-y divide-white/10 border-y border-white/10">
              {tracks.map(([number, title, version]) => (
                <article key={number} className="grid grid-cols-[54px_1fr] gap-4 py-5"><span className="font-display text-2xl text-[#f0c56d]">{number}</span><div><h3 className="text-lg font-black tracking-[0.08em]">{title}</h3><p className="mt-1 text-sm leading-6 text-stone-400">{version}</p></div></article>
              ))}
            </div>
          </div>
          <div className="relative"><div className="absolute -inset-8 bg-red-500/10 blur-3xl" /><div className="relative"><EditionMockup back /></div></div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[linear-gradient(135deg,rgba(130,8,24,.22),rgba(5,25,70,.3))]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-3 lg:px-8">
          {[["17 years old","Too young to know everything. Old enough to feel everything."],["Australian exclusive","A dedicated edition with its own visual identity and exclusive opening version."],["Built for memories","Cassettes, handwritten notes and late-night sound — the teenage years preserved instead of polished away."]].map(([title, copy]) => (
            <article key={title} className="rounded-[1.8rem] border border-white/10 bg-black/35 p-7 backdrop-blur"><h3 className="font-display text-2xl uppercase tracking-[0.06em] text-[#f0c56d]">{title}</h3><p className="mt-4 text-sm leading-7 text-stone-300">{copy}</p></article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
        <p className="text-xs font-black uppercase tracking-[0.4em] text-[#f0c56d]">KAMDRIDI RECORDS</p>
        <h2 className="mt-5 font-display text-4xl uppercase leading-none tracking-[0.05em] md:text-6xl">The teenage years never die</h2>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-stone-300">“17 FOR EVER” is not nostalgia for a perfect past. It is the sound of unfinished dreams, first recordings and the part of us that never completely grew quiet.</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3"><Link href="/releases" className="rounded-full border border-[#f0c56d]/50 px-7 py-3 text-xs font-black uppercase tracking-[0.2em] text-[#f0c56d] transition hover:bg-[#f0c56d]/10">All releases</Link><Link href="/" className="rounded-full border border-white/20 px-7 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:border-white">KAM DRIDI Home</Link></div>
      </section>
    </main>
  );
}
