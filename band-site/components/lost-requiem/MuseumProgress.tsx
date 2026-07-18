"use client";

import { useEffect, useState } from "react";
import { museumStops } from "./lost-requiem.data";
import styles from "./lost-requiem.module.css";

export function MuseumProgress() {
  const [activeId, setActiveId] = useState<string>("discovery");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(e => e.isIntersecting);
        if (visibleEntries.length > 0) {
          // Sort by visibility ratio if needed, or just take the first one
          setActiveId(visibleEntries[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -60% 0px",
        threshold: 0
      }
    );

    museumStops.forEach((stop) => {
      const el = document.getElementById(stop.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className={styles.progress} aria-label="Ausstellungsfortschritt">
      <ol>
        {museumStops.map((stop, index) => {
          const isCurrentlyActive = stop.id === activeId;
          return (
            <li key={stop.id} className={stop.active ? (isCurrentlyActive ? styles.progressActive : "") : styles.progressFuture}>
              {stop.active ? (
                <a href={`#${stop.id}`} aria-label={`${stop.label}, Raum ${index + 1}`}>
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{stop.label}</strong>
                </a>
              ) : (
                <span aria-disabled="true">
                  <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                  <strong>{stop.label}</strong>
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
