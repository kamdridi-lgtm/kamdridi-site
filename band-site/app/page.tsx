import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Box,
  Eye,
  Film,
  Play,
  Share2,
  Sparkles,
  Youtube
} from "lucide-react";
import { FirstKnightEasterEgg } from "@/components/first-knight-easter-egg";
import { featuredVideo, gameExperiences, socialFeed, streamingLinks, visualAlbumScenes } from "@/data/site";

const albumCover = "/assets/images/releases/echoes-unearthed-cover.jpg";
const albumCoverPng = "/assets/images/releases/echoes-unearthed-cover.png";
const warMachinesCover = "/assets/images/releases/war-machines-cover.png";
const collectorCdImage = "/store/cd-product.jpg";
const vinylImage = "/store/vinyl-product.jpg";
const cassetteImage = "/store/war-machines-helmet.jpg";
const japanHref = "/app/war-machines-jp";
const brandLogo = "/assets/images/kamdridi-logo-hd.png";
const spotifyAlbumHref =
  "https://open.spotify.com/album/4rrOMu0BIhzJt1ElOfgXZu?si=a6eAct6jQl6BapO1_Zm4gA";
const youtubeWatchHref = "https://www.youtube.com/watch?v=hzlVyLQN6a8";

const tracks = [
  ["01", "War Machines"],
  ["02", "Too Fast Too Young"],
  ["03", "Our Lost Dreams"],
  ["04", "Junction Ahead (New Heaven's Odyssey)"],
  ["05", "17 For Ever"],
  ["06", "The Victory Goes On"],
  ["07", "Alone Apart / One Apart"],
  ["08", "Michael Remembers"],
  ["09", "The Fall of the First Knight"]
];

const universeCards = [
  {
    title: "Visual Album",
    text: "Watch the cinematic experience.",
    image: visualAlbumScenes[0]?.image || warMachinesCover,
    href: "/visual-album"
  },
  {
    title: "The Gilded Null",
    text: "Discover the story and the game.",
    image: gameExperiences[0]?.poster || "/official-game-poster.png",
    href: "/games/the-gilded-null"
  },
  {
    title: "The Fall of the First Knight",
    text: "The novel rescue story.",
    image: "/first-knight.jpg",
    href: "/who-is-kam-dridi"
  },
  {
    title: "Archive / Comic",
    text: "Comics, archive and lore.",
    image: "/assets/images/comic/page-grunge-split.png",
    href: "/who-is-kam-dridi#comic-reader"
  },
  {
    title: "Fan Club",
    text: "Join the community and get exclusive access.",
    image: "/assets/images/gallery/p04_portrait_leather.jpg",
    href: "/fan-club"
  }
];

const products = [
  {
    status: "Available now",
    title: "Echoes Unearthed - Collector CD",
    text: "Physical collector CD edition with 9 official tracks, hidden bonus archive track, premium booklet, and collector artwork.",
    price: "$34",
    image: collectorCdImage,
    href: "/store",
    cta: "Buy Collector CD",
    live: true
  },
  {
    status: "Coming soon",
    title: "Special Collector Edition",
    text: "Expanded collector edition with exclusive archive material and premium physical packaging.",
    price: "Future edition",
    image: albumCoverPng,
    href: "/store",
    cta: "Coming Soon",
    live: false
  },
  {
    status: "Coming soon",
    title: "Echoes Unearthed - Vinyl Edition",
    text: "Collector vinyl edition currently in preparation. No preorder, stock count, or release date is shown until confirmed.",
    price: "Future edition",
    image: vinylImage,
    href: "/store",
    cta: "Coming Soon",
    live: false
  },
  {
    status: "Coming soon",
    title: "Archive Cassette",
    text: "Limited cassette edition inspired by underground sci-fi rock archive transmissions.",
    price: "Future edition",
    image: cassetteImage,
    href: "/store",
    cta: "Coming Soon",
    live: false
  }
];

const listenLinks = [
  { label: "Spotify", href: spotifyAlbumHref, brandClass: "text-[#1DB954]", logo: <SpotifyLogo /> },
  {
    label: "Apple Music",
    href: streamingLinks.find((link) => link.label === "Apple Music")?.href || "",
    brandClass: "text-white",
    logo: <AppleMusicLogo />
  },
  { label: "YouTube", href: youtubeWatchHref, brandClass: "text-[#ff0000]", logo: <YouTubeLogo /> },
  {
    label: "Amazon Music",
    href: streamingLinks.find((link) => link.label === "Amazon Music")?.href || "",
    brandClass: "text-[#25d1da]",
    logo: <AmazonMusicLogo />
  }
].filter((link) => link.href);

