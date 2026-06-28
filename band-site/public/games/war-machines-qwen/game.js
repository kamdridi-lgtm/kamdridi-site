/**
 * â•”â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•—
 * â•‘  KAMDRIDI â€” ACT II: WAR MACHINES                            â•‘
 * â•‘  v4.0 â€” JUICE: Dash, Hitstop, Dynamic Audio, Title Screen   â•‘
 * â•‘  Single-file Monolith. Drop & play.                         â•‘
 * â•šâ•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
 */
(function() {
'use strict';

const CFG = {
  W: 640, H: 360, BPM: 120, SYNC_WINDOW: 0.12, PERFECT_WINDOW: 0.05,
  COLORS: {
    GOLD: '#FFD700', GOLD_DARK: '#8B6914', GOLD_LIGHT: '#FFEC8B',
    CYAN: '#00F5FF', ORANGE: '#FF6B35', RED: '#FF3333',
    VOID: '#0A0A0F', MAGENTA: '#FF00FF', WHITE: '#FFFFFF'
  },
  PLAYER: { HP: 100, AMMO: 30, FIRE_RATE: 0.15, DMG: 25, SPEED: 160, DASH_SPEED: 450, DASH_DUR: 0.2, DASH_CD: 0.8 },
  BOSS: {
    HP: 1200,
    PHASES: [
      { thr: 1.0, name: 'CANNON', rate: 1.8, spd: 0.8 },
      { thr: 0.66, name: 'CHARGE', rate: 1.2, spd: 1.5 },
      { thr: 0.33, name: 'BERSERK', rate: 0.5, spd: 2.2 }
    ],
    REACTOR_MULT: 3, CANNON_DMG: 15, CHARGE_DMG: 25, LASER_DMG: 30
  },
  COMBO: {
    TIMEOUT: 3,
    TIERS: [
      { min: 0, mult: 1, name: '', color: '#FFF' },
      { min: 5, mult: 1.5, name: 'HEATED', color: '#00F5FF' },
      { min: 10, mult: 2, name: 'ON FIRE', color: '#FFD700' },
      { min: 20, mult: 3, name: 'BLAZING', color: '#FF6B35' },
      { min: 50, mult: 5, name: 'GODLIKE', color: '#FF0055' }
    ]
  },
  MINIONS: {
    Drone: { hp: 30, speed: 90, rate: 2.5, dmg: 8, score: 50, color: '#00F5FF' },
    Turret: { hp: 60, speed: 0, rate: 1.8, dmg: 12, score: 100, color: '#FF6B35' }
  },
  POWERUPS: {
    SPAWN_INTERVAL: 12,
    TYPES: {
      Overcharge: { color: '#00F5FF', dur: 5, label: 'O' },
      Shield: { color: '#FFD700', dur: 4, label: 'S' },
      TimeSlow: { color: '#FF6B35', dur: 6, label: 'T' },
      Ammo: { color: '#FFFFFF', dur: 0, label: 'A' }
    }
  }
};

const STATE = { TITLE: 0, TRANSITION: 1, COMBAT: 2, VICTORY: 3, DEAD: 4 };
let canvas, ctx, W, H;
let lastTime = 0, gameState = STATE.TITLE;
let audioCtx = null, audioStarted = false, isMobile = false;
let keys = {}, mouseX = 320, mouseY = 180, mouseDown = false;
let score = 0, highScore = 0, timeScale = 1, hitstopTime = 0;

try { highScore = parseInt(localStorage.getItem('kamdridi_qwen_original_hs_v4')) || 0; } catch(e) {}

const player = {
  x: 0, y: 0, hp: CFG.PLAYER.HP, maxHp: CFG.PLAYER.HP,
  ammo: CFG.PLAYER.AMMO, maxAmmo: CFG.PLAYER.AMMO,
  fireCd: 0, fireRate: CFG.PLAYER.FIRE_RATE,
  invuln: false, invulnTimer: 0, dashCd: 0, isDashing: false, dashTime: 0, dashDx: 0, dashDy: 0,
  animT: 0, moving: false, fireFlash: 0, dmgFlash: 0, damageMult: 1
};

const boss = {
  x: 320, y: 90, hp: CFG.BOSS.HP, maxHp: CFG.BOSS.HP,
  phase: 0, alive: true, scale: 0, animT: 0, cannonRecoil: 0,
  reactorExposed: false, reactorTimer: 0, atkTimer: 2, atkState: 'IDLE',
  chargeDir: 0, chargeTimer: 0, laserActive: false, laserTimer: 0, laserY: 0,
  dmgFlash: 0, shake: 0, projectiles: [],
  telegraph: null, telegraphTimer: 0, telegraphDur: 0
};

const combo = { count: 0, max: 0, tier: 0, timer: 0, flash: 0 };
function addCombo() {
  combo.count++; combo.timer = CFG.COMBO.TIMEOUT;
  if (combo.count > combo.max) combo.max = combo.count;
  let t = 0;
  for (let i = CFG.COMBO.TIERS.length - 1; i >= 0; i--) { if (combo.count >= CFG.COMBO.TIERS[i].min) { t = i; break; } }
  if (t > combo.tier) combo.flash = 2;
  combo.tier = t;
}
function resetCombo() { combo.count = 0; combo.tier = 0; combo.timer = 0; }
function comboMult() { return CFG.COMBO.TIERS[combo.tier].mult; }

const rhythm = { interval: 60 / CFG.BPM, lastBeat: 0, nextBeat: 0, beat: 0, playing: false };
function startAudio() {
  if (audioStarted) return;
  const AC = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AC();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  rhythm.playing = true;
  rhythm.nextBeat = audioCtx.currentTime + 0.1;
  rhythm.lastBeat = rhythm.nextBeat;
  audioStarted = true;
}
function updateRhythm() {
  if (!rhythm.playing || !audioCtx) return;
  const now = audioCtx.currentTime;
  while (rhythm.nextBeat <= now + 0.1) {
    playBeat(rhythm.nextBeat);
    rhythm.lastBeat = rhythm.nextBeat;
    rhythm.nextBeat += rhythm.interval;
    rhythm.beat++;
  }
}
function playBeat(t) {
  if (!audioCtx) return;
  // Sub Bass
  const sub = audioCtx.createOscillator(), sg = audioCtx.createGain();
  sub.type = 'sine'; sub.frequency.setValueAtTime(60, t); sub.frequency.exponentialRampToValueAtTime(30, t + 0.1);
  sg.gain.setValueAtTime(0.8, t); sg.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  sub.connect(sg); sg.connect(audioCtx.destination); sub.start(t); sub.stop(t + 0.2);
  // Kick
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(40, t + 0.05);
  g.gain.setValueAtTime(0.6, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
  o.connect(g); g.connect(audioCtx.destination); o.start(t); o.stop(t + 0.2);
  // Hi-Hat (offbeat)
  const hatTime = t + rhythm.interval / 2;
  const bufLen = audioCtx.sampleRate * 0.02;
  const buf = audioCtx.createBuffer(1, bufLen, audioCtx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < bufLen; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / bufLen);
  const n = audioCtx.createBufferSource(), ng = audioCtx.createGain(), filt = audioCtx.createBiquadFilter();
  n.buffer = buf; filt.type = 'highpass'; filt.frequency.value = 8000;
  ng.gain.setValueAtTime(0.15, hatTime); ng.gain.exponentialRampToValueAtTime(0.001, hatTime + 0.03);
  n.connect(filt); filt.connect(ng); ng.connect(audioCtx.destination); n.start(hatTime); n.stop(hatTime + 0.05);
}
function playSfx(freq, type, dur) {
  if (!audioCtx) return;
  const now = audioCtx.currentTime;
  const o = audioCtx.createOscillator(), g = audioCtx.createGain();
  o.type = type || 'triangle'; o.frequency.setValueAtTime(freq, now); o.frequency.exponentialRampToValueAtTime(freq * 2, now + dur * 0.3);
  g.gain.setValueAtTime(0.15, now); g.gain.exponentialRampToValueAtTime(0.001, now + dur);
  o.connect(g); g.connect(audioCtx.destination); o.start(now); o.stop(now + dur);
}
function isOnBeat() {
  if (!audioCtx || !rhythm.playing) return { hit: false, acc: 0 };
  const now = audioCtx.currentTime;
  const since = now - rhythm.lastBeat;
  const toNext = rhythm.interval - since;
  const dist = Math.min(since, toNext);
  if (dist <= CFG.SYNC_WINDOW) return { hit: true, acc: 1 - dist / CFG.SYNC_WINDOW, perfect: dist <= CFG.PERFECT_WINDOW };
  return { hit: false, acc: 0 };
}
function beatProgress() {
  if (!audioCtx || !rhythm.playing) return 0;
  return Math.min(1, (audioCtx.currentTime - rhythm.lastBeat) / rhythm.interval);
}

const PMAX = 300;
const parts = [];
for (let i = 0; i < PMAX; i++) parts.push({ active: false, x: 0, y: 0, vx: 0, vy: 0, sz: 2, a: 1, life: 1, maxL: 1, col: '#FFF', grav: 100 });
function emitP(x, y, col, n, spd, life, grav) {
  let c = 0;
  for (let i = 0; i < PMAX && c < n; i++) {
    const p = parts[i]; if (p.active) continue;
    p.active = true; p.x = x + (Math.random() - 0.5) * 6; p.y = y + (Math.random() - 0.5) * 6;
    const a = Math.random() * Math.PI * 2, s = (spd || 150) * (0.5 + Math.random() * 0.5);
    p.vx = Math.cos(a) * s; p.vy = Math.sin(a) * s;
    p.sz = 1.5 + Math.random() * 3; p.a = 1;
    p.life = (life || 0.4) * (0.7 + Math.random() * 0.3); p.maxL = p.life;
    p.col = col || CFG.COLORS.GOLD; p.grav = grav !== undefined ? grav : 100; c++;
  }
}
function updateParts(dt) {
  for (let i = 0; i < PMAX; i++) {
    const p = parts[i]; if (!p.active) continue;
    p.life -= dt; if (p.life <= 0) { p.active = false; continue; }
    p.x += p.vx * dt; p.vy += p.grav * dt; p.y += p.vy * dt;
    p.a = p.life / p.maxL; p.sz *= 0.97;
  }
}
function drawParts() {
  for (let i = 0; i < PMAX; i++) {
    const p = parts[i]; if (!p.active) continue;
    if (p.x < -10 || p.x > W + 10 || p.y < -10 || p.y > H + 10) continue;
    ctx.globalAlpha = p.a; ctx.fillStyle = p.col;
    ctx.beginPath(); ctx.arc(p.x, p.y, Math.max(0.5, p.sz), 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;
}

const MMAX = 20;
const minions = [];
for (let i = 0; i < MMAX; i++) minions.push({ active: false, x: 0, y: 0, vx: 0, vy: 0, hp: 0, maxHp: 0, type: 'Drone', fireCd: 0, flash: 0, animT: 0 });
const minionProjs = [];
function spawnMinion(x, y, type) {
  for (let i = 0; i < MMAX; i++) {
    const m = minions[i]; if (m.active) continue;
    const cfg = CFG.MINIONS[type];
    m.active = true; m.type = type; m.x = x; m.y = y; m.vx = 0; m.vy = 0;
    m.hp = cfg.hp; m.maxHp = cfg.hp; m.fireCd = cfg.rate * (0.5 + Math.random() * 0.5);
    m.flash = 0; m.animT = Math.random() * 10; return;
  }
}
function spawnWave(count, cx) {
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    spawnMinion(Math.max(30, Math.min(610, cx + Math.cos(a) * 130)), Math.max(40, Math.min(180, 80 + Math.sin(a) * 40)), Math.random() > 0.5 ? 'Drone' : 'Turret');
  }
}
function updateMinions(dt) {
  const px = W / 2 + player.x, py = H * 0.6 + player.y;
  for (let i = 0; i < MMAX; i++) {
    const m = minions[i]; if (!m.active) continue;
    m.animT += dt; if (m.flash > 0) m.flash -= dt;
    const cfg = CFG.MINIONS[m.type];
    if (m.type === 'Drone') {
      const dx = px - m.x, dy = py - m.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d > 60) { m.vx += (dx / d) * cfg.speed * dt * 2; m.vy += (dy / d) * cfg.speed * dt * 2; }
      m.vx *= 0.95; m.vy *= 0.95;
      const sp = Math.sqrt(m.vx * m.vx + m.vy * m.vy);
      if (sp > cfg.speed) { m.vx = (m.vx / sp) * cfg.speed; m.vy = (m.vy / sp) * cfg.speed; }
      m.x += m.vx * dt; m.y += m.vy * dt;
      m.x = Math.max(20, Math.min(620, m.x)); m.y = Math.max(30, Math.min(220, m.y));
    }
    m.fireCd -= dt;
    if (m.fireCd <= 0) {
      m.fireCd = cfg.rate;
      const dx = px - m.x, dy = py - m.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d > 1 && d < 400) minionProjs.push({ x: m.x, y: m.y, vx: (dx / d) * 180, vy: (dy / d) * 180, dmg: cfg.dmg, life: 2, col: cfg.color });
    }
    if (m.hp <= 0) {
      m.active = false; emitP(m.x, m.y, cfg.color, 10, 120, 0.4);
      score += cfg.score * comboMult(); addCombo(); playSfx(400, 'square', 0.08);
      if (Math.random() < 0.2) spawnPowerup(m.x, m.y);
    }
  }
  for (let i = minionProjs.length - 1; i >= 0; i--) {
    const p = minionProjs[i];
    p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
    if (Math.abs(p.x - px) < 14 && Math.abs(p.y - py) < 14 && !player.invuln) {
      player.hp -= p.dmg; player.dmgFlash = 0.3; hitstopTime = 0.05;
      minionProjs.splice(i, 1); continue;
    }
    if (p.life <= 0 || p.x < -10 || p.x > W + 10 || p.y > H + 10) minionProjs.splice(i, 1);
  }
}
function drawMinions() {
  for (let i = 0; i < MMAX; i++) {
    const m = minions[i]; if (!m.active) continue;
    const cfg = CFG.MINIONS[m.type];
    ctx.save(); ctx.translate(m.x, m.y);
    const flash = m.flash > 0;
    if (m.type === 'Drone') {
      ctx.translate(0, Math.sin(m.animT * 3) * 3);
      ctx.beginPath(); ctx.moveTo(0, -12); ctx.lineTo(-10, 8); ctx.lineTo(10, 8); ctx.closePath();
      ctx.fillStyle = flash ? '#FFF' : cfg.color; ctx.fill();
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.stroke();
    } else {
      ctx.fillStyle = flash ? '#FFF' : cfg.color; ctx.fillRect(-14, -8, 28, 16);
      ctx.strokeStyle = '#000'; ctx.lineWidth = 1; ctx.strokeRect(-14, -8, 28, 16);
      ctx.fillStyle = '#222'; ctx.fillRect(-2, 8, 4, 7);
      ctx.fillStyle = Math.sin(m.animT * 5) > 0 ? '#F00' : '#600';
      ctx.beginPath(); ctx.arc(0, -3, 2.5, 0, Math.PI * 2); ctx.fill();
    }
    if (m.hp < m.maxHp) {
      const bw = 20, hpR = m.hp / m.maxHp;
      ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(-bw / 2, -16, bw, 3);
      ctx.fillStyle = hpR > 0.5 ? '#0F0' : '#F80'; ctx.fillRect(-bw / 2, -16, bw * hpR, 3);
    }
    ctx.restore();
  }
  for (const p of minionProjs) {
    ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, Math.PI * 2); ctx.fillStyle = p.col; ctx.fill();
  }
}
function hitMinion(mx, my, dmg) {
  for (let i = 0; i < MMAX; i++) {
    const m = minions[i]; if (!m.active) continue;
    if (Math.abs(mx - m.x) < 16 && Math.abs(my - m.y) < 16) {
      m.hp -= dmg; m.flash = 0.1; emitP(mx, my, CFG.COLORS.GOLD, 4, 100, 0.3); return true;
    }
  } return false;
}
function activeMinions() { let c = 0; for (let i = 0; i < MMAX; i++) if (minions[i].active) c++; return c; }

const PUMAX = 8;
const powerups = [];
for (let i = 0; i < PUMAX; i++) powerups.push({ active: false, x: 0, y: 0, vy: 0, type: '', timer: 0, pulse: 0 });
let puSpawnTimer = 0; const activeEffects = [];
function spawnPowerup(x, y, type) {
  for (let i = 0; i < PUMAX; i++) {
    const p = powerups[i]; if (p.active) continue;
    const types = Object.keys(CFG.POWERUPS.TYPES);
    p.active = true; p.type = type || types[Math.floor(Math.random() * types.length)];
    p.x = x; p.y = y; p.vy = -40; p.timer = 10; p.pulse = 0; return;
  }
}
function updatePowerups(dt) {
  const px = W / 2 + player.x, py = H * 0.6 + player.y;
  puSpawnTimer += dt;
  if (puSpawnTimer >= CFG.POWERUPS.SPAWN_INTERVAL && powerups.filter(p => p.active).length < 2) {
    puSpawnTimer = 0; spawnPowerup(100 + Math.random() * 440, 70 + Math.random() * 80);
  }
  for (let i = 0; i < PUMAX; i++) {
    const p = powerups[i]; if (!p.active) continue;
    p.timer -= dt; p.pulse += dt * 4; p.vy += 30 * dt; p.vy = Math.min(p.vy, 25); p.y += p.vy * dt;
    if (p.y > 280) { p.y = 280; p.vy = -15; }
    if (p.timer <= 0) { p.active = false; continue; }
    if (Math.abs(p.x - px) < 25 && Math.abs(p.y - py) < 25) { collectPowerup(p); p.active = false; }
  }
  for (let i = activeEffects.length - 1; i >= 0; i--) {
    activeEffects[i].timer -= dt;
    if (activeEffects[i].timer <= 0) { activeEffects[i].revert(); activeEffects.splice(i, 1); }
  }
}
function collectPowerup(p) {
  const cfg = CFG.POWERUPS.TYPES[p.type];
  emitP(p.x, p.y, cfg.color, 12, 100, 0.4, 20); playSfx(880, 'triangle', 0.1);
  switch (p.type) {
    case 'Overcharge': player.fireRate = 0.05; player.damageMult = 1.5; activeEffects.push({ timer: cfg.dur, revert: () => { player.fireRate = CFG.PLAYER.FIRE_RATE; player.damageMult = 1; } }); break;
    case 'Shield': player.invuln = true; activeEffects.push({ timer: cfg.dur, revert: () => { player.invuln = false; } }); break;
    case 'TimeSlow': timeScale = 0.5; activeEffects.push({ timer: cfg.dur, revert: () => { timeScale = 1; } }); break;
    case 'Ammo': player.ammo = player.maxAmmo; break;
  }
}
function drawPowerups() {
  for (let i = 0; i < PUMAX; i++) {
    const p = powerups[i]; if (!p.active) continue;
    const cfg = CFG.POWERUPS.TYPES[p.type];
    const bob = Math.sin(p.pulse) * 3, scale = 1 + Math.sin(p.pulse * 2) * 0.08;
    const blink = p.timer < 3 ? (Math.sin(p.timer * 8) * 0.3 + 0.7) : 1;
    ctx.save(); ctx.translate(p.x, p.y + bob); ctx.scale(scale, scale); ctx.globalAlpha = blink;
    ctx.beginPath(); ctx.arc(0, 0, 11, 0, Math.PI * 2); ctx.fillStyle = cfg.color + '44'; ctx.fill();
    ctx.strokeStyle = cfg.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fillStyle = cfg.color + 'AA'; ctx.fill();
    ctx.font = 'bold 8px monospace'; ctx.fillStyle = '#000'; ctx.textAlign = 'center'; ctx.fillText(cfg.label, 0, 3);
    ctx.restore();
  }
}

function updateBoss(dt) {
  if (!boss.alive) return;
  boss.animT += dt;
  if (boss.dmgFlash > 0) boss.dmgFlash -= dt * 5;
  if (boss.shake > 0) boss.shake -= dt * 2;
  if (boss.cannonRecoil > 0) boss.cannonRecoil -= dt * 8;
  if (boss.scale < 1) { boss.scale += dt * 1.5; if (boss.scale > 1) boss.scale = 1; return; }
  if (boss.reactorExposed) { boss.reactorTimer -= dt; if (boss.reactorTimer <= 0) boss.reactorExposed = false; }
  const hpR = boss.hp / boss.maxHp; let newP = 0;
  if (hpR <= 0.33) newP = 2; else if (hpR <= 0.66) newP = 1;
  if (newP !== boss.phase) {
    boss.phase = newP; boss.shake = 0.8; boss.reactorExposed = true; boss.reactorTimer = 3; boss.atkTimer = 1.5;
    if (newP === 1) spawnWave(4, boss.x);
    if (newP === 2) spawnWave(6, boss.x);
    hitstopTime = 0.15; // HITSTOP ON PHASE CHANGE
  }
  const px = W / 2 + player.x; boss.x += (px - boss.x) * 0.2 * dt;
  if (boss.laserActive) {
    boss.laserTimer -= dt; if (boss.laserTimer <= 0) boss.laserActive = false;
    const py = H * 0.6 + player.y;
    if (Math.abs(py - boss.laserY) < 10 && !player.invuln) { player.hp -= CFG.BOSS.LASER_DMG * dt; player.dmgFlash = 0.1; }
    return;
  }
  if (boss.atkState === 'CHARGING') {
    boss.x += boss.chargeDir * 350 * dt; boss.y += 60 * dt; boss.chargeTimer -= dt;
    if (boss.chargeTimer <= 0 || boss.y > 160) {
      boss.shake = 0.6; boss.atkState = 'IDLE'; boss.y = 90; boss.atkTimer = 2;
      if (Math.abs(boss.x - px) < 50 && !player.invuln) { player.hp -= CFG.BOSS.CHARGE_DMG; player.dmgFlash = 0.4; hitstopTime = 0.1; }
    }
    return;
  }
  if (boss.telegraph) {
    boss.telegraphTimer -= dt;
    if (boss.telegraphTimer <= 0) { executeBossAttack(boss.telegraph); boss.telegraph = null; }
    return;
  }
  boss.atkTimer -= dt; if (boss.atkTimer <= 0) chooseBossAttack();
  for (let i = boss.projectiles.length - 1; i >= 0; i--) {
    const p = boss.projectiles[i]; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
    const ppx = W / 2 + player.x, ppy = H * 0.6 + player.y;
    if (Math.abs(p.x - ppx) < 16 && Math.abs(p.y - ppy) < 16 && !player.invuln) {
      player.hp -= CFG.BOSS.CANNON_DMG; player.dmgFlash = 0.3; hitstopTime = 0.08;
      boss.projectiles.splice(i, 1); continue;
    }
    if (p.life <= 0 || p.y > H + 20) boss.projectiles.splice(i, 1);
  }
}
function chooseBossAttack() {
  const phase = boss.phase, roll = Math.random(), px = W / 2 + player.x;
  if (phase === 0) { boss.telegraph = 'CANNON'; boss.telegraphTimer = 1.0; boss.telegraphDur = 1.0; }
  else if (phase === 1) {
    if (roll < 0.4) { boss.telegraph = 'CANNON'; boss.telegraphTimer = 0.7; boss.telegraphDur = 0.7; }
    else if (roll < 0.7) { boss.telegraph = 'CHARGE'; boss.telegraphTimer = 1.2; boss.telegraphDur = 1.2; boss.chargeDir = px > boss.x ? 1 : -1; }
    else { boss.telegraph = 'MISSILE'; boss.telegraphTimer = 0.6; boss.telegraphDur = 0.6; }
  } else {
    if (roll < 0.3) { boss.telegraph = 'CANNON'; boss.telegraphTimer = 0.4; boss.telegraphDur = 0.4; }
    else if (roll < 0.5) { boss.telegraph = 'CHARGE'; boss.telegraphTimer = 0.8; boss.telegraphDur = 0.8; boss.chargeDir = px > boss.x ? 1 : -1; }
    else if (roll < 0.7) { boss.telegraph = 'LASER'; boss.telegraphTimer = 1.5; boss.telegraphDur = 1.5; }
    else { boss.telegraph = 'CANNON'; boss.telegraphTimer = 0.3; boss.telegraphDur = 0.3; }
  }
}
function executeBossAttack(type) {
  const px = W / 2 + player.x, py = H * 0.6 + player.y;
  const rate = CFG.BOSS.PHASES[boss.phase].rate;
  switch (type) {
    case 'CANNON':
      boss.cannonRecoil = 1; boss.shake = 0.2;
      boss.projectiles.push({ x: boss.x, y: boss.y + 40, vx: (px - boss.x) * 0.7, vy: 280, size: boss.phase === 2 ? 7 : 5, life: 2.5 });
      if (boss.phase === 2) boss.projectiles.push({ x: boss.x + 20, y: boss.y + 40, vx: (px - boss.x) * 0.7 + (Math.random() - 0.5) * 80, vy: 260, size: 5, life: 2.5 });
      boss.atkTimer = rate * (0.8 + Math.random() * 0.4); break;
    case 'CHARGE': boss.atkState = 'CHARGING'; boss.chargeTimer = 1.2; boss.atkTimer = 2.5; break;
    case 'LASER': boss.laserActive = true; boss.laserTimer = 0.8; boss.laserY = py; boss.shake = 0.3; boss.atkTimer = 3; break;
    case 'MISSILE':
      boss.shake = 0.2;
      for (let i = 0; i < 3; i++) boss.projectiles.push({ x: boss.x + (i - 1) * 30, y: boss.y + 20, vx: (px - boss.x) * 0.5 + (i - 1) * 40, vy: 200 + i * 30, size: 4, life: 2.5 });
      boss.atkTimer = rate * 1.5; break;
  }
}
function drawBossTelegraph() {
  if (!boss.telegraph) return;
  const progress = 1 - (boss.telegraphTimer / boss.telegraphDur);
  const px = W / 2 + player.x, py = H * 0.6 + player.y;
  ctx.save(); ctx.globalAlpha = 0.5 + progress * 0.5;
  switch (boss.telegraph) {
    case 'CANNON':
      ctx.strokeStyle = CFG.COLORS.ORANGE; ctx.lineWidth = 2 + Math.sin(progress * 15); ctx.setLineDash([6, 4]);
      ctx.beginPath(); ctx.moveTo(boss.x, boss.y + 35); ctx.lineTo(px, py); ctx.stroke(); ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(boss.x, boss.y + 35, 8 + progress * 12, 0, Math.PI * 2); ctx.strokeStyle = '#FFA500'; ctx.stroke(); break;
    case 'CHARGE':
      const dir = boss.chargeDir; ctx.fillStyle = 'rgba(255,107,53,0.2)'; ctx.fillRect(boss.x - 40, boss.y - 20, 80, 130);
      ctx.strokeStyle = CFG.COLORS.ORANGE; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(boss.x, boss.y + 60); ctx.lineTo(boss.x + dir * (60 + progress * 80), boss.y + 60); ctx.stroke(); break;
    case 'LASER':
      ctx.beginPath(); ctx.arc(boss.x, boss.y + 40, 5 + progress * 10, 0, Math.PI * 2);
      const lg = ctx.createRadialGradient(boss.x, boss.y + 40, 0, boss.x, boss.y + 40, 5 + progress * 10);
      lg.addColorStop(0, '#FF0000'); lg.addColorStop(1, 'rgba(255,0,0,0)'); ctx.fillStyle = lg; ctx.fill();
      if (progress > 0.5) { ctx.fillStyle = `rgba(255,0,0,${(progress - 0.5) * 0.15})`; ctx.fillRect(0, boss.y + 35, W, 10); } break;
    case 'MISSILE':
      for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(boss.x + (i - 1) * 30, boss.y + 20, 6 + Math.sin(progress * 10 + i) * 2, 0, Math.PI * 2); ctx.strokeStyle = '#F44'; ctx.lineWidth = 2; ctx.stroke(); } break;
  }
  if (progress > 0.3) { ctx.font = 'bold 7px monospace'; ctx.fillStyle = CFG.COLORS.ORANGE; ctx.textAlign = 'center'; ctx.fillText('âš  ' + boss.telegraph, boss.x, boss.y - 25); }
  ctx.restore();
}
function drawBoss() {
  if (!boss.alive && boss.scale <= 0) return;
  const s = boss.scale; if (s <= 0) return;
  ctx.save();
  if (boss.shake > 0) ctx.translate((Math.random() - 0.5) * boss.shake * 8, (Math.random() - 0.5) * boss.shake * 6);
  ctx.translate(boss.x, boss.y); ctx.scale(s, s);
  const breath = Math.sin(boss.animT * 1.5) * 0.015; ctx.scale(1 + breath, 1 - breath * 0.5);
  const flash = boss.dmgFlash > 0;
  [-35, 35].forEach(lx => { ctx.fillStyle = '#1a1a22'; ctx.fillRect(lx - 11, 50, 22, 28); ctx.fillStyle = '#2a2a35'; ctx.fillRect(lx - 13, 78, 26, 28); ctx.fillStyle = '#333'; ctx.fillRect(lx - 15, 102, 30, 10); });
  ctx.beginPath(); ctx.moveTo(-72, -38); ctx.lineTo(72, -38); ctx.lineTo(58, 50); ctx.lineTo(-58, 50); ctx.closePath();
  ctx.fillStyle = flash ? '#AAA' : '#1a1a22'; ctx.fill(); ctx.strokeStyle = '#4a4a55'; ctx.lineWidth = 2; ctx.stroke();
  ctx.fillStyle = CFG.COLORS.GOLD; ctx.beginPath(); ctx.moveTo(0, -28); ctx.lineTo(-10, -8); ctx.lineTo(10, -8); ctx.closePath(); ctx.fill();
  if (boss.phase === 2) { ctx.globalAlpha = 0.15 + Math.sin(boss.animT * 6) * 0.08; ctx.fillStyle = CFG.COLORS.RED; ctx.fillRect(-68, -38, 136, 88); ctx.globalAlpha = 1; }
  const rec = boss.cannonRecoil * 6;
  [-68, 68].forEach(cx => {
    ctx.save(); ctx.translate(cx, -15); ctx.fillStyle = '#222230'; ctx.fillRect(-7, -52 + rec, 14, 52);
    ctx.fillStyle = '#0a0a0f'; ctx.beginPath(); ctx.arc(0, -52 + rec, 5, 0, Math.PI * 2); ctx.fill();
    if (boss.cannonRecoil > 0.5) { ctx.beginPath(); ctx.arc(0, -55 + rec, 10, 0, Math.PI * 2); const g = ctx.createRadialGradient(0, -55 + rec, 0, 0, -55 + rec, 10); g.addColorStop(0, 'rgba(255,200,50,0.8)'); g.addColorStop(1, 'rgba(255,100,0,0)'); ctx.fillStyle = g; ctx.fill(); }
    ctx.fillStyle = '#333'; ctx.fillRect(-9, -6, 18, 14); ctx.restore();
  });
  ctx.save(); ctx.translate(0, -58);
  ctx.beginPath(); ctx.moveTo(-11, -11); ctx.lineTo(11, -11); ctx.lineTo(15, 0); ctx.lineTo(12, 9); ctx.lineTo(-12, 9); ctx.lineTo(-15, 0); ctx.closePath(); ctx.fillStyle = '#1a1a22'; ctx.fill();
  const eg = 0.7 + Math.sin(boss.animT * 3) * 0.3; ctx.fillStyle = boss.phase === 2 ? '#F66' : '#F33'; ctx.shadowColor = '#F33'; ctx.shadowBlur = 5 * eg;
  ctx.beginPath(); ctx.ellipse(-6, -1, 4, 2, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(6, -1, 4, 2, 0, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; ctx.restore();
  const rp = (Math.sin(boss.animT * 4) + 1) * 0.5; const rGlow = boss.reactorExposed ? 0.9 : 0.3 + rp * 0.15; const rSz = boss.reactorExposed ? 13 + rp * 4 : 7;
  ctx.beginPath(); ctx.arc(0, -8, rSz, 0, Math.PI * 2);
  const rg = ctx.createRadialGradient(0, -8, 0, 0, -8, rSz); rg.addColorStop(0, `rgba(255,221,0,${rGlow})`); rg.addColorStop(0.5, `rgba(255,107,53,${rGlow * 0.6})`); rg.addColorStop(1, 'rgba(255,50,0,0)'); ctx.fillStyle = rg; ctx.fill();
  if (boss.reactorExposed) { ctx.setLineDash([3, 3]); ctx.strokeStyle = CFG.COLORS.GOLD; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(0, -8, rSz + 7, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); }
  ctx.font = 'bold 7px monospace'; ctx.fillStyle = CFG.COLORS.GOLD; ctx.globalAlpha = 0.5; ctx.textAlign = 'center'; ctx.fillText('K-01', 0, 33); ctx.globalAlpha = 1; ctx.restore();
  for (const p of boss.projectiles) { ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); const pg = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size); pg.addColorStop(0, '#FFF'); pg.addColorStop(0.5, CFG.COLORS.ORANGE); pg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = pg; ctx.fill(); }
  if (boss.laserActive) { ctx.fillStyle = 'rgba(255,0,0,0.7)'; ctx.fillRect(0, boss.laserY - boss.y - 4, W, 8); ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.fillRect(0, boss.laserY - boss.y - 2, W, 4); }
}

