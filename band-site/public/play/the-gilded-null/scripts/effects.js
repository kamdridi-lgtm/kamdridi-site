/**
 * KAMDRIDI - THE GILDED NULL
 * Effects - Premium Particles, Post-FX, Game Feel
 */
class EffectsManager {
  constructor() {
    this.particles = [];
    this.shakeX = 0;
    this.shakeY = 0;
    this.shakeMag = 0;
    this.impulseX = 0;
    this.impulseY = 0;
    this.distortion = 0;
    this.chromatic = 0;
    this.dangerPulse = 0;
    this.fogPhase = 0;
    this.critical = false;
    this.corruptionLevel = 0;
    this.hitstop = 0;
    this.fxCanvas = null;
    this.fxCtx = null;
  }

  initFX() {
    this.fxCanvas = document.getElementById("fx-canvas");
    if (this.fxCanvas) {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.fxCanvas.clientWidth;
      const h = this.fxCanvas.clientHeight;
      if (w === 0 || h === 0) { this.fxCtx = null; return; }
      this.fxCanvas.width = w * dpr;
      this.fxCanvas.height = h * dpr;
      this.fxCtx = this.fxCanvas.getContext("2d");
    }
  }

  update(dt) {
    if (this.hitstop > 0) {
      this.hitstop -= dt;
      return true;
    }

    if (this.shakeMag > 0.15) {
      this.shakeX = (Math.random() - 0.5) * this.shakeMag * 2;
      this.shakeY = (Math.random() - 0.5) * this.shakeMag * 2;
      this.shakeMag *= 0.87;
    } else {
      this.shakeX = 0;
      this.shakeY = 0;
      this.shakeMag = 0;
    }

    this.impulseX *= 0.88;
    this.impulseY *= 0.88;
    this.distortion *= 0.92;
    this.chromatic *= 0.91;
    this.dangerPulse *= 0.94;
    this.fogPhase += dt;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt * p.decay;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += (p.grav || 0) * dt;
      if (p.life <= 0) this.particles.splice(i, 1);
    }

