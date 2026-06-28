import type { Metadata } from "next";
import Link from "next/link";
import { KamdridiRecordsLogo } from "@/components/label/KamdridiRecordsLogo";

export const metadata: Metadata = {
  title: "Submit Music to KAMDRIDI RECORDS",
  description: "Submission instructions for artists and bands who want to contact KAMDRIDI RECORDS."
};

const submissionHref = "mailto:kamdridi@proton.me?subject=Artist Submission - KAMDRIDI RECORDS";
const packageHref = "mailto:kamdridi@proton.me?subject=Artist Development Package - KAMDRIDI RECORDS";
const licensingHref = "mailto:kamdridi@proton.me?subject=Licensing Inquiry - KAMDRIDI RECORDS";

const submissionItems = [
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

function ActionLink({ href, children, primary = false }: { href: string; children: React.ReactNode; primary?: boolean }) {
  const className = primary
    ? "inline-flex justify-center rounded-full bg-[#f4c66a] px-7 py-4 text-center text-xs font-black uppercase tracking-[0.18em] text-black transition hover:bg-[#ffe09a]"
    : "inline-flex justify-center rounded-full border border-[#f4c66a]/35 px-7 py-4 text-center text-xs font-black uppercase tracking-[0.18em] text-[#f4c66a] transition hover:border-[#f4c66a] hover:bg-[#f4c66a]/10";

  if (href.startsWith("/")) return <Link href={href} className={className}>{children}</Link>;
  return <a href={href} className={className}>{children}</a>;
}

export default function SubmitPage() {
  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <section className="mx-auto max-w-7xl">
        <KamdridiRecordsLogo size="section" priority className="mx-0" />
        <h1 className="mt-8 font-display text-5xl uppercase leading-none tracking-[0.06em] md:text-7xl">Submit Music</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">
          Send focused material for review, release planning, artist services, or possible label development.
        </p>
        <div className="mt-9 flex flex-wrap gap-4">
          <ActionLink href={submissionHref} primary>Submit Your Music</ActionLink>
          <ActionLink href="/label/artist-services">Artist Services</ActionLink>
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <article className="rounded-[2rem] border border-[#f4c66a]/20 bg-[radial-gradient(circle_at_18%_0%,rgba(244,198,106,0.12),transparent_34%),rgba(8,6,4,0.78)] p-6 md:p-8">
          <h2 className="text-3xl font-black uppercase tracking-[0.06em] text-white">What to send</h2>
          <ul className="mt-6 grid gap-3 text-sm leading-7 text-stone-300 sm:grid-cols-2">
            {submissionItems.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#f4c66a]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-[2rem] border border-[#f4c66a]/20 bg-black/35 p-6 md:p-8">
          <h2 className="text-3xl font-black uppercase tracking-[0.06em] text-white">How review works</h2>
          <div className="mt-6 space-y-4 text-sm leading-7 text-stone-300">
            <p>Submit if you have serious songs, clear creative direction, and realistic expectations. KAMDRIDI RECORDS is a better fit for artists who communicate clearly, organize their materials, and work from written terms.</p>
            <p>Submissions are reviewed internally. If there may be a fit, KAMDRIDI RECORDS may request more information, schedule a call, discuss a paid artist development package, or review a selected partnership path.</p>
            <p>Not every submission will receive a detailed review or offer. KAMDRIDI RECORDS does not guarantee fame, streams, playlist placement, record deals, sync placements, revenue, or commercial success.</p>
            <p>Nothing starts until both sides agree in writing.</p>
          </div>
        </article>
      </section>

      <section className="mx-auto mt-12 grid max-w-7xl gap-5 md:grid-cols-2">
        <article className="rounded-[2rem] border border-[#f4c66a]/18 bg-black/30 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Artist development</p>
          <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.06em] text-white">Need release support?</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">Ask about Starter, Pro, or Premium/Executive artist services for release structure, presentation, rollout planning, and creative direction.</p>
          <div className="mt-7"><ActionLink href={packageHref}>Request Artist Services</ActionLink></div>
        </article>
        <article className="rounded-[2rem] border border-[#f4c66a]/18 bg-black/30 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">Licensing / Sync</p>
          <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.06em] text-white">Media inquiries</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">For film, trailer, game, advertising, and visual media opportunities, contact KAMDRIDI RECORDS directly.</p>
          <div className="mt-7"><ActionLink href={licensingHref}>Licensing Inquiry</ActionLink></div>
        </article>
      </section>
    </main>
  );
}
