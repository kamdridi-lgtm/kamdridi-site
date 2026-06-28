import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Bell, ExternalLink, ListMusic, Package, Play, Radio, Sparkles } from "lucide-react";

const assetBase = "/assets/images/salieris-hands";
const brandLogo = "/assets/images/kamdridi-logo-hd.png";
const teaserUrl = "https://youtu.be/wDOu7-krT8s";

const approvedAssets = {
  frontCover: `${assetBase}/front-cover-approved.png`,
  backCover: `${assetBase}/back-cover-approved.png`,
  collectorPack: `${assetBase}/full-collector-pack.png`,
  packLineup: `${assetBase}/pack-back-front-spine.png`,
  booklet: `${assetBase}/booklet-mockup.png`,
  jewelcase: `${assetBase}/jewelcase-mockup.png`,
  miniCard: `${assetBase}/mini-card-mockup.png`,
  operaTeaser: `${assetBase}/opera-teaser.png`,
  operaHallHero: `${assetBase}/salieri-opera-hall-hero.png`,
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
    image: approvedAssets.frontCover,
    alt: "Official square front cover artwork"
  },
  {
    title: "Collector CD",
    text: "Digipak / jewel case concept with printed booklet, disc art, and back cover treatment.",
    status: "Pre-order soon",
    image: approvedAssets.jewelcase,
    alt: "Collector CD jewelcase mockup"
  },
  {
    title: "Vinyl Edition",
    text: "Premium vinyl release concept for the physical campaign.",
    status: "Coming soon",
    image: null
  },
  {
    title: "Special Edition Box",
    text: "Includes CD, vinyl, booklet, coin, art print, and special edition packaging concept.",
    status: "Pre-order soon",
    image: approvedAssets.collectorPack,
    alt: "Special edition collector pack mockup"
  },
  {
    title: "Hardcover Booklet",
    text: "Liner notes and story presentation by KAMDRIDI.",
    status: "Coming soon",
    image: approvedAssets.booklet,
    alt: "Hardcover booklet concept mockup"
  },
  {
    title: "Art Print",
    text: "Vienna 1791 exclusive artwork prepared for collector presentation.",
    status: "Coming soon",
    image: approvedAssets.vienna,
    alt: "Vienna 1791 cloaked figure artwork"
  },
  {
    title: "Collector Coin",
    text: "Antique bronze finish collector item for the special edition world.",
    status: "Collector item",
    image: null
  }
];

const collectorLineup = [
  { title: "CD Digipak", image: approvedAssets.jewelcase, alt: "CD digipak and jewelcase concept" },
  { title: "Vinyl Edition", image: null },
  { title: "Hardcover Booklet", image: approvedAssets.booklet, alt: "Hardcover booklet artwork" },
  { title: "Collector Coin", image: null },
  { title: "Art Print", image: approvedAssets.vienna, alt: "Vienna 1791 art print artwork" },
  { title: "Special Edition Box", image: approvedAssets.collectorPack, alt: "Special edition box and collector pack" }
];

const merchItems = [
  { title: "Salieri's Hands Tee", image: approvedAssets.miniCard, alt: "Mini card artwork used for apparel concept" },
  { title: "Salieri's Hands Hoodie", image: approvedAssets.frontCover, alt: "Official cover artwork for hoodie concept" },
  { title: "Poster", image: approvedAssets.vertical, alt: "Vertical Salieri artwork poster" },
  { title: "Mug", image: null },
  { title: "Collector Bundle", image: approvedAssets.packLineup, alt: "Collector bundle packaging lineup" }
];

const mediaItems = [
  { title: "Vienna teaser", image: approvedAssets.vienna, alt: "Vienna teaser artwork" },
  { title: "Opera signal", image: approvedAssets.operaTeaser, alt: "Opera and conductor teaser artwork" },
  { title: "Manuscript study", image: approvedAssets.vertical, alt: "Salieri hands candle manuscript artwork" }
];

const streamingItems = ["Spotify", "Apple Music", "Amazon"];

