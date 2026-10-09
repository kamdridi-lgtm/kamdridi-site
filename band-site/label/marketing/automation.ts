import { slugify } from "@/label/core/json_store";

export type SocialPost = {
  channel: "instagram" | "tiktok" | "x" | "facebook";
  caption: string;
  scheduledFor: string;
};

export function generatePreSaveLink(input: { artistName: string; title: string; releaseDate: string }) {
  return `https://kamdridi.com/label/presave/${slugify(`${input.artistName}-${input.title}-${input.releaseDate}`)}`;
}

export function generateReleaseSocialPosts(input: { artistName: string; title: string; releaseDate: string }) {
  const date = new Date(input.releaseDate);
  const offsets = [7, 3, 1, 0];
  return offsets.flatMap((daysBefore): SocialPost[] => {
    const scheduled = new Date(date);
    scheduled.setDate(date.getDate() - daysBefore);
    const lead = daysBefore === 0 ? "OUT NOW" : `${daysBefore} DAYS`;
    const caption = `${lead}: ${input.artistName} - ${input.title}. A KAMDRIDI RECORDS release. Pre-save: ${generatePreSaveLink(input)}`;
    return [
      { channel: "instagram", caption, scheduledFor: scheduled.toISOString() },
      { channel: "tiktok", caption, scheduledFor: scheduled.toISOString() }
    ];
  });
}

export function generateMilestonePost(input: { artistName: string; title: string; streams: number }) {
  const milestone = input.streams >= 100000 ? "100K" : input.streams >= 10000 ? "10K" : "1K";
  return `${milestone} streams for ${input.artistName} - ${input.title}. The signal is spreading. #KAMDRIDIRecords`;
}

export function buildFanEmailCampaign(input: { artistName: string; title: string; preSaveUrl: string }) {
  return {
    subject: `${input.artistName} joins the KAMDRIDI signal`,
    preview: `Pre-save ${input.title} now.`,
    html: `<h1>${input.title}</h1><p>New KAMDRIDI RECORDS release from ${input.artistName}.</p><a href="${input.preSaveUrl}">Pre-save</a>`
  };
}

export function generateQrCodePayload(url: string) {
  return `KAMDRIDI_RECORDS_QR:${url}`;
}
