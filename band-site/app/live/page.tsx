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
const tourDates = [
  { date: "17 JAN 2027", city: "Tokyo", country: "Japan", venue: "GEKIRIN · The Playhouse, Machida", venueLink: "https://theplayhouse.jp/", detailsLink: "/japan", ticketLink: "https://mohanak.com/ticket/" },
  { date: "22–24 JAN 2027", city: "Canberra", country: "Australia", venue: "Smith’s Alternative · Target venue, pending booking", venueLink: "https://www.smithsalternative.com/" },
  { date: "FEB 2027", city: "Brisbane", country: "Australia", venue: "TBA" },
  { date: "06 FEB 2027 · PROVISIONAL", city: "Coolangatta · Gold Coast", country: "Australia", venue: "Eddie’s Grub House", venueLink: "https://www.eddiesgrubhouse.com/" },
  { date: "FEB 2027", city: "Rockhampton", country: "Australia", venue: "TBA" },
  { date: "FEB 2027", city: "Mackay", country: "Australia", venue: "TBA" },
  { date: "FEB 2027", city: "Airlie Beach", country: "Australia", venue: "TBA" },
  { date: "FEB 2027", city: "Cairns", country: "Australia", venue: "TBA" },
  { date: "02 MAR 2027 · 19:30", city: "Wellington", country: "New Zealand", venue: "The Fringe Bar · NZ Fringe", detailsLink: "/new-zealand", ticketLink: "https://tickets.fringe.co.nz/", ticketLabel: "Festival tickets" },
  { date: "MAR 2027", city: "Lyttelton · Christchurch", country: "New Zealand", venue: "Wunderbar", venueLink: "https://wunderbar.co.nz/whats-on/" },
  { date: "MAR 2027", city: "Auckland", country: "New Zealand", venue: "TBA" },
  { date: "MAR 2027", city: "Dunedin", country: "New Zealand", venue: "TBA" },
  { date: "05 MAR 2027 · PROVISIONAL", city: "Sydney", country: "Australia", venue: "Dead Set", venueLink: "https://www.deadsetdarlo.com.au/" },
  { date: "18 MAR 2027 · 19:30", city: "Adelaide", country: "Australia", venue: "Domain Theatre · Marion Cultural Centre", venueLink: "https://www.marionculturalcentre.com.au/", detailsLink: "/live#adelaide-show", ticketLink: "https://adelaidefringe.com.au/", ticketLabel: "Tickets from 4 Dec" },
  { date: "2027", city: "Perth", country: "Australia", venue: "TBA" },
  { date: "08–10 APR 2027 · TBA", city: "Tallinn", country: "Estonia", venue: "Tallinn Music Week · Target showcase, pending selection", festivalLink: "https://tmw.ee/music" },
  { date: "APR–MAY 2027 · TBA", city: "Centurion", country: "South Africa", venue: "At The River · Date to be announced", venueLink: "https://at-theriver.co.za/" },
  { date: "19 JUN 2027 · PROVISIONAL", city: "Ninane · Chaudfontaine", country: "Belgium", venue: "Festival de musique · ASBL Ninane Village · Pending confirmation", festivalLink: "https://stayhappening.com/e/festival-de-musique-gratuit-E2ISXKYVH0Q", festivalLabel: "2025 festival archive" },
  { date: "20 JUN 2027 · TBA", city: "Paris", country: "France", venue: "Supersonic · Target venue, pending booking", venueLink: "https://supersonic-club.fr/infos-pratiques/" },
  { date: "SUMMER 2027 · TBA", city: "Luxembourg", country: "Luxembourg", venue: "TBA · In development" },
  { date: "SUMMER 2027 · TBA", city: "Cologne · Aachen", country: "Germany", venue: "TBA · In development" },
  { date: "SUMMER 2027 · TBA", city: "Location TBA", country: "Switzerland", venue: "TBA · In development" },
  { date: "SUMMER 2027 · TBA", city: "Additional UK cities", country: "United Kingdom", venue: "TBA · In development" },
  { date: "29 OCT 2027 · PROVISIONAL", city: "Whitby", country: "United Kingdom", venue: "KAM DRIDI — HALLOWEEN REVENANT 2027 · The Royal Hotel", festivalLink: "https://whitbyrevenant.com/" },
  { date: "2027 · TBA", city: "Location TBA", country: "Malaysia", venue: "METALVERSE · Possible host country · Pending confirmation", festivalLink: "https://voxnationlive.com/", festivalLabel: "Promoter website" },
  { date: "2027 · TBA", city: "Singapore", country: "Singapore", venue: "METALVERSE · Alternative host country · Pending confirmation", festivalLink: "https://voxnationlive.com/", festivalLabel: "Promoter website" },
];


