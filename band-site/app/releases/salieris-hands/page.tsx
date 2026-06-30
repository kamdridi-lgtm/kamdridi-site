import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, Play, Radio } from "lucide-react";

const assetBase = "/assets/images/salieris-hands";
const teaserUrl = "https://youtu.be/wDOu7-krT8s";
const heroVideo = "/assets/video/salieris-hands/salieri-hero.mp4";

const assets = {
  hero: `${assetBase}/salieri-opera-hall-hero.png`,
  frontCover: `${assetBase}/front-cover-approved.png`,
  backCover: `${assetBase}/back-cover-approved.png`,
  collectorPack: `${assetBase}/full-collector-pack.png`,
  packLineup: `${assetBase}/pack-back-front-spine.png`,
  disc: `${assetBase}/disc-mockup.png`,
  booklet: `${assetBase}/booklet-mockup.png`,
  jewelcase: `${assetBase}/jewelcase-mockup.png`,
  miniCard: `${assetBase}/mini-card-mockup.png`,
  operaTeaser: `${assetBase}/opera-teaser.png`,
  vertical: `${assetBase}/salieri-vertical-official.png`,
  wide: `${assetBase}/salieri-wide-official.png`,
  vienna: `${assetBase}/vienna-walking-official.png`
};

const mainTracks = [
  "Requiem",
  "Shadows of Vienna",
  "The Gift Was Not Mine",
  "Divine Jealousy",
  "Mozart's Ghost",
  "Invidia",
  "Confession in C Minor",
  "The Face of My Prayer",
  "Fugue for the Unchosen",
  "Salieri's Hands"
];

const bonusTracks = [
  "Salieri's Hands - Classical Version",
  "The Fall of the First Knight - Grand Opera Version",
  "The Prism - Grand Opera Version"
];

const editionCards = [
  {
    title: "Digital Release",
    text: "High-resolution audio and digital booklet prepared for the July 2026 release.",
    status: "Official teaser out now",
    image: assets.frontCover,
    alt: "Official square front cover artwork"
  },
  {
    title: "Collector CD",
    text: "Digipak / jewel case concept with printed booklet, disc art, and back cover treatment.",
    status: "Pre-order soon",
    image: assets.jewelcase,
    alt: "Collector CD jewelcase mockup"
  },
  {
    title: "Vinyl Edition",
    text: "Premium vinyl release concept for the physical campaign.",
    status: "Coming soon"
  },
  {
    title: "Special Edition Box",
    text: "Includes CD, vinyl, booklet, coin, art print, and special edition packaging concept.",
    status: "Pre-order soon",
    image: assets.collectorPack,
    alt: "Special edition collector pack mockup"
  },
  {
    title: "Hardcover Booklet",
    text: "Liner notes and story presentation by KAMDRIDI.",
    status: "Coming soon",
    image: assets.booklet,
    alt: "Hardcover booklet concept mockup"
  },
  {
    title: "Art Print",
    text: "Vienna 1791 exclusive artwork prepared for collector presentation.",
    status: "Coming soon",
    image: assets.vienna,
    alt: "Vienna 1791 cloaked figure artwork"
  },
  {
    title: "Collector Coin",
    text: "Antique bronze finish collector item for the special edition world.",
    status: "Collector item"
  }
];

const merchItems = [
  { title: "Salieri's Hands Tee", status: "Coming soon", image: assets.miniCard, alt: "Mini card artwork used for apparel concept" },
  { title: "Salieri's Hands Hoodie", status: "Coming soon", image: assets.frontCover, alt: "Official cover artwork for hoodie concept" },
  { title: "Poster", status: "Coming soon", image: assets.vertical, alt: "Vertical Salieri artwork poster" },
  { title: "Mug", status: "Coming soon" },
  { title: "Collector Bundle", status: "Coming soon", image: assets.packLineup, alt: "Collector bundle packaging lineup" }
];

const streamingItems = [
  { label: "Spotify", status: "Coming soon" },
  { label: "Apple Music", status: "Coming soon" },
  { label: "Amazon", status: "Coming soon" }
];

