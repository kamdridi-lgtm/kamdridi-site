"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { radioTracks as catalogTracks, type RadioTrack as CatalogTrack } from "@/lib/radio-catalog";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export type RadioTrack = CatalogTrack & { src: string };

export const radioTracks: RadioTrack[] = catalogTracks.map((track) => ({
  ...track,
  src: `/${track.pathname}`
}));

const staticDurationMs = 1250;

type AudioContextType = {
  isPlaying: boolean;
  isTuning: boolean;
  audioEnergy: number;
  trackIndex: number;
  currentTrack: RadioTrack;
  missingSignal: boolean;
  togglePlay: () => void;
  tuneTo: (index: number) => Promise<void>;
  nextTrack: () => void;
};

const RadioAudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTuning, setIsTuning] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [missingSignal, setMissingSignal] = useState(false);
  const [audioEnergy, setAudioEnergy] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const noiseRef = useRef<AudioContext | null>(null);
  const mediaContextRef = useRef<AudioContext | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const analyserDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const analyserFrameRef = useRef<number | null>(null);
  const lastEnergySampleRef = useRef(0);
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

    const handlePlay = () => {
      setIsPlaying(true);
      startEnergyMonitor();
    };
    const handlePause = () => {
      setIsPlaying(false);
      stopEnergyMonitor();
    };
    const handleError = () => {
      setIsPlaying(false);
      setIsTuning(false);
      setMissingSignal(true);
      stopEnergyMonitor();
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
      mediaSourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      mediaContextRef.current?.close().catch(() => {});
      stopEnergyMonitor();
    };
  }, []);

  function ensureEnergyAnalyser() {
    const audio = audioRef.current;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!audio || !AudioContextClass) return;

    if (!mediaContextRef.current) {
      const mediaContext = new AudioContextClass();
      const mediaSource = mediaContext.createMediaElementSource(audio);
      const analyser = mediaContext.createAnalyser();

      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.72;
      mediaSource.connect(analyser);
      analyser.connect(mediaContext.destination);

      mediaContextRef.current = mediaContext;
      mediaSourceRef.current = mediaSource;
      analyserRef.current = analyser;
      analyserDataRef.current = new Uint8Array(analyser.frequencyBinCount);
    }

    if (mediaContextRef.current.state === "suspended") {
      void mediaContextRef.current.resume();
    }
  }

  function startEnergyMonitor() {
    if (analyserFrameRef.current !== null) return;

    const sampleEnergy = (timestamp: number) => {
      const analyser = analyserRef.current;
      const data = analyserDataRef.current;

      if (analyser && data && timestamp - lastEnergySampleRef.current >= 48) {
        analyser.getByteFrequencyData(data);

        const bassEnd = Math.min(16, data.length);
        let bassTotal = 0;
        let overallTotal = 0;

        for (let index = 0; index < data.length; index += 1) {
          overallTotal += data[index];
          if (index >= 1 && index < bassEnd) bassTotal += data[index];
        }

        const bassAverage = bassTotal / Math.max(1, bassEnd - 1) / 255;
        const overallAverage = overallTotal / Math.max(1, data.length) / 255;
        const nextEnergy = Math.min(1, Math.max(0.04, bassAverage * 1.15 + overallAverage * 0.34));

        setAudioEnergy(nextEnergy);
        lastEnergySampleRef.current = timestamp;
      }

      analyserFrameRef.current = window.requestAnimationFrame(sampleEnergy);
    };

    analyserFrameRef.current = window.requestAnimationFrame(sampleEnergy);
  }

  function stopEnergyMonitor() {
    if (analyserFrameRef.current !== null) {
      window.cancelAnimationFrame(analyserFrameRef.current);
      analyserFrameRef.current = null;
    }
    setAudioEnergy(0);
  }

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
    ensureEnergyAnalyser();
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
      ensureEnergyAnalyser();
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
    <RadioAudioContext.Provider
      value={{
        isPlaying,
        isTuning,
        audioEnergy,
        trackIndex,
        currentTrack: radioTracks[trackIndex],
        missingSignal,
        togglePlay,
        tuneTo,
        nextTrack
      }}
    >
      {children}
    </RadioAudioContext.Provider>
  );
}

export function useAudio() {
  const context = useContext(RadioAudioContext);
  if (context === undefined) {
    throw new Error("useAudio must be used within an AudioProvider");
  }
  return context;
}
