/**
 * KAMDRIDI — VISUAL EFFECTS ENGINE
 * Particle system, screen effects, atmospheric feedback
 */

const effects = (() => {
    let fxCanvas = null;
    let fxCtx = null;
    let dpr = 1;
    
    let particles = [];
    let shakeAmount = 0;
    let flashAmount = 0;
    let vignetteAmount = 0;
    let corruptionGlitch = 0;
    
    // ===== INIT =====
    const initFX = () => {
        fxCanvas = document.getElementById('fx-canvas');
        if (!fxCanvas) return;
        
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        let w = fxCanvas.clientWidth;
        let h = fxCanvas.clientHeight;
        
        if (w === 0 || h === 0) {
            fxCtx = null;
            return;
        }
        
        fxCanvas.width = w * dpr;
        fxCanvas.height = h * dpr;
        fxCtx = fxCanvas.getContext('2d');
        fxCtx.scale(dpr, dpr);
        
        // Set blend mode for additive effect
        fxCanvas.style.mixBlendMode = 'screen';
    };
    
    // ===== UPDATE =====
    const update = (dt) => {
        // Decay effects
        shakeAmount *= Math.exp(-8 * dt);
        flashAmount *= Math.exp(-6 * dt);
        vignetteAmount *= Math.exp(-4 * dt);
        corruptionGlitch = Math.max(0, corruptionGlitch - dt * 0.5);
        
        // Update particles
        for (let i = particles.length - 1; i >= 0; i--) {
            let p = particles[i];
            
            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += p.gravity * dt;
            p.life -= dt;
            p.opacity = p.life / p.maxLife;
            
            if (p.life <= 0) {
                particles.splice(i, 1);
            }
        }
    };
    
    // ===== RENDER =====
    const render = (ctx) => {
        if (!fxCtx) return;
        
        // Clear FX canvas
        fxCtx.clearRect(0, 0, fxCanvas.clientWidth, fxCanvas.clientHeight);
        
        // Draw particles
        for (let p of particles) {
            fxCtx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.opacity * p.maxOpacity})`;
            fxCtx.beginPath();
            fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            fxCtx.fill();
        }
    };
    
    // ===== POST-PROCESSING =====
    const renderPost = () => {
        if (!fxCtx) return;
        
        const w = fxCanvas.clientWidth;
        const h = fxCanvas.clientHeight;
        if (w === 0 || h === 0) return;
        
        // Screen shake
        if (shakeAmount > 0.01) {
            fxCtx.save();
            fxCtx.translate(
                (Math.random() - 0.5) * shakeAmount * 6,
                (Math.random() - 0.5) * shakeAmount * 6
            );
        }
        
        // Flash (white overlay)
        if (flashAmount > 0.01) {
            fxCtx.fillStyle = `rgba(255, 255, 255, ${flashAmount * 0.3})`;
            fxCtx.fillRect(0, 0, w, h);
        }
        
        // Vignette (darkness at edges)
        if (vignetteAmount > 0.01) {
            let gradient = fxCtx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w);
            gradient.addColorStop(0, `rgba(0, 0, 0, 0)`);
            gradient.addColorStop(1, `rgba(0, 0, 0, ${vignetteAmount * 0.5})`);
            fxCtx.fillStyle = gradient;
            fxCtx.fillRect(0, 0, w, h);
        }
        
        // Corruption glitch effect
        if (corruptionGlitch > 0.01) {
            const glitchStrength = corruptionGlitch * 4;
            fxCtx.globalAlpha = corruptionGlitch * 0.15;
            
            // Random horizontal lines
            for (let i = 0; i < 5; i++) {
                let y = Math.random() * h;
                let shiftX = (Math.random() - 0.5) * glitchStrength * 20;
                fxCtx.fillStyle = `rgba(255, 100, 0, 0.3)`;
                fxCtx.fillRect(0 + shiftX, y, w, Math.random() * 2 + 1);
            }
            
            fxCtx.globalAlpha = 1;
        }
        
        if (shakeAmount > 0.01) {
            fxCtx.restore();
        }
    };
    
    // ===== SPAWN FUNCTIONS =====
    const spawnParticle = (x, y, vx, vy, life, size, r, g, b, gravity = 0) => {
        particles.push({
            x, y, vx, vy, life, maxLife: life, size,
            r, g, b, opacity: 1, maxOpacity: 1,
            gravity
        });
    };
    
    const spawnDashParticles = (x, y) => {
        for (let i = 0; i < 12; i++) {
            let angle = (i / 12) * Math.PI * 2;
            let speed = 200;
            spawnParticle(
                x, y,
                Math.cos(angle) * speed, Math.sin(angle) * speed,
                0.4, 2,
                201, 149, 42, // Gold
                -100
            );
        }
        shakeAmount = 0.1;
    };
    
    const spawnHitEffect = (x, y) => {
        for (let i = 0; i < 20; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = 150 + Math.random() * 150;
            spawnParticle(
                x, y,
                Math.cos(angle) * speed, Math.sin(angle) * speed,
                0.6, 2,
                255, 100, 0, // Orange
                100
            );
        }
        flashAmount = 0.4;
        shakeAmount = 0.3;
        vignetteAmount = 0.5;
    };
    
    const spawnMonsterCharge = (x, y) => {
        for (let i = 0; i < 8; i++) {
            let angle = (i / 8) * Math.PI * 2;
            spawnParticle(
                x, y,
                Math.cos(angle) * 100, Math.sin(angle) * 100,
                0.3, 1.5,
                255, 100, 0,
                0
            );
        }
    };
    
    const spawnGoldCollect = (x, y) => {
        for (let i = 0; i < 16; i++) {
            let angle = (i / 16) * Math.PI * 2;
            spawnParticle(
                x, y,
                Math.cos(angle) * 250, Math.sin(angle) * 250,
                0.4, 2.5,
                245, 223, 160, // Gold light
                -50
            );
        }
    };
    
    const spawnNearMiss = (x, y) => {
        // Quick pulse
        for (let i = 0; i < 6; i++) {
            let angle = (i / 6) * Math.PI * 2;
            spawnParticle(
                x, y,
                Math.cos(angle) * 200, Math.sin(angle) * 200,
                0.2, 3,
                201, 149, 42,
                0
            );
        }
        shakeAmount = 0.15;
    };
    
    const spawnShieldBreak = (x, y) => {
        for (let i = 0; i < 12; i++) {
            let angle = Math.random() * Math.PI * 2;
            spawnParticle(
                x, y,
                Math.cos(angle) * 300, Math.sin(angle) * 300,
                0.3, 2,
                255, 100, 0,
                50
            );
        }
        corruptionGlitch = 1;
    };
    
    const spawnCorruptionGlitch = () => {
        corruptionGlitch = 0.8;
        shakeAmount = 0.2;
    };
    
    const spawnSmoke = (x, y) => {
        for (let i = 0; i < 4; i++) {
            spawnParticle(
                x, y,
                (Math.random() - 0.5) * 100, Math.random() * -50 - 100,
                0.8, 5 + Math.random() * 5,
                100, 100, 100,
                -20
            );
        }
    };
    
    const spawnDust = (x, y) => {
        for (let i = 0; i < 3; i++) {
            spawnParticle(
                x, y,
                (Math.random() - 0.5) * 50, Math.random() * -30,
                1.2, 1.5,
                150, 140, 120,
                -10
            );
        }
    };
    
    // ===== PUBLIC API =====
    return {
        initFX,
        update,
        render,
        renderPost,
        getShake: () => shakeAmount,
        getFlash: () => flashAmount,
        spawnDashParticles,
        spawnHitEffect,
        spawnMonsterCharge,
        spawnGoldCollect,
        spawnNearMiss,
        spawnShieldBreak,
        spawnCorruptionGlitch,
        spawnSmoke,
        spawnDust
    };
})();