export const metadata: Metadata = {
  title: "SALIERI'S HANDS - Official Release Page",
  description:
    "SALIERI'S HANDS is a special off-series KAMDRIDI release. Vienna, 1791. Faith. Envy. Confession. Album release: July 2026."
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#d8aa5d]">{children}</p>;
}

function SectionIntro({
  eyebrow,
  title,
  children,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display text-3xl uppercase leading-tight tracking-[0.1em] text-[#f7deb0] sm:text-4xl">
        {title}
      </h2>
      {children ? <div className="mt-4 text-sm leading-7 text-[#d9c5a3] sm:text-base">{children}</div> : null}
    </div>
  );
}

function ActionLink({ href, children, tone = "solid" }: { href: string; children: React.ReactNode; tone?: "solid" | "ghost" }) {
  const isExternal = href.startsWith("http");
  const classes =
    tone === "solid"
      ? "border-[#e2b765] bg-[#d8a850] text-[#140d07] shadow-[0_18px_50px_rgba(216,168,80,0.22)] hover:bg-[#f0c878]"
      : "border-[#c79a4f]/65 bg-black/28 text-[#f6dfb8] hover:border-[#f0c878] hover:text-white";

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={`inline-flex min-h-12 items-center justify-center gap-2 border px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.18em] transition duration-300 hover:-translate-y-0.5 sm:px-5 ${classes}`}
    >
      {children}
    </a>
  );
}

function ImagePanel({ src, alt, contain = false, priority = false }: { src: string; alt: string; contain?: boolean; priority?: boolean }) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={contain ? "object-contain p-4" : "object-cover"}
      sizes="(max-width: 768px) 100vw, 42vw"
    />
  );
}

function ComingSoonCard({ title, status, text }: { title: string; status: string; text?: string }) {
  return (
    <article className="flex min-h-[260px] flex-col justify-between border border-[#a97a35]/45 bg-[radial-gradient(circle_at_28%_0%,rgba(244,198,106,0.14),transparent_36%),linear-gradient(180deg,rgba(22,13,7,0.94),rgba(7,4,3,0.95))] p-5 shadow-[inset_0_1px_0_rgba(255,226,164,0.08)]">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#d8aa5d]">{status}</p>
        <h3 className="mt-4 font-display text-2xl uppercase leading-tight tracking-[0.09em] text-[#f4d9a7]">{title}</h3>
        {text ? <p className="mt-4 text-sm leading-7 text-[#cdb58f]">{text}</p> : null}
      </div>
      <span className="mt-6 inline-flex w-fit border border-[#d8aa5d]/35 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#d8aa5d]">
        Coming soon
      </span>
    </article>
  );
}

