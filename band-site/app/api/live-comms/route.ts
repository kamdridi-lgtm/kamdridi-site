import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const root = process.cwd();
const commsPath = path.join(root, 'data', 'live-comms.json');

type Message = {
  id: string;
  text: string;
  timestamp: string;
};

async function getMessages(): Promise<Message[]> {
  try {
    const data = await fs.readFile(commsPath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function saveMessages(messages: Message[]) {
  await fs.mkdir(path.dirname(commsPath), { recursive: true });
  await fs.writeFile(commsPath, JSON.stringify(messages, null, 2), 'utf8');
}

export async function GET() {
  const messages = await getMessages();
  return NextResponse.json({ messages });
}

export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    const messages = await getMessages();
    
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      text,
      timestamp: new Date().toISOString()
    };
    
    messages.push(newMessage);
    
    if (messages.length > 50) {
      messages.shift();
    }
    
    await saveMessages(messages);
    return NextResponse.json({ success: true, message: newMessage });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE() {
  await saveMessages([]);
  return NextResponse.json({ success: true });
}
