import type { Metadata } from "next";
import { MusicHub } from "@/components/music-hub";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Music",
  description:
    "Explore the official KAMDRIDI music hub with video, gallery, discography, and Echoes Unearthed campaign content."
};

export default function MusicPage() {
  return (
    <>
      <PageHero
        eyebrow="Music"
        title="Echoes Unearthed in sound, image, and atmosphere"
        description="The official music hub for KAMDRIDI with embedded video, gallery imagery, release history, and the visual world around the album."
        image="/assets/images/gallery/p01_hero.jpg"
      />
      <MusicHub />
    </>
  );
}
