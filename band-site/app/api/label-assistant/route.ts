import { NextResponse } from "next/server";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

const SUBMISSION_EMAIL = "kamdridi@proton.me";
const SUBMISSION_MAILTO = "mailto:kamdridi@proton.me?subject=Artist Submission - KAMDRIDI RECORDS";
const LICENSING_MAILTO = "mailto:kamdridi@proton.me?subject=Licensing Inquiry - KAMDRIDI RECORDS";
const ARTIST_SERVICES_ROUTE = "/label/artist-services";
const MAX_MESSAGES = 12;
const MAX_MESSAGE_LENGTH = 900;
const SERVICE_TIERS =
  "Starter is $499 CAD for artistic review, release direction, a basic release plan, branding/image notes, a distribution checklist, and a written recommendation summary. Pro is $999 CAD and adds complete release strategy, artist bio/pitch improvement, a 30-day content plan, visual direction notes, press kit preparation, and stronger rollout guidance. Premium/Executive is $1,999 CAD and adds complete artistic direction, a 60-90 day rollout plan, sync/licensing readiness, catalogue/song audit, international positioning, and a creative business plan.";

function cleanText(value: unknown) {
  return typeof value === "string" ? value.replace(/[<>]/g, "").trim().slice(0, MAX_MESSAGE_LENGTH) : "";
}

function normalizeMessages(value: unknown): ChatMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .slice(-MAX_MESSAGES)
    .map((message) => {
      if (!message || typeof message !== "object") return null;
      const record = message as Record<string, unknown>;
      const role = record.role === "assistant" || record.role === "system" ? record.role : "user";
      const content = cleanText(record.content);
      return content ? ({ role, content } as ChatMessage) : null;
    })
    .filter((message): message is ChatMessage => Boolean(message));
}

function fallbackReply(question: string) {
  const q = question.toLowerCase();

  if (/(buy.*label deal|buy.*deal|can i buy.*deal)/.test(q)) {
    return `No. Paid services do not buy a label deal. Label partnerships are by selection only and require written terms.`;
  }

  if (/(what packages|packages available|artist development package|development package|available package|service tier|artist service|starter|pro|premium|executive)/.test(q)) {
    return `${SERVICE_TIERS}

Artist services are separate from label partnership review. More details: ${ARTIST_SERVICES_ROUTE}. To request services, email ${SUBMISSION_EMAIL} or use /submit.`;
  }

  if (/(payment|stripe|checkout|buy package|buy|price|pricing|cost|package|fee|pay|paid|cad|\$)/.test(q)) {
    return `${SERVICE_TIERS}

There are no public checkout buttons right now. Paid work should be confirmed in writing first. Contact ${SUBMISSION_EMAIL}.`;
  }

  if (/(licens|sync|film|trailer|game|advertis|media placement|visual media)/.test(q)) {
    return `Yes, licensing and sync inquiries can be sent to ${SUBMISSION_EMAIL} with usage details, deadline, territory, media type, and budget. No placements are claimed or guaranteed.

Contact: ${SUBMISSION_EMAIL}
Licensing inquiry: ${LICENSING_MAILTO}`;
  }

  if (/(release|releases|catalog|catalogue|dust on the altar|war machines)/.test(q)) {
    return `Confirmed releases are listed on /releases when real public links and details are available. The current page includes Dust on the Altar by IRON COUNTY GHOSTS and a KAM DRIDI / War Machines release entry.`;
  }

  if (/(route|page|where|links|roster page|submit page)/.test(q)) {
    return `Useful KAMDRIDI RECORDS pages:

Artist Services: ${ARTIST_SERVICES_ROUTE}
Roster: /roster
Releases: /releases
Submit Music: /submit
Label: /label
IRON COUNTY GHOSTS: /iron-county-ghosts

For direct submissions, email ${SUBMISSION_EMAIL}.`;
  }
  if (/(how do i contact|contact the label|contact details|email the label)/.test(q)) {
    return `Contact KAMDRIDI RECORDS at ${SUBMISSION_EMAIL}. Submissions go through /submit or by direct email. Artist services details are at ${ARTIST_SERVICES_ROUTE}.`;
  }

  if (/(submit|submission|send|demo|music|song|apply|email|contact)/.test(q)) {
    return `To submit music, use /submit or email ${SUBMISSION_EMAIL}. Send artist name, country/city, music links, short bio, goal, what you need help with, budget range if comfortable, release timeline, and press kit or images if available.

Email: ${SUBMISSION_EMAIL}
Submit Music: ${SUBMISSION_MAILTO}

Submissions are reviewed manually. Nothing starts unless both sides agree in writing.`;
  }

  if (/(sign|signed|deal|contract|agreement|partnership|single|label deal|rights|split|master|publishing|legal)/.test(q)) {
    return `Paid services do not buy a label deal. Label partnerships are by selection only and require written terms. Nothing starts until both sides agree in writing.`;
  }

  if (/(guarantee|stream|playlist|radio|booking|income|sales|viral|success|money|pay me)/.test(q)) {
    return `No. KAMDRIDI RECORDS does not guarantee fame, streams, playlist placement, record deals, sync placements, revenue, or commercial success. The work helps artists structure, package, improve, and present their music professionally.`;
  }

  if (/\b(ai|virtual|fictional|generated)\b/.test(q)) {
    return `IRON COUNTY GHOSTS is part of the KAMDRIDI creative and label ecosystem. Any public AI-assisted wording should be intentional, accurate, and approved before publishing.`;
  }

  if (/(roster|artist|iron county|kam dridi|who is on|current)/.test(q)) {
    return `KAMDRIDI RECORDS is connected to KAM DRIDI, and IRON COUNTY GHOSTS is the first official label project / roster example. See /roster for confirmed public roster details.`;
  }

  if (/(what kind|genre|accept|looking for|style|type)/.test(q)) {
    return `KAMDRIDI RECORDS is most interested in rock, country-rock, dark country, outlaw Americana, cinematic music, strong visual artist projects, and artist-driven concepts.

The label looks at artist identity, music quality, visuals, work ethic, and release potential. You can submit music to ${SUBMISSION_EMAIL}.`;
  }

  return `KAMDRIDI RECORDS is a boutique creative label and artist services imprint connected to KAM DRIDI. It focuses on serious artists, strong identity, release planning, and selected partnership review.

I can help with submissions, Starter/Pro/Premium services, roster questions, releases, licensing inquiries, and contact details. Artist services: ${ARTIST_SERVICES_ROUTE}. Email ${SUBMISSION_EMAIL}.`;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { messages?: unknown };
    const messages = normalizeMessages(body.messages);
    const latestUserMessage = [...messages].reverse().find((message) => message.role === "user");

    if (!latestUserMessage) {
      return NextResponse.json({ reply: "Ask me about submissions, pricing, artist development packages, or label deals." });
    }

    return NextResponse.json({ reply: fallbackReply(latestUserMessage.content) });
  } catch {
    return NextResponse.json(
      { reply: "I could not read that message. Please ask about submissions, pricing, artist packages, or label deals." },
      { status: 400 }
    );
  }
}
