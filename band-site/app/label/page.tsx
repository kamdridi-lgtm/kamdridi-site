import type { Metadata } from "next";
import Link from "next/link";
import { LabelAssistantChat } from "@/components/label/LabelAssistantChat";
import { KamdridiRecordsLogo } from "@/components/label/KamdridiRecordsLogo";

export const metadata: Metadata = {
  title: "KAMDRIDI Records",
  description:
    "KAMDRIDI RECORDS is a boutique creative label for rock, dark country, cinematic music, and artist-driven projects."
};

const packageContactHref = "mailto:kamdridi@proton.me?subject=Artist Services - KAMDRIDI RECORDS";
const submissionHref = "mailto:kamdridi@proton.me?subject=Artist Submission - KAMDRIDI RECORDS";
const licensingHref = "mailto:kamdridi@proton.me?subject=Licensing Inquiry - KAMDRIDI RECORDS";
const updatesHref = "mailto:kamdridi@proton.me?subject=KAMDRIDI RECORDS Updates";

const packages = [
  {
    name: "Starter",
    price: "$499 CAD",
    audience: "For artists who need a clean foundation.",
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
    audience: "For serious artists preparing a real release.",
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
    audience: "For advanced projects that need label-level direction.",
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

const signingSteps = [
  {
    title: "Step 1 - Submit Music",
    text: "Send artist name, location, 1-3 best songs, links, short bio, socials, and what kind of support you need."
  },
  {
    title: "Step 2 - Review",
    text: "KAMDRIDI RECORDS reviews artist identity, music quality, visuals, work ethic, and release potential."
  },
  {
    title: "Step 3 - Proposal",
    text: "If selected, KAMDRIDI RECORDS sends a clear written proposal: service package, single partnership, or label deal."
  },
  {
    title: "Step 4 - Agreement",
    text: "Nothing starts until both sides sign a written agreement."
  },
  {
    title: "Step 5 - Onboarding",
    text: "Artist sends assets, songs, lyrics, credits, photos, links, and access needed for the release plan."
  },
  {
    title: "Step 6 - Release / Campaign",
    text: "KAMDRIDI RECORDS builds the rollout, visuals, EPK, release page, and promo materials."
  }
];

const submissionChecklist = [
  "artist name",
  "country/city",
  "music links",
  "short bio",
  "goal",
  "what they need help with",
  "budget range if comfortable",
  "release timeline",
  "press kit or images if available"
];

function ActionLink({
  href,
  children,
  variant = "primary",
  external = false
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  external?: boolean;
}) {
  const className =
    variant === "primary"
      ? "inline-flex justify-center rounded-full bg-[#f4c66a] px-7 py-4 text-center text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#ffe09a]"
      : "inline-flex justify-center rounded-full border border-[#f4c66a]/35 px-7 py-4 text-center text-xs font-black uppercase tracking-[0.18em] text-[#f4c66a] transition hover:border-[#f4c66a] hover:bg-[#f4c66a]/10";

  if (href.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined} className={className}>
      {children}
    </a>
  );
}

export default function LabelPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#050403] text-white">
      <section className="relative px-5 py-20 md:py-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_8%,rgba(244,198,106,0.18),transparent_30%),radial-gradient(circle_at_78%_24%,rgba(93,54,18,0.28),transparent_34%)]" />
        <div className="relative mx-auto max-w-7xl text-center">
          <KamdridiRecordsLogo size="hero" priority />
          <h1 className="mt-8 font-display text-5xl uppercase leading-none tracking-[0.06em] md:text-7xl">
            Boutique Creative Label
          </h1>
          <p className="mt-6 max-w-4xl text-xl font-black uppercase leading-8 tracking-[0.08em] text-[#eadbc4] md:text-2xl">
            Rock, dark country, cinematic music, and artist-driven projects.
          </p>
          <p className="mx-auto mt-5 max-w-3xl text-base leading-8 text-stone-300">
            KAMDRIDI RECORDS develops artists and music projects through strong identity, visual storytelling, release
            strategy, EPK assets, and long-term catalog planning.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <ActionLink href="#roster">View Roster</ActionLink>
            <ActionLink href="/label/artist-services" variant="secondary">Artist Services</ActionLink>
            <ActionLink href="/submit" variant="secondary">Submit Your Music</ActionLink>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl rounded-[2rem] border border-[#f4c66a]/18 bg-[linear-gradient(135deg,rgba(244,198,106,0.08),rgba(0,0,0,0.36)),rgba(8,6,4,0.72)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.36)] md:p-10">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Mission</p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] text-white md:text-6xl">
            Not a fake major label. A serious creative engine.
          </h2>
          <p className="mt-5 max-w-4xl text-base leading-8 text-stone-300">
            KAMDRIDI RECORDS is an independent boutique label and creative production imprint. We focus on selected
            projects where music, image, storytelling and release strategy can be built together.
          </p>
        </div>
      </section>

      <section id="roster" className="px-5 pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Current Roster</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <article className="rounded-[2rem] border border-[#f4c66a]/18 bg-[radial-gradient(circle_at_14%_0%,rgba(244,198,106,0.14),transparent_34%),rgba(8,6,4,0.78)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.38)] md:p-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">Dark Country / Outlaw Americana / Country-Rock</p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.08em] text-white">IRON COUNTY GHOSTS</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">Single: Dust on the Altar</p>
              <div className="mt-7">
                <ActionLink href="/iron-county-ghosts" variant="secondary">
                  View Artist Site
                </ActionLink>
              </div>
            </article>

            <article className="rounded-[2rem] border border-[#f4c66a]/18 bg-[radial-gradient(circle_at_14%_0%,rgba(244,198,106,0.12),transparent_34%),rgba(8,6,4,0.7)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.32)] md:p-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">Rock / Cinematic / Independent Artist</p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.08em] text-white">KAM DRIDI</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">Official KAMDRIDI artist site and universe hub.</p>
              <div className="mt-7">
                <ActionLink href="/" variant="secondary">
                  View Official Site
                </ActionLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Artist Services</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] md:text-6xl">Build the release properly</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-stone-300">
              Paid creative services for independent artists who need identity, release structure, visuals, and campaign
              direction without buying a label deal.
            </p>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-3">
            {packages.map((item) => (
              <article
                key={item.name}
                className="flex min-h-[470px] flex-col justify-between rounded-[2rem] border border-[#f4c66a]/18 bg-[linear-gradient(180deg,rgba(244,198,106,0.08),rgba(0,0,0,0.22)),rgba(8,6,4,0.76)] p-6 shadow-[0_26px_90px_rgba(0,0,0,0.35)]"
              >
                <div>
                  <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">Paid artist service</p>
                  <h3 className="mt-4 text-2xl font-black uppercase tracking-[0.06em] text-white">{item.name}</h3>
                  <p className="mt-4 font-display text-4xl uppercase tracking-[0.06em] text-[#f4c66a]">{item.price}</p>
                  <p className="mt-4 text-sm font-semibold leading-6 text-stone-200">{item.audience}</p>
                  <ul className="mt-6 space-y-3 text-sm leading-6 text-stone-300">
                    {item.includes.map((feature) => (
                      <li key={feature} className="flex gap-3">
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f4c66a]" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <ActionLink href={packageContactHref}>Request Artist Services</ActionLink>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[1.5rem] border border-[#f4c66a]/20 bg-black/35 p-5">
            <p className="text-sm leading-7 text-stone-300">
              KAMDRIDI RECORDS does not guarantee fame, streams, playlist placement, record deals, sync placements,
              revenue, or commercial success. We help artists structure, package, improve, and present their music
              professionally.
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              To request artist services, send your artist name, contact info, package interest, music links, short bio,
              release timeline, budget range if comfortable, and project goals to{" "}
              <a href={packageContactHref} className="font-bold text-[#f4c66a] underline decoration-[#f4c66a]/40 underline-offset-4">
                kamdridi@proton.me
              </a>
              .
            </p>
            <div className="mt-5">
              <ActionLink href="/label/artist-services" variant="secondary">View Full Artist Services Page</ActionLink>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Label Partnerships</p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <article className="rounded-[2rem] border border-[#f4c66a]/18 bg-black/30 p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">By selection only</p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">Single Release Partnership</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">A limited label partnership for one selected single.</p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-300">
                {["one single", "12-24 month term", "limited rights", "no long-term artist lock-in", "net master revenue split defined in writing", "approved direct costs only"].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f4c66a]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <ActionLink href={submissionHref} variant="secondary">
                  Submit Your Music
                </ActionLink>
              </div>
            </article>

            <article className="rounded-[2rem] border border-[#f4c66a]/18 bg-black/30 p-6 md:p-8">
              <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">By selection only</p>
              <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">Full Label Deal</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                A selective project-based label agreement for artists or projects with strong identity and long-term
                potential.
              </p>
              <ul className="mt-5 space-y-3 text-sm leading-6 text-stone-300">
                {["one EP or one album", "clear term", "defined revenue split", "approved recoupable costs only", "optional future project only if both sides agree"].map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f4c66a]" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                <ActionLink href={submissionHref} variant="secondary">
                  Submit Your Music
                </ActionLink>
              </div>
            </article>
          </div>
        </div>
      </section>
      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <article className="rounded-[2rem] border border-[#f4c66a]/20 bg-[radial-gradient(circle_at_18%_0%,rgba(244,198,106,0.12),transparent_34%),rgba(8,6,4,0.76)] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.34)] md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Licensing / Sync</p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">Licensing and Sync Inquiries</h2>
            <p className="mt-5 text-sm leading-7 text-stone-300">
              KAMDRIDI RECORDS can review licensing and sync inquiries for confirmed songs in its artist and project catalog. All requests must be clear about usage, term, territory, media type, budget, and deadline.
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              Accepted opportunities include film, television, documentary, trailers, promos, games, podcasts, digital series, brand campaigns, and independent media projects with clear usage terms. No placements are claimed or guaranteed.
            </p>
            <p className="mt-4 text-sm leading-7 text-stone-400">Contact: <span className="font-bold text-[#f4c66a]">kamdridi@proton.me</span></p>
            <div className="mt-7">
              <ActionLink href={licensingHref} variant="secondary">Licensing Inquiry</ActionLink>
            </div>
          </article>

          <article className="rounded-[2rem] border border-[#f4c66a]/20 bg-black/35 p-6 shadow-[0_30px_100px_rgba(0,0,0,0.28)] md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">KAMDRIDI RECORDS Updates</p>
            <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.06em] text-white">Request label updates</h2>
            <p className="mt-5 text-sm leading-7 text-stone-300">
              There is no newsletter backend active yet. To request label updates, artist package information, or release news, contact KAMDRIDI RECORDS by email.
            </p>
            <div className="mt-7">
              <ActionLink href={updatesHref} variant="secondary">Request Updates</ActionLink>
            </div>
          </article>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">How Signing Works</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {signingSteps.map((step) => (
              <article key={step.title} className="rounded-[1.5rem] border border-[#f4c66a]/15 bg-[#0a0704]/72 p-6">
                <h3 className="text-lg font-black uppercase tracking-[0.06em] text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-300">{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 rounded-[2rem] border border-[#f4c66a]/20 bg-[linear-gradient(135deg,rgba(244,198,106,.1),rgba(0,0,0,.56)),#080604] p-6 shadow-[0_35px_110px_rgba(0,0,0,.4)] lg:grid-cols-[0.92fr_1.08fr] md:p-10">
          <div>
            <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Artist Submissions</p>
            <h2 className="mt-5 font-display text-4xl uppercase tracking-[0.06em] text-white md:text-6xl">Send the strongest songs</h2>
            <p className="mt-5 text-sm leading-7 text-stone-300">
              KAMDRIDI RECORDS is open to selected submissions in rock, country-rock, dark country, Americana, cinematic
              music, and strong visual music projects.
            </p>
            <div className="mt-8">
              <ActionLink href="/submit">Submit Your Music</ActionLink>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-[#f4c66a]/15 bg-black/30 p-6">
            <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">Artists should send</p>
            <ul className="mt-5 grid gap-3 text-sm leading-6 text-stone-300 sm:grid-cols-2">
              {submissionChecklist.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f4c66a]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="px-5 pb-20">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-[2rem] border border-[#f4c66a]/20 bg-black/35 p-6 md:p-8">
            <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Honest Terms</p>
            <div className="mt-5 space-y-4 text-sm leading-7 text-stone-300">
              <p>KAMDRIDI RECORDS does not guarantee streams, playlist placement, radio play, sales, bookings, income, or label signing.</p>
              <p>All artist agreements must be confirmed in writing.</p>
              <p>Artists keep their songwriting/publishing rights unless a separate written agreement says otherwise.</p>
              <p>Master ownership, revenue splits, recoupment, term length, territory, and release rights are defined in the final written agreement.</p>
              <p>Artists are encouraged to seek independent legal advice before signing any label agreement.</p>
            </div>
          </div>

          <div id="label-assistant" className="rounded-[2rem] border border-[#f4c66a]/20 bg-[radial-gradient(circle_at_16%_0%,rgba(244,198,106,0.14),transparent_34%),rgba(8,6,4,0.76)] p-4 md:p-6">
            <div className="mb-5 px-2">
              <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Label Assistant</p>
              <h2 className="mt-3 text-3xl font-black uppercase tracking-[0.06em] text-white">Questions about signing or submissions?</h2>
              <p className="mt-4 text-sm leading-7 text-stone-300">
                Ask the KAMDRIDI RECORDS Assistant about pricing, submissions, artist development packages, single
                partnerships, and label deals.
              </p>
            </div>
            <LabelAssistantChat embedded />
          </div>
        </div>
      </section>

      <LabelAssistantChat />
    </main>
  );
}
