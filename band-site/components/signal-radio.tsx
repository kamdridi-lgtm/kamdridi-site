"use client";

import { useState, type CSSProperties } from "react";
import { AudioLines, Lightbulb, LightbulbOff, Power, Radio, SkipForward, Waves } from "lucide-react";
import { useAudio } from "./providers/audio-provider";

const ambientMeterBars = [
  0.18, 0.26, 0.34, 0.42, 0.5, 0.4, 0.32, 0.46,
  0.38, 0.48, 0.35, 0.43, 0.31, 0.39, 0.27, 0.2
];

export function SignalRadio() {
  const {
    isPlaying,
    isTuning,
    audioEnergy,
    audioSpectrum,
    currentTrack,
    missingSignal,
    togglePlay,
    nextTrack
  } = useAudio();
  const [lightsOn, setLightsOn] = useState(true);
  const [beatSync, setBeatSync] = useState(true);

  const frequency = Number.parseFloat(currentTrack.frequency);
  const stationPosition = 14 + ((frequency - 87.7) / (101.3 - 87.7)) * 72;
  const visualEnergy = lightsOn
    ? beatSync && isPlaying
      ? Math.max(0.08, audioEnergy)
      : isPlaying
        ? 0.34
        : 0.16
    : 0;
  const radioStyle = {
    "--radio-energy": visualEnergy.toFixed(3),
    "--radio-needle-position": `${Math.min(86, Math.max(14, stationPosition))}%`
  } as CSSProperties;
  const lightingClass = lightsOn ? "signal-radio-lights-on" : "signal-radio-lights-off";
  const beatClass = lightsOn && beatSync && isPlaying ? "signal-radio-beat-active" : "";

  return (
    <div
      className={`signal-radio-shell ${lightingClass} ${beatClass} relative w-full overflow-hidden border border-[#c98542]/35 bg-[#050302]/92 shadow-[0_28px_90px_rgba(0,0,0,0.62)] backdrop-blur-md`}
      style={radioStyle}
    >
      <div className="signal-radio-aura" />
      <div className="signal-radio-top-glow" />
      <div className="signal-static-bolt signal-static-bolt-a" />
      <div className="signal-static-bolt signal-static-bolt-b" />
      <div className="signal-static-bolt signal-static-bolt-c" />

      <div className="relative grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-6">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-[#f4c66a]">
              <span className="signal-radio-emblem relative inline-flex h-11 w-11 items-center justify-center border border-[#c98542]/45 bg-black/65">
                <Radio className="h-5 w-5" />
                <span
                  className={`signal-radio-status-lamp absolute -right-1 -top-1 h-3 w-3 rounded-full ${
                    isPlaying && !isTuning
                      ? "signal-radio-status-live"
                      : missingSignal
                        ? "signal-radio-status-error"
                        : "signal-radio-status-standby"
                  }`}
                />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.34em] sm:text-xs">
                  KAMDRIDI Signal Radio
                </p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.26em] text-stone-500 sm:text-[10px]">
                  {isPlaying && !isTuning
                    ? "SIGNAL LOCKED"
                    : missingSignal
                      ? "SIGNAL LOST"
                      : isTuning
                        ? "SIGNAL DRIFT"
                        : "STANDBY"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2" aria-label="Radio lighting status">
              <span className="signal-radio-beat-lamp" />
              <span className="signal-radio-beat-lamp signal-radio-beat-lamp-delay" />
              <span className="signal-radio-beat-lamp signal-radio-beat-lamp-soft" />
              <span className="ml-1 font-mono text-[9px] uppercase tracking-[0.2em] text-stone-600">
                {lightsOn ? (beatSync ? "Beat light" : "Ambient") : "Dark mode"}
              </span>
            </div>
          </div>

          <div className="signal-radio-display mt-5 border border-white/10 bg-black/55 p-4 sm:p-5">
            <p
              translate="no"
              className={`notranslate min-h-5 text-sm uppercase tracking-[0.18em] text-stone-200 ${isTuning ? "signal-text-drift" : ""}`}
              aria-live="polite"
            >
              {isTuning
                ? `SCANNING FM ${currentTrack.frequency}`
                : isPlaying && !missingSignal
                  ? `LOCKED: ${currentTrack.title}`
                  : missingSignal
                    ? `SIGNAL SOURCE MISSING: ${currentTrack.title}`
                    : "PRESS POWER TO CATCH THE SIGNAL"}
            </p>

            <div className="signal-radio-dial mt-5">
              <div className="signal-radio-frequency-labels" aria-hidden="true">
                <span>87.7</span>
                <span>91.3</span>
                <span>95.1</span>
                <span>99.8</span>
                <span>101.3</span>
              </div>
              <div className="signal-radio-frequency-track">
                <div className="signal-radio-frequency-minor-ticks" />
                <div className={`signal-needle ${isTuning ? "signal-needle-scan" : ""}`} />
              </div>
              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-stone-600">FM Stereo</span>
                <span className="font-mono text-sm font-semibold tracking-[0.18em] text-[#e8b777]">
                  {currentTrack.frequency} FM
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2 text-[9px] uppercase tracking-[0.18em] text-stone-500">
            <span className="border border-white/10 bg-black/30 px-2 py-1.5">Full Tracks</span>
            <span className="border border-white/10 bg-black/30 px-2 py-1.5">Echoes</span>
            <span className="border border-white/10 bg-black/30 px-2 py-1.5">Random Tune</span>
          </div>

          {missingSignal ? (
            <p className="mt-3 text-xs leading-5 text-red-300/65">
              This station is temporarily unavailable. Tune another station.
            </p>
          ) : null}
        </div>

        <div className="signal-radio-control-bank border border-white/10 bg-black/45 p-3 sm:p-4">
          <div className="signal-radio-speaker relative flex h-28 items-end justify-center overflow-hidden border border-white/10 bg-[#080705] px-5 pb-4 sm:h-32">
            <div className="signal-radio-speaker-grille" />
            <div className="signal-radio-meter relative z-10 flex h-16 items-end gap-1.5" aria-hidden="true">
              {ambientMeterBars.map((ambientLevel, index) => {
                const meterEnergy = lightsOn
                  ? beatSync && isPlaying
                    ? Math.min(1, Math.max(0.025, (audioSpectrum[index] ?? 0) * 1.34))
                    : isPlaying
                      ? ambientLevel
                      : 0.06
                  : 0.025;

                return (
                  <span
                    key={`spectrum-${index}`}
                    className="signal-radio-meter-bar"
                    style={{ transform: `scaleY(${meterEnergy})` }}
                  />
                );
              })}
            </div>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={togglePlay}
              disabled={isTuning}
              className={`signal-radio-power-button inline-flex min-h-14 items-center justify-center gap-2 border px-3 py-3 text-[10px] font-bold uppercase tracking-[0.16em] transition disabled:cursor-wait disabled:opacity-50 ${
                isPlaying
                  ? "border-red-500/60 bg-red-950/55 text-red-200"
                  : "border-[#f4a33f]/70 bg-[linear-gradient(180deg,#d66a16,#8f3208)] text-white"
              }`}
              aria-label={isPlaying ? "Turn Signal Radio off" : "Turn Signal Radio on"}
            >
              <Power className="h-4 w-4" />
              {isPlaying ? "Power Off" : "Power On"}
            </button>
            <button
              type="button"
              onClick={nextTrack}
              disabled={isTuning}
              className="inline-flex min-h-14 items-center justify-center gap-2 border border-[#c98542]/45 bg-[#24150a]/70 px-3 py-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#e8b777] transition hover:border-[#ffd18a] hover:bg-[#35200f]/80 disabled:cursor-wait disabled:opacity-50"
              aria-label="Tune to a different random station"
            >
              {isTuning ? <Waves className="h-4 w-4" /> : <SkipForward className="h-4 w-4" />}
              New Station
            </button>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={() => setLightsOn((current) => !current)}
              className={`inline-flex min-h-11 items-center justify-center gap-2 border px-2 text-[9px] font-semibold uppercase tracking-[0.14em] transition ${
                lightsOn
                  ? "border-[#f4c66a]/55 bg-[#f4c66a]/10 text-[#f4c66a]"
                  : "border-white/10 bg-black/50 text-stone-500"
              }`}
              aria-pressed={lightsOn}
              aria-label={lightsOn ? "Turn radio lighting off" : "Turn radio lighting on"}
            >
              {lightsOn ? <Lightbulb className="h-3.5 w-3.5" /> : <LightbulbOff className="h-3.5 w-3.5" />}
              {lightsOn ? "Lights On" : "Lights Off"}
            </button>
            <button
              type="button"
              onClick={() => setBeatSync((current) => !current)}
              disabled={!lightsOn}
              className={`inline-flex min-h-11 items-center justify-center gap-2 border px-2 text-[9px] font-semibold uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-35 ${
                beatSync && lightsOn
                  ? "border-[#e06028]/55 bg-[#e06028]/10 text-[#ff9c63]"
                  : "border-white/10 bg-black/50 text-stone-500"
              }`}
              aria-pressed={beatSync && lightsOn}
              aria-label={beatSync ? "Disable beat-reactive lighting" : "Enable beat-reactive lighting"}
            >
              {beatSync ? <AudioLines className="h-3.5 w-3.5" /> : <Waves className="h-3.5 w-3.5" />}
              Beat Sync
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
