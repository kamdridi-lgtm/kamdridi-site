import type { Metadata } from "next";
import { GlassCard, PageHero, Section, SectionHeading } from "@/components/ui";
import { tourDates } from "@/data/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tour",
  description: "Official KAMDRIDI tour dates, ticket links, VIP options, and live campaign updates."
};

export default function TourPage() {
  return (
    <>
      <PageHero
        eyebrow="Tour"
        title="Tour dates, ticketing, and VIP experiences"
        description="Show every city, venue, date, ticket link, and upgrade option in a format that feels like a major artist website."
        image="/assets/images/tour/tour.jpg"
      />
      <Section id="dates">
        <SectionHeading
          eyebrow="Tour Dates"
          title="Echoes Unearthed live dates"
          description="The system below is data-driven and can be swapped later for CMS, spreadsheet, or ticketing API data."
        />
        <div className="mt-12 grid gap-4">
          {tourDates.map((show) => (
            <GlassCard key={`${show.city}-${show.date}`} className="grid gap-5 lg:grid-cols-[0.7fr_1fr_0.8fr_0.7fr_auto] lg:items-center">
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
                target="_blank"
                rel="noreferrer"
                className="inline-flex justify-center rounded-full bg-[#f4c66a] px-5 py-3 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
              >
                Tickets
              </a>
            </GlassCard>
          ))}
        </div>
      </Section>
      <Section id="vip">
        <GlassCard className="grid gap-6 lg:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">VIP Access</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">Premium fan experiences</h2>
          </div>
          <div className="text-sm leading-8 text-stone-400">
            <p>Offer early entry, soundcheck access, exclusive posters, signed items, and premium meetups.</p>
          </div>
          <div className="text-sm leading-8 text-stone-400">
            <p>This section is ready for direct upsell copy, package tiers, venue notes, and policy details.</p>
          </div>
        </GlassCard>
      </Section>
    </>
  );
}
