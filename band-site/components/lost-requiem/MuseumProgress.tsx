import { museumStops } from "./lost-requiem.data";
import styles from "./lost-requiem.module.css";

export function MuseumProgress() {
  return (
    <nav className={styles.progress} aria-label="Ausstellungsfortschritt">
      <ol>
        {museumStops.map((stop, index) => (
          <li key={stop.id} className={stop.active ? styles.progressActive : styles.progressFuture}>
            {stop.active ? (
              <a href={`#${stop.id}`} aria-label={`${stop.label}, Raum ${index + 1}`}>
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <strong>{stop.label}</strong>
              </a>
            ) : (
              <span aria-disabled="true">
                <span aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <strong>{stop.label}</strong>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
