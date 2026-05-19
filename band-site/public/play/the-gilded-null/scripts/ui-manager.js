class UIManager {
  constructor() {
    this.scoreEl = document.getElementById("hud-score");
    this.dangerEl = document.getElementById("danger-fill");
    this.depthEl = document.getElementById("hud-depth");
    this.multEl = document.getElementById("hud-mult");
    this.messageEl = document.getElementById("hud-message");
    this.warningEl = document.getElementById("hud-warning");
  }

  update(data) {
    if (this.scoreEl) this.scoreEl.textContent = data.score;
    if (this.dangerEl) this.dangerEl.style.width = Math.floor(data.dangerLevel * 100) + "%";
    if (this.depthEl) this.depthEl.textContent = Math.floor(data.depth || 0) + "m";
    if (this.multEl) this.multEl.textContent = (data.mult || 1).toFixed(1) + "x";
  }

  showMessage(text) {
    if (!this.messageEl) return;
    this.messageEl.textContent = text;
    this.messageEl.classList.add("on");
    setTimeout(() => this.messageEl.classList.remove("on"), 1200);
  }

  showWarning(text) {
    if (!this.warningEl) return;
    this.warningEl.textContent = text;
    this.warningEl.classList.add("on");
    setTimeout(() => this.warningEl.classList.remove("on"), 700);
  }

  showGameOver(score) {
    const screen = document.getElementById("gameover-screen");
    const stats = document.getElementById("go-stats");
    if (stats) stats.textContent = "SCORE: " + Math.floor(score);
    if (screen) screen.classList.remove("hidden");
  }
}

window.uiManager = new UIManager();
