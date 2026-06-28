# KAMDRIDI ACT II - WAR MACHINES Web Prototype

HTML5 Canvas / Vanilla JS prototype deployed through the Next.js site.

## Files

```txt
app/games/war-machines/page.tsx
public/games/war-machines/engine.js
public/games/war-machines/boss.js
public/games/war-machines/rhythm.js
public/games/war-machines/hud.js
public/games/war-machines/README.md
```

## Mechanics

- Runner movement: `A/D`, arrow keys, mobile drag
- Dash: `Space`
- Fire: left click, tap, `J`, or `Enter`
- Reload: `R`
- Rhythm: Web Audio kick at 120 BPM
- Sync window: +/- 120ms
- On-beat shot: x2-style damage and combo increment
- Off-beat shot: normal damage and combo reset
- Orbs: gold pickups grant +5 ammo
- Boss K-01:
  - Phase 1: cannon fire
  - Phase 2: missiles and faster pressure
  - Phase 3: berserk volleys
  - orange reactor weak point increases damage

## Vercel

Build:

```bash
npm run build
```

Deploy:

```bash
npx vercel deploy --prod --yes --scope kam-dridis-projects
```

Production route:

```txt
https://kamdridi.com/games/war-machines
```

## Notes

This is the web vertical slice while the Unreal Engine 5.4 build waits for disk space. The module boundaries mirror the UE design:

- `rhythm.js` ~= `KRhythmManagerComponent`
- `boss.js` ~= `KWarMachineBoss`
- `hud.js` ~= `KHUDManager`
- `engine.js` ~= runner, weapon, orb system and game flow combined

Keep this dependency-free. Use Canvas 2D, requestAnimationFrame, transforms/opacity-style rendering, and simple arrays for runtime entities.
