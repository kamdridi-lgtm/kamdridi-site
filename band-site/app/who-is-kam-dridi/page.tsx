import type { Metadata } from "next";
import { ComicReader } from "@/components/comic-reader";
import { PageHero, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Who is Kam Dridi",
  description:
    "Read the comic-style archive for Who is Kam Dridi with responsive page navigation and lore framing."
};

export default function WhoIsKamDridiPage() {
  return (
    <>
      <PageHero
        eyebrow="Who is Kam Dridi"
        title="A comic archive inside the Echoes Unearthed world"
        description="Read through the responsive comic-style presentation and move through the artist mythology with a clean page viewer."
        image="/assets/images/gallery/p04_portrait_leather.jpg"
      />

      <Section>
        <SectionHeading
          eyebrow="Comic Reader"
          title="Who is Kam Dridi"
          description="A responsive reader layout with sequential navigation, built to support the comic pages already tied into the project structure."
        />
        <div className="mt-12">
          <ComicReader />
        </div>
      </Section>

      <Section id="lore-archive" className="pt-0">
        <SectionHeading
          eyebrow="Lore Archive"
          title="Signal fragments around the character"
          description="This layer is ready for deeper expansion with comic chapters, hidden notes, collector pages, and fan-club gated archive material."
        />
      </Section>
    </>
  );
}
