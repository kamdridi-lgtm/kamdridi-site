/**
 * KAMDRIDI - Ecosystem & Audio Reactive Engine v7.0
 * Drop-in bridge for reactive visuals, score sync, unlocks, and share cards.
 */
(function () {
  'use strict';

  const CFG = {
    BEAT_THRESHOLD: 0.62,
    BEAT_COOLDOWN: 0.25,
    REACTIVE: {
      bassPulseMult: 0.34,
      screenGlowAlpha: 0.045
    }
  };

  let audioCtx = null;
  let currentPhase = 0;
  let beatTimer = 0;
  let bassLevel = 0;
  let midLevel = 0;
  let trebleLevel = 0;
  let reactivePulse = 0;
  let screenGlow = 0;
  let syncState = { syncing: false, unlocked: [], lastStats: null };

  function loadSync() {
    try {
      const data = localStorage.getItem('kamdridi_sync');
      if (data) syncState = { ...syncState, ...JSON.parse(data) };
      if (!Array.isArray(syncState.unlocked)) syncState.unlocked = [];
    } catch (error) {}
  }

  function saveSync() {
    try { localStorage.setItem('kamdridi_sync', JSON.stringify(syncState)); } catch (error) {}
  }

  function init(ctx) {
    if (audioCtx) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    audioCtx = ctx || new AC();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    if (window.songLoader) window.songLoader.init(audioCtx);
    loadSync();
    console.log('Ecosystem Audio Engine initialized');
  }

  function start() {
    if (window.songLoader) {
      window.songLoader.loadSong('war_machines_act_2').then(() => {
        window.songLoader.setPhase(currentPhase);
        window.songLoader.play();
      }).catch(error => console.warn('Ecosystem stems unavailable; synth fallback active:', error));
    }
  }

  function stop() {
    if (window.songLoader) window.songLoader.stop();
  }

  function setPhase(phase) {
    currentPhase = phase;
    if (window.songLoader) window.songLoader.setPhase(phase);
  }

  function readSongBands() {
    if (!window.songLoader || !window.songLoader.getFrequencyData) return false;
    const data = window.songLoader.getFrequencyData();
    if (!data || !data.length) return false;

    const len = data.length;
    const bEnd = Math.max(1, Math.floor(len * 0.15));
    const mEnd = Math.max(bEnd + 1, Math.floor(len * 0.5));
    let bSum = 0, mSum = 0, tSum = 0;
    for (let i = 0; i < len; i++) {
      const value = data[i] / 255;
      if (i < bEnd) bSum += value;
      else if (i < mEnd) mSum += value;
      else tSum += value;
    }

    bassLevel = bSum / bEnd;
    midLevel = mSum / (mEnd - bEnd);
    trebleLevel = tSum / Math.max(1, len - mEnd);
    return true;
  }

  function update(dt) {
    if (window.songLoader) window.songLoader.update(dt);
    const hasFft = readSongBands();
    if (!hasFft) {
      const now = performance.now() / 1000;
      const pulse = Math.max(0, Math.sin(now * Math.PI * 4));
      bassLevel = currentPhase > 0 ? pulse * (0.35 + currentPhase * 0.12) : pulse * 0.22;
      midLevel = currentPhase > 0 ? pulse * 0.2 : 0;
      trebleLevel = currentPhase > 1 ? pulse * 0.16 : 0;
    }

    beatTimer -= dt;
    if (bassLevel > CFG.BEAT_THRESHOLD && beatTimer <= 0) {
      beatTimer = CFG.BEAT_COOLDOWN;
      reactivePulse = 1;
      screenGlow = 1;
      if (window.kamdridiParticles && typeof window.kamdridiParticles.emitBeat === 'function') {
        window.kamdridiParticles.emitBeat();
      }
    }

    reactivePulse *= Math.pow(0.05, dt);
    screenGlow *= Math.pow(0.1, dt);
  }

  function applyGlow(ctx, width, height) {
    if (screenGlow <= 0.01) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = 'rgba(255,215,0,' + Math.min(0.07, screenGlow * CFG.REACTIVE.screenGlowAlpha) + ')';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  function getReactorMult() {
    return 1 + bassLevel * CFG.REACTIVE.bassPulseMult;
  }

  function checkUnlocks(stats) {
    const unlocked = [];
    if (stats.score >= 3000 && !syncState.unlocked.includes('stem_drums')) unlocked.push('stem_drums');
    if (stats.maxCombo >= 20 && !syncState.unlocked.includes('stem_lead')) unlocked.push('stem_lead');
    if (stats.accuracy >= 0.8 && !syncState.unlocked.includes('stem_fx')) unlocked.push('stem_fx');
    if (stats.score >= 5000 && !syncState.unlocked.includes('elite_rank')) unlocked.push('elite_rank');
    for (const item of unlocked) syncState.unlocked.push(item);
    return unlocked;
  }

  function generateShareCard(stats) {
    const unlocks = checkUnlocks(stats);
    syncState.lastStats = stats;
    saveSync();

    const c = document.createElement('canvas');
    c.width = 600;
    c.height = 315;
    const cx = c.getContext('2d');
    if (!cx) return;

    cx.fillStyle = '#0A0A0F';
    cx.fillRect(0, 0, 600, 315);
    cx.strokeStyle = '#FFD700';
    cx.lineWidth = 4;
    cx.strokeRect(10, 10, 580, 295);
    cx.strokeStyle = 'rgba(255,215,0,0.05)';
    cx.lineWidth = 1;
    for (let i = 0; i < 600; i += 40) { cx.beginPath(); cx.moveTo(i, 0); cx.lineTo(i, 315); cx.stroke(); }
    for (let i = 0; i < 315; i += 40) { cx.beginPath(); cx.moveTo(0, i); cx.lineTo(600, i); cx.stroke(); }

    cx.font = 'bold 32px monospace';
    cx.fillStyle = '#FFD700';
    cx.textAlign = 'center';
    cx.shadowColor = '#FFD700';
    cx.shadowBlur = 12;
    cx.fillText('KAMDRIDI', 300, 65);
    cx.shadowBlur = 0;
    cx.font = '14px monospace';
    cx.fillStyle = '#00F5FF';
    cx.fillText('ACT II - WAR MACHINES', 300, 90);
    cx.font = 'bold 28px monospace';
    cx.fillStyle = '#FFFFFF';
    cx.fillText('SCORE: ' + Number(stats.score || 0).toLocaleString(), 300, 150);
    cx.font = '16px monospace';
    cx.fillStyle = '#FF6B35';
    cx.fillText('MAX COMBO: x' + (stats.maxCombo || 0), 300, 185);
    cx.fillStyle = '#00FF88';
    cx.fillText('RHYTHM ACC: ' + Math.floor((stats.accuracy || 0) * 100) + '%', 300, 210);
    if (unlocks.length) {
      cx.font = 'bold 12px monospace';
      cx.fillStyle = '#FFD700';
      cx.fillText('UNLOCKED: ' + unlocks.join(', ').toUpperCase(), 300, 245);
    }
    cx.font = '12px monospace';
    cx.fillStyle = '#666';
    cx.fillText('Play at kamdridi.com #Kamdridi', 300, 285);

    c.toBlob(blob => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'kamdridi_score_' + (stats.score || 0) + '.png';
      a.click();
      URL.revokeObjectURL(url);
    });

    const text = 'KAMDRIDI ACT II\\nScore: ' + (stats.score || 0) + ' | Combo: x' + (stats.maxCombo || 0) + ' | Acc: ' + Math.floor((stats.accuracy || 0) * 100) + '%\\nUnlocks: ' + (unlocks.length ? unlocks.join(', ') : 'None') + '\\nPlay -> kamdridi.com #Kamdridi';
    navigator.clipboard?.writeText(text).catch(() => {});
    console.log('Ecosystem sync complete');
  }

  window.kamdridiEcosystem = {
    init,
    start,
    stop,
    setPhase,
    update,
    getBass: () => bassLevel,
    getMid: () => midLevel,
    getTreble: () => trebleLevel,
    getPulse: () => reactivePulse,
    getGlow: () => screenGlow,
    getReactorMult,
    applyGlow,
    sync: generateShareCard,
    getUnlocks: () => syncState.unlocked.slice()
  };

  console.log('ecosystem-audio.js loaded | Drop & sync.');
})();
