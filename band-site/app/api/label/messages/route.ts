import { NextResponse } from "next/server";
import { requireLabelSession } from "@/lib/label-auth";
import { getLabelApplication } from "@/lib/label-storage";
import { getOrCreateConversation, listConversationMessages, listConversationsForEmail, markConversationRead, sendInternalMessage } from "@/label/messaging/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await requireLabelSession();
    const conversationId = new URL(request.url).searchParams.get("conversationId");
    if (conversationId) return NextResponse.json({ messages: await listConversationMessages(conversationId) });
    return NextResponse.json({ conversations: await listConversationsForEmail(session.email) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Messages failed." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireLabelSession();
    const body = (await request.json()) as { artistId: string; toEmail?: string; body: string; conversationId?: string };
    const artist = await getLabelApplication(body.artistId);
    if (!artist) return NextResponse.json({ error: "Artist not found." }, { status: 404 });
    const adminEmail = process.env.LABEL_ADMIN_EMAILS?.split(",")[0] || "contact@kamdridi.com";
    const conversation = body.conversationId
      ? { id: body.conversationId }
      : await getOrCreateConversation({ artistId: artist.id, artistEmail: artist.email, adminEmail });
    const message = await sendInternalMessage({
      conversationId: conversation.id,
      fromEmail: session.email,
      toEmail: body.toEmail || (session.email.toLowerCase() === artist.email.toLowerCase() ? adminEmail : artist.email),
      body: body.body
    });
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Message send failed." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const session = await requireLabelSession();
  const body = (await request.json()) as { conversationId: string };
  return NextResponse.json({ messages: await markConversationRead(body.conversationId, session.email) });
}
