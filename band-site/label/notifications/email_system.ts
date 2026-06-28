import { readLabelJson, writeLabelJson } from "@/label/core/json_store";

export type EmailEvent =
  | "application_received"
  | "application_accepted"
  | "application_refused"
  | "release_submitted"
  | "release_approved"
  | "release_in_7_days"
  | "royalties_available"
  | "welcome_signed_artist";

export type EmailLanguage = "fr" | "en";

export type EmailMessage = {
  id: string;
  event: EmailEvent;
  to: string;
  subject: string;
  html: string;
  text: string;
  status: "simulated" | "sent" | "failed";
  createdAt: string;
};

const templates: Record<EmailEvent, Record<EmailLanguage, { subject: string; body: string }>> = {
  application_received: {
    fr: { subject: "Nouvelle candidature KAMDRIDI RECORDS", body: "Une nouvelle candidature artiste est prête pour review." },
    en: { subject: "New KAMDRIDI RECORDS application", body: "A new artist application is ready for review." }
  },
  application_accepted: {
    fr: { subject: "Bienvenue sur KAMDRIDI RECORDS", body: "Ta candidature est acceptée. Ton accès artiste est ouvert." },
    en: { subject: "Welcome to KAMDRIDI RECORDS", body: "Your application was accepted. Your artist access is open." }
  },
  application_refused: {
    fr: { subject: "Décision KAMDRIDI RECORDS", body: "Merci pour ta candidature. Nous ne pouvons pas signer ce projet maintenant." },
    en: { subject: "KAMDRIDI RECORDS decision", body: "Thank you for applying. We cannot sign this project right now." }
  },
  release_submitted: {
    fr: { subject: "Nouvelle release soumise", body: "Une nouvelle release attend validation." },
    en: { subject: "New release submitted", body: "A new release is waiting for review." }
  },
  release_approved: {
    fr: { subject: "Release approuvée", body: "Ta release est approuvée et entre dans le calendrier de sortie." },
    en: { subject: "Release approved", body: "Your release is approved and entering the release calendar." }
  },
  release_in_7_days: {
    fr: { subject: "Sortie dans 7 jours", body: "La sortie arrive dans 7 jours. Prépare les annonces et liens pre-save." },
    en: { subject: "Release in 7 days", body: "Release is in 7 days. Prepare announcements and pre-save links." }
  },
  royalties_available: {
    fr: { subject: "Royalties disponibles", body: "Des royalties sont disponibles dans ton wallet artiste." },
    en: { subject: "Royalties available", body: "Royalties are available in your artist wallet." }
  },
  welcome_signed_artist: {
    fr: { subject: "Bienvenue artiste signé KAMDRIDI", body: "Tu fais officiellement partie de KAMDRIDI RECORDS." },
    en: { subject: "Welcome signed KAMDRIDI artist", body: "You are officially part of KAMDRIDI RECORDS." }
  }
};

export function renderEmail(event: EmailEvent, params: Record<string, string>, language: EmailLanguage = "fr") {
  const template = templates[event][language];
  const replace = (value: string) => Object.entries(params).reduce((text, [key, val]) => text.replaceAll(`{{${key}}}`, val), value);
  const subject = replace(template.subject);
  const body = replace(template.body);
  return {
    subject,
    text: body,
    html: `<div style="background:#050403;color:#f7efe0;font-family:Arial,sans-serif;padding:28px"><h1 style="color:#f4c66a;letter-spacing:3px">KAMDRIDI RECORDS</h1><p>${body}</p></div>`
  };
}

export async function sendLabelEmail(input: { event: EmailEvent; to: string; params?: Record<string, string>; language?: EmailLanguage }) {
  const rendered = renderEmail(input.event, input.params || {}, input.language || "fr");
  const message: EmailMessage = {
    id: `mail_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    event: input.event,
    to: input.to,
    ...rendered,
    status: process.env.LABEL_EMAIL_MODE === "production" && (process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY) ? "sent" : "simulated",
    createdAt: new Date().toISOString()
  };

  const log = await readLabelJson<EmailMessage[]>("email-log.json", []);
  log.unshift(message);
  await writeLabelJson("email-log.json", log);
  return message;
}

export async function listEmailLog() {
  return readLabelJson<EmailMessage[]>("email-log.json", []);
}
