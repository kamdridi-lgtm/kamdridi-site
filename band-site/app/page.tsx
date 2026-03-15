import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Disc3, Music2, Play, Radio } from "lucide-react";
import { CTAButton, GlassCard, Section, SectionHeading } from "@/components/ui";
import {
  featuredVideo,
  gameExperiences,
  newsPosts,
  products,
  siteMeta,
  socialFeed,
  socialLinks,
  streamingLinks,
  tourDates
} from "@/data/site";
import { formatDate } from "@/lib/utils";

const streamIcons: Record<string, React.ReactNode> = {
  Spotify: <Music2 className="h-5 w-5" />,
  "Apple Music": <Play className="h-5 w-5" />,
  "Amazon Music": <Radio className="h-5 w-5" />,
  Deezer: <Disc3 className="h-5 w-5" />
};

export const metadata: Metadata = {
  title: "Home",
  description:
    "Official KAMDRIDI website with music, visual album content, games, merch, tour dates, fan club, and news."
};

export default function HomePage() {
  const marqueeItems = [...socialLinks, ...socialLinks];

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover opacity-50"
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/images/hero-roof.jpg"
          >
            <source src={siteMeta.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,198,106,0.12),transparent_26%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.45)_58%,rgba(0,0,0,0.7))]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(180deg,transparent,rgba(9,9,9,0.9))]" />
        </div>

        <div className="absolute inset-x-0 top-[16%] z-10 flex justify-center px-4">
          <div className="relative h-36 w-[min(150vw,1100px)] opacity-30 blur-[3px] sm:h-48 md:h-64 lg:h-80">
            <Image src="/assets/images/logo.png" alt="" fill priority className="object-contain" />
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-[15] flex justify-center px-4">
          <div className="relative h-[320px] w-[min(96vw,760px)] sm:h-[400px] md:h-[520px] lg:h-[620px]">
            <Image
              src="/assets/images/band/live_stage.png"
              alt="KAMDRIDI band hero"
              fill
              priority
              className="object-contain object-bottom"
            />
          </div>
        </div>

        <div className="relative z-20 mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-end px-4 pb-20 text-center sm:px-6 md:pb-24 lg:pb-28">
          <p className="text-xs uppercase tracking-[0.6em] text-stone-400">official artist website</p>
          <h1 className="mt-6 whitespace-nowrap font-display text-[clamp(1.35rem,3.2vw,3.4rem)] uppercase tracking-[0.12em] text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)]">
            MELODIC · CINEMATIC · UNEARTHED
          </h1>
          <a
            href="https://open.spotify.com/track/1jfpUX2dXWBzwnfAhhMm7W"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-7 py-4 text-sm uppercase tracking-[0.25em] text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffd989]"
          >
            LISTEN TO WAR MACHINES
          </a>
        </div>
      </section>

      <Section id="stream-war-machines" className="pt-14 md:pt-18">
        <SectionHeading
          eyebrow="STREAM WAR MACHINES"
          title="Choose your platform"
          description="Official streaming links for War Machines across the current release platforms."
          align="center"
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {streamingLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between rounded-[28px] border border-white/10 bg-white/[0.04] px-6 py-5 shadow-[0_35px_80px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-1 hover:border-[#f4c66a]/50 hover:text-[#f4c66a]"
            >
              <div className="flex items-center gap-4">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30">
                  {streamIcons[link.label] ?? <Music2 className="h-5 w-5" />}
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white">{link.label}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">{link.note}</p>
                </div>
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-stone-300">Open</span>
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <div className="marquee rounded-full border border-white/10 bg-white/[0.03] py-4">
          <div className="marquee-track gap-10 px-6">
            {marqueeItems.map((item, index) => (
              <span
                key={`${item.label}-${index}`}
                className="text-xs uppercase tracking-[0.45em] text-stone-400"
              >
                {item.label} {item.handle}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section id="fan-universe">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.2),transparent_38%)]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Fan Universe</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white md:text-5xl">
                Echoes Unearthed goes beyond the album
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300">
                Membership now opens into a layered world of games, comic pages, vault material,
                visual album fragments, and collector-first access across the KAMDRIDI campaign.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <CTAButton href="/fan-club">Join Fan Club</CTAButton>
                <CTAButton href="/who-is-kam-dridi" tone="secondary">
                  Read the Comic
                </CTAButton>
              </div>
            </div>
          </GlassCard>
          <div className="grid gap-6">
            {gameExperiences.map((game) => (
              <GlassCard key={game.id}>
                <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{game.subtitle}</p>
                <h3 className="mt-4 font-display text-3xl uppercase tracking-[0.08em] text-white">
                  {game.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-stone-400">{game.description}</p>
                <div className="mt-5 flex items-center justify-between gap-4">
                  <span className="text-[11px] uppercase tracking-[0.3em] text-stone-500">
                    {game.membership}
                  </span>
                  <Link
                    href="/games"
                    className="text-xs uppercase tracking-[0.25em] text-stone-200 transition hover:text-[#f4c66a]"
                  >
                    Open launcher
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </Section>

      <Section id="latest-news">
        <SectionHeading
          eyebrow="Latest News"
          title="Headlines from the campaign"
          description="Album announcements, video premieres, tour updates, and artist news presented in a polished editorial layout."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {newsPosts.map((post) => (
            <GlassCard key={post.slug} className="overflow-hidden p-0 transition duration-300 hover:-translate-y-1">
              <div className="relative h-60">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">
                  {formatDate(post.date)}
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-white">{post.title}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-400">{post.excerpt}</p>
                <Link
                  href="/news"
                  className="mt-6 inline-flex text-sm uppercase tracking-[0.25em] text-stone-200 transition hover:text-[#f4c66a]"
                >
                  Read story
                </Link>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section id="tour-preview">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <SectionHeading
              eyebrow="Upcoming Tour Dates"
              title="The Echoes Unearthed live campaign"
              description="Every city includes ticket links and premium VIP options, ready to expand into a live sync with your preferred ticketing system."
            />
            <div className="mt-8">
              <CTAButton href="/tour">See all dates</CTAButton>
            </div>
          </div>
          <GlassCard className="panel-grid overflow-hidden p-0">
            <div className="divide-y divide-white/10">
              {tourDates.map((show) => (
                <div
                  key={`${show.city}-${show.date}`}
                  className="grid gap-3 p-6 md:grid-cols-[0.9fr_1.1fr_0.7fr_auto] md:items-center"
                >
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">
                      {formatDate(show.date)}
                    </p>
                    <p className="mt-2 text-xl text-white">{show.city}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-stone-500">Venue</p>
                    <p className="mt-2 text-stone-200">{show.venue}</p>
                  </div>
                  <div>
                    <p className="text-sm uppercase tracking-[0.25em] text-stone-500">VIP</p>
                    <p className="mt-2 text-stone-200">{show.vip}</p>
                  </div>
                  <a
                    href={show.ticketLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex justify-center rounded-full border border-white/10 px-4 py-3 text-xs uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a]"
                  >
                    {show.status}
                  </a>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section id="featured-merch">
        <SectionHeading
          eyebrow="Featured Merch"
          title="Storefront built for conversion"
          description="Highlight premium apparel, music formats, limited editions, and accessories with direct hosted Stripe checkout."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <GlassCard key={product.id} className="overflow-hidden p-0">
              <div className="relative h-72 bg-black/40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">{product.category}</p>
                <h3 className="mt-3 text-2xl text-white">{product.name}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-400">{product.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-lg text-[#f4c66a]">{product.priceLabel}</span>
                  <Link
                    href="/store"
                    className="text-xs uppercase tracking-[0.25em] text-stone-200 transition hover:text-[#f4c66a]"
                  >
                    Buy now
                  </Link>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section id="latest-video">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="overflow-hidden p-0">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={featuredVideo.embedUrl}
                title={featuredVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </GlassCard>
          <GlassCard className="flex flex-col justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Latest Music Video</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
                {featuredVideo.title}
              </h2>
              <p className="mt-6 text-base leading-8 text-stone-400">{featuredVideo.description}</p>
            </div>
            <div className="mt-10 flex gap-4">
              <CTAButton href="/music">Open music page</CTAButton>
              <CTAButton href="/visual-album" tone="secondary">
                Enter visual album
              </CTAButton>
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section id="newsletter-social">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassCard>
            <SectionHeading
              eyebrow="Newsletter Signup"
              title="Stay on the list"
              description="Collect emails for releases, ticket drops, protocol launches, and merch announcements."
            />
            <form className="mt-8 grid gap-4">
              <input
                className="rounded-full border border-white/10 bg-black/40 px-5 py-4 text-white placeholder:text-stone-500"
                type="email"
                placeholder="Email address"
              />
              <button
                type="button"
                className="rounded-full bg-[#f4c66a] px-6 py-4 text-sm uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
              >
                Subscribe
              </button>
            </form>
          </GlassCard>

          <GlassCard>
            <SectionHeading
              eyebrow="Social Media Feed"
              title="Keep the campaign alive between drops"
              description="Drop in the latest social moments so the homepage stays active between releases, videos, and tour announcements."
            />
            <div className="mt-8 grid gap-4">
              {socialFeed.map((item) => (
                <div key={`${item.platform}-${item.date}`} className="rounded-2xl border border-white/10 bg-black/30 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm uppercase tracking-[0.35em] text-[#f4c66a]">{item.platform}</p>
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-500">{item.date}</p>
                  </div>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{item.caption}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>
    </>
  );
}
