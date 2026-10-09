/**
 * GAME FEEL ENHANCEMENTS
 * Visceral feedback, screen shake, impact response
 */

const gameFeel = {
    // ===== DASH IMPACT =====
    dashFeelback: (ctx, playerX, playerY, dashProgress) => {
        // Visual dash trail
        ctx.strokeStyle = `rgba(201, 149, 42, ${0.3 * (1 - dashProgress)})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(playerX, playerY, 20 + dashProgress * 30, 0, Math.PI * 2);
        ctx.stroke();
    },
    
    // ===== NEAR MISS ADRENALINE =====
    nearMissFeelback: (game) => {
        // Screen intensity increases
        game.screenFlash = 0.2;
        game.cameraShake = 0.25;
        
        // Audio spike
        audioManager.onNearMiss();
        
        // Visual feedback
        effects.spawnNearMiss(game.player.x, game.player.y);
    },
    
    // ===== MONSTER ATTACK IMPACT =====
    monsterImpact: (game) => {
        // Heavy shake
        game.cameraShake = 0.35;
        game.screenFlash = 0.4;
        
        // Red tint vignette
        game.vignette = 0.6;
        
        // Audio thump
        audioManager.onDamage(game.shields);
        
        // Particle burst
        effects.spawnHitEffect(game.player.x, game.player.y);
    },
    
    // ===== EXTRACTION TENSION =====
    extractionTension: (progress) => {
        // 0-1 progression
        // Audio gets tighter
        audioManager.onExtractionProgress(progress);
        
        // Visual increase in intensity
        return {
            vignette: progress * 0.3,
            screenShake: progress * 0.1
        };
    },
    
    // ===== CORRUPTION VISUAL DISTORTION =====
    corruptionDistort: (corruption, ctx, width, height) => {
        if (corruption < 0.4) return;
        
        // Glitch lines increase with corruption
        ctx.globalAlpha = (corruption - 0.4) * 0.2;
        for (let i = 0; i < 8; i++) {
            let y = Math.random() * height;
            let glitchX = (Math.random() - 0.5) * corruption * 40;
            ctx.fillStyle = 'rgba(255, 100, 0, 0.5)';
            ctx.fillRect(glitchX, y, width, 2);
        }
        ctx.globalAlpha = 1;
    }
};
