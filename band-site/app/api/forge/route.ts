import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    let rewrittenPrompt = prompt;
    
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== '[SENSITIVE]') {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        
        const rewriteResponse = await model.generateContent(`You are an expert prompt engineer for an AI image generator.
          The user has submitted an idea for a custom Kam Dridi T-Shirt design: "${prompt}".
          
          Your task is to rewrite this prompt so it looks like a masterpiece in Kam Dridi's universe. 
          The style MUST always be: Dark cinematic rock, cyberpunk, grunge, high contrast, cinematic lighting, neo-noir, 
          with deep shadows, glowing amber/red accents, gritty texture, masterpiece, highly detailed.
          It should be centered on a black background so it blends well on a black T-Shirt.
          
          Respond ONLY with the rewritten image generation prompt. No quotes, no intro, no explanation. Just the raw prompt string.`);

        rewrittenPrompt = rewriteResponse.response.text().trim();
      } catch (e) {
        console.warn("Gemini enhancement failed, using fallback:", e);
        rewrittenPrompt = `${prompt}, dark cinematic rock style, cyberpunk, grunge, high contrast, neo-noir, glowing amber and red accents, masterpiece, highly detailed, centered on pitch black background`;
      }
    } else {
      // Fallback if no API key is provided
      rewrittenPrompt = `${prompt}, dark cinematic rock style, cyberpunk, grunge, high contrast, neo-noir, glowing amber and red accents, masterpiece, highly detailed, centered on pitch black background`;
    }

    // Use Pollinations for instant, free image generation based on the rewritten prompt.
    // We use a square aspect ratio (1:1) for T-Shirt prints.
    const encodedPrompt = encodeURIComponent(rewrittenPrompt);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true&model=flux`;

    const creationId = `forge_${Date.now()}_${seed}`;
    const { saveForgeCreation } = await import('@/lib/storage');
    await saveForgeCreation(creationId, prompt, rewrittenPrompt, imageUrl);

    return NextResponse.json({ 
      success: true, 
      imageUrl,
      finalPrompt: rewrittenPrompt 
    });

  } catch (error: any) {
    console.error('Echoes Forge Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
