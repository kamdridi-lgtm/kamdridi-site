/**
 * ANOMALY ENGINE
 * Corridor corruption manifestations
 * Reality breaks down as corruption rises
 */

const anomalyEngine = (() => {
    let activeAnomalies = [];
    let anomalyTimer = 0;
    let anomalyChance = 0;
    
    // ===== ANOMALY TYPES =====
    const anomalyTypes = {
        // Type 1: BLACKOUT
        blackout: {
            name: 'blackout',
            weight: 0.2,
            duration: 2,
            trigger: (game) => {
                game.corridor.lightIntensity = 0.1;
                audioManager.onBlackout(true);
                uiManager.showWarning('SIGNAL LOST');
            },
            update: (game, elapsed) => {
                game.corridor.lightIntensity = 0.1 + Math.sin(elapsed * 8) * 0.05;
            },
            end: (game) => {
                game.corridor.lightIntensity = 1;
                audioManager.onBlackout(false);
            }
        },
        
        // Type 2: GOLD FEVER
        goldfever: {
            name: 'goldfever',
            weight: 0.25,
            duration: 3,
            trigger: (game) => {
                audioManager.onAnomaly('goldfever');
                uiManager.showWarning('ARCHIVE RESONANCE');
            },
            update: (game, elapsed) => {
                // Spawn extra gold
                if (Math.random() < 0.5) {
                    game.goldItems.push({
                        x: Math.random() * game.width,
                        y: -20,
                        vx: (Math.random() - 0.5) * 150,
                        vy: 0,
                        collected: false
                    });
                }
            },
            end: (game) => {
                // Return to normal
            }
        },
        
        // Type 3: ECHO
        echo: {
            name: 'echo',
            weight: 0.15,
            duration: 4,
            trigger: (game) => {
                audioManager.onAnomaly('echo');
                uiManager.showWarning('CORRIDOR ECHO');
            },
            update: (game, elapsed) => {
                // Monster appears in two places (visual echo)
                game.monsterEcho = {
                    x: game.monster.x + Math.sin(elapsed * 3) * 50,
                    y: game.monster.y + Math.cos(elapsed * 4) * 30,
                    opacity: Math.sin(elapsed * 6) * 0.3 + 0.2
                };
            },
            end: (game) => {
                game.monsterEcho = null;
            }
        },
        
        // Type 4: GHOST
        ghost: {
            name: 'ghost',
            weight: 0.15,
            duration: 3,
            trigger: (game) => {
                audioManager.onAnomaly('ghost');
                uiManager.showWarning('PHANTOM DETECTED');
            },
            update: (game, elapsed) => {
                // Player becomes partially invisible
                game.playerGhost = 0.5 + Math.sin(elapsed * 5) * 0.3;
            },
            end: (game) => {
                game.playerGhost = 1;
            }
        },
        
        // Type 5: FALSE EXTRACTION
        falseext: {
            name: 'falseext',
            weight: 0.25,
            duration: 2,
            trigger: (game) => {
                audioManager.onAnomaly('falseext');
                uiManager.showWarning('FALSE PROTOCOL');
                game.falseExtractionActive = true;
            },
            update: (game, elapsed) => {
                // Extraction appears but is fake
                if (game.falseExtractionActive) {
                    game.extractionAvailable = true;
                }
            },
            end: (game) => {
                game.falseExtractionActive = false;
                // Reset extraction if player didn't complete it
            }
        }
    };
    
    // ===== UPDATE =====
    const update = (game, dt) => {
        anomalyTimer += dt;
        
        // Anomaly chance increases with corruption
        anomalyChance = game.corruption * 0.5;
        
        // Check if new anomaly should trigger
        if (activeAnomalies.length === 0 && Math.random() < anomalyChance * dt) {
            triggerRandomAnomaly(game);
        }
        
        // Update active anomalies
        for (let i = activeAnomalies.length - 1; i >= 0; i--) {
            let anomaly = activeAnomalies[i];
            anomaly.elapsed += dt;
            
            // Call update function
            if (anomalyTypes[anomaly.type].update) {
                anomalyTypes[anomaly.type].update(game, anomaly.elapsed);
            }
            
            // Check if done
            if (anomaly.elapsed >= anomalyTypes[anomaly.type].duration) {
                if (anomalyTypes[anomaly.type].end) {
                    anomalyTypes[anomaly.type].end(game);
                }
                activeAnomalies.splice(i, 1);
            }
        }
    };
    
    // ===== TRIGGER =====
    const triggerRandomAnomaly = (game) => {
        // Weight-based selection
        let types = Object.keys(anomalyTypes);
        let weights = types.map(t => anomalyTypes[t].weight);
        let total = weights.reduce((a, b) => a + b, 0);
        
        let roll = Math.random() * total;
        let cumulative = 0;
        
        for (let i = 0; i < types.length; i++) {
            cumulative += weights[i];
            if (roll <= cumulative) {
                triggerAnomaly(game, types[i]);
                return;
            }
        }
    };
    
    const triggerAnomaly = (game, type) => {
        if (!anomalyTypes[type]) return;
        
        let anomaly = {
            type,
            elapsed: 0,
            startTime: performance.now()
        };
        
        activeAnomalies.push(anomaly);
        
        // Call trigger function
        anomalyTypes[type].trigger(game);
    };
    
    // ===== RENDER ECHO =====
    const renderEcho = (game, ctx) => {
        if (!game.monsterEcho) return;
        
        const m = game.monsterEcho;
        ctx.globalAlpha = m.opacity;
        ctx.fillStyle = 'rgba(30, 20, 10, 0.5)';
        ctx.fillRect(m.x - 20, m.y, 40, 60);
        ctx.globalAlpha = 1;
    };
    
    // ===== RENDER GHOST =====
    const renderGhost = (game, ctx) => {
        if (!game.playerGhost || game.playerGhost >= 0.99) return;
        
        ctx.globalAlpha = 1 - game.playerGhost;
        ctx.fillStyle = 'rgba(201, 149, 42, 0.3)';
        ctx.fillRect(
            game.player.x - game.player.width / 2,
            game.player.y - game.player.height / 2,
            game.player.width,
            game.player.height
        );
        ctx.globalAlpha = 1;
    };
    
    // ===== PUBLIC API =====
    return {
        update,
        triggerAnomaly,
        triggerRandomAnomaly,
        renderEcho,
        renderGhost,
        getActiveAnomalies: () => activeAnomalies,
        isAnomalyActive: (type) => activeAnomalies.some(a => a.type === type)
    };
})();
