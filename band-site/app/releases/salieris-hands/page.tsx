import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { Disc3, ListMusic, Package, Play, Shirt, Sparkles } from "lucide-react";
import { SalieriCheckoutStatus, SalieriProductCard, SalieriQuickBuy } from "@/components/salieri-product-card";
import { TrackAccessControls } from "@/components/track-access-controls";
import { getCommerceProductById } from "@/data/commerce-products";

const assetBase = "/assets/images/salieris-hands";
const teaserUrl = "https://youtu.be/wD0u7-krT8s?si=4a1J1siTwJV9bGCI";
const teaserVideo = "/assets/video/salieris-hands/official-teaser.mp4";
const heroVideo = "/assets/video/salieris-hands/salieri-hero-slow.mp4";
const heroVideoWebm = "/assets/video/salieris-hands/salieri-hero-slow.webm";

const assets = {
  hero: `${assetBase}/salieri-opera-hall-hero.png`,
  heroPoster: `${assetBase}/hero-video-poster.jpg`,
  frontCover: `${assetBase}/front-cover-approved.png`,
  collectorPack: `${assetBase}/full-collector-pack.png`,
  booklet: `${assetBase}/booklet-mockup.png`,
  jewelcase: `${assetBase}/jewelcase-mockup.png`,
  packBack: `${assetBase}/pack-back-front-spine.png`,
  miniCard: `${assetBase}/mini-card-mockup.png`,
  operaTeaser: `${assetBase}/opera-teaser.png`,
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
  "The Fall of the First Knight - Requiem Aria",
  "The Prism Requiem (Viennese Aria) - Extended English Version",
  "Das Prisma: Requiem für meine Seele - Extended German Version"
];

const collectorProductsData = [
  {
    id: "salieri-collector-bundle",
    description: "Collector package including selected physical formats, merch, art print, booklet, and campaign extras.",
    image: assets.collectorPack,
    alt: "Salieri collector bundle"
  },
  {
    id: "salieri-special-edition-box",
    description: "Collector package including selected physical formats, merch, art print, booklet, and campaign extras.",
    image: assets.collectorPack,
    alt: "Special edition collector package"
  },
  {
    id: "salieri-vinyl-edition",
    description: "Premium limited vinyl edition prepared for the physical collector campaign.",
    image: assets.packBack,
    alt: "Vinyl and physical package artwork"
  },
  {
    id: "salieri-collector-coin",
    description: "Antique bronze finish collector item for the special edition world.",
    image: "/assets/images/salieris-hands/salieri-collector-coin-box.jpg",
    alt: "Salieri collector coin boxed set",
    secondaryImage: "/assets/images/salieris-hands/salieri-coin-closeup.jpg",
    secondaryAlt: "Salieri collector coin closeup"
  },
  {
    id: "salieri-hardcover-booklet",
    description: "Liner notes and story presentation by KAMDRIDI.",
    image: assets.booklet,
    alt: "Hardcover booklet concept"
  },
  {
    id: "salieri-collector-cd",
    description: "Digipak / jewel case edition with printed booklet, disc art, and back cover treatment.",
    image: assets.jewelcase,
    alt: "Collector CD jewel case concept"
  },
  {
    id: "salieri-digital-release",
    description: "High-resolution audio package with digital booklet and 2 exclusive bonus tracks unavailable on streaming platforms.",
    image: assets.frontCover,
    alt: "Official album front cover artwork"
  }
];

