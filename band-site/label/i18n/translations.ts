export type LabelLocale = "fr" | "en";

export const labelTranslations = {
  fr: {
    apply: "Soumettre une candidature",
    dashboard: "Tableau de bord",
    signedArtists: "Artistes signés",
    releases: "Sorties",
    royalties: "Royalties",
    messages: "Messages",
    contracts: "Contrats",
    payout: "Payer les royalties",
    releaseSubmitted: "Release soumise pour validation.",
    adminRequired: "Accès admin requis."
  },
  en: {
    apply: "Apply to Join",
    dashboard: "Dashboard",
    signedArtists: "Signed Artists",
    releases: "Releases",
    royalties: "Royalties",
    messages: "Messages",
    contracts: "Contracts",
    payout: "Pay Royalties",
    releaseSubmitted: "Release submitted for review.",
    adminRequired: "Admin access required."
  }
} as const;

export function detectLabelLocale(acceptLanguage = ""): LabelLocale {
  return acceptLanguage.toLowerCase().startsWith("fr") ? "fr" : "en";
}

export function t(locale: LabelLocale, key: keyof typeof labelTranslations.fr) {
  return labelTranslations[locale][key] || labelTranslations.en[key];
}
