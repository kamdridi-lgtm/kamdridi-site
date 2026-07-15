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
          <a className={styles.primaryButton} href="#audio-guide">
            Werk anhören
          </a>
          <a className={styles.secondaryButton} href="#werk">
            Ausstellung betreten
          </a>
        </div>
      </div>

      <div
        className={`${styles.artworkFrame} ${styles.heroArtwork}`}
        role="img"
        aria-label="Reservierter Ausstellungsrahmen für das zentrale Manuskript von The Lost Requiem"
      >
        <div className={styles.placeholderPaper} aria-hidden="true">
          <span>REQUIEM</span>
          <small>Für Klavier · K. Dridi</small>
        </div>
        <p className={styles.assetLabel}>Mockup 19 · Hero-Vitrine</p>
      </div>

      <a className={styles.scrollCue} href="#werk" aria-label="Zum Werk weitergehen">
        <span>Weiter</span>
        <span aria-hidden="true">↓</span>
      </a>
    </section>
  );
}