const merchProductsData = [
  {
    id: "salieri-hoodie",
    description: "Heavyweight campaign hoodie for the dark baroque release world.",
    image: "/assets/images/salieris-hands/salieri-hoodie-mockup.jpg",
    alt: "Salieri campaign hoodie"
  },
  {
    id: "salieri-tee",
    description: "Black or white campaign tee with the Salieri's Hands release mark.",
    image: "/assets/images/salieris-hands/salieri-tee-mockup.jpg",
    alt: "Salieri campaign tee"
  },
  {
    id: "salieri-mug",
    description: "Ceramic mug using the official Salieri's Hands artwork treatment.",
    image: "/assets/images/salieris-hands/salieri-mug-mockup.jpg",
    alt: "Salieri artwork mug mockup"
  },
  {
    id: "salieri-poster",
    description: "Premium poster print featuring the Vienna 1791 Salieri's Hands artwork.",
    image: "/assets/images/salieris-hands/salieri-poster-mockup.jpg",
    alt: "Salieri's Hands Vienna 1791 poster artwork"
  }
];
const streamingItems = ["Spotify", "Apple Music", "Amazon", "Instagram"];

const orderInfoItems = [
  {
    title: "Pre-orders",
    text: "Physical collector items are part of the July 2026 campaign and move into fulfillment after inventory is confirmed."
  },
  {
    title: "Digital delivery",
    text: "Digital Deluxe orders are prepared as a high-resolution audio package with booklet and two exclusive bonus tracks."
  },
  {
    title: "Shipping",
    text: "Checkout collects delivery details so KAMDRIDI can confirm the correct fulfillment path for physical items."
  },
  {
    title: "Refunds and support",
    text: "Questions about an order, address change, or refund request should go through the official contact route with the order email."
  }
];

const fulfillmentItems = [
  ["Digital Deluxe Release", "High-resolution files, digital booklet, and exclusive bonus track package."],
  ["Collector formats", "CD, vinyl, booklet, box, and coin items are prepared for campaign fulfillment after production confirmation."],
  ["Merch", "Apparel, mug, and poster orders use the selected size, color, and delivery details from checkout."],
  ["Collector Bundle", "Bundle contents are confirmed as one campaign package before fulfillment begins."]
];

const trustNotes = [
  { title: "Pre-order campaign", text: "Physical collector items are prepared for the July 2026 campaign and ship when inventory is confirmed." },
  { title: "Secure checkout", text: "Payments use hosted Stripe checkout with card and wallet support." },
  { title: "Shipping details", text: "Checkout collects the delivery details needed to confirm campaign fulfillment." },
  { title: "Limited campaign", text: "Collector formats may close once the campaign allocation is filled." }
];

const sectionNavItems = [
  { href: "#teaser", label: "Teaser" },
  { href: "#tracklist", label: "Tracklist" },
  { href: "#collector-editions", label: "Collector Editions" },
  { href: "#merch", label: "Merch" },
  { href: "#order-info", label: "Order Info" },
  { href: "#release-updates", label: "Release Updates" }
];

export const metadata: Metadata = {
  metadataBase: new URL("https://kamdridi.com"),
  title: "Salieri's Hands - KAMDRIDI",
  description:
    "Salieri's Hands is a special off-series KAMDRIDI release. Vienna, 1791. Faith. Envy. Confession. Album release: July 2026.",
  alternates: {
    canonical: "/releases/salieris-hands"
  },
  openGraph: {
    title: "Salieri's Hands - KAMDRIDI",
    description:
      "A special off-series KAMDRIDI release. Vienna, 1791. Faith. Envy. Confession. Album release: July 2026.",
    url: "/releases/salieris-hands",
    siteName: "KAMDRIDI",
    images: [
      {
        url: "/assets/images/salieris-hands/salieri-social-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Salieri's Hands official social preview artwork"
      }
    ],
    type: "music.album"
  },
  twitter: {
    card: "summary_large_image",
    title: "Salieri's Hands - KAMDRIDI",
    description: "Official teaser out now. Album release: July 2026.",
    images: ["/assets/images/salieris-hands/salieri-social-preview.jpg"]
  }
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#e3b86a]">{children}</p>;
}

