"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type LanguageCode = "de" | "en" | "fr";

export interface TranslationDictionary {
  acts: {
    discovery: string;
    authentication: string;
    preservation: string;
    exhibition: string;
    resurrection: string;
  };
  hero: {
    eyebrow: string;
    subtitle: string;
    description: string;
    enterButton: string;
    continueLabel: string;
    heroAlt: string;
  };
  manifesto: {
    eyebrow: string;
    title: string;
    description: string;
    compositionLabel: string;
    compositionValue: string;
    formLabel: string;
    formValue: string;
    stagingLabel: string;
    stagingValue: string;
    artwork1Alt: string;
    artwork1Caption: string;
    artwork2Alt: string;
    artwork2Caption: string;
  };
  scenes: Record<string, {
    title: string;
    eyebrow: string;
    description: string;
    alt: string;
  }>;
  audioGuide: {
    label: string;
    fullPerformance: string;
    openPlayer: string;
    closePlayer: string;
    play: string;
    pause: string;
    mute: string;
    unmute: string;
  };
  footer: {
    disclaimer: string;
    returnButton: string;
  };
}

const de: TranslationDictionary = {
  acts: {
    discovery: "I \u2014 Entdeckung",
    authentication: "II \u2014 Authentifizierung",
    preservation: "III \u2014 Bewahrung",
    exhibition: "IV \u2014 Ausstellung",
    resurrection: "V \u2014 Wiederauferstehung",
  },
  hero: {
    eyebrow: "Wien \u2014 Anno MDCCXCI",
    subtitle: "Eine Komposition von K. Dridi",
    description: "Ein zeitgen\u00f6ssisches Werk, inszeniert im Geist eines Wiener Manuskripts von 1791.",
    enterButton: "DAS ARCHIV BETRETEN",
    continueLabel: "Weiter",
    heroAlt: "Reservierter Ausstellungsrahmen f\u00fcr das zentrale Manuskript von The Lost Requiem",
  },
  manifesto: {
    eyebrow: "Das Werk",
    title: "Eine neue Komposition. Eine zeitlose Inszenierung.",
    description: "The Lost Requiem ist eine Originalkomposition von K. Dridi. Die visuelle Inszenierung folgt der \u00c4sthetik eines Wiener Musikmanuskripts des sp\u00e4ten 18. Jahrhunderts. Die historische Anmutung ist Teil des k\u00fcnstlerischen Konzepts; die Musik selbst ist ein zeitgen\u00f6ssisches Werk.",
    compositionLabel: "Komposition",
    compositionValue: "K. Dridi",
    formLabel: "Form",
    formValue: "F\u00fcr Klavier und Orchester",
    stagingLabel: "Inszenierung",
    stagingValue: "Wiener Manuskript\u00e4sthetik, 1791",
    artwork1Alt: "Das Originalmanuskript",
    artwork1Caption: "Fig. 01 \u2014 Das Originalmanuskript",
    artwork2Alt: "Das Manuskript unter Glas",
    artwork2Caption: "Fig. 02 \u2014 Das Manuskript unter Glas",
  },
  scenes: {
    "master-manuscript": {
      title: "THE MANUSCRIPT",
      eyebrow: "The source object",
      description: "Recovered among sealed papers and forgotten catalogues, the manuscript enters the archive as an object without a history.",
      alt: "The master manuscript of The Lost Requiem",
    },
    "discovery-provenance": {
      title: "PROVENANCE",
      eyebrow: "Tracing the origin",
      description: "",
      alt: "Details of the manuscript's provenance",
    },
    "restoration-lab-b": {
      title: "ANALYSIS",
      eyebrow: "Authentication",
      description: "Ink, paper, seals and damage are examined. Every mark becomes evidence; every silence raises another question.",
      alt: "Analysis of the manuscript in the restoration lab",
    },
    "restoration-lab-a": {
      title: "STABILIZATION",
      eyebrow: "Manual restoration",
      description: "The manuscript is stabilized, not remade. Its scars remain part of the object and part of its story.",
      alt: "Manual restoration of the manuscript pages",
    },
    "secret-library": {
      title: "THE VAULT",
      eyebrow: "Preservation",
      description: "Preserved beyond public view, the score waits among works abandoned by time.",
      alt: "The manuscript stored in a secret library vault",
    },
    "museum-case-hero": {
      title: "THE EXHIBITION",
      eyebrow: "First light",
      description: "For the first time, the manuscript leaves the archive and enters the light of the gallery.",
      alt: "Hero view of the manuscript in a museum case",
    },
    "grand-gallery": {
      title: "GRAND GALLERY",
      eyebrow: "Public viewing",
      description: "",
      alt: "The manuscript displayed in the grand gallery",
    },
    "museum-case-close": {
      title: "DETAIL",
      eyebrow: "Close inspection",
      description: "",
      alt: "Close-up view of the manuscript in the museum case",
    },
    "composers-desk": {
      title: "THE DESK",
      eyebrow: "Genesis",
      description: "Before the concert, there was only paper, ink and the possibility of sound.",
      alt: "The composer's desk with early sketches",
    },
    "piano-room": {
      title: "THE ROOM",
      eyebrow: "First notes",
      description: "",
      alt: "The piano room where the composition began",
    },
    "fortepiano": {
      title: "THE INSTRUMENT",
      eyebrow: "Genesis",
      description: "",
      alt: "The historical fortepiano used for the composition",
    },
    "resurrection": {
      title: "RESURRECTION",
      eyebrow: "Return to sound",
      description: "The written object becomes vibration. The archive gives way to music.",
      alt: "Placeholder for the upcoming orchestral concert",
    },
  },
  audioGuide: {
    label: "Audioguide",
    fullPerformance: "Vollst\u00e4ndige Auff\u00fchrung",
    openPlayer: "Player \u00f6ffnen",
    closePlayer: "Player schlie\u00dfen",
    play: "Abspielen",
    pause: "Pause",
    mute: "Stummschalten",
    unmute: "Ton einschalten",
  },
  footer: {
    disclaimer: "Ein fiktives k\u00fcnstlerisches Archiv von KAMDRIDI.",
    returnButton: "ZUM MANUSKRIPT ZUR\u00dcCKKEHREN",
  },
};

