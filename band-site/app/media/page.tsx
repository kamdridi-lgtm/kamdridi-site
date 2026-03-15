import type { Metadata } from "next";
import { MusicHub } from "@/components/music-hub";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Media",
  description:
    "Watch KAMDRIDI videos, browse imagery, and explore the Echoes Unearthed discography and visual world."
};

export default function MediaPage() {
  return (
    <>
      <PageHero
        eyebrow="Music"
        title="Videos, gallery, albums, and discography"
        description="A full media hub for official visual assets, photo galleries, album art, embedded video playback, and the wider Echoes Unearthed world."
        image="/assets/images/gallery/p01_hero.jpg"
      />
      <MusicHub />
    </>
  );
}