const trans = { time: 0, phase: 0 };
function updateTrans(dt) {
  trans.time += dt;
  if (trans.time < 3) trans.phase = 0;
  else if (trans.time < 6) { trans.phase = 1; if (Math.random() < 0.3) emitP(W / 2, H / 2, CFG.COLORS.GOLD, 2, 100, 0.5, 20); }
  else if (trans.time < 9) trans.phase = 2;
  else { gameState = STATE.COMBAT; boss.scale = 0; boss.shake = 0.7; startAudio(); }
}
function drawTrans() {
  ctx.fillStyle = CFG.COLORS.VOID; ctx.fillRect(0, 0, W, H);
  const cx = W / 2, cy = H / 2;
  if (trans.phase === 0) {
    drawCorridor(); drawRunner(cx - 100 + (trans.time / 3) * 100, cy + 30, trans.time);
    ctx.beginPath(); ctx.arc(cx, cy, (trans.time / 3) * 55, 0, Math.PI * 2); ctx.strokeStyle = CFG.COLORS.GOLD; ctx.lineWidth = 3; ctx.shadowColor = CFG.COLORS.GOLD; ctx.shadowBlur = 12; ctx.stroke(); ctx.shadowBlur = 0;
    drawTxt('ESCAPE THE SIMULATION...', cx, H - 38, Math.min(1, trans.time));
  } else if (trans.phase === 1) {
    const p = (trans.time - 3) / 3; ctx.fillStyle = `rgba(255,255,255,${p * 0.5})`; ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = p * 0.12; ctx.fillStyle = '#000'; for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1); ctx.globalAlpha = 1;
    drawParts(); drawTxt('DIMENSIONAL SHIFT...', cx, H - 38, 1);
  } else {
    const p = (trans.time - 6) / 3; ctx.globalAlpha = Math.min(1, p * 1.5); drawEnv(trans.time); ctx.globalAlpha = 1;
    ctx.globalAlpha = Math.min(1, (p - 0.2) / 0.6); drawSoldier(cx, cy + 40, trans.time, false); ctx.globalAlpha = 1;
    drawParts(); drawTxt('WELCOME TO THE WAR ZONE', cx, H - 28, Math.min(1, (p - 0.3) * 2.5));
  }
}

