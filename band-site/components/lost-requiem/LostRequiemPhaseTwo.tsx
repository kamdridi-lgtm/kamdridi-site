import styles from "./lost-requiem.module.css";

const phaseTwoSections = [
  {
    id: "archive",
    marker: "III",
    eyebrow: "Archiv",
    title: "DAS ARCHIV",
    copy:
      "Ein geschützter Raum für Manuskriptfragmente, einzelne Stimmen, Katalogvermerke und die ersten visuellen Spuren des Requiems.",
    mockups: ["Manuskriptfragment", "Archivvitrine"]
  },
  {
    id: "genesis",
    marker: "IV",
    eyebrow: "Entstehung",
    title: "DIE ENTSTEHUNG",
    copy:
      "Der ursprüngliche Raum wird durch Prozession, Notation, Skizzen und die fragile Verbindung zwischen historischem Bild und zeitgenössischer Komposition sichtbar.",
    mockups: ["Kompositionsstudie", "Instrumententafel"]
  },
  {
    id: "concert",
    marker: "V",
    eyebrow: "Konzert",
    title: "DAS KONZERT",
    copy:
      "Eine zukünftige Aufführung verbindet die Partitur, den Dirigenten, den Konzertsaal und die vollständige musikalische Kraft von The Lost Requiem.",
    mockups: ["Dirigentenpult", "Konzertdokument"]
  }
] as const;

export function LostRequiemPhaseTwo() {
  return (
    <div className={styles.phaseTwo} aria-label="The Lost Requiem phase two galleries">
      {phaseTwoSections.map((section) => (
        <section
          key={section.id}
          id={section.id}
          className={styles.gallerySection}
          aria-labelledby={`${section.id}-title`}
        >
          <div className={styles.galleryMarker} aria-hidden="true">
            {section.marker}
          </div>

          <div className={styles.galleryCopy}>
            <p className={styles.eyebrow}>{section.eyebrow}</p>
            <h2 id={`${section.id}-title`}>{section.title}</h2>
            <p>{section.copy}</p>
          </div>

          <div className={styles.placeholderGrid}>
            {section.mockups.map((mockup) => (
              <figure key={mockup} className={styles.placeholderBlock}>
                <div
                  className={styles.imageBlock}
                  role="img"
                  aria-label={`${section.title} reservierter Museumsrahmen: ${mockup}`}
                >
                  <span>{mockup}</span>
                </div>
                <figcaption>{mockup}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
