import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Clock3,
  Film,
  MapPin,
  Mic2,
  Ticket,
  Zap,
} from "lucide-react";

const fringeUrl = "https://adelaidefringe.com.au/";

export const metadata: Metadata = {
  title: "Live in Australia — Adelaide Fringe 2027",
  description:
    "KAM DRIDI live at Domain Theatre, Marion Cultural Centre, Adelaide — Thursday 18 March 2027 at 7:30 PM.",
  openGraph: {
    title: "KAM DRIDI — Live in Australia · Adelaide Fringe 2027",
    description:
      "Domain Theatre · Marion Cultural Centre · Thursday 18 March 2027 · 7:30 PM.",
    url: "https://kamdridi.com/live",
    siteName: "KAM DRIDI",
    images: [
      {
        url: "https://kamdridi.com/assets/images/tour/tour-crowd-stage.png",
        width: 1600,
        height: 900,
        alt: "KAM DRIDI live concert atmosphere",
      },
    ],
    type: "website",
  },
};

const event = {
  name: "KAM DRIDI — Live in Australia",
  date: "Thursday 18 March 2027",
  time: "7:30 PM",
  venue: "Domain Theatre",
  centre: "Marion Cultural Centre",
  address: "287 Diagonal Road, Oaklands Park SA 5046",
  city: "Adelaide, South Australia",
  onSale: "4 December 2026",
};