export const metadata: Metadata = {
  title: "Echoes Unearthed - Official Album Hub",
  description:
    "Official KAMDRIDI album headquarters for Echoes Unearthed with streaming links, tracklist, collector editions, video, and the cinematic universe."
};

function PremiumButton({
  href,
  children,
  tone = "primary"
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "secondary" | "red";
}) {
  const classes = {
    primary:
      "border-[#f4a33f]/70 bg-[linear-gradient(180deg,#d66a16,#8f3208)] text-white shadow-[0_18px_55px_rgba(201,82,16,0.32)] hover:border-[#ffd18a]",
    secondary:
      "border-[#c57b32]/45 bg-black/35 text-stone-100 hover:border-[#f4c66a]/70 hover:text-[#f4c66a]",
    red: "border-red-500/50 bg-[linear-gradient(180deg,#d71920,#8d0508)] text-white shadow-[0_18px_55px_rgba(170,10,10,0.3)] hover:border-red-300"
  };

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center border px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] transition duration-300 hover:-translate-y-0.5 sm:px-7 ${classes[tone]}`}
    >
      {children}
    </Link>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.38em] text-[#c98542]">{eyebrow}</p> : null}
      <h2 className="font-display text-3xl uppercase tracking-[0.12em] text-[#e8b777] sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function SpotifyLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M12 1.8a10.2 10.2 0 1 0 0 20.4 10.2 10.2 0 0 0 0-20.4Zm4.68 14.72a.64.64 0 0 1-.88.2c-2.42-1.48-5.46-1.81-9.04-.99a.64.64 0 0 1-.28-1.25c3.92-.89 7.28-.51 9.99 1.15.3.19.4.58.21.89Zm1.25-2.77a.8.8 0 0 1-1.1.26c-2.77-1.7-7-2.2-10.28-1.2a.8.8 0 0 1-.47-1.53c3.74-1.14 8.4-.58 11.59 1.37.38.23.5.72.26 1.1Zm.11-2.89C14.72 8.89 9.25 8.7 6.08 9.67a.96.96 0 1 1-.56-1.84c3.64-1.1 9.68-.88 13.5 1.4a.96.96 0 0 1-.98 1.64Z" />
    </svg>
  );
}

function AppleMusicLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M16.7 2.5c.08.9-.24 1.78-.92 2.53-.7.77-1.62 1.22-2.5 1.15-.1-.86.27-1.78.9-2.48.7-.78 1.8-1.35 2.52-1.2ZM19.55 17.35c-.4.94-.6 1.36-1.12 2.18-.72 1.1-1.73 2.47-2.98 2.48-1.1.02-1.39-.72-2.9-.71-1.5 0-1.82.73-2.92.71-1.25-.01-2.2-1.25-2.92-2.36-2-3.08-2.21-6.69-.98-8.61.88-1.36 2.26-2.16 3.56-2.16 1.32 0 2.15.73 3.24.73 1.06 0 1.7-.73 3.23-.73 1.15 0 2.38.63 3.25 1.72-2.85 1.56-2.39 5.62.54 6.75Z" />
    </svg>
  );
}

function YouTubeLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5 fill-current">
      <path d="M21.58 7.2a2.72 2.72 0 0 0-1.9-1.92C18 4.83 12 4.83 12 4.83s-6 0-7.68.45A2.72 2.72 0 0 0 2.42 7.2C2 8.9 2 12.43 2 12.43s0 3.53.42 5.23a2.72 2.72 0 0 0 1.9 1.92c1.68.45 7.68.45 7.68.45s6 0 7.68-.45a2.72 2.72 0 0 0 1.9-1.92c.42-1.7.42-5.23.42-5.23s0-3.53-.42-5.23ZM10 15.65V9.2l5.24 3.22L10 15.65Z" />
    </svg>
  );
}

function AmazonMusicLogo() {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold lowercase leading-none tracking-[-0.02em]">
      amazon
      <span className="font-semibold">music</span>
    </span>
  );
}

function PlatformLinks({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "flex flex-wrap items-center gap-2" : "grid gap-4 sm:grid-cols-2 lg:grid-cols-4"}>
      {listenLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          aria-label={`Listen on ${link.label}`}
          title={`Listen on ${link.label}`}
          className={
            compact
              ? `inline-flex h-10 min-w-10 items-center justify-center border border-white/10 bg-black/45 px-3 transition hover:-translate-y-0.5 hover:border-[#f4c66a]/60 ${link.brandClass}`
              : `flex min-h-16 items-center justify-center gap-3 border border-white/10 bg-black/45 px-5 text-lg font-semibold text-stone-100 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:border-[#f4c66a]/60 ${link.brandClass}`
          }
        >
          {link.logo}
          {compact ? <span className="sr-only">{link.label}</span> : <span>{link.label}</span>}
        </a>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <FirstKnightEasterEgg />
      <div className="relative overflow-hidden bg-[#050403] text-white">
        <div className="pointer-events-none fixed inset-0 z-0 opacity-55">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(209,91,18,0.18),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(244,198,106,0.13),transparent_28%),linear-gradient(180deg,#050403,#090604_42%,#030303)]" />
          <div className="absolute inset-0 bg-[url('/assets/images/band/live_stage.jpg')] bg-cover bg-fixed bg-center opacity-[0.16]" />
        </div>

        <section className="relative z-10 border-b border-[#a86225]/25">
          <div className="absolute inset-0">
            <Image src={albumCover} alt="" fill priority className="object-cover opacity-20 blur-[1px]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,3,2,0.94),rgba(4,3,2,0.72),rgba(4,3,2,0.92)),radial-gradient(circle_at_82%_82%,rgba(220,91,18,0.32),transparent_34%)]" />
          </div>
          <div className="relative mx-auto grid min-h-[calc(100svh-140px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
            <div className="mx-auto w-full max-w-[360px] lg:max-w-[500px]">
              <div className="relative aspect-square border border-[#d08a43]/35 bg-black shadow-[0_35px_120px_rgba(0,0,0,0.68)]">
                <Image src={albumCover} alt="Echoes Unearthed album cover" fill priority className="object-cover" />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <div className="relative mx-auto h-28 w-full max-w-[460px] lg:mx-0">
                <Image src={brandLogo} alt="KAMDRIDI logo" fill priority className="object-contain lg:object-left" />
              </div>
              <h1 className="mt-4 font-display text-[clamp(3.2rem,10vw,8.8rem)] uppercase leading-[0.78] tracking-[0.08em] text-stone-100">
                Echoes
                <br />
                Unearthed
              </h1>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-stone-200 sm:text-lg">
                The full cinematic rock album is available now. Stream the record, enter the Echoes
                Unearthed universe, and collect the physical edition.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
                Stream the full album now. Explore the official tracklist, collector editions,
                Japan campaign page, and the Echoes Unearthed universe.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PremiumButton href="#listen-now">Stream Full Album</PremiumButton>
                <PremiumButton href="#collector-products" tone="secondary">
                  Collector CD
                </PremiumButton>
                <PremiumButton href="#collector-products" tone="secondary">
                  Special Edition
                </PremiumButton>
                <PremiumButton href={japanHref} tone="red">
                  Japan Page
                </PremiumButton>
              </div>
              <div className="mt-7 grid gap-3 text-xs uppercase tracking-[0.2em] text-stone-300 sm:grid-cols-3">
                <Link href="#video" className="inline-flex items-center justify-center gap-3 py-2 hover:text-[#f4c66a]">
                  <Play className="h-4 w-4" /> Watch War Machines
                </Link>
                <Link href="#universe" className="inline-flex items-center justify-center gap-3 py-2 hover:text-[#f4c66a]">
                  <Eye className="h-4 w-4" /> Enter the Universe
                </Link>
                <a
                  href="https://kamdridi.com"
                  className="inline-flex items-center justify-center gap-3 py-2 hover:text-[#f4c66a]"
                >
                  <Share2 className="h-4 w-4" /> Share Album
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="listen-now" className="relative z-10 border-b border-[#a86225]/20 px-4 py-9 sm:px-6">
          <SectionTitle title="Listen Now" />
          <div className="mx-auto mt-7 max-w-7xl">
            <PlatformLinks />
          </div>
        </section>

        <section id="tracklist" className="relative z-10 border-b border-[#a86225]/20 px-4 py-10 sm:px-6">
          <SectionTitle title="Tracklist" />
          <div className="mx-auto mt-8 max-w-7xl overflow-hidden border border-[#8f5728]/35 bg-black/48">
            {tracks.map(([number, title]) => (
              <div
                key={number}
                className="grid gap-3 border-b border-white/10 px-4 py-4 last:border-b-0 md:grid-cols-[70px_1fr_auto] md:items-center"
              >
                <span className="font-display text-2xl text-[#c98542]">{number}</span>
                <a
                  href={spotifyAlbumHref}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-stone-100 transition hover:text-[#f4c66a]"
                >
                  {title}
                </a>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                    Album
                  </span>
                  <PlatformLinks compact />
                </div>
              </div>
            ))}
            <div className="grid gap-3 bg-[#140d08] px-4 py-5 sm:grid-cols-[70px_1fr_auto] sm:items-center">
              <span className="font-display text-2xl text-[#f4c66a]">Bonus</span>
              <h3 className="font-semibold text-stone-100">Echoes of Our Youth</h3>
              <span className="rounded-full border border-[#f4c66a]/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f4c66a]">
                Physical Collector Edition Bonus Track
              </span>
            </div>
          </div>
        </section>

        <section id="collector-products" className="relative z-10 border-b border-[#a86225]/20 px-4 py-10 sm:px-6">
          <SectionTitle eyebrow="Official Store" title="Collector Products" />
          <div className="mx-auto mt-9 grid max-w-7xl gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.title} className="border border-[#8f5728]/35 bg-black/52">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-[#120b07]">
                  <Image src={product.image} alt={product.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <p className={product.live ? "text-xs uppercase tracking-[0.25em] text-[#f4c66a]" : "text-xs uppercase tracking-[0.25em] text-stone-500"}>
                    {product.status}
                  </p>
                  <h3 className="mt-3 min-h-16 font-display text-2xl uppercase tracking-[0.08em] text-stone-100">
                    {product.title}
                  </h3>
                  <p className="mt-3 min-h-28 text-sm leading-6 text-stone-400">{product.text}</p>
                  <p className="mt-5 text-lg font-semibold text-[#e8b777]">{product.price}</p>
                  <div className="mt-5">
                    {product.live ? (
                      <PremiumButton href={product.href}>{product.cta}</PremiumButton>
                    ) : (
                      <span className="inline-flex min-h-12 items-center justify-center border border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        {product.cta}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative z-10 border-b border-[#a86225]/20 px-4 py-10 sm:px-6">
          <div className="mx-auto grid max-w-7xl items-center gap-6 overflow-hidden border border-[#8f5728]/35 bg-black/50 p-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#c98542]">Japan Campaign</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.1em] text-stone-100 sm:text-5xl">
                War Machines / ウォー・マシーンズ
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-stone-300">
                Official Japanese campaign page for the Echoes Unearthed universe.
              </p>
              <p className="mt-2 text-sm text-stone-500">ダークで映画的なSFロック。</p>
              <div className="mt-7">
                <PremiumButton href={japanHref} tone="red">
                  Japan Page
                </PremiumButton>
              </div>
            </div>
            <div className="relative min-h-72 overflow-hidden">
              <Image src="/assets/images/gallery/p03_portrait_mic.jpg" alt="War Machines Japan campaign" fill className="object-cover" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,transparent,rgba(0,0,0,0.78))]" />
            </div>
          </div>
        </section>

        <section id="universe" className="relative z-10 border-b border-[#a86225]/20 px-4 py-10 sm:px-6">
          <SectionTitle title="Enter The Echoes Unearthed Universe" />
          <div className="mx-auto mt-8 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {universeCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group overflow-hidden border border-white/10 bg-black/50 transition hover:-translate-y-1 hover:border-[#f4c66a]/50"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={card.image} alt={card.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-display text-xl uppercase tracking-[0.08em] text-[#e8b777]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{card.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="video" className="relative z-10 px-4 py-10 sm:px-6">
          <SectionTitle eyebrow="News / Video" title="Active Signals" />
          <div className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="overflow-hidden border border-[#8f5728]/35 bg-black/55">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={featuredVideo.embedUrl}
                  title={featuredVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="grid gap-4">
              {socialFeed.map((item) => (
                <div key={`${item.platform}-${item.date}`} className="border border-white/10 bg-black/50 p-5">
                  <div className="flex items-center gap-3 text-[#f4c66a]">
                    {item.platform === "YouTube" ? <Youtube className="h-5 w-5" /> : item.platform === "TikTok" ? <Film className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                    <p className="text-xs uppercase tracking-[0.28em]">{item.platform}</p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{item.caption}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-stone-600">{item.date}</p>
                </div>
              ))}
              <Link
                href="/news"
                className="inline-flex items-center justify-center gap-3 border border-[#8f5728]/45 bg-black/50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-stone-200 transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                News / Video <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="relative z-10 border-t border-[#a86225]/20 px-4 py-12 text-center sm:px-6">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <PremiumButton href="#listen-now">Stream the Album</PremiumButton>
            <PremiumButton href="#universe" tone="secondary">
              Enter the Universe
            </PremiumButton>
            <PremiumButton href="#collector-products" tone="secondary">
              <Box className="mr-2 h-4 w-4" /> Collect the Physical Edition
            </PremiumButton>
          </div>
        </section>
      </div>
    </>
  );
}
