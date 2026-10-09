import type { Metadata } from "next";
import Link from "next/link";
import { getAiArtist } from "@/data/ai-artists";

export const metadata: Metadata = {
  title: "Contact | IRON COUNTY GHOSTS",
  description: "Booking and label contact for IRON COUNTY GHOSTS."
};

export default function IronCountyGhostsContactPage() {
  const artist = getAiArtist("iron-county-ghosts")!;

  return (
    <main className="px-5 pb-24 pt-28 md:pt-36">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.34em] text-[#d9a95d]">Booking / Label Contact</p>
          <h1 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.07em] md:mt-5 md:text-7xl">
            Contact
          </h1>
          <p className="mt-7 max-w-2xl text-base leading-8 text-stone-300">
            The band is represented by KAMDRIDI RECORDS. For booking, press, licensing, and label questions,
            use the official KAMDRIDI contact route.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/iron-county-ghosts/epk" className="rounded-full bg-[#d9a95d] px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-black">
              Back to EPK
            </Link>
            <Link href="/iron-county-ghosts/music" className="rounded-full border border-[#d9a95d]/35 px-8 py-4 text-xs font-black uppercase tracking-[0.22em] text-[#d9a95d]">
              Listen to Dust on the Altar
            </Link>
          </div>
          <p className="mt-8 text-sm leading-7 text-stone-500">
            Booking contact coming soon. For now, contact KAMDRIDI RECORDS through the official label channels.
          </p>
        </div>
        <div className="rounded-[1.8rem] border border-[#d9a95d]/20 bg-[#120b06] p-3 shadow-[0_35px_110px_rgba(0,0,0,.5)]">
          <img
            src={artist.images.darkChurch}
            alt="Live performance - side stage angle"
            className="max-h-[72vh] w-full rounded-[1.35rem] object-contain object-top"
          />
        </div>
      </section>
    </main>
  );
}
