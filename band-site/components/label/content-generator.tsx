"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Play, Video, Download } from "lucide-react";

export function ContentGenerator() {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ script: string; imageUrl: string } | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const imageRef = useRef<HTMLImageElement>(null);

  const generateContent = async () => {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/studio/content-factory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (data.imageUrl && data.script) {
        setResult(data);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const playPreview = () => {
    if (!synth || !result) return;
    
    synth.cancel();
    
    const utterance = new SpeechSynthesisUtterance(result.script);
    let voices = synth.getVoices();
    
    if (voices.length === 0) {
      synth.onvoiceschanged = () => {
         voices = synth.getVoices();
         assignFemaleVoice(utterance, voices);
         synth.speak(utterance);
      };
      return;
    }

    assignFemaleVoice(utterance, voices);
    utterance.pitch = 0.9;
    utterance.rate = 1.0;
    
    utterance.onstart = () => setIsPlaying(true);
    utterance.onend = () => setIsPlaying(false);
    
    synth.speak(utterance);
  };

  const assignFemaleVoice = (utterance: SpeechSynthesisUtterance, voices: SpeechSynthesisVoice[]) => {
    const femaleNames = ['Zira', 'Hazel', 'Samantha', 'Victoria', 'Karen', 'Tessa', 'Moira', 'Google UK English Female', 'Female'];
    const femaleVoice = voices.find(v => 
      femaleNames.some(name => v.name.toLowerCase().includes(name.toLowerCase()))
    ) || voices.find(v => !v.name.toLowerCase().includes('david') && !v.name.toLowerCase().includes('mark') && !v.name.toLowerCase().includes('male')) || voices[0];
      
    if (femaleVoice) utterance.voice = femaleVoice;
  };

  useEffect(() => {
    return () => {
      if (synth) synth.cancel();
    };
  }, [synth]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="label-panel">
        <p className="text-xs uppercase tracking-[0.28em] text-[#f4c66a]">Factory Controls</p>
        <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
          Social Robot
        </h2>
        <p className="mt-4 text-sm leading-7 text-stone-400">
          Generate a viral TikTok/Reel. The AI will write the hook, generate the visual asset, and synthesize the voiceover.
        </p>

        <div className="mt-8 grid gap-4">
          <input
            type="text"
            placeholder="Optional Topic (e.g. The Gilded Null lore, Tour dates)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="label-input"
          />
          <button
            onClick={generateContent}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-lg bg-[#f4c66a] px-5 py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-[#ffd989] disabled:opacity-50"
          >
            {loading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Video className="h-4 w-4" />}
            {loading ? "Synthesizing Assets..." : "Generate Viral Post"}
          </button>
        </div>
      </div>

      <div className="label-panel flex flex-col items-center justify-center">
        {result ? (
          <div className="w-full max-w-sm">
            <div className="relative aspect-[9/16] w-full overflow-hidden rounded-2xl border border-[#f4c66a]/20 shadow-[0_20px_50px_rgba(244,198,106,0.15)]">
              <Image 
                ref={imageRef}
                src={result.imageUrl} 
                alt="Generated TikTok Asset" 
                fill 
                className={`object-cover transition-all duration-700 ${isPlaying ? 'scale-105 saturate-150' : 'scale-100'}`} 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              
              <div className="absolute inset-x-0 bottom-0 p-6 pointer-events-none">
                <p className="text-sm font-semibold leading-relaxed text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  "{result.script}"
                </p>
              </div>

              {/* Play Button Overlay */}
              <button
                onClick={playPreview}
                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-[#f4c66a] backdrop-blur-md transition hover:scale-110 hover:bg-[#f4c66a] hover:text-black border border-[#f4c66a]/50"
              >
                <Play className="h-8 w-8 ml-1" />
              </button>
            </div>
            <div className="mt-4 flex gap-4">
                <button onClick={playPreview} className="label-action flex-1">Preview Audio</button>
                <a href={result.imageUrl} target="_blank" download className="label-action flex-1 flex items-center justify-center gap-2">
                    <Download className="h-4 w-4" /> Image Asset
                </a>
            </div>
          </div>
        ) : (
          <div className="flex aspect-[9/16] w-full max-w-sm flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 bg-black/30 p-8 text-center">
            <Video className="mb-4 h-12 w-12 text-stone-600" />
            <p className="text-sm text-stone-500">Video Canvas</p>
            <p className="mt-2 text-xs text-stone-600">Assets will appear here after generation.</p>
          </div>
        )}
      </div>
    </div>
  );
}
