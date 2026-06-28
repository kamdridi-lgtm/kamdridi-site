// Filename: public/games/war-machines/particles.js
// Module: Polish FX
// Description: Lightweight pooled particles for impacts, sparks and boss explosions.
(function () {
  "use strict";

  const TAU = Math.PI * 2;

  class ParticlePool {
    constructor(max = 200) {
      this.max = max;
      this.particles = [];
    }

    clear() {
      this.particles.length = 0;
    }

    spawn(x, y, count, options = {}) {
      const color = options.color || "#FFD700";
      const minSpeed = options.minSpeed || 60;
      const maxSpeed = options.maxSpeed || 320;
      const minSize = options.minSize || 1.5;
      const maxSize = options.maxSize || 5;
      const life = options.life || 0.55;
      const gravity = options.gravity || 0;
      const spreadY = options.spreadY || 1;

      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * TAU;
        const speed = minSpeed + Math.random() * (maxSpeed - minSpeed);
        if (this.particles.length >= this.max) this.particles.shift();
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed * spreadY,
          life,
          maxLife: life,
          color,
          size: minSize + Math.random() * (maxSize - minSize),
          gravity,
          drag: options.drag || 0.96
        });
      }
    }

    impact(x, y, perfect) {
      this.spawn(x, y, perfect ? 18 : 12, {
        color: perfect ? "#FFF2B0" : "#FFD700",
        minSpeed: 90,
        maxSpeed: perfect ? 420 : 300,
        minSize: 1.5,
        maxSize: perfect ? 5.5 : 4,
        life: perfect ? 0.72 : 0.5,
        gravity: 80
      });
    }

    explosion(x, y) {
      this.spawn(x, y, 50, {
        color: "#FF6B35",
        minSpeed: 110,
        maxSpeed: 720,
        minSize: 2,
        maxSize: 8,
        life: 1.15,
        gravity: 90,
        drag: 0.94
      });
      this.spawn(x, y, 32, {
        color: "#FFD700",
        minSpeed: 80,
        maxSpeed: 520,
        minSize: 1.5,
        maxSize: 5,
        life: 0.95,
        gravity: 60
      });
    }

    dissolve(x, y, count = 80, radius = 34) {
      for (let i = 0; i < count; i += 1) {
        const a = Math.random() * TAU;
        const startR = Math.random() * radius;
        const speed = 90 + Math.random() * 360;
        if (this.particles.length >= this.max) this.particles.shift();
        this.particles.push({
          x: x + Math.cos(a) * startR * 0.45,
          y: y + Math.sin(a) * startR,
          vx: Math.cos(a) * speed,
          vy: Math.sin(a) * speed - 40,
          life: 0.95 + Math.random() * 0.5,
          maxLife: 1.2,
          color: Math.random() > 0.35 ? "#FFD700" : "#FFF2B0",
          size: 1.5 + Math.random() * 4,
          gravity: -20,
          drag: 0.95
        });
      }
    }

    reconstruct(x, y, count = 70, width = 64, height = 110) {
      for (let i = 0; i < count; i += 1) {
        const targetX = x + (Math.random() - 0.5) * width;
        const targetY = y - height * 0.55 + Math.random() * height;
        const spawnA = Math.random() * TAU;
        const spawnR = 160 + Math.random() * 180;
        if (this.particles.length >= this.max) this.particles.shift();
        this.particles.push({
          x: targetX + Math.cos(spawnA) * spawnR,
          y: targetY + Math.sin(spawnA) * spawnR,
          vx: (targetX - (targetX + Math.cos(spawnA) * spawnR)) * 1.6,
          vy: (targetY - (targetY + Math.sin(spawnA) * spawnR)) * 1.6,
          life: 1.15 + Math.random() * 0.35,
          maxLife: 1.35,
          color: Math.random() > 0.45 ? "#FFD700" : "#00F5FF",
          size: 1.2 + Math.random() * 3.2,
          gravity: 0,
          drag: 0.985
        });
      }
    }

    update(dt) {
      for (const p of this.particles) {
        p.life -= dt;
        p.vx *= Math.pow(p.drag, dt * 60);
        p.vy = p.vy * Math.pow(p.drag, dt * 60) + p.gravity * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      this.particles = this.particles.filter((p) => p.life > 0);
    }

    render(ctx) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const p of this.particles) {
        const t = Math.max(0, p.life / p.maxLife);
        ctx.globalAlpha = t;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 10 * t;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (0.45 + t), 0, TAU);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  window.KamdridiWarMachines = window.KamdridiWarMachines || {};
  window.KamdridiWarMachines.ParticlePool = ParticlePool;
})();