export default function LivePage() {
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: event.name,
    startDate: "2027-03-18T19:30:00+10:30",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    url: "https://kamdridi.com/live",
    performer: {
      "@type": "MusicGroup",
      name: "KAM DRIDI",
      url: "https://kamdridi.com",
    },
    location: {
      "@type": "Place",
      name: "Domain Theatre — Marion Cultural Centre",
      address: {
        "@type": "PostalAddress",
        streetAddress: "287 Diagonal Road",
        addressLocality: "Oaklands Park",
        addressRegion: "SA",
        postalCode: "5046",
        addressCountry: "AU",
      },
    },
    image: ["https://kamdridi.com/assets/images/tour/tour-crowd-stage.png"],
  };

  return (
    <main className="min-h-screen bg-[#050403] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />

      <section className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/assets/images/tour/tour-crowd-stage.png"
          alt="KAM DRIDI live concert crowd and stage"
          fill
          priority
          className="object-cover object-center opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,5,14,0.34)_0%,rgba(3,3,4,0.38)_32%,rgba(5,4,3,0.9)_85%,#050403_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(16,79,180,0.38),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(215,28,38,0.4),transparent_32%)]" />
        <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#1c63ff,#ffffff,#d91f2b)] opacity-90" />

        <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-7xl flex-col px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70 transition hover:text-white"
            >
              KAM DRIDI
            </Link>
            <span className="rounded-full border border-red-400/30 bg-red-500/10 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-red-200">
              Confirmed live date
            </span>
          </div>

          <div className="grid flex-1 items-center gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <div className="mb-8 w-full max-w-[620px]">
                <Image
                  src="/australia/kamdridi-australia-logo.webp"
                  alt="KAM DRIDI Australia"
                  width={1400}
                  height={620}
                  priority
                  className="h-auto w-full drop-shadow-[0_0_30px_rgba(48,133,255,0.42)]"
                />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.45em] text-white/80">
                Live in Australia
              </p>
              <h1 className="mt-4 max-w-4xl font-display text-5xl uppercase leading-[0.88] tracking-[0.04em] text-white sm:text-6xl lg:text-8xl">
                Adelaide
                <span className="block text-red-500">Fringe 2027</span>
              </h1>
              <p className="mt-7 max-w-2xl text-base leading-8 text-stone-200 sm:text-lg">
                KAM DRIDI brings the cinematic melodic hard rock live show to
                Domain Theatre at Marion Cultural Centre for one confirmed
                Adelaide performance.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <a
                  href={fringeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.22em] text-black transition hover:bg-red-500 hover:text-white"
                >
                  <Ticket className="h-4 w-4" />
                  Official Adelaide Fringe
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <Link
                  href="/tour#dates"
                  className="inline-flex items-center rounded-full border border-white/20 bg-black/35 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.22em] text-white transition hover:border-white/50 hover:bg-white/10"
                >
                  Tour dates
                </Link>
              </div>

              <p className="mt-4 text-xs leading-6 text-stone-400">
                Public ticket on-sale: <strong className="text-white">4 December 2026</strong>.
                The direct KAM DRIDI event ticket URL will be added here as soon
                as the 2027 program listing is published.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -inset-5 rounded-[38px] bg-[conic-gradient(from_180deg_at_50%_50%,rgba(29,99,255,0.28),rgba(255,255,255,0.02),rgba(220,30,42,0.28),rgba(29,99,255,0.28))] blur-2xl" />
              <div className="relative overflow-hidden rounded-[32px] border border-white/15 bg-black/65 p-6 shadow-2xl shadow-black/60 backdrop-blur-xl sm:p-8">
                <div className="border-b border-white/10 pb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-300">
                    Adelaide · Australia
                  </p>
                  <h2 className="mt-3 font-display text-4xl uppercase tracking-[0.06em] text-white sm:text-5xl">
                    Domain Theatre
                  </h2>
                  <p className="mt-2 text-sm uppercase tracking-[0.24em] text-stone-400">
                    Marion Cultural Centre
                  </p>
                </div>

                <div className="grid gap-4 py-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <CalendarDays className="h-5 w-5 text-[#f4c66a]" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.26em] text-stone-500">
                      Date
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{event.date}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <Clock3 className="h-5 w-5 text-[#f4c66a]" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.26em] text-stone-500">
                      Showtime
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{event.time}</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 sm:col-span-2">
                    <MapPin className="h-5 w-5 text-[#f4c66a]" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.26em] text-stone-500">
                      Venue address
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{event.address}</p>
                    <p className="mt-1 text-sm text-stone-400">{event.city}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#f4c66a]/20 bg-[#f4c66a]/[0.06] p-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#f4c66a]">
                    Official ticketing
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-200">
                    Tickets for Adelaide Fringe 2027 go on sale to the public on
                    <strong className="text-white"> 4 December 2026</strong>. Ticket
                    sales are handled through the official Adelaide Fringe system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.36em] text-[#f4c66a]">
              The live show
            </p>
            <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.05em] text-white sm:text-5xl">
              Music · Cinema · Emotion · Live
            </h2>
            <p className="mt-6 max-w-xl text-base leading-8 text-stone-300">
              A focused theatre performance built around KAM DRIDI&apos;s melodic
              hard rock catalogue, live lead vocal, synchronized cinematic
              visuals, and a lighting design shaped to move with each song.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: Mic2,
                label: "100% live lead vocal",
                text: "The vocal performance stays live at the centre of the show.",
              },
              {
                icon: Film,
                label: "Cinematic visuals",
                text: "Pre-rendered synchronized film content expands each song into a visual world.",
              },
              {
                icon: Zap,
                label: "Live lighting design",
                text: "The Domain Theatre cue stack is built around the music, projection, and performer.",
              },
            ].map(({ icon: Icon, label, text }) => (
              <div
                key={label}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-6"
              >
                <Icon className="h-5 w-5 text-[#f4c66a]" />
                <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-white">
                  {label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-stone-400">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-[linear-gradient(90deg,rgba(24,58,135,0.12),rgba(0,0,0,0.18),rgba(135,24,31,0.12))]">
        <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_auto] lg:items-center lg:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.34em] text-red-300">
              Tickets
            </p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.05em] text-white sm:text-4xl">
              Official Adelaide Fringe ticketing
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
              Public sales open {event.onSale}. Until the individual KAM DRIDI
              listing is published, use the official Adelaide Fringe site for
              program and ticketing information.
            </p>
          </div>
          <a
            href={fringeUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-red-500 px-7 py-4 text-xs font-bold uppercase tracking-[0.22em] text-white transition hover:bg-red-400"
          >
            Adelaide Fringe
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </section>
    </main>
  );
}
