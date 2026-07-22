'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function MyriamWidget() {
  const [showWidget, setShowWidget] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const triggerWidget = () => {
      setShowWidget(true);
      
      // Speak the message
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        const synth = window.speechSynthesis;
        const msg = "Welcome to the Vault. Today only, unlock 30% off the Echoes Engine Collector's Edition. Or secure any 3 items, and I will grant you a free CD.";
        
        try {
          const utterance = new SpeechSynthesisUtterance(msg);
          const voices = synth.getVoices();
          const femaleVoice = voices.find(v => 
            v.name.includes('Female') || v.name.includes('Samantha') || v.name.includes('Google UK English Female') || v.name.includes('Zira')
          );
          if (femaleVoice) utterance.voice = femaleVoice;
          
          utterance.pitch = 0.8;
          utterance.rate = 0.9;
          
          synth.cancel();
          synth.speak(utterance);
        } catch (e) {
          console.error("Speech synthesis error", e);
        }
      }
    };

    // Listen for custom event from the nav bar
    document.addEventListener('openMyriamWidget', triggerWidget);
    
    return () => {
      document.removeEventListener('openMyriamWidget', triggerWidget);
    };
  }, []);

  // If we are already on the Myriam page, don't show the global widget
  if (pathname === '/myriam') return null;

  if (!showWidget) return null;

  return (
    <div className="fixed right-4 top-20 z-[9999] w-80 animate-in slide-in-from-top-10 fade-in duration-700">
      <div className="relative overflow-hidden rounded-2xl border border-[#f4a33f]/50 bg-[#0a0705]/95 p-4 shadow-[0_20px_50px_rgba(201,82,16,0.4)] backdrop-blur-md">
        <button 
          onClick={() => setShowWidget(false)}
          className="absolute right-3 top-3 text-stone-400 hover:text-[#f4c66a]"
        >
          ✕
        </button>
        
        <div className="relative mb-4 h-48 w-full overflow-hidden rounded-xl border border-[#f4a33f]/30 shadow-[0_0_15px_rgba(244,163,63,0.15)]">
          <Image 
            src="/myriam.jpg" 
            alt="Myriam" 
            fill 
            sizes="(max-width: 768px) 100vw, 320px"
            className="object-cover object-top" 
          />
          <div className="absolute right-3 top-3 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#f4c66a] opacity-75"></span>
            <span className="relative inline-flex h-3 w-3 rounded-full bg-[#f4c66a]"></span>
          </div>
        </div>
        
        <div>
          <h3 className="font-display text-sm uppercase tracking-[0.1em] text-[#f4c66a]">Myriam / Oracle</h3>
          <p className="mt-2 text-xs leading-relaxed text-stone-300">
            Welcome to the Vault. Today only, unlock 30% off the Echoes Engine Collector's Edition.
          </p>
        </div>
        
        <div className="mt-4">
          <Link
            href="/myriam"
            onClick={() => setShowWidget(false)}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[linear-gradient(180deg,#d66a16,#8f3208)] py-2.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition hover:brightness-125"
          >
            ✨ Consult the Oracle
          </Link>
        </div>
      </div>
    </div>
  );
}
