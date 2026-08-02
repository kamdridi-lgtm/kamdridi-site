"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const releases = [
  {
    title: "Echoes Unearthed",
    image: "/assets/images/releases/echoes-unearthed-cover.jpg",
    href: "#listen-now"
  },
  {
    title: "War Machines — Japan Edition",
    image: "/assets/images/war-machines-jp-cover.png",
    href: "/app/war-machines-jp"
  },
  {
    title: "Salieri's Hands",
    image: "/assets/images/salieris-hands/partition-card.png",
    href: "/releases/salieris-hands"
  },
  {
    title: "ECHOES UN LIVE IN BRASIL",
    image: "/echoes-un-live-in-brasil/assets/images/front-cover.webp",
    href: "/releases/echoes-un-live-in-brasil"
  }
] as const;

const ROTATION_MS = 4800;

export function HomeReleaseCoverCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeRelease = releases[activeIndex];

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let intervalId: number | undefined;

    const stopRotation = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    const startRotation = () => {
      stopRotation();
      if (!motionQuery.matches) {
        intervalId = window.setInterval(() => {
          setActiveIndex((current) => (current + 1) % releases.length);
        }, ROTATION_MS);
      }
    };

    startRotation();
    motionQuery.addEventListener("change", startRotation);

    return () => {
      stopRotation();
      motionQuery.removeEventListener("change", startRotation);
    };
  }, []);

  return (
    <div data-home-release-carousel>
      <div className="relative aspect-square overflow-hidden border border-[#d08a43]/35 bg-black shadow-[0_35px_120px_rgba(0,0,0,0.68)]">
        {releases.map((release, index) => (
          <Image
            key={release.title}
            src={release.image}
            alt={index === activeIndex ? release.title + " cover" : ""}
            aria-hidden={index !== activeIndex}
            fill
            loading="eager"
            sizes="(max-width: 640px) 190px, (max-width: 1024px) 250px, 300px"
            className={
              "object-cover transition-opacity duration-1000 motion-reduce:transition-none " +
              (index === activeIndex ? "opacity-100" : "opacity-0")
            }
          />
        ))}

        <Link
          href={activeRelease.href}
          className="absolute inset-0 z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#f4c66a]"
          aria-label={"Open " + activeRelease.title}
        >
          <span className="sr-only">Open {activeRelease.title}</span>
        </Link>
      </div>

      <p className="sr-only" aria-live="polite">
        Showing {activeRelease.title}
      </p>

      <div className="mt-2 flex items-center justify-center gap-1" aria-label="Choose a release cover">
        {releases.map((release, index) => (
          <button
            key={release.title}
            type="button"
            onClick={() => setActiveIndex(index)}
            className="group inline-flex h-6 w-8 items-center justify-center"
            aria-label={"Show " + release.title + " cover"}
            aria-pressed={index === activeIndex}
          >
            <span
              className={
                "block h-1.5 rounded-full transition-all duration-500 motion-reduce:transition-none " +
                (index === activeIndex
                  ? "w-6 bg-[#f4c66a] shadow-[0_0_12px_rgba(244,198,106,0.72)]"
                  : "w-2 bg-stone-600 group-hover:bg-stone-400")
              }
            />
          </button>
        ))}
      </div>
    </div>
  );
}
