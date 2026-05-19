class GameStorage {
constructor() { this.p = 'kgn_'; }
_k(k) { return this.p + k; }
getRuns() { return parseInt(localStorage.getItem(this._k('runs')) || '0', 10); }
incrementRuns() { const r = this.getRuns() + 1; localStorage.setItem(this._k('runs'), r.toString()); return r; }
getTotalCorruption() { return parseFloat(localStorage.getItem(this._k('tc')) || '0'); }
addCorruption(v) { const t = this.getTotalCorruption() + v; localStorage.setItem(this._k('tc'), t.toString()); return t; }
saveScore(name, score, depth, corruption, extracted) {
const b = this.getLeaderboard();
b.push({ name, score: Math.floor(score), depth: Math.floor(depth), corruption: Math.floor(corruption * 100), extracted: !!extracted, ts: Date.now() });
b.sort((a, c) => c.score - a.score);
const top = b.slice(0, 10);
localStorage.setItem(this._k('lb'), JSON.stringify(top));
return top;
}
getLeaderboard() { try { return JSON.parse(localStorage.getItem(this._k('lb')) || '[]'); } catch (e) { return []; } }
getPlayerName() { return localStorage.getItem(this._k('pn')) || ''; }
savePlayerName(n) { localStorage.setItem(this._k('pn'), n); }
}
window.gameStorage = new GameStorage();
