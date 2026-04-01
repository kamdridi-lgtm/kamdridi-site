import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { GlassCard, PageHero, Section, SectionHeading } from "@/components/ui";

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
        description="Use the direct contact route for booking, press, licensing, brand work, and official KAMDRIDI inquiries."
        image="/assets/images/press-bio-bg.jpg"
      />
      <Section>
        <SectionHeading
          eyebrow="Get in touch"
          title="Reach the team"
          description="Use the form for direct outreach and the management contact block for industry-facing requests."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Link href="/tour#dates" className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]">
            <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Booking</span>
            <span className="mt-3 block leading-7">Use this route for live dates, private events, and show-related management requests.</span>
          </Link>
          <Link href="/media#featured-video" className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]">
            <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Press</span>
            <span className="mt-3 block leading-7">Move from the contact page into featured media, approved stills, and public-facing campaign assets.</span>
          </Link>
          <GlassCard className="border-white/10 bg-black/30 p-5">
            <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Licensing</p>
            <p className="mt-3 text-sm leading-7 text-stone-300">
              Sync, brand work, collector drops, and special requests all route through the same direct contact layer.
            </p>
          </GlassCard>
        </div>
        <div className="mt-12">
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
