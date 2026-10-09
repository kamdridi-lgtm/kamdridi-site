"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export function AustraliaParallaxBackground() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let animationFrame = 0;

    const updatePosition = () => {
      const root = rootRef.current;

      if (!root) {
        return;
      }

      const bounds = root.getBoundingClientRect();
      const travel = Math.max(1, bounds.height - window.innerHeight);
      const progress = Math.min(1, Math.max(0, -bounds.top / travel));

      root.style.setProperty("--australia-bg-y", `${progress * 100}%`);
    };

    const scheduleUpdate = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updatePosition);
    };

    updatePosition();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#151515]">
        <Image
          src="/australia/17-for-ever-background.webp"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "center var(--australia-bg-y, 0%)" }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,3,5,.14),rgba(2,3,5,.34))]" />
      </div>
    </div>
  );
}