function SectionIntro({
  title,
  children,
  align = "left"
}: {
  title: string;
  children?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] uppercase leading-[0.95] text-[#ffe3ad]">
        {title}
      </h2>
      {children ? <div className="mt-4 text-sm leading-7 text-[#ead4ad] sm:text-base">{children}</div> : null}
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
      ? "border-[#efc36f] bg-[#e2ad52] text-[#140b05] shadow-[0_20px_56px_rgba(226,173,82,0.22)] hover:bg-[#ffd98b]"
      : "border-[#d7a75d]/70 bg-black/34 text-[#ffe7bd] hover:border-[#ffd98b] hover:bg-[#e2ad52]/10 hover:text-white";

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={`inline-flex min-h-12 items-center justify-center gap-2 border px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] transition duration-300 hover:-translate-y-0.5 ${classes}`}
    >
      {children}
    </a>
  );
}

function CampaignTrustNotes() {
  return (
    <div className="mt-9 grid gap-3 border border-[#bd8b45]/35 bg-black/36 p-4 sm:grid-cols-2 lg:grid-cols-4">
      {trustNotes.map((note) => (
        <div key={note.title} className="border border-[#bd8b45]/24 bg-[#100905]/62 p-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#e3b86a]">{note.title}</p>
          <p className="mt-3 text-sm leading-6 text-[#e8d1aa]">{note.text}</p>
        </div>
      ))}
    </div>
  );
}

function SectionRailLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-10 items-center justify-center whitespace-nowrap rounded-full border border-[#bd8b45]/45 bg-black/42 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-[#f5dfb4] transition hover:-translate-y-0.5 hover:border-[#ffd98b] hover:text-white"
    >
      {children}
    </a>
  );
}

