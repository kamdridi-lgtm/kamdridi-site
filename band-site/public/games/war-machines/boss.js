// Filename: public/games/war-machines/boss.js
// Module: Boss K-01
// Description: Phase-based boss AI with weak reactor logic.
(function () {
  "use strict";

  class K01Boss {
    constructor() {
      this.maxHp = 1000;
      this.hp = this.maxHp;
      this.phase = 1;
      this.attackTimer = 1.2;
      this.chargeTimer = 0;
      this.x = 0;
      this.y = 0;
      this.reactorExposed = 0.35;
      this.destroyed = false;
      this.explosionTimer = 0;
      this.visualPhase = 1;
      this.flashTimer = 0;
      this.corePulse = 0;
      this.muzzleFlash = 0;
      this.laserCharge = 0;
    }

    reset(width, height) {
      this.hp = this.maxHp;
      this.phase = 1;
      this.attackTimer = 1.2;
      this.chargeTimer = 0;
      this.x = width / 2;
      this.y = height * 0.24;
      this.reactorExposed = 0.35;
      this.destroyed = false;
      this.explosionTimer = 0;
      this.visualPhase = 1;
      this.flashTimer = 0;
      this.corePulse = 0;
      this.muzzleFlash = 0;
      this.laserCharge = 0;
    }

    update(dt, game) {
      if (this.destroyed) {
        this.explosionTimer += dt;
        return;
      }

      this.x = game.width / 2 + Math.sin(game.time * (0.8 + this.phase * 0.25)) * (18 + this.phase * 8);
      this.y = game.height * 0.24;
      this.updatePhase(game);
      this.flashTimer = Math.max(0, this.flashTimer - dt);
      this.muzzleFlash = Math.max(0, this.muzzleFlash - dt * 6);
      this.laserCharge = Math.max(0, this.laserCharge - dt * 2.8);
      this.corePulse += dt * (4.5 + this.phase * 1.5);

      this.attackTimer -= dt;
      if (this.attackTimer <= 0) {
        this.executeAttack(game);
      }

      if (this.chargeTimer > 0) {
        this.chargeTimer -= dt;
      }
    }

    updatePhase(game) {
      const pct = this.hp / this.maxHp;
      const previous = this.phase;
      if (pct <= 0.33) {
        this.phase = 3;
        this.reactorExposed = 1;
      } else if (pct <= 0.66) {
        this.phase = 2;
        this.reactorExposed = 0.65;
      } else {
        this.phase = 1;
        this.reactorExposed = 0.35;
      }
      if (previous !== this.phase) {
        this.visualPhase = this.phase;
        this.flashTimer = 0.45;
        if (game) {
          game.screenFlash = Math.max(game.screenFlash || 0, 0.8);
          game.shake = Math.max(game.shake || 0, 12);
          game.objective = this.phase === 3 ? "BERSERK. Reactor fully exposed." : "Phase shift. Reactor exposure increased.";
        }
      }
    }

    executeAttack(game) {
      if (this.phase === 1) {
        this.fireCannon(game, 1);
        game.kickShake(3, 0.15);
        this.attackTimer = 1.15;
      } else if (this.phase === 2) {
        this.fireMissiles(game, 3);
        game.kickShake(3, 0.15);
        this.chargeTimer = 0.42;
        this.attackTimer = 1.05;
      } else {
        if (Math.random() < 0.28) {
          this.fireLaser(game);
          game.kickShake(5, 0.18);
          this.attackTimer = 1.15;
        } else {
          this.fireCannon(game, 3);
          this.fireMissiles(game, 4);
          game.kickShake(4, 0.16);
          this.attackTimer = 0.65;
        }
      }
    }

    fireCannon(game, count) {
      for (let i = 0; i < count; i += 1) {
        const spread = (i - (count - 1) / 2) * 0.2;
        const dx = game.player.x - this.x + spread * game.width;
        const dy = game.player.y - this.y;
        const len = Math.max(1, Math.hypot(dx, dy));
        const speed = 210 + this.phase * 48;
        game.enemyShots.push({
          x: this.x + spread * 70,
          y: this.y + 112,
          vx: (dx / len) * speed,
          vy: (dy / len) * speed,
          r: 7 + this.phase,
          type: "cannon"
        });
      }
      this.muzzleFlash = 1;
    }

    fireLaser(game) {
      const y = Math.max(game.height * 0.36, Math.min(game.height * 0.84, game.player.y));
      game.enemyShots.push({
        x: 0,
        y,
        vx: 0,
        vy: 0,
        r: 0,
        type: "laser",
        timer: 0,
        warmup: 0.52,
        duration: 0.36,
        hit: false
      });
      this.laserCharge = 1;
      this.muzzleFlash = Math.max(this.muzzleFlash, 0.65);
      game.objective = "LASER TELEGRAPH. Move off the line.";
    }

    fireMissiles(game, count) {
      for (let i = 0; i < count; i += 1) {
        const lane = (i + 1) / (count + 1);
        game.enemyShots.push({
          x: lane * game.width,
          y: -20 - Math.random() * 90,
          vx: Math.sin(game.time + i) * 30,
          vy: 160 + this.phase * 36,
          r: 7,
          type: "missile"
        });
      }
      this.muzzleFlash = Math.max(this.muzzleFlash, 0.45);
    }

    applyDamage(amount, hitReactor) {
      if (this.destroyed) return 0;
      const finalDamage = hitReactor ? amount * (1.4 + this.reactorExposed * 0.8) : amount;
      this.hp = Math.max(0, this.hp - finalDamage);
      this.updatePhase();
      if (this.hp <= 0) {
        this.destroyed = true;
        this.explosionTimer = 0;
      }
      return finalDamage;
    }

    getWeakPoint() {
      return {
        x: this.x,
        y: this.y + 34,
        r: 20 + this.reactorExposed * 20
      };
    }

    plate(ctx, points, fill, stroke) {
      ctx.beginPath();
      ctx.moveTo(points[0][0], points[0][1]);
      for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
      ctx.closePath();
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }

    render(ctx, game) {
      const neon = this.phase === 3 ? "#FF0055" : this.phase === 2 ? "#00F5FF" : "#FFD700";
      const glow = this.phase === 3 ? "#FF0055" : "#FFD700";
      ctx.save();
      ctx.translate(this.x, this.y);

      if (this.destroyed) {
        const pulse = Math.sin(this.explosionTimer * 32) * 0.5 + 0.5;
        ctx.globalAlpha = Math.max(0, 1 - this.explosionTimer / 2.4);
        ctx.fillStyle = `rgba(255,107,53,${0.25 + pulse * 0.55})`;
        ctx.beginPath();
        ctx.arc(0, 0, 70 + this.explosionTimer * 180, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
        return;
      }

      const chargeLean = this.chargeTimer > 0 ? Math.sin(game.time * 42) * 7 : 0;
      ctx.translate(chargeLean, 0);

      ctx.shadowColor = glow;
      ctx.shadowBlur = 10 + this.phase * 4;

      const armor = "rgba(14,13,12,.98)";
      const darkArmor = "rgba(5,5,7,.98)";
      const midArmor = "rgba(35,30,24,.96)";
      const edge = "rgba(244,198,106,.46)";

      // Back silhouette: shoulders, missile pods and heavy side housings.
      this.plate(ctx, [[-180, -42], [-132, -92], [-58, -76], [-44, -18], [-118, 18], [-172, 10]], darkArmor, edge);
      this.plate(ctx, [[180, -42], [132, -92], [58, -76], [44, -18], [118, 18], [172, 10]], darkArmor, edge);
      ctx.fillStyle = midArmor;
      ctx.fillRect(-198, -12, 48, 84);
      ctx.fillRect(150, -12, 48, 84);
      ctx.strokeStyle = "rgba(255,215,0,.42)";
      ctx.strokeRect(-198, -12, 48, 84);
      ctx.strokeRect(150, -12, 48, 84);

      // Main upper armor and cockpit ridge.
      this.plate(ctx, [[-92, -112], [92, -112], [126, -70], [96, -36], [-96, -36], [-126, -70]], midArmor, edge);
      this.plate(ctx, [[-128, -50], [128, -50], [164, 20], [112, 78], [-112, 78], [-164, 20]], armor, edge);

      // Lower core chassis.
      this.plate(ctx, [[-104, 42], [104, 42], [136, 98], [88, 140], [-88, 140], [-136, 98]], darkArmor, edge);

      // Twin hydraulic legs / treads.
      ctx.lineWidth = 7;
      ctx.strokeStyle = "rgba(255,215,0,.35)";
      ctx.beginPath();
      ctx.moveTo(-92, 104);
      ctx.lineTo(-134, 164);
      ctx.lineTo(-174, 178);
      ctx.moveTo(92, 104);
      ctx.lineTo(134, 164);
      ctx.lineTo(174, 178);
      ctx.stroke();
      ctx.fillStyle = "rgba(10,9,8,.98)";
      ctx.fillRect(-206, 166, 92, 28);
      ctx.fillRect(114, 166, 92, 28);
      ctx.strokeStyle = edge;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-206, 166, 92, 28);
      ctx.strokeRect(114, 166, 92, 28);

      // Main cannon assembly points downward toward the player.
      const cannonKick = this.muzzleFlash > 0 ? -8 * this.muzzleFlash : 0;
      ctx.save();
      ctx.translate(0, cannonKick);
      ctx.fillStyle = "rgba(8,8,9,.98)";
      ctx.fillRect(-20, 72, 40, 96);
      ctx.fillStyle = "rgba(30,26,20,.98)";
      ctx.fillRect(-32, 58, 64, 38);
      ctx.strokeStyle = edge;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-32, 58, 64, 38);
      ctx.strokeRect(-20, 72, 40, 96);
      ctx.restore();

      // Neon sensor strips and armor scoring.
      ctx.fillStyle = neon;
      ctx.shadowColor = neon;
      ctx.shadowBlur = 18;
      ctx.fillRect(-66, -74, 38, 7);
      ctx.fillRect(28, -74, 38, 7);
      ctx.fillRect(-86, 8, 36, 6);
      ctx.fillRect(50, 8, 36, 6);

      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(244,198,106,.50)";
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 7; i += 1) {
        const y = -26 + i * 18;
        ctx.beginPath();
        ctx.moveTo(-116, y);
        ctx.lineTo(-42, y + Math.sin(game.time * 2 + i) * 2);
        ctx.moveTo(42, y + Math.cos(game.time * 2 + i) * 2);
        ctx.lineTo(116, y);
        ctx.stroke();
      }

      // Reactor core integrated into the chest, not a loose target circle.
      const coreR = 9 + this.reactorExposed * 14 + Math.sin(this.corePulse) * 3;
      const grd = ctx.createRadialGradient(0, 34, 1, 0, 34, coreR * 3.4);
      grd.addColorStop(0, "rgba(255,245,210,0.98)");
      grd.addColorStop(0.24, "rgba(255,107,53,0.92)");
      grd.addColorStop(1, "rgba(255,107,53,0)");
      ctx.shadowColor = "#FF6B35";
      ctx.shadowBlur = 18 + this.reactorExposed * 26;
      ctx.fillStyle = grd;
      ctx.beginPath();
      ctx.arc(0, 34, coreR * 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#FF6B35";
      ctx.beginPath();
      ctx.arc(0, 34, coreR, 0, Math.PI * 2);
      ctx.fill();

      if (this.attackTimer < 0.38) {
        const warn = Math.max(0, 1 - this.attackTimer / 0.38);
        const targetX = game.player.x - this.x;
        const targetY = game.player.y - this.y;
        ctx.save();
        ctx.globalAlpha = 0.18 + warn * 0.38;
        ctx.strokeStyle = this.phase === 3 ? "#FF0055" : "#FF6B35";
        ctx.lineWidth = 1.5 + warn * 2;
        ctx.setLineDash([8, 7]);
        ctx.beginPath();
        ctx.moveTo(0, 168);
        ctx.lineTo(targetX, targetY);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.arc(targetX, targetY, 18 + warn * 24, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }

      if (this.muzzleFlash > 0) {
        const a = this.muzzleFlash;
        ctx.shadowColor = "#FF6B35";
        ctx.shadowBlur = 34;
        ctx.fillStyle = `rgba(255,107,53,${0.75 * a})`;
        ctx.beginPath();
        ctx.arc(0, 176, 18 + 22 * a, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(255,245,210,${0.7 * a})`;
        ctx.fillRect(-7, 132, 14, 58);
      }
      ctx.restore();
    }
  }

  window.KamdridiWarMachines = window.KamdridiWarMachines || {};
  window.KamdridiWarMachines.K01Boss = K01Boss;
})();
