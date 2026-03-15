import type { Metadata } from "next";
import { FanClubPanel } from "@/components/fan-club";
import { PageHero, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Fan Club",
  description: "Join the KAMDRIDI fan club for exclusive content, private videos, and early merch access."
};

export default function FanClubPage() {
  return (
    <>
      <PageHero
        eyebrow="Fan Club"
        title="Member accounts, private media, and community access"
        description="Fans can sign up, log in, and access exclusive content, private videos, community prompts, and early merch opportunities."
        image="/assets/images/band/live2.jpg"
      />
      <Section>
        <SectionHeading
          eyebrow="Membership Area"
          title="A complete starter fan club experience"
          description="This page includes a production-ready signed-session flow and Vercel-compatible storage support."
        />
        <div className="mt-12">
          <FanClubPanel />
        </div>
      </Section>
    </>
  );
}
