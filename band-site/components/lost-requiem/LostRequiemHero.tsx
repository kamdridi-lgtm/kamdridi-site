"use client";

import Image from "next/image";
import styles from "./lost-requiem.module.css";
import { useLostRequiemLanguage } from "./lost-requiem-translations";

export function LostRequiemHero() {
  const { t } = useLostRequiemLanguage();

  return (
    <section id="eingang" className={styles.hero} aria-labelledby="lost-requiem-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>{t.hero.eyebrow}</p>
        <h1 id="lost-requiem-title" className={styles.heroTitle}>
          THE LOST REQUIEM
        </h1>
        <p className={styles.heroSubtitle}>{t.hero.subtitle}</p>
        <p className={styles.heroDescription}>
          {t.hero.description}
        </p>

        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="#master-manuscript">
            {t.hero.enterButton}
          </a>
        </div>
      </div>

      <div className={styles.heroArtworkWrapper}>
        <Image
          src="/the-lost-requiem/images/02-museum-case-hero.webp"
          alt={t.hero.heroAlt}
          fill
          priority
          sizes="(max-width: 900px) 100vw, 50vw"
          className={styles.sceneImage}
        />
      </div>

      <a className={styles.scrollCue} href="#werk" aria-label={t.hero.continueLabel}>
        <span>{t.hero.continueLabel}</span>
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
