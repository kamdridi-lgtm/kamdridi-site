import { manifestoText } from "./lost-requiem.data";
import styles from "./lost-requiem.module.css";

import Image from "next/image";

function ArtworkPlaceholder({
  number,
  label,
  imageSrc
}: {
  number: string;
  label: string;
  imageSrc: string;
}) {
  return (
    <figure className={styles.manifestoArtwork}>
      <div className={styles.sceneImageWrapper} style={{ minHeight: '30rem' }}>
        <Image
          src={`/the-lost-requiem/images/${imageSrc}.webp`}
          alt={label}
          fill
          className={styles.sceneImage}
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </div>
      <figcaption>
        Fig. {number} · {label}
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
        <ArtworkPlaceholder number="01" label="Das Originalmanuskript" imageSrc="01-master-manuscript-final" />
        <ArtworkPlaceholder number="02" label="Das Manuskript unter Glas" imageSrc="10-museum-case-close" />
      </div>
    </section>
  );
}