    if (this.particles.length > 280) this.particles.splice(0, this.particles.length - 280);
    return false;
  }

  render(ctx) {
    for (const p of this.particles) {
      const a = Math.max(0, p.life) * p.alpha;
      if (a < 0.01) continue;
      ctx.globalAlpha = a;
      ctx.fillStyle = p.color;
      if (p.shape === "c") {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * Math.max(0.1, p.life), 0, Math.PI * 2);
        ctx.fill();
      } else {
        const s = p.size * Math.max(0.15, p.life);
        ctx.fillRect(p.x - s / 2, p.y - (p.shape === "l" ? 0.75 : s / 2), s, p.shape === "l" ? 1.5 : s);
      }
    }
    ctx.globalAlpha = 1;
  }

  renderPost() {
    const body = document.body;
    body.classList.remove("corrupt-1", "corrupt-2", "corrupt-3");
    if (this.corruptionLevel > 0.7) body.classList.add("corrupt-3");
    else if (this.corruptionLevel > 0.4) body.classList.add("corrupt-2");
    else if (this.corruptionLevel > 0.2) body.classList.add("corrupt-1");

    const dv = document.getElementById("overlay-danger");
    if (dv) {
      if (this.critical || this.dangerPulse > 0.25) dv.classList.add("on");
      else dv.classList.remove("on");
    }

    if (!this.fxCtx) this.initFX();
    if (!this.fxCtx) return;

    const c = this.fxCtx;
    const w = this.fxCanvas.width;
    const h = this.fxCanvas.height;
    c.clearRect(0, 0, w, h);

    const fogA = 0.012 + this.corruptionLevel * 0.025 + this.dangerPulse * 0.015;
    if (fogA > 0.01) {
      const fy = h * 0.25 + Math.sin(this.fogPhase * 0.4) * h * 0.08;
      const fg = c.createRadialGradient(w / 2, fy, 0, w / 2, fy, w * 0.35);
      fg.addColorStop(0, `rgba(201,149,42,${fogA})`);
      fg.addColorStop(1, "rgba(201,149,42,0)");
      c.fillStyle = fg;
      c.fillRect(0, 0, w, h);
    }

    if (this.chromatic > 0.015) {
      const off = this.chromatic * 2.5;
      c.globalCompositeOperation = "lighter";
      c.fillStyle = `rgba(255,0,0,${this.chromatic * 0.1})`;
      c.fillRect(off, 0, w, h);
      c.fillStyle = `rgba(0,0,255,${this.chromatic * 0.1})`;
      c.fillRect(-off, 0, w, h);
      c.globalCompositeOperation = "source-over";
    }

    const ba = 0.01 + this.dangerPulse * 0.015;
    const bg = c.createLinearGradient(w / 2 - 1, 0, w / 2 + 1, 0);
    bg.addColorStop(0, "rgba(201,149,42,0)");
    bg.addColorStop(0.5, `rgba(201,149,42,${ba})`);
    bg.addColorStop(1, "rgba(201,149,42,0)");
    c.fillStyle = bg;
    c.fillRect(w * 0.42, 0, w * 0.16, h * 0.55);
  }

  getShake() { return { x: this.shakeX + this.impulseX, y: this.shakeY + this.impulseY }; }
  screenShake(m) { this.shakeMag = Math.max(this.shakeMag, m); }
  cameraImpulse(x, y) { this.impulseX += x; this.impulseY += y; }
  triggerHitstop(d) { this.hitstop = Math.max(this.hitstop, d); }
  setDistortion(v) { this.distortion = Math.max(this.distortion, v); }
  setChromatic(v) { this.chromatic = Math.max(this.chromatic, v); }
  setCritical(v) { this.critical = v; }
  setCorruptionOverlay(v) { this.corruptionLevel = v; }
  setDangerPulse(v) { this.dangerPulse = Math.max(this.dangerPulse, v); }

  _p(x, y, vx, vy, size, decay, alpha, grav, color, shape) {
    this.particles.push({ x, y, vx, vy, size, life: 1, decay, alpha, grav: grav || 0, color, shape: shape || "r" });
  }

  spawnGold(x, y, n = 12) {
    for (let i = 0; i < n; i++) {
      this._p(
        x,
        y,
        (Math.random() - 0.5) * 240,
        (Math.random() - 0.5) * 240 - 110,
        2.5 + Math.random() * 3.5,
        1.5 + Math.random(),
        0.85,
        200,
        Math.random() > 0.3 ? "#F5DFA0" : "#C9952A",
        "r"
      );
    }
  }

  spawnDash(x, y, dir) {
    for (let i = 0; i < 8; i++) this._p(x + (Math.random() - 0.5) * 6, y + (Math.random() - 0.5) * 26, -dir * (130 + Math.random() * 220), (Math.random() - 0.5) * 40, 2 + Math.random() * 3.5, 3.5 + Math.random() * 2, 0.75, 0, "#F5DFA0", "l");
    for (let i = 0; i < 3; i++) this._p(x, y, -dir * (40 + Math.random() * 90), (Math.random() - 0.5) * 110, 5 + Math.random() * 7, 6, 0.25, 0, "#C9952A", "c");
  }

  spawnDanger(x, y) {
    for (let i = 0; i < 4; i++) this._p(x + (Math.random() - 0.5) * 55, y + (Math.random() - 0.5) * 55, (Math.random() - 0.5) * 110, (Math.random() - 0.5) * 110, 4 + Math.random() * 6, 2.5, 0.45, 0, "#8B1A1A", "r");
  }

  spawnSmoke(x, y) {
    this._p(x + (Math.random() - 0.5) * 40, y, (Math.random() - 0.5) * 12, -22 - Math.random() * 35, 10 + Math.random() * 16, 0.55 + Math.random() * 0.35, 0.1, -6, "rgba(70,55,45,0.35)", "c");
  }

  spawnDust(x, y) {
    this._p(x, y, (Math.random() - 0.5) * 10, 6 + Math.random() * 12, 1 + Math.random() * 1.2, 0.22 + Math.random() * 0.15, 0.12, 2, "#C9952A", "c");
  }

  spawnCorruptionGlitch(x, y) {
    for (let i = 0; i < 2; i++) this._p(x + (Math.random() - 0.5) * 130, y + (Math.random() - 0.5) * 15, (Math.random() - 0.5) * 450, 0, Math.random() * 55 + 6, 11 + Math.random() * 7, 0.08, 0, Math.random() > 0.5 ? "#8B1A1A" : "#C9952A", "r");
  }

  spawnNearMiss(x, y) {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      this._p(x, y, Math.cos(a) * 160, Math.sin(a) * 160, 2.5 + Math.random() * 2.5, 3.2, 0.8, 0, "#fff", "r");
    }
    for (let i = 0; i < 5; i++) this._p(x, y, (Math.random() - 0.5) * 320, (Math.random() - 0.5) * 320, 4 + Math.random() * 5, 4, 0.5, 0, "#F5DFA0", "c");
  }

  spawnShieldBreak(x, y) {
    for (let i = 0; i < 16; i++) this._p(x, y, (Math.random() - 0.5) * 380, (Math.random() - 0.5) * 380, 3 + Math.random() * 5, 2.2, 0.75, 120, Math.random() > 0.5 ? "#FF3030" : "#C9952A", "r");
  }

  damageShake() {
    this.screenShake(12);
  }

  showMsg(t) {
    const e = document.getElementById("hud-message");
    if (e) {
      e.textContent = t;
      e.classList.add("on");
      setTimeout(() => e.classList.remove("on"), 2500);
    }
  }

  showTransmission(t) {
    const e = document.getElementById("hud-transmission");
    if (e) {
      e.textContent = t;
      e.classList.add("on");
      setTimeout(() => e.classList.remove("on"), 4000);
    }
  }

  showNearMiss() {
    const e = document.getElementById("hud-nearmiss");
    if (e) {
      e.textContent = "NEAR MISS";
      e.classList.add("on");
      setTimeout(() => e.classList.remove("on"), 550);
    }
  }
}

window.effects = new EffectsManager();
window.effectsManager = window.effects;
