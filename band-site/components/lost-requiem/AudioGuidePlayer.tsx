"use client";

import { useRef, useState } from "react";
import styles from "./lost-requiem.module.css";

const audioSource = "";

function formatTime(value: number) {
  if (!Number.isFinite(value)) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function AudioGuidePlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const available = Boolean(audioSource);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !available) return;

    if (audio.paused) {
      await audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <aside id="audio-guide" className={styles.audioGuide} aria-label="Audioguide">
      <div className={styles.audioHeading}>
        <span className={styles.audioStatus} aria-hidden="true" />
        <div>
          <strong>Audio Guide</strong>
          <span>{available ? "Requiem" : "Audio demnächst verfügbar"}</span>
        </div>
      </div>

      <div className={styles.audioControls}>
        <button
          type="button"
          onClick={togglePlayback}
          disabled={!available}
          aria-label={playing ? "Audio pausieren" : "Audio abspielen"}
        >
          {playing ? "Pause" : "Play"}
        </button>

        <label className={styles.progressLabel}>
          <span className={styles.srOnly}>Fortschritt</span>
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={Math.min(currentTime, duration || 0)}
            disabled={!available}
            onChange={(event) => {
              const nextTime = Number(event.target.value);
              if (audioRef.current) audioRef.current.currentTime = nextTime;
              setCurrentTime(nextTime);
            }}
          />
        </label>

        <span className={styles.audioTime}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <button
          type="button"
          disabled={!available}
          onClick={() => {
            const nextMuted = !muted;
            setMuted(nextMuted);
            if (audioRef.current) audioRef.current.muted = nextMuted;
          }}
          aria-label={muted ? "Ton einschalten" : "Ton stummschalten"}
        >
          {muted ? "Ton an" : "Stumm"}
        </button>
      </div>

      {available ? (
        <audio
          ref={audioRef}
          preload="metadata"
          src={audioSource}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
          onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
          onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        />
      ) : null}
    </aside>
  );
}