const en: TranslationDictionary = {
  acts: {
    discovery: "I \u2014 Discovery",
    authentication: "II \u2014 Authentication",
    preservation: "III \u2014 Preservation",
    exhibition: "IV \u2014 Exhibition",
    resurrection: "V \u2014 Resurrection",
  },
  hero: {
    eyebrow: "Vienna \u2014 Anno MDCCXCI",
    subtitle: "A composition by K. Dridi",
    description: "A contemporary work, staged in the spirit of a Viennese manuscript from 1791.",
    enterButton: "ENTER THE ARCHIVE",
    continueLabel: "Continue",
    heroAlt: "Reserved exhibition frame for the central manuscript of The Lost Requiem",
  },
  manifesto: {
    eyebrow: "The Work",
    title: "A new composition. A timeless staging.",
    description: "The Lost Requiem is an original composition by K. Dridi. The visual staging follows the aesthetic of a Viennese music manuscript from the late 18th century. The historical appearance is part of the artistic concept; the music itself is a contemporary work.",
    compositionLabel: "Composition",
    compositionValue: "K. Dridi",
    formLabel: "Form",
    formValue: "For piano and orchestra",
    stagingLabel: "Staging",
    stagingValue: "Viennese manuscript aesthetic, 1791",
    artwork1Alt: "The original manuscript",
    artwork1Caption: "Fig. 01 \u2014 The original manuscript",
    artwork2Alt: "The manuscript under glass",
    artwork2Caption: "Fig. 02 \u2014 The manuscript under glass",
  },
  scenes: {
    "master-manuscript": {
      title: "THE MANUSCRIPT",
      eyebrow: "The source object",
      description: "Recovered among sealed papers and forgotten catalogues, the manuscript enters the archive as an object without a history.",
      alt: "The master manuscript of The Lost Requiem",
    },
    "discovery-provenance": {
      title: "PROVENANCE",
      eyebrow: "Tracing the origin",
      description: "",
      alt: "Details of the manuscript's provenance",
    },
    "restoration-lab-b": {
      title: "ANALYSIS",
      eyebrow: "Authentication",
      description: "Ink, paper, seals and damage are examined. Every mark becomes evidence; every silence raises another question.",
      alt: "Analysis of the manuscript in the restoration lab",
    },
    "restoration-lab-a": {
      title: "STABILIZATION",
      eyebrow: "Manual restoration",
      description: "The manuscript is stabilized, not remade. Its scars remain part of the object and part of its story.",
      alt: "Manual restoration of the manuscript pages",
    },
    "secret-library": {
      title: "THE VAULT",
      eyebrow: "Preservation",
      description: "Preserved beyond public view, the score waits among works abandoned by time.",
      alt: "The manuscript stored in a secret library vault",
    },
    "museum-case-hero": {
      title: "THE EXHIBITION",
      eyebrow: "First light",
      description: "For the first time, the manuscript leaves the archive and enters the light of the gallery.",
      alt: "Hero view of the manuscript in a museum case",
    },
    "grand-gallery": {
      title: "GRAND GALLERY",
      eyebrow: "Public viewing",
      description: "",
      alt: "The manuscript displayed in the grand gallery",
    },
    "museum-case-close": {
      title: "DETAIL",
      eyebrow: "Close inspection",
      description: "",
      alt: "Close-up view of the manuscript in the museum case",
    },
    "composers-desk": {
      title: "THE DESK",
      eyebrow: "Genesis",
      description: "Before the concert, there was only paper, ink and the possibility of sound.",
      alt: "The composer's desk with early sketches",
    },
    "piano-room": {
      title: "THE ROOM",
      eyebrow: "First notes",
      description: "",
      alt: "The piano room where the composition began",
    },
    "fortepiano": {
      title: "THE INSTRUMENT",
      eyebrow: "Genesis",
      description: "",
      alt: "The historical fortepiano used for the composition",
    },
    "resurrection": {
      title: "RESURRECTION",
      eyebrow: "Return to sound",
      description: "The written object becomes vibration. The archive gives way to music.",
      alt: "Placeholder for the upcoming orchestral concert",
    },
  },
  audioGuide: {
    label: "Audio Guide",
    fullPerformance: "Complete Performance",
    openPlayer: "Open Player",
    closePlayer: "Close Player",
    play: "Play",
    pause: "Pause",
    mute: "Mute",
    unmute: "Unmute",
  },
  footer: {
    disclaimer: "A fictional artistic archive by KAMDRIDI.",
    returnButton: "RETURN TO THE MANUSCRIPT",
  },
};