function drawCorridor() {
  const cx = W / 2, vy = H * 0.35; const g = ctx.createLinearGradient(0, vy, 0, H); g.addColorStop(0, '#1a1200'); g.addColorStop(1, '#0d0900'); ctx.fillStyle = g; ctx.fillRect(0, vy, W, H - vy);
  ctx.strokeStyle = CFG.COLORS.GOLD; ctx.lineWidth = 1; ctx.globalAlpha = 0.3;
  for (let i = 0; i < 8; i++) { const o = (i / 8) * W * 0.4; ctx.beginPath(); ctx.moveTo(cx, vy); ctx.lineTo(o, H); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx, vy); ctx.lineTo(W - o, H); ctx.stroke(); }
  ctx.globalAlpha = 1;
}
function drawEnv(t) {
  const cx = W / 2, hz = H * 0.45; const sky = ctx.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, '#030308'); sky.addColorStop(1, '#0a0a1a'); ctx.fillStyle = sky; ctx.fillRect(0, 0, W, hz);
  const blds = [{ x: 50, w: 65, h: 155, c: CFG.COLORS.CYAN }, { x: 140, w: 50, h: 190, c: CFG.COLORS.MAGENTA }, { x: 440, w: 75, h: 170, c: CFG.COLORS.CYAN }, { x: 540, w: 55, h: 140, c: CFG.COLORS.MAGENTA }];
  for (const b of blds) { ctx.fillStyle = '#0a0a12'; ctx.fillRect(b.x, hz - b.h, b.w, b.h); ctx.strokeStyle = b.c; ctx.lineWidth = 1; ctx.globalAlpha = 0.4 + Math.sin(t * 2 + b.x) * 0.2; for (let n = 0; n < 3; n++) { const ny = hz - b.h * (0.3 + n * 0.25); ctx.beginPath(); ctx.moveTo(b.x, ny); ctx.lineTo(b.x + b.w, ny); ctx.stroke(); } ctx.globalAlpha = 1; }
  const grd = ctx.createLinearGradient(0, hz, 0, H); grd.addColorStop(0, '#080810'); grd.addColorStop(1, '#040406'); ctx.fillStyle = grd; ctx.fillRect(0, hz, W, H - hz);
  ctx.strokeStyle = CFG.COLORS.CYAN; ctx.globalAlpha = 0.08; ctx.lineWidth = 0.5;
  for (let i = 0; i < 10; i++) { const r = i / 10, y = hz + r * r * (H - hz); ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }
  for (let i = -5; i <= 5; i++) { ctx.beginPath(); ctx.moveTo(cx + i * 12, hz); ctx.lineTo(cx + i * 65, H); ctx.stroke(); }
  ctx.globalAlpha = 1;
}

