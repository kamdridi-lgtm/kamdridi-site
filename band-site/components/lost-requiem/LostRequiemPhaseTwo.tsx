import styles from "./lost-requiem.module.css";

function ArtworkPlaceholder({
  label,
  modifier
}: {
  label: string;
  modifier: string;
}) {
  return (
    <figure className={`${styles.manifestoArtwork} ${modifier}`}>
      <div
        className={styles.artworkFrame}
        role="img"
        aria-label={`Reservierter Bildrahmen: ${label}`}
      >
        <div className={styles.placeholderPaper} aria-hidden="true">
          <span>REQUIEM</span>
          <small>{label}</small>
        </div>
      </div>
      <figcaption>
        {label}
      </figcaption>
    </figure>
  );
}

export function LostRequiemPhaseTwo() {
  return (
    <>
      <div className={styles.cinematicTransition} aria-hidden="true" />
      
      <section id="archiv" className={styles.manifesto} aria-labelledby="archive-title">
        <div className={styles.sectionMarker} aria-hidden="true">
          III
        </div>
        <div className={styles.manifestoText}>
          <p className={styles.eyebrow}>The manuscript enters the record</p>
          <h2 id="archive-title">THE ARCHIVE</h2>
          <p>
            A fragment of time carefully preserved. The archive holds the physical manifestation of the Requiem, waiting to be studied and understood.
          </p>
        </div>
        <div className={styles.manifestoGallery}>
          <ArtworkPlaceholder label="archive-placeholder" modifier={styles.archivePlaceholder} />
        </div>
      </section>

      <div className={styles.cinematicTransition} aria-hidden="true" />

      <section id="entstehung" className={styles.manifesto} aria-labelledby="genesis-title">
        <div className={styles.sectionMarker} aria-hidden="true">
          IV
        </div>
        <div className={styles.manifestoText}>
          <p className={styles.eyebrow}>From silence to composition</p>
          <h2 id="genesis-title">GENESIS</h2>
          <p>
            The birth of the piece. Tracing the lines from the initial spark of inspiration to the final written note on parchment.
          </p>
        </div>
        <div className={styles.manifestoGallery}>
          <ArtworkPlaceholder label="genesis-placeholder" modifier={styles.genesisPlaceholder} />
        </div>
      </section>

      <div className={styles.cinematicTransition} aria-hidden="true" />

      <section id="konzert" className={styles.manifesto} aria-labelledby="concert-title">
        <div className={styles.sectionMarker} aria-hidden="true">
          V
        </div>
        <div className={styles.manifestoText}>
          <p className={styles.eyebrow}>The manuscript returns as sound</p>
          <h2 id="concert-title">RESURRECTION</h2>
          <p>
            The ink becomes vibration. The orchestra breathes life into the dormant score, awakening the Requiem for the modern ear.
          </p>
        </div>
        <div className={styles.manifestoGallery}>
          <ArtworkPlaceholder label="concert-placeholder" modifier={styles.concertPlaceholder} />
        </div>
      </section>

      <div className={styles.finalFade} aria-hidden="true" />
    </>
  );
}
