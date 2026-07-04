"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

const poster = "/assets/images/salieris-hands/partition-card.png";

const embers = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  left: `${12 + ((index * 17) % 76)}%`,
  delay: `${(index % 6) * 0.3}s`,
  size: `${2 + (index % 4)}px`,
  drift: `${index % 2 === 0 ? "-" : ""}${9 + (index % 4) * 6}px`
}));

export function SalieriCinematicIntro() {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const showTimer = window.setTimeout(() => setMounted(true), 7800);
    const hideTimer = window.setTimeout(() => setMounted(false), 15200);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!mounted) return null;

  function handleMouseMove(event: MouseEvent<HTMLAnchorElement>) {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const card = cardRef.current;
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.setProperty("--promo-parallax-x", `${x * 7}px`);
    card.style.setProperty("--promo-parallax-y", `${y * 5}px`);
    card.style.setProperty("--poster-parallax-x", `${x * -5}px`);
    card.style.setProperty("--poster-parallax-y", `${y * -4}px`);
  }

  function handleMouseLeave() {
    const card = cardRef.current;
    if (!card) return;

    card.style.setProperty("--promo-parallax-x", "0px");
    card.style.setProperty("--promo-parallax-y", "0px");
    card.style.setProperty("--poster-parallax-x", "0px");
    card.style.setProperty("--poster-parallax-y", "0px");
  }

  return (
    <aside className="home-cinematic-intro salieri-promo-intro" aria-label="Salieri's Hands promo">
      <div className="home-cinematic-shake home-promo-card">
        <div className="home-promo-float">
          <div className="home-cinematic-electric-field">
            <div className="signal-static-bolt signal-static-bolt-a home-intro-bolt home-intro-bolt-a" />
            <div className="signal-static-bolt signal-static-bolt-b home-intro-bolt home-intro-bolt-b" />
            <div className="home-intro-lightning home-intro-lightning-left" />
            <div className="home-intro-flash" />
          </div>
          <Link
            ref={cardRef}
            href="/releases/salieris-hands"
            className="home-promo-link"
            aria-label="Open Salieri's Hands release page"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-cinematic-poster-wrap">
              <Image
                src={poster}
                alt="Salieri's Hands"
                fill
                priority
                sizes="(max-width: 700px) 180px, 260px"
                className="home-cinematic-poster"
              />
              <div className="home-cinematic-poster-glow" />
            </div>
            <div className="home-promo-copy">
              <p>NEW RELEASE</p>
              <span>Vienna, 1791</span>
            </div>
          </Link>
          <div className="home-cinematic-embers">
            {embers.map((ember) => (
              <span
                key={ember.id}
                style={
                  {
                    "--ember-left": ember.left,
                    "--ember-delay": ember.delay,
                    "--ember-size": ember.size,
                    "--ember-drift": ember.drift
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
