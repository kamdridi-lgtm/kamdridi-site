// Filename: public/games/war-machines/visual-overrides.js
// Module: Visual Overrides
// Description: Cinematic arena and soldier rendering pass for ACT II.
(function () {
  "use strict";

  const NS = window.KamdridiWarMachines;
  if (!NS || !NS.WarMachinesGame) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function plate(ctx, points, fill, stroke) {
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i][0], points[i][1]);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }
  }

  NS.WarMachinesGame.prototype.drawBackground = function drawBackground(ctx) {
    const phase3 = this.boss.phase === 3;
    const vpX = this.width / 2;
    const horizon = this.height * 0.23;
    const floorTop = this.height * 0.56;

    const sky = ctx.createLinearGradient(0, 0, 0, this.height);
    sky.addColorStop(0, phase3 ? "#14060A" : "#06070D");
    sky.addColorStop(0.34, phase3 ? "#10080E" : "#090A12");
    sky.addColorStop(0.63, "#050507");
    sky.addColorStop(1, "#020101");
    ctx.fillStyle = sky;
    ctx.fillRect(-40, -40, this.width + 80, this.height + 80);

    ctx.save();
    ctx.globalAlpha = 0.78;
    for (let layer = 0; layer < 2; layer += 1) {
      const count = layer ? 18 : 13;
      for (let i = 0; i < count; i += 1) {
        const bw = (layer ? 18 : 28) + ((i * 17 + layer * 9) % 34);
        const bh = (layer ? 38 : 54) + ((i * 29 + layer * 13) % 88);
        const x = ((i + layer * 0.37) / (count - 1)) * (this.width + 90) - 45;
        const y = horizon + layer * 12 - bh * (layer ? 0.5 : 0.72);
        ctx.fillStyle = layer ? "rgba(10,9,11,.82)" : "rgba(16,13,13,.88)";
        ctx.fillRect(x, y, bw, bh);
        ctx.fillStyle = i % 3 ? (phase3 ? "rgba(255,0,85,.24)" : "rgba(0,245,255,.16)") : "rgba(255,156,58,.14)";
        if (i % 2 === 0) ctx.fillRect(x + bw * 0.62, y + 12, 3, bh * 0.52);
        if (i % 5 === 0) ctx.fillRect(x + 5, y + 22, Math.max(4, bw - 10), 2);
      }
    }
    ctx.restore();

    const dome = ctx.createRadialGradient(vpX, horizon + 10, 10, vpX, horizon + 10, this.width * 0.62);
    dome.addColorStop(0, phase3 ? "rgba(255,0,85,.16)" : "rgba(255,215,0,.13)");
    dome.addColorStop(0.28, "rgba(255,107,53,.07)");
    dome.addColorStop(0.72, "rgba(0,245,255,.025)");
    dome.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = dome;
    ctx.fillRect(0, 0, this.width, this.height);

    const floor = ctx.createLinearGradient(0, floorTop, 0, this.height);
    floor.addColorStop(0, "rgba(8,8,10,.36)");
    floor.addColorStop(0.5, "rgba(7,6,6,.78)");
    floor.addColorStop(1, "rgba(2,1,1,.98)");
    ctx.fillStyle = floor;
    ctx.beginPath();
    ctx.moveTo(vpX - 70, floorTop);
    ctx.lineTo(vpX + 70, floorTop);
    ctx.lineTo(this.width + 90, this.height + 30);
    ctx.lineTo(-90, this.height + 30);
    ctx.closePath();
    ctx.fill();

    ctx.lineWidth = 1;
    for (let i = 0; i < 34; i += 1) {
      const z = i / 34;
      const y = floorTop + (this.height - floorTop) * z;
      const left = vpX - 72 - (this.width * 0.56) * z;
      const right = vpX + 72 + (this.width * 0.56) * z;
      const a = 0.035 + z * 0.13;
      ctx.strokeStyle = phase3 ? `rgba(255,0,85,${a})` : `rgba(255,215,0,${a})`;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(right, y);
      ctx.stroke();
    }
    for (let i = -4; i <= 4; i += 1) {
      const warm = i === 0 ? 0.18 : 0.08;
      ctx.strokeStyle = `rgba(255,215,0,${warm})`;
      ctx.beginPath();
      ctx.moveTo(vpX + i * 18, floorTop);
      ctx.lineTo(vpX + i * this.width * 0.15, this.height + 20);
      ctx.stroke();
    }

    ctx.save();
    ctx.globalAlpha = phase3 ? 0.32 : 0.24;
    ctx.strokeStyle = phase3 ? "#FF0055" : "#FFD700";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vpX, floorTop + 10);
    ctx.lineTo(vpX, this.height);
    ctx.stroke();
    ctx.restore();

    for (let i = 0; i < 30; i += 1) {
      const x = (i * 83 + this.time * (14 + i % 5)) % this.width;
      const y = (i * 43 + this.time * (18 + i % 7)) % this.height;
      const a = 0.07 + (i % 4) * 0.022;
      ctx.fillStyle = i % 3 === 0 ? `rgba(255,107,53,${a})` : `rgba(255,215,0,${a})`;
      ctx.beginPath();
      ctx.ellipse(x, y, 1.2, 5.5, -0.45, 0, Math.PI * 2);
      ctx.fill();
    }

    const vignette = ctx.createRadialGradient(vpX, this.height * 0.55, this.width * 0.18, vpX, this.height * 0.55, this.width * 0.72);
    vignette.addColorStop(0, "rgba(0,0,0,0)");
    vignette.addColorStop(1, "rgba(0,0,0,.54)");
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, this.width, this.height);
  };

  NS.WarMachinesGame.prototype.drawPlayer = function drawPlayer(ctx) {
    const p = this.player;
    const bob = Math.sin(p.anim * 9) * 2.2;
    const stride = Math.sin(p.anim * 10) * (Math.abs(p.vx) > 30 ? 1 : 0.25);
    const dash = p.dashTimer > 0;
    const over = this.overchargeTimer > 0;
    const facing = p.lastDir || 1;

    ctx.save();
    ctx.translate(p.x, p.y + bob);
    ctx.scale(facing, 1);

    ctx.globalAlpha = 0.48;
    ctx.fillStyle = dash ? "#FFF2B0" : "#000";
    ctx.beginPath();
    ctx.ellipse(0, 36, dash ? 52 : 36, dash ? 12 : 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    if (dash) {
      const trail = ctx.createLinearGradient(-76, -12, 16, -12);
      trail.addColorStop(0, "rgba(255,245,210,0)");
      trail.addColorStop(1, "rgba(255,245,210,.34)");
      ctx.fillStyle = trail;
      plate(ctx, [[-78, -30], [-16, -48], [-10, 18], [-82, 28]], trail, null);
    }

    if (this.shieldTimer > 0) {
      ctx.strokeStyle = "rgba(0,245,255,.58)";
      ctx.lineWidth = 2;
      ctx.shadowColor = "#00F5FF";
      ctx.shadowBlur = 20;
      ctx.beginPath();
      ctx.ellipse(0, -6, 42 + Math.sin(this.time * 8) * 2, 56, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    const glow = dash ? "#FFF2B0" : over ? "#FF6B35" : "#C9952A";
    ctx.shadowColor = glow;
    ctx.shadowBlur = dash ? 24 : over ? 18 : 8;

    // Legs and boots.
    ctx.strokeStyle = dash ? "#FFF2B0" : "rgba(115,91,49,.98)";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(-9, 10);
    ctx.lineTo(-18 - stride * 5, 36);
    ctx.moveTo(9, 10);
    ctx.lineTo(18 + stride * 5, 36);
    ctx.stroke();
    ctx.fillStyle = "#050506";
    ctx.fillRect(-27 - stride * 4, 31, 18, 6);
    ctx.fillRect(10 + stride * 4, 31, 18, 6);

    // Armored torso and shoulders.
    plate(ctx, [[-19, -33], [19, -33], [16, 14], [-16, 14]], "rgba(10,10,13,.98)", "rgba(244,198,106,.82)");
    plate(ctx, [[-34, -26], [-16, -42], [-9, -10], [-31, 2]], "rgba(31,26,18,.98)", "rgba(244,198,106,.7)");
    plate(ctx, [[34, -26], [16, -42], [9, -10], [31, 2]], "rgba(31,26,18,.98)", "rgba(244,198,106,.7)");
    ctx.strokeStyle = "rgba(244,198,106,.82)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12, -19);
    ctx.lineTo(12, -19);
    ctx.moveTo(-10, -5);
    ctx.lineTo(10, -5);
    ctx.stroke();

    // Helmet, visor and glowing chest core.
    ctx.fillStyle = "#08080B";
    ctx.beginPath();
    ctx.roundRect(-15, -56, 30, 24, 8);
    ctx.fill();
    ctx.strokeStyle = "rgba(244,198,106,.82)";
    ctx.stroke();
    ctx.fillStyle = dash ? "#FFF2B0" : "#00F5FF";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = 10;
    ctx.fillRect(-11, -46, 22, 4);

    ctx.fillStyle = over ? "#FF6B35" : "#FFD700";
    ctx.shadowColor = ctx.fillStyle;
    ctx.shadowBlur = over ? 17 : 9;
    ctx.beginPath();
    ctx.arc(0, -11, 5 + Math.sin(this.time * 8) * 1.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Rifle and muzzle flash.
    ctx.strokeStyle = dash ? "#FFF2B0" : "rgba(201,149,42,.95)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(15, -17);
    ctx.lineTo(34, -27);
    ctx.stroke();
    ctx.fillStyle = "#0A0A0F";
    ctx.strokeStyle = "rgba(244,198,106,.9)";
    ctx.lineWidth = 1.4;
    ctx.fillRect(31, -32, 31, 7);
    ctx.strokeRect(31, -32, 31, 7);
    ctx.fillRect(58, -29, 10, 3);
    if (p.fireFlash > 0) {
      ctx.shadowColor = "#FFF2B0";
      ctx.shadowBlur = 18;
      ctx.fillStyle = `rgba(255,245,210,${0.75 * p.fireFlash})`;
      ctx.beginPath();
      ctx.arc(72, -28, 9 + 12 * p.fireFlash, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  };
})();
