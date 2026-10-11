import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, MapPin, Mic2, Ticket } from "lucide-react";

export const metadata: Metadata = {
  title: "KAM DRIDI — Live in Japan 2027 | GEKIRIN Tokyo",
  description:
    "KAM DRIDI live at GEKIRIN, The Playhouse, Machida, Tokyo, Sunday 17 January 2027. Discover the concert, venue and official artwork.",
};

export default function JapanLivePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#08080d] text-white">
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute inset-0 bg-[url('/japan/japan-header-crowd-hd.png')] bg-cover bg-[center_48%]" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07080d]/75 via-[#07080d]/30 to-transparent" aria-hidden="true" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07080d]/65 via-transparent to-transparent" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col px-5 pb-12 pt-8 sm:min-h-[610px] sm:px-8 md:min-h-[670px] lg:px-10">
          <nav aria-label="Asia-Pacific live pages" className="flex flex-wrap items-center gap-x-5 gap-y-3 text-[11px] font-bold uppercase tracking-[.16em]">
            <Link href="/live" className="text-[#f4c66a] hover:underline">← Live / Tour</Link>
            <Link href="/new-zealand" className="hover:text-[#f4c66a]">🇳🇿 New Zealand</Link>
            <Link href="/live#adelaide-show" className="hover:text-[#f4c66a]">🇦🇺 Australia</Link>
          </nav>
          <div className="mt-auto max-w-2xl drop-shadow-[0_3px_12px_rgba(0,0,0,.9)]">
            <p className="text-xs font-bold uppercase tracking-[.32em] text-red-300">🇯🇵 Japan · Tokyo · 2027</p>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase leading-[.92] tracking-[.02em] text-white sm:text-7xl">
              KAM DRIDI <span className="mt-2 block text-red-500">LIVE IN JAPAN</span>
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white sm:text-base">
              GEKIRIN · 17 January 2027 · The Playhouse, Machida, Tokyo
            </p>
            <a href="#tokyo-show" className="mt-6 inline-flex rounded-full border border-white/40 bg-black/40 px-5 py-3 text-xs font-bold uppercase tracking-[.14em] text-white transition hover:bg-black/70">
              Discover the Tokyo concert ↓
            </a>
          </div>
        </div>
      </section>

      <section id="tokyo-show" className="relative isolate overflow-hidden border-b border-white/10 bg-[#10090b]">
        <div className="mx-auto max-w-[1600px] px-2 py-8 sm:px-5 lg:px-0 lg:py-16">
          <div className="relative grid items-center gap-0 lg:grid-cols-[43%_57%]">
            {/* Let the singer poster occupy the unused left edge and gently overlap the venue photo. */}
            <div className="relative z-20 mx-auto w-full max-w-[590px] lg:ml-0 lg:mr-[-7%] lg:max-w-none">
              <a href="/japan/kamdridi-gekirin-tokyo-2027.png" target="_blank" rel="noopener noreferrer" aria-label="Open the GEKIRIN concert poster full size" className="block">
                <Image src="/japan/kamdridi-gekirin-tokyo-2027.png" alt="KAM DRIDI singer with microphone · GEKIRIN Tokyo concert poster · 17 January 2027" width={1122} height={1402} priority sizes="(max-width: 1023px) 95vw, 45vw" className="block h-auto w-full rounded-xl object-contain shadow-[16px_18px_45px_rgba(0,0,0,.4)]" />
              </a>
            </div>
            <div className="relative z-10 -mt-8 min-h-[570px] overflow-hidden rounded-xl sm:min-h-[650px] lg:ml-[-5%] lg:mt-0 lg:min-h-[750px]">
              <Image src="/japan/the-playhouse-stage-tokyo.png" alt="The Playhouse stage in Tokyo with spotlights, waiting for KAM DRIDI to perform" fill sizes="(max-width: 1023px) 100vw, 60vw" className="object-cover object-center" />
              {/* Light shading only behind the information, never across the whole stage. */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/80 via-black/35 to-transparent" aria-hidden="true" />
              <div className="absolute inset-x-3 bottom-4 z-10 sm:inset-x-6 sm:bottom-6 lg:left-[12%] lg:right-7">
                <div className="max-w-[600px] rounded-xl border border-white/20 bg-black/25 p-4 backdrop-blur-[1px] sm:p-6">
                  <p className="text-xs font-bold uppercase tracking-[.2em] text-red-200">Tokyo · Japan · GEKIRIN 2027</p>
                  <h2 className="mt-2 font-display text-2xl uppercase text-white drop-shadow-lg sm:text-4xl">The Playhouse · Machida</h2>
                  <p className="mt-3 flex items-center gap-2 text-sm text-white sm:text-base"><CalendarDays className="h-4 w-4 shrink-0 text-[#f4c66a]" /> Sunday 17 January 2027</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-white sm:text-base"><MapPin className="h-4 w-4 shrink-0 text-[#f4c66a]" /> Machida, Tokyo, Japan</p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <a href="https://mohanak.com/ticket/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center rounded-full bg-red-700 px-5 py-3 text-xs font-bold uppercase tracking-[.1em] text-white hover:bg-red-600"><Ticket className="mr-2 h-4 w-4" />Buy Tickets <ArrowUpRight className="ml-2 h-4 w-4" /></a>
                    <a href="https://mohanak.com/ticket/" target="_blank" rel="noopener noreferrer" className="text-sm text-white underline underline-offset-4 hover:text-red-200">mohanak.com/ticket/ ↗</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="echoes-gekirin" className="relative isolate overflow-hidden border-b border-white/10 bg-[radial-gradient(ellipse_at_50%_25%,rgba(145,28,35,.35),transparent_65%),#08080d]">
        {/* The album and two layered concert-ticket visuals sit BEHIND the Japanese copy. */}
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -left-[24%] top-10 w-[70%] -rotate-[13deg] opacity-90 drop-shadow-[16px_25px_20px_rgba(0,0,0,.9)] sm:-left-[8%] sm:top-14 sm:w-[42%] lg:left-[max(-8%,calc(50%-700px))] lg:w-[470px] lg:opacity-85">
            <Image src="/assets/images/releases/echoes-unearthed-cover.jpg" alt="" width={900} height={900} sizes="(max-width:640px) 70vw, 470px" className="h-auto w-full rounded-xl border border-amber-500/25 object-contain" />
          </div>
          <div className="absolute -right-[45%] top-14 w-[94%] rotate-[18deg] opacity-65 sm:-right-[24%] sm:top-24 sm:w-[65%] lg:right-[max(-18%,calc(50%-810px))] lg:w-[650px] lg:opacity-55">
            <div className="aspect-[2.6/1] overflow-hidden rounded-lg border-[5px] border-stone-400/70 bg-[linear-gradient(135deg,#210609,#08070a_70%)] shadow-[12px_22px_25px_rgba(0,0,0,.9)]">
              <div className="flex h-full items-center gap-3 px-5"><div className="min-w-0 flex-1"><p className="font-display text-[clamp(12px,2vw,28px)] font-black text-red-500">GEKIRIN 激輪</p><p className="text-[clamp(8px,1.1vw,15px)] font-bold text-white">KAM DRIDI · JAPAN 2027</p><p className="text-[clamp(7px,1vw,12px)] text-stone-300">01.17 · THE PLAYHOUSE · MACHIDA</p></div><div className="h-full w-[28%] border-l-2 border-dashed border-stone-300/60 bg-red-800/70" /></div>
            </div>
          </div>
          <div className="absolute -right-[38%] top-9 w-[94%] rotate-[10deg] opacity-80 sm:-right-[19%] sm:top-16 sm:w-[65%] lg:right-[max(-13%,calc(50%-760px))] lg:w-[650px] lg:opacity-85">
            <div className="aspect-[2.6/1] overflow-hidden rounded-lg border-[5px] border-stone-300/80 bg-[linear-gradient(120deg,#260609,#09090d_75%)] shadow-[12px_22px_25px_rgba(0,0,0,.9)]">
              <div className="flex h-full items-center gap-3 px-5"><div className="min-w-0 flex-1"><p className="font-display text-[clamp(12px,2vw,28px)] font-black text-red-500">GEKIRIN 激輪</p><p className="text-[clamp(8px,1.1vw,15px)] font-bold text-white">KAM DRIDI · JAPAN 2027</p><p className="text-[clamp(7px,1vw,12px)] text-stone-300">01.17 · THE PLAYHOUSE · MACHIDA</p></div><div className="flex h-full w-[28%] flex-col items-center justify-center border-l-2 border-dashed border-stone-300/60 bg-red-800/80"><span className="text-[clamp(7px,1vw,13px)] font-bold text-white">LIVE</span><span className="text-[clamp(7px,1vw,13px)] font-bold text-white">2027</span></div></div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#08080d]/0 via-[#08080d]/20 to-[#08080d]/70 sm:bg-[linear-gradient(90deg,rgba(8,8,13,.1),rgba(8,8,13,.18)_30%,rgba(8,8,13,.22)_70%,rgba(8,8,13,.1))]" />
        </div>
        <div className="relative z-10 mx-auto max-w-5xl px-5 py-20 text-center [text-shadow:0_2px_16px_rgba(0,0,0,.95)] sm:px-8 sm:py-28">
          <p className="text-xs font-bold uppercase tracking-[.28em] text-red-300">🇯🇵 日本限定 · 17セット限定</p>
          <h2 className="mt-4 font-display text-4xl font-bold uppercase leading-tight text-white sm:text-6xl">ECHOES UNEARTHED<br/><span className="text-red-500">＋ GEKIRIN LIVE</span></h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg font-semibold leading-8 text-white sm:text-xl">アルバムを聴いて、友達とライブへ。</p>
          <p className="mx-auto mt-3 max-w-3xl text-sm leading-7 text-stone-300 sm:text-base">KAM DRIDIのアルバム <strong className="text-white">ECHOES UNEARTHED</strong> 全曲デジタル版をスマホやデバイスで楽しんで、2027年1月17日（日）The Playhouse・町田で開催されるGEKIRIN公演へ。ライブ前に曲を聴いて、当日は一緒に盛り上がろう。</p>
          <div className="mx-auto mt-7 grid max-w-3xl gap-3 text-left sm:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/[.04] p-4"><span className="text-xl">🎧</span><p className="mt-2 text-sm font-bold text-white">アルバム全曲</p><p className="mt-1 text-xs leading-5 text-stone-400">ECHOES UNEARTHED デジタル版</p></div>
            <div className="rounded-2xl border border-white/15 bg-white/[.04] p-4"><span className="text-xl">📱</span><p className="mt-2 text-sm font-bold text-white">デバイスで楽しめる</p><p className="mt-1 text-xs leading-5 text-stone-400">スマホ・PCなどでダウンロード</p></div>
            <div className="rounded-2xl border border-white/15 bg-white/[.04] p-4"><span className="text-xl">🎟️</span><p className="mt-2 text-sm font-bold text-white">1/17 ライブ入場</p><p className="mt-1 text-xs leading-5 text-stone-400">GEKIRIN · The Playhouse · 町田</p></div>
          </div>
          <div className="mt-8 rounded-2xl border border-red-500/40 bg-red-950/20 p-5">
            <p className="text-sm font-bold text-red-200">この限定パッケージの受付開始に向けて準備中です。</p>
            <p className="mt-2 text-xs leading-6 text-stone-400">通常のGEKIRINチケット予約は現在ご利用いただけます。限定パッケージは入場確認とデジタル配信方法の最終確認後に受付を開始します。</p>
            <a href="https://mohanak.com/ticket/" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center rounded-full bg-red-700 px-6 py-3 text-xs font-bold uppercase tracking-[.1em] text-white hover:bg-red-600"><Ticket className="mr-2 h-4 w-4" />GEKIRIN チケット予約 <ArrowUpRight className="ml-2 h-4 w-4" /></a>
          </div>
          <p className="mt-5 text-[11px] leading-5 text-stone-500">広告・SNS・クリエイター向けリンク先: kamdridi.com/japan#echoes-gekirin</p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#0d0e16]">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-8 md:grid-cols-[minmax(0,390px)_1fr] md:items-center md:gap-12 md:py-16">
          <a href="/japan/17-for-ever-original-poster.png" target="_blank" rel="noopener noreferrer" className="block overflow-hidden rounded-2xl border border-white/20 bg-white transition hover:border-red-500/70" aria-label="View the original 17 FOR EVER Japanese promotional poster in full">
            <img src="/japan/17-for-ever-original-poster.png" alt="KAM DRIDI Japan 17 FOR EVER collector cassette artwork" width={1024} height={1536} loading="lazy" className="h-auto w-full" />
          </a>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.27em] text-red-300">Japan · Special edition</p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-tight text-white sm:text-5xl">17 FOR EVER</h2>
            <p className="mt-5 max-w-xl text-base leading-8 text-stone-300">Japanese promotional artwork for the 17 FOR EVER special collector cassette edition.</p>
            <a href="/japan/17-for-ever-original-poster.png" target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex rounded-full border border-white/30 px-6 py-3 text-xs font-bold uppercase tracking-[.15em] text-white transition hover:bg-white/10">View Japanese poster ↗</a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="font-display text-3xl uppercase tracking-wide sm:text-4xl">More Japan dates</h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">Additional 2027 performances, including Osaka, are under consideration. No further date is announced.</p>
        <div className="mt-8 rounded-3xl border border-white/15 bg-white/[.035] p-7">
          <span className="text-sm text-red-300">🇯🇵 Japan</span>
          <h3 className="mt-4 font-display text-3xl uppercase text-white">Osaka</h3>
          <p className="mt-3 text-sm text-stone-400">2027 · Date and venue to be announced</p>
        </div>
      </section>
    </main>
  );
}
