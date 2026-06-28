import type { CSSProperties, ReactNode } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import { Film, PlayCircle, ShoppingCart } from "lucide-react";

const LINKS = {
  buySpecialEdition: "TODO_STRIPE_OR_KAMDRIDI_LINK_1500",
  buyDigitalSingle: "TODO_STRIPE_OR_KAMDRIDI_LINK_250",
  spotify: "https://open.spotify.com/album/4rrOMu0BIhzJt1ElOfgXZu?si=a6eAct6jQl6BapO1_Zm4gA",
  apple: "https://music.apple.com/us/album/war-machines-radio-edit-single/1871879256",
  youtubeMusic: "https://www.youtube.com/watch?v=hzlVyLQN6a8",
  amazonMusic: "https://amazon.com/music/player/tracks/B0GJN46NSS",
  amazonMusicJapan: "https://music.amazon.co.jp/",
  lineMusic: "https://music.line.me/",
  awa: "https://awa.fm/",
  recochoku: "https://recochoku.jp/",
  mora: "https://mora.jp/",
  teaser: "https://www.youtube.com/watch?v=hzlVyLQN6a8"
} as const;

const LOGO = "/assets/images/war-machines-jp-logo.png";
const BACKGROUND = "/assets/images/war-machines-jp-background.png";
const BACKGROUND_VIDEO = "/videos/war-machines-jp-background.mp4";
const COVER = "/assets/images/war-machines-jp-cover.png";
const FALLBACK_BUY_LINK =
  "mailto:contact@kamdridi.com?subject=War%20Machines%20Japanese%20Edition%20Purchase";

const offerLinks = {
  special: LINKS.buySpecialEdition.startsWith("TODO_") ? FALLBACK_BUY_LINK : LINKS.buySpecialEdition,
  digital: LINKS.buyDigitalSingle.startsWith("TODO_") ? FALLBACK_BUY_LINK : LINKS.buyDigitalSingle
};

export const metadata: Metadata = {
  title: "ウォー・マシーンズ - 日本版",
  description: "KAMDRIDI「ウォー・マシーンズ」の日本向けプレミアム紹介ページ。"
};

const infoRows = [
  ["アーティスト", "カム・ドリディ"],
  ["作品名", "ウォー・マシーンズ"],
  ["仕様", "シングル"],
  ["ジャンル", "ダーク / シネマティック / バトル"],
  ["発売", "2026"],
  ["版", "日本語版"]
];

const platforms = [
  { label: "Spotify", href: LINKS.spotify, logo: <SpotifyLogo /> },
  { label: "Apple Music", href: LINKS.apple, logo: <AppleLogo /> },
  { label: "YouTube Music", href: LINKS.youtubeMusic, logo: <YouTubeLogo /> },
  { label: "Amazon Music", href: LINKS.amazonMusicJapan, logo: <AmazonLogo /> },
  { label: "LINE MUSIC", href: LINKS.lineMusic, logo: <PlatformWordmark text="LINE MUSIC" /> },
  { label: "AWA", href: LINKS.awa, logo: <PlatformWordmark text="AWA" /> },
  { label: "RecoChoku", href: LINKS.recochoku, logo: <PlatformWordmark text="RecoChoku" /> },
  { label: "mora", href: LINKS.mora, logo: <PlatformWordmark text="mora" /> }
];

