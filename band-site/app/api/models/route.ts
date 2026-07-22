import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return NextResponse.json({ error: 'No key' }, { status: 500 });
  
  try {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + apiKey);
    const data = await res.json();
    return NextResponse.json({ models: data.models?.map(m => m.name) || data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