function drawSoldier(cx, cy, time, moving) {
  const cyc = ((time * 1000) % 400) / 400; const rp = cyc * Math.PI * 2;
  const leg = moving ? Math.sin(rp) * 0.4 : 0; const arm = moving ? Math.sin(rp) * 0.3 : 0;
  ctx.save(); ctx.translate(cx, cy);
  ctx.save(); ctx.translate(0, 43); ctx.scale(1, 0.3); ctx.beginPath(); ctx.ellipse(0, 0, 20, 20, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill(); ctx.restore();
  [-7, 7].forEach((lx, i) => { ctx.save(); ctx.translate(lx, 14); ctx.rotate(i === 0 ? leg : -leg); ctx.fillStyle = CFG.COLORS.GOLD_DARK; ctx.fillRect(-4, 0, 8, 17); ctx.fillStyle = CFG.COLORS.GOLD; ctx.fillRect(-4, 17, 8, 17); ctx.fillStyle = '#111'; ctx.fillRect(-4, 32, 8, 4); ctx.restore(); });
  ctx.beginPath(); ctx.moveTo(-16, -18); ctx.lineTo(16, -18); ctx.lineTo(13, 14); ctx.lineTo(-13, 14); ctx.closePath(); ctx.fillStyle = CFG.COLORS.GOLD; ctx.fill(); ctx.strokeStyle = CFG.COLORS.GOLD_DARK; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -16); ctx.lineTo(0, 11); ctx.strokeStyle = CFG.COLORS.GOLD_DARK; ctx.lineWidth = 1.5; ctx.stroke();
  [-20, 20].forEach((ax, i) => { ctx.save(); ctx.translate(ax, -13); ctx.rotate(i === 0 ? -arm * 0.8 : arm * 0.8); ctx.fillStyle = CFG.COLORS.GOLD_DARK; ctx.fillRect(-3.5, 0, 7, 14); ctx.fillStyle = CFG.COLORS.GOLD; ctx.fillRect(-3.5, 14, 7, 14); ctx.fillStyle = '#111'; ctx.fillRect(-3.5, 26, 7, 3); ctx.restore(); });
  ctx.beginPath(); ctx.ellipse(0, -30, 12, 13, 0, 0, Math.PI * 2); ctx.fillStyle = CFG.COLORS.GOLD; ctx.fill(); ctx.strokeStyle = CFG.COLORS.GOLD_DARK; ctx.lineWidth = 1; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, -42); ctx.lineTo(0, -20); ctx.strokeStyle = CFG.COLORS.GOLD_LIGHT; ctx.lineWidth = 2.5; ctx.stroke();
  [-22, 22].forEach(sx => { ctx.beginPath(); ctx.ellipse(sx, -16, 8, 5, 0, 0, Math.PI * 2); ctx.fillStyle = CFG.COLORS.GOLD; ctx.fill(); });
  ctx.save(); ctx.translate(7, -3); ctx.rotate(-0.3); ctx.fillStyle = '#2a2a2a'; ctx.fillRect(-2.5, -27, 5, 44); ctx.restore();
  if (player.fireFlash > 0) { ctx.beginPath(); ctx.arc(9, -40, 10 * player.fireFlash, 0, Math.PI * 2); const fg = ctx.createRadialGradient(9, -40, 0, 9, -40, 10); fg.addColorStop(0, 'rgba(255,255,200,0.7)'); fg.addColorStop(1, 'rgba(255,107,53,0)'); ctx.fillStyle = fg; ctx.fill(); }
  if (player.invuln) { ctx.beginPath(); ctx.ellipse(0, 0, 30, 45, 0, 0, Math.PI * 2); ctx.strokeStyle = player.isDashing ? CFG.COLORS.CYAN : CFG.COLORS.GOLD; ctx.lineWidth = 2; ctx.globalAlpha = 0.3 + Math.sin(time * 8) * 0.15; ctx.stroke(); ctx.globalAlpha = 1; }
  ctx.restore();
}
function drawRunner(x, y, t) {
  const leg = Math.sin(t * 10) * 7; ctx.save(); ctx.translate(x, y); ctx.fillStyle = CFG.COLORS.GOLD; ctx.fillRect(-4, -25, 8, 20);
  ctx.beginPath(); ctx.arc(0, -30, 5, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-7, -20, 3, 14); ctx.fillRect(4, -20, 3, 14);
  ctx.save(); ctx.translate(-2, -5); ctx.rotate(leg * 0.04); ctx.fillRect(-2, 0, 4, 16); ctx.restore();
  ctx.save(); ctx.translate(2, -5); ctx.rotate(-leg * 0.04); ctx.fillRect(-2, 0, 4, 16); ctx.restore(); ctx.restore();
}

