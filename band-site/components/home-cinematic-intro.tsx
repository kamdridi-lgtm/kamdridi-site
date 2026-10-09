"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, MouseEvent } from "react";
import { useEffect, useRef, useState } from "react";

const poster = "/assets/images/games/act-ii-war-machines-poster.png";

const embers = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  left: `${10 + ((index * 19) % 78)}%`,
  delay: `${(index % 6) * 0.32}s`,
  size: `${2 + (index % 4)}px`,
  drift: `${index % 2 === 0 ? "-" : ""}${10 + (index % 4) * 7}px`
}));

export function HomeCinematicIntro() {
  const [mounted, setMounted] = useState(true);
  const cardRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const hideTimer = window.setTimeout(() => setMounted(false), 10500);
    return () => window.clearTimeout(hideTimer);
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
    <aside className="home-cinematic-intro actii-promo-intro" aria-label="ACT II War Machines promo">
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
            href="/games"
            className="home-promo-link"
            aria-label="Learn more about ACT II War Machines"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-cinematic-poster-wrap">
              <Image
                src={poster}
                alt="ACT II War Machines"
                fill
                priority
                sizes="(max-width: 700px) 180px, 260px"
                className="home-cinematic-poster"
              />
              <div className="home-cinematic-poster-glow" />
            </div>
            <div className="home-promo-copy">
              <p>ACT II - WAR MACHINES</p>
              <span>Coming 2027</span>
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