const fr: TranslationDictionary = {
  acts: {
    discovery: "I \u2014 D\u00e9couverte",
    authentication: "II \u2014 Authentification",
    preservation: "III \u2014 Pr\u00e9servation",
    exhibition: "IV \u2014 Exposition",
    resurrection: "V \u2014 R\u00e9surrection",
  },
  hero: {
    eyebrow: "Vienne \u2014 Anno MDCCXCI",
    subtitle: "Une composition de K. Dridi",
    description: "Une \u0153uvre contemporaine, mise en sc\u00e8ne dans l'esprit d'un manuscrit viennois de 1791.",
    enterButton: "ENTRER DANS LES ARCHIVES",
    continueLabel: "Continuer",
    heroAlt: "Cadre d'exposition r\u00e9serv\u00e9 au manuscrit central de The Lost Requiem",
  },
  manifesto: {
    eyebrow: "L'\u0153uvre",
    title: "Une composition nouvelle. Une mise en sc\u00e8ne intemporelle.",
    description: "The Lost Requiem est une composition originale de K. Dridi. La mise en sc\u00e8ne visuelle emprunte l'esth\u00e9tique d'un manuscrit musical viennois de la fin du XVIIIe si\u00e8cle. Cette apparence historique fait partie du concept artistique ; la musique elle-m\u00eame est une \u0153uvre contemporaine.",
    compositionLabel: "Composition",
    compositionValue: "K. Dridi",
    formLabel: "Forme",
    formValue: "Pour piano et orchestre",
    stagingLabel: "Mise en sc\u00e8ne",
    stagingValue: "Esth\u00e9tique de manuscrit viennois, 1791",
    artwork1Alt: "Le manuscrit original",
    artwork1Caption: "Fig. 01 \u2014 Le manuscrit original",
    artwork2Alt: "Le manuscrit sous verre",
    artwork2Caption: "Fig. 02 \u2014 Le manuscrit sous verre",
  },
  scenes: {
    "master-manuscript": {
      title: "LE MANUSCRIT",
      eyebrow: "L'objet source",
      description: "Retrouv\u00e9 parmi des documents scell\u00e9s et des catalogues oubli\u00e9s, le manuscrit entre dans les archives comme un objet sans histoire.",
      alt: "Le manuscrit original de The Lost Requiem",
    },
    "discovery-provenance": {
      title: "PROVENANCE",
      eyebrow: "Sur les traces de l'origine",
      description: "",
      alt: "D\u00e9tails de la provenance du manuscrit",
    },
    "restoration-lab-b": {
      title: "ANALYSE",
      eyebrow: "Authentification",
      description: "L'encre, le papier, les sceaux et les dommages sont examin\u00e9s. Chaque marque devient une preuve ; chaque silence soul\u00e8ve une nouvelle question.",
      alt: "Analyse du manuscrit dans le laboratoire de restauration",
    },
    "restoration-lab-a": {
      title: "STABILISATION",
      eyebrow: "Restauration manuelle",
      description: "Le manuscrit est stabilis\u00e9, non refait. Ses cicatrices restent une partie int\u00e9grante de l'objet et de son histoire.",
      alt: "Restauration manuelle des pages du manuscrit",
    },
    "secret-library": {
      title: "LE COFFRE",
      eyebrow: "Pr\u00e9servation",
      description: "Pr\u00e9serv\u00e9e \u00e0 l'abri des regards, la partition patiente parmi les \u0153uvres abandonn\u00e9es par le temps.",
      alt: "Le manuscrit conserv\u00e9 dans un coffre de biblioth\u00e8que secr\u00e8te",
    },
    "museum-case-hero": {
      title: "L'EXPOSITION",
      eyebrow: "Premi\u00e8re lumi\u00e8re",
      description: "Pour la premi\u00e8re fois, le manuscrit quitte les archives et entre dans la lumi\u00e8re de la galerie.",
      alt: "Vue principale du manuscrit dans une vitrine",
    },
    "grand-gallery": {
      title: "LA GRANDE GALERIE",
      eyebrow: "Exposition publique",
      description: "",
      alt: "Le manuscrit expos\u00e9 dans la grande galerie",
    },
    "museum-case-close": {
      title: "D\u00c9TAIL",
      eyebrow: "Inspection de pr\u00e8s",
      description: "",
      alt: "Vue d\u00e9taill\u00e9e du manuscrit dans la vitrine",
    },
    "composers-desk": {
      title: "LE BUREAU",
      eyebrow: "Gen\u00e8se",
      description: "Avant le concert, il n'y avait que du papier, de l'encre et la possibilit\u00e9 du son.",
      alt: "Le bureau du compositeur avec ses premi\u00e8res \u00e9bauches",
    },
    "piano-room": {
      title: "LA PI\u00c8CE",
      eyebrow: "Premi\u00e8res notes",
      description: "",
      alt: "La salle de piano o\u00f9 la composition a commenc\u00e9",
    },
    "fortepiano": {
      title: "L'INSTRUMENT",
      eyebrow: "Gen\u00e8se",
      description: "",
      alt: "Le piano-forte historique utilis\u00e9 pour la composition",
    },
    "resurrection": {
      title: "R\u00c9SURRECTION",
      eyebrow: "Retour au son",
      description: "L'objet \u00e9crit devient vibration. L'archive laisse place \u00e0 la musique.",
      alt: "Espace r\u00e9serv\u00e9 pour le concert orchestral \u00e0 venir",
    },
  },
  audioGuide: {
    label: "Guide audio",
    fullPerformance: "Interpr\u00e9tation int\u00e9grale",
    openPlayer: "Ouvrir le lecteur",
    closePlayer: "Fermer le lecteur",
    play: "Lecture",
    pause: "Pause",
    mute: "Couper le son",
    unmute: "Activer le son",
  },
  footer: {
    disclaimer: "Une archive artistique fictive de KAMDRIDI.",
    returnButton: "RETOURNER AU MANUSCRIT",
  },
};

