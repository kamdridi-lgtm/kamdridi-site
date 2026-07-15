import type { ReactNode } from "react";
import Link from "next/link";
import styles from "./lost-requiem.module.css";

type MuseumLayoutProps = {
  children: ReactNode;
};

export function MuseumLayout({ children }: MuseumLayoutProps) {
  return (
    <div className={styles.museum}>
      <a className={styles.skipLink} href="#lost-requiem-content">
        Zum Inhalt springen
      </a>

      <div className={styles.ambientGlow} aria-hidden="true" />

      <Link className={styles.returnLink} href="/">
        <span aria-hidden="true">←</span>
        <span>Kam Dridi Studio</span>
      </Link>

      {children}
    </div>
  );
}