const embers = Array.from({ length: 112 }, (_, index) => {
  const xSeed = (index * 23 + (index % 7) * 13) % 100;
  const driftSeed = ((index * 31) % 41) - 20;
  const swaySeed = ((index * 17) % 29) - 14;
  const sizeSeed = (index * 11) % 10;
  const isLarge = index % 11 === 0;
  const isTiny = index % 3 === 0;
  const durationSeed = isLarge ? 7.8 + ((index * 7) % 32) / 10 : 5.4 + ((index * 7) % 74) / 10;
  const delaySeed = ((index * 5) % 44) * -0.36;
  const heatSeed = isLarge ? 1.18 : 0.68 + (index % 6) * 0.08;
  const blurSeed = isLarge ? "0.45px" : isTiny ? "0.08px" : "0.18px";
  const size = isLarge ? 8.8 + (sizeSeed % 4) * 1.2 : isTiny ? 1.05 + (sizeSeed % 3) * 0.35 : 2.2 + sizeSeed * 0.55;
  const tail = isLarge ? "920%" : isTiny ? "420%" : "680%";

  return {
    left: `${xSeed}%`,
    bottom: `${-9 - (index % 13) * 6}vh`,
    size: `${size}px`,
    opacity: isLarge ? 0.86 : isTiny ? 0.34 + (index % 4) * 0.08 : 0.46 + (index % 7) * 0.06,
    drift: `${driftSeed * 5.6}px`,
    sway: `${swaySeed * 2.8}px`,
    duration: `${durationSeed}s`,
    delay: `${delaySeed}s`,
    heat: heatSeed,
    blur: blurSeed,
    tail
  };
});

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-[#1ed760]">
      <path d="M12 1.8a10.2 10.2 0 1 0 0 20.4 10.2 10.2 0 0 0 0-20.4Zm4.68 14.72a.64.64 0 0 1-.88.2c-2.42-1.48-5.46-1.81-9.04-.99a.64.64 0 0 1-.28-1.25c3.92-.89 7.28-.51 9.99 1.15.3.19.4.58.21.89Zm1.25-2.77a.8.8 0 0 1-1.1.26c-2.77-1.7-7-2.2-10.28-1.2a.8.8 0 0 1-.47-1.53c3.74-1.14 8.4-.58 11.59 1.37.38.23.5.72.26 1.1Zm.11-2.89C14.72 8.89 9.25 8.7 6.08 9.67a.96.96 0 1 1-.56-1.84c3.64-1.1 9.68-.88 13.5 1.4a.96.96 0 0 1-.98 1.64Z" />
    </svg>
  );
}

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-white">
      <path d="M16.7 2.5c.08.9-.24 1.78-.92 2.53-.7.77-1.62 1.22-2.5 1.15-.1-.86.27-1.78.9-2.48.7-.78 1.8-1.35 2.52-1.2ZM19.55 17.35c-.4.94-.6 1.36-1.12 2.18-.72 1.1-1.73 2.47-2.98 2.48-1.1.02-1.39-.72-2.9-.71-1.5 0-1.82.73-2.92.71-1.25-.01-2.2-1.25-2.92-2.36-2-3.08-2.21-6.69-.98-8.61.88-1.36 2.26-2.16 3.56-2.16 1.32 0 2.15.73 3.24.73 1.06 0 1.7-.73 3.23-.73 1.15 0 2.38.63 3.25 1.72-2.85 1.56-2.39 5.62.54 6.75Z" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-[#ff1a1a]">
      <path d="M21.58 7.2a2.72 2.72 0 0 0-1.9-1.92C18 4.83 12 4.83 12 4.83s-6 0-7.68.45A2.72 2.72 0 0 0 2.42 7.2C2 8.9 2 12.43 2 12.43s0 3.53.42 5.23a2.72 2.72 0 0 0 1.9 1.92c1.68.45 7.68.45 7.68.45s6 0 7.68-.45a2.72 2.72 0 0 0 1.9-1.92c.42-1.7.42-5.23.42-5.23s0-3.53-.42-5.23ZM10 15.65V9.2l5.24 3.22L10 15.65Z" />
    </svg>
  );
}

function AmazonLogo() {
  return <span className="text-base font-black lowercase tracking-[-0.05em] text-white">amazon music</span>;
}

function PlatformWordmark({ text }: { text: string }) {
  return <span className="text-sm font-black tracking-[0.05em] text-white">{text}</span>;
}

function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`relative border border-[#a51b18]/80 bg-[linear-gradient(180deg,rgba(20,22,24,0.88),rgba(5,5,6,0.96))] shadow-[inset_0_0_28px_rgba(255,45,22,0.12),0_0_24px_rgba(160,12,8,0.28)] ${className}`}
    >
      <span className="absolute left-2 top-2 h-3 w-3 border-l border-t border-[#ff3b2f]" />
      <span className="absolute right-2 top-2 h-3 w-3 border-r border-t border-[#ff3b2f]" />
      <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-[#ff3b2f]" />
      <span className="absolute bottom-2 right-2 h-3 w-3 border-b border-r border-[#ff3b2f]" />
      {children}
    </div>
  );
}

