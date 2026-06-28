// Filename: public/games/war-machines/hud.js
// Module: HUD
// Description: Canvas HUD for boss HP, ammo, combo, objective and beat circle.
(function () {
  "use strict";

  function drawBar(ctx, x, y, w, h, pct, fill, label) {
    ctx.fillStyle = "rgba(0,0,0,.55)";
    ctx.fillRect(x, y, w, h);
    ctx.strokeStyle = "rgba(255,215,0,.36)";
    ctx.strokeRect(x, y, w, h);
    ctx.fillStyle = fill;
    ctx.fillRect(x + 2, y + 2, Math.max(0, w - 4) * Math.max(0, Math.min(1, pct)), h - 4);
    ctx.fillStyle = "#f3dfb6";
    ctx.font = "12px monospace";
    ctx.textAlign = "left";
    ctx.fillText(label, x, y - 8);
  }

  class HUD {
    render(ctx, game) {
      const w = game.width;
      const h = game.height;
      const bossPct = game.boss.hp / game.boss.maxHp;
      const hpPct = game.player.health / game.player.maxHealth;
      const ammoPct = game.player.ammo / game.player.maxAmmo;

      ctx.save();
      ctx.globalAlpha = 1;
      drawBar(ctx, w * 0.18, 28, w * 0.64, 14, bossPct, game.boss.phase === 3 ? "#FF0055" : "#FFD700", `K-01 WAR MACHINE // PHASE ${game.boss.phase}`);
      drawBar(ctx, 26, h - 74, 190, 10, hpPct, "#FFD700", "RUNNER");

      ctx.textAlign = "right";
      ctx.font = "bold 18px monospace";
      ctx.fillStyle = "#f3dfb6";
      ctx.fillText(`AMMO ${game.player.ammo}/${game.player.maxAmmo}`, w - 28, h - 78);
      const tier = game.getComboTier ? game.getComboTier(game.combo) : { name: "", color: "#f3dfb6" };
      ctx.fillStyle = tier.name ? tier.color : "#f3dfb6";
      ctx.fillText(`COMBO ${game.combo}${tier.name ? " // " + tier.name : ""}`, w - 28, h - 52);
      ctx.fillStyle = "#f3dfb6";
      ctx.fillText(`SCORE ${Math.floor(game.score)}`, w - 28, h - 26);

      ctx.strokeStyle = "rgba(244,198,106,.32)";
      ctx.strokeRect(w - 222, h - 92, 194, 78);
      ctx.fillStyle = "rgba(255,215,0,.18)";
      ctx.fillRect(w - 218, h - 42, 186 * ammoPct, 6);
      if (game.reloadTimer > 0) {
        const reloadPct = 1 - Math.max(0, Math.min(1, game.reloadTimer / 1.5));
        ctx.fillStyle = "rgba(0,245,255,.72)";
        ctx.fillRect(w - 218, h - 32, 186 * reloadPct, 5);
        ctx.fillStyle = "#00F5FF";
        ctx.font = "bold 9px monospace";
        ctx.textAlign = "left";
        ctx.fillText("RELOADING", w - 218, h - 47);
      }

      const beat = game.rhythm.getSyncStatus();
      const cx = w / 2;
      const cy = h - 96;
      const beatPhase = (performance.now() % 500) / 500;
      const pulse = Math.max(0, 1 - beatPhase * 2.6);
      const scale = 1 + pulse * 0.4;
      const r = 40 * scale;
      ctx.strokeStyle = beat.onBeat ? "rgba(255,215,0,.98)" : "rgba(68,68,68,.8)";
      ctx.lineWidth = beat.onBeat ? 4 : 2;
      ctx.shadowColor = beat.onBeat ? "#FFD700" : "#444";
      ctx.shadowBlur = beat.onBeat ? 28 : 4;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.25 + pulse * 0.45;
      ctx.beginPath();
      ctx.arc(cx, cy, 18 + pulse * 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;

      ctx.textAlign = "center";
      ctx.font = "11px monospace";
      ctx.fillStyle = beat.onBeat ? "#FFD700" : "#777";
      ctx.fillText(`${Math.round(beat.confidence * 100)}% SYNC`, cx, cy + 4);

      ctx.font = "12px monospace";
      ctx.fillStyle = "#f3dfb6";
      ctx.fillText(game.objective, cx, h - 28);
      ctx.restore();
    }
  }

  window.KamdridiWarMachines = window.KamdridiWarMachines || {};
  window.KamdridiWarMachines.HUD = HUD;
})();
