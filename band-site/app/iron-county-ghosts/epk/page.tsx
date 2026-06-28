import type { Metadata } from "next";
import Link from "next/link";
import { getAiArtist } from "@/data/ai-artists";

export const metadata: Metadata = {
  title: "EPK | IRON COUNTY GHOSTS",
  description:
    "Electronic press kit for IRON COUNTY GHOSTS, the first official KAMDRIDI RECORDS project."
};

const epkHero = "/assets/images/label/iron-county-ghosts/epk-band-closeup.png";
const contactEmail = "kamdridi@proton.me";

const memberDescriptions: Record<string, string> = {
  "June Marlowe":
    "Lead vocal and frontwoman. Young, powerful, direct, and built for the center of the project.",
  "Caleb Rusk": "Baritone backing vocal and acoustic guitar with outlaw storyteller energy.",
  "Eli Cross": "Electric guitar, pedal steel atmosphere, and dark country-rock textures.",
  "The Ghost": "Drums, low toms, chains, church bells, and haunted rhythm design."
};

const assets = [
  { label: "Official EPK portrait", src: epkHero },
  { label: "Wide band portrait", src: "/assets/images/label/iron-county-ghosts/official-band-portrait-wide.png" },
  { label: "Live performance", src: "/assets/images/label/iron-county-ghosts/live-arena-performance.png" },
  { label: "Release cover", src: "/assets/images/label/iron-county-ghosts/dust-on-the-altar-cover.png" }
];

export default function IronCountyGhostsEpkPage() {
  const artist = getAiArtist("iron-county-ghosts")!;
  const single = artist.releases.find((release) => release.audioUrl);

  return (
    <main className="bg-[#080503] px-5 pb-24 pt-28 text-white md:pt-36">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <figure className="overflow-hidden rounded-[1.8rem] border border-[#d9a95d]/25 bg-[#120b06] p-3 shadow-[0_35px_110px_rgba(0,0,0,.55)]">
          <img
            src={epkHero}
            alt="IRON COUNTY GHOSTS official EPK portrait"
            className="max-h-[82vh] w-full rounded-[1.35rem] object-cover object-center"
          />
        </figure>

        <div className="flex flex-col justify-center">
          <p className="text-xs uppercase tracking-[0.34em] text-[#d9a95d]">Electronic Press Kit</p>
          <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.07em] md:text-7xl">
            IRON COUNTY GHOSTS
          </h1>
          <p className="mt-6 text-xl leading-9 text-[#d9a95d]">{artist.slogan}</p>
          <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
            IRON COUNTY GHOSTS is the first official KAMDRIDI RECORDS project: dark country, outlaw Americana,
            cinematic western rock, and southern gothic storytelling built around June Marlowe's lead voice.
          </p>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-400">
            The project is fictional and AI-assisted, created and produced by KAMDRIDI RECORDS as part of the label's
            artist universe. Public use should credit the project clearly and preserve the label context.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/iron-county-ghosts/music"
              className="rounded-full bg-[#d9a95d] px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-black"
            >
              Listen
            </Link>
            <Link
              href="/iron-county-ghosts/photos"
              className="rounded-full border border-[#d9a95d]/40 px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-[#d9a95d]"
            >
              Photos
            </Link>
            <a
              href={`mailto:${contactEmail}?subject=IRON%20COUNTY%20GHOSTS%20EPK%20Inquiry`}
              className="rounded-full border border-stone-500/35 px-7 py-4 text-xs font-black uppercase tracking-[0.2em] text-stone-200"
            >
              Contact Label
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-6 lg:grid-cols-[0.65fr_0.35fr]">
        <div className="rounded-[1.7rem] border border-[#d9a95d]/20 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Official Bio</p>
          <div className="mt-5 space-y-5 text-base leading-8 text-stone-300">
            <p>
              {artist.shortBio}
            </p>
            <p>
              The sound is built for dusty roads, dead towns, whiskey bars, abandoned churches, revenge, redemption,
              and ghosts that never stop following you.
            </p>
          </div>
        </div>

        <aside className="rounded-[1.7rem] border border-[#d9a95d]/20 bg-[#120b06] p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Contact</p>
          <p className="mt-5 text-sm leading-7 text-stone-300">
            Press, licensing, collaborations, and label inquiries:
          </p>
          <a
            href={`mailto:${contactEmail}?subject=IRON%20COUNTY%20GHOSTS%20Inquiry`}
            className="mt-5 block break-all text-lg font-bold text-[#d9a95d]"
          >
            {contactEmail}
          </a>
        </aside>
      </section>

      <section className="mx-auto mt-14 max-w-7xl rounded-[1.7rem] border border-[#d9a95d]/20 bg-black/35 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Quick Facts</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            ["Artist", artist.name],
            ["Label", "KAMDRIDI RECORDS"],
            ["Current release", single?.title ?? "Dust on the Altar"],
            ["Release date", single?.releaseDate ?? "May 23, 2026"],
            ["Genre", "Dark Country / Outlaw Americana / Country-Rock"],
            ["Status", "First official KAMDRIDI RECORDS project"]
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-[#d9a95d]/15 bg-black/25 p-5">
              <p className="text-[10px] uppercase tracking-[0.24em] text-[#d9a95d]">{label}</p>
              <p className="mt-2 font-bold text-white">{value}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl">
        <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Lineup</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {artist.members.map((member) => (
            <div key={member.name} className="rounded-[1.4rem] border border-[#d9a95d]/15 bg-black/25 p-5">
              <p className="text-lg font-bold text-white">{member.name}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.18em] text-[#d9a95d]">{member.role}</p>
              <p className="mt-4 text-sm leading-7 text-stone-300">{memberDescriptions[member.name]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 max-w-7xl">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Press Images</p>
          <Link
            href="/iron-county-ghosts/photos"
            className="text-xs uppercase tracking-[0.2em] text-stone-500 hover:text-[#d9a95d]"
          >
            Full gallery
          </Link>
        </div>
        <div className="mt-5 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {assets.map((item) => (
            <figure key={item.src} className="rounded-[1.7rem] border border-[#d9a95d]/20 bg-[#120b06] p-3">
              <img
                src={item.src}
                alt={item.label}
                className="aspect-[4/5] w-full rounded-[1.25rem] object-cover object-center"
              />
              <figcaption className="p-4 text-xs uppercase tracking-[0.2em] text-[#d9a95d]">{item.label}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-14 grid max-w-7xl gap-6 md:grid-cols-2">
        <div className="rounded-[1.7rem] border border-[#d9a95d]/20 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Audio</p>
          <p className="mt-4 break-all text-sm text-stone-300">https://kamdridi.com/audio/dust-on-the-altar.mp3</p>
        </div>
        <div className="rounded-[1.7rem] border border-[#d9a95d]/20 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Video Assets</p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Official videos, live teasers, and single visuals will be organized on the Videos page as they are released.
          </p>
          <Link
            href="/iron-county-ghosts/videos"
            className="mt-5 inline-flex rounded-full bg-[#d9a95d] px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-black"
          >
            View Videos
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-6 max-w-7xl">
        <div className="rounded-[1.7rem] border border-[#d9a95d]/20 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Use Notes</p>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Do not miscredit the project. Use IRON COUNTY GHOSTS for artist credit and KAMDRIDI RECORDS for label or
            press contact.
          </p>
        </div>
      </section>
    </main>
  );
}
