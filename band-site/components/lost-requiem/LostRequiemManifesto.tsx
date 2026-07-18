"use client";

import styles from "./lost-requiem.module.css";
import Image from "next/image";
import { useLostRequiemLanguage } from "./lost-requiem-translations";

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
        {label}
      </figcaption>
    </figure>
  );
}

export function LostRequiemManifesto() {
  const { t } = useLostRequiemLanguage();

  return (
    <section id="werk" className={styles.manifesto} aria-labelledby="manifesto-title">
      <div className={styles.sectionMarker} aria-hidden="true">
        II
      </div>

      <div className={styles.manifestoText}>
        <p className={styles.eyebrow}>{t.manifesto.eyebrow}</p>
        <h2 id="manifesto-title">{t.manifesto.title}</h2>
        <p>{t.manifesto.description}</p>

        <dl className={styles.objectDetails}>
          <div>
            <dt>{t.manifesto.compositionLabel}</dt>
            <dd>{t.manifesto.compositionValue}</dd>
          </div>
          <div>
            <dt>{t.manifesto.formLabel}</dt>
            <dd>{t.manifesto.formValue}</dd>
          </div>
          <div>
            <dt>{t.manifesto.stagingLabel}</dt>
            <dd>{t.manifesto.stagingValue}</dd>
          </div>
        </dl>
      </div>

      <div className={styles.manifestoGallery}>
        <ArtworkPlaceholder number="01" label={t.manifesto.artwork1Caption} imageSrc="01-master-manuscript-final" />
        <ArtworkPlaceholder number="02" label={t.manifesto.artwork2Caption} imageSrc="10-museum-case-close" />
      </div>
    </section>
  );
}
