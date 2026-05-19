class GildedNullGame {
  constructor() {
    this.score = 0;
    this.dangerLevel = 0;
    this.depth = 0;
    this.running = true;

    this.player = {
      x: 300,
      y: 400
    };

    this.monster = {
      distance: 1
    };
  }

  update(delta) {
    if (!this.running) return;
    this.score += delta * 10;
    this.depth += delta * 6;
    this.dangerLevel += delta * 0.02;
    this.dangerLevel = Math.min(1, this.dangerLevel);

    audioManager.updateGameplay({
      dangerLevel: this.dangerLevel
    });

    uiManager.update({
      score: Math.floor(this.score),
      dangerLevel: this.dangerLevel,
      depth: this.depth,
      mult: 1
    });

    if (this.dangerLevel >= 1) {
      this.running = false;
      audioManager.onGameOver();
      uiManager.showGameOver(this.score);
    }
  }

  collectGold() {
    this.score += 100;
    audioManager.onCollectGold();
    effectsManager.spawnGold(this.player.x, this.player.y);
  }

  damage() {
    audioManager.onDamage();
    effectsManager.damageShake();
  }
}

window.GildedNullGame = GildedNullGame;
