import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton, GlassCard, Section, SectionHeading } from "@/components/ui";
import {
  featuredVideo,
  newsPosts,
  products,
  siteMeta,
  socialFeed,
  socialLinks,
  tourDates
} from "@/data/site";
import { formatCurrency, formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Home",
  description: "Official KAMDRIDI website with music, videos, merch, tour dates, fan club, and news."
};

export default function HomePage() {
  const marqueeItems = [...socialLinks, ...socialLinks];

  return (
    <>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover opacity-35"
            autoPlay
            loop
            muted
            playsInline
            poster="/assets/images/hero-roof.jpg"
          >
            <source src={siteMeta.heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,198,106,0.22),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.25),rgba(0,0,0,0.88))]" />
          <div className="absolute inset-x-0 bottom-0 h-52 bg-[linear-gradient(180deg,transparent,rgba(9,9,9,0.95))]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100vh-100px)] max-w-7xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6">
          <div className="hero-glow logo-float rounded-full border border-[#f4c66a]/30 bg-black/35 px-8 py-4 backdrop-blur">
            <p className="font-display text-5xl uppercase tracking-[0.35em] text-[#f4c66a] md:text-7xl">
              KAMDRIDI
            </p>
          </div>
          <p className="mt-8 text-xs uppercase tracking-[0.6em] text-stone-400">
            official artist website
          </p>
          <h1 className="mt-6 max-w-5xl font-display text-5xl uppercase leading-[0.92] tracking-[0.08em] text-white md:text-8xl">
            Heavy. Cinematic. Unearthed.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300 md:text-lg">
            Enter the world of Echoes Unearthed with official music, premium visuals,
            collector merch, fan-club access, and a stage-ready campaign built for commercial release.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <CTAButton href="/tour">View Tour Dates</CTAButton>
            <CTAButton href="/store" tone="secondary">
              Shop Merch
            </CTAButton>
            <CTAButton href="/fan-club" tone="secondary">
              Join Fan Club
            </CTAButton>
          </div>
          <div className="mt-12 grid w-full max-w-4xl gap-4 md:grid-cols-3">
            {[
              { label: "Album", value: siteMeta.albumName },
              { label: "Single", value: "War Machines" },
              { label: "Access", value: "Fan Club Presale" }
            ].map((item) => (
              <div key={item.label} className="rounded-[24px] border border-white/10 bg-black/30 px-5 py-4 backdrop-blur">
                <p className="text-[11px] uppercase tracking-[0.45em] text-stone-500">{item.label}</p>
                <p className="mt-2 font-display text-2xl uppercase tracking-[0.12em] text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                <div key={`${show.city}-${show.date}`} className="grid gap-3 p-6 md:grid-cols-[0.9fr_1.1fr_0.7fr_auto] md:items-center">
                  <div>
                    <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">{formatDate(show.date)}</p>
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
          description="Highlight premium apparel, music formats, limited editions, and accessories with cart-ready interactions and Stripe checkout."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <GlassCard key={product.id} className="overflow-hidden p-0">
              <div className="relative h-72 bg-black/40">
                <Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 hover:scale-105" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">{product.category}</p>
                <h3 className="mt-3 text-2xl text-white">{product.name}</h3>
                <p className="mt-3 text-sm leading-7 text-stone-400">{product.description}</p>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-lg text-[#f4c66a]">{formatCurrency(product.price)}</span>
                  <Link href="/store" className="text-xs uppercase tracking-[0.25em] text-stone-200 transition hover:text-[#f4c66a]">
                    Add to cart
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
              <CTAButton href="/media">Open media page</CTAButton>
              <CTAButton href="/fan-club" tone="secondary">
                Unlock private clips
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
              description="Collect emails for releases, ticket drops, and merch launches. This can later connect to Mailchimp, Klaviyo, ConvertKit, or your CRM."
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
