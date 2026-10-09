import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { topic } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY?.trim();
    if (!apiKey) return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 });
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const systemInstruction = `You are the master content strategist for Kam Dridi's dark cinematic rock universe 'Echoes Unearthed'.
Your goal is to generate viral TikTok/Reels content.
Generate a JSON object with two fields:
1. "script": A 15-20 second punchy, highly engaging voiceover script. The tone should be mysterious, intense, or slightly aggressive. Do NOT include any director notes like "[Pause]" or "[Intense music starts]", just the words the female AI voice should speak.
2. "imagePrompt": A highly detailed prompt for an AI image generator to create a stunning background image (cyberpunk, dark cinematic rock, surreal, Kam Dridi aesthetic). Include keywords like 'masterpiece', '8k', 'cinematic lighting'.
Output raw JSON, no markdown formatting.`;

    const userPrompt = topic 
      ? `Create a viral video concept about: ${topic}` 
      : `Create a viral video concept about Kam Dridi's music or the lore of Echoes Unearthed.`;

    let responseText = "";
    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: {
           role: 'system',
           parts: [{ text: systemInstruction }]
        },
        generationConfig: {
           responseMimeType: "application/json",
        }
      });
      responseText = result.response.text();
    } catch (e: any) {
       console.warn("Primary model failed, falling back to gemini-2.5-flash", e.message);
       const fallbackModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
       const fallbackResult = await fallbackModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        systemInstruction: {
           role: 'system',
           parts: [{ text: systemInstruction }]
        },
        generationConfig: {
           responseMimeType: "application/json",
        }
      });
      responseText = fallbackResult.response.text();
    }

    const data = JSON.parse(responseText);

    const encodedPrompt = encodeURIComponent(data.imagePrompt + ", highly detailed, masterpiece, portrait ratio");
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1080&height=1920&nologo=true&seed=${seed}`;

    return NextResponse.json({ 
      script: data.script, 
      imageUrl: imageUrl 
    });

  } catch (error: any) {
    console.error('Content Factory Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
