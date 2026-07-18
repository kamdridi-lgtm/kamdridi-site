import Image from "next/image";
import type { MuseumSceneData } from "./lost-requiem-scenes.data";
import styles from "./lost-requiem.module.css";

type MuseumSceneProps = {
  scene: MuseumSceneData;
  priority?: boolean;
};

export function MuseumScene({ scene, priority = false }: MuseumSceneProps) {
  const isCase = scene.variant === "case";
  const imagePath = scene.image === "placeholder-orchestra"
    ? "/assets/images/placeholder.png" // We don't have this, let's just make it a generic CSS placeholder if it's the orchestra
    : `/the-lost-requiem/images/${scene.image}.webp`;

  return (
    <div className={`${styles.museumScene} ${isCase ? styles.sceneCase : styles.sceneFull}`}>
      <div className={styles.sceneImageWrapper}>
        {scene.image === "placeholder-orchestra" ? (
          <div className={styles.artworkFrame} role="img" aria-label={scene.alt}>
            <div className={styles.placeholderPaper} aria-hidden="true">
              <span>ORCHESTRA</span>
              <small>Coming Soon</small>
            </div>
          </div>
        ) : (
          <Image
            src={imagePath}
            alt={scene.alt}
            fill
            priority={priority}
            sizes={isCase ? "(max-width: 768px) 100vw, 50vw" : "100vw"}
            className={styles.sceneImage}
          />
        )}
      </div>

      <div className={styles.sceneText}>
        <div className={styles.sceneTextInner}>
          <p className={styles.eyebrow}>{scene.eyebrow}</p>
          <h2>{scene.title}</h2>
          {scene.description && <p className={styles.sceneDescription}>{scene.description}</p>}
          <div className={styles.inventoryBadge}>{scene.inventory}</div>
        </div>
      </div>
    </div>
  );
}
