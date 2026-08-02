"use client";

import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

const poster = "/echoes-un-live-in-brasil/assets/images/front-cover.webp";

const particles = Array.from({ length: 8 }, (_, index) => ({
  id: index,
  left: `${10 + ((index * 19) % 78)}%`,
  delay: `${(index % 5) * 0.35}s`,
  size: `${2 + (index % 3)}px`,
  drift: `${index % 2 === 0 ? "-" : ""}${8 + (index % 5) * 5}px`
}));

export function EchoesBrasilCinematicIntro() {
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const showDelay = prefersReduced ? 23800 : 23800;
    const hideDelay = prefersReduced ? 31000 : 38900;

    const showTimer = window.setTimeout(() => setMounted(true), showDelay);
    const hideTimer = window.setTimeout(() => setMounted(false), hideDelay);
    return () => {
      window.clearTimeout(showTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  if (!mounted) return null;

  function handleMouseMove(event: React.MouseEvent<HTMLAnchorElement>) {
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
    <aside className="home-cinematic-intro echoes-brasil-promo-intro" aria-label="Echoes Un Live in Brasil promo">
      <div className="home-cinematic-shake echoes-brasil-promo-card">
        <div className="home-promo-float">
          <div className="home-cinematic-electric-field">
            <div className="signal-static-bolt signal-static-bolt-a home-intro-bolt home-intro-bolt-a" />
            <div className="signal-static-bolt signal-static-bolt-b home-intro-bolt home-intro-bolt-b" />
            <div className="home-intro-lightning home-intro-lightning-left" />
            <div className="home-intro-flash" />
          </div>
          <Link
            ref={cardRef}
            href="/releases/echoes-un-live-in-brasil"
            className="home-promo-link"
            aria-label="Open Echoes Un Live in Brasil release page"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="home-cinematic-poster-wrap">
              <Image
                src={poster}
                alt="ECHOES UN LIVE IN BRASIL — front cover"
                fill
                priority
                sizes="(max-width: 700px) 196px, 278px"
                className="home-cinematic-poster"
              />
              <div className="home-cinematic-poster-glow echoes-brasil-poster-glow" />
              <span className="echoes-brasil-badge" aria-hidden="true">NEW RELEASE</span>
            </div>
            <div className="home-promo-copy echoes-brasil-promo-copy">
              <p>EXPANDED LIVE EDITION · BRASIL 2026</p>
              <span>ECHOES UN LIVE IN BRASIL</span>
              <strong className="echoes-brasil-cta">
                OPEN RELEASE
              </strong>
            </div>
          </Link>
          <div className="home-cinematic-embers echoes-brasil-embers">
            {particles.map((p) => (
              <span
                key={p.id}
                style={
                  {
                    "--ember-left": p.left,
                    "--ember-delay": p.delay,
                    "--ember-size": p.size,
                    "--ember-drift": p.drift
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