function drawHUD() {
  const bW = W * 0.48, bH = 11, bX = (W - bW) / 2, bY = 12;
  ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillRect(bX - 1, bY - 1, bW + 2, bH + 2);
  const hpR = Math.max(0, boss.hp / boss.maxHp);
  ctx.fillStyle = boss.phase === 2 ? CFG.COLORS.RED : boss.phase === 1 ? CFG.COLORS.ORANGE : '#C00'; ctx.fillRect(bX, bY, bW * hpR, bH);
  ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(bX, bY, bW * hpR, bH * 0.4);
  ctx.strokeStyle = CFG.COLORS.GOLD; ctx.lineWidth = 1; [0.66, 0.33].forEach(m => { ctx.beginPath(); ctx.moveTo(bX + bW * m, bY); ctx.lineTo(bX + bW * m, bY + bH); ctx.stroke(); });
  ctx.font = 'bold 7px monospace'; ctx.fillStyle = CFG.COLORS.GOLD; ctx.textAlign = 'center'; ctx.fillText('WAR MACHINE // K-01', W / 2, bY - 3);
  ctx.font = '6px monospace'; ctx.fillStyle = '#FFF'; ctx.fillText(`${Math.ceil(hpR * 100)}%`, W / 2 + bW * 0.27, bY + bH - 2);
  if (boss.phase > 0) { ctx.font = 'bold 6px monospace'; ctx.fillStyle = boss.phase === 2 ? CFG.COLORS.RED : CFG.COLORS.ORANGE; ctx.fillText(CFG.BOSS.PHASES[boss.phase].name, W / 2, bY + bH + 9); }
  ctx.fillStyle = CFG.COLORS.GOLD; ctx.beginPath(); ctx.moveTo(14, 12); ctx.lineTo(9, 19); ctx.lineTo(19, 19); ctx.closePath(); ctx.fill();
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(24, 13, 65, 5);
  const pR = player.hp / player.maxHp; ctx.fillStyle = pR > 0.5 ? CFG.COLORS.GOLD : pR > 0.25 ? CFG.COLORS.ORANGE : CFG.COLORS.RED; ctx.fillRect(24, 13, 65 * pR, 5);
  ctx.font = '7px monospace'; ctx.fillStyle = '#DDD'; ctx.textAlign = 'left'; ctx.fillText(`${Math.ceil(player.hp)}`, 92, 17);
  
  // Ammo & Dash
  ctx.font = 'bold 10px monospace'; ctx.fillStyle = player.ammo > 5 ? '#FFF' : CFG.COLORS.RED; ctx.textAlign = 'left'; ctx.fillText(`${player.ammo}`, 14, H - 18);
  ctx.font = '7px monospace'; ctx.fillStyle = '#666'; ctx.fillText(`/${player.maxAmmo}`, 30, H - 18);
  
  // Dash Cooldown Indicator
  const dashReady = player.dashCd <= 0;
  ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(55, H - 22, 30, 4);
  ctx.fillStyle = dashReady ? CFG.COLORS.CYAN : '#444'; ctx.fillRect(55, H - 22, 30 * (dashReady ? 1 : (1 - player.dashCd / CFG.PLAYER.DASH_CD)), 4);
  ctx.font = '6px monospace'; ctx.fillStyle = dashReady ? CFG.COLORS.CYAN : '#666'; ctx.fillText('DASH', 55, H - 25);

  ctx.font = '7px monospace'; ctx.fillStyle = CFG.COLORS.GOLD; ctx.textAlign = 'left'; ctx.fillText(`SCORE: ${score}`, 14, 30);
  if (highScore > 0) { ctx.fillStyle = '#555'; ctx.fillText(`HI: ${highScore}`, 14, 39); }
  let effY = 48; for (const eff of activeEffects) { ctx.fillStyle = '#00F5FF'; ctx.font = '6px monospace'; ctx.fillText(`â—${Math.ceil(eff.timer)}s`, 14, effY); effY += 9; }
  if (combo.count >= 3) {
    const tier = CFG.COMBO.TIERS[combo.tier]; const fl = 1 + (combo.flash > 0 ? combo.flash * 0.12 : 0);
    ctx.save(); ctx.translate(W - 18, 26); ctx.scale(fl, fl);
    ctx.font = 'bold 16px monospace'; ctx.fillStyle = tier.color; ctx.textAlign = 'right'; ctx.fillText(`x${combo.count}`, 0, 0);
    ctx.font = '6px monospace'; ctx.fillStyle = CFG.COLORS.GOLD_LIGHT; ctx.fillText('GILDED COMBO', 0, 10);
    if (tier.name) { ctx.font = 'bold 7px monospace'; ctx.fillStyle = tier.color; ctx.fillText(tier.name, 0, -10); }
    ctx.restore();
  }
  const bcx = W / 2, bcy = H - 22, bp = beatProgress();
  ctx.beginPath(); ctx.arc(bcx, bcy, 12, 0, Math.PI * 2); ctx.strokeStyle = CFG.COLORS.GOLD_DARK; ctx.lineWidth = 1.5; ctx.stroke();
  ctx.beginPath(); ctx.arc(bcx, bcy, 12, -Math.PI / 2, -Math.PI / 2 + bp * Math.PI * 2); ctx.strokeStyle = CFG.COLORS.CYAN; ctx.lineWidth = 2.5; ctx.stroke();
  const nb = bp > 0.85 || bp < 0.15; ctx.beginPath(); ctx.arc(bcx, bcy, nb ? 4.5 : 2.5, 0, Math.PI * 2); ctx.fillStyle = nb ? CFG.COLORS.GOLD : CFG.COLORS.GOLD_DARK; ctx.fill();
  ctx.font = '7px monospace'; ctx.fillStyle = CFG.COLORS.GOLD_LIGHT; ctx.globalAlpha = 0.6; ctx.textAlign = 'center'; ctx.fillText('> Destroy reactor core <', W / 2, H - 42); ctx.globalAlpha = 1;
  const mc = activeMinions(); if (mc > 0) { ctx.font = '6px monospace'; ctx.fillStyle = CFG.COLORS.CYAN; ctx.textAlign = 'right'; ctx.fillText(`Enemies: ${mc}`, W - 10, H - 18); }
  if (player.dmgFlash > 0) { const vg = ctx.createRadialGradient(W / 2, H / 2, W * 0.3, W / 2, H / 2, W * 0.6); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, `rgba(180,0,0,${player.dmgFlash * 0.35})`); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H); }
  if (combo.tier >= 2 && combo.flash > 0) { ctx.fillStyle = CFG.COMBO.TIERS[combo.tier].color; ctx.globalAlpha = combo.flash * 0.04; ctx.fillRect(0, 0, W, H); ctx.globalAlpha = 1; }
  if (timeScale < 1) { ctx.font = 'bold 8px monospace'; ctx.fillStyle = CFG.COLORS.ORANGE; ctx.textAlign = 'center'; ctx.globalAlpha = 0.6 + Math.sin(player.animT * 6) * 0.3; ctx.fillText('â—† TIME SLOW â—†', W / 2, 38); ctx.globalAlpha = 1; }
}

