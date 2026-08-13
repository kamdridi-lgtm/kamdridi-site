import Image from "next/image";
import { GlassCard, Section, SectionHeading } from "@/components/ui";
import { SignalRadio } from "@/components/signal-radio";
import { albumTimeline, featuredVideo, streamingLinks, warMachinesCover } from "@/data/site";

const galleryImages = [
  {
    src: "/assets/images/gallery/p03_portrait_mic.jpg",
    alt: "KAMDRIDI portrait holding a microphone"
  },
  {
    src: "/assets/images/gallery/p04_portrait_leather.jpg",
    alt: "KAMDRIDI full-length studio portrait"
  },
  {
    src: "/assets/images/band/live_stage.jpg",
    alt: "KAMDRIDI performing on an arena stage"
  },
  {
    src: "/assets/images/tour/tour-crowd-stage.png",
    alt: "KAMDRIDI facing a concert crowd"
  },
  {
    src: "/assets/images/press-bio-bg.jpg",
    alt: "KAMDRIDI press archive collage"
  },
  {
    src: "/assets/images/band/photos_bg.jpg",
    alt: "KAMDRIDI campaign photograph archive"
  }
];

function SpotifyWatermark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full fill-current">
      <path d="M12 1.8a10.2 10.2 0 1 0 0 20.4 10.2 10.2 0 0 0 0-20.4Zm4.68 14.72a.64.64 0 0 1-.88.2c-2.42-1.48-5.46-1.81-9.04-.99a.64.64 0 0 1-.28-1.25c3.92-.89 7.28-.51 9.99 1.15.3.19.4.58.21.89Zm1.25-2.77a.8.8 0 0 1-1.1.26c-2.77-1.7-7-2.2-10.28-1.2a.8.8 0 0 1-.47-1.53c3.74-1.14 8.4-.58 11.59 1.37.38.23.5.72.26 1.1Zm.11-2.89C14.72 8.89 9.25 8.7 6.08 9.67a.96.96 0 1 1-.56-1.84c3.64-1.1 9.68-.88 13.5 1.4a.96.96 0 0 1-.98 1.64Z" />
    </svg>
  );
}

function AppleMusicWatermark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full fill-current">
      <path d="M16.7 2.5c.08.9-.24 1.78-.92 2.53-.7.77-1.62 1.22-2.5 1.15-.1-.86.27-1.78.9-2.48.7-.78 1.8-1.35 2.52-1.2ZM19.55 17.35c-.4.94-.6 1.36-1.12 2.18-.72 1.1-1.73 2.47-2.98 2.48-1.1.02-1.39-.72-2.9-.71-1.5 0-1.82.73-2.92.71-1.25-.01-2.2-1.25-2.92-2.36-2-3.08-2.21-6.69-.98-8.61.88-1.36 2.26-2.16 3.56-2.16 1.32 0 2.15.73 3.24.73 1.06 0 1.7-.73 3.23-.73 1.15 0 2.38.63 3.25 1.72-2.85 1.56-2.39 5.62.54 6.75Z" />
    </svg>
  );
}

function AmazonMusicWatermark() {
  return (
    <svg viewBox="0 0 260 92" aria-hidden="true" className="h-full w-full fill-current">
      <text x="4" y="48" fontFamily="Arial, sans-serif" fontSize="34" fontWeight="700">
        amazon music
      </text>
      <path
        d="M22 66c42 20 102 20 145-2M155 61l14 2-7 11"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="5"
      />
    </svg>
  );
}

function DeezerWatermark() {
  return (
    <svg viewBox="0 0 160 92" aria-hidden="true" className="h-full w-full">
      <g>
        <path d="M6 60h20v14H6zM6 42h20v14H6z" fill="#a238ff" />
        <path d="M32 50h20v24H32zM32 30h20v16H32z" fill="#ec4c9a" />
        <path d="M58 38h20v36H58zM58 18h20v16H58z" fill="#ff6b56" />
        <path d="M84 46h20v28H84zM84 28h20v14H84z" fill="#ffb84a" />
        <path d="M110 54h20v20h-20zM110 38h20v12h-20z" fill="#f4dc44" />
      </g>
    </svg>
  );
}

const streamWatermarks: Record<string, { logo: React.ReactNode; className: string }> = {
  Spotify: {
    logo: <SpotifyWatermark />,
    className: "-bottom-10 -right-8 h-40 w-40 text-[#1ed760] opacity-[0.13]"
  },
  "Apple Music": {
    logo: <AppleMusicWatermark />,
    className: "-bottom-11 -right-7 h-40 w-40 text-[#f5f5f7] opacity-[0.11]"
  },
  "Amazon Music": {
    logo: <AmazonMusicWatermark />,
    className: "-bottom-3 -right-14 h-36 w-64 text-[#25a9e0] opacity-[0.13]"
  },
  Deezer: {
    logo: <DeezerWatermark />,
    className: "-bottom-7 -right-10 h-40 w-56 opacity-[0.14]"
  }
};

