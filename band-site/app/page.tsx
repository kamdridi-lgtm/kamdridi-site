import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Disc3, Mail, Music2, Play, Radio, Shield, Sparkles } from "lucide-react";
import { FirstKnightEasterEgg } from "@/components/first-knight-easter-egg";
import { CTAButton, GlassCard, Section, SectionHeading } from "@/components/ui";
import { storeProducts } from "@/data/store";
import {
  comicPages,
  featuredVideo,
  gameExperiences,
  membershipTiers,
  siteMeta,
  socialLinks,
  streamingLinks,
  visualAlbumScenes
} from "@/data/site";

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
  return (
    <>
      <FirstKnightEasterEgg />
      <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <video
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/kamdridi-hero.jpg"
            aria-label="KAMDRIDI hero background video"
          >
            <source src="/kamdridi-hero.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        </div>

        <div className="absolute inset-0 z-20 flex items-end justify-center px-4 pb-24 text-center sm:px-6">
          <div className="flex flex-col items-center">
            <h1 className="max-w-full whitespace-nowrap px-2 font-display text-[clamp(0.82rem,2.35vw,3rem)] uppercase tracking-[0.08em] text-white drop-shadow-[0_12px_40px_rgba(0,0,0,0.85)] md:tracking-[0.12em]">
              MELODIC · CINEMATIC · UNEARTHED
            </h1>
            <a
              href="#stream-war-machines"
              className="mt-8 inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-7 py-4 text-sm uppercase tracking-[0.25em] text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffd989]"
            >
              LISTEN TO WAR MACHINES
            </a>
          </div>
        </div>
      </section>

      <Section id="stream-war-machines">
        <SectionHeading
          eyebrow="Music"
          title="Stream War Machines"
          description="Official streaming links for War Machines (Radio Edit) across the live platforms."
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
                  <p className="mt-1 text-xs uppercase tracking-[0.2em] text-stone-500">
                    {link.note}
                  </p>
                </div>
              </div>
              <span className="text-xs uppercase tracking-[0.25em] text-stone-300">Open</span>
            </a>
          ))}
        </div>
        <div className="mt-10">
          <GlassCard className="overflow-hidden p-0">
            <div className="w-full aspect-video">
              <iframe
                className="h-full w-full rounded-xl"
                src={featuredVideo.embedUrl}
                title={featuredVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section id="visual-album-home">
        <SectionHeading
          eyebrow="Visual Album"
          title="The Echoes Unearthed world in motion"
          description="Cinematic fragments, visual scenes, and atmosphere from the album campaign."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {visualAlbumScenes.map((scene) => (
            <GlassCard key={scene.id} className="overflow-hidden p-0">
              <div className="relative h-80">
                <Image src={scene.image} alt={scene.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{scene.title}</p>
                <p className="mt-4 text-sm leading-7 text-stone-400">{scene.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
        <div className="mt-8">
          <CTAButton href="/visual-album">Open Visual Album</CTAButton>
        </div>
      </Section>

      <Section id="games-home">
        <SectionHeading
          eyebrow="Games"
          title="Protocols inside the fan universe"
          description="Launch cinematic game experiences tied directly to the Echoes Unearthed campaign."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {gameExperiences.map((game) => (
            <GlassCard key={game.id} className="overflow-hidden p-0">
              <div className="relative h-80">
                <Image src={game.poster} alt={game.title} fill className="object-cover" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.88))]" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">
                    {game.subtitle}
                  </p>
                  <h3 className="mt-3 font-display text-4xl uppercase tracking-[0.08em] text-white">
                    {game.title}
                  </h3>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 p-6">
                <span className="text-xs uppercase tracking-[0.25em] text-stone-400">
                  {game.membership}
                </span>
                <CTAButton href="/games" tone="secondary">
                  Open Games
                </CTAButton>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section id="fan-club-home">
        <SectionHeading
          eyebrow="Fan Club"
          title="Membership access for the inner campaign"
          description="Private updates, game access, collector drops, and locked archive material."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {membershipTiers.map((tier) => (
            <GlassCard key={tier.id}>
              <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{tier.name}</p>
              <h3 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
                {tier.priceLabel}
              </h3>
              <p className="mt-4 text-sm leading-7 text-stone-400">{tier.description}</p>
              <div className="mt-6 grid gap-2">
                {tier.features.slice(0, 4).map((feature) => (
                  <div key={feature} className="flex items-start gap-3 text-sm text-stone-300">
                    <Shield className="mt-0.5 h-4 w-4 text-[#f4c66a]" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>
        <div className="mt-8">
          <CTAButton href="/fan-club">Enter Fan Club</CTAButton>
        </div>
      </Section>

      <Section id="store-home">
        <SectionHeading
          eyebrow="Store"
          title="Collector merch and official releases"
          description="Merchandise, premium formats, and collector pieces wired to hosted Stripe checkout."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {storeProducts.slice(0, 4).map((product) => (
            <GlassCard key={product.id} className="overflow-hidden p-0">
              <div className="relative h-72">
                <Image src={product.image} alt={product.name} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">{product.category}</p>
                <h3 className="mt-3 text-2xl text-white">{product.name}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-400">{product.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
        <div className="mt-8">
          <CTAButton href="/store">Open Store</CTAButton>
        </div>
      </Section>

      <Section id="comic-home">
        <SectionHeading
          eyebrow="Who Is Kam Dridi"
          title="Comic reader and artist mythology"
          description="A responsive comic experience built into the world of KAMDRIDI."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassCard>
            <p className="text-sm leading-7 text-stone-400">
              Move through the visual story, uncover the character arc, and enter the mythology
              behind Echoes Unearthed through the built-in comic reader.
            </p>
            <div className="mt-8">
              <CTAButton href="/who-is-kam-dridi">Open Comic Reader</CTAButton>
            </div>
          </GlassCard>
          <GlassCard className="overflow-hidden p-0">
            <div className="relative aspect-[4/3]">
              <Image
                src={comicPages[0]?.image || "/assets/images/gallery/p01_hero.jpg"}
                alt="Who is Kam Dridi preview"
                fill
                className="object-cover"
              />
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section id="contact-home">
        <SectionHeading
          eyebrow="Contact"
          title="Press, booking, and management"
          description="Reach the KAMDRIDI team for management, booking, licensing, and official contact."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassCard>
            <div className="flex items-start gap-4">
              <Mail className="mt-1 h-5 w-5 text-[#f4c66a]" />
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Email</p>
                <p className="mt-3 text-lg text-white">{siteMeta.email}</p>
              </div>
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-sm leading-7 text-stone-400">
              Follow KAMDRIDI across the active platforms and use the contact page for direct
              submissions and official inquiries.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CTAButton href="/contact">Open Contact Page</CTAButton>
              <a
                href={socialLinks[0]?.href || "https://youtube.com/@kamdridi"}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Follow KAMDRIDI
              </a>
            </div>
          </GlassCard>
        </div>
      </Section>
    </>
  );
}