function updateCombat(rawDt) {
  // HITSTOP LOGIC
  if (hitstopTime > 0) { hitstopTime -= rawDt; return; }
  
  const dt = rawDt * timeScale;
  player.animT += rawDt;
  if (player.invulnTimer > 0) { player.invulnTimer -= dt; if (player.invulnTimer <= 0 && !player.isDashing) player.invuln = false; }
  
  // DASH LOGIC
  if (player.isDashing) {
    player.dashTime -= rawDt;
    player.x += player.dashDx * CFG.PLAYER.DASH_SPEED * rawDt;
    player.y += player.dashDy * CFG.PLAYER.DASH_SPEED * rawDt;
    emitP(W / 2 + player.x * 0.3, H * 0.6 + player.y * 0.3, CFG.COLORS.CYAN, 2, 50, 0.2, 0);
    if (player.dashTime <= 0) { player.isDashing = false; player.invuln = false; }
  }
  if (player.dashCd > 0) player.dashCd -= rawDt;

  let mx = 0, my = 0;
  if (keys['d'] || keys['arrowright']) mx += 1; if (keys['a'] || keys['arrowleft']) mx -= 1;
  if (keys['w'] || keys['arrowup']) my += 1; if (keys['s'] || keys['arrowdown']) my -= 1;
  if (isMobile && touch.joyActive) { mx = touch.joyDX; my = -touch.joyDY; }
  player.moving = mx !== 0 || my !== 0;
  
  if (!player.isDashing) {
    player.x += mx * CFG.PLAYER.SPEED * dt; player.y -= my * CFG.PLAYER.SPEED * 0.7 * dt;
  }
  player.x = Math.max(-200, Math.min(200, player.x)); player.y = Math.max(-70, Math.min(70, player.y));

  // Dash Trigger (Space or Shift)
  if ((keys[' '] || keys['shift']) && player.dashCd <= 0 && !player.isDashing) {
    player.isDashing = true; player.dashTime = CFG.PLAYER.DASH_DUR; player.dashCd = CFG.PLAYER.DASH_CD;
    player.invuln = true;
    player.dashDx = mx || 0; player.dashDy = my ? -my * 0.7 : 0;
    if (player.dashDx === 0 && player.dashDy === 0) player.dashDx = 1; // Default dash right
    playSfx(600, 'sawtooth', 0.1);
    keys[' '] = false; keys['shift'] = false;
  }

  player.fireCd -= dt;
  if (player.fireFlash > 0) player.fireFlash -= rawDt * 8;
  if (player.dmgFlash > 0) player.dmgFlash -= rawDt * 3;
  const firing = mouseDown || (isMobile && touch.fireBtn);
  if (firing && player.fireCd <= 0 && player.ammo > 0 && !player.isDashing) {
    player.fireCd = player.fireRate; player.ammo--; player.fireFlash = 1;
    let hitSomething = false;
    if (boss.alive) {
      const bHitW = 55 * boss.scale, bHitH = 70 * boss.scale;
      if (Math.abs(mouseX - boss.x) < bHitW && Math.abs(mouseY - boss.y) < bHitH) {
        const beat = isOnBeat();
        const isReactor = boss.reactorExposed && Math.abs(mouseX - boss.x) < 18 && Math.abs(mouseY - (boss.y - 8)) < 18;
        let dmg = CFG.PLAYER.DMG * player.damageMult * comboMult();
        if (beat.hit) dmg *= beat.perfect ? 3 : 2;
        if (isReactor) dmg *= CFG.BOSS.REACTOR_MULT;
        boss.hp -= dmg; boss.dmgFlash = 1;
        if (isReactor) { boss.shake = 0.4; hitstopTime = 0.08; }
        addCombo(); if (beat.hit) { addCombo(); playSfx(beat.perfect ? 880 : 660, 'triangle', 0.1); }
        score += Math.floor((isReactor ? 200 : 100) * comboMult() * (beat.hit ? 2 : 1));
        emitP(mouseX, mouseY, isReactor ? CFG.COLORS.ORANGE : CFG.COLORS.GOLD, isReactor ? 18 : 8, isReactor ? 220 : 140, 0.5);
        hitSomething = true;
        if (boss.hp <= 0) {
          boss.hp = 0; boss.alive = false; boss.shake = 1.5;
          emitP(boss.x, boss.y, CFG.COLORS.ORANGE, 40, 300, 1.0); emitP(boss.x, boss.y, CFG.COLORS.GOLD, 30, 200, 0.8);
          playSfx(80, 'sine', 0.5); hitstopTime = 0.3; // Massive hitstop on death
          gameState = STATE.VICTORY;
          if (score > highScore) { highScore = score; try { localStorage.setItem('kamdridi_qwen_original_hs_v4', String(highScore)); } catch(e) {} }
        }
      }
    }
    if (!hitSomething) {
      const dmg = CFG.PLAYER.DMG * player.damageMult * comboMult();
      hitSomething = hitMinion(mouseX, mouseY, dmg);
      if (hitSomething) { addCombo(); score += Math.floor(50 * comboMult()); }
    }
    if (!hitSomething) resetCombo();
  }
  if (keys['r'] || (player.ammo <= 0 && player.fireCd < -1.5)) player.ammo = player.maxAmmo;
  if (combo.timer > 0) { combo.timer -= dt; if (combo.timer <= 0) resetCombo(); }
  if (combo.flash > 0) combo.flash -= dt;
  updateBoss(dt); if (boss.phase >= 1) updateMinions(dt); updatePowerups(dt); updateRhythm(); updateParts(rawDt);
  if (player.hp <= 0) { player.hp = 0; gameState = STATE.DEAD; if (score > highScore) { highScore = score; try { localStorage.setItem('kamdridi_qwen_original_hs_v4', String(highScore)); } catch(e) {} } }
}

