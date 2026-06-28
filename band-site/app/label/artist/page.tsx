import type { Metadata } from "next";
import { LabelArtistDashboard } from "@/label/artist/dashboard";

export const metadata: Metadata = {
  title: "Artist Dashboard",
  description: "Signed KAMDRIDI RECORDS artist release and royalty dashboard."
};

export default function LabelArtistPage() {
  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Signed Artist Portal</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] md:text-7xl">
          Artist
          <br />
          Dashboard
        </h1>
        <div className="mt-10">
          <LabelArtistDashboard />
        </div>
      </div>
    </main>
  );
}
