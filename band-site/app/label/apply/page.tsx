import type { Metadata } from "next";
import { LabelApplyPortal } from "@/label/public/apply";

export const metadata: Metadata = {
  title: "Apply to KAMDRIDI Records",
  description: "Submit music to KAMDRIDI RECORDS for label review."
};

export default function LabelApplyPage() {
  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Artist Application</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] md:text-7xl">
          Apply to
          <br />
          KAMDRIDI RECORDS
        </h1>
        <p className="mt-6 text-sm leading-7 text-stone-300">
          Submit two demos, your artist links, and the digital agreement. In simulation mode the submission goes directly to Pending Review;
          when Stripe is configured, checkout collects the label submission fee first.
        </p>
        <div className="mt-10 label-panel">
          <LabelApplyPortal />
        </div>
      </div>
    </main>
  );
}