export function MusicHub() {
  return (
    <>
      <div className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/assets/images/music/signal-radio-background.jpg"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-black/35" />

        <Section id="signal-radio" className="pt-8 md:pt-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-[#f4c66a]">
                  Full album broadcast
                </p>
                <h2 className="mt-3 max-w-3xl font-display text-4xl uppercase leading-none tracking-[0.06em] text-white md:text-5xl">
                  Catch the KAMDRIDI signal
                </h2>
              </div>
              <p className="music-copy max-w-md text-sm leading-7 text-stone-300 sm:text-base">
                Power on for full Echoes Unearthed tracks and a live spectrum driven by the music.
              </p>
            </div>
            <SignalRadio />
          </div>
        </Section>
      </div>

      <div className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/assets/images/music/streaming-platforms-background.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(2,2,2,0.3),rgba(2,2,2,0.46)_48%,rgba(2,2,2,0.25))]" />
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(2,2,2,0.38),rgba(2,2,2,0.12)_45%,rgba(2,2,2,0.5))]" />

        <Section id="listen-now">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <GlassCard className="overflow-hidden bg-black/45 p-0">
              <div className="grid h-full gap-0 md:grid-cols-[0.54fr_0.46fr]">
                <div className="relative min-h-80">
                  <Image src={warMachinesCover} alt="War Machines single cover" fill className="object-cover" />
                </div>
                <div className="flex flex-col justify-center p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.45em] text-[#f4c66a]">
                    Listen Now
                  </p>
                  <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.06em] text-white">
                    War Machines
                  </h2>
                  <p className="mt-3 text-xs font-bold uppercase tracking-[0.32em] text-[#f4c66a]">
                    Available Now
                  </p>
                  <p className="music-copy mt-5 text-sm leading-7 text-stone-300">
                    Stream the current KAMDRIDI single across the official platform links below.
                  </p>
                </div>
              </div>
            </GlassCard>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {streamingLinks.map((link) => {
                const watermark = streamWatermarks[link.label];

                return (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group relative isolate flex min-h-36 items-center overflow-hidden rounded-[28px] border border-white/10 bg-black/45 p-6 shadow-[0_35px_80px_rgba(0,0,0,0.4)] backdrop-blur-md transition hover:-translate-y-1 hover:border-[#f4c66a]/40"
                  >
                    {watermark ? (
                      <span
                        className={`pointer-events-none absolute -z-10 ${watermark.className}`}
                        aria-hidden="true"
                      >
                        {watermark.logo}
                      </span>
                    ) : null}
                    <div className="relative z-10">
                      <p className="text-xs font-semibold uppercase tracking-[0.38em] text-[#f4c66a]">
                        {link.label}
                      </p>
                      <p className="mt-2 text-sm text-white">{link.note}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </Section>
      </div>

      <div className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/assets/images/music/music-video-background.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[82%_center] md:object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-black/46" />

        <Section id="videos">
          <SectionHeading
            eyebrow="Music and Video"
            title="The sound and image core of Echoes Unearthed"
            description="A premium music hub for official audio, visual world-building, gallery imagery, and the release timeline that anchors the KAMDRIDI universe."
          />
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <GlassCard className="overflow-hidden bg-black/50 p-0">
              <div className="w-full aspect-video">
                <iframe
                  className="h-full w-full rounded-xl"
                  src={featuredVideo.embedUrl}
                  title={featuredVideo.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </GlassCard>
            <GlassCard className="flex flex-col justify-center bg-black/50">
              <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Now playing</p>
              <h2 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.06em] text-white">
                {featuredVideo.title}
              </h2>
              <p className="music-copy mt-5 text-sm leading-8 text-stone-300">
                {featuredVideo.description}
              </p>
            </GlassCard>
          </div>
        </Section>
      </div>

      <div className="relative isolate overflow-hidden border-b border-white/10">
        <Image
          src="/assets/images/music/gallery-archive-background.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[18%_center] md:object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-black/56" />

        <Section id="gallery">
          <SectionHeading
            eyebrow="Gallery"
            title="Frames from the campaign world"
            description="Photography, live capture, and artist imagery presented as a visual archive instead of a generic media dump."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {galleryImages.map((image) => (
              <GlassCard key={image.src} className="overflow-hidden bg-black/45 p-0">
                <div className="relative h-80">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              </GlassCard>
            ))}
          </div>
        </Section>
      </div>

      <div className="relative isolate overflow-hidden">
        <Image
          src="/assets/images/music/discography-vault-background.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover object-[78%_center] md:object-center"
          aria-hidden="true"
        />
        <div className="absolute inset-0 -z-10 bg-black/54" />

        <Section id="discography">
          <SectionHeading
            eyebrow="Discography"
            title="Albums, singles, and timeline"
            description="The release history underneath the campaign, from the first fragments to the full Echoes Unearthed rollout."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {albumTimeline.map((album) => (
              <GlassCard
                key={album.title}
                className="grid gap-6 bg-black/50 md:grid-cols-[0.45fr_0.55fr]"
              >
                <div className="relative h-64 overflow-hidden rounded-2xl">
                  <Image
                    src={album.art}
                    alt={album.title}
                    fill
                    sizes="(max-width: 767px) 100vw, 23vw"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">
                    {album.year} · {album.type}
                  </p>
                  <h3 className="mt-4 font-display text-3xl uppercase leading-none tracking-[0.05em] text-white">
                    {album.title}
                  </h3>
                  <p className="music-copy mt-4 text-sm leading-7 text-stone-300">
                    {album.description}
                  </p>
                </div>
              </GlassCard>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}
