// Filename: public/games/war-machines/audio-reactive.js
// Module: Audio Reactive
// Description: FFT-based beat and frequency analysis for Canvas gameplay visuals.
(function () {
  "use strict";

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const lerp = (a, b, t) => a + (b - a) * t;

  class AudioReactive {
    constructor() {
      this.ctx = null;
      this.analyser = null;
      this.freq = null;
      this.enabled = true;
      this.reactivity = 0.72;
      this.beatStrength = 0;
      this.lastBeatAt = 0;
      this.cooldown = 0.12;
      this.averageEnergy = 0.001;
      this.bands = { bass: 0, mid: 0, treble: 0 };
      this.callbacks = [];
      this.strongCallbacks = [];
    }

    init(audioContext, analyserNode) {
      this.ctx = audioContext || this.ctx;
      if (!this.ctx) return false;
      this.analyser = analyserNode || this.analyser || this.ctx.createAnalyser();
      this.analyser.fftSize = 2048;
      this.analyser.smoothingTimeConstant = 0.74;
      this.freq = new Uint8Array(this.analyser.frequencyBinCount);
      return true;
    }

    update() {
      if (!this.enabled || !this.ctx || !this.analyser || !this.freq) {
        this.beatStrength *= 0.9;
        return;
      }

      this.analyser.getByteFrequencyData(this.freq);
      const bass = this.readBand(20, 250);
      const mid = this.readBand(250, 2000);
      const treble = this.readBand(2000, 14000);

      this.bands.bass = lerp(this.bands.bass, bass, 0.36);
      this.bands.mid = lerp(this.bands.mid, mid, 0.28);
      this.bands.treble = lerp(this.bands.treble, treble, 0.22);

      const energy = this.bands.bass * 0.68 + this.bands.mid * 0.23 + this.bands.treble * 0.09;
      this.averageEnergy = lerp(this.averageEnergy, energy, 0.045);
      const threshold = this.averageEnergy * (1.08 + (1 - this.reactivity) * 0.35) + 0.045;
      const rawStrength = clamp((energy - threshold) * (2.8 + this.reactivity * 4.2), 0, 1);
      this.beatStrength = Math.max(this.beatStrength * 0.88, rawStrength);

      const now = this.ctx.currentTime;
      if (rawStrength > 0.32 && now - this.lastBeatAt > this.cooldown) {
        this.lastBeatAt = now;
        const info = {
          strength: rawStrength,
          bass: this.bands.bass,
          mid: this.bands.mid,
          treble: this.bands.treble,
          time: now
        };
        for (const callback of this.callbacks) callback(info);
        if (rawStrength > 0.72 || this.bands.bass > 0.7) {
          for (const callback of this.strongCallbacks) callback(info);
        }
      }
    }

    readBand(minHz, maxHz) {
      if (!this.ctx || !this.freq) return 0;
      const nyquist = this.ctx.sampleRate / 2;
      const start = Math.max(0, Math.floor((minHz / nyquist) * this.freq.length));
      const end = Math.min(this.freq.length - 1, Math.ceil((maxHz / nyquist) * this.freq.length));
      let sum = 0;
      let count = 0;
      for (let i = start; i <= end; i += 1) {
        sum += this.freq[i] / 255;
        count += 1;
      }
      return count ? sum / count : 0;
    }

    getBeatStrength() {
      return this.beatStrength;
    }

    getFrequencyBand(band) {
      return this.bands[band] || 0;
    }

    onBeat(callback) {
      if (typeof callback === "function") this.callbacks.push(callback);
      return () => {
        this.callbacks = this.callbacks.filter((cb) => cb !== callback);
      };
    }

    onStrongBeat(callback) {
      if (typeof callback === "function") this.strongCallbacks.push(callback);
      return () => {
        this.strongCallbacks = this.strongCallbacks.filter((cb) => cb !== callback);
      };
    }

    setReactivity(level) {
      this.reactivity = clamp(Number(level) || 0, 0, 1);
    }

    enableVisuals(enabled) {
      this.enabled = Boolean(enabled);
    }
  }

  window.audioReactive = window.audioReactive || new AudioReactive();
  window.KamdridiWarMachines = window.KamdridiWarMachines || {};
  window.KamdridiWarMachines.AudioReactive = AudioReactive;
})();
