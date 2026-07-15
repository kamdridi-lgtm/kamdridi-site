import type { Metadata } from "next";
import { Cormorant_Garamond, EB_Garamond } from "next/font/google";
import {
  AudioGuidePlayer,
  LostRequiemHero,
  LostRequiemManifesto,
  MuseumLayout,
  MuseumProgress
} from "@/components/lost-requiem";
import styles from "@/components/lost-requiem/lost-requiem.module.css";

const displayFont = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--lr-display-font"
});

const bodyFont = EB_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--lr-body-font"
});

export const metadata: Metadata = {
  title: "The Lost Requiem",
  description:
    "Eine digitale Museumserfahrung rund um The Lost Requiem, eine Originalkomposition von K. Dridi.",
  alternates: {
    canonical: "/the-lost-requiem"
  },
  openGraph: {
    title: "The Lost Requiem | K. Dridi",
    description:
      "Eine zeitgenössische Komposition, inszeniert im Geist eines Wiener Musikmanuskripts von 1791.",
    url: "/the-lost-requiem",
    type: "website"
  }
};

export default function LostRequiemPage() {
  return (
    <div className={`${styles.routeScope} ${displayFont.variable} ${bodyFont.variable}`}>
      <MuseumLayout>
        <MuseumProgress />
        <main id="lost-requiem-content" className={styles.main}>
          <LostRequiemHero />
          <LostRequiemManifesto />
        </main>
        <AudioGuidePlayer />
      </MuseumLayout>
    </div>
  );
}
