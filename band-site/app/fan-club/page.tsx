import type { Metadata } from "next";
import { FanClubPanel } from "@/components/fan-club";
import { PageHero, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Fan Club",
  description: "Join the KAMDRIDI fan club with Stripe-powered membership tiers and exclusive content access."
};

export default function FanClubPage() {
  return (
    <>
      <PageHero
        eyebrow="Fan Club"
        title="Memberships, private media, and community access"
        description="Fans can join paid Stripe membership tiers, then sign up or log in for exclusive content, private videos, and early merch access."
        image="/assets/images/band/live2.jpg"
      />
      <Section>
        <SectionHeading
          eyebrow="Membership Area"
          title="Stripe memberships and fan access"
          description="Choose a hosted Stripe subscription tier, then use your site account for the private fan vault."
        />
        <div className="mt-12">
          <FanClubPanel />
        </div>
      </Section>
    </>
  );
}
