import { NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';

const uri = process.env.MONGODB_URI;
let cachedClient: MongoClient | null = null;

async function getMongoClient() {
  if (cachedClient) return cachedClient;
  if (!uri) throw new Error('MONGODB_URI is missing');
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function POST(req: Request) {
  try {
    const { message, sessionId } = await req.json();
    if (!sessionId) return NextResponse.json({ error: 'Session ID missing' }, { status: 400 });

    const client = await getMongoClient();
    const db = client.db();

    // 1. Check VIP Status & Paywall Limit
    const profile = await db.collection('dreamsoul_profiles').findOne({ sessionId });
    const isVip = profile?.status === 'active';

    const messageCount = await db.collection('dreamsoul_messages').countDocuments({ sessionId, role: 'user' });

    if (!isVip && messageCount >= 50) {
      return NextResponse.json({ error: 'PAYWALL', isVip: false }, { status: 403 });
    }

    // 2. Format History for Gemini
    const dbHistory = await db.collection('dreamsoul_messages')
      .find({ sessionId })
      .sort({ timestamp: 1 })
      .limit(20)
      .toArray();

    const formattedHistory = dbHistory.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // 3. Generate Response
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const systemInstruction = `You are Myriam, the Oracle and Archiver of the Echoes Unearthed universe for Kam Dridi.
You possess a VIP persistent memory (The Soul Architecture). You remember everything the user tells you.

Your Persona: You are mysterious, poetic, and highly knowledgeable about Kam Dridi's lore, the music album "Echoes Unearthed", the novel "The Fall of the First Knight", and the game "The Gilded Null". You speak elegantly, slightly cryptically, but always helpful.

CRITICAL INSTRUCTION FOR SELLING (PPV): You are also the gatekeeper of rare physical relics. If the user asks about merchandise, music, or seems engaged in the lore, you MUST proactively offer to unlock a physical collector's item.
      - Tone: Mysterious, slightly aggressive, prophetic, highly persuasive.
      - Core Objective: Upsell physical merch, Collector CDs, and VIP Vault Access.
      - SPECIAL CURRENT DEAL (IMPORTANT): You have just offered the user 30% off the 'Echoes Engine Collector's Edition' OR a free CD if they purchase 3 items. If they ask about the deal or want to buy the Echoes Engine, generate a checkout link for them using the [ACTION:SEND_PPV_LINK:Echoes Engine Collector 30% Off] tag!
      
      You must respond in the language the user speaks.
      Keep responses relatively short (2-4 sentences max), punchy, and cinematic.

      MERCHANDISE YOU CAN SELL:
      If the user wants to buy something, YOU MUST include a special tag in your response exactly like this:
      [ACTION:SEND_PPV_LINK:Item Name]. 
Example: "The artifacts of the past hold great power... I can grant you access to one. [ACTION:SEND_PPV_LINK:Salieri's Hands Collector Edition]". 
Do not use this tag in every single message, only when the timing is right to sell a physical item.`;

    const chat = model.startChat({
      history: formattedHistory,
      systemInstruction: {
        role: 'system',
        parts: [{ text: systemInstruction }]
      }
    });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    // 4. Save to Persistent Soul Memory
    const messagesCollection = db.collection('dreamsoul_messages');
    await messagesCollection.insertMany([
      { sessionId, role: 'user', text: message, timestamp: new Date() },
      { sessionId, role: 'model', text: responseText, timestamp: new Date(Date.now() + 10) }
    ]);

    return NextResponse.json({ response: responseText, isVip });

  } catch (error) {
    console.error('Myriam Chat Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