export const dictionaries = { de, en, fr };

interface LanguageContextProps {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: TranslationDictionary;
}

const LostRequiemLanguageContext = createContext<LanguageContextProps | undefined>(undefined);

const LOCAL_STORAGE_KEY = "lr_lang_preference";

export const LostRequiemLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>("en");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY) as LanguageCode;
    if (stored && ["de", "en", "fr"].includes(stored)) {
      setLanguageState(stored);
      document.documentElement.lang = stored;
    } else {
      const browserLang = navigator.language.split("-")[0];
      const initialLang: LanguageCode = ["de", "en", "fr"].includes(browserLang) ? (browserLang as LanguageCode) : "en";
      setLanguageState(initialLang);
      document.documentElement.lang = initialLang;
    }
  }, []);

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem(LOCAL_STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  };

  const currentLang = isMounted ? language : "en";
  const t = dictionaries[currentLang];

  return (
    <LostRequiemLanguageContext.Provider value={{ language: currentLang, setLanguage, t }}>
      {children}
    </LostRequiemLanguageContext.Provider>
  );
};

export const useLostRequiemLanguage = () => {
  const context = useContext(LostRequiemLanguageContext);
  if (!context) {
    throw new Error("useLostRequiemLanguage must be used within a LostRequiemLanguageProvider");
  }
  return context;
};
