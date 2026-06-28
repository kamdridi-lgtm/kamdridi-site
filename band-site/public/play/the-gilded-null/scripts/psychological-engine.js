/**
 * PSYCHOLOGICAL PRESENCE ENGINE
 * Makes player feel hunted even when monster is invisible
 * Pressure through absence, not just action
 */

const psychologicalEngine = (() => {
    
    // ===== PRESENCE STATE =====
    const createPresenceState = () => ({
        presenceLevel: 0,      // 0-1, feeling of being watched
        breathingIntensity: 0, // Audio breathing intensity
        vibrationStrength: 0,  // Screen micro-vibrations
        distortionAmount: 0,   // Visual distortion
        dreadBuildup: 0        // Psychological pressure
    });
    
    // ===== UPDATE PRESENCE =====
    const updatePresence = (game, presence, dt) => {
        // Presence based on:
        // - Monster distance (main factor)
        // - Corruption level (intensifies feeling)
        // - Game phase (higher = more oppressive)
        
        const monsterDistance = Math.hypot(
            game.monster.x - game.player.x,
            game.monster.y - game.player.y
        );
        
        // Distance ratio (0 = close, 1 = far)
        const distanceRatio = Math.min(1, monsterDistance / 400);
        
        // Presence calculation
        let basePresence = 1 - distanceRatio;
        let corruptionMultiplier = 1 + game.corruption;
        let phaseMultiplier = game.phase / 6;
        
        presence.presenceLevel = basePresence * corruptionMultiplier * phaseMultiplier;
        presence.presenceLevel = Math.min(1, presence.presenceLevel);
        
        // Breathing intensifies under pressure
        presence.breathingIntensity = presence.presenceLevel * 0.8;
        
        // Micro-vibrations (screen rumble effect)
        presence.vibrationStrength = presence.presenceLevel * 0.3;
        
        // Visual distortion increases with pressure
        presence.distortionAmount = presence.presenceLevel * 0.4;
        
        // Dread buildup (slow accumulation)
        presence.dreadBuildup += dt * presence.presenceLevel * 0.1;
        presence.dreadBuildup = Math.min(1, presence.dreadBuildup);
        
        // Audio feedback
        audioManager.updateFrame({
            danger: presence.presenceLevel,
            corruption: game.corruption,
            psychologicalPressure: presence.presenceLevel
        });
    };
    
    // ===== PRESENCE MANIFESTATIONS =====
    
    // Subtle floor vibrations
    const applyMicroVibrations = (ctx, width, height, vibration) => {
        if (vibration < 0.05) return;
        
        // Small random offset
        ctx.save();
        ctx.translate(
            (Math.random() - 0.5) * vibration * 3,
            (Math.random() - 0.5) * vibration * 3
        );
    };
    
    const restoreMicroVibrations = (ctx) => {
        ctx.restore();
    };
    
    // Breathing visualization (subtle)
    const renderBreathingEffect = (ctx, presence, width, height) => {
        if (presence.breathingIntensity < 0.1) return;
        
        // Pulsing overlay indicating breathing
        const breathePhase = Math.sin(performance.now() / 1000 * 2) * 0.5 + 0.5;
        const intensity = presence.breathingIntensity * breathePhase * 0.05;
        
        ctx.fillStyle = `rgba(0, 0, 0, ${intensity})`;
        ctx.fillRect(0, 0, width, height);
    };
    
    // Distortion effect (chromatic aberration style)
    const renderDistortion = (ctx, presence, width, height) => {
        if (presence.distortionAmount < 0.05) return;
        
        const amount = presence.distortionAmount * 2;
        
        // Red channel shift
        ctx.globalCompositeOperation = 'multiply';
        ctx.fillStyle = `rgba(255, 0, 0, ${amount * 0.1})`;
        ctx.fillRect(-amount, -amount, width + amount * 2, height + amount * 2);
        
        ctx.globalCompositeOperation = 'source-over';
    };
    
    // Dread visual indicator (subtle color shift)
    const renderDreadIndicator = (ctx, presence, width, height) => {
        if (presence.dreadBuildup < 0.1) return;
        
        // Warmer color shift as dread builds
        const warmth = presence.dreadBuildup * 0.15;
        ctx.fillStyle = `rgba(255, ${100 * (1 - warmth)}, 0, ${warmth * 0.08})`;
        ctx.fillRect(0, 0, width, height);
    };
    
    // ===== AUDIO BREATHING CONTROL =====
    const updateBreathingAudio = (presence, audioContext) => {
        // Breathing layer responds to presence
        if (window.audioManager) {
            audioManager.updateFrame({
                breathingLevel: presence.breathingIntensity
            });
        }
    };
    
    // ===== FALSE SOUNDS =====
    const triggerFalseSound = (game, presence) => {
        // Occasionally player hears phantom sounds
        if (presence.presenceLevel > 0.6 && Math.random() < 0.05) {
            // Could be a phantom footstep, breathing, impact
            const soundType = Math.random();
            
            if (soundType < 0.4) {
                // Breathing sound
                audioManager.onAnomaly('phantom-breath');
            } else if (soundType < 0.7) {
                // Distant impact
                audioManager.onAnomaly('phantom-impact');
            } else {
                // Movement sound
                audioManager.onAnomaly('phantom-move');
            }
        }
    };
    
    // ===== CORNER OF EYE EFFECT =====
    const shouldRenderMonsterShadow = (game, presence) => {
        // Monster shadow appears in periphery when presence is high
        return presence.presenceLevel > 0.5 && Math.random() < 0.02;
    };
    
    const renderMonsterShadow = (ctx, game) => {
        // Quick shadow at edge of screen
        const side = Math.random() > 0.5 ? -40 : game.width + 40;
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = 'rgba(30, 20, 10, 0.8)';
        ctx.fillRect(side, game.height / 2 - 30, 40, 60);
        ctx.globalAlpha = 1;
    };
    
    // ===== PUBLIC API =====
    return {
        createPresenceState,
        updatePresence,
        applyMicroVibrations,
        restoreMicroVibrations,
        renderBreathingEffect,
        renderDistortion,
        renderDreadIndicator,
        updateBreathingAudio,
        triggerFalseSound,
        shouldRenderMonsterShadow,
        renderMonsterShadow
    };
})();