function SectionNavRail() {
  return (
    <div className="sticky top-[78px] z-30 border-b border-[#bd8b45]/25 bg-[#090504]/84 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          <span className="shrink-0 text-[10px] font-black uppercase tracking-[0.28em] text-[#c99951]">On this page</span>
          {sectionNavItems.map((item) => (
            <SectionRailLink key={item.href} href={item.href}>
              {item.label}
            </SectionRailLink>
          ))}
        </div>
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
      sizes="(max-width: 768px) 100vw, 45vw"
    />
  );
}

export default function SalierisHandsPage() {
  const getStatus = (mode: string) => {
    switch(mode) {
      case "preorder": return "PRE-ORDER";
      case "digital": return "DIGITAL ORDER";
      case "buy_now": return "AVAILABLE";
      case "sold_out": return "SOLD OUT";
      default: return "PRE-ORDER";
    }
  };

  const collectorProducts = collectorProductsData.map(item => {
    const product = getCommerceProductById(item.id);
    return {
      ...item,
      name: product?.name || item.id,
      price: (product?.priceCents || 0) / 100,
      status: getStatus(product?.saleMode || "preorder"),
      colors: product?.colors ? [...product.colors] : undefined,
      sizes: product?.sizes ? [...product.sizes] : undefined
    };
  });

  const merchProducts = merchProductsData.map(item => {
    const product = getCommerceProductById(item.id);
    return {
      ...item,
      name: product?.name || item.id,
      price: (product?.priceCents || 0) / 100,
      status: getStatus(product?.saleMode || "preorder"),
      colors: product?.colors ? [...product.colors] : undefined,
      sizes: product?.sizes ? [...product.sizes] : undefined
    };
  });
  return (
    <main className="salieri-page relative overflow-hidden bg-[#070403] text-[#f7e7c8]">
      <style>{`
        .salieri-page {
          --salieri-gold: #e2ad52;
          --salieri-ivory: #ffe3ad;
          font-family: "Segoe UI", system-ui, sans-serif;
          background-color: #070403;
          background-image: linear-gradient(180deg, rgba(7, 4, 3, 0.38), rgba(7, 4, 3, 0.5)), url("/assets/images/salieris-hands/salieri-manuscript-background.jpg");
          background-size: cover;
          background-position: center top;
          background-attachment: fixed;
        }

        .salieri-page::before {
          content: "";
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background: radial-gradient(circle at 14% 18%, rgba(238, 174, 81, 0.14), transparent 28%), radial-gradient(circle at 78% 6%, rgba(255, 220, 150, 0.07), transparent 34%), linear-gradient(90deg, rgba(0, 0, 0, 0.24), rgba(0, 0, 0, 0.04), rgba(0, 0, 0, 0.32));
        }

        .salieri-page > section {
          position: relative;
          z-index: 1;
        }

        .salieri-page > section:not(:first-of-type) {
          background-color: rgba(7, 4, 3, 0.56);
          background-image: linear-gradient(180deg, rgba(7, 4, 3, 0.46), rgba(7, 4, 3, 0.58)), url("/assets/images/salieris-hands/salieri-manuscript-background.jpg");
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          backdrop-filter: blur(0.5px);
        }

        .salieri-page > section:nth-of-type(3n + 2):not(:first-of-type) {
          background-image: linear-gradient(180deg, rgba(7, 4, 3, 0.44), rgba(7, 4, 3, 0.56)), url("/assets/images/salieris-hands/salieri-manuscript-background-2.jpg");
        }

        .salieri-page > section:nth-of-type(3n):not(:first-of-type) {
          background-image: linear-gradient(180deg, rgba(7, 4, 3, 0.48), rgba(7, 4, 3, 0.6)), url("/assets/images/salieris-hands/salieri-manuscript-background-3.jpg");
        }

        .salieri-page > section:nth-of-type(3n + 1):not(:first-of-type) {
          background-image: linear-gradient(180deg, rgba(7, 4, 3, 0.46), rgba(7, 4, 3, 0.58)), url("/assets/images/salieris-hands/salieri-manuscript-background.jpg");
        }

        .salieri-hero-title,
        .salieri-animated-word {
          font-family: Georgia, "Times New Roman", serif;
        }

        .salieri-hero-media {
          position: absolute;
          inset: 0;
          height: 100%;
          width: 100%;
          object-fit: cover;
          object-position: center 42%;
        }

        .salieri-hero-image {
          filter: brightness(1.1) contrast(1.08) saturate(1.08);
          transform: scale(1.03);
        }

        .salieri-hero-video {
          z-index: 1;
          opacity: 0.92;
          filter: brightness(1.2) contrast(1.08) saturate(1.06);
          transform: scale(1.03);
          animation: salieriBreath 18s ease-in-out infinite;
        }

        .salieri-candle-glow {
          animation: salieriCandle 5.8s ease-in-out infinite;
        }

        .salieri-animated-word {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          opacity: 0;
          transform: translateY(22px);
          filter: blur(10px);
          color: #ffe8bd;
          text-transform: uppercase;
          text-shadow: 0 0 18px rgba(226, 173, 82, 0.28), 0 18px 54px rgba(0, 0, 0, 0.88);
          animation: salieriWordCycle 19s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        .salieri-animated-word:nth-child(2) { animation-delay: 3.4s; }
        .salieri-animated-word:nth-child(3) { animation-delay: 6.8s; }
        .salieri-animated-word:nth-child(4) { animation-delay: 10.2s; }
        .salieri-animated-word:nth-child(5) { animation-delay: 13.6s; }

        @keyframes salieriBreath {
          0%, 100% { transform: scale(1.03); filter: brightness(1.06) contrast(1.08) saturate(1.06); }
          50% { transform: scale(1.085) translate3d(-0.8%, -0.5%, 0); filter: brightness(1.18) contrast(1.1) saturate(1.12); }
        }

        @keyframes salieriCandle {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          44% { opacity: 0.78; transform: scale(1.08); }
          52% { opacity: 0.55; transform: scale(1.02); }
          62% { opacity: 0.72; transform: scale(1.06); }
        }

        @keyframes salieriWordCycle {
          0% { opacity: 0; transform: translateY(24px); filter: blur(10px); }
          8%, 18% { opacity: 1; transform: translateY(0); filter: blur(0); }
          28%, 100% { opacity: 0; transform: translateY(-16px); filter: blur(8px); }
        }


        @media (max-width: 640px) {
          .salieri-hero-media {
            object-position: 58% center;
          }

          .salieri-hero-video {
            opacity: 0.86;
          }

          .salieri-animated-word {
            align-items: flex-start;
            padding-top: 4px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .salieri-hero-image,
          .salieri-hero-video,
          .salieri-candle-glow,
          .salieri-animated-word {
            animation: none !important;
          }

          .salieri-animated-word {
            display: none;
          }

          .salieri-hero-video {
            display: none;
          }
        }
      `}</style>

      <section className="relative isolate min-h-[82svh] overflow-hidden border-b border-[#a67938]/35 bg-black">
        <Image src={assets.hero} alt="Conductor and orchestra in a dark opera hall" fill priority className="salieri-hero-media salieri-hero-image object-cover object-center" sizes="100vw" />
        <video
          id="salieri-hero-slow-video"
          className="salieri-hero-media salieri-hero-video"
          poster={assets.heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src={heroVideoWebm} type="video/webm" />
          <source src={heroVideo} type="video/mp4" />
        </video>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                var video = document.getElementById("salieri-hero-slow-video");
                if (!video) return;
                var setSlowMotion = function () {
                  video.defaultPlaybackRate = 0.35;
                  video.playbackRate = 0.35;
                };
                setSlowMotion();
                video.addEventListener("loadedmetadata", setSlowMotion);
                video.addEventListener("play", setSlowMotion);
              })();
            `
          }}
        />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(circle_at_58%_44%,rgba(255,215,138,0.18),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.62),rgba(0,0,0,0.22)_52%,rgba(0,0,0,0.3)),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.18)_62%,#070403_100%)]" />
        <div className="salieri-candle-glow absolute left-[8%] z-[3] top-[24%] h-48 w-48 rounded-full bg-[#f2b45b]/18 blur-3xl" />
        <div className="relative z-10 flex min-h-[82svh] items-end px-4 pb-12 pt-28 sm:px-6 lg:items-center lg:pb-20">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-4xl border-l border-[#e2ad52]/60 bg-gradient-to-r from-black/48 via-black/18 to-transparent px-5 py-6 sm:px-8 sm:py-8">
              <Eyebrow>New Release</Eyebrow>
              <div className="relative mt-5 h-[88px] sm:h-[124px] lg:h-[146px]">
                <div className="salieri-animated-word text-[clamp(2.7rem,10vw,7rem)] leading-none">Envy</div>
                <div className="salieri-animated-word text-[clamp(2.45rem,9vw,6.4rem)] leading-none">Jealousy</div>
                <div className="salieri-animated-word text-[clamp(2.1rem,8vw,5.7rem)] leading-none">Confession</div>
                <div className="salieri-animated-word text-[clamp(2rem,7.4vw,5.2rem)] leading-none">Vienna, 1791</div>
                <div className="salieri-animated-word text-[clamp(2rem,7.4vw,5.2rem)] leading-none">Salieri&apos;s Hands</div>
              </div>
              <h1 className="salieri-hero-title text-[clamp(3rem,10vw,7.6rem)] uppercase leading-[0.9] text-[#ffe3ad] drop-shadow-[0_18px_48px_rgba(0,0,0,0.86)]">
                Salieri&apos;s Hands
              </h1>
              <div className="mt-5 grid max-w-2xl gap-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#ffe7bd] sm:text-base">
                <p>A special off-series KAMDRIDI release</p>
                <p>Limited release</p>
                <p>Vienna, 1791</p>
                <p>Faith. Envy. Confession.</p>
                <p>Album release: July 2026</p>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <ActionLink href="#teaser">
                  <Play className="h-4 w-4" />
                  Watch Teaser
                </ActionLink>
                <ActionLink href="#tracklist" tone="ghost">
                  <ListMusic className="h-4 w-4" />
                  Tracklist
                </ActionLink>
                <ActionLink href="#collector-editions" tone="ghost">
                  <Package className="h-4 w-4" />
                  Collector Edition
                </ActionLink>
                <ActionLink href="#merch" tone="ghost">
                  <Shirt className="h-4 w-4" />
                  Merch
                </ActionLink>

              </div>
              <div className="mt-5 hidden gap-3 lg:grid lg:grid-cols-3">
                <SalieriQuickBuy id="salieri-collector-bundle" />
                <SalieriQuickBuy id="salieri-tee" color="Black" size="L" />
                <SalieriQuickBuy id="salieri-special-edition-box" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <SectionNavRail />

      <section id="teaser" className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro title="Official Teaser" align="center">
            <p>Watch the first glimpse.</p>
          </SectionIntro>
          <div className="mt-9 overflow-hidden border border-[#bd8b45]/55 bg-black shadow-[0_34px_110px_rgba(0,0,0,0.5)]">
            <video
              className="block aspect-video w-full bg-black object-cover"
              controls
              playsInline
              preload="metadata"
              poster={assets.operaTeaser}
            >
              <source src={teaserVideo} type="video/mp4" />
            </video>
          </div>
          <div className="mt-5 flex justify-center">
            <ActionLink href={teaserUrl}>
              <Play className="h-4 w-4" />
              Watch Teaser
            </ActionLink>
          </div>
        </div>
      </section>

      <section className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="relative min-h-[360px] overflow-hidden border border-[#bd8b45]/45 bg-black sm:min-h-[460px]">
            <ImagePanel src={assets.wide} alt="Hands over manuscript in warm candlelight" />
          </div>
          <div className="flex flex-col justify-center border border-[#bd8b45]/45 bg-[radial-gradient(circle_at_12%_0%,rgba(255,210,126,0.16),transparent_36%),linear-gradient(180deg,rgba(28,16,8,0.94),rgba(9,5,3,0.96))] p-6 sm:p-9">
            <SectionIntro title="A Confession Written In Silence">
              <p>Vienna, 1791. In the shadow of genius, faith turns into envy. A man writes not for glory, but for absolution.</p>
              <p className="mt-4">Dark orchestration. Haunting choirs. Crushing riffs. A requiem for the man history misunderstood.</p>
            </SectionIntro>
          </div>
        </div>
      </section>

      <section id="tracklist" className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro title="Full Tracklist">
            <p>Every 36-second preview stays free. The lock applies only to the complete track.</p>
          </SectionIntro>
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.54fr]">
            <div className="overflow-hidden border border-[#bd8b45]/45 bg-[#0d0704]/78">
              {mainTracks.map((track, index) => (
                <div key={track} className="grid grid-cols-[56px_minmax(0,1fr)] items-center gap-x-3 gap-y-3 border-b border-[#bd8b45]/18 px-4 py-4 last:border-b-0 sm:grid-cols-[78px_minmax(0,1fr)]">
                  <span className="row-span-2 font-serif text-2xl text-[#e3b86a] sm:text-3xl">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-base font-semibold text-[#f9e3bd]">{track}</span>
                  <TrackAccessControls
                    previewLabel="Free preview"
                    previewPendingLabel="Preview after mastering"
                    fullTrackLabel="Full track locked"
                    theme="gold"
                  />
                </div>
              ))}
            </div>
            <div className="border border-[#bd8b45]/45 bg-[linear-gradient(180deg,rgba(28,16,8,0.92),rgba(10,6,4,0.96))] p-5 sm:p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-[#e3b86a]">Bonus tracks</h3>
              <div className="mt-5 space-y-5">
                {bonusTracks.map((track, index) => (
                  <div key={track} className="grid grid-cols-[44px_minmax(0,1fr)] gap-x-3 gap-y-3">
                    <span className="row-span-2 font-serif text-2xl text-[#e3b86a]">{index + 11}</span>
                    <span className="text-sm leading-6 text-[#f1d8ac]">{track}</span>
                    <TrackAccessControls
                      previewLabel="Free preview"
                      previewPendingLabel="Preview after mastering"
                      fullTrackLabel="Full track locked"
                      theme="gold"
                    />
                  </div>
                ))}
              </div>
              <p className="mt-7 border-t border-[#bd8b45]/22 pt-5 text-sm leading-7 text-[#d9c09a]">
                Four bonus tracks extend the story beyond the album: the classical Salieri&apos;s Hands confession, a requiem aria for the First Knight, and The Prism Requiem in extended English and German editions.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="collector-editions" className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro title="Collector Editions" align="center">
            <p>Premium physical editions and limited collector items prepared for the July 2026 campaign.</p>
          </SectionIntro>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {collectorProducts.map((product) => (
              <SalieriProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section id="merch" className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro title="Merch" align="center">
            <p>Campaign apparel, print pieces, and accessories available through the KAMDRIDI cart.</p>
          </SectionIntro>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">

            {merchProducts.map((product) => (
              <SalieriProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </section>

      <section id="order-info" className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro title="Order Info" align="center">
            <p>Campaign terms, fulfillment notes, and delivery expectations for Salieri's Hands orders.</p>
          </SectionIntro>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {orderInfoItems.map((item) => (
              <div key={item.title} className="border border-[#bd8b45]/35 bg-[#100905]/72 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
                <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#e3b86a]">{item.title}</p>
                <p className="mt-3 text-sm leading-6 text-[#e8d1aa]">{item.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
            <div className="border border-[#efc36f]/45 bg-[#e2ad52]/10 p-5">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-[#f4c66a]">Limited July 2026 Campaign</p>
              <p className="mt-3 font-serif text-3xl text-[#fff0cf]">Collector allocation may close without notice.</p>
              <p className="mt-4 text-sm leading-6 text-[#e8d1aa]">The premium formats are campaign items, not permanent mass-market inventory.</p>
            </div>
            <div className="grid gap-3 border border-[#bd8b45]/35 bg-black/32 p-4 sm:grid-cols-2">
              {fulfillmentItems.map(([title, text]) => (
                <div key={title} className="border border-[#bd8b45]/24 bg-black/28 p-4">
                  <p className="text-sm font-semibold text-[#ffe7bd]">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-300">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="release-updates" className="px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.7fr_1fr]">
          <div className="relative min-h-[340px] overflow-hidden border border-[#bd8b45]/45 bg-black sm:min-h-[440px]">
            <ImagePanel src={assets.vienna} alt="Vienna 1791 figure walking through the street" />
          </div>
          <div className="border border-[#bd8b45]/45 bg-[radial-gradient(circle_at_12%_0%,rgba(255,210,126,0.16),transparent_34%),linear-gradient(180deg,rgba(28,16,8,0.94),rgba(8,5,3,0.97))] p-6 sm:p-8">
            <SectionIntro title="Release Updates">
              <p>Official teaser out now.</p>
              <p>Album release: July 2026.</p>
            </SectionIntro>
            <Suspense fallback={null}>
              <SalieriCheckoutStatus />
            </Suspense>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink href={teaserUrl}>
                <Play className="h-4 w-4" />
                YouTube
              </ActionLink>
              <ActionLink href="/contact" tone="ghost">
                <Sparkles className="h-4 w-4" />
                Notify Me
              </ActionLink>
            </div>
            <div className="mt-6 border border-[#bd8b45]/35 bg-black/30 p-4 text-sm leading-7 text-stone-300">
              Request the July 2026 release alert through the official contact route and mention Salieri's Hands.
            </div>
            <div className="mt-8 grid gap-3">
              {streamingItems.map((platform) => (
                <div key={platform} className="flex items-center justify-between gap-4 border border-[#bd8b45]/28 bg-black/30 px-4 py-3">
                  <span className="text-sm font-semibold text-[#f9e3bd]">{platform}</span>
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e3b86a]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Coming soon
                  </span>
                </div>
              ))}
              <a href={teaserUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border border-[#efc36f]/55 bg-[#e2ad52]/10 px-4 py-3 text-sm font-semibold text-[#ffe7bd] transition hover:border-[#ffd98b]">
                <span>YouTube</span>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]">
                  Teaser live <Disc3 className="h-4 w-4" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
