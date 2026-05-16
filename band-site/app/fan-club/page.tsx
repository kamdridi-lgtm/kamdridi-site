import type { Metadata } from "next";
import { FanClubPanel } from "@/components/fan-club";
import { CTAButton, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Fan Club",
  description:
    "Join the KAMDRIDI fan club with membership tiers, game access, comic access, and exclusive Echoes Unearthed content."
};

const fanClubHeroVideo = "/videos/fan-club-hero-grok.mp4";

export default function FanClubPage() {
  const membershipCheckoutLive = Boolean(
    process.env.NEXT_PUBLIC_STRIPE_LINK_INNER_CIRCLE || process.env.NEXT_PUBLIC_STRIPE_LINK_COLLECTOR
  );

  return (
    <>
      <section className="relative h-[62svh] min-h-[420px] overflow-hidden border-b border-white/10 md:h-[74svh]">
        <video
          className="absolute inset-0 h-full w-full object-cover object-top"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/images/band/live2.jpg"
          aria-label="KAMDRIDI fan club hero video"
        >
          <source src={fanClubHeroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,5,4,0.03),rgba(6,5,4,0.16))]" />
      </section>

      <Section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Fan Club</p>
          <h1 className="mt-5 font-display text-4xl uppercase leading-none tracking-[0.08em] text-white sm:text-5xl md:text-7xl">
            Memberships, protocols, and exclusive universe access
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
            {membershipCheckoutLive
              ? "Fans can join the available membership tiers, then sign up or log in for exclusive content, game access, comic access, vault drops, and early merch access."
              : "Membership checkout is not open in this environment yet, so fans can request access directly while still using site accounts for game previews, comic access, vault drops, and updates."}
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <CTAButton href="#membership-area">Membership Area</CTAButton>
            <CTAButton href="/games" tone="secondary">
              Game Access
            </CTAButton>
          </div>
        </div>
      </Section>

      <Section id="membership-area">
        <SectionHeading
          eyebrow="Membership Area"
          title="The Echoes Unearthed member hub"
          description={
            membershipCheckoutLive
              ? "Choose an available membership tier, then use your site account for private access across games, comic drops, vault material, and member updates."
              : "Request membership access directly, then use your site account for private access across games, comic drops, vault material, and member updates."
          }
        />
        <div className="mt-12">
          <FanClubPanel membershipCheckoutLive={membershipCheckoutLive} />
        </div>
      </Section>
    </>
  );
}