const countryFlags: Record<string, string> = { Japan: "jp", Australia: "au", "New Zealand": "nz", "South Africa": "za", Belgium: "be", Estonia: "ee", Malaysia: "my", Singapore: "sg", France: "fr", Luxembourg: "lu", Germany: "de", Switzerland: "ch", "United Kingdom": "gb" };

export const metadata: Metadata = {
  title: "World Tour 2027 — Live Concerts",
  alternates: { canonical: "https://kamdridi.com/live" },
  description:
    "KAM DRIDI World Tour 2027: Asia-Pacific, South Africa and Europe. Explore confirmed shows and provisional tour dates.",
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
        <Image src="/assets/images/tour/tour-crowd-stage.png" alt="KAM DRIDI World Tour 2027" fill priority className="object-cover object-center opacity-70" sizes="100vw" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,3,4,0.2)_0%,rgba(3,3,4,0.5)_48%,#050403_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(28,99,255,0.22),transparent_32%),radial-gradient(circle_at_82%_30%,rgba(217,31,43,0.26),transparent_30%)]" />
        <div className="relative z-10 mx-auto flex min-h-[82vh] max-w-7xl flex-col justify-end px-5 pb-14 pt-28 sm:px-8 lg:px-10 lg:pb-20">
          <p className="text-xs font-semibold uppercase tracking-[0.42em] text-[#f4c66a]">KAM DRIDI · LIVE 2027</p>
          <h1 className="mt-5 max-w-5xl font-display text-5xl uppercase leading-[0.86] tracking-[0.03em] text-white sm:text-7xl lg:text-8xl">World <span className="block text-red-500">Tour 2027</span></h1>
          <p className="mt-6 max-w-xl text-sm uppercase tracking-[0.25em] text-white/70">Japan · Australia · New Zealand · South Africa · Europe · UK</p>
          <p className="mt-4 max-w-xl text-sm leading-6 text-stone-300">World Tour 2027. Confirmed shows and provisional destinations. Additional dates, venues and ticket details to be announced.</p>
        </div>
      </section>

      <section aria-label="Explore live shows by country" className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 lg:px-10">
        <Link href="#adelaide-show" className="group rounded-3xl border border-white/20 bg-[linear-gradient(120deg,#171d39,#14090e)] p-6 transition hover:border-blue-400/60 hover:bg-white/10">
          <span className="text-3xl" aria-hidden="true">🇦🇺</span>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-white">Australia</h2>
          <p className="mt-2 text-sm text-stone-300">Adelaide Fringe · Coolangatta · additional dates</p>
          <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-white">Explore shows →</span>
        </Link>
        <Link href="/japan" className="group rounded-3xl border border-white/20 bg-[linear-gradient(120deg,#281419,#0b0a14)] p-6 transition hover:border-red-400/60 hover:bg-white/10">
          <span className="text-3xl" aria-hidden="true">🇯🇵</span>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-white">Japan</h2>
          <p className="mt-2 text-sm text-stone-300">Tokyo · GEKIRIN · The Playhouse · 17 January 2027</p>
          <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-white">Explore Japan →</span>
        </Link>
        <Link href="/new-zealand" className="group rounded-3xl border border-white/20 bg-[linear-gradient(120deg,#32101b,#100912)] p-6 transition hover:border-red-400/60 hover:bg-white/10">
          <span className="text-3xl" aria-hidden="true">🇳🇿</span>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-wide text-white">New Zealand</h2>
          <p className="mt-2 text-sm text-stone-300">Wellington · The Fringe Bar · 2 March 2027</p>
          <span className="mt-4 inline-block text-xs font-bold uppercase tracking-[.2em] text-white">View Wellington poster →</span>
        </Link>
      </section>

      <section id="tour-dates" className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-10 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-6 border-b border-white/15 pb-5">
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-[#f4c66a]">World Tour · 2027</p><h2 className="mt-3 font-display text-4xl uppercase tracking-[0.04em] sm:text-5xl">Tour Dates</h2></div>
          <p className="hidden text-[10px] uppercase tracking-[0.24em] text-stone-500 sm:block">More dates incoming</p>
        </div>
        <div>
          {tourDates.map((show) => (
            <div key={show.date + show.city} className="group grid grid-cols-[105px_1fr] gap-x-4 border-b border-white/10 py-6 transition hover:border-white/35 sm:grid-cols-[155px_1fr_1fr_auto] sm:items-center sm:gap-x-7" style={show.city === "Whitby" ? { backgroundImage: "linear-gradient(90deg, #080808 0%, #080808 12%, rgba(8,8,8,.28) 38%, rgba(8,8,8,.28) 62%, #080808 88%, #080808 100%), url(data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20220%22%3E%3Cdefs%3E%3CradialGradient%20id%3D%22g%22%3E%3Cstop%20stop-color%3D%22%23a54b12%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23080b06%22%2F%3E%3C%2FradialGradient%3E%3ClinearGradient%20id%3D%22p%22%20x2%3D%220.7%22%20y2%3D%221%22%3E%3Cstop%20stop-color%3D%22%23f47b19%22%2F%3E%3Cstop%20offset%3D%22.5%22%20stop-color%3D%22%23b43b08%22%2F%3E%3Cstop%20offset%3D%221%22%20stop-color%3D%22%23100b08%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22b%22%3E%3CfeGaussianBlur%20stdDeviation%3D%229%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Cellipse%20cx%3D%22260%22%20cy%3D%22120%22%20rx%3D%22135%22%20ry%3D%22100%22%20fill%3D%22url(%23g)%22%20opacity%3D%22.7%22%20filter%3D%22url(%23b)%22%2F%3E%3Cg%20stroke%3D%22%23171109%22%20stroke-width%3D%223%22%3E%3Cpath%20d%3D%22M250%2050%20Q239%2020%20263%2013%20L276%2020%20Q257%2030%20269%2054%22%20fill%3D%22%234d5130%22%2F%3E%3Cellipse%20cx%3D%22210%22%20cy%3D%22126%22%20rx%3D%2267%22%20ry%3D%2277%22%20fill%3D%22url(%23p)%22%2F%3E%3Cellipse%20cx%3D%22309%22%20cy%3D%22126%22%20rx%3D%2267%22%20ry%3D%2277%22%20fill%3D%22url(%23p)%22%2F%3E%3Cellipse%20cx%3D%22238%22%20cy%3D%22124%22%20rx%3D%2258%22%20ry%3D%2283%22%20fill%3D%22url(%23p)%22%2F%3E%3Cellipse%20cx%3D%22282%22%20cy%3D%22124%22%20rx%3D%2258%22%20ry%3D%2283%22%20fill%3D%22url(%23p)%22%2F%3E%3Cellipse%20cx%3D%22260%22%20cy%3D%22125%22%20rx%3D%2245%22%20ry%3D%2285%22%20fill%3D%22url(%23p)%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23ffb000%22%20opacity%3D%22.55%22%20filter%3D%22url(%23b)%22%3E%3Cpath%20d%3D%22M190%2086%20L246%20112%20L201%20120%20Z%20M330%2086%20L274%20112%20L319%20120%20Z%20M193%20145%20Q260%20193%20327%20145%20L306%20180%20L282%20171%20L263%20191%20L238%20173%20L215%20180Z%22%2F%3E%3C%2Fg%3E%3Cg%20fill%3D%22%23ffdc65%22%20stroke%3D%22%23080a05%22%20stroke-width%3D%224%22%3E%3Cpath%20d%3D%22M190%2086%20L246%20112%20L201%20120%20Z%20M330%2086%20L274%20112%20L319%20120%20Z%20M260%20118%20L249%20137%20L270%20137%20Z%20M193%20145%20L220%20156%20L231%20149%20L246%20167%20L260%20157%20L278%20168%20L291%20150%20L303%20157%20L327%20145%20L309%20180%20L289%20174%20L268%20190%20L245%20178%20L226%20181%20L207%20165%20Z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E)", backgroundSize: "cover, 76% 155%", backgroundPosition: "center, center", backgroundRepeat: "no-repeat", borderRadius: "8px" } : undefined}>
              <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-stone-400 sm:text-xs">{show.date}</div>
              <div><div className="font-display text-xl uppercase tracking-[0.04em] text-white sm:text-2xl">{show.city}</div><div className="mt-1 flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-stone-500">{countryFlags[show.country] && <img src={`https://flagcdn.com/w40/${countryFlags[show.country]}.png`} alt="" aria-hidden="true" className="h-[12px] w-[20px] shrink-0 rounded-[2px] object-cover shadow-[0_0_0_1px_rgba(255,255,255,0.18)]" loading="lazy" />}<span>{show.country}</span></div></div>
              <div className="col-start-2 mt-2 sm:col-start-auto sm:mt-0">
                <div className="text-xs font-semibold uppercase tracking-[0.1em] text-stone-200 sm:text-sm">{show.venue}</div>
                <div className="mt-1 hidden text-[9px] uppercase tracking-[0.2em] text-stone-500 sm:block">{show.country}</div>
                {"detailsLink" in show && show.detailsLink && (
                  <div className="mt-2 flex flex-wrap items-center gap-3">
                    <Link href={show.detailsLink} className="text-xs font-semibold text-[#f4c66a] underline underline-offset-4 hover:text-white">Concert details ↗</Link>
                    {"ticketLink" in show && show.ticketLink && (
                      <a href={show.ticketLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full border border-red-500/60 bg-red-700 px-3 py-1.5 text-[10px] font-bold uppercase text-white hover:bg-red-600"><Ticket className="h-3 w-3" /> {"ticketLabel" in show && show.ticketLabel ? show.ticketLabel : "Buy Tickets"} ↗</a>
                    )}
                  </div>
                )}
              </div>
              {"festivalLink" in show && show.festivalLink && (
                <div className="col-start-2 mt-2 sm:col-start-4 sm:mt-0"><a href={show.festivalLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#f4c66a] underline underline-offset-4 hover:text-white">{"festivalLabel" in show && show.festivalLabel ? show.festivalLabel : "Festival website"} ↗</a></div>
              )}
              {"venueLink" in show && show.venueLink && (
                <div className="col-start-2 mt-2 sm:col-start-4 sm:mt-0">
                  <a href={show.venueLink} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-[#f4c66a] underline underline-offset-4 hover:text-white">Visit venue ↗</a>
                </div>
              )}
            </div>
          ))}
        </div>
        <p className="mt-7 max-w-2xl text-xs leading-6 text-stone-500">Provisional dates and destinations are subject to confirmation. Malaysia and Singapore represent alternative routing options for the same METALVERSE opportunity, not two confirmed performances. Additional dates and venue details to be announced.</p>
      </section>

      <section id="international-booking" className="border-b border-white/10 bg-[#080808] px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl rounded-2xl border border-[#f4c66a]/20 bg-[#111111] px-6 py-12 text-center sm:px-12">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#f4c66a]">KAM DRIDI · WORLD TOUR 2027</p>
          <h2 className="font-display mt-5 text-4xl uppercase tracking-[0.04em] text-white sm:text-6xl">Bring KAM DRIDI to your city</h2>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg">International booking now open for festivals, theatres, live venues and special events.</p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-stone-400">Cinematic melodic hard rock from Montreal, Canada · Live lead vocals, professional instrumental backing tracks and optional synchronized visuals.</p>
          <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <a href="mailto:management@kamdridi.com?subject=KAM%20DRIDI%20World%20Tour%202027%20Booking" className="rounded-full bg-white px-7 py-3 text-sm font-bold uppercase tracking-wide !text-black hover:bg-[#f4c66a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f4c66a]">Request a show</a>
            <Link href="/press" className="rounded-full border border-white/30 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white hover:border-[#f4c66a]">Artist Press Kit</Link>
            <Link href="/industry" className="rounded-full border border-white/30 px-7 py-3 text-sm font-bold uppercase tracking-wide text-white hover:border-[#f4c66a]">Industry &amp; Booking</Link>
          </div>
          <a href="mailto:management@kamdridi.com?subject=KAM%20DRIDI%20World%20Tour%202027%20Booking" className="mt-6 inline-block text-sm text-[#f4c66a] underline underline-offset-4">Contact management ↗</a>
        </div>
      </section>

      <section id="adelaide-show" className="relative isolate overflow-hidden border-b border-white/10">
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
              <div className="mb-8 flex h-[250px] w-full max-w-[620px] items-center justify-center sm:h-[310px]">
                <div
                  role="img"
                  aria-label="KAM DRIDI Australia"
                  className="h-full w-full bg-contain bg-center bg-no-repeat mix-blend-screen drop-shadow-[0_0_30px_rgba(48,133,255,0.42)]"
                  style={{ backgroundImage: 'url("/australia/kamdridi-australia-logo-transparent.png")' }}
                />
              </div>

              <p className="text-sm font-semibold uppercase tracking-[0.45em] text-white/80">
                Live in Australia
              </p>
              <h1 className="sr-only">Adelaide Fringe 2027 — KAM DRIDI Live</h1>
              <Image
                src="/adelaide/adelaide-fringe-2027-official.svg"
                alt="Adelaide Fringe — 19 February to 21 March 2027 (official festival logo)"
                width={721}
                height={209}
                className="mt-5 h-auto w-full max-w-[680px] object-contain object-left drop-shadow-[0_12px_26px_rgba(0,0,0,0.48)]"
              />
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
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-bold uppercase tracking-[0.22em] transition hover:bg-stone-100"
                  style={{ color: "#080808" }}
                >
                  <Ticket className="h-4 w-4" style={{ color: "#080808" }} />
                  <span style={{ color: "#080808" }}>Official Adelaide Fringe</span>
                  <ArrowUpRight className="h-4 w-4" style={{ color: "#080808" }} />
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
              <div className="relative isolate overflow-hidden rounded-[32px] border border-white/15 bg-transparent p-6 shadow-2xl shadow-black/60 sm:p-8">
                <div className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center opacity-100" style={{ backgroundImage: "url('/adelaide/domain-theatre-hd.jpg')" }} aria-hidden="true" />
                <div className="pointer-events-none absolute inset-0 -z-10 bg-black/15" aria-hidden="true" />
                <div className="border-b border-white/10 pb-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-red-300">
                    Adelaide · Australia
                  </p>
                  <h2 className="sr-only">Marion Cultural Centre | Domain Theatre</h2>
                  <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
                    <img src="/adelaide/domain-theatre-logo-hd.png" alt="Domain Theatre" width={1672} height={941} className="h-auto w-[47%] max-w-[215px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]" />
                    <img src="/adelaide/marion-cultural-centre-logo-hd.png" alt="Marion Cultural Centre" width={1983} height={793} className="h-auto w-[47%] max-w-[215px] object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]" />
                  </div>
                </div>

                <div className="grid gap-4 py-6 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/20 bg-black/55 p-4">
                    <CalendarDays className="h-5 w-5 text-[#f4c66a]" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.26em] text-stone-500">
                      Date
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{event.date}</p>
                  </div>
                  <div className="rounded-2xl border border-white/25 bg-black/45 p-4">
                    <Clock3 className="h-5 w-5 text-[#f4c66a]" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.26em] text-stone-500">
                      Showtime
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{event.time}</p>
                  </div>
                  <div className="rounded-2xl border border-white/25 bg-black/45 p-4 sm:col-span-2">
                    <MapPin className="h-5 w-5 text-[#f4c66a]" />
                    <p className="mt-3 text-[10px] uppercase tracking-[0.26em] text-stone-500">
                      Venue address
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">{event.address}</p>
                    <p className="mt-1 text-sm text-stone-400">{event.city}</p>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#f4c66a]/30 bg-black/40 p-5">
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
