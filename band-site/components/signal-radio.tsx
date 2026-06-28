"use client";

import { Radio, Volume2, Waves } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type RadioTrack = {
  title: string;
  frequency: string;
  src: string;
};

const radioTracks: RadioTrack[] = [
  {
    title: "War Machines",
    frequency: "87.7",
    src: "/audio/radio/war-machines-chorus.wav"
  },
  {
    title: "Too Fast Too Young",
    frequency: "91.3",
    src: "/audio/radio/too-fast-too-young-chorus.wav"
  },
  {
    title: "Our Lost Dreams",
    frequency: "104.9",
    src: "/audio/radio/our-lost-dreams-chorus.wav"
  }
];

const staticDurationMs = 1250;

export function SignalRadio() {
  const [started, setStarted] = useState(false);
  const [tuning, setTuning] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [status, setStatus] = useState("PRESS HERE TO CATCH THE SIGNAL");
  const [signalMode, setSignalMode] = useState<"idle" | "drift" | "locked" | "missing">("idle");
  const [missingSignal, setMissingSignal] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const noiseRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = "auto";
    audioRef.current.volume = 0.72;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      audioRef.current?.pause();
      noiseRef.current?.close().catch(() => {});
    };
  }, []);

  function playStatic() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();
    const bufferSize = ctx.sampleRate * 0.22;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i += 1) {
      output[i] = (Math.random() * 2 - 1) * 0.2;
    }

    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 1100 + Math.random() * 1700;
    gain.gain.value = 0.16;
    source.buffer = buffer;
    source.loop = true;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    source.start();
    noiseRef.current = ctx;

    window.setTimeout(() => {
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
      window.setTimeout(() => ctx.close().catch(() => {}), 320);
    }, staticDurationMs - 260);
  }

  async function tuneTo(index: number) {
    const nextTrack = radioTracks[index];
    const audio = audioRef.current;
    if (!audio) return;

    setStarted(true);
    setTuning(true);
    setMissingSignal(false);
    setSignalMode("drift");
    setStatus(`SCANNING FM ${nextTrack.frequency}`);
    audio.pause();
    playStatic();

    timerRef.current = window.setTimeout(async () => {
      audio.src = nextTrack.src;
      audio.currentTime = 0;

      try {
        await audio.play();
        setTrackIndex(index);
        setTuning(false);
        setSignalMode("locked");
        setStatus(`LOCKED: ${nextTrack.title}`);
      } catch {
        setTrackIndex(index);
        setTuning(false);
        setMissingSignal(true);
        setSignalMode("missing");
        setStatus(`SIGNAL SOURCE MISSING: ${nextTrack.title}`);
      }
    }, staticDurationMs);
  }

  function handlePress() {
    const nextIndex = started ? (trackIndex + 1) % radioTracks.length : 0;
    void tuneTo(nextIndex);
  }

  return (
    <div className="signal-radio-shell mt-5 max-w-2xl overflow-hidden border border-[#c98542]/35 bg-[#050302]/78 shadow-[0_22px_70px_rgba(0,0,0,0.48)] backdrop-blur-md">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(244,198,106,0.1),transparent_22%,rgba(141,5,8,0.08)_62%,transparent)]" />
      <div className="pointer-events-none absolute left-7 top-0 h-6 w-px -translate-y-full bg-[#c98542]/55 shadow-[0_0_18px_rgba(244,198,106,0.6)]" />
      <div className="signal-static-bolt signal-static-bolt-a" />
      <div className="signal-static-bolt signal-static-bolt-b" />
      <div className="signal-static-bolt signal-static-bolt-c" />

      <div className="relative grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3 text-[#f4c66a]">
            <span className="relative inline-flex h-9 w-9 items-center justify-center border border-[#c98542]/45 bg-black/50">
              <Radio className="h-4 w-4" />
              <span
                className={`absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full ${
                  signalMode === "locked"
                    ? "bg-[#f4c66a] shadow-[0_0_18px_rgba(244,198,106,0.95)]"
                    : signalMode === "missing"
                      ? "bg-red-500 shadow-[0_0_18px_rgba(255,48,48,0.8)]"
                      : "bg-[#8f5728] shadow-[0_0_12px_rgba(201,133,66,0.45)]"
                }`}
              />
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.34em]">KAMDRIDI Signal Radio</p>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.26em] text-stone-500">
                {signalMode === "locked" ? "SIGNAL LOCKED" : signalMode === "missing" ? "SIGNAL LOST" : tuning ? "SIGNAL DRIFT" : "STANDBY"}
              </p>
            </div>
          </div>
          <p className={`mt-3 text-sm uppercase tracking-[0.18em] text-stone-200 ${tuning ? "signal-text-drift" : ""}`}>
            {status}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <span className="h-2 w-2 rounded-full bg-[#f4c66a] shadow-[0_0_16px_rgba(244,198,106,0.9)]" />
            <div className="relative h-8 flex-1 overflow-hidden border border-white/10 bg-black/40">
              <div className="absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(90deg,rgba(244,198,106,0.16)_0_1px,transparent_1px_14px)]" />
              <div className="absolute left-[12%] top-0 h-full w-px bg-[#8f5728]/70" />
              <div className="absolute left-[44%] top-0 h-full w-px bg-[#8f5728]/70" />
              <div className="absolute left-[78%] top-0 h-full w-px bg-[#8f5728]/70" />
              <div
                className={`absolute top-1/2 h-1 -translate-y-1/2 bg-[linear-gradient(90deg,#8f3208,#f4c66a,#8f3208)] shadow-[0_0_18px_rgba(244,198,106,0.58)] ${
                  tuning ? "animate-[radioScan_0.75s_linear_infinite]" : "left-[18%] w-2/3"
                }`}
              />
              <div className={`signal-needle ${tuning ? "signal-needle-scan" : ""}`} />
            </div>
            <span className="font-mono text-xs text-[#e8b777]">{radioTracks[trackIndex].frequency} FM</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-[9px] uppercase tracking-[0.18em] text-stone-500">
            <span className="border border-white/10 bg-black/30 px-2 py-1">AM/FM</span>
            <span className="border border-white/10 bg-black/30 px-2 py-1">Echoes</span>
            <span className="border border-white/10 bg-black/30 px-2 py-1">Manual Tune</span>
          </div>
          {missingSignal ? (
            <p className="mt-2 text-xs leading-5 text-stone-500">
              Add the chorus files in <span className="font-mono text-stone-300">public/audio/radio/</span>.
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={handlePress}
          className="relative inline-flex min-h-14 shrink-0 items-center justify-center gap-3 overflow-hidden border border-[#f4a33f]/70 bg-[linear-gradient(180deg,#d66a16,#8f3208)] px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-white shadow-[0_14px_45px_rgba(201,82,16,0.28)] transition hover:-translate-y-0.5 hover:border-[#ffd18a] sm:min-w-44"
        >
          <span className="pointer-events-none absolute inset-0 opacity-45 [background-image:linear-gradient(110deg,transparent,rgba(255,255,255,0.22),transparent)] signal-button-sheen" />
          {started ? <Waves className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          {started ? "Change Station" : "Press Here"}
        </button>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
