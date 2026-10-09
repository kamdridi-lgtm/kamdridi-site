// Filename: public/games/war-machines/stem-unlock.js
// Module: Stem Unlock
// Description: Gameplay reward system for music stem unlocks and local persistence.
(function () {
  "use strict";

  const STORAGE_KEY = "kamdridi_war_machines_stems";
  const STEMS = ["bass", "drums", "lead", "fx"];

  class StemUnlock {
    constructor() {
      this.state = { bass: false, drums: false, lead: false, fx: false };
      this.callbacks = [];
      this.previewTimers = {};
      this.load();
    }

    load() {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw) this.state = { ...this.state, ...JSON.parse(raw) };
      } catch {
        // Local storage can fail in private browsing.
      }
      return this.state;
    }

    save() {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
      } catch {
        // Persistence is a reward layer, not a gameplay blocker.
      }
    }

    evaluate(stats = {}) {
      const score = Number(stats.score) || 0;
      const maxCombo = Number(stats.maxCombo) || 0;
      const shotsFired = Number(stats.shotsFired) || 0;
      const perfectShots = Number(stats.perfectShots) || 0;
      const accuracy = shotsFired > 0 ? perfectShots / shotsFired : 0;

      if (stats.bossDefeated) this.unlock("bass", "REACTOR DESTROYED");
      if (score >= 3000) this.unlock("drums", "SCORE 3000+");
      if (maxCombo >= 20) this.unlock("lead", "COMBO X20");
      if (shotsFired >= 8 && accuracy >= 0.8) this.unlock("fx", "80% RHYTHM ACCURACY");

      return this.getUnlocked();
    }

    unlock(stem, reason = "UNLOCKED") {
      if (!STEMS.includes(stem) || this.state[stem]) return false;
      this.state[stem] = true;
      this.save();
      const info = { stem, reason, unlocked: this.getUnlocked() };
      for (const callback of this.callbacks) callback(info);
      window.songLoader?.setStemVolume?.(stem, 1, 0.4);
      return true;
    }

    isUnlocked(stem) {
      return Boolean(this.state[stem]);
    }

    getUnlocked() {
      return { ...this.state };
    }

    reset() {
      this.state = { bass: false, drums: false, lead: false, fx: false };
      this.save();
    }

    onUnlock(callback) {
      if (typeof callback === "function") this.callbacks.push(callback);
      return () => {
        this.callbacks = this.callbacks.filter((cb) => cb !== callback);
      };
    }

    preview(stem, seconds = 10) {
      if (!STEMS.includes(stem) || !window.songLoader?.setStemVolume) return false;
      window.clearTimeout(this.previewTimers[stem]);
      const previous = window.songLoader.lastPhaseVolumes?.[stem] ?? 0;
      window.songLoader.setStemVolume(stem, 1, 0.18);
      this.previewTimers[stem] = window.setTimeout(() => {
        if (!this.state[stem]) window.songLoader?.setStemVolume?.(stem, previous, 0.35);
      }, Math.max(1, seconds) * 1000);
      return true;
    }

    exportStem(stem) {
      const buffer = window.songLoader?.buffers?.[stem];
      if (!buffer) return null;
      return audioBufferToWavBlob(buffer);
    }
  }

  function audioBufferToWavBlob(buffer) {
    const channels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const samples = buffer.length;
    const bytesPerSample = 2;
    const blockAlign = channels * bytesPerSample;
    const dataSize = samples * blockAlign;
    const arrayBuffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(arrayBuffer);
    let offset = 0;

    writeString(view, offset, "RIFF"); offset += 4;
    view.setUint32(offset, 36 + dataSize, true); offset += 4;
    writeString(view, offset, "WAVE"); offset += 4;
    writeString(view, offset, "fmt "); offset += 4;
    view.setUint32(offset, 16, true); offset += 4;
    view.setUint16(offset, 1, true); offset += 2;
    view.setUint16(offset, channels, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, sampleRate * blockAlign, true); offset += 4;
    view.setUint16(offset, blockAlign, true); offset += 2;
    view.setUint16(offset, 16, true); offset += 2;
    writeString(view, offset, "data"); offset += 4;
    view.setUint32(offset, dataSize, true); offset += 4;

    const channelData = [];
    for (let ch = 0; ch < channels; ch += 1) channelData.push(buffer.getChannelData(ch));
    for (let i = 0; i < samples; i += 1) {
      for (let ch = 0; ch < channels; ch += 1) {
        const sample = Math.max(-1, Math.min(1, channelData[ch][i]));
        view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
        offset += 2;
      }
    }
    return new Blob([arrayBuffer], { type: "audio/wav" });
  }

  function writeString(view, offset, value) {
    for (let i = 0; i < value.length; i += 1) view.setUint8(offset + i, value.charCodeAt(i));
  }

  window.stemUnlock = window.stemUnlock || new StemUnlock();
  window.KamdridiWarMachines = window.KamdridiWarMachines || {};
  window.KamdridiWarMachines.StemUnlock = StemUnlock;
})();
