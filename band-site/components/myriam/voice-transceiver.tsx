"use client";

import { useState, useEffect, useRef } from "react";
import { Mic, Loader2, Radio } from "lucide-react";
import clsx from "clsx";

interface VoiceTransceiverProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export function VoiceTransceiver({ onTranscript, disabled }: VoiceTransceiverProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Initialize Web Speech API
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US"; // Fallback to auto-detect by not forcing if possible, but en-US is safer for default.
      
      recognition.onstart = () => {
        setIsListening(true);
        setTranscript("");
      };

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const startListening = () => {
    if (disabled || !recognitionRef.current) return;
    try {
      recognitionRef.current.start();
    } catch (e) {
      // Already started
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    if (transcript.trim()) {
      onTranscript(transcript.trim());
      setTranscript("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8">
      {/* Visualizer / Status */}
      <div className="mb-8 flex h-16 w-full max-w-sm items-center justify-center overflow-hidden rounded-2xl border border-[#f4c66a]/20 bg-black/50 p-4 shadow-[0_0_30px_rgba(244,198,106,0.1)]">
        {isListening ? (
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div 
                key={i} 
                className="w-1.5 rounded-full bg-[#f4c66a] animate-pulse"
                style={{ 
                  height: `${Math.random() * 24 + 8}px`,
                  animationDuration: `${Math.random() * 0.5 + 0.3}s`,
                  animationDelay: `${Math.random() * 0.2}s`
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-3 text-stone-500">
            <Radio className="h-5 w-5" />
            <span className="text-xs uppercase tracking-widest">Hold to Transmit</span>
          </div>
        )}
      </div>

      {/* Interim Transcript */}
      <div className="mb-12 h-12 text-center text-sm font-medium text-stone-300 px-4">
        {transcript && <span className="animate-pulse">{transcript}...</span>}
      </div>

      {/* PTT Button */}
      <button
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onMouseLeave={stopListening}
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        disabled={disabled}
        className={clsx(
          "relative flex h-32 w-32 items-center justify-center rounded-full border-4 transition-all duration-300",
          isListening 
            ? "border-[#f4c66a] bg-[#f4c66a]/20 scale-95 shadow-[0_0_50px_rgba(244,198,106,0.6)]" 
            : "border-[#f4c66a]/50 bg-black/60 hover:border-[#f4c66a] hover:bg-[#f4c66a]/10 hover:shadow-[0_0_30px_rgba(244,198,106,0.3)]",
          disabled && "opacity-50 grayscale cursor-not-allowed"
        )}
      >
        <div className={clsx(
          "absolute inset-0 rounded-full transition-all duration-1000",
          isListening ? "bg-[#f4a33f] opacity-30 blur-2xl animate-ping" : "opacity-0"
        )} />
        <Mic className={clsx("relative z-10 h-10 w-10 transition-colors", isListening ? "text-[#f4c66a]" : "text-stone-400")} />
      </button>
      
      <p className="mt-6 text-[10px] uppercase tracking-[0.2em] text-[#f4c66a]/70">
        {isListening ? "Recording..." : "Push to Talk"}
      </p>
    </div>
  );
}
