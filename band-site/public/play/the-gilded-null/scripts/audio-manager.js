/*
KAMDRIDI - THE GILDED NULL
EchoesEngine Audio System
Web Audio API Runtime
*/

class AudioManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.musicGain = null;
    this.sfxGain = null;
    this.lowpass = null;
    this.compressor = null;
    this.layers = {};
    this.started = false;
    this.muted = false;
    this.dangerLevel = 0;
  }

  async init() {
    if (this.started) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    this.masterGain = this.ctx.createGain();
    this.musicGain = this.ctx.createGain();
    this.sfxGain = this.ctx.createGain();

    this.lowpass = this.ctx.createBiquadFilter();
    this.lowpass.type = "lowpass";
    this.lowpass.frequency.value = 1800;

    this.compressor = this.ctx.createDynamicsCompressor();

    this.musicGain.connect(this.lowpass);
    this.lowpass.connect(this.compressor);
    this.compressor.connect(this.masterGain);
    this.sfxGain.connect(this.masterGain);
    this.masterGain.connect(this.ctx.destination);

    this.masterGain.gain.value = 0.8;
    this.musicGain.gain.value = 0.45;
    this.sfxGain.gain.value = 0.9;

    this.createLayers();

    document.addEventListener("visibilitychange", () => {
      if (!this.ctx) return;
      if (document.hidden) this.ctx.suspend();
      else this.ctx.resume();
    });

    this.started = true;
  }

  createLayers() {
    this.createAmbientLayer();
    this.createPulseLayer();
    this.createDangerLayer();
  }

  createAmbientLayer() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = 43;
    gain.gain.value = 0.04;
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start();
    this.layers.ambient = { osc, gain };
  }

  createPulseLayer() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.value = 55;
    gain.gain.value = 0.02;
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start();
    this.layers.pulse = { osc, gain };
  }

  createDangerLayer() {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "square";
    osc.frequency.value = 82;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(this.musicGain);
    osc.start();
    this.layers.danger = { osc, gain };
  }

  updateGameplay(data) {
    if (!this.started || !this.ctx || !this.layers.danger) return;
    const danger = data.dangerLevel || 0;

    this.layers.danger.gain.gain.linearRampToValueAtTime(
      danger * 0.08,
      this.ctx.currentTime + 0.2
    );

    this.lowpass.frequency.linearRampToValueAtTime(
      1800 - danger * 900,
      this.ctx.currentTime + 0.2
    );
  }

  playBeep(freq = 440, duration = 0.1) {
    if (!this.started || !this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = 0.2;
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(this.sfxGain);
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  onCollectGold() {
    this.playBeep(660, 0.08);
    setTimeout(() => this.playBeep(880, 0.06), 60);
  }

  onDash() { this.playBeep(260, 0.12); }
  onMonsterNear() { this.playBeep(90, 0.3); }
  onDamage() { this.playBeep(70, 0.4); }
  onGameOver() { this.playBeep(40, 1.2); }
}

window.AudioManager = AudioManager;
window.audioManager = new AudioManager();
