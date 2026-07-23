"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Terminal } from "lucide-react";

type Message = {
  id: string;
  text: string;
  timestamp: string;
};

export default function LiveCommsTerminal() {
  const [messages, setMessages] = useState<Message[]>([]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/live-comms");
      const data = await res.json();
      if (data.messages && JSON.stringify(data.messages) !== JSON.stringify(messages)) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [messages]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="relative min-h-[100dvh] bg-[#050403] text-[#f4c66a] font-mono overflow-hidden">
      {/* CRT Effects */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-40 opacity-50"></div>
      <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.9)] z-30"></div>

      <header className="relative z-20 flex items-center justify-between border-b border-[#f4c66a]/30 bg-black/80 px-4 py-4 md:px-8">
        <div className="flex items-center gap-3">
          <Terminal className="h-5 w-5" />
          <h1 className="text-xs md:text-sm uppercase tracking-[0.3em] font-bold">Echoes Terminal</h1>
        </div>
        <div className="flex items-center gap-4 text-[10px] md:text-xs uppercase tracking-widest">
          <Link href="/" className="hover:text-white transition">Exit</Link>
          <span className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-3 py-1 rounded-full text-red-500 font-bold">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            LIVE
          </span>
        </div>
      </header>

      <main className="relative z-10 flex flex-col h-[calc(100dvh-65px)] p-6 md:p-12 overflow-y-auto">
        <div className="max-w-3xl w-full mx-auto space-y-8">
          <div className="mb-8 border-b border-[#f4c66a]/20 pb-4">
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-70">Establishing secure connection...</p>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-70 mt-1">Connection established.</p>
            <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-70 mt-1">Awaiting broadcasts from KAMDRIDI.</p>
          </div>

          {messages.length === 0 ? (
            <div className="opacity-50 animate-pulse text-sm">
              &gt; No active transmissions...
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="group flex flex-col gap-2">
                <div className="text-[10px] uppercase tracking-[0.2em] opacity-50 flex items-center gap-2">
                  <span className="bg-[#f4c66a]/20 text-[#f4c66a] px-2 py-0.5 font-bold">SYSTEM_BROADCAST</span>
                  <span>[{new Date(msg.timestamp).toLocaleTimeString()}]</span>
                </div>
                <div className="text-sm md:text-base leading-loose whitespace-pre-wrap pl-4 border-l-2 border-[#f4c66a]/50 py-2 group-hover:border-[#f4c66a] transition-colors text-stone-200">
                  {msg.text}
                </div>
              </div>
            ))
          )}
          <div ref={terminalEndRef} className="h-10 pt-4">
            <span className="animate-[pulse_1s_step-end_infinite] font-bold text-2xl">_</span>
          </div>
        </div>
      </main>
    </div>
  );
}
