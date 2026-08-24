import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WAR MACHINES — Japan Physical Maxi-Single",
  description:
    "KAM DRIDI — WAR MACHINES. Japanese physical maxi-single in preparation, with a physical-only live bonus track from the upcoming ECHOES UNLIVE IN BRASIL.",
  openGraph: {
    title: "WAR MACHINES — Japan | KAM DRIDI",
    description:
      "A focused Japanese physical maxi-single in preparation. Four tracks, including a physical-only live bonus track.",
    images: [
      {
        url: "/war-machines-japan/war-machines-japan-cover.webp",
        width: 1254,
        height: 1254,
        alt: "KAM DRIDI — WAR MACHINES Japanese physical maxi-single artwork"
      }
    ]
  }
};

const tracks = [
  {
    number: "01",
    title: "War Machines",
    noteJa: "『ECHOES UNEARTHED』収録曲",
    noteEn: "Taken from ECHOES UNEARTHED"
  },
  {
    number: "02",
    title: "Too Fast Too Young",
    noteJa: "日本盤収録予定",
    noteEn: "Planned for the Japan physical edition"
  },
  {
    number: "03",
    title: "Our Lost Dreams",
    noteJa: "日本盤収録予定",
    noteEn: "Planned for the Japan physical edition"
  },
  {
    number: "04",
    title: "War Machines — Live Crowd Version",
    noteJa: "日本盤フィジカル限定ボーナス・トラック",
    noteEn: "Physical bonus track — from the upcoming ECHOES UNLIVE IN BRASIL"
  }
];

