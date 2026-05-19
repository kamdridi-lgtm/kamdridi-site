const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const gameScreen = document.getElementById("game-screen");
const introScreen = document.getElementById("intro-screen");
const startButton = document.getElementById("btn-start");
const game = new GildedNullGame();

let last = performance.now();
let started = false;

function resizeCanvas() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  effectsManager.initFX();
}

async function startGame() {
  if (started) return;
  started = true;
  await audioManager.init();
  introScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  resizeCanvas();
  last = performance.now();
  loop(last);
}

function loop(now) {
  const delta = Math.min((now - last) / 1000, 0.05);
  last = now;
  update(delta);
  render();
  requestAnimationFrame(loop);
}

function update(delta) {
  game.update(delta);
  effectsManager.update(delta);
}

function render() {
  const w = canvas.clientWidth || window.innerWidth;
  const h = canvas.clientHeight || window.innerHeight;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#030202";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#C9952A";
  ctx.fillRect(game.player.x - 6, game.player.y - 6, 12, 12);
  effectsManager.render(ctx);
  effectsManager.renderPost();
}

function initIntro() {
  document.getElementById("intro-presents")?.classList.add("active");
  setTimeout(() => document.getElementById("intro-signal")?.classList.add("active"), 900);
  setTimeout(() => {
    document.getElementById("intro-logo")?.classList.add("active");
    document.getElementById("logo-img")?.classList.add("revealed");
    document.getElementById("logo-glow")?.classList.add("active");
  }, 1800);
  setTimeout(() => document.getElementById("intro-title")?.classList.add("active"), 2800);
  setTimeout(() => document.getElementById("intro-system")?.classList.add("active"), 3600);
  setTimeout(() => startButton?.classList.add("active"), 4400);
}

window.addEventListener("resize", resizeCanvas);
startButton.addEventListener("click", startGame);
initIntro();
