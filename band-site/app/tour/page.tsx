import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton, GlassCard, Section, SectionHeading } from "@/components/ui";
import { tourDates } from "@/data/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tour",
  description: "Official KAMDRIDI tour dates, ticket links, VIP options, and live campaign updates."
};

export default function TourPage() {
  return (
    <>
      <section className="overflow-hidden border-b border-white/10">
        <div className="relative isolate">
          <video
            className="h-[58vh] w-full object-cover brightness-[1.03] contrast-[1.04] saturate-[1.02] md:h-[72vh]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/images/tour/tour.jpg"
            aria-label="KAMDRIDI tour dates hero video"
          >
            <source src="/videos/tour_top_2026-03-12.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.24))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.14),transparent_30%)]" />
        </div>

        <Section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Tour</p>
            <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-7xl">
              Tour dates, ticketing, and VIP experiences
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300">
              Every listed date includes venue context, VIP framing, and a real request path
              instead of dead outbound ticket buttons.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CTAButton href="#dates">View Dates</CTAButton>
              <CTAButton href="/contact#management" tone="secondary">
                Booking Contact
              </CTAButton>
            </div>
          </div>
        </Section>
      </section>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src="/assets/images/tour/tour-crowd-stage.png"
            alt="KAMDRIDI live crowd background"
            fill
            className="object-cover object-center opacity-32"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,7,0.84),rgba(9,8,7,0.68)_20%,rgba(9,8,7,0.82)_58%,rgba(9,8,7,0.94))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.12),transparent_28%)]" />
        </div>

        <Section id="dates" className="relative">
          <SectionHeading
            eyebrow="Tour Dates"
            title="Echoes Unearthed live dates"
            description="Each date now routes to a real contact or ticket action instead of fake placeholders."
          />
          <div className="mt-12 grid gap-4">
            {tourDates.map((show) => (
              <GlassCard key={`${show.city}-${show.date}`} className="grid gap-5 border-white/15 bg-black/45 backdrop-blur-sm lg:grid-cols-[0.7fr_1fr_0.8fr_0.7fr_auto] lg:items-center">
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">{formatDate(show.date)}</p>
                  <p className="mt-2 text-2xl text-white">{show.city}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Venue</p>
                  <p className="mt-2 text-stone-200">{show.venue}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">VIP option</p>
                  <p className="mt-2 text-stone-200">{show.vip}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Status</p>
                  <p className="mt-2 text-stone-200">{show.status}</p>
                </div>
                <a
                  href={show.ticketLink}
                  target={show.ticketLink.startsWith("mailto:") ? undefined : "_blank"}
                  rel={show.ticketLink.startsWith("mailto:") ? undefined : "noreferrer"}
                  className="inline-flex justify-center rounded-full bg-[#f4c66a] px-5 py-3 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
                >
                  {show.actionLabel ?? "Tickets"}
                </a>
              </GlassCard>
            ))}
          </div>
        </Section>

        <Section id="vip" className="relative">
          <SectionHeading
            eyebrow="VIP Access"
            title="Premium fan experiences around the live campaign"
            description="VIP access is treated as part of the artist world: early entry, collector moments, and direct communication routes while the live rollout is still taking shape."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            <GlassCard className="border-white/15 bg-black/45 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Priority Requests</p>
              <p className="mt-4 text-sm leading-8 text-stone-300">
                Every city keeps a direct request path active, so visitors never land on fake ticket links.
              </p>
            </GlassCard>
            <GlassCard className="border-white/15 bg-black/45 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">VIP Framing</p>
              <p className="mt-4 text-sm leading-8 text-stone-300">
                Early entry, signed pieces, premium merch moments, and private access stay aligned with each date card.
              </p>
            </GlassCard>
            <GlassCard className="border-white/15 bg-black/45 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Direct Contact</p>
              <p className="mt-4 text-sm leading-8 text-stone-300">
                Need booking or private event routing? Use <Link href="/contact#management" className="text-[#f4c66a] transition hover:text-[#ffd989]">Contact</Link> for the direct management route.
              </p>
            </GlassCard>
          </div>
        </Section>
      </div>
    </>
  );
}
