"use client";

import styles from "./lost-requiem.module.css";
import { museumScenes } from "./lost-requiem-scenes.data";
import { MuseumScene } from "./MuseumScene";
import { useLostRequiemLanguage } from "./lost-requiem-translations";

export function LostRequiemPhaseTwo() {
  const { t } = useLostRequiemLanguage();
  const acts = ["discovery", "authentication", "preservation", "exhibition", "resurrection"];

  return (
    <section className={styles.phaseTwoContainer} aria-label="The Exhibition">
      <div className={styles.cinematicTransition} aria-hidden="true" />

      {acts.map((actName) => {
        const scenesInAct = museumScenes.filter(s => s.act === actName && s.image !== "placeholder-orchestra");
        if (scenesInAct.length === 0) return null;

        return (
          <article key={actName} id={actName} className={styles.actGroup}>
            {scenesInAct.map((scene, index) => (
              <section key={scene.id} id={scene.id}>
                <MuseumScene scene={scene} priority={actName === "discovery" && index === 0} />
              </section>
            ))}
          </article>
        );
      })}

      <div className={styles.fictionalArchiveDisclaimer}>
        {t.footer.disclaimer}
      </div>

      <div className={styles.returnAction}>
        <a
          href="#master-manuscript"
          className={styles.audioTriggerButton}
          onClick={(e) => {
            e.preventDefault();
            document.getElementById("master-manuscript")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          {t.footer.returnButton}
        </a>
      </div>

      <div className={styles.finalFade} aria-hidden="true" />
    </section>
  );
}
