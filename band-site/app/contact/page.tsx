import type { Metadata } from "next";
import Link from "next/link";
import { ContactForm } from "@/components/contact-form";
import { GlassCard, Section, SectionHeading } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact KAMDRIDI for management, booking, press, licensing, and general inquiries."
};

const contactHeroVideo = "/videos/contact-hero-kamdrid.mp4";

export default function ContactPage() {
  return (
    <>
      <section className="relative h-[62svh] min-h-[420px] overflow-hidden border-b border-white/10 md:h-[74svh]">
        <video
          className="absolute inset-0 h-full w-full object-cover object-[center_18%]"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/images/press-bio-bg.jpg"
          aria-label="KAMDRIDI contact hero video"
        >
          <source src={contactHeroVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(6,5,4,0.03),rgba(6,5,4,0.16))]" />
      </section>

      <Section className="py-12 md:py-16">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Contact</p>
          <h1 className="mt-5 font-display text-4xl uppercase leading-none tracking-[0.08em] text-white sm:text-5xl md:text-7xl">
            Contact, management, and social channels
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
            Use the direct contact route for booking, press, licensing, brand work, and official
            KAMDRIDI inquiries.
          </p>
        </div>
      </Section>

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
