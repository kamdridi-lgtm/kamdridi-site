/**
 * ACT SYSTEM
 * Three-act structure with escalating difficulty and atmospheric transitions
 */

const actSystem = (() => {
    let currentAct = 1;
    let actStartTime = 0;
    let warMachineAudio = null;
    let warMachineLoaded = false;
    
    // ===== ACT DEFINITIONS =====
    const acts = {
        1: {
            name: 'PROTOCOL INITIALIZATION',
            duration: 300, // 5 minutes
            monsterSpeedMult: 1.0,
            goldSpawnMult: 1.0,
            corruptionRateMult: 1.0,
            anomalyChanceMult: 1.0,
            difficultyColor: 'rgba(201, 149, 42, 0.3)',
            message: 'THREAT DETECTED',
            music: 'synthesis'
        },
        2: {
            name: 'WAR MACHINE',
            duration: 300, // 5 minutes
            monsterSpeedMult: 1.5,
            goldSpawnMult: 1.2,
            corruptionRateMult: 1.3,
            anomalyChanceMult: 1.5,
            difficultyColor: 'rgba(255, 100, 0, 0.5)',
            message: 'THREAT CRITICAL',
            music: 'war-machine.mp3'
        },
        3: {
            name: 'ENDGAME',
            duration: Infinity,
            monsterSpeedMult: 2.0,
            goldSpawnMult: 1.5,
            corruptionRateMult: 1.8,
            anomalyChanceMult: 2.0,
            difficultyColor: 'rgba(255, 50, 0, 0.8)',
            message: 'EXTINCTION PROTOCOL',
            music: 'war-machine.mp3'
        }
    };
    
    // ===== INIT =====
    const init = () => {
        // Pre-load War Machine audio
        const audio = new Audio('assets/audio/war-machine.mp3');
        audio.preload = 'auto';
        audio.loop = true;
        audio.volume = 0.3;
        warMachineAudio = audio;
        
        // Try to load (may fail due to CORS, that's ok)
        audio.addEventListener('canplay', () => {
            warMachineLoaded = true;
            console.log('War Machine audio loaded');
        });
        
        audio.addEventListener('error', () => {
            console.log('War Machine audio failed to load (CORS or missing)');
        });
        
        actStartTime = performance.now() / 1000;
    };
    
    // ===== UPDATE =====
    const update = (game, dt) => {
        const timeInGame = game.distance / 60; // Convert to seconds
        const newAct = getActAtTime(timeInGame);
        
        if (newAct !== currentAct) {
            transitionToAct(newAct);
        }
        
        // Apply act modifiers
        const act = acts[currentAct];
        game.monsterSpeedMult = act.monsterSpeedMult;
        game.goldSpawnMult = act.goldSpawnMult;
        game.corruptionRateMult = act.corruptionRateMult;
        game.anomalyChanceMult = act.anomalyChanceMult;
    };
    
    // ===== GET ACT AT TIME =====
    const getActAtTime = (seconds) => {
        if (seconds < acts[1].duration) return 1;
        if (seconds < acts[1].duration + acts[2].duration) return 2;
        return 3;
    };
    
    // ===== TRANSITION TO ACT =====
    const transitionToAct = (newAct) => {
        currentAct = newAct;
        const act = acts[currentAct];
        
        console.log(`=== ACT ${currentAct}: ${act.name} ===`);
        
        // Handle music transition
        if (currentAct >= 2 && warMachineLoaded) {
            // Fade out synthesis, start War Machine
            if (typeof audioManager !== 'undefined' && audioManager.fadeOutSynthesis) {
                audioManager.fadeOutSynthesis();
            }
            
            // Start War Machine
            if (warMachineAudio && !warMachineAudio.playing) {
                warMachineAudio.play().catch(() => {
                    console.log('War Machine autoplay blocked');
                });
            }
        }
        
        // Visual indication
        if (typeof uiManager !== 'undefined' && uiManager.showWarning) {
            uiManager.showWarning(`ACT ${currentAct}: ${act.name}`);
        }
    };
    
    // ===== GET CURRENT ACT =====
    const getCurrentAct = () => acts[currentAct];
    
    const getActMultiplier = (stat) => {
        const act = acts[currentAct];
        return act[stat + 'Mult'] || 1.0;
    };
    
    // ===== RENDER OVERLAY =====
    const renderActIndicator = (ctx, width, height, game) => {
        const act = acts[currentAct];
        const timeInAct = (game.distance / 60) % acts[currentAct].duration;
        const actProgress = timeInAct / acts[currentAct].duration;
        
        // Act name (top-right)
        ctx.fillStyle = act.difficultyColor;
        ctx.font = 'bold 12px "Share Tech Mono"';
        ctx.fillText(`ACT ${currentAct}: ${act.name}`, width - 250, 40);
        
        // Act progress bar
        ctx.strokeStyle = act.difficultyColor;
        ctx.lineWidth = 2;
        ctx.strokeRect(width - 250, 50, 200, 8);
        
        ctx.fillStyle = act.difficultyColor;
        ctx.fillRect(width - 250, 50, 200 * actProgress, 8);
    };
    
    // ===== DIFFICULTY GETTERS =====
    const getMonsterSpeedMult = () => acts[currentAct].monsterSpeedMult;
    const getGoldSpawnMult = () => acts[currentAct].goldSpawnMult;
    const getCorruptionRateMult = () => acts[currentAct].corruptionRateMult;
    const getAnomalyChanceMult = () => acts[currentAct].anomalyChanceMult;
    
    // ===== PUBLIC API =====
    return {
        init,
        update,
        getCurrentAct,
        getActAtTime,
        getMonsterSpeedMult,
        getGoldSpawnMult,
        getCorruptionRateMult,
        getAnomalyChanceMult,
        renderActIndicator,
        getCurrentActNumber: () => currentAct
    };
})();