export const metadata: Metadata = {
  title: "SALIERI'S HANDS - Official Release Page",
  description:
    "SALIERI'S HANDS is a special off-series KAMDRIDI release. Vienna, 1791. Faith. Envy. Confession. Album release: July 2026."
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-[#c99a52]">{children}</p>;
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
      <h2 className="mt-3 font-display text-3xl uppercase leading-tight tracking-[0.1em] text-[#f3d8a7] sm:text-4xl">
        {title}
      </h2>
      {children ? <div className="mt-4 text-sm leading-7 text-stone-400 sm:text-base">{children}</div> : null}
    </div>
  );
}

function ActionLink({
  href,
  children,
  tone = "solid"
}: {
  href: string;
  children: React.ReactNode;
  tone?: "solid" | "ghost";
}) {
  const isExternal = href.startsWith("http");
  const classes =
    tone === "solid"
      ? "border-[#d6ad68] bg-[#d2a456] text-[#120c08] shadow-[0_18px_50px_rgba(196,147,72,0.24)] hover:bg-[#e9c47f]"
      : "border-[#b68b45]/55 bg-black/35 text-[#f4deb8] hover:border-[#e4bd75] hover:text-white";

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

function ComingSoonPanel({ title }: { title: string }) {
  return (
    <div className="flex h-full min-h-[180px] items-center justify-center border border-[#8a642f]/28 bg-[radial-gradient(circle_at_50%_0%,rgba(244,198,106,0.11),transparent_42%),linear-gradient(180deg,rgba(16,10,6,0.9),rgba(5,3,2,0.96))] p-5 text-center">
      <div>
        <p className="font-display text-2xl uppercase tracking-[0.12em] text-[#d9b36d]">{title}</p>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.28em] text-stone-500">Visual asset coming soon</p>
      </div>
    </div>
  );
}

