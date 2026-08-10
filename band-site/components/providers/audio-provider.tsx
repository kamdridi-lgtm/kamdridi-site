"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { radioTracks as catalogTracks, type RadioTrack as CatalogTrack } from "@/lib/radio-catalog";

export type RadioTrack = CatalogTrack & { src: string };

export const radioTracks: RadioTrack[] = catalogTracks.map((track) => ({
  ...track,
  src: `/api/radio/stream/${track.id}`
}));

const staticDurationMs = 1250;

type AudioContextType = {
  isPlaying: boolean;
  isTuning: boolean;
  trackIndex: number;
  currentTrack: RadioTrack;
  missingSignal: boolean;
  togglePlay: () => void;
  tuneTo: (index: number) => Promise<void>;
  nextTrack: () => void;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTuning, setIsTuning] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [missingSignal, setMissingSignal] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const noiseRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  
  // Use a ref for nextTrack to avoid stale closures in event listener
  const nextTrackRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Select a random track on mount
    const randomIdx = Math.floor(Math.random() * radioTracks.length);
    setTrackIndex(randomIdx);

    audioRef.current = new Audio();
    audioRef.current.preload = "metadata";
    audioRef.current.volume = 0.72;
    // Don't loop a single track anymore, we want random play
    audioRef.current.loop = false;

    const audio = audioRef.current;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleError = () => {
      setIsPlaying(false);
      setIsTuning(false);
      setMissingSignal(true);
    };
    const handleEnded = () => {
      setIsPlaying(false);
      if (nextTrackRef.current) nextTrackRef.current();
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
      if (timerRef.current) window.clearTimeout(timerRef.current);
      audio.pause();
      noiseRef.current?.close().catch(() => {});
    };
  }, []);

  function playStatic() {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
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

    setIsTuning(true);
    setMissingSignal(false);
    audio.pause();
    playStatic();

    if (timerRef.current) window.clearTimeout(timerRef.current);

    return new Promise<void>((resolve) => {
      timerRef.current = window.setTimeout(async () => {
        audio.src = nextTrack.src;
        audio.currentTime = 0;

        try {
          await audio.play();
          setTrackIndex(index);
          setIsTuning(false);
          setIsPlaying(true);
          resolve();
        } catch {
          setTrackIndex(index);
          setIsTuning(false);
          setMissingSignal(true);
          setIsPlaying(false);
          resolve();
        }
      }, staticDurationMs);
    });
  }

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      if (!audio.src || audio.src === window.location.href) {
        // If not initialized, tune to current track first
        void tuneTo(trackIndex);
      } else {
        audio.play().catch(() => setIsPlaying(false));
      }
    }
  }

  function nextTrack() {
    let nextIndex;
    if (radioTracks.length <= 1) {
      nextIndex = 0;
    } else {
      do {
        nextIndex = Math.floor(Math.random() * radioTracks.length);
      } while (nextIndex === trackIndex);
    }
    void tuneTo(nextIndex);
  }

  // Keep the ref updated with the latest nextTrack function
  nextTrackRef.current = nextTrack;

  return (
    <AudioContext.Provider
      value={{
        isPlaying,
        isTuning,
        trackIndex,
        currentTrack: radioTracks[trackIndex],
        missingSignal,
        togglePlay,
        tuneTo,
        nextTrack
      }}
    >
      {children}
    </AudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
