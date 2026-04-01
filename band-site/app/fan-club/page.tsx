import type { Metadata } from "next";
import { FanClubPanel } from "@/components/fan-club";
import { PageHero, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Fan Club",
  description:
    "Join the KAMDRIDI fan club with membership tiers, game access, comic access, and exclusive Echoes Unearthed content."
};

export default function FanClubPage() {
  const membershipCheckoutLive = Boolean(
    process.env.NEXT_PUBLIC_STRIPE_LINK_INNER_CIRCLE || process.env.NEXT_PUBLIC_STRIPE_LINK_COLLECTOR
  );

  return (
    <>
      <PageHero
        eyebrow="Fan Club"
        title="Memberships, protocols, and exclusive universe access"
        description={
          membershipCheckoutLive
            ? "Fans can join the available membership tiers, then sign up or log in for exclusive content, game access, comic access, vault drops, and early merch access."
            : "Membership checkout is not open in this environment yet, so fans can request access directly while still using site accounts for game previews, comic access, vault drops, and updates."
        }
        image="/assets/images/band/live2.jpg"
      />
      <Section>
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
