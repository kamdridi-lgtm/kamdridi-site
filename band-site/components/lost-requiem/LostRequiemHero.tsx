import Image from "next/image";
import styles from "./lost-requiem.module.css";

export function LostRequiemHero() {
  return (
    <section id="eingang" className={styles.hero} aria-labelledby="lost-requiem-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}>Wien · Anno MDCCXCI</p>
        <h1 id="lost-requiem-title" className={styles.heroTitle}>
          THE LOST REQUIEM
        </h1>
        <p className={styles.heroSubtitle}>Eine Komposition von K. Dridi</p>
        <p className={styles.heroDescription}>
          Ein zeitgenössisches Werk, inszeniert im Geist eines Wiener Manuskripts von 1791.
        </p>

        <div className={styles.heroActions}>
          <a className={styles.primaryButton} href="#master-manuscript">
            ENTER THE ARCHIVE
          </a>
        </div>
      </div>

      <div className={styles.heroArtworkWrapper}>
        <Image
          src="/the-lost-requiem/images/02-museum-case-hero.webp"
          alt="Reservierter Ausstellungsrahmen für das zentrale Manuskript von The Lost Requiem"
          fill
          priority
          sizes="(max-width: 900px) 100vw, 50vw"
          className={styles.sceneImage}
        />
      </div>

      <a className={styles.scrollCue} href="#werk" aria-label="Zum Werk weitergehen">
        <span>Weiter</span>
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