function ActionButton({
  href,
  icon,
  title,
  subtitle,
  primary = false
}: {
  href: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={`group flex min-h-16 items-center gap-3 border px-3 py-3 text-left transition hover:-translate-y-0.5 sm:min-h-20 sm:px-4 ${
        primary
          ? "border-[#ff3b21] bg-[linear-gradient(180deg,#b81710,#4a0807)] shadow-[0_0_32px_rgba(255,31,18,0.34)]"
          : "border-[#9c2a22]/85 bg-[linear-gradient(180deg,rgba(22,24,26,0.86),rgba(5,5,6,0.92))] hover:border-[#ff4b33]"
      }`}
    >
      <span className="text-white transition group-hover:text-[#ffddd6]">{icon}</span>
      <span>
        <span className="block text-lg font-black tracking-[0.02em] text-white sm:text-2xl sm:tracking-[0.03em]">
          {title}
        </span>
        <span className="mt-1 block text-xs font-semibold text-stone-300">{subtitle}</span>
      </span>
    </a>
  );
}

export default function WarMachinesJapanPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <div className="relative isolate min-h-screen bg-[#050505] text-white">
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <video
            className="absolute inset-0 h-full w-full object-cover opacity-[0.96] brightness-[1.03] contrast-[1.08] saturate-150"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster={BACKGROUND}
            aria-hidden="true"
          >
            <source src={BACKGROUND_VIDEO} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,122,32,0.11),transparent_24%),linear-gradient(180deg,rgba(3,3,4,0.12)_0%,rgba(5,5,6,0.22)_46%,rgba(2,2,2,0.5)_100%)]" />
          <div className="absolute inset-0 opacity-[0.42] [background-image:linear-gradient(115deg,transparent_0,transparent_45%,rgba(255,72,32,0.26)_46%,transparent_48%)] [background-size:190px_240px]" />
          <div className="absolute inset-x-0 top-0 h-[390px] bg-[radial-gradient(ellipse_at_top,rgba(255,88,28,0.42),transparent_58%)]" />
          {embers.map((ember, index) => (
            <span
              key={`${index}-${ember.left}-${ember.delay}`}
              className="jp-ember"
              style={
                {
                  left: ember.left,
                  bottom: ember.bottom,
                  width: ember.size,
                  height: ember.size,
                  opacity: ember.opacity,
                  "--ember-drift": ember.drift,
                  "--ember-sway": ember.sway,
                  "--ember-duration": ember.duration,
                  "--ember-delay": ember.delay,
                  "--ember-heat": ember.heat,
                  "--ember-blur": ember.blur,
                  "--ember-tail": ember.tail
                } as CSSProperties
              }
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-[1200px] shadow-[0_0_90px_rgba(0,0,0,0.9)]">
          <section className="relative px-4 pb-5 pt-8 sm:px-8 sm:pb-6 sm:pt-14">
            <div className="mx-auto max-w-[1040px] text-center">
              <div className="relative mx-auto h-40 w-full overflow-visible sm:h-72">
                <Image
                  src={LOGO}
                  alt="KAMDRIDI"
                  fill
                  priority
                  className="scale-[1.05] object-contain drop-shadow-[0_0_42px_rgba(255,54,18,0.9)] sm:scale-[1.1]"
                />
              </div>
              <p className="-mt-3 text-[11px] font-black uppercase tracking-[0.22em] text-stone-200 drop-shadow-[0_0_12px_rgba(255,255,255,0.35)] sm:-mt-5 sm:text-base sm:tracking-[0.4em]">
                日本語版シングル・プレゼンテーション
              </p>
              <p className="mt-3 text-sm font-black tracking-[0.18em] text-[#ff3a21] drop-shadow-[0_0_18px_rgba(255,32,18,0.62)] sm:text-lg sm:tracking-[0.3em]">
                ウォー・マシーンズ
              </p>
              <div className="mx-auto mt-6 h-px w-3/5 bg-[linear-gradient(90deg,transparent,#b01210,#ffefef,#b01210,transparent)]" />
            </div>
          </section>

          <section className="relative px-4 sm:px-8">
            <div className="mx-auto grid max-w-[1080px] gap-5 lg:grid-cols-[1.15fr_0.85fr] lg:items-stretch">
              <Panel className="overflow-hidden p-3 sm:p-4">
                <div className="grid gap-0 lg:grid-cols-[1.02fr_0.98fr]">
                  <div className="relative aspect-square border border-[#9a6b3a]/70 bg-black lg:aspect-auto lg:min-h-[420px]">
                    <Image src={COVER} alt="War Machines Japan cover" fill priority className="object-cover" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.58))]" />
                    <div className="absolute left-4 top-4 rounded-full border border-[#ff8d57]/45 bg-black/70 px-3 py-1 text-[10px] font-black uppercase tracking-[0.34em] text-[#ffb28a]">
                      日本版 / 2026
                    </div>
                  </div>

                  <div className="flex flex-col justify-between p-5 sm:p-7">
                    <div>
                      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#ff6d49] sm:text-xs sm:tracking-[0.42em]">
                        日本向けリリース資料
                      </p>
                      <h1 className="mt-4 font-display text-3xl font-black leading-[0.9] tracking-[0.03em] text-white sm:text-5xl sm:tracking-[0.06em]">
                        ウォー・マシーンズ
                      </h1>
                      <p className="mt-3 max-w-xl text-sm font-semibold leading-7 text-stone-300 sm:text-base">
                        赤い光、鋼鉄の質感、戦場のような緊張感で構成したKAMDRIDIの日本向けプレミアムページです。
                        聴く、観る、購入する導線をひとつのキャンペーン画面にまとめています。
                      </p>
                    </div>

                    <div className="mt-7 grid gap-3 sm:grid-cols-2">
                      {[
                        ["版", "日本スペシャル"],
                        ["形式", "シングル / デジタル"],
                        ["地域", "日本"],
                        ["信号", "最優先"]
                      ].map(([label, value]) => (
                        <div key={label} className="border border-[#4f1b18] bg-black/48 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#ff6d49] sm:tracking-[0.28em]">
                            {label}
                          </p>
                          <p className="mt-2 text-lg font-black text-white">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Panel>

              <Panel className="p-5 sm:p-6">
                <p className="text-xs font-black uppercase tracking-[0.34em] text-[#ff6d49]">伝送資料</p>
                <div className="mt-4 grid gap-0 border border-[#4f1b18] bg-black/35">
                  {infoRows.map(([label, value], index) => (
                    <div
                      key={label}
                      className={`grid grid-cols-1 gap-1 border-[#4f1b18] px-3 py-3 text-sm sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4 ${
                        index < infoRows.length - 1 ? "border-b" : ""
                      }`}
                    >
                      <span className="font-black uppercase tracking-[0.16em] text-[#ff6d49] sm:tracking-[0.2em]">
                        {label}
                      </span>
                      <span className="font-bold text-stone-100 sm:text-right">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 grid gap-3">
                  <ActionButton
                    href={offerLinks.special}
                    icon={<ShoppingCart className="h-8 w-8" />}
                    title="今すぐ購入"
                    subtitle="高品質・アーティストを支援"
                    primary
                  />
                  <ActionButton
                    href={LINKS.spotify}
                    icon={<PlayCircle className="h-8 w-8" />}
                    title="聴く"
                    subtitle="各配信サービスで再生"
                  />
                  <ActionButton
                    href={LINKS.teaser}
                    icon={<Film className="h-8 w-8" />}
                    title="ティーザー"
                    subtitle="予告編を視聴"
                  />
                </div>
              </Panel>
            </div>
          </section>

          <section className="relative px-5 py-6 text-center sm:px-10 sm:py-8">
            <h2 className="font-display text-[clamp(2.05rem,8.4vw,7rem)] font-black leading-[0.9] tracking-[0.01em] text-stone-100 drop-shadow-[0_7px_0_#3b0605] sm:tracking-[0.02em]">
              ウォー・マシーンズ
            </h2>
            <p className="mt-4 font-display text-2xl font-black tracking-[0.14em] text-[#ff1b18] drop-shadow-[0_0_16px_rgba(255,29,20,0.72)] sm:text-5xl sm:tracking-[0.28em]">
              カム・ドリディ
            </p>
            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-stone-400 sm:text-base">
              工業的で暗く、コレクター優先の日本向けプレゼンテーションです。
            </p>
          </section>

          <section className="relative grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-10">
            <Panel className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff2d21]">特典 01</p>
              <h2 className="mt-3 text-2xl font-black text-white">スペシャル・エディション</h2>
              <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-stone-300">
                3曲収録 / ダウンロードまたはフィジカルCD
              </p>
              <p className="mt-4 font-display text-5xl font-black text-[#ff2d21] drop-shadow-[0_0_18px_rgba(255,26,18,0.8)] sm:text-6xl">
                ¥1,500
              </p>
              <a
                href={offerLinks.special}
                className="mt-4 inline-flex border border-[#ff321d] px-4 py-2 text-xs font-black tracking-[0.16em] text-white"
              >
                今すぐ購入
              </a>
            </Panel>
            <Panel className="p-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#ff2d21]">特典 02</p>
              <h2 className="mt-3 text-2xl font-black text-white">デジタル・シングル</h2>
              <p className="mt-2 min-h-12 text-sm font-semibold leading-6 text-stone-300">1曲ダウンロード</p>
              <p className="mt-4 font-display text-5xl font-black text-[#ff2d21] drop-shadow-[0_0_18px_rgba(255,26,18,0.8)] sm:text-6xl">
                ¥250
              </p>
              <a
                href={offerLinks.digital}
                className="mt-4 inline-flex border border-[#ff321d] px-4 py-2 text-xs font-black tracking-[0.16em] text-white"
              >
                購入
              </a>
            </Panel>
          </section>

          <section className="relative px-5 pb-5 sm:px-10">
            <Panel className="p-5">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                <h2 className="font-display text-3xl font-black tracking-[0.14em] text-stone-100 sm:tracking-[0.24em]">
                  収録曲
                </h2>
                <span className="text-[10px] font-black uppercase tracking-[0.24em] text-[#ff6d49] sm:tracking-[0.4em]">
                  日本向け構成
                </span>
              </div>
              <ol className="mt-5 space-y-2 text-base font-bold text-stone-100 sm:text-lg">
                <li>1. ウォー・マシーンズ</li>
                <li>2. トゥー・ファスト・トゥー・ヤング</li>
                <li>3. ザ・フォール・オブ・ザ・ファースト・ナイト</li>
              </ol>
              <p className="mt-4 text-sm font-semibold text-[#d7a06e]">
                ※2曲目・3曲目は「Echoes Unearthed」収録曲です
              </p>
            </Panel>
          </section>

          <section className="relative grid gap-3 px-5 pb-5 sm:grid-cols-3 sm:px-10">
            <ActionButton
              href={offerLinks.special}
              icon={<ShoppingCart className="h-8 w-8" />}
              title="購入"
              subtitle="高品質・アーティスト支援"
              primary
            />
            <ActionButton
              href={LINKS.spotify}
              icon={<PlayCircle className="h-8 w-8" />}
              title="聴く"
              subtitle="各配信サービスで再生"
            />
            <ActionButton
              href={LINKS.teaser}
              icon={<Film className="h-8 w-8" />}
              title="予告編"
              subtitle="ティーザー映像を見る"
            />
          </section>

          <section className="relative px-5 pb-8 sm:px-10">
            <p className="mb-3 text-center text-xs font-black tracking-[0.34em] text-stone-300 sm:text-sm sm:tracking-[0.55em]">
              配信先
            </p>
            <Panel className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">
              {platforms.map((platform) => (
                <a
                  key={platform.label}
                  href={platform.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 items-center justify-center gap-2 border border-[#3b1613] bg-black/35 px-2 text-center text-sm font-black text-white transition hover:border-[#ff321d]"
                >
                  {platform.logo}
                  <span className="sr-only">{platform.label}</span>
                </a>
              ))}
            </Panel>
          </section>
        </div>
      </div>
    </main>
  );
}
