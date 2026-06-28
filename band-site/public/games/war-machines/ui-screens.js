// Filename: public/games/war-machines/ui-screens.js
// Module: Premium UI Screens
// Description: DOM overlays for victory and defeat states.
(function () {
  "use strict";

  function fmt(n) {
    return Math.max(0, Math.round(n || 0)).toLocaleString("en-US");
  }

  class UIScreens {
    constructor(root) {
      this.root = root;
      this.el = document.createElement("div");
      this.el.className = "wm-end-screen";
      this.el.setAttribute("aria-live", "polite");
      this.root.appendChild(this.el);
    }

    hide() {
      this.el.className = "wm-end-screen";
      this.el.innerHTML = "";
      this.el.style.pointerEvents = "none";
    }

    showVictory(stats, onReplay) {
      const copyRun = async () => {
        const accuracy = stats.shotsFired ? Math.round((stats.perfectShots / stats.shotsFired) * 100) : 0;
        const text = [
          "KAMDRIDI ACT II - WAR MACHINES",
          "REACTOR DESTROYED",
          "Score: " + fmt(stats.score),
          "Max Combo: " + fmt(stats.maxCombo),
          "Rhythm: " + accuracy + "%",
          "https://kamdridi.com/games/war-machines"
        ].join("\n");
        try {
          await navigator.clipboard.writeText(text);
          const btn = this.el.querySelector('[data-action="primary"]');
          if (btn) btn.textContent = "RUN CARD COPIED";
        } catch {
          window.location.href = "/games/war-machines";
        }
      };
      this.show({
        type: "victory",
        title: "REACTOR DESTROYED",
        kicker: "K-01 SIGNAL COLLAPSED",
        body: "The War Machine core is offline. Sync the run, then return to the combat lab.",
        stats,
        primary: "COPY RUN CARD",
        secondary: "REPLAY",
        onPrimary: copyRun,
        onSecondary: onReplay
      });
    }

    showDefeat(stats, onRetry) {
      this.show({
        type: "defeat",
        title: "SIGNAL LOST",
        kicker: "RUNNER LINK TERMINATED",
        body: "The reactor stayed online. Recalibrate your rhythm window and re-enter.",
        stats,
        primary: "RETRY",
        secondary: "",
        onPrimary: onRetry
      });
    }

    show(config) {
      const accuracy = config.stats.shotsFired
        ? Math.round((config.stats.perfectShots / config.stats.shotsFired) * 100)
        : 0;
      const bestLabel = config.stats.isNewBest ? "New Best" : "Best";
      this.el.className = `wm-end-screen wm-end-screen--show wm-end-screen--${config.type}`;
      this.el.style.pointerEvents = "auto";
      this.el.innerHTML = `
        <div class="wm-end-panel">
          <div class="wm-end-kicker">${config.kicker}</div>
          <h2 class="${config.type === "defeat" ? "wm-glitch" : ""}" data-text="${config.title}">${config.title}</h2>
          <p>${config.body}</p>
          <div class="wm-end-stats">
            <span><b>${fmt(config.stats.score)}</b><small>Score</small></span>
            <span><b>${fmt(config.stats.maxCombo)}</b><small>Max Combo</small></span>
            <span><b>${accuracy}%</b><small>Rhythm</small></span>
            <span><b>${fmt(config.stats.highScore)}</b><small>${bestLabel}</small></span>
          </div>
          <div class="wm-end-actions">
            <button type="button" data-action="primary">${config.primary}</button>
            ${config.secondary ? `<button type="button" data-action="secondary">${config.secondary}</button>` : ""}
          </div>
        </div>
      `;
      this.el.querySelector('[data-action="primary"]')?.addEventListener("click", config.onPrimary);
      this.el.querySelector('[data-action="secondary"]')?.addEventListener("click", config.onSecondary);
    }

    destroy() {
      this.el.remove();
    }
  }

  window.KamdridiWarMachines = window.KamdridiWarMachines || {};
  window.KamdridiWarMachines.UIScreens = UIScreens;
})();
