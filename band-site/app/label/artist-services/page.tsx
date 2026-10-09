import type { Metadata } from "next";
import Link from "next/link";
import { KamdridiRecordsLogo } from "@/components/label/KamdridiRecordsLogo";

export const metadata: Metadata = {
  title: "KAMDRIDI RECORDS Artist Services | Music Direction, Release Strategy & Creative Label Support",
  description:
    "KAMDRIDI RECORDS helps artists structure, package, improve, and present their music professionally through boutique artist services, release strategy, creative direction, and label-level guidance."
};

const artistServicesHref = "mailto:kamdridi@proton.me?subject=KAMDRIDI%20RECORDS%20Artist%20Services";
const starterHref = "mailto:kamdridi@proton.me?subject=KAMDRIDI%20RECORDS%20Starter%20Review";
const proHref = "mailto:kamdridi@proton.me?subject=KAMDRIDI%20RECORDS%20Pro%20Strategy";
const executiveHref = "mailto:kamdridi@proton.me?subject=KAMDRIDI%20RECORDS%20Executive%20Direction";
const contactHref = "mailto:kamdridi@proton.me";

const whoThisIsFor = [
  "You have songs but need direction.",
  "You want your release to feel more professional.",
  "You need help with image, pitch, structure, or rollout.",
  "You are preparing a single, EP, album, or visual concept.",
  "You want honest feedback before spending more money.",
  "You need label-level thinking without signing your life away."
];

const helpAreas = [
  "Song and release direction",
  "Artist identity and positioning",
  "Bio and pitch improvement",
  "Release rollout planning",
  "Visual and branding guidance",
  "Press kit preparation",
  "Sync/licensing readiness",
  "Catalogue and song review",
  "Creative business planning",
  "International presentation"
];

const tiers = [
  {
    name: "Starter",
    price: "$499 CAD",
    description: "For artists who need a clean foundation:",
    href: starterHref,
    cta: "Request Starter Review",
    includes: [
      "artistic review",
      "single/release direction",
      "basic release plan",
      "branding/image notes",
      "distribution checklist",
      "written recommendation summary"
    ]
  },
  {
    name: "Pro",
    price: "$999 CAD",
    description: "For serious artists preparing a real release:",
    href: proHref,
    cta: "Request Pro Strategy",
    includes: [
      "everything in Starter",
      "complete release strategy",
      "artist bio / pitch improvement",
      "30-day content plan",
      "visual direction notes",
      "press kit preparation",
      "stronger rollout guidance"
    ]
  },
  {
    name: "Premium / Executive",
    price: "$1,999 CAD",
    description: "For advanced projects that need label-level direction:",
    href: executiveHref,
    cta: "Request Executive Direction",
    includes: [
      "everything in Pro",
      "complete artistic direction",
      "60-90 day rollout plan",
      "sync/licensing readiness",
      "catalogue/song audit",
      "international positioning",
      "creative business plan"
    ]
  }
];

function ActionLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const className = primary
    ? "inline-flex justify-center rounded-full bg-[#f4c66a] px-7 py-4 text-center text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#ffe09a]"
    : "inline-flex justify-center rounded-full border border-[#f4c66a]/35 px-7 py-4 text-center text-xs font-black uppercase tracking-[0.18em] text-[#f4c66a] transition hover:border-[#f4c66a] hover:bg-[#f4c66a]/10";

  if (href.startsWith("/")) {
    return <Link href={href} className={className}>{children}</Link>;
  }

  return <a href={href} className={className}>{children}</a>;
}

