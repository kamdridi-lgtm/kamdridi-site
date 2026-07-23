"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Trash2, Terminal } from "lucide-react";

export default function AdminLiveComms() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [messagesCount, setMessagesCount] = useState(0);

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/live-comms");
      const data = await res.json();
      if (data.messages) setMessagesCount(data.messages.length);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const broadcast = async () => {
    if (!text.trim()) return;
    setStatus("Broadcasting...");
    try {
      const res = await fetch("/api/live-comms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      if (res.ok) {
        setText("");
        setStatus("Broadcast sent successfully.");
        fetchStats();
      } else {
        setStatus("Error broadcasting.");
      }
    } catch (e) {
      setStatus("Error broadcasting.");
    }
    setTimeout(() => setStatus(""), 3000);
  };

  const clearTerminal = async () => {
    if (!confirm("Are you sure you want to clear all active broadcasts?")) return;
    setStatus("Clearing...");
    try {
      await fetch("/api/live-comms", { method: "DELETE" });
      setStatus("Terminal cleared.");
      fetchStats();
    } catch (e) {
      setStatus("Error clearing.");
    }
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <div className="mx-auto max-w-4xl">
        <Link href="/label/admin" className="inline-flex items-center gap-2 text-[#f4c66a] hover:text-white transition mb-6 text-sm uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Factory Level 3</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] md:text-7xl mb-12">
          Live Comms
          <br />
          Console
        </h1>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="label-panel">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#f4c66a] flex items-center gap-2">
                <Terminal className="h-4 w-4" /> Broadcast Input
              </h2>
            </div>
            
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type your transmission here... Fans will see it instantly on /live."
              className="w-full h-48 bg-black/50 border border-white/20 rounded-xl p-4 text-stone-200 focus:border-[#f4c66a] focus:ring-1 focus:ring-[#f4c66a] outline-none resize-none"
            />

            <div className="mt-4 flex items-center justify-between">
              <p className="text-xs text-stone-500">{status}</p>
              <button
                onClick={broadcast}
                className="flex items-center gap-2 rounded-lg bg-[linear-gradient(180deg,#d66a16,#8f3208)] px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:brightness-110 border border-[#f4a33f]/70"
              >
                <Send className="h-4 w-4" /> Broadcast
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="label-panel">
              <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-500 mb-4">Terminal Status</h2>
              <div className="bg-black/40 border border-white/10 rounded-xl p-4 text-center">
                <span className="block text-4xl font-display text-[#f4c66a] mb-1">{messagesCount}</span>
                <span className="text-[10px] uppercase tracking-widest text-stone-400">Active Broadcasts</span>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                <Link href="/live" target="_blank" className="label-action text-center block w-full">
                  View Public Terminal
                </Link>
                <button
                  onClick={clearTerminal}
                  className="flex items-center justify-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs font-bold uppercase tracking-widest text-red-500 transition hover:bg-red-500/20"
                >
                  <Trash2 className="h-4 w-4" /> Clear All
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