function ImagePanel({
  src,
  alt,
  contain = false,
  priority = false
}: {
  src: string;
  alt: string;
  contain?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={contain ? "object-contain p-4" : "object-cover"}
      sizes="(max-width: 768px) 100vw, 40vw"
    />
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
  image?: string | null;
  alt?: string;
}) {
  return (
    <article className="group border border-[#8a642f]/35 bg-black/55 transition duration-300 hover:-translate-y-1 hover:border-[#d6ad68]/65">
      <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-[#080503]">
        {image && alt ? (
          <ImagePanel src={image} alt={alt} contain />
        ) : (
          <ComingSoonPanel title={title} />
        )}
      </div>
      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#c99a52]">{status}</p>
        <h3 className="mt-3 min-h-14 font-display text-2xl uppercase leading-tight tracking-[0.08em] text-[#f2d6a5]">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-7 text-stone-400">{text}</p>
      </div>
    </article>
  );
}

export default function SalierisHandsPage() {
  return (
    <main className="overflow-hidden bg-[#040302] text-stone-100">
      <section className="relative isolate border-b border-[#8a642f]/25">
        <div className="absolute inset-0 hidden md:block">
          <Image src={approvedAssets.operaHallHero} alt="" fill priority className="object-cover object-center opacity-46" sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#040302_0%,rgba(4,3,2,0.88)_30%,rgba(4,3,2,0.68)_58%,#040302_100%),linear-gradient(180deg,rgba(4,3,2,0.08),#040302_94%)]" />
        </div>
        <div className="absolute inset-0 md:hidden">
          <Image src={approvedAssets.operaHallHero} alt="" fill priority className="object-cover object-center opacity-36" sizes="100vw" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,3,2,0.2),rgba(4,3,2,0.78)_44%,#040302_94%)]" />
        </div>
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(115deg,transparent_0,transparent_44%,rgba(214,173,104,0.3)_45%,transparent_47%),radial-gradient(circle_at_30%_20%,rgba(244,198,106,0.2),transparent_28%)] [background-size:220px_260px,100%_100%]" />

        <div className="relative mx-auto grid min-h-[86svh] max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 md:py-20 lg:grid-cols-[0.48fr_0.52fr]">
          <div className="mx-auto w-full max-w-[470px] lg:mx-0">
            <div className="relative aspect-square overflow-hidden border border-[#d6ad68]/55 bg-black shadow-[0_34px_130px_rgba(0,0,0,0.78),0_0_80px_rgba(214,173,104,0.12)]">
              <Image
                src={approvedAssets.frontCover}
                alt="Official square front cover artwork for SALIERI'S HANDS"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 92vw, 470px"
              />
            </div>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.3em] text-[#c99a52]">Official front cover</p>
          </div>

          <div className="text-center lg:text-left">
            <div className="mx-auto mb-6 h-14 w-52 lg:mx-0">
              <Image src={brandLogo} alt="KAMDRIDI logo" width={420} height={140} priority className="h-full w-full object-contain lg:object-left" />
            </div>
            <Eyebrow>New release</Eyebrow>
            <h1 className="mt-4 font-display text-[clamp(3.2rem,9vw,8rem)] uppercase leading-[0.82] tracking-[0.07em] text-[#f5dfb9]">
              SALIERI'S
              <br />
              HANDS
            </h1>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-[#d7b16a]">
              Vienna, 1791. Faith. Envy. Confession.
            </p>
            <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-stone-300 lg:mx-0">
              A special off-series KAMDRIDI release.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3 lg:justify-start">
              <span className="border border-[#8a642f]/45 bg-black/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#d9b36d]">
                KAMDRIDI RECORDS
              </span>
              <span className="border border-[#8a642f]/45 bg-black/35 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#d9b36d]">
                July 2026
              </span>
            </div>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
              <ActionLink href={teaserUrl}>
                <Play className="h-4 w-4" />
                Watch Teaser
              </ActionLink>
              <ActionLink href="#tracklist" tone="ghost">
                <ListMusic className="h-4 w-4" />
                Tracklist
              </ActionLink>
              <ActionLink href="#collector" tone="ghost">
                <Package className="h-4 w-4" />
                Collector CD
              </ActionLink>
              <ActionLink href="#merch" tone="ghost">
                <Sparkles className="h-4 w-4" />
                Merch
              </ActionLink>
            </div>
          </div>
        </div>
      </section>

      <section id="teaser" className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Official teaser" title="Watch the first glimpse" align="center">
            <p>The first live media signal is available now. Platform and store links remain coming soon until final links exist.</p>
          </SectionIntro>
          <a
            href={teaserUrl}
            target="_blank"
            rel="noreferrer"
            className="group relative mt-9 block min-h-[340px] overflow-hidden border border-[#8a642f]/45 bg-black shadow-[0_32px_100px_rgba(0,0,0,0.55)] sm:min-h-[480px]"
          >
            <ImagePanel src={approvedAssets.operaTeaser} alt="Official cinematic teaser artwork" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72)),radial-gradient(circle_at_50%_44%,transparent,rgba(0,0,0,0.65)_64%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-[#e4bd75]/70 bg-black/55 text-[#f5dfb9] shadow-[0_0_60px_rgba(214,173,104,0.28)] transition group-hover:scale-105 group-hover:border-[#ffe0a0]">
                <Play className="ml-1 h-10 w-10 fill-current" />
              </span>
            </div>
            <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8">
              <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#d9b36d]">Official teaser</p>
              <p className="mt-2 max-w-xl font-display text-3xl uppercase tracking-[0.1em] text-white sm:text-5xl">
                Watch the first glimpse
              </p>
            </div>
          </a>
        </div>
      </section>

      <section className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-stretch">
          <div className="relative min-h-[420px] overflow-hidden border border-[#8a642f]/40 bg-black">
            <ImagePanel src={approvedAssets.vertical} alt="Salieri hands candle manuscript Requiem artwork" />
          </div>
          <div className="flex flex-col justify-center border border-[#8a642f]/40 bg-[radial-gradient(circle_at_10%_0%,rgba(244,198,106,0.12),transparent_35%),linear-gradient(180deg,rgba(16,10,6,0.92),rgba(7,5,4,0.94))] p-6 sm:p-9">
            <SectionIntro eyebrow="Concept" title="A confession written in silence">
              <p>Vienna, 1791.</p>
              <p className="mt-4">In the shadow of genius, faith turns into envy. A man writes not for glory, but for absolution.</p>
              <p className="mt-4">Dark orchestration. Haunting choirs. Crushing riffs. A requiem for the man history misunderstood.</p>
            </SectionIntro>
          </div>
        </div>
      </section>

      <section id="tracklist" className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Full tracklist" title="Main album and bonus tracks" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.54fr]">
            <div className="overflow-hidden border border-[#8a642f]/40 bg-black/58">
              {mainTracks.map((track, index) => (
                <div
                  key={track}
                  className="grid grid-cols-[56px_1fr] items-center border-b border-white/10 px-4 py-4 last:border-b-0 sm:grid-cols-[78px_1fr]"
                >
                  <span className="font-display text-2xl text-[#c99a52] sm:text-3xl">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-base font-semibold text-stone-100">{track}</span>
                </div>
              ))}
            </div>
            <div className="border border-[#8a642f]/40 bg-[#100b07]/88 p-5 sm:p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-[#d7b16a]">Bonus tracks</h3>
              <div className="mt-5 space-y-5">
                {bonusTracks.map((track, index) => (
                  <div key={track} className="grid grid-cols-[44px_1fr] gap-3">
                    <span className="font-display text-2xl text-[#c99a52]">{index + 11}</span>
                    <span className="text-sm leading-6 text-stone-200">{track}</span>
                  </div>
                ))}
              </div>
              <div className="mt-7 border-t border-white/10 pt-5">
                <p className="text-xs uppercase tracking-[0.22em] text-stone-500">Note</p>
                <p className="mt-2 text-sm leading-7 text-stone-300">
                  From the forthcoming KAMDRIDI album TWICE UPON A TIME.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Choose your edition" title="Exclusive releases & collectibles" align="center">
            <p>No payment, fake checkout, or unconfirmed price is connected.</p>
          </SectionIntro>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {editionCards.map((edition) => (
              <ProductCard key={edition.title} {...edition} />
            ))}
          </div>
        </div>
      </section>

      <section id="collector" className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.36fr_0.64fr] lg:items-end">
            <SectionIntro eyebrow="Collector's edition" title="Physical lineup">
              <p>Premium physical concepts are in preparation for the July 2026 release campaign.</p>
            </SectionIntro>
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <span className="inline-flex min-h-12 items-center justify-center border border-[#d6ad68]/55 bg-[#d2a456]/12 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f4deb8]">
                Pre-order soon
              </span>
              <span className="inline-flex min-h-12 items-center justify-center border border-white/10 bg-black/35 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-400">
                Coming soon
              </span>
            </div>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {collectorLineup.map((item) => (
              <article key={item.title} className="border border-[#8a642f]/35 bg-black/55">
                <div className="relative aspect-square bg-[#080503]">
                  {item.image && item.alt ? <ImagePanel src={item.image} alt={item.alt} contain /> : <ComingSoonPanel title={item.title} />}
                </div>
                <div className="border-t border-white/10 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-stone-100">{item.title}</h3>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-7 text-center">
            <span className="inline-flex min-h-12 items-center justify-center border border-[#d6ad68]/55 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f4deb8]">
              Pre-order collector edition - coming soon
            </span>
          </div>
        </div>
      </section>

      <section id="merch" className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Merch" title="Derived products" align="center">
            <p>Merch concepts are held as coming soon until final products are approved.</p>
          </SectionIntro>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {merchItems.map((item) => (
              <article key={item.title} className="border border-[#8a642f]/35 bg-black/55">
                <div className="relative aspect-square bg-[#080503]">
                  {item.image && item.alt ? <ImagePanel src={item.image} alt={item.alt} contain /> : <ComingSoonPanel title={item.title} />}
                </div>
                <div className="border-t border-white/10 p-4">
                  <h3 className="min-h-10 text-sm font-bold uppercase tracking-[0.16em] text-stone-100">{item.title}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-[#c99a52]">Coming soon</p>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-7 text-center">
            <span className="inline-flex min-h-12 items-center justify-center border border-white/10 bg-black/35 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-stone-400">
              View all merch - coming soon
            </span>
          </div>
        </div>
      </section>

      <section className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro eyebrow="Teaser media" title="Three visual signals" align="center" />
          <div className="mt-9 grid gap-5 md:grid-cols-3">
            {mediaItems.map((item) => (
              <a key={item.title} href={teaserUrl} target="_blank" rel="noreferrer" className="group relative min-h-[280px] overflow-hidden border border-[#8a642f]/40 bg-black">
                <ImagePanel src={item.image} alt={item.alt} />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.7))]" />
                <span className="absolute left-5 top-5 inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#d6ad68]/70 bg-black/60 text-[#f4deb8] transition group-hover:scale-105">
                  <Play className="ml-0.5 h-5 w-5 fill-current" />
                </span>
                <p className="absolute inset-x-5 bottom-5 font-display text-2xl uppercase tracking-[0.1em] text-white">{item.title}</p>
              </a>
            ))}
          </div>
          <div className="mt-8 text-center">
            <ActionLink href={teaserUrl}>
              <ExternalLink className="h-4 w-4" />
              Watch the teaser
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.72fr_1fr]">
          <div className="relative min-h-[360px] overflow-hidden border border-[#8a642f]/40 bg-black">
            <ImagePanel src={approvedAssets.backCover} alt="Official back cover and tracklist artwork" contain />
          </div>
          <div className="border border-[#8a642f]/40 bg-[radial-gradient(circle_at_10%_0%,rgba(244,198,106,0.12),transparent_34%),linear-gradient(180deg,rgba(13,8,5,0.94),rgba(5,3,2,0.96))] p-6 sm:p-8">
            <Eyebrow>Release update</Eyebrow>
            <h2 className="mt-4 font-display text-4xl uppercase leading-tight tracking-[0.1em] text-[#f3d8a7] sm:text-5xl">
              SALIERI'S HANDS
            </h2>
            <p className="mt-4 text-lg text-stone-200">Official teaser out now. Album release: July 2026.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink href={teaserUrl}>
                <Play className="h-4 w-4" />
                Watch Teaser
              </ActionLink>
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#b68b45]/55 bg-black/35 px-5 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#f4deb8] transition hover:-translate-y-0.5 hover:border-[#e4bd75]"
              >
                <Bell className="h-4 w-4" />
                Join Release Updates
              </Link>
            </div>
            <div className="mt-8 grid gap-3">
              {streamingItems.map((platform) => (
                <div key={platform} className="flex items-center justify-between gap-4 border border-white/10 bg-black/35 px-4 py-3">
                  <span className="text-sm font-semibold text-stone-100">{platform}</span>
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#c99a52]">Coming soon</span>
                </div>
              ))}
              <a
                href={teaserUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-4 border border-[#d6ad68]/40 bg-[#d6ad68]/10 px-4 py-3 text-sm font-semibold text-[#f4deb8] transition hover:border-[#f1cf8d]"
              >
                <span>YouTube</span>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]">
                  Teaser live <Radio className="h-4 w-4" />
                </span>
              </a>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
              <Sparkles className="h-4 w-4 text-[#c99a52]" />
              Streaming and store links stay coming soon until final real links exist.
            </p>
          </div>
        </div>
      </section>

      <section className="border-t border-[#8a642f]/25 px-4 py-10 text-center sm:px-6">
        <Link
          href="/releases"
          className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-[0.22em] text-[#d9b36d] transition hover:text-[#f5dfb9]"
        >
          More releases
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </main>
  );
}
