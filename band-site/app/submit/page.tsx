import type { Metadata } from "next";
import Link from "next/link";
import { KamdridiRecordsLogo } from "@/components/label/KamdridiRecordsLogo";

export const metadata: Metadata = {
  title: "KAMDRIDI RECORDS — Artist Services",
  description: "KAMDRIDI RECORDS is not currently accepting unsolicited music submissions. Professional artist-service inquiries may be reviewed selectively.",
  robots: { index: false, follow: false }
};

const packageHref = "mailto:kamdridi@proton.me?subject=Artist Development Package - KAMDRIDI RECORDS";
const licensingHref = "mailto:management@kamdridi.com?subject=Licensing Inquiry - KAMDRIDI RECORDS";

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
      <section className="mx-auto max-w-6xl">
        <KamdridiRecordsLogo size="section" priority className="mx-0" />
        <h1 className="mt-8 font-display text-5xl uppercase leading-none tracking-[0.06em] md:text-7xl">Artist Services</h1>
        <p className="mt-6 max-w-4xl text-lg leading-8 text-stone-300">
          KAMDRIDI RECORDS is not currently accepting unsolicited demos or general music submissions.
        </p>
        <p className="mt-4 max-w-4xl text-sm leading-7 text-stone-400">
          Select professional inquiries may still be reviewed when they concern a clearly defined paid artist-development service, licensing matter, or existing business relationship.
        </p>

        <div className="mt-9 flex flex-wrap gap-4">
          <ActionLink href="/label/artist-services" primary>View Artist Services</ActionLink>
          <ActionLink href={packageHref}>Professional Service Inquiry</ActionLink>
          <ActionLink href={licensingHref}>Licensing Inquiry</ActionLink>
        </div>
      </section>

      <section className="mx-auto mt-12 grid max-w-6xl gap-5 md:grid-cols-2">
        <article className="rounded-[2rem] border border-[#f4c66a]/18 bg-black/30 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">For artists</p>
          <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.06em] text-white">No unsolicited demos</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">Do not send music for general label consideration unless KAMDRIDI RECORDS has specifically invited the submission.</p>
        </article>
        <article className="rounded-[2rem] border border-[#f4c66a]/18 bg-black/30 p-6 md:p-8">
          <p className="text-xs uppercase tracking-[0.34em] text-[#f4c66a]">For industry</p>
          <h2 className="mt-4 text-2xl font-black uppercase tracking-[0.06em] text-white">KAM DRIDI professional access</h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">Radio, sync, festival, press and booking professionals should use the official industry hub.</p>
          <div className="mt-7"><ActionLink href="/industry">Open Industry Hub</ActionLink></div>
        </article>
      </section>
    </main>
  );
}
