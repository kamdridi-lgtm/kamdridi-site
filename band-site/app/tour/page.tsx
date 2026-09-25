import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Clock3, MapPin, Ticket } from "lucide-react";
import { CTAButton, GlassCard, Section, SectionHeading } from "@/components/ui";
import { tourDates } from "@/data/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tour",
  description:
    "Confirmed KAM DRIDI live dates, official ticketing information, and concert updates.",
};

export default function TourPage() {
  return (
    <>
      <section className="overflow-hidden border-b border-white/10">
        <div className="relative isolate">
          <video
            className="h-[58vh] w-full object-cover brightness-[0.84] contrast-[1.08] saturate-[1.04] md:h-[70vh]"
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
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(210,30,40,0.18),transparent_34%)]" />
        </div>

        <Section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Live</p>
            <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-7xl">
              Confirmed live dates
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300">
              Only confirmed public performances are listed here. Ticket links
              route to official sources only.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <CTAButton href="#dates">View Dates</CTAButton>
              <CTAButton href="/live" tone="secondary">
                Adelaide 2027
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
            className="object-cover object-center opacity-25"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,8,7,0.9),rgba(9,8,7,0.72)_26%,rgba(9,8,7,0.9)_72%,rgba(9,8,7,0.97))]" />
        </div>

        <Section id="dates" className="relative">
          <SectionHeading
            eyebrow="Tour Dates"
            title="The next confirmed show"
            description="Adelaide is the first locked public theatre date in the current live rollout."
          />

          <div className="mt-12 grid gap-6">
            {tourDates.map((show) => (
              <GlassCard
                key={`${show.city}-${show.date}`}
                className="overflow-hidden border-white/15 bg-black/55 p-0 backdrop-blur-sm"
              >
                <div className="grid lg:grid-cols-[0.72fr_1.28fr]">
                  <div className="relative min-h-[320px] border-b border-white/10 lg:min-h-[430px] lg:border-b-0 lg:border-r">
                    <Image
                      src="/australia/17-for-ever-hero-wide.webp"
                      alt="KAM DRIDI Australia live campaign"
                      fill
                      className="object-cover object-center opacity-80"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.78))]" />
                    <div className="absolute inset-x-0 bottom-0 p-7">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-red-300">
                        Australia 2027
                      </p>
                      <p className="mt-2 font-display text-4xl uppercase tracking-[0.05em] text-white">
                        Adelaide Fringe
                      </p>
                    </div>
                  </div>

                  <div className="p-7 sm:p-9">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
                      <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">
                          {formatDate(show.date)}
                        </p>
                        <h2 className="mt-2 text-3xl font-semibold text-white">{show.city}</h2>
                      </div>
                      <span className="rounded-full border border-red-400/25 bg-red-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-red-200">
                        Confirmed
                      </span>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <CalendarDays className="h-5 w-5 text-[#f4c66a]" />
                        <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-stone-500">Venue</p>
                        <p className="mt-1 text-sm font-semibold text-white">{show.venue}</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                        <Clock3 className="h-5 w-5 text-[#f4c66a]" />
                        <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-stone-500">Showtime</p>
                        <p className="mt-1 text-sm font-semibold text-white">7:30 PM</p>
                      </div>
                      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:col-span-2">
                        <MapPin className="h-5 w-5 text-[#f4c66a]" />
                        <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-stone-500">Address</p>
                        <p className="mt-1 text-sm font-semibold text-white">
                          287 Diagonal Road, Oaklands Park SA 5046
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 rounded-2xl border border-[#f4c66a]/20 bg-[#f4c66a]/[0.05] p-5">
                      <p className="text-[10px] uppercase tracking-[0.26em] text-[#f4c66a]">Ticket status</p>
                      <p className="mt-2 text-sm leading-7 text-stone-200">{show.status}</p>
                      <p className="mt-1 text-xs leading-6 text-stone-500">
                        Official Adelaide Fringe ticketing only. The direct event URL will be added when the 2027 program listing is published.
                      </p>
                    </div>

                    <div className="mt-7 flex flex-wrap gap-3">
                      <a
                        href={show.ticketLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-full bg-[#f4c66a] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#ffd989]"
                      >
                        <Ticket className="h-4 w-4" />
                        {show.actionLabel ?? "Official Ticketing"}
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                      <Link
                        href="/live"
                        className="inline-flex items-center rounded-full border border-white/15 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.2em] text-white transition hover:border-white/40 hover:bg-white/[0.05]"
                      >
                        Full concert details
                      </Link>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
