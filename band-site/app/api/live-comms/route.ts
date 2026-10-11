import { NextResponse } from "next/server";
import { readLabelJson, writeLabelJson } from "@/label/core/json_store";
import { requireLabelAdmin } from "@/lib/label-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Message = { id: string; text: string; timestamp: string };

async function getMessages() {
  return readLabelJson<Message[]>("live-comms.json", []);
}
async function saveMessages(messages: Message[]) {
  return writeLabelJson("live-comms.json", messages);
}

export async function GET() {
  return NextResponse.json({ messages: await getMessages() });
}

export async function POST(req: Request) {
  try {
    await requireLabelAdmin();
    const body = await req.json();
    const text = String(body.text || "").trim();
    if (!text) return NextResponse.json({ error: "Message required." }, { status: 400 });
    const messages = await getMessages();
    const message = { id: crypto.randomUUID(), text: text.slice(0, 2000), timestamp: new Date().toISOString() };
    await saveMessages([...messages, message].slice(-50));
    return NextResponse.json({ success: true, message });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Broadcast failed." }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await requireLabelAdmin();
    await saveMessages([]);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Clear failed." }, { status: 500 });
  }
}