function drawCombat() {
  ctx.fillStyle = CFG.COLORS.VOID; ctx.fillRect(0, 0, W, H);
  drawEnv(player.animT); drawBoss(); drawBossTelegraph(); drawMinions(); drawPowerups();
  drawSoldier(W / 2 + player.x * 0.3, H * 0.6 + player.y * 0.3, player.animT, player.moving);
  drawParts(); drawHUD();
}

let vicT = 0;
function drawVictory(dt) {
  vicT += dt; ctx.fillStyle = CFG.COLORS.VOID; ctx.fillRect(0, 0, W, H);
  if (vicT > 0.4 && Math.random() < 0.25) emitP(Math.random() * W, Math.random() * H * 0.4, [CFG.COLORS.GOLD, CFG.COLORS.CYAN, CFG.COLORS.ORANGE][Math.floor(Math.random() * 3)], 1, 25, 2, 25);
  updateParts(dt); drawParts(); const cx = W / 2;
  if (vicT > 0.3) { ctx.font = 'bold 18px monospace'; ctx.fillStyle = CFG.COLORS.GOLD; ctx.textAlign = 'center'; ctx.shadowColor = CFG.COLORS.GOLD; ctx.shadowBlur = 10; ctx.fillText('REACTOR DESTROYED', cx, H / 2 - 48); ctx.shadowBlur = 0; }
  if (vicT > 0.7) { ctx.font = '9px monospace'; ctx.fillStyle = '#FFF'; ctx.fillText(`Score: ${score.toLocaleString()}`, cx, H / 2 - 18); ctx.fillText(`Max Combo: x${combo.max}`, cx, H / 2); if (score >= highScore && score > 0) { ctx.fillStyle = CFG.COLORS.GOLD; ctx.fillText('ðŸ† NEW HIGH SCORE!', cx, H / 2 + 18); } }
  if (vicT > 1.5) { const p = 1 + Math.sin(vicT * 3) * 0.02; ctx.save(); ctx.translate(cx, H / 2 + 48); ctx.scale(p, p); ctx.strokeStyle = CFG.COLORS.GOLD; ctx.lineWidth = 1.5; ctx.strokeRect(-75, -11, 150, 22); ctx.font = 'bold 8px monospace'; ctx.fillStyle = CFG.COLORS.GOLD; ctx.fillText('[ SYNC TO ECOSYSTEM ]', 0, 4); ctx.restore(); ctx.font = '7px monospace'; ctx.fillStyle = '#555'; ctx.fillText('[R] REPLAY', cx, H / 2 + 72); }
  if (vicT > 2.5) { ctx.font = '6px monospace'; ctx.fillStyle = '#333'; ctx.textAlign = 'center'; ctx.fillText('"Watch me as I take you down through the ceiling to the ground"', cx, H - 12); }
  if (keys['r']) restart();
}
function drawDead(dt) {
  ctx.fillStyle = 'rgba(10,0,0,0.92)'; ctx.fillRect(0, 0, W, H);
  ctx.font = 'bold 16px monospace'; ctx.fillStyle = CFG.COLORS.RED; ctx.textAlign = 'center'; ctx.fillText('SYSTEM FAILURE', W / 2, H / 2 - 18);
  ctx.font = '9px monospace'; ctx.fillStyle = '#888'; ctx.fillText(`Score: ${score}`, W / 2, H / 2 + 5);
  ctx.fillStyle = '#555'; ctx.fillText('[R] Retry', W / 2, H / 2 + 28);
  if (keys['r']) restart();
}
function restart() {
  player.hp = CFG.PLAYER.HP; player.ammo = CFG.PLAYER.AMMO; player.x = 0; player.y = 0;
  player.fireCd = 0; player.invuln = false; player.isDashing = false; player.dashCd = 0; player.fireRate = CFG.PLAYER.FIRE_RATE; player.damageMult = 1;
  boss.hp = CFG.BOSS.HP; boss.alive = true; boss.phase = 0; boss.scale = 0;
  boss.projectiles = []; boss.reactorExposed = false; boss.atkTimer = 2; boss.shake = 0.5;
  boss.telegraph = null; boss.laserActive = false; boss.atkState = 'IDLE';
  combo.count = 0; combo.max = 0; combo.tier = 0; combo.timer = 0;
  score = 0; vicT = 0; timeScale = 1; hitstopTime = 0;
  for (let i = 0; i < PMAX; i++) parts[i].active = false;
  for (let i = 0; i < MMAX; i++) minions[i].active = false;
  for (let i = 0; i < PUMAX; i++) powerups[i].active = false;
  minionProjs.length = 0; activeEffects.length = 0; puSpawnTimer = 0;
  gameState = STATE.COMBAT;
}

