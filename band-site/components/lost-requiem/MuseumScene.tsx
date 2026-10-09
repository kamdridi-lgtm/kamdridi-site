"use client";

import Image from "next/image";
import type { MuseumSceneData } from "./lost-requiem-scenes.data";
import styles from "./lost-requiem.module.css";
import { useLostRequiemLanguage } from "./lost-requiem-translations";

type MuseumSceneProps = {
  scene: MuseumSceneData;
  priority?: boolean;
};

export function MuseumScene({ scene, priority = false }: MuseumSceneProps) {
  const { t } = useLostRequiemLanguage();
  const sceneDict = t.scenes[scene.id];

  const isCase = scene.variant === "case";
  const imagePath = scene.image === "placeholder-orchestra"
    ? "/assets/images/placeholder.png"
    : `/the-lost-requiem/images/${scene.image}.webp`;

  return (
    <div className={`${styles.museumScene} ${isCase ? styles.sceneCase : styles.sceneFull}`}>
      <div className={styles.sceneImageWrapper}>
        {scene.image === "placeholder-orchestra" ? (
          <div className={styles.artworkFrame} role="img" aria-label={sceneDict?.alt}>
            <div className={styles.placeholderPaper} aria-hidden="true">
              <span>ORCHESTRA</span>
              <small>Coming Soon</small>
            </div>
          </div>
        ) : (
          <Image
            src={imagePath}
            alt={sceneDict?.alt || ""}
            fill
            priority={priority}
            sizes={isCase ? "(max-width: 768px) 100vw, 50vw" : "100vw"}
            className={styles.sceneImage}
          />
        )}
      </div>

      <div className={styles.sceneText}>
        <div className={styles.sceneTextInner}>
          <p className={styles.eyebrow}>{sceneDict?.eyebrow}</p>
          <h2>{sceneDict?.title}</h2>
          {sceneDict?.description && <p className={styles.sceneDescription}>{sceneDict.description}</p>}
          <div className={styles.inventoryBadge}>{scene.inventory}</div>
        </div>
      </div>
    </div>
  );
}
