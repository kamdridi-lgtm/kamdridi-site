import { NextResponse } from "next/server";
import { requireLabelSession } from "@/lib/label-auth";
import { getLabelApplication } from "@/lib/label-storage";
import { getOrCreateConversation, listConversationMessages, listConversationsForEmail, markConversationRead, sendInternalMessage } from "@/label/messaging/chat";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function adminEmails() {
  return (process.env.LABEL_ADMIN_EMAILS || "contact@kamdridi.com").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
}
async function authorizedConversation(email:string, conversationId:string) {
  const conversations = await listConversationsForEmail(email);
  return conversations.some((conversation) => conversation.id === conversationId);
}

export async function GET(request: Request) {
  try {
    const session = await requireLabelSession();
    const conversationId = new URL(request.url).searchParams.get("conversationId");
    if (conversationId) {
      if (!(await authorizedConversation(session.email, conversationId))) return NextResponse.json({ error: "Access denied." }, { status: 403 });
      return NextResponse.json({ messages: await listConversationMessages(conversationId) });
    }
    return NextResponse.json({ conversations: await listConversationsForEmail(session.email) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Messages failed." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireLabelSession();
    const body = (await request.json()) as { artistId: string; body: string; conversationId?: string };
    const artist = await getLabelApplication(body.artistId);
    if (!artist) return NextResponse.json({ error: "Artist not found." }, { status: 404 });
    const isAdmin = adminEmails().includes(session.email.toLowerCase());
    const isArtist = session.email.toLowerCase() === artist.email.toLowerCase();
    if (!isAdmin && !isArtist) return NextResponse.json({ error: "Access denied." }, { status: 403 });
    const adminEmail = adminEmails()[0];
    if (body.conversationId && !(await authorizedConversation(session.email, body.conversationId))) return NextResponse.json({ error: "Access denied." }, { status: 403 });
    const conversation = body.conversationId ? { id: body.conversationId } : await getOrCreateConversation({ artistId: artist.id, artistEmail: artist.email, adminEmail });
    const message = await sendInternalMessage({
      conversationId: conversation.id,
      fromEmail: session.email,
      toEmail: isArtist ? adminEmail : artist.email,
      body: body.body
    });
    return NextResponse.json({ message });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Message send failed." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireLabelSession();
    const body = (await request.json()) as { conversationId: string };
    if (!(await authorizedConversation(session.email, body.conversationId))) return NextResponse.json({ error: "Access denied." }, { status: 403 });
    return NextResponse.json({ messages: await markConversationRead(body.conversationId, session.email) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Message update failed." }, { status: 500 });
  }
}
