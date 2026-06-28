/**
 * KAMDRIDI - Song Loader + Dynamic Stems
 * Optional stem playback for War Machines. If stems are missing, the game
 * keeps using the built-in synth beat.
 */
(function () {
  'use strict';

  const SONGS = {
    war_machines_act_2: {
      bpm: 120,
      stems: {
        bass: '/audio/stems/war_machines_bass.mp3',
        drums: '/audio/stems/war_machines_drums.mp3',
        lead: '/audio/stems/war_machines_lead.mp3',
        fx: '/audio/stems/war_machines_fx.mp3'
      },
      phases: {
        0: { stems: ['bass', 'drums'], volume: 0.78 },
        1: { stems: ['bass', 'drums', 'lead'], volume: 0.88 },
        2: { stems: ['bass', 'drums', 'lead', 'fx'], volume: 1.0 }
      }
    }
  };

  window.songLoader = {
    audioCtx: null,
    analyser: null,
    dataArray: null,
    masterGain: null,
    stems: {},
    currentSong: null,
    currentSongId: '',
    currentPhase: 0,
    isPlaying: false,
    loadPromise: null,
    missingStems: [],

    init(audioContext) {
      if (this.audioCtx) return;
      const AC = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = audioContext || new AC();
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 256;
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.value = 0.9;
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioCtx.destination);
      console.log('Song Loader initialized');
    },

    async loadSong(songId) {
      this.init();
      if (this.loadPromise && this.currentSongId === songId) return this.loadPromise;

      const song = SONGS[songId];
      if (!song) {
        console.warn('Song not found:', songId);
        return false;
      }

      this.stop();
      this.currentSong = song;
      this.currentSongId = songId;
      this.stems = {};
      this.missingStems = [];

      this.loadPromise = (async () => {
        for (const [stemName, url] of Object.entries(song.stems)) {
          try {
            const response = await fetch(url, { cache: 'force-cache' });
            if (!response.ok) throw new Error('HTTP ' + response.status);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await this.audioCtx.decodeAudioData(arrayBuffer);
            const gain = this.audioCtx.createGain();
            gain.gain.value = 0;
            gain.connect(this.masterGain);
            this.stems[stemName] = {
              buffer,
              gain,
              source: null,
              currentVolume: 0,
              targetVolume: 0
            };
            console.log('Loaded stem:', stemName);
          } catch (error) {
            this.missingStems.push(stemName);
            console.warn('Stem unavailable, synth fallback remains active:', stemName, error);
          }
        }
        this.setPhase(this.currentPhase);
        return Object.keys(this.stems).length > 0;
      })();

      return this.loadPromise;
    },

    play() {
      if (this.isPlaying || !this.audioCtx || !this.currentSong || !Object.keys(this.stems).length) return false;
      if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
      const now = this.audioCtx.currentTime;
      for (const stem of Object.values(this.stems)) {
        const source = this.audioCtx.createBufferSource();
        source.buffer = stem.buffer;
        source.loop = true;
        source.connect(stem.gain);
        source.start(now);
        stem.source = source;
      }
      this.isPlaying = true;
      this.setPhase(this.currentPhase);
      console.log('Song stems playing');
      return true;
    },

    stop() {
      for (const stem of Object.values(this.stems)) {
        if (!stem.source) continue;
        try { stem.source.stop(); } catch (error) {}
        try { stem.source.disconnect(); } catch (error) {}
        stem.source = null;
      }
      this.isPlaying = false;
    },

    setPhase(phase) {
      this.currentPhase = phase;
      if (!this.currentSong) return;
      const phaseConfig = this.currentSong.phases[phase] || this.currentSong.phases[0];
      for (const [stemName, stem] of Object.entries(this.stems)) {
        stem.targetVolume = phaseConfig.stems.includes(stemName) ? phaseConfig.volume : 0;
      }
    },

    update(dt) {
      if (!this.audioCtx || !this.analyser) return;
      for (const stem of Object.values(this.stems)) {
        const diff = stem.targetVolume - stem.currentVolume;
        stem.currentVolume += diff * Math.min(1, dt * 2.4);
        stem.gain.gain.value = Math.max(0, stem.currentVolume);
      }
      this.analyser.getByteFrequencyData(this.dataArray);
    },

    hasPlayableStems() {
      return this.isPlaying && Object.keys(this.stems).length > 0;
    },

    getFrequencyData() {
      return this.dataArray || null;
    },

    getAverageFrequency() {
      if (!this.dataArray) return 0;
      let sum = 0;
      for (let i = 0; i < this.dataArray.length; i++) sum += this.dataArray[i];
      return sum / this.dataArray.length;
    },

    getBassLevel() {
      if (!this.dataArray) return 0;
      const range = Math.min(10, this.dataArray.length);
      let sum = 0;
      for (let i = 0; i < range; i++) sum += this.dataArray[i];
      return sum / range / 255;
    }
  };

  window.audioVisualizer = {
    bassLevel: 0,
    smoothBass: 0,

    update(dt) {
      if (!window.songLoader) return;
      this.bassLevel = window.songLoader.getBassLevel();
      this.smoothBass += (this.bassLevel - this.smoothBass) * Math.min(1, dt * 10);
    },

    getBassGlow() {
      return this.smoothBass;
    },

    getBeatPulse() {
      return Math.pow(this.smoothBass, 2);
    }
  };

  console.log('Song Loader + Audio Visualizer loaded');
})();
