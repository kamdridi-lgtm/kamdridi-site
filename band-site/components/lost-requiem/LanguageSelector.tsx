"use client";

import React from "react";
import styles from "./lost-requiem.module.css";
import { useLostRequiemLanguage, LanguageCode } from "./lost-requiem-translations";

export function LanguageSelector() {
  const { language, setLanguage } = useLostRequiemLanguage();

  const handleLang = (lang: LanguageCode) => {
    setLanguage(lang);
  };

  return (
    <div className={styles.languageSelector} aria-label="Select Language">
      <button
        onClick={() => handleLang("de")}
        aria-pressed={language === "de"}
        aria-label="Deutsch"
        className={styles.langBtn}
      >
        <span className={styles.langFlag} aria-hidden="true">🇩🇪</span>
        <span className={styles.langText}>Deutsch</span>
      </button>
      <button
        onClick={() => handleLang("en")}
        aria-pressed={language === "en"}
        aria-label="English"
        className={styles.langBtn}
      >
        <span className={styles.langFlag} aria-hidden="true">🇬🇧</span>
        <span className={styles.langText}>English</span>
      </button>
      <button
        onClick={() => handleLang("fr")}
        aria-pressed={language === "fr"}
        aria-label="Français"
        className={styles.langBtn}
      >
        <span className={styles.langFlag} aria-hidden="true">🇫🇷</span>
        <span className={styles.langText}>Français</span>
      </button>
    </div>
  );
}
