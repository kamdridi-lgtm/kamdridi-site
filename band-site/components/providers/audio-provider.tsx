"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { radioTracks, type RadioTrack } from "@/lib/radio-catalog";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

const staticDurationMs = 1250;
const spectrumBarCount = 16;
const idleSpectrum = Array.from({ length: spectrumBarCount }, () => 0);

type AudioContextType = {
  isPlaying: boolean;
  isTuning: boolean;
  audioEnergy: number;
  audioSpectrum: number[];
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
  const [audioSpectrum, setAudioSpectrum] = useState<number[]>(idleSpectrum);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const noiseRef = useRef<AudioContext | null>(null);
  const mediaContextRef = useRef<AudioContext | null>(null);
  const mediaSourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const analyserDataRef = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const analyserFrameRef = useRef<number | null>(null);
  const lastEnergySampleRef = useRef(0);
  const spectrumRef = useRef<number[]>(idleSpectrum);
  const spectrumRawRef = useRef<number[]>(idleSpectrum);
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

      analyser.fftSize = 1024;
      analyser.smoothingTimeConstant = 0.24;
      analyser.minDecibels = -82;
      analyser.maxDecibels = -6;
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

      if (analyser && data && timestamp - lastEnergySampleRef.current >= 32) {
        analyser.getByteFrequencyData(data);

        const nyquist = (mediaContextRef.current?.sampleRate ?? 48000) / 2;
        const minimumFrequency = 45;
        const maximumFrequency = Math.min(12500, nyquist);
        const rawSpectrum = Array.from({ length: spectrumBarCount }, (_, bandIndex) => {
          const lowRatio = bandIndex / spectrumBarCount;
          const highRatio = (bandIndex + 1) / spectrumBarCount;
          const lowFrequency = minimumFrequency * Math.pow(maximumFrequency / minimumFrequency, lowRatio);
          const highFrequency = minimumFrequency * Math.pow(maximumFrequency / minimumFrequency, highRatio);
          const startBin = Math.max(1, Math.floor((lowFrequency / nyquist) * data.length));
          const endBin = Math.max(startBin + 1, Math.ceil((highFrequency / nyquist) * data.length));
          let bandTotal = 0;
          let peak = 0;

          for (let bin = startBin; bin < Math.min(endBin, data.length); bin += 1) {
            bandTotal += data[bin];
            peak = Math.max(peak, data[bin]);
          }

          const binCount = Math.max(1, Math.min(endBin, data.length) - startBin);
          const average = bandTotal / binCount / 255;
          const peakLevel = peak / 255;
          const frequencyWeight = bandIndex < 5 ? 1.2 : bandIndex > 11 ? 1.12 : 1;
          const spectralLevel = Math.min(1, (average * 0.68 + peakLevel * 0.32) * frequencyWeight);
          return spectralLevel;
        });

        const nextSpectrum = rawSpectrum.map((spectralLevel, bandIndex) => {
          const previousRawLevel = spectrumRawRef.current[bandIndex] ?? 0;
          const transient = Math.max(0, spectralLevel - previousRawLevel);
          const rawLevel = Math.min(1, Math.pow(spectralLevel, 1.16) * 1.08 + transient * 2.2);
          const previousLevel = spectrumRef.current[bandIndex] ?? 0;

          return rawLevel > previousLevel
            ? previousLevel * 0.14 + rawLevel * 0.86
            : previousLevel * 0.57 + rawLevel * 0.43;
        });

        let overallTotal = 0;
        for (let index = 0; index < data.length; index += 1) {
          overallTotal += data[index];
        }

        const overallAverage = overallTotal / Math.max(1, data.length) / 255;
        const spectrumPeak = Math.max(...nextSpectrum);
        const nextEnergy = Math.min(1, Math.max(0.04, overallAverage * 0.72 + spectrumPeak * 0.58));

        spectrumRawRef.current = rawSpectrum;
        spectrumRef.current = nextSpectrum;
        setAudioSpectrum(nextSpectrum);
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
    spectrumRef.current = idleSpectrum;
    spectrumRawRef.current = idleSpectrum;
    setAudioSpectrum(idleSpectrum);
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
        audioSpectrum,
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