// TITLE SCREEN
let titleT = 0;
function drawTitle(dt) {
  titleT += dt;
  ctx.fillStyle = CFG.COLORS.VOID; ctx.fillRect(0, 0, W, H);
  
  // Animated Grid Background
  ctx.strokeStyle = CFG.COLORS.GOLD; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.1;
  for (let i = 0; i < W; i += 40) { ctx.beginPath(); ctx.moveTo(i + (titleT * 20) % 40, 0); ctx.lineTo(i + (titleT * 20) % 40, H); ctx.stroke(); }
  for (let i = 0; i < H; i += 40) { ctx.beginPath(); ctx.moveTo(0, i + (titleT * 15) % 40); ctx.lineTo(W, i + (titleT * 15) % 40); ctx.stroke(); }
  ctx.globalAlpha = 1;

  // Logo
  ctx.font = 'bold 36px monospace'; ctx.fillStyle = CFG.COLORS.GOLD; ctx.textAlign = 'center';
  ctx.shadowColor = CFG.COLORS.GOLD; ctx.shadowBlur = 15;
  ctx.fillText('KAMDRIDI', W / 2, H / 2 - 40); ctx.shadowBlur = 0;
  
  ctx.font = '12px monospace'; ctx.fillStyle = CFG.COLORS.CYAN;
  ctx.fillText('ACT II : WAR MACHINES', W / 2, H / 2 - 15);

  // Start Button
  const pulse = 1 + Math.sin(titleT * 3) * 0.05;
  ctx.save(); ctx.translate(W / 2, H / 2 + 40); ctx.scale(pulse, pulse);
  ctx.strokeStyle = CFG.COLORS.GOLD; ctx.lineWidth = 2; ctx.strokeRect(-80, -15, 160, 30);
  ctx.font = 'bold 12px monospace'; ctx.fillStyle = CFG.COLORS.GOLD;
  ctx.fillText(isMobile ? 'TAP TO START' : 'CLICK TO START', 0, 5);
  ctx.restore();

  // High Score
  if (highScore > 0) {
    ctx.font = '10px monospace'; ctx.fillStyle = '#888'; ctx.textAlign = 'center';
    ctx.fillText(`HIGH SCORE: ${highScore}`, W / 2, H - 30);
  }
}

const touch = { joyActive: false, joyStartX: 0, joyStartY: 0, joyDX: 0, joyDY: 0, joyId: -1, fireBtn: false, fireId: -1 };
function setupTouch() {
  canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    if (gameState === STATE.TITLE) { startGame(); return; }
    if (!audioStarted) startAudio();
    for (const t of e.changedTouches) {
      const r = canvas.getBoundingClientRect(); const x = (t.clientX - r.left) * (W / r.width); const y = (t.clientY - r.top) * (H / r.height);
      if (x < W * 0.4) { touch.joyActive = true; touch.joyStartX = x; touch.joyStartY = y; touch.joyDX = 0; touch.joyDY = 0; touch.joyId = t.identifier; }
      else { touch.fireBtn = true; touch.fireId = t.identifier; mouseX = x; mouseY = y; }
    }
  }, { passive: false });
  canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    for (const t of e.changedTouches) {
      const r = canvas.getBoundingClientRect(); const x = (t.clientX - r.left) * (W / r.width); const y = (t.clientY - r.top) * (H / r.height);
      if (t.identifier === touch.joyId) { const dx = x - touch.joyStartX, dy = y - touch.joyStartY; const d = Math.sqrt(dx * dx + dy * dy), max = 35; const cd = Math.min(d, max); touch.joyDX = d > 0 ? (dx / d) * (cd / max) : 0; touch.joyDY = d > 0 ? (dy / d) * (cd / max) : 0; }
      if (t.identifier === touch.fireId) { mouseX = x; mouseY = y; }
    }
  }, { passive: false });
  canvas.addEventListener('touchend', e => { e.preventDefault(); for (const t of e.changedTouches) { if (t.identifier === touch.joyId) { touch.joyActive = false; touch.joyDX = 0; touch.joyDY = 0; } if (t.identifier === touch.fireId) { touch.fireBtn = false; } } }, { passive: false });
}
function drawMobileControls() {
  if (!isMobile || gameState !== STATE.COMBAT) return;
  ctx.save(); ctx.globalAlpha = 0.3;
  const jx = 55, jy = H - 60; ctx.beginPath(); ctx.arc(jx, jy, 30, 0, Math.PI * 2); ctx.strokeStyle = CFG.COLORS.GOLD; ctx.lineWidth = 1.5; ctx.stroke();
  if (touch.joyActive) { ctx.beginPath(); ctx.arc(jx + touch.joyDX * 22, jy + touch.joyDY * 22, 10, 0, Math.PI * 2); ctx.fillStyle = CFG.COLORS.GOLD; ctx.globalAlpha = 0.5; ctx.fill(); }
  const fx = W - 55, fy = H - 60; ctx.globalAlpha = touch.fireBtn ? 0.5 : 0.3; ctx.beginPath(); ctx.arc(fx, fy, 25, 0, Math.PI * 2); ctx.strokeStyle = CFG.COLORS.GOLD; ctx.lineWidth = 2; ctx.stroke();
  if (touch.fireBtn) { ctx.fillStyle = 'rgba(255,215,0,0.15)'; ctx.fill(); }
  ctx.font = 'bold 7px monospace'; ctx.fillStyle = CFG.COLORS.GOLD; ctx.textAlign = 'center'; ctx.globalAlpha = 0.5; ctx.fillText('FIRE', fx, fy + 3);
  ctx.restore();
}

function drawTxt(text, x, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = Math.min(1, a); ctx.font = 'bold 12px monospace'; ctx.textAlign = 'center'; ctx.fillStyle = CFG.COLORS.GOLD; ctx.shadowColor = CFG.COLORS.GOLD; ctx.shadowBlur = 7; ctx.fillText(text, x, y); ctx.shadowBlur = 0; ctx.restore(); }

function startGame() {
  gameState = STATE.TRANSITION;
  trans.time = 0; trans.phase = 0;
  if (!audioStarted) startAudio();
}

function loop(ts) {
  const dt = Math.min((ts - lastTime) / 1000, 0.033);
  lastTime = ts;
  
  switch (gameState) {
    case STATE.TITLE: drawTitle(dt); break;
    case STATE.TRANSITION: updateTrans(dt); updateParts(dt); drawTrans(); break;
    case STATE.COMBAT: updateCombat(dt); drawCombat(); drawMobileControls(); break;
    case STATE.VICTORY: drawVictory(dt); break;
    case STATE.DEAD: drawDead(dt); break;
  }
  requestAnimationFrame(loop);
}

function init() {
  canvas = document.getElementById('game-canvas');
  if (!canvas) { console.error("âŒ No #game-canvas"); return; }
  ctx = canvas.getContext('2d'); W = CFG.W; H = CFG.H; canvas.width = W; canvas.height = H;
  isMobile = window.innerWidth < 768 || 'ontouchstart' in window;
  document.addEventListener('keydown', e => { 
    keys[e.key.toLowerCase()] = true; 
    if (gameState === STATE.TITLE && (e.key === 'Enter' || e.key === ' ')) startGame();
  });
  document.addEventListener('keyup', e => { keys[e.key.toLowerCase()] = false; });
  canvas.addEventListener('mousemove', e => { const r = canvas.getBoundingClientRect(); mouseX = (e.clientX - r.left) * (W / r.width); mouseY = (e.clientY - r.top) * (H / r.height); });
  canvas.addEventListener('mousedown', () => { 
    mouseDown = true; 
    if (gameState === STATE.TITLE) startGame();
    if (!audioStarted) startAudio(); 
  });
  canvas.addEventListener('mouseup', () => { mouseDown = false; });
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  if (isMobile) setupTouch();
  lastTime = performance.now();
  console.log("ðŸŽ® KAMDRIDI ACT II â€” WAR MACHINES v4.0 (JUICE)");
  console.log("ðŸ”¥ Features: Dash (Space), Hitstop, Dynamic Audio, Title Screen");
  requestAnimationFrame(loop);
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
