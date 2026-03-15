import type { Metadata } from "next";
import { ContactForm } from "@/components/contact-form";
import { PageHero, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact KAMDRIDI for management, booking, press, licensing, and general inquiries."
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Contact, management, and social channels"
        description="A complete contact page with form submission, management details, and direct social platform links."
        image="/assets/images/press-bio-bg.jpg"
      />
      <Section>
        <SectionHeading
          eyebrow="Get in touch"
          title="Reach the team"
          description="Use the built-in contact form for general outreach and list direct management details for industry requests."
        />
        <div className="mt-12">
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
