import type { Metadata } from "next";
import { GamesPanel } from "@/components/games-panel";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "Games",
  description:
    "Launch game experiences inside the KAMDRIDI fan universe, including The Gilded Null and deeper protocol access for members."
};

export default function GamesPage() {
  return (
    <>
      <PageHero
        eyebrow="Games"
        title="Protocols, launchers, and fan-universe game access"
        description="A clean launcher interface for the interactive side of Echoes Unearthed, including The Gilded Null and deeper collector protocol access."
        image="/assets/images/band/live3.jpg"
      />
      <GamesPanel />
    </>
  );
}
