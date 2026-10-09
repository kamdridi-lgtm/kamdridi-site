import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "IRON COUNTY GHOSTS Videos | Live Videos, Music Videos & Visuals",
  description:
    "Watch official IRON COUNTY GHOSTS videos, live teasers, music videos, single visuals, trailers, and KAMDRIDI RECORDS visual releases."
};

type VideoStatus = "Coming soon" | "Available";

type VideoCard = {
  title: string;
  type: string;
  status: VideoStatus;
  url: string | null;
  thumbnail: string;
  description: string;
  position?: string;
};

const featuredVideo: VideoCard = {
  title: "Featured Video",
  type: "Official Video",
  status: "Coming soon",
  url: null,
  thumbnail: "/assets/images/label/iron-county-ghosts/epk-band-closeup.png",
  description: "Official IRON COUNTY GHOSTS video content will appear here as videos are released.",
  position: "center"
};

const officialMusicVideos: VideoCard[] = [
  {
    title: "Dust on the Altar - Official Video",
    type: "Official Music Video",
    status: "Coming soon",
    url: null,
    thumbnail: "/assets/images/label/iron-county-ghosts/dust-on-the-altar-cover.png",
    description: "Official video slot reserved for the lead single.",
    position: "center"
  },
  {
    title: "Future Single - Official Video",
    type: "Official Music Video",
    status: "Coming soon",
    url: null,
    thumbnail: "/assets/images/label/iron-county-ghosts/official-band-portrait-wide.png",
    description: "Future single video slot reserved for the next campaign.",
    position: "center"
  },
  {
    title: "Archive Rework - Official Video",
    type: "Archive Rework",
    status: "Coming soon",
    url: null,
    thumbnail: "/assets/images/label/iron-county-ghosts/barn-press-portrait.png",
    description: "Visual slot reserved for KAMDRIDI RECORDS Archive Reworks.",
    position: "center"
  }
];

const liveVideos: VideoCard[] = [
  {
    title: "Dust on the Altar - Live Teaser",
    type: "Live Video / Teaser",
    status: "Coming soon",
    url: null,
    thumbnail: "/assets/images/label/iron-county-ghosts/live-arena-performance.png",
    description: "Performance video slot reserved for upcoming IRON COUNTY GHOSTS live footage.",
    position: "center"
  },
  {
    title: "Live Performance - Outdoor",
    type: "Performance",
    status: "Coming soon",
    url: null,
    thumbnail: "/assets/images/label/iron-county-ghosts/outdoor-festival-performance.png",
    description: "Outdoor performance slot reserved for future live video content.",
    position: "center top"
  },
  {
    title: "Live Performance - Barn Session",
    type: "Performance",
    status: "Coming soon",
    url: null,
    thumbnail: "/assets/images/label/iron-county-ghosts/barn-press-portrait.png",
    description: "Barn session slot reserved for future stripped-down performance footage.",
    position: "center"
  }
];

const singleVisuals: VideoCard[] = [
  {
    title: "Dust on the Altar - Visual Teaser",
    type: "Single Visual",
    status: "Coming soon",
    url: null,
    thumbnail: "/assets/images/label/iron-county-ghosts/live-crowd-shot.png",
    description: "Short visual teaser slot for release campaign content.",
    position: "center"
  },
  {
    title: "Our Lost Dreams - Archive Rework Visual",
    type: "Archive Rework Visual",
    status: "Coming soon",
    url: null,
    thumbnail: "/assets/images/label/iron-county-ghosts/official-band-portrait-wide.png",
    description: "Visual slot reserved for a future Archive Reworks release.",
    position: "center"
  },
  {
    title: "Next Single - Trailer",
    type: "Trailer",
    status: "Coming soon",
    url: null,
    thumbnail: "/assets/images/label/iron-county-ghosts/band-stage-spotlight.png",
    description: "Trailer slot reserved for the next single campaign.",
    position: "center top"
  }
];

function VideoCardView({ video }: { video: VideoCard }) {
  const objectPosition = video.position ?? "center";

  return (
    <article className="overflow-hidden rounded-[1.45rem] border border-[#d9a95d]/20 bg-[#120b06]">
      <div className="relative aspect-video bg-black">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="h-full w-full object-cover brightness-[1.06] contrast-[1.03]"
          style={{ objectPosition }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/72 via-black/10 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-[#d9a95d]/35 bg-black/60 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#d9a95d]">
          {video.status}
        </span>
      </div>
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[#d9a95d]">{video.type}</p>
        <h3 className="mt-3 text-lg font-black uppercase tracking-[0.04em] text-white">{video.title}</h3>
        <p className="mt-3 text-sm leading-7 text-stone-400">{video.description}</p>
        {video.url ? (
          <a
            href={video.url}
            className="mt-5 inline-flex rounded-full bg-[#d9a95d] px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-black"
          >
            Watch Video
          </a>
        ) : null}
      </div>
    </article>
  );
}

function VideoSection({ title, videos }: { title: string; videos: VideoCard[] }) {
  return (
    <section className="mx-auto mt-12 max-w-7xl">
      <h2 className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">{title}</h2>
      <div className="mt-5 grid gap-5 md:grid-cols-3">
        {videos.map((video) => (
          <VideoCardView key={video.title} video={video} />
        ))}
      </div>
    </section>
  );
}

export default function IronCountyGhostsVideosPage() {
  return (
    <main className="bg-[#080503] px-5 pb-24 pt-28 text-white md:pt-36">
      <section className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.34em] text-[#d9a95d]">KAMDRIDI RECORDS visuals</p>
        <h1 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.07em] md:text-7xl">
          Videos
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-stone-300">
          Official music videos, live teasers, single visuals, trailers, and performance footage from IRON COUNTY
          GHOSTS.
        </p>
      </section>

      <section className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <VideoCardView video={featuredVideo} />
        <div className="flex flex-col justify-center rounded-[1.45rem] border border-[#d9a95d]/20 bg-black/35 p-6">
          <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Featured Video</p>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-[0.04em] text-white">
            Coming soon
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-300">
            Official IRON COUNTY GHOSTS video content will appear here as videos are released. No fake embeds or
            placeholder watch links are used.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/iron-county-ghosts/music"
              className="rounded-full bg-[#d9a95d] px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-black"
            >
              Back to Music
            </Link>
            <Link
              href="/iron-county-ghosts/contact"
              className="rounded-full border border-[#d9a95d]/35 px-5 py-3 text-[10px] font-black uppercase tracking-[0.18em] text-[#d9a95d]"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>

      <VideoSection title="Official Music Videos" videos={officialMusicVideos} />
      <VideoSection title="Live Videos" videos={liveVideos} />
      <VideoSection title="Single Visuals & Teasers" videos={singleVisuals} />

      <section className="mx-auto mt-12 max-w-7xl rounded-[1.45rem] border border-[#d9a95d]/20 bg-black/35 p-6">
        <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Future video updates</p>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-400">
          Videos can be added as official links become available through KAMDRIDI RECORDS.
        </p>
      </section>
    </main>
  );
}
