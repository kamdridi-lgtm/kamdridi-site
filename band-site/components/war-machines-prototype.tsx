"use client";

import { useEffect, useRef, useState } from "react";
import { Crosshair, Gauge, Radio, Zap } from "lucide-react";

type GameState = "idle" | "running" | "victory" | "defeat";

type Orb = {
  x: number;
  y: number;
  vy: number;
  pulse: number;
};

type Shot = {
  x: number;
  y: number;
  vy: number;
  damage: number;
  perfect: boolean;
};

type BossShot = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function WarMachinesPrototype() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});
  const stateRef = useRef({
    gameState: "idle" as GameState,
    playerX: 0,
    playerY: 0,
    playerVx: 0,
    health: 100,
    ammo: 12,
    maxAmmo: 30,
    combo: 0,
    score: 0,
    bossHp: 1000,
    phase: 1,
    lastBeat: 0,
    bpm: 120,
    beatInterval: 0.5,
    beatConfidence: 0,
    onBeat: false,
    dashCd: 0,
    dashTimer: 0,
    reloadTimer: 0,
    fireCd: 0,
    orbTimer: 0,
    bossTimer: 1.6,
    shake: 0,
    orbs: [] as Orb[],
    shots: [] as Shot[],
    bossShots: [] as BossShot[]
  });

  const [hud, setHud] = useState({
    gameState: "idle" as GameState,
    health: 100,
    ammo: 12,
    combo: 0,
    score: 0,
    bossHp: 1000,
    phase: 1,
    beatConfidence: 0,
    onBeat: false,
    dashReady: true
  });

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      keysRef.current[event.code] = true;
      if (["Space", "ArrowLeft", "ArrowRight"].includes(event.code)) event.preventDefault();
      if (event.code === "Space") dash();
      if (event.code === "KeyJ" || event.code === "Enter") fire();
      if (event.code === "KeyR") reload();
    };
    const up = (event: KeyboardEvent) => {
      keysRef.current[event.code] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      const s = stateRef.current;
      if (!s.playerX) {
        s.playerX = canvas.width / 2;
        s.playerY = canvas.height * 0.82;
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.033);
      last = now;
      update(dt, now / 1000);
      render();
      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);
    return () => window.removeEventListener("resize", resize);
  }, []);

  function start() {
    const canvas = canvasRef.current;
    const s = stateRef.current;
    s.gameState = "running";
    s.playerX = (canvas?.width || 900) / 2;
    s.playerY = (canvas?.height || 600) * 0.82;
    s.health = 100;
    s.ammo = 12;
    s.combo = 0;
    s.score = 0;
    s.bossHp = 1000;
    s.phase = 1;
    s.lastBeat = performance.now() / 1000;
    s.orbs = [];
    s.shots = [];
    s.bossShots = [];
    syncHud();
  }

  function fire() {
    const s = stateRef.current;
    if (s.gameState !== "running" || s.fireCd > 0 || s.ammo <= 0) return;
    const damage = s.onBeat ? 52 : 24;
    s.ammo -= 1;
    s.fireCd = 0.15;
    s.combo = s.onBeat ? s.combo + 1 : 0;
    s.score += s.onBeat ? 120 + s.combo * 12 : 18;
    s.shots.push({ x: s.playerX, y: s.playerY - 34, vy: -860, damage, perfect: s.onBeat });
    s.shake = s.onBeat ? 5 : 2;
    syncHud();
  }

  function dash() {
    const s = stateRef.current;
    if (s.gameState !== "running" || s.dashCd > 0) return;
    const dir = keysRef.current.ArrowLeft || keysRef.current.KeyA ? -1 : keysRef.current.ArrowRight || keysRef.current.KeyD ? 1 : 1;
    s.playerVx = dir * 1100;
    s.dashTimer = 0.16;
    s.dashCd = 1;
    s.shake = 4;
  }

  function reload() {
    const s = stateRef.current;
    if (s.gameState !== "running" || s.reloadTimer > 0 || s.ammo >= s.maxAmmo) return;
    s.reloadTimer = 1.5;
  }

  function update(dt: number, now: number) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = stateRef.current;

    const phase = ((now - s.lastBeat) % s.beatInterval) / s.beatInterval;
    const distance = Math.min(phase, 1 - phase) * s.beatInterval;
    s.onBeat = distance <= 0.12;
    s.beatConfidence = clamp(1 - distance / 0.12, 0, 1);

    if (now - s.lastBeat >= s.beatInterval) {
      s.lastBeat += s.beatInterval * Math.floor((now - s.lastBeat) / s.beatInterval);
    }

    if (s.gameState !== "running") {
      syncHud();
      return;
    }

    s.fireCd = Math.max(0, s.fireCd - dt);
    s.dashCd = Math.max(0, s.dashCd - dt);
    s.dashTimer = Math.max(0, s.dashTimer - dt);
    s.shake *= 0.88;

    if (s.reloadTimer > 0) {
      s.reloadTimer -= dt;
      if (s.reloadTimer <= 0) s.ammo = s.maxAmmo;
    }

    const left = keysRef.current.ArrowLeft || keysRef.current.KeyA;
    const right = keysRef.current.ArrowRight || keysRef.current.KeyD;
    const sprint = keysRef.current.ShiftLeft || keysRef.current.ShiftRight;
    const targetSpeed = sprint ? 540 : 360;
    if (left) s.playerVx += (-targetSpeed - s.playerVx) * 12 * dt;
    else if (right) s.playerVx += (targetSpeed - s.playerVx) * 12 * dt;
    else if (s.dashTimer <= 0) s.playerVx *= Math.pow(0.001, dt);

    s.playerX = clamp(s.playerX + s.playerVx * dt, 56, canvas.width - 56);

    s.orbTimer -= dt;
    if (s.orbTimer <= 0) {
      s.orbTimer = 1.1 - Math.min(0.35, s.phase * 0.06);
      s.orbs.push({ x: 80 + Math.random() * (canvas.width - 160), y: -30, vy: 150 + s.phase * 25, pulse: Math.random() * Math.PI * 2 });
    }

    for (let i = s.orbs.length - 1; i >= 0; i--) {
      const orb = s.orbs[i];
      orb.y += orb.vy * dt;
      orb.pulse += dt * 5;
      if (Math.hypot(orb.x - s.playerX, orb.y - s.playerY) < 42) {
        s.ammo = clamp(s.ammo + 3, 0, s.maxAmmo);
        s.score += 30;
        s.orbs.splice(i, 1);
      } else if (orb.y > canvas.height + 40) {
        s.orbs.splice(i, 1);
      }
    }

    for (let i = s.shots.length - 1; i >= 0; i--) {
      const shot = s.shots[i];
      shot.y += shot.vy * dt;
      const bossX = canvas.width / 2;
      const bossY = canvas.height * 0.24;
      if (Math.hypot(shot.x - bossX, shot.y - bossY) < 96) {
        s.bossHp = Math.max(0, s.bossHp - shot.damage);
        s.shots.splice(i, 1);
        s.shake = shot.perfect ? 6 : 3;
      } else if (shot.y < -40) {
        s.shots.splice(i, 1);
      }
    }

    if (s.bossHp <= 660 && s.phase < 2) s.phase = 2;
    if (s.bossHp <= 330 && s.phase < 3) s.phase = 3;

    s.bossTimer -= dt;
    if (s.bossTimer <= 0) {
      s.bossTimer = Math.max(0.42, 1.2 - s.phase * 0.18);
      const bossX = canvas.width / 2;
      const bossY = canvas.height * 0.24;
      const dx = s.playerX - bossX;
      const dy = s.playerY - bossY;
      const len = Math.max(1, Math.hypot(dx, dy));
      s.bossShots.push({ x: bossX, y: bossY + 42, vx: (dx / len) * (180 + s.phase * 40), vy: (dy / len) * (180 + s.phase * 40) });
    }

    for (let i = s.bossShots.length - 1; i >= 0; i--) {
      const shot = s.bossShots[i];
      shot.x += shot.vx * dt;
      shot.y += shot.vy * dt;
      if (Math.hypot(shot.x - s.playerX, shot.y - s.playerY) < 34 && s.dashTimer <= 0) {
        s.health = Math.max(0, s.health - (8 + s.phase * 4));
        s.combo = 0;
        s.shake = 9;
        s.bossShots.splice(i, 1);
      } else if (shot.y > canvas.height + 80 || shot.x < -80 || shot.x > canvas.width + 80) {
        s.bossShots.splice(i, 1);
      }
    }

    if (s.bossHp <= 0) s.gameState = "victory";
    if (s.health <= 0) s.gameState = "defeat";
    syncHud();
  }

  function render() {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const s = stateRef.current;
    const w = canvas.width;
    const h = canvas.height;
    const shakeX = (Math.random() - 0.5) * s.shake;
    const shakeY = (Math.random() - 0.5) * s.shake;

    ctx.save();
    ctx.translate(shakeX, shakeY);
    ctx.clearRect(-20, -20, w + 40, h + 40);

    const bg = ctx.createLinearGradient(0, 0, 0, h);
    bg.addColorStop(0, "#06070b");
    bg.addColorStop(0.45, "#111016");
    bg.addColorStop(1, "#050302");
    ctx.fillStyle = bg;
    ctx.fillRect(-20, -20, w + 40, h + 40);

    drawArena(ctx, w, h, s.phase);
    drawBoss(ctx, w / 2, h * 0.24, s);
    drawEntities(ctx, s);
    drawPlayer(ctx, s);
    drawBeatRing(ctx, w, h, s);

    if (s.gameState !== "running") {
      ctx.fillStyle = "rgba(0,0,0,.48)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#f4c66a";
      ctx.textAlign = "center";
      ctx.font = "bold 34px Impact, sans-serif";
      ctx.fillText(s.gameState === "victory" ? "K-01 DESTROYED" : s.gameState === "defeat" ? "RUNNER DOWN" : "ACT II - WAR MACHINES", w / 2, h * 0.46);
      ctx.font = "16px monospace";
      ctx.fillText(s.gameState === "idle" ? "Press START PROTOCOL" : "Press START to run again", w / 2, h * 0.53);
    }

    ctx.restore();
  }

  function drawArena(ctx: CanvasRenderingContext2D, w: number, h: number, phase: number) {
    ctx.strokeStyle = phase >= 3 ? "rgba(255,48,48,.18)" : "rgba(244,198,106,.14)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 18; i++) {
      const y = h * 0.18 + i * h * 0.045;
      ctx.beginPath();
      ctx.moveTo(w * 0.18 - i * 9, y);
      ctx.lineTo(w * 0.82 + i * 9, y);
      ctx.stroke();
    }
    ctx.fillStyle = "rgba(244,198,106,.04)";
    ctx.fillRect(w * 0.14, h * 0.78, w * 0.72, 2);
  }

  function drawBoss(ctx: CanvasRenderingContext2D, x: number, y: number, s: typeof stateRef.current) {
    const glow = s.phase === 3 ? "#ff3030" : "#f4c66a";
    ctx.save();
    ctx.translate(x, y);
    ctx.shadowColor = glow;
    ctx.shadowBlur = 30;
    ctx.fillStyle = "rgba(12,10,9,.92)";
    ctx.fillRect(-88, -44, 176, 88);
    ctx.fillStyle = glow;
    ctx.fillRect(-42, -13, 24, 8);
    ctx.fillRect(18, -13, 24, 8);
    ctx.strokeStyle = glow;
    ctx.lineWidth = 2;
    ctx.strokeRect(-30, 18, 60, 18);
    ctx.restore();
  }

  function drawEntities(ctx: CanvasRenderingContext2D, s: typeof stateRef.current) {
    for (const orb of s.orbs) {
      const r = 9 + Math.sin(orb.pulse) * 2;
      ctx.shadowColor = "#f4c66a";
      ctx.shadowBlur = 18;
      ctx.fillStyle = "#f4c66a";
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const shot of s.shots) {
      ctx.shadowColor = shot.perfect ? "#fff3cc" : "#f4c66a";
      ctx.shadowBlur = shot.perfect ? 24 : 12;
      ctx.fillStyle = shot.perfect ? "#fff3cc" : "#f4c66a";
      ctx.fillRect(shot.x - 3, shot.y - 18, 6, 24);
    }
    for (const shot of s.bossShots) {
      ctx.shadowColor = "#ff3030";
      ctx.shadowBlur = 16;
      ctx.fillStyle = "#ff3030";
      ctx.beginPath();
      ctx.arc(shot.x, shot.y, 7, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  }

  function drawPlayer(ctx: CanvasRenderingContext2D, s: typeof stateRef.current) {
    ctx.save();
    ctx.translate(s.playerX, s.playerY);
    ctx.shadowColor = s.dashTimer > 0 ? "#fff3cc" : "#f4c66a";
    ctx.shadowBlur = s.dashTimer > 0 ? 30 : 10;
    ctx.fillStyle = s.dashTimer > 0 ? "#fff3cc" : "#f4c66a";
    ctx.beginPath();
    ctx.moveTo(0, -30);
    ctx.lineTo(20, 22);
    ctx.lineTo(0, 12);
    ctx.lineTo(-20, 22);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function drawBeatRing(ctx: CanvasRenderingContext2D, w: number, h: number, s: typeof stateRef.current) {
    const r = 30 + s.beatConfidence * 16;
    ctx.strokeStyle = s.onBeat ? "rgba(244,198,106,.95)" : "rgba(244,198,106,.26)";
    ctx.lineWidth = 2 + s.beatConfidence * 3;
    ctx.beginPath();
    ctx.arc(w - 70, h - 70, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  function syncHud() {
    const s = stateRef.current;
    setHud({
      gameState: s.gameState,
      health: Math.round(s.health),
      ammo: s.ammo,
      combo: s.combo,
      score: Math.round(s.score),
      bossHp: Math.round(s.bossHp),
      phase: s.phase,
      beatConfidence: s.beatConfidence,
      onBeat: s.onBeat,
      dashReady: s.dashCd <= 0
    });
  }

  return (
    <div className="relative overflow-hidden border border-[#f4c66a]/20 bg-black shadow-[0_30px_120px_rgba(0,0,0,.55)]">
      <canvas
        ref={canvasRef}
        className="block h-[68vh] min-h-[560px] w-full cursor-crosshair"
        onClick={fire}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-black/80 to-transparent p-4 font-mono text-xs uppercase tracking-[0.16em] text-[#f3dfb6]">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2"><Gauge className="h-4 w-4 text-[#f4c66a]" /> HP {hud.health}</span>
          <span>Ammo {hud.ammo}/30</span>
          <span>Combo {hud.combo}</span>
          <span>Score {hud.score}</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span>K-01 {hud.bossHp}</span>
          <span>Phase {hud.phase}</span>
          <span className={hud.onBeat ? "text-[#f4c66a]" : "text-stone-500"}>Beat {Math.round(hud.beatConfidence * 100)}%</span>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={start}
          className="pointer-events-auto inline-flex min-h-11 items-center gap-2 rounded-full bg-[#f4c66a] px-5 py-2 text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989]"
        >
          <Radio className="h-4 w-4" />
          Start Protocol
        </button>
        <div className="rounded-full border border-white/10 bg-black/55 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-stone-300 backdrop-blur">
          A/D Move · Shift Sprint · Space Dash · J/Click Fire · R Reload
        </div>
        <div className="hidden rounded-full border border-[#f4c66a]/20 bg-black/55 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-[#f4c66a] backdrop-blur md:inline-flex">
          <Crosshair className="mr-2 h-3.5 w-3.5" />
          Shoot on beat
        </div>
      </div>
      <div className="pointer-events-none absolute left-4 top-16 rounded-full border border-[#f4c66a]/20 bg-black/45 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f4c66a] backdrop-blur">
        <Zap className="mr-1 inline h-3 w-3" />
        {hud.gameState === "running" ? "Live vertical slice" : hud.gameState}
      </div>
    </div>
  );
}
