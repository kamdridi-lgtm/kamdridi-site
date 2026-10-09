// Filename: public/games/war-machines/engine.js
// Module: Engine
// Description: Main Canvas game loop, input, player, orbs, shots and rendering.
(function () {
  "use strict";

  const NS = window.KamdridiWarMachines;
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
  const dist2 = (a, b, c, d) => {
    const x = a - c;
    const y = b - d;
    return x * x + y * y;
  };

  class WarMachinesGame {
    constructor(canvas, overlay, startButton, options = {}) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d", { alpha: false });
      this.overlay = overlay;
      this.startButton = startButton;
      this.onFps = typeof options.onFps === "function" ? options.onFps : null;
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.width = 0;
      this.height = 0;
      this.time = 0;
      this.last = performance.now();
      this.state = "idle";
      this.keys = {};
      this.pointer = { active: false, x: 0, startX: 0 };
      this.rhythm = new NS.RhythmSystem({ bpm: 120, tolerance: 0.12 });
      this.boss = new NS.K01Boss();
      this.hud = new NS.HUD();
      this.fx = new NS.ParticlePool(200);
      this.screens = new NS.UIScreens(canvas.parentElement || document.body);
      this.player = this.createPlayer();
      this.shots = [];
      this.enemyShots = [];
      this.orbs = [];
      this.powerups = [];
      this.minions = [];
      this.powerupTimer = 5.2;
      this.minionTimer = 6.0;
      this.overchargeTimer = 0;
      this.shieldTimer = 0;
      this.timeSlowTimer = 0;
      this.chargeHitLock = 0;
      this.particles = [];
      this.floatingText = [];
      this.score = 0;
      this.highScore = this.loadHighScore();
      this.combo = 0;
      this.maxCombo = 0;
      this.shotsFired = 0;
      this.perfectShots = 0;
      this.orbTimer = 0;
      this.fireCooldown = 0;
      this.reloadTimer = 0;
      this.shake = 0;
      this.shakeTimer = 0;
      this.recoil = 0;
      this.screenFlash = 0;
      this.audioBeatPulse = 0;
      this.audioGlow = 0;
      this.audioStrongBeatLock = 0;
      this.audioSongLoaded = false;
      this.bossExplosionTriggered = false;
      this.endShown = false;
      this.emergenceTime = 0;
      this.emergenceBurstA = false;
      this.emergenceBurstB = false;
      this.bossSpawnTimer = 0;
      this.mobile = window.innerWidth < 768;
      this.mobileInput = { left: false, right: false, fire: false };
      this.mobileFrameGate = 0;
      this.objective = "Destroy the exposed reactor";
      this.raf = 0;
      this.disposers = [];
      this.fpsLast = performance.now();
      this.fpsFrames = 0;
      this.bind();
      this.resize();
      this.raf = requestAnimationFrame((t) => this.loop(t));
    }

    createPlayer() {
      return {
        x: 0,
        y: 0,
        vx: 0,
        health: 100,
        maxHealth: 100,
        ammo: 18,
        maxAmmo: 30,
        dashCd: 0,
        dashTimer: 0,
        lastDir: 1,
        anim: 0
      };
    }

    bind() {
      const onResize = () => this.resize();
      const onKeyDown = (e) => {
        this.keys[e.code] = true;
        if (["Space", "ArrowLeft", "ArrowRight"].includes(e.code)) e.preventDefault();
        if (e.code === "Space") this.dash();
        if (e.code === "KeyJ" || e.code === "Enter") this.fire();
        if (e.code === "KeyR") this.reload();
      };
      const onKeyUp = (e) => {
        this.keys[e.code] = false;
      };

      const onPointerDown = (e) => {
        if (e.target?.closest?.("[data-wm-control]")) return;
        this.pointer.active = true;
        this.pointer.x = e.clientX;
        this.pointer.startX = e.clientX;
        this.fire();
      };
      const onPointerMove = (e) => {
        if (!this.pointer.active) return;
        const dx = e.clientX - this.pointer.x;
        if (Math.abs(dx) > 4) {
          this.player.vx += dx * 5;
          this.player.lastDir = Math.sign(dx) || this.player.lastDir;
          this.pointer.x = e.clientX;
        }
      };
      const onPointerUp = () => {
        this.pointer.active = false;
      };
      const onStart = () => this.start();

      window.addEventListener("resize", onResize);
      window.addEventListener("keydown", onKeyDown);
      window.addEventListener("keyup", onKeyUp);
      this.canvas.addEventListener("pointerdown", onPointerDown);
      this.canvas.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      this.startButton?.addEventListener("click", onStart);
      const onControlDown = (e) => {
        const action = e.target?.closest?.("[data-wm-control]")?.dataset.wmControl;
        if (!action) return;
        e.preventDefault();
        this.handleMobileControl(action, true);
      };
      const onControlUp = (e) => {
        const action = e.target?.closest?.("[data-wm-control]")?.dataset.wmControl;
        if (!action) {
          this.mobileInput.left = false;
          this.mobileInput.right = false;
          this.mobileInput.fire = false;
          return;
        }
        e.preventDefault();
        this.handleMobileControl(action, false);
      };

      window.addEventListener("pointerdown", onControlDown, { passive: false });
      window.addEventListener("pointerup", onControlUp, { passive: false });
      window.addEventListener("pointercancel", onControlUp, { passive: false });

      this.disposers.push(
        () => window.removeEventListener("resize", onResize),
        () => window.removeEventListener("keydown", onKeyDown),
        () => window.removeEventListener("keyup", onKeyUp),
        () => this.canvas.removeEventListener("pointerdown", onPointerDown),
        () => this.canvas.removeEventListener("pointermove", onPointerMove),
        () => window.removeEventListener("pointerup", onPointerUp),
        () => this.startButton?.removeEventListener("click", onStart),
        () => window.removeEventListener("pointerdown", onControlDown),
        () => window.removeEventListener("pointerup", onControlUp),
        () => window.removeEventListener("pointercancel", onControlUp)
      );
    }

    handleMobileControl(action, active) {
      if (action === "left") this.mobileInput.left = active;
      if (action === "right") this.mobileInput.right = active;
      if (action === "fire") this.mobileInput.fire = active;
      if (!active) return;
      if (action === "fire") this.fire();
      if (action === "dash") this.dash();
      if (action === "reload") this.reload();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.canvas.width = Math.max(640, Math.floor(rect.width * this.dpr));
      this.canvas.height = Math.max(420, Math.floor(rect.height * this.dpr));
      this.width = this.canvas.width;
      this.height = this.canvas.height;
      this.player.x = this.player.x || this.width / 2;
      this.player.y = this.height * 0.81;
      this.boss.reset(this.width, this.height);
      this.mobile = window.innerWidth < 768;
    }

    start() {
      this.state = "emergence";
      this.overlay.style.display = "none";
      this.rhythm.stop();
      this.player = this.createPlayer();
      this.player.x = this.width / 2;
      this.player.y = this.height * 0.81;
      this.boss.reset(this.width, this.height);
      this.shots = [];
      this.enemyShots = [];
      this.orbs = [];
      this.powerups = [];
      this.minions = [];
      this.powerupTimer = 5.2;
      this.minionTimer = 6.0;
      this.overchargeTimer = 0;
      this.shieldTimer = 0;
      this.timeSlowTimer = 0;
      this.chargeHitLock = 0;
      this.particles = [];
      this.floatingText = [];
      this.fx.clear();
      this.score = 0;
      this.combo = 0;
      this.maxCombo = 0;
      this.shotsFired = 0;
      this.perfectShots = 0;
      this.screenFlash = 0;
      this.audioBeatPulse = 0;
      this.audioGlow = 0;
      this.audioStrongBeatLock = 0;
      this.audioSongLoaded = false;
      this.bossExplosionTriggered = false;
      this.endShown = false;
      this.emergenceTime = 0;
      this.emergenceBurstA = false;
      this.emergenceBurstB = false;
      this.bossSpawnTimer = 0;
      this.screens.hide();
      this.orbTimer = 0.8;
      this.fireCooldown = 0;
      this.reloadTimer = 0;
      this.objective = "Escape the corridor...";
    }

    loop(now) {
      if (this.mobile) {
        const elapsed = now - this.last;
        if (elapsed < 16.6) {
          this.raf = requestAnimationFrame((t) => this.loop(t));
          return;
        }
      }
      const dt = Math.min((now - this.last) / 1000, 0.033);
      this.last = now;
      this.time += dt;
      this.updateFps(now);
      this.update(dt);
      this.render();
      this.raf = requestAnimationFrame((t) => this.loop(t));
    }

    updateFps(now) {
      this.fpsFrames += 1;
      if (now - this.fpsLast >= 500) {
        const fps = Math.round((this.fpsFrames * 1000) / (now - this.fpsLast));
        this.fpsFrames = 0;
        this.fpsLast = now;
        if (this.onFps) this.onFps(fps);
      }
    }

    destroy() {
      if (this.raf) cancelAnimationFrame(this.raf);
      this.rhythm.stop();
      window.songLoader?.stop?.();
      this.screens.destroy();
      for (const dispose of this.disposers) dispose();
      this.disposers = [];
    }

    update(dt) {
      if (this.state === "emergence") {
        this.updateEmergence(dt);
        return;
      }

      if (this.state !== "running") {
        this.updateParticles(dt);
        this.fx.update(dt);
        return;
      }

      this.player.anim += dt;
      this.fireCooldown = Math.max(0, this.fireCooldown - dt);
      this.player.dashCd = Math.max(0, this.player.dashCd - dt);
      this.player.dashTimer = Math.max(0, this.player.dashTimer - dt);
      this.overchargeTimer = Math.max(0, this.overchargeTimer - dt);
      this.shieldTimer = Math.max(0, this.shieldTimer - dt);
      this.timeSlowTimer = Math.max(0, this.timeSlowTimer - dt);
      this.chargeHitLock = Math.max(0, this.chargeHitLock - dt);
      this.shakeTimer = Math.max(0, this.shakeTimer - dt);
      if (this.shakeTimer <= 0) this.shake *= 0.86;
      this.recoil += (0 - this.recoil) * Math.min(1, dt * 18);
      this.screenFlash = Math.max(0, this.screenFlash - dt * 1.8);
      this.audioBeatPulse = Math.max(0, this.audioBeatPulse - dt * 3.2);
      this.audioGlow = Math.max(0, this.audioGlow - dt * 2.2);
      this.audioStrongBeatLock = Math.max(0, this.audioStrongBeatLock - dt);

      if (this.reloadTimer > 0) {
        this.reloadTimer -= dt;
        if (this.reloadTimer <= 0) {
          this.player.ammo = this.player.maxAmmo;
          this.objective = "Reactor exposed. Fire on beat.";
        }
      }

      const combatDt = this.timeSlowTimer > 0 ? dt * 0.58 : dt;
      if (this.keys.KeyJ || this.keys.Enter || this.mobileInput.fire) this.fire();
      this.updatePlayer(dt);
      this.updateOrbs(combatDt);
      this.updatePowerups(combatDt);
      this.updateShots(combatDt);
      this.boss.update(combatDt, this);
      this.resolveBossCharge();
      this.bossSpawnTimer = Math.max(0, this.bossSpawnTimer - dt);
      this.updateMinions(combatDt);
      this.updateAudioReactive(dt);
      this.updateEnemyShots(combatDt);
      this.updateParticles(dt);
      this.updateFloatingText(dt);
      this.fx.update(dt);

      if (this.boss.destroyed && !this.bossExplosionTriggered) {
        this.bossExplosionTriggered = true;
        this.fx.explosion(this.boss.x, this.boss.y + 20);
        this.kickShake(18, 0.35);
        this.screenFlash = 1;
        this.glitchSound();
      }

      if (this.boss.destroyed && this.boss.explosionTimer > 1.6 && !this.endShown) {
        this.endShown = true;
        this.state = "victory";
        this.objective = "K-01 destroyed. Signal recovered.";
        window.stemUnlock?.evaluate?.({ bossDefeated: true, score: this.score, maxCombo: this.maxCombo, shotsFired: this.shotsFired, perfectShots: this.perfectShots });
        this.screens.showVictory(this.recordRun(), () => this.start());
      }

      if (this.player.health <= 0 && !this.endShown) {
        this.endShown = true;
        this.state = "defeat";
        this.objective = "Runner down.";
        this.screens.showDefeat(this.recordRun(), () => this.start());
      }
    }

    setupMusicSystem() {
      const loader = window.songLoader;
      if (!loader || this.audioSongLoaded) return;
      loader.init(this.rhythm.ctx);
      window.audioReactive?.init?.(this.rhythm.ctx, loader.getAnalyser?.());
      window.stemUnlock?.load?.();
      loader.onBeat?.(() => {
        if (this.state !== "running") return;
        this.audioBeatPulse = Math.max(this.audioBeatPulse, 0.34);
        this.audioGlow = Math.max(this.audioGlow, 0.26);
      });
      window.audioReactive?.onStrongBeat?.((info) => {
        if (this.state !== "running") return;
        const strength = info?.strength || 0.6;
        this.screenFlash = Math.max(this.screenFlash, 0.05 + strength * 0.1);
        this.kickShake(2 + strength * 4, 0.06);
        this.spawnBurst(this.player.x, this.player.y - 44, "#FFD700", Math.round(4 + strength * 10));
      });
      loader.loadSong("war-machines", () => {
        loader.setPhase(this.boss.phase);
        loader.setIntensity(0.35);
        loader.play();
      });
      this.audioSongLoaded = true;
    }

    updateAudioReactive(dt) {
      const hpRatio = this.boss.maxHp ? this.boss.hp / this.boss.maxHp : 1;
      const intensity = Math.max(0.12, 1 - hpRatio);
      window.songLoader?.setPhase?.(this.boss.phase);
      window.songLoader?.setIntensity?.(intensity);
      if (this.rhythm?.setIntensity) this.rhythm.setIntensity(this.boss.phase);

      const reactive = window.audioReactive;
      if (reactive) {
        reactive.update();
        const strength = reactive.getBeatStrength();
        const bass = reactive.getFrequencyBand("bass");
        this.audioBeatPulse = Math.max(this.audioBeatPulse, strength * 0.72);
        this.audioGlow = Math.max(this.audioGlow, bass * 0.58);
        if (strength > 0.82 && this.audioStrongBeatLock <= 0) {
          this.screenFlash = Math.max(this.screenFlash, 0.06 + strength * 0.1);
          this.spawnBurst(this.width / 2, this.height * 0.58, "#FFD700", Math.round(5 + strength * 10));
          this.audioStrongBeatLock = 0.16;
        }
      }

      window.stemUnlock?.evaluate?.({ score: this.score, maxCombo: this.maxCombo, shotsFired: this.shotsFired, perfectShots: this.perfectShots, bossDefeated: this.boss.destroyed });
    }

    updateEmergence(dt) {
      this.emergenceTime += dt;
      this.player.anim += dt;
      this.fx.update(dt);
      this.updateParticles(dt);
      this.updateFloatingText(dt);
      this.shakeTimer = Math.max(0, this.shakeTimer - dt);
      if (this.shakeTimer <= 0) this.shake *= 0.86;
      this.screenFlash = Math.max(0, this.screenFlash - dt * 0.9);

      const t = this.emergenceTime;
      this.player.x = this.width / 2 + Math.sin(t * 4) * 4;
      this.player.y = this.height * (t < 3 ? 0.84 - t * 0.025 : 0.765);

      if (t > 3 && !this.emergenceBurstA) {
        this.emergenceBurstA = true;
        this.fx.dissolve(this.player.x, this.player.y - 10, this.mobile ? 55 : 95);
        this.screenFlash = 0.35;
        this.kickShake(12, 0.45);
        this.glitchSound();
      }

      if (t > 6 && !this.emergenceBurstB) {
        this.emergenceBurstB = true;
        this.fx.reconstruct(this.width / 2, this.height * 0.73, this.mobile ? 50 : 90);
        this.screenFlash = 0.55;
        this.kickShake(10, 0.4);
      }

      if (t >= 9) {
        this.state = "running";
        this.objective = "Welcome to the War Zone";
        this.player.x = this.width / 2;
        this.player.y = this.height * 0.81;
        this.boss.reset(this.width, this.height);
        this.bossSpawnTimer = 0.75;
        this.kickShake(16, 0.38);
        this.screenFlash = 0.7;
        this.rhythm.start();
        this.setupMusicSystem();
      }
    }

    loadHighScore() {
      try {
        return Number(window.localStorage.getItem("kamdridi_war_machines_hs") || 0) || 0;
      } catch {
        return 0;
      }
    }

    saveHighScore(score) {
      try {
        window.localStorage.setItem("kamdridi_war_machines_hs", String(Math.floor(score)));
      } catch {
        // localStorage can be unavailable in private modes; gameplay should continue.
      }
    }

    recordRun() {
      const stats = this.getStats();
      const finalScore = Math.floor(stats.score);
      const previousBest = this.highScore;
      const isNewBest = finalScore > previousBest;
      if (isNewBest) {
        this.highScore = finalScore;
        this.saveHighScore(finalScore);
      }
      return {
        ...stats,
        score: finalScore,
        highScore: this.highScore,
        previousBest,
        isNewBest
      };
    }

    getStats() {
      return {
        score: this.score,
        highScore: this.highScore,
        maxCombo: this.maxCombo,
        shotsFired: this.shotsFired,
        perfectShots: this.perfectShots
      };
    }

    updatePlayer(dt) {
      const left = this.keys.ArrowLeft || this.keys.KeyA || this.mobileInput.left;
      const right = this.keys.ArrowRight || this.keys.KeyD || this.mobileInput.right;
      const sprint = this.keys.ShiftLeft || this.keys.ShiftRight;
      const targetSpeed = sprint ? 560 : 370;

      if (left) {
        this.player.vx += (-targetSpeed - this.player.vx) * 13 * dt;
        this.player.lastDir = -1;
      } else if (right) {
        this.player.vx += (targetSpeed - this.player.vx) * 13 * dt;
        this.player.lastDir = 1;
      } else if (this.player.dashTimer <= 0) {
        this.player.vx *= Math.pow(0.001, dt);
      }

      this.player.x = clamp(this.player.x + this.player.vx * dt, 48, this.width - 48);
    }

    updateOrbs(dt) {
      this.orbTimer -= dt;
      if (this.orbTimer <= 0) {
        this.orbTimer = Math.max(0.7, 1.35 - this.boss.phase * 0.1);
        this.orbs.push({
          x: 80 + Math.random() * (this.width - 160),
          y: -24,
          vy: 135 + this.boss.phase * 24,
          r: 10,
          pulse: Math.random() * 6.28
        });
      }

      for (let i = this.orbs.length - 1; i >= 0; i -= 1) {
        const orb = this.orbs[i];
        orb.y += orb.vy * dt;
        orb.pulse += dt * 6;
        const magnetRange = 120;
        if (dist2(orb.x, orb.y, this.player.x, this.player.y) < magnetRange * magnetRange) {
          orb.x += (this.player.x - orb.x) * dt * 5;
          orb.y += (this.player.y - orb.y) * dt * 5;
        }
        if (dist2(orb.x, orb.y, this.player.x, this.player.y) < 42 * 42) {
          this.player.ammo = clamp(this.player.ammo + 6, 0, this.player.maxAmmo);
          this.score += 40;
          this.spawnBurst(orb.x, orb.y, "#FFD700", 10);
          this.orbs.splice(i, 1);
        } else if (orb.y > this.height + 40) {
          this.orbs.splice(i, 1);
        }
      }
    }

    updateShots(dt) {
      for (let i = this.shots.length - 1; i >= 0; i -= 1) {
        const shot = this.shots[i];
        shot.y += shot.vy * dt;
        const hitMinionIndex = this.minions.findIndex((m) => {
          const radius = m.type === "turret" ? 30 : 24;
          return dist2(shot.x, shot.y, m.x, m.y) < radius * radius;
        });
        if (hitMinionIndex !== -1) {
          const m = this.minions[hitMinionIndex];
          m.hp -= shot.damage;
          this.spawnBurst(shot.x, shot.y, shot.perfect ? "#FFF2B0" : "#FFD700", shot.perfect ? 10 : 6);
          this.fx.impact(shot.x, shot.y, shot.perfect);
          this.shots.splice(i, 1);
          continue;
        }
        const weak = this.boss.getWeakPoint();
        const hitWeak = dist2(shot.x, shot.y, weak.x, weak.y) < weak.r * weak.r;
        const hitBody = Math.abs(shot.x - this.boss.x) < 205 && shot.y > this.boss.y - 120 && shot.y < this.boss.y + 200;
        if (hitWeak || hitBody) {
          const dealt = this.boss.applyDamage(shot.damage, hitWeak);
          this.score += hitWeak ? Math.floor(dealt * 2) : Math.floor(dealt);
          this.spawnBurst(shot.x, shot.y, hitWeak ? "#FF6B35" : "#FFD700", hitWeak ? 18 : 8);
          this.fx.impact(shot.x, shot.y, hitWeak || shot.perfect);
          this.kickShake(hitWeak ? 9 : 4, 0.12);
          this.shots.splice(i, 1);
        } else if (shot.y < -40) {
          this.shots.splice(i, 1);
        }
      }
    }

    updateEnemyShots(dt) {
      for (let i = this.enemyShots.length - 1; i >= 0; i -= 1) {
        const shot = this.enemyShots[i];

        if (shot.type === "laser") {
          shot.timer += dt;
          const active = shot.timer >= shot.warmup && shot.timer <= shot.warmup + shot.duration;
          if (active && !shot.hit && Math.abs(this.player.y - shot.y) < 20 && this.player.dashTimer <= 0) {
            shot.hit = true;
            if (this.shieldTimer > 0) {
              this.shieldTimer = Math.max(0, this.shieldTimer - 0.8);
              this.spawnBurst(this.player.x, this.player.y - 12, "#00F5FF", 16);
              this.showFloatingText("SHIELD", this.player.x, this.player.y - 82, true);
            } else {
              const dmg = Math.round(17 * (this.mobile ? 0.85 : 1));
              this.player.health = Math.max(0, this.player.health - dmg);
              this.combo = 0;
              this.spawnBurst(this.player.x, this.player.y - 12, "#FF0055", 22);
              this.showFloatingText("LASER HIT", this.player.x, this.player.y - 84, false);
            }
            this.kickShake(18, 0.2);
          }
          if (shot.timer > shot.warmup + shot.duration + 0.22) this.enemyShots.splice(i, 1);
          continue;
        }

        shot.x += shot.vx * dt;
        shot.y += shot.vy * dt;
        if (dist2(shot.x, shot.y, this.player.x, this.player.y) < (shot.r + 20) * (shot.r + 20) && this.player.dashTimer <= 0) {
          if (this.shieldTimer > 0) {
            this.shieldTimer = Math.max(0, this.shieldTimer - 0.35);
            this.spawnBurst(shot.x, shot.y, "#00F5FF", 10);
          } else {
            const baseDamage = shot.type === "missile" ? 8 : 11;
            const scaledDamage = Math.round(baseDamage * (this.mobile ? 0.85 : 1));
            this.player.health = Math.max(0, this.player.health - scaledDamage);
            this.combo = 0;
          }
          this.kickShake(12, 0.16);
          this.spawnBurst(shot.x, shot.y, "#FF0055", 12);
          this.enemyShots.splice(i, 1);
        } else if (shot.y > this.height + 80 || shot.x < -80 || shot.x > this.width + 80) {
          this.enemyShots.splice(i, 1);
        }
      }
    }

    resolveBossCharge() {
      if (this.boss.chargeTimer <= 0 || this.chargeHitLock > 0 || this.player.dashTimer > 0) return;
      const lane = this.boss.phase === 3 ? 92 : 74;
      const verticalThreat = this.player.y > this.boss.y + 95;
      if (!verticalThreat || Math.abs(this.player.x - this.boss.x) > lane) return;

      if (this.shieldTimer > 0) {
        this.shieldTimer = Math.max(0, this.shieldTimer - 0.9);
        this.spawnBurst(this.player.x, this.player.y - 14, "#00F5FF", 18);
        this.showFloatingText("SHIELD", this.player.x, this.player.y - 80, true);
      } else {
        const baseChargeDamage = this.boss.phase === 3 ? 20 : 15;
        const dmg = Math.round(baseChargeDamage * (this.mobile ? 0.85 : 1));
        this.player.health = Math.max(0, this.player.health - dmg);
        this.combo = 0;
        this.spawnBurst(this.player.x, this.player.y - 8, "#FF0055", 18);
        this.showFloatingText("CHARGE HIT", this.player.x, this.player.y - 84, false);
      }
      this.chargeHitLock = 0.85;
      this.kickShake(18, 0.22);
    }

    updatePowerups(dt) {
      this.powerupTimer -= dt;
      if (this.powerupTimer <= 0 && this.powerups.length < 2) {
        const types = ["overcharge", "shield", "timeslow", "ammo"];
        const type = types[Math.floor(Math.random() * types.length)];
        this.powerups.push({
          type,
          x: 80 + Math.random() * (this.width - 160),
          y: -28,
          vy: 95,
          r: 15,
          pulse: Math.random() * Math.PI * 2
        });
        this.powerupTimer = 7 + Math.random() * 4;
      }

      for (let i = this.powerups.length - 1; i >= 0; i -= 1) {
        const p = this.powerups[i];
        p.y += p.vy * dt;
        p.pulse += dt * 6;
        if (dist2(p.x, p.y, this.player.x, this.player.y) < 48 * 48) {
          this.applyPowerup(p.type);
          this.spawnBurst(p.x, p.y, this.powerupColor(p.type), 16);
          this.powerups.splice(i, 1);
        } else if (p.y > this.height + 50) {
          this.powerups.splice(i, 1);
        }
      }
    }

    applyPowerup(type) {
      if (type === "overcharge") {
        this.overchargeTimer = 5.5;
        this.objective = "OVERCHARGE. Reactor damage boosted.";
      } else if (type === "shield") {
        this.shieldTimer = 7.5;
        this.objective = "Shield online.";
      } else if (type === "timeslow") {
        this.timeSlowTimer = 4.5;
        this.objective = "Time slow field active.";
      } else {
        this.player.ammo = clamp(this.player.ammo + 12, 0, this.player.maxAmmo);
        this.objective = "Ammo cache absorbed.";
      }
    }

    powerupColor(type) {
      if (type === "overcharge") return "#FF6B35";
      if (type === "shield") return "#00F5FF";
      if (type === "timeslow") return "#B58CFF";
      return "#FFD700";
    }

    updateMinions(dt) {
      if (this.boss.phase < 2 || this.boss.destroyed) return;
      this.minionTimer -= dt;
      if (this.minionTimer <= 0 && this.minions.length < (this.boss.phase === 3 ? 4 : 2)) {
        const type = this.boss.phase === 3 || Math.random() > 0.45 ? "drone" : "turret";
        this.minions.push({
          type,
          x: 70 + Math.random() * (this.width - 140),
          y: type === "turret" ? this.height * 0.36 : -28,
          vx: (Math.random() - 0.5) * 80,
          vy: type === "drone" ? 70 + Math.random() * 42 : 0,
          hp: type === "drone" ? 38 : 60,
          fire: 0.8 + Math.random() * 1.4,
          pulse: Math.random() * 6.28
        });
        this.minionTimer = this.boss.phase === 3 ? 3.4 : 5.4;
      }

      for (let i = this.minions.length - 1; i >= 0; i -= 1) {
        const m = this.minions[i];
        m.pulse += dt * 5;
        if (m.type === "drone") {
          const dx = this.player.x - m.x;
          m.vx += Math.sign(dx) * 45 * dt;
          m.vx = clamp(m.vx, -112, 112);
          m.x += m.vx * dt;
          m.y += m.vy * dt;
        } else {
          m.x += Math.sin(this.time * 1.4 + i) * 12 * dt;
        }
        m.fire -= dt;
        if (m.fire <= 0) {
          const dx = this.player.x - m.x;
          const dy = this.player.y - m.y;
          const len = Math.max(1, Math.hypot(dx, dy));
          this.enemyShots.push({ x: m.x, y: m.y + 12, vx: (dx / len) * 185, vy: (dy / len) * 185, r: 6, type: "drone" });
          m.fire = m.type === "turret" ? 1.4 : 1.9;
        }
        if (m.y > this.height + 60 || m.hp <= 0) {
          if (m.hp <= 0) {
            this.score += m.type === "turret" ? 90 : 60;
            this.spawnBurst(m.x, m.y, "#00F5FF", 14);
          }
          this.minions.splice(i, 1);
        }
      }
    }
    updateParticles(dt) {
      for (let i = this.particles.length - 1; i >= 0; i -= 1) {
        const p = this.particles[i];
        p.life -= dt * p.decay;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        if (p.life <= 0) this.particles.splice(i, 1);
      }
    }

    updateFloatingText(dt) {
      for (let i = this.floatingText.length - 1; i >= 0; i -= 1) {
        const text = this.floatingText[i];
        text.life -= dt;
        text.y += text.vy * dt;
        text.scale += dt * 0.7;
        if (text.life <= 0) this.floatingText.splice(i, 1);
      }
    }

    fire() {
      if (this.state !== "running" || this.fireCooldown > 0) return;
      if (this.player.ammo <= 0) {
        this.objective = "Collect gold orbs or press R to reload.";
        return;
      }

      const sync = this.rhythm.getSyncStatus();
      const previousTier = this.getComboTier(this.combo).name;
      const damage = (sync.onBeat ? 54 : 25) * (this.overchargeTimer > 0 ? 1.55 : 1);
      this.player.ammo -= 1;
      this.combo = sync.onBeat ? this.combo + 1 : 0;
      this.maxCombo = Math.max(this.maxCombo, this.combo);
      const nextTier = this.getComboTier(this.combo);
      if (sync.onBeat && nextTier.name && nextTier.name !== previousTier) {
        this.showFloatingText(nextTier.name, this.player.x, this.player.y - 118, true);
        this.kickShake(8, 0.12);
      }
      this.shotsFired += 1;
      if (sync.onBeat) {
        this.perfectShots += 1;
        window.songLoader?.triggerPerfectHit?.(sync.confidence || 1);
      }
      window.stemUnlock?.evaluate?.({ score: this.score, maxCombo: this.maxCombo, shotsFired: this.shotsFired, perfectShots: this.perfectShots });
      this.score += sync.onBeat ? 120 + this.combo * 14 : 18;
      this.fireCooldown = 0.14;
      this.shots.push({
        x: this.player.x,
        y: this.player.y - 34,
        vy: -880,
        damage,
        perfect: sync.onBeat
      });
      this.recoil = -2;
      this.kickShake(sync.onBeat ? 5 : 2, 0.08);
      this.showFloatingText(sync.onBeat ? "PERFECT" : "MISS", this.player.x, this.player.y - 82, sync.onBeat);
      this.objective = sync.onBeat ? "Perfect hit window." : "Find the beat.";
    }

    reload() {
      if (this.state !== "running" || this.reloadTimer > 0 || this.player.ammo >= this.player.maxAmmo) return;
      this.reloadTimer = 1.5;
      this.objective = "Reloading...";
    }

    dash() {
      if (this.state !== "running" || this.player.dashCd > 0) return;
      this.player.vx = this.player.lastDir * 1180;
      this.player.dashTimer = 0.16;
      this.player.dashCd = 1;
      this.kickShake(4, 0.1);
    }

    kickShake(amount, duration) {
      this.shake = Math.max(this.shake, amount);
      this.shakeTimer = Math.max(this.shakeTimer, duration || 0.12);
    }

    getComboTier(count) {
      if (count >= 20) return { name: "BLAZING", mult: 2.5, color: "#FF0055" };
      if (count >= 12) return { name: "ON FIRE", mult: 2, color: "#FF6B35" };
      if (count >= 6) return { name: "HEATED", mult: 1.5, color: "#00F5FF" };
      return { name: "", mult: 1, color: "#f3dfb6" };
    }

    showFloatingText(text, x, y, good) {
      this.floatingText.push({
        text,
        x,
        y,
        vy: -42,
        life: 0.75,
        maxLife: 0.75,
        scale: good ? 1 : 0.85,
        color: good ? "#FFD700" : "#FF0055"
      });
    }

    glitchSound() {
      if (!this.rhythm?.ctx) return;
      const ctx = this.rhythm.ctx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.value = 70;
      osc.frequency.exponentialRampToValueAtTime(430, ctx.currentTime + 0.08);
      gain.gain.value = 0.0001;
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.16);
    }

    spawnBurst(x, y, color, count) {
      for (let i = 0; i < count; i += 1) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 60 + Math.random() * 260;
        this.particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          r: 2 + Math.random() * 4,
          color,
          life: 1,
          decay: 1.4 + Math.random() * 2
        });
      }
    }

    render() {
      const ctx = this.ctx;
      const sx = (Math.random() - 0.5) * this.shake;
      const sy = (Math.random() - 0.5) * this.shake + this.recoil;
      ctx.save();
      ctx.translate(sx, sy);
      if (this.state === "emergence") {
        this.drawEmergence(ctx);
        this.fx.render(ctx);
        this.drawParticles(ctx);
        this.drawFloatingText(ctx);
        ctx.restore();
        this.drawScreenFlash(ctx);
        return;
      }
      this.drawBackground(ctx);
      this.drawAudioReactiveLayer(ctx);
      if (this.bossSpawnTimer > 0) {
        ctx.save();
        const s = 1 - this.bossSpawnTimer / 0.75;
        ctx.translate(this.boss.x, this.boss.y);
        ctx.scale(0.2 + s * 0.8, 0.2 + s * 0.8);
        ctx.translate(-this.boss.x, -this.boss.y);
        this.boss.render(ctx, this);
        ctx.restore();
      } else {
        this.boss.render(ctx, this);
      }
      this.drawOrbs(ctx);
      this.drawPowerups(ctx);
      this.drawMinions(ctx);
      this.drawShots(ctx);
      this.drawPlayer(ctx);
      this.drawParticles(ctx);
      this.fx.render(ctx);
      this.drawFloatingText(ctx);
      this.hud.render(ctx, this);
      ctx.restore();
      this.drawScreenFlash(ctx);
    }

    drawAudioReactiveLayer(ctx) {
      const pulse = this.audioBeatPulse || 0;
      const glow = this.audioGlow || 0;
      if (pulse <= 0.01 && glow <= 0.01) return;
      const cx = this.width / 2;
      const cy = this.height * 0.5;
      ctx.save();
      const rg = ctx.createRadialGradient(cx, cy, 4, cx, cy, this.width * (0.22 + glow * 0.22));
      rg.addColorStop(0, `rgba(255,215,0,${0.08 + pulse * 0.12})`);
      rg.addColorStop(0.42, `rgba(255,107,53,${0.035 + glow * 0.08})`);
      rg.addColorStop(1, "rgba(255,215,0,0)");
      ctx.fillStyle = rg;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.globalAlpha = Math.min(0.32, pulse * 0.42);
      ctx.strokeStyle = "#FFD700";
      ctx.lineWidth = 1 + pulse * 2;
      ctx.beginPath();
      ctx.arc(cx, this.height * 0.86, 34 + pulse * 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    drawBackground(ctx) {
      const phase3 = this.boss.phase === 3;
      const bg = ctx.createLinearGradient(0, 0, 0, this.height);
      bg.addColorStop(0, phase3 ? "#12070B" : "#07080D");
      bg.addColorStop(0.42, "#0C0B10");
      bg.addColorStop(1, "#030201");
      ctx.fillStyle = bg;
      ctx.fillRect(-30, -30, this.width + 60, this.height + 60);

      const vpX = this.width / 2;
      const horizon = this.height * 0.22;

      ctx.save();
      ctx.globalAlpha = 0.72;
      for (let i = 0; i < 14; i += 1) {
        const bw = 22 + (i % 4) * 10;
        const bh = 34 + ((i * 19) % 58);
        const x = (i / 13) * this.width - bw * 0.5;
        const y = horizon - bh * 0.28;
        ctx.fillStyle = i % 3 === 0 ? "rgba(18,14,15,.82)" : "rgba(9,10,13,.9)";
        ctx.fillRect(x, y, bw, bh);
        ctx.fillStyle = phase3 ? "rgba(255,0,85,.28)" : "rgba(0,245,255,.18)";
        if (i % 2 === 0) ctx.fillRect(x + bw * 0.58, y + 10, 3, bh * 0.42);
        if (i % 5 === 0) ctx.fillRect(x + 5, y + 18, bw - 10, 2);
      }
      ctx.restore();

      const haze = ctx.createRadialGradient(vpX, horizon, 8, vpX, horizon, this.width * 0.58);
      haze.addColorStop(0, phase3 ? "rgba(255,0,85,.12)" : "rgba(255,215,0,.10)");
      haze.addColorStop(0.42, "rgba(255,107,53,.045)");
      haze.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = haze;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.lineWidth = 1;
      for (let i = 0; i < 30; i += 1) {
        const z = i / 30;
        const y = horizon + (this.height - horizon) * z;
        const left = vpX - 30 - (this.width * 0.48) * z;
        const right = vpX + 30 + (this.width * 0.48) * z;
        ctx.strokeStyle = phase3 ? "rgba(255,0,85," + (0.035 + z * 0.11) + ")" : "rgba(255,215,0," + (0.035 + z * 0.11) + ")";
        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(right, y);
        ctx.stroke();
      }
      for (let i = -3; i <= 3; i += 1) {
        ctx.strokeStyle = "rgba(255,215,0,.07)";
        ctx.beginPath();
        ctx.moveTo(vpX + i * 22, horizon);
        ctx.lineTo(vpX + i * this.width * 0.16, this.height);
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(0,0,0,.28)";
      ctx.fillRect(0, this.height * 0.78, this.width, this.height * 0.22);
      ctx.fillStyle = phase3 ? "rgba(255,0,85,.10)" : "rgba(255,215,0,.08)";
      ctx.fillRect(this.width * 0.1, this.height * 0.78, this.width * 0.8, 2);

      for (let i = 0; i < 24; i += 1) {
        const x = (i * 79 + this.time * (18 + i % 5)) % this.width;
        const y = (i * 47 + this.time * (24 + i % 7)) % this.height;
        const a = 0.08 + (i % 4) * 0.025;
        ctx.fillStyle = i % 3 === 0 ? "rgba(255,107,53," + a + ")" : "rgba(255,215,0," + a + ")";
        ctx.beginPath();
        ctx.ellipse(x, y, 1.3, 4.8, -0.45, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    drawEmergence(ctx) {
      const t = this.emergenceTime;
      const phase1 = clamp(t / 3, 0, 1);
      const phase2 = clamp((t - 3) / 3, 0, 1);
      const phase3 = clamp((t - 6) / 3, 0, 1);
      const zoom = t < 6 ? 1 : 1 - phase3 * 0.4;
      const cx = this.width / 2;
      const cy = this.height * 0.54;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);
      ctx.translate(-cx, -cy);
      this.drawDimensionalCorridor(ctx, t);

      if (t < 6) {
        this.drawPortal(ctx, cx, this.height * 0.54, phase2);
      }

      if (t < 3.15) {
        this.drawRunner2D(ctx, this.player.x, this.player.y, 1 - phase2);
      } else if (t < 6) {
        this.drawRunner2D(ctx, this.player.x, this.player.y, Math.max(0, 1 - phase2 * 1.35));
      } else {
        this.drawSoldier3D(ctx, cx, this.height * 0.76, phase3);
      }
      ctx.restore();

      if (phase2 > 0.04 && phase3 < 0.2) this.drawGlitch(ctx, phase2);
      this.drawEmergenceText(ctx, t);
    }

    drawDimensionalCorridor(ctx, t) {
      const bg = ctx.createLinearGradient(0, 0, 0, this.height);
      bg.addColorStop(0, "#050407");
      bg.addColorStop(0.5, "#0A0A0F");
      bg.addColorStop(1, "#030201");
      ctx.fillStyle = bg;
      ctx.fillRect(-80, -80, this.width + 160, this.height + 160);

      const vpX = this.width / 2;
      const vpY = this.height * 0.2;
      ctx.lineWidth = 1;
      for (let i = 0; i < 34; i += 1) {
        const z = ((i / 34 + t * 0.08) % 1);
        const y = vpY + (this.height - vpY) * z;
        const spread = 40 + this.width * 0.48 * z;
        ctx.strokeStyle = `rgba(255,215,0,${0.04 + z * 0.16})`;
        ctx.beginPath();
        ctx.moveTo(vpX - spread, y);
        ctx.lineTo(vpX + spread, y);
        ctx.stroke();
      }
      ctx.strokeStyle = "rgba(255,215,0,.18)";
      for (let i = -3; i <= 3; i += 1) {
        ctx.beginPath();
        ctx.moveTo(vpX + i * 34, vpY);
        ctx.lineTo(vpX + i * this.width * 0.17, this.height);
        ctx.stroke();
      }
    }

    drawPortal(ctx, x, y, amount) {
      const pulse = Math.sin(this.time * 10) * 0.5 + 0.5;
      const r = 54 + amount * 78 + pulse * 10;
      const grd = ctx.createRadialGradient(x, y, 4, x, y, r * 1.5);
      grd.addColorStop(0, "rgba(255,245,210,.95)");
      grd.addColorStop(0.25, "rgba(255,215,0,.48)");
      grd.addColorStop(1, "rgba(255,215,0,0)");
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(x, y, r * 1.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(255,215,0,${0.38 + amount * 0.38})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([10, 12]);
      ctx.beginPath();
      ctx.arc(x, y, r * 0.72, this.time * 2, this.time * 2 + Math.PI * 1.6);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    drawRunner2D(ctx, x, y, alpha) {
      if (alpha <= 0) return;
      const bob = Math.sin(this.player.anim * 12) * 4;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.translate(x, y + bob);
      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 26;
      ctx.fillStyle = "#FFD700";
      ctx.beginPath();
      ctx.moveTo(0, -34);
      ctx.lineTo(18, 14);
      ctx.lineTo(7, 30);
      ctx.lineTo(0, 18);
      ctx.lineTo(-7, 30);
      ctx.lineTo(-18, 14);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = "#FFF2B0";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-14, -2);
      ctx.lineTo(-30 - Math.sin(this.player.anim * 10) * 12, 16);
      ctx.moveTo(14, -2);
      ctx.lineTo(30 + Math.sin(this.player.anim * 10) * 12, 14);
      ctx.stroke();
      ctx.restore();
    }

    drawSoldier3D(ctx, x, y, amount) {
      const a = clamp(amount, 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.translate(x, y);
      ctx.scale(0.84 + a * 0.16, 0.84 + a * 0.16);
      ctx.fillStyle = `rgba(0,0,0,${0.32 * a})`;
      ctx.beginPath();
      ctx.ellipse(0, 42, 52, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowColor = "#FFD700";
      ctx.shadowBlur = 20 * a;
      ctx.fillStyle = "rgba(24,21,16,.98)";
      ctx.fillRect(-18, -72, 36, 24);
      ctx.fillStyle = "#FFD700";
      ctx.fillRect(-12, -62, 24, 5);
      this.drawArmorPlate(ctx, [[-38, -42], [38, -42], [30, 16], [-30, 16]], "rgba(42,34,20,.98)");
      this.drawArmorPlate(ctx, [[-58, -38], [-36, -52], [-28, -10], [-50, 2]], "rgba(32,28,24,.98)");
      this.drawArmorPlate(ctx, [[58, -38], [36, -52], [28, -10], [50, 2]], "rgba(32,28,24,.98)");
      ctx.strokeStyle = "rgba(255,215,0,.72)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-22, -22);
      ctx.lineTo(22, -22);
      ctx.moveTo(-18, -4);
      ctx.lineTo(18, -4);
      ctx.stroke();
      ctx.fillStyle = "#FF6B35";
      ctx.beginPath();
      ctx.arc(0, -10, 7 + Math.sin(this.time * 8) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,215,0,.55)";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-18, 16);
      ctx.lineTo(-28, 44);
      ctx.moveTo(18, 16);
      ctx.lineTo(28, 44);
      ctx.stroke();
      ctx.restore();
    }

    drawArmorPlate(ctx, points, fill) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      ctx.strokeStyle = "rgba(255,215,0,.55)";
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    drawGlitch(ctx, amount) {
      const a = Math.min(0.18, amount * 0.12);
      for (let i = 0; i < 5; i += 1) {
        const y = Math.random() * this.height;
        const h = 2 + Math.random() * 9;
        ctx.fillStyle = i % 2 ? `rgba(0,245,255,${a})` : `rgba(255,0,85,${a})`;
        ctx.fillRect((Math.random() - 0.5) * 26, y, this.width, h);
      }
    }

    drawEmergenceText(ctx, t) {
      const label = t < 3 ? "Escape the corridor..." : t < 6 ? "Dimensional shift detected" : "Welcome to the War Zone";
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "bold 18px monospace";
      ctx.fillStyle = t < 6 ? "#FFD700" : "#FFF2B0";
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 18;
      ctx.fillText(label.toUpperCase(), this.width / 2, this.height * 0.16);
      ctx.font = "11px monospace";
      ctx.shadowBlur = 8;
      ctx.fillText("PART I SIGNAL RECONSTRUCTING INTO ACT II BODY", this.width / 2, this.height * 0.16 + 24);
      ctx.restore();
    }

    drawPlayer(ctx) {
      const p = this.player;
      const bob = Math.sin(p.anim * 9) * 2.2;
      const dash = p.dashTimer > 0;
      const over = this.overchargeTimer > 0;
      ctx.save();
      ctx.translate(p.x, p.y + bob);

      ctx.globalAlpha = 0.42;
      ctx.fillStyle = dash ? "#FFF2B0" : "#000";
      ctx.beginPath();
      ctx.ellipse(0, 32, dash ? 42 : 30, dash ? 10 : 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;

      if (this.shieldTimer > 0) {
        ctx.strokeStyle = "rgba(0,245,255,.58)";
        ctx.lineWidth = 2;
        ctx.shadowColor = "#00F5FF";
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.ellipse(0, -4, 36 + Math.sin(this.time * 8) * 2, 50, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      const glow = dash ? "#FFF2B0" : over ? "#FF6B35" : "#C9952A";
      ctx.shadowColor = glow;
      ctx.shadowBlur = dash ? 22 : over ? 16 : 7;

      ctx.fillStyle = "rgba(10,10,13,.98)";
      ctx.strokeStyle = "rgba(244,198,106,.82)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(-15, -31, 30, 43, 6);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "rgba(31,26,18,.98)";
      ctx.beginPath();
      ctx.moveTo(-26, -24);
      ctx.lineTo(-12, -35);
      ctx.lineTo(-7, -6);
      ctx.lineTo(-24, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(26, -24);
      ctx.lineTo(12, -35);
      ctx.lineTo(7, -6);
      ctx.lineTo(24, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "#08080B";
      ctx.beginPath();
      ctx.roundRect(-13, -52, 26, 22, 7);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = dash ? "#FFF2B0" : "#00F5FF";
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = 10;
      ctx.fillRect(-9, -43, 18, 3);
      ctx.shadowBlur = 0;

      ctx.strokeStyle = "rgba(244,198,106,.82)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-10, -18);
      ctx.lineTo(10, -18);
      ctx.moveTo(-9, -5);
      ctx.lineTo(9, -5);
      ctx.stroke();

      ctx.fillStyle = over ? "#FF6B35" : "#FFD700";
      ctx.shadowColor = ctx.fillStyle;
      ctx.shadowBlur = over ? 16 : 8;
      ctx.beginPath();
      ctx.arc(0, -11, 5 + Math.sin(this.time * 8) * 1.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.strokeStyle = dash ? "#FFF2B0" : "rgba(201,149,42,.95)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(17, -16);
      ctx.lineTo(32, -25);
      ctx.stroke();
      ctx.fillStyle = "#0A0A0F";
      ctx.strokeStyle = "rgba(244,198,106,.9)";
      ctx.lineWidth = 1.4;
      ctx.fillRect(30, -30, 26, 6);
      ctx.strokeRect(30, -30, 26, 6);
      ctx.fillRect(51, -27, 8, 3);

      ctx.strokeStyle = "rgba(115,91,49,.95)";
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(-7, 10);
      ctx.lineTo(-15, 34);
      ctx.moveTo(7, 10);
      ctx.lineTo(15, 34);
      ctx.stroke();
      ctx.fillStyle = "#050506";
      ctx.fillRect(-22, 30, 13, 5);
      ctx.fillRect(9, 30, 13, 5);

      ctx.restore();
    }

    drawPowerups(ctx) {
      for (const p of this.powerups) {
        const color = this.powerupColor(p.type);
        const r = p.r + Math.sin(p.pulse) * 2;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.shadowColor = color;
        ctx.shadowBlur = 18;
        ctx.strokeStyle = color;
        ctx.fillStyle = "rgba(10,10,15,.82)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(-r, -r, r * 2, r * 2, 5);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = "bold 11px monospace";
        ctx.textAlign = "center";
        const label = p.type === "overcharge" ? "OC" : p.type === "shield" ? "SH" : p.type === "timeslow" ? "TS" : "+A";
        ctx.fillText(label, 0, 4);
        ctx.restore();
      }

      const active = [];
      if (this.overchargeTimer > 0) active.push(["OVERCHARGE", this.overchargeTimer, "#FF6B35"]);
      if (this.shieldTimer > 0) active.push(["SHIELD", this.shieldTimer, "#00F5FF"]);
      if (this.timeSlowTimer > 0) active.push(["TIME SLOW", this.timeSlowTimer, "#B58CFF"]);
      active.forEach((item, i) => {
        const [name, timer, color] = item;
        const x = 18;
        const y = 82 + i * 20;
        ctx.save();
        ctx.fillStyle = "rgba(0,0,0,.55)";
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.roundRect(x, y, 126, 15, 6);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = color;
        ctx.font = "bold 9px monospace";
        ctx.fillText(name + " " + timer.toFixed(1), x + 9, y + 10);
        ctx.restore();
      });
    }

    drawMinions(ctx) {
      for (const m of this.minions) {
        ctx.save();
        ctx.translate(m.x, m.y);
        const hot = 0.5 + Math.sin(m.pulse) * 0.5;
        ctx.shadowColor = m.type === "turret" ? "#FF6B35" : "#00F5FF";
        ctx.shadowBlur = 10 + hot * 9;
        ctx.strokeStyle = m.type === "turret" ? "#FF6B35" : "#00F5FF";
        ctx.fillStyle = "rgba(8,8,12,.92)";
        ctx.lineWidth = 2;
        if (m.type === "turret") {
          ctx.beginPath();
          ctx.roundRect(-22, -12, 44, 24, 4);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = "#FFD700";
          ctx.fillRect(-4, -28, 8, 18);
          ctx.fillRect(-18, 13, 36, 5);
          ctx.beginPath();
          ctx.arc(0, 0, 5 + hot * 2, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.roundRect(-16, -10, 32, 20, 6);
          ctx.fill();
          ctx.stroke();
          ctx.strokeStyle = "rgba(255,215,0,.75)";
          ctx.beginPath();
          ctx.moveTo(-25, -2);
          ctx.lineTo(-16, -2);
          ctx.moveTo(16, -2);
          ctx.lineTo(25, -2);
          ctx.stroke();
          ctx.fillStyle = "#00F5FF";
          ctx.fillRect(-5, -4, 10, 7);
        }
        ctx.restore();
      }
    }

    drawOrbs(ctx) {
      for (const orb of this.orbs) {
        const r = orb.r + Math.sin(orb.pulse) * 2.5;
        ctx.shadowColor = "#FFD700";
        ctx.shadowBlur = 18;
        ctx.fillStyle = "#FFD700";
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    drawShots(ctx) {
      for (const shot of this.shots) {
        ctx.shadowColor = shot.perfect ? "#fff5d0" : "#FFD700";
        ctx.shadowBlur = shot.perfect ? 28 : 14;
        ctx.fillStyle = shot.perfect ? "#fff5d0" : "#FFD700";
        ctx.fillRect(shot.x - 3, shot.y - 18, 6, 28);
      }
      for (const shot of this.enemyShots) {
        if (shot.type === "laser") {
          const charge = Math.min(1, shot.timer / shot.warmup);
          const active = shot.timer >= shot.warmup;
          ctx.save();
          ctx.globalAlpha = active ? 0.88 : 0.18 + charge * 0.34;
          ctx.strokeStyle = active ? "#FF0055" : "#FF6B35";
          ctx.shadowColor = active ? "#FF0055" : "#FF6B35";
          ctx.shadowBlur = active ? 26 : 14;
          ctx.lineWidth = active ? 10 : 2 + charge * 3;
          if (!active) ctx.setLineDash([12, 10]);
          ctx.beginPath();
          ctx.moveTo(0, shot.y);
          ctx.lineTo(this.width, shot.y);
          ctx.stroke();
          ctx.setLineDash([]);
          if (active) {
            ctx.globalAlpha = 0.45;
            ctx.strokeStyle = "#FFF2B0";
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(0, shot.y);
            ctx.lineTo(this.width, shot.y);
            ctx.stroke();
          }
          ctx.restore();
          continue;
        }
        ctx.shadowColor = shot.type === "missile" ? "#FF6B35" : "#FF0055";
        ctx.shadowBlur = 18;
        ctx.fillStyle = shot.type === "missile" ? "#FF6B35" : "#FF0055";
        ctx.beginPath();
        ctx.arc(shot.x, shot.y, shot.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    drawParticles(ctx) {
      for (const p of this.particles) {
        ctx.globalAlpha = Math.max(0, p.life);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    drawFloatingText(ctx) {
      ctx.save();
      ctx.textAlign = "center";
      ctx.font = "bold 22px monospace";
      for (const t of this.floatingText) {
        const a = Math.max(0, t.life / t.maxLife);
        ctx.globalAlpha = a;
        ctx.translate(t.x, t.y);
        ctx.scale(t.scale, t.scale);
        ctx.fillStyle = t.color;
        ctx.shadowColor = t.color;
        ctx.shadowBlur = 22 * a;
        ctx.fillText(t.text, 0, 0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
      }
      ctx.restore();
    }

    drawScreenFlash(ctx) {
      if (this.screenFlash <= 0) return;
      ctx.save();
      ctx.globalAlpha = Math.min(0.85, this.screenFlash);
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.restore();
    }
  }

  function createGame(canvas, overlay, startButton, options) {
    const game = new WarMachinesGame(canvas, overlay, startButton, options);
    window.KamdridiWarMachinesGame = game;
    return game;
  }

  window.KamdridiWarMachines = window.KamdridiWarMachines || {};
  window.KamdridiWarMachines.WarMachinesGame = WarMachinesGame;
  window.KamdridiWarMachines.createGame = createGame;
  window.KamdridiWarMachines.initPolish = function initPolish(game) {
    if (!game) return null;
    game.fx = game.fx || new window.KamdridiWarMachines.ParticlePool(200);
    game.screens = game.screens || new window.KamdridiWarMachines.UIScreens(game.canvas.parentElement || document.body);
    return game;
  };
})();
