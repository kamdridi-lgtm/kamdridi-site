import { manifestoText } from "./lost-requiem.data";
import styles from "./lost-requiem.module.css";

function ArtworkPlaceholder({
  number,
  label
}: {
  number: string;
  label: string;
}) {
  return (
    <figure className={styles.manifestoArtwork}>
      <div
        className={styles.artworkFrame}
        role="img"
        aria-label={`Reservierter Bildrahmen: ${label}`}
      >
        <div className={styles.placeholderPaper} aria-hidden="true">
          <span>REQUIEM</span>
          <small>Wien · MDCCXCI</small>
        </div>
      </div>
      <figcaption>
        Mockup {number} · {label}
      </figcaption>
    </figure>
  );
}

export function LostRequiemManifesto() {
  return (
    <section id="werk" className={styles.manifesto} aria-labelledby="manifesto-title">
      <div className={styles.sectionMarker} aria-hidden="true">
        II
      </div>

      <div className={styles.manifestoText}>
        <p className={styles.eyebrow}>Das Werk</p>
        <h2 id="manifesto-title">Eine neue Komposition. Eine zeitlose Inszenierung.</h2>
        <p>{manifestoText}</p>

        <dl className={styles.objectDetails}>
          <div>
            <dt>Komposition</dt>
            <dd>K. Dridi</dd>
          </div>
          <div>
            <dt>Form</dt>
            <dd>Für Klavier und Orchester</dd>
          </div>
          <div>
            <dt>Inszenierung</dt>
            <dd>Wiener Manuskriptästhetik, 1791</dd>
          </div>
        </dl>
      </div>

      <div className={styles.manifestoGallery}>
        <ArtworkPlaceholder number="01" label="Das Originalmanuskript" />
        <ArtworkPlaceholder number="02" label="Das Manuskript unter Glas" />
      </div>
    </section>
  );
}