function ProductCard({
  title,
  text,
  status,
  image,
  alt
}: {
  title: string;
  text: string;
  status: string;
  image?: string;
  alt?: string;
}) {
  if (!image || !alt) {
    return <ComingSoonCard title={title} status={status} text={text} />;
  }

  return (
    <article className="group border border-[#a97a35]/45 bg-[#0b0604]/72 shadow-[inset_0_1px_0_rgba(255,226,164,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#e0b46a]/75">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-[#a97a35]/25 bg-[#090604]">
        <ImagePanel src={image} alt={alt} contain />
      </div>
      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#d8aa5d]">{status}</p>
        <h3 className="mt-3 min-h-14 font-display text-2xl uppercase leading-tight tracking-[0.08em] text-[#f4d9a7]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#cdb58f]">{text}</p>
      </div>
    </article>
  );
}

export default function SalierisHandsPage() {
  return (
    <main className="overflow-hidden bg-[#050302] text-[#f4e4c4]">

      <section className="relative isolate overflow-hidden border-b border-[#9a7134]/35 bg-black">
        <video
          id="salieri-hero-video"
          className="block h-[82svh] min-h-[520px] w-full object-cover object-center sm:h-[88svh]"
          src={heroVideo}
          poster={assets.hero}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#050302] to-transparent" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var video = document.getElementById("salieri-hero-video");
                if (!video) return;
                var setSlowMotion = function () {
                  video.defaultPlaybackRate = 0.5;
                  video.playbackRate = 0.5;
                };
                setSlowMotion();
                video.addEventListener("loadedmetadata", setSlowMotion);
                video.addEventListener("play", setSlowMotion);
              })();
            `
          }}
        />
      </section>
      <section className="border-b border-[#9a7134]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.48fr_0.52fr] lg:items-center">
          <div className="mx-auto w-full max-w-[520px]">
            <div className="relative aspect-square overflow-hidden border border-[#e0b46a]/65 bg-[#090604] shadow-[0_34px_120px_rgba(0,0,0,0.68),0_0_70px_rgba(224,180,106,0.14)]">
              <Image src={assets.frontCover} alt="Official front cover artwork for SALIERI'S HANDS" fill priority className="object-contain" sizes="(max-width: 768px) 92vw, 520px" />
            </div>
          </div>
          <div>
            <SectionIntro eyebrow="Official front cover" title="The approved album artwork">
              <p>The square front cover remains the primary release artwork, framed cleanly without heavy overlay or cropping.</p>
            </SectionIntro>
            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden border border-[#a97a35]/45 bg-[#090604]">
                <ImagePanel src={assets.backCover} alt="Official back cover and tracklist artwork" contain />
              </div>
              <div className="relative aspect-[4/3] overflow-hidden border border-[#a97a35]/45 bg-[#090604]">
                <ImagePanel src={assets.disc} alt="Official collector disc mockup" contain />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="teaser" className="border-b border-[#9a7134]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Official teaser" title="Watch the first glimpse" align="center">
            <p>The only live media link on this page is the official YouTube teaser.</p>
          </SectionIntro>
          <a href={teaserUrl} target="_blank" rel="noreferrer" className="group relative mt-9 block min-h-[340px] overflow-hidden border border-[#a97a35]/55 bg-black shadow-[0_32px_100px_rgba(0,0,0,0.48)] sm:min-h-[500px]">
            <ImagePanel src={assets.operaTeaser} alt="Official cinematic teaser artwork" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.38)),radial-gradient(circle_at_50%_45%,transparent,rgba(0,0,0,0.34)_70%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-[#e8c47e]/75 bg-black/42 text-[#ffe6b7] shadow-[0_0_60px_rgba(224,180,106,0.3)] transition group-hover:scale-105 group-hover:border-[#ffe0a0]">
                <Play className="ml-1 h-10 w-10 fill-current" />
              </span>
            </div>
          </a>
        </div>
      </section>

      <section className="border-b border-[#9a7134]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="relative min-h-[420px] overflow-hidden border border-[#a97a35]/45 bg-black">
            <ImagePanel src={assets.vertical} alt="Salieri hands candle manuscript Requiem artwork" />
          </div>
          <div className="flex flex-col justify-center border border-[#a97a35]/45 bg-[radial-gradient(circle_at_10%_0%,rgba(244,198,106,0.16),transparent_35%),linear-gradient(180deg,rgba(20,12,7,0.94),rgba(8,5,3,0.96))] p-6 sm:p-9">
            <SectionIntro eyebrow="Concept" title="A confession written in silence">
              <p>Vienna, 1791.</p>
              <p className="mt-4">In the shadow of genius, faith turns into envy. A man writes not for glory, but for absolution.</p>
              <p className="mt-4">Dark orchestration. Haunting choirs. Crushing riffs. A requiem for the man history misunderstood.</p>
            </SectionIntro>
          </div>
        </div>
      </section>

      <section id="tracklist" className="border-b border-[#9a7134]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Full tracklist" title="Main album and bonus tracks" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.54fr]">
            <div className="overflow-hidden border border-[#a97a35]/45 bg-[#0b0604]/72">
              {mainTracks.map((track, index) => (
                <div key={track} className="grid grid-cols-[56px_1fr] items-center border-b border-[#a97a35]/18 px-4 py-4 last:border-b-0 sm:grid-cols-[78px_1fr]">
                  <span className="font-display text-2xl text-[#d8aa5d] sm:text-3xl">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-base font-semibold text-[#f7e3c2]">{track}</span>
                </div>
              ))}
            </div>
            <div className="border border-[#a97a35]/45 bg-[linear-gradient(180deg,rgba(24,14,8,0.92),rgba(10,6,4,0.96))] p-5 sm:p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-[#e0b46a]">Bonus tracks</h3>
              <div className="mt-5 space-y-5">
                {bonusTracks.map((track, index) => (
                  <div key={track} className="grid grid-cols-[44px_1fr] gap-3">
                    <span className="font-display text-2xl text-[#d8aa5d]">{index + 11}</span>
                    <span className="text-sm leading-6 text-[#f0d8ad]">{track}</span>
                  </div>
                ))}
              </div>
              <p className="mt-7 border-t border-[#a97a35]/20 pt-5 text-sm leading-7 text-[#cdb58f]">
                From the forthcoming KAMDRIDI album TWICE UPON A TIME.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="collector" className="border-b border-[#9a7134]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Editions / collector" title="Exclusive releases and collectibles" align="center">
            <p>No fake checkout, no unapproved prices, and no invented platform links.</p>
          </SectionIntro>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {editionCards.map((edition) => (
              <ProductCard key={edition.title} {...edition} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <span className="inline-flex min-h-12 items-center justify-center border border-[#e0b46a]/60 bg-[#d8a850]/10 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f6dfb8]">
              Pre-order collector edition - coming soon
            </span>
          </div>
        </div>
      </section>

      <section id="merch" className="border-b border-[#9a7134]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Merch" title="Derived products" align="center">
            <p>Merch concepts are held as coming soon until final products are approved.</p>
          </SectionIntro>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {merchItems.map((item) => (
              <ProductCard key={item.title} title={item.title} text="Collector campaign item in preparation." status={item.status} image={item.image} alt={item.alt} />
            ))}
          </div>
          <div className="mt-8 text-center">
            <span className="inline-flex min-h-12 items-center justify-center border border-[#e0b46a]/60 bg-black/26 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f6dfb8]">
              View all merch - coming soon
            </span>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.68fr_1fr]">
          <div className="relative min-h-[360px] overflow-hidden border border-[#a97a35]/45 bg-black">
            <ImagePanel src={assets.vienna} alt="Vienna 1791 cloaked figure artwork" />
          </div>
          <div className="border border-[#a97a35]/45 bg-[radial-gradient(circle_at_10%_0%,rgba(244,198,106,0.16),transparent_34%),linear-gradient(180deg,rgba(20,12,7,0.94),rgba(7,4,3,0.97))] p-6 sm:p-8">
            <Eyebrow>Release update</Eyebrow>
            <h2 className="mt-4 font-display text-4xl uppercase leading-tight tracking-[0.1em] text-[#f7deb0] sm:text-5xl">
              {"SALIERI\u2019S HANDS"}
            </h2>
            <p className="mt-4 text-lg text-[#f4e4c4]">Official teaser out now. Album release: July 2026.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink href={teaserUrl}>
                <Play className="h-4 w-4" />
                Watch Teaser
              </ActionLink>
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#c79a4f]/65 bg-black/28 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f6dfb8] transition hover:-translate-y-0.5 hover:border-[#f0c878]">
                <Bell className="h-4 w-4" />
                Join Release Updates
              </Link>
            </div>
            <div className="mt-8 grid gap-3">
              {streamingItems.map((platform) => (
                <div key={platform.label} className="flex items-center justify-between gap-4 border border-[#a97a35]/25 bg-black/28 px-4 py-3">
                  <span className="text-sm font-semibold text-[#f7e3c2]">{platform.label}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#d8aa5d]">{platform.status}</span>
                </div>
              ))}
              <a href={teaserUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border border-[#e0b46a]/50 bg-[#d8a850]/10 px-4 py-3 text-sm font-semibold text-[#f6dfb8] transition hover:border-[#f0c878]">
                <span>YouTube</span>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]">
                  Teaser live <Radio className="h-4 w-4" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#9a7134]/25 px-4 py-10 text-center sm:px-6">
        <Link href="/releases" className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#d8aa5d] transition hover:text-[#f7deb0]">
          More releases
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
