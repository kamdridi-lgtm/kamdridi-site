import type { Metadata } from "next";
import { FanClubPanel } from "@/components/fan-club";
import { PageHero, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Fan Club",
  description:
    "Join the KAMDRIDI fan club with Stripe-powered membership tiers, game access, comic access, and exclusive Echoes Unearthed content."
};

export default function FanClubPage() {
  return (
    <>
      <PageHero
        eyebrow="Fan Club"
        title="Memberships, protocols, and exclusive universe access"
        description="Fans can join paid Stripe membership tiers, then sign up or log in for exclusive content, game access, comic access, vault drops, and early merch access."
        image="/assets/images/band/live2.jpg"
      />
      <Section>
        <SectionHeading
          eyebrow="Membership Area"
          title="The Echoes Unearthed member hub"
          description="Choose a hosted Stripe subscription tier, then use your site account for private access across games, comic drops, vault material, and member updates."
        />
        <div className="mt-12">
          <FanClubPanel />
        </div>
      </Section>
    </>
  );
}