export default function WarMachinesJapanPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#050609] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_50%_20%,rgba(177,18,22,.24),transparent_34%),linear-gradient(180deg,#07080b_0%,#020305_100%)]" />
        <div className="absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] [background-size:34px_34px]" />

        <div className="mx-auto grid min-h-[86vh] max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,.78fr)] lg:py-28">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.38em] text-red-500">
              Japan Physical Project
            </p>
            <p className="mt-7 text-sm font-bold uppercase tracking-[0.28em] text-stone-400">KAM DRIDI</p>
            <h1 className="mt-3 font-display text-6xl uppercase leading-[0.86] tracking-[0.035em] sm:text-7xl md:text-8xl">
              WAR MACHINES
            </h1>
            <p lang="ja" className="mt-6 text-3xl font-black tracking-[0.08em] text-stone-100 sm:text-4xl">
              ウォー・マシーンズ
            </p>
            <div className="mt-9 inline-flex flex-col rounded-2xl border border-red-500/45 bg-red-950/20 px-5 py-4 shadow-[0_0_45px_rgba(180,20,24,.12)]">
              <p lang="ja" className="text-sm font-black tracking-[0.12em] text-red-300">
                日本向けフィジカル限定盤を準備中。
              </p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-400">
                Japanese physical edition in preparation
              </p>
            </div>
            <p lang="ja" className="mt-8 max-w-2xl text-base leading-8 text-stone-300 sm:text-lg">
              KAM DRIDIが日本での最初のフィジカル展開として準備している、4曲入りの限定マキシシングル。
              初回テストとして約300枚を想定し、作品そのものを手に取れる形で日本のリスナーへ届けることを目指しています。
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-500">
              One focused release. One market. One real test. A four-track physical maxi-single designed as a tangible first step into Japan.
            </p>
          </div>

          <div className="mx-auto w-full max-w-[560px]">
            <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/15 bg-black shadow-[0_34px_100px_rgba(0,0,0,.75)]">
              <Image
                src="/war-machines-japan/war-machines-japan-cover.webp"
                alt="KAM DRIDI — WAR MACHINES Japanese physical maxi-single cover"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 42vw"
                className="object-cover"
              />
            </div>
            <div className="mt-4 flex flex-wrap justify-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-300">
              <span className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2">4 Tracks</span>
              <span className="rounded-full border border-red-500/40 bg-red-950/15 px-4 py-2 text-red-300">Physical Bonus Track</span>
              <span className="rounded-full border border-white/15 bg-white/[0.04] px-4 py-2">Japan Test Edition</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="mb-12 max-w-3xl">
          <p className="text-xs font-black uppercase tracking-[0.36em] text-red-500">Tracklist</p>
          <h2 lang="ja" className="mt-4 text-3xl font-black tracking-[0.06em] sm:text-5xl">4曲。ひとつの入口。</h2>
          <p className="mt-5 text-sm leading-7 text-stone-400">
            The fourth track connects this Japan physical release directly to the next KAM DRIDI project.
          </p>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b0d11] shadow-2xl">
          {tracks.map((track) => (
            <article
              key={track.number}
              className="grid gap-4 border-b border-white/10 px-6 py-6 last:border-b-0 sm:grid-cols-[64px_minmax(0,1fr)] sm:px-8"
            >
              <span className="font-display text-3xl text-red-500">{track.number}</span>
              <div>
                <h3 className="text-lg font-black tracking-[0.04em] text-white sm:text-xl">{track.title}</h3>
                <p lang="ja" className="mt-2 text-sm font-bold tracking-[0.04em] text-stone-200">{track.noteJa}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-500">{track.noteEn}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-[#090a0d]">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-2 lg:items-center">
          <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-white/12 bg-black shadow-[0_28px_90px_rgba(0,0,0,.65)]">
            <Image
              src="/war-machines-japan/war-machines-leaflet-reverse.webp"
              alt="WAR MACHINES insert reverse artwork — buried mechanical hand with red core"
              fill
              sizes="(max-width: 1024px) 90vw, 46vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.36em] text-red-500">Physical Edition</p>
            <h2 lang="ja" className="mt-5 text-3xl font-black leading-tight tracking-[0.05em] sm:text-5xl">
              手に取れる作品として、日本へ。
            </h2>
            <p lang="ja" className="mt-7 text-base leading-8 text-stone-300">
              専用アートワーク、4曲構成、フィジカル限定ボーナス・トラックを軸にした日本向けパッケージを準備中です。
              大規模な展開を先に約束するのではなく、まずは実際のフィジカル作品で市場との接点をつくることを目的としています。
            </p>
            <div className="mt-8 grid gap-3 text-sm text-stone-300 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">CD-first physical concept</div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">Japan-specific presentation</div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">Limited test quantity planned</div>
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">Retail / partner structure in discussion</div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden px-5 py-24 sm:px-8 md:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(164,17,22,.15),transparent_42%)]" />
        <div className="mx-auto max-w-5xl rounded-[2.25rem] border border-red-500/30 bg-black/60 p-8 text-center shadow-[0_35px_110px_rgba(0,0,0,.65)] sm:p-12 md:p-16">
          <p className="text-xs font-black uppercase tracking-[0.4em] text-red-400">Coming Next</p>
          <p lang="ja" className="mt-5 text-sm font-black uppercase tracking-[0.24em] text-stone-400">次の章へ</p>
          <h2 className="mt-6 font-display text-4xl uppercase leading-[0.9] tracking-[0.05em] sm:text-6xl md:text-7xl">
            ECHOES UNLIVE IN BRASIL
          </h2>
          <p lang="ja" className="mx-auto mt-7 max-w-3xl text-base leading-8 text-stone-300">
            「War Machines — Live Crowd Version」は、今後展開予定の『ECHOES UNLIVE IN BRASIL』からの先行ブリッジとして、この日本盤フィジカル・マキシシングルに収録予定です。
          </p>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-stone-500">
            The physical bonus track is designed as the bridge from WAR MACHINES to the upcoming ECHOES UNLIVE IN BRASIL.
          </p>
        </div>
      </section>

      <section className="border-t border-white/10 bg-[#08090c] px-5 py-16 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 lg:flex-row">
          <div className="max-w-3xl text-center lg:text-left">
            <p lang="ja" className="text-sm font-bold leading-7 text-stone-200">
              製造・発売時期・販売店は現在調整中です。
            </p>
            <p className="mt-2 text-xs uppercase leading-6 tracking-[0.13em] text-stone-500">
              Manufacturing, release timing and retail availability are currently being coordinated. No retailer, distributor or manufacturer is represented here as confirmed.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/press"
              className="rounded-full border border-white/25 px-7 py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-white transition hover:border-red-400 hover:text-red-300"
            >
              Press / EPK
            </Link>
            <Link
              href="/"
              className="rounded-full bg-white px-7 py-3 text-center text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-red-500 hover:text-white"
            >
              KAM DRIDI
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
