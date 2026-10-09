// Filename: public/games/war-machines/rhythm.js
// Module: Rhythm
// Description: Web Audio 120 BPM metronome and beat sync evaluator.
(function () {
  "use strict";

  class RhythmSystem {
    constructor(options = {}) {
      this.bpm = options.bpm || 120;
      this.interval = 60 / this.bpm;
      this.tolerance = options.tolerance || 0.12;
      this.ctx = null;
      this.timer = null;
      this.started = false;
      this.lastBeat = 0;
      this.onBeat = null;
      this.beatCount = 0;
      this.intensity = 1;
    }

    start() {
      if (this.started) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
        if (this.ctx.state === "suspended") this.ctx.resume();
      }
      this.started = true;
      this.beatCount = 0;
      this.lastBeat = performance.now() / 1000;
      this.pulse();
      this.timer = window.setInterval(() => this.pulse(), this.interval * 1000);
    }

    stop() {
      if (this.timer) window.clearInterval(this.timer);
      this.timer = null;
      this.started = false;
    }

    pulse() {
      this.lastBeat = performance.now() / 1000;
      this.beatCount += 1;
      this.playKick();
      this.playDynamicLayer();
      if (typeof this.onBeat === "function") this.onBeat(this.lastBeat);
    }

    setIntensity(value) {
      this.intensity = Math.max(1, Math.min(3, Number(value) || 1));
    }

    playDynamicLayer() {
      if (!this.ctx) return;
      if (this.intensity >= 2 && this.beatCount % 2 === 0) this.playBass();
      if (this.intensity >= 3 && this.beatCount % 2 === 1) this.playSnare();
      if (this.intensity >= 3 && this.beatCount % 4 === 0) this.playSynthStab();
    }

    playKick() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = "sine";
      osc.frequency.setValueAtTime(92, now);
      osc.frequency.exponentialRampToValueAtTime(38, now + 0.09);
      filter.type = "lowpass";
      filter.frequency.value = 180;
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    }

    playBass() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(55, now);
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(220, now);
      gain.gain.setValueAtTime(0.055, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.2);
    }

    playSnare() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const len = Math.floor(this.ctx.sampleRate * 0.06);
      const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
      const noise = this.ctx.createBufferSource();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();
      noise.buffer = buffer;
      filter.type = "highpass";
      filter.frequency.setValueAtTime(1600, now);
      gain.gain.setValueAtTime(0.045, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start(now);
      noise.stop(now + 0.08);
    }

    playSynthStab() {
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
      gain.gain.setValueAtTime(0.025, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.13);
    }

    getSyncStatus(timeSeconds = performance.now() / 1000) {
      const elapsed = Math.max(0, timeSeconds - this.lastBeat);
      const phase = elapsed % this.interval;
      const distance = Math.min(phase, this.interval - phase);
      const onBeat = distance <= this.tolerance;
      const confidence = Math.max(0, Math.min(1, 1 - distance / this.tolerance));
      return { onBeat, confidence, distance };
    }
  }

  window.KamdridiWarMachines = window.KamdridiWarMachines || {};
  window.KamdridiWarMachines.RhythmSystem = RhythmSystem;
})();