export default function ArtistServicesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050403] text-white">
      <section className="relative px-5 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_8%,rgba(244,198,106,0.18),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(93,54,18,0.28),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl text-center">
          <KamdridiRecordsLogo size="hero" priority />
          <h1 className="mx-auto mt-8 max-w-5xl font-display text-5xl uppercase leading-none tracking-[0.06em] md:text-7xl">
            Artist Services
          </h1>
          <p className="mx-auto mt-6 max-w-4xl text-xl font-black uppercase leading-8 tracking-[0.08em] text-[#eadbc4] md:text-2xl">
            Release strategy, creative direction, positioning, and label-level guidance for serious artists.
          </p>
          <p className="mx-auto mt-6 max-w-4xl text-base leading-8 text-stone-300 md:text-lg">
            KAMDRIDI RECORDS is a boutique creative label and artist-services imprint connected to KAM DRIDI,
            helping serious artists shape their songs, releases, image, and rollout with professional direction.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <ActionLink href={artistServicesHref} primary>Request Artist Services</ActionLink>
            <ActionLink href="/submit">Submit Your Music</ActionLink>
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-stone-400">
            No fake promises. No shortcuts. Just serious creative direction, structure, and strategy.
          </p>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Who this is for</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] text-white md:text-6xl">
              Serious artists building stronger releases.
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-300 md:text-base md:leading-8">
              This is for artists, singers, bands, producers, and independent creators who already have music or a
              serious creative idea, but need help turning it into a stronger release, a clearer identity, and a more
              professional presentation.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {whoThisIsFor.map((item) => (
              <div key={item} className="border border-[#f4c66a]/15 bg-black/35 p-5 text-sm leading-7 text-stone-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">What we help with</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {helpAreas.map((area) => (
              <div key={area} className="min-h-28 border border-[#f4c66a]/15 bg-[#0a0704]/72 p-5 text-sm font-semibold leading-6 text-stone-200">
                {area}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Service tiers</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] text-white md:text-6xl">
                Choose the level of direction.
              </h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-stone-300">
              Every tier is handled by direct email for now. No fake checkout, no fake portal, no automatic label deal.
            </p>
          </div>
          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {tiers.map((tier) => (
              <article key={tier.name} className="flex min-h-[500px] flex-col justify-between rounded-[2rem] border border-[#f4c66a]/18 bg-[linear-gradient(180deg,rgba(244,198,106,0.08),rgba(0,0,0,0.22)),rgba(8,6,4,0.76)] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.35)]">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">Artist service</p>
                  <h3 className="mt-4 text-2xl font-black uppercase tracking-[0.06em] text-white">{tier.name}</h3>
                  <p className="mt-4 font-display text-4xl uppercase tracking-[0.06em] text-[#f4c66a]">{tier.price}</p>
                  <p className="mt-4 text-sm font-semibold leading-6 text-stone-200">{tier.description}</p>
                  <ul className="mt-6 space-y-3 text-sm leading-6 text-stone-300">
                    {tier.includes.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f4c66a]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <ActionLink href={tier.href} primary>{tier.cta}</ActionLink>
              </article>
            ))}
          </div>
          <div className="mt-6 rounded-[1.5rem] border border-[#f4c66a]/20 bg-black/35 p-5">
            <p className="text-sm leading-7 text-stone-300">
              KAMDRIDI RECORDS does not guarantee fame, streams, playlist placement, record deals, sync placements,
              revenue, or commercial success. We help artists structure, package, improve, and present their music
              professionally.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[2rem] border border-[#f4c66a]/20 bg-black/35 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Why KAMDRIDI RECORDS</p>
            <p className="mt-5 text-sm leading-7 text-stone-300 md:text-base md:leading-8">
              KAMDRIDI RECORDS is built from real artist experience, independent production, visual storytelling,
              release strategy, and the KAM DRIDI creative universe. The goal is not to sell fantasy. The goal is to
              help artists make stronger decisions, present better work, and build releases with more intention.
            </p>
          </div>
          <div className="rounded-[2rem] border border-[#f4c66a]/20 bg-[radial-gradient(circle_at_16%_0%,rgba(244,198,106,0.14),transparent_34%),rgba(8,6,4,0.76)] p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Roster example</p>
            <p className="mt-5 text-sm leading-7 text-stone-300 md:text-base md:leading-8">
              IRON COUNTY GHOSTS is the first official KAMDRIDI RECORDS project / roster example, showing the label's
              focus on cinematic identity, songs, visuals, storytelling, and long-term world-building.
            </p>
            <div className="mt-7">
              <ActionLink href="/roster">View Roster</ActionLink>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-24">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#f4c66a]/20 bg-[linear-gradient(135deg,rgba(244,198,106,.1),rgba(0,0,0,.56)),#080604] p-6 shadow-[0_35px_110px_rgba(0,0,0,.4)] md:p-10">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">How to start</p>
          <div className="mt-6 grid gap-4 md:grid-cols-5">
            {[
              "Send your music links.",
              "Tell us who you are and what you are building.",
              "Choose the level of support you need.",
              "We review the project.",
              "If it fits, we begin the artist-services process."
            ].map((step, index) => (
              <div key={step} className="border border-[#f4c66a]/15 bg-black/30 p-5">
                <p className="font-display text-3xl text-[#f4c66a]">{index + 1}</p>
                <p className="mt-4 text-sm leading-6 text-stone-300">{step}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <ActionLink href="/submit" primary>Submit Your Music</ActionLink>
            <ActionLink href={contactHref}>Contact</ActionLink>
          </div>
        </div>
      </section>
    </main>
  );
}
