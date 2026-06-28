/**
 * THE GILDED NULL
 * Game Engine v2.2
 * 
 * Philosophy:
 * - The corridor is alive
 * - The monster is presence before form
 * - Immersion is everything
 * - Atmosphere > Graphics
 * - Silence is a weapon
 */

class GildedNullGame {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.clientWidth;
        this.height = canvas.clientHeight;
        
        // Set DPR
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = this.width * dpr;
        canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
        
        // Game state
        this.player = { x: this.width / 2, y: this.height - 86, vx: 0, vy: 0, width: 48, height: 54 };
        this.monster = { 
            x: this.width / 2, 
            y: -80, 
            width: 40, 
            height: 60,
            state: 'idle',      // idle, approaching, charging, attacking, retreating
            stateTimer: 0,
            stateMaxTime: 0,
            targetX: this.width / 2,
            eyeGlow: 0,         // 0-1, eye intensity
            psychological: 0,   // 0-1, presence pressure
            hp: 260,
            maxHp: 260,
            hitFlash: 0
        };
        
        // Act system
        if (typeof actSystem !== 'undefined') {
            actSystem.init();
        }
        
        // Game mechanics
        this.score = 0;
        this.distance = 0;
        this.multiplier = 1;
        this.shields = 4;
        this.corruption = 0;
        this.phase = 1;
        this.dashCooldown = 0;
        this.dashDuration = 0;
        this.isDashing = false;
        this.dangerValue = 0;
        this.nearMissWindow = 0;
        this.extractionAvailable = false;
        this.extractionHold = 0;
        
        // Cosmetics
        this.cameraShake = 0;
        this.screenFlash = 0;
        this.vignette = 0;
        this.corridor = {
            depthOffset: 0,
            lightIntensity: 1,
            fogDensity: 0.3
        };
        
        // Gold items
        this.goldItems = [];
        this.particles = [];
        this.bullets = [];
        this.fireCooldown = 0;
        this.muzzleFlash = 0;
        this.killCount = 0;
        
        // Input
        this.keys = {};
        this.mouseDown = false;
        
        // Loop control
        this.running = false;
        this.lastTime = 0;
        this.frameId = null;
    }
    
    // ===== INITIALIZATION =====
    start() {
        this.running = true;
        this.lastTime = performance.now();
        this.loop();
        
        // Setup input
        document.addEventListener('keydown', (e) => this.onKeyDown(e));
        document.addEventListener('keyup', (e) => this.onKeyUp(e));
        document.addEventListener('mousedown', (e) => this.onMouseDown(e));
        document.addEventListener('mouseup', (e) => this.onMouseUp(e));
        
        // Touch for mobile
        this.canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
        this.canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
        this.canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
        
        // Notify audio
        audioManager.onProtocolStart();
    }
    
    stop() {
        this.running = false;
        if (this.frameId) cancelAnimationFrame(this.frameId);
        
        document.removeEventListener('keydown', (e) => this.onKeyDown(e));
        document.removeEventListener('keyup', (e) => this.onKeyUp(e));
        document.removeEventListener('mousedown', (e) => this.onMouseDown(e));
        document.removeEventListener('mouseup', (e) => this.onMouseUp(e));
    }
    
    // ===== MAIN LOOP =====
    loop = () => {
        if (!this.running) return;
        
        // Performance tracking
        if (typeof performanceMonitor !== 'undefined') {
            performanceMonitor.update();
        }
        
        const now = performance.now();
        const dt = Math.min((now - this.lastTime) / 1000, 0.016);
        this.lastTime = now;
        
        this._update(dt);
        this._render();
        
        // Render performance overlay
        if (typeof performanceMonitor !== 'undefined') {
            performanceMonitor.render(this.ctx, this.width, this.height);
        }
        
        this.frameId = requestAnimationFrame(this.loop);
    }
    
    // ===== UPDATE LOGIC =====
    _update(dt) {
        if (this.shields <= 0) {
            this._triggerGameOver();
            return;
        }
        
        // ===== PLAYER =====
        this._updatePlayer(dt);
        
        // ===== ACT SYSTEM (applies difficulty multipliers) =====
        if (typeof actSystem !== 'undefined') {
            actSystem.update(this, dt);
        }
        
        // ===== MONSTER =====
        this._updateMonster(dt);
        this._updateShipWeapons(dt);
        
        // ===== GOLD ITEMS =====
        this._updateGoldItems(dt);
        
        // ===== EXTRACTION =====
        this._updateExtraction(dt);
        
        // ===== TRANSMISSIONS =====
        // Update transmission timer
        this.transmissionTimer = (this.transmissionTimer || 0) + dt;
        if (this.transmissionTimer > (15 + Math.random() * 15)) {
            this.transmissionTimer = 0;
            
            // Get dynamic transmission
            if (typeof transmissionSystem !== 'undefined') {
                const runCount = gameStorage.getRunCount ? gameStorage.getRunCount() : 0;
                const totalCorruption = gameStorage.getTotalCorruption ? gameStorage.getTotalCorruption() : 0;
                
                let transmission = transmissionSystem.getTransmission(this, runCount, totalCorruption);
                
                // Display transmission
                if (transmission && uiManager.showTransmission) {
                    uiManager.showTransmission(transmission);
                }
            }
        }
        
        // ===== ENVIRONMENT =====
        this.distance += dt * 60; // 60 units per second
        const corruptionMult = typeof actSystem !== 'undefined' ? actSystem.getCorruptionRateMult() : 1.0;
        this.corruption = Math.min(1, this.corruption + dt * 0.08 * corruptionMult);
        this.corridor.depthOffset += dt * 30;
        
        // Phase escalation
        let newPhase = Math.min(6, Math.floor((this.distance / 500) + 1));
        if (newPhase !== this.phase) {
            this.phase = newPhase;
            audioManager.onPhaseChange(newPhase);
        }
        
        // ===== V1.5 PSYCHOLOGICAL SYSTEMS =====
        
        // Anomaly engine (corruption manifestations)
        if (typeof anomalyEngine !== 'undefined') {
            anomalyEngine.update(this, dt);
        }
        
        // Psychological presence (hunted feeling)
        if (typeof psychologicalEngine !== 'undefined') {
            if (!this.presenceState) {
                this.presenceState = psychologicalEngine.createPresenceState();
            }
            psychologicalEngine.updatePresence(this, this.presenceState, dt);
        }
        
        // Extraction tension (dilemma)
        if (typeof extractionTension !== 'undefined') {
            if (!this.extractionState) {
                this.extractionState = extractionTension.createExtractionState();
            }
            if (this.extractionAvailable && !this.extractionState.isActive) {
                extractionTension.openExtractionWindow(this, this.extractionState);
            }
            extractionTension.updateTension(this, this.extractionState, dt);
        }
        
        // ===== UI UPDATES =====
        uiManager.updateScore(Math.floor(this.score));
        uiManager.updateDepth(Math.floor(this.distance));
        uiManager.updateMult(this.multiplier.toFixed(1));
        uiManager.updateShields(this.shields);
        uiManager.updateDanger(this.dangerValue);
        uiManager.updateCorruption(this.corruption);
        
        // ===== EFFECTS =====
        effects.update(dt);
        
        // ===== AUDIO =====
        audioManager.updateFrame({
            danger: this.dangerValue,
            corruption: this.corruption,
            phase: this.phase,
            intensity: Math.min(1, this.phase / 6),
            inExtraction: this.extractionAvailable,
            psychologicalPressure: this.presenceState ? this.presenceState.presenceLevel : 0
        });
    }
    
    _updatePlayer(dt) {
        // Movement
        let accel = 0;
        if (this.keys['ArrowLeft'] || this.keys['a']) accel = -1;
        if (this.keys['ArrowRight'] || this.keys['d']) accel = 1;
        
        // Friction + acceleration
        this.player.vx += accel * 800 * dt - this.player.vx * 8 * dt;
        this.player.vx = Math.max(-300, Math.min(300, this.player.vx));
        
        // Update position
        this.player.x += this.player.vx * dt;
        this.player.x = Math.max(30, Math.min(this.width - 30, this.player.x));
        
        // Dash input
        if ((this.keys['Shift'] || this.keys['x'] || this.touchDashing) && !this.isDashing && this.dashCooldown <= 0) {
            this.isDashing = true;
            this.dashDuration = 0.12;
            this.dashCooldown = 0.6;
            audioManager.onDash();
            effects.spawnDashParticles(this.player.x, this.player.y);
            
            // GAME FEEL: Dash feedback
            if (typeof gameFeel !== 'undefined' && gameFeel.dashFeelback) {
                gameFeel.dashFeelback(this.ctx, this.player.x, this.player.y, 0);
            }
        }
        
        // Dash physics
        if (this.isDashing) {
            this.dashDuration -= dt;
            if (this.dashDuration <= 0) {
                this.isDashing = false;
            }
            this.player.y -= dt * 800; // Upward movement during dash
        }
        
        // Cooldown
        if (this.dashCooldown > 0) {
            this.dashCooldown -= dt;
            uiManager.updateDash(1 - this.dashCooldown / 0.6);
        }
        
        // Near miss window
        if (this.nearMissWindow > 0) {
            this.nearMissWindow -= dt;
        }
    }
    
    _updateMonster(dt) {
        // Get act speed multiplier
        const speedMult = typeof actSystem !== 'undefined' ? actSystem.getMonsterSpeedMult() : 1.0;
        const adjustedDt = dt * speedMult;
        
        this.monster.stateTimer += adjustedDt;
        
        // Distance to player
        const dist = Math.hypot(
            this.monster.x - this.player.x,
            this.monster.y - this.player.y
        );
        
        // Danger value (for audio)
        this.dangerValue = Math.max(0, 1 - dist / 300);
        
        // State machine
        switch (this.monster.state) {
            case 'idle':
                // Rare: monster appears, pauses
                this.monster.y += dt * 40;
                if (this.monster.stateTimer > 0.8) {
                    this.monster.state = 'approaching';
                    this.monster.stateTimer = 0;
                }
                break;
                
            case 'approaching':
                // Slowly move down screen
                this.monster.y += adjustedDt * 60;
                this.monster.x += (this.player.x - this.monster.x) * adjustedDt * 0.3;
                
                if (dist < 120 || this.monster.stateTimer > 3) {
                    this.monster.state = 'charging';
                    this.monster.stateTimer = 0;
                    this.monster.eyeGlow = 1;
                    effects.spawnMonsterCharge(this.monster.x, this.monster.y);
                }
                break;
                
            case 'charging':
                // Ring around monster, building tension
                this.monster.x += (this.player.x - this.monster.x) * dt;
                
                if (this.monster.stateTimer > 1.15) {
                    this.monster.state = 'attacking';
                    this.monster.stateTimer = 0;
                    this.monster.y -= 20; // Quick upward motion before attack
                }
                break;
                
            case 'attacking':
                // Fast descent toward player
                this.monster.y += dt * 400;
                this.monster.x += (this.player.x - this.monster.x) * dt * 2;
                
                // Check collision
                if (this._checkMonsterCollision()) {
                    if (!this.isDashing) {
                        this.shields--;
                        audioManager.onDamage(this.shields);
                        effects.spawnHitEffect(this.player.x, this.player.y);
                        this.cameraShake = 0.2;
                        this.screenFlash = 0.3;
                        
                        // GAME FEEL: Monster impact
                        if (typeof gameFeel !== 'undefined' && gameFeel.monsterImpact) {
                            gameFeel.monsterImpact(this);
                        }
                    } else {
                        // Near miss
                        this.nearMissWindow = 0.2;
                        this.multiplier = Math.min(3, this.multiplier + 0.1);
                        this.score += 50 * this.multiplier;
                        audioManager.onNearMiss();
                        effects.spawnNearMiss(this.player.x, this.player.y);
                        
                        // GAME FEEL: Near miss adrenaline
                        if (typeof gameFeel !== 'undefined' && gameFeel.nearMissFeelback) {
                            gameFeel.nearMissFeelback(this);
                        }
                    }
                    
                    this.monster.state = 'retreating';
                    this.monster.stateTimer = 0;
                    this.monster.eyeGlow = 0;
                }
                
                // Auto-retreat after time
                if (this.monster.stateTimer > 2) {
                    this.monster.state = 'retreating';
                    this.monster.stateTimer = 0;
                    this.monster.eyeGlow = 0;
                }
                break;
                
            case 'retreating':
                // Move back up
                this.monster.y -= dt * 200;
                if (this.monster.y < -100) {
                    this._resetMonster();
                }
                break;
        }
        
        // Psychological pressure
        this.monster.psychological = Math.min(1, dist < 200 ? (1 - dist / 200) : 0);
        
        // Environmental reaction to monster
        this.corridor.lightIntensity = 1 - this.monster.psychological * 0.4;
    }
    
    _updateShipWeapons(dt) {
        this.fireCooldown -= dt;
        this.muzzleFlash = Math.max(0, this.muzzleFlash - dt * 8);

        if (this.fireCooldown <= 0) {
            this.fireCooldown = 0.13;
            this.muzzleFlash = 1;
            this.bullets.push({ x: this.player.x - 12, y: this.player.y - 38, vx: -18, vy: -780, life: 0.9, power: 9, age: 0 });
            this.bullets.push({ x: this.player.x + 12, y: this.player.y - 38, vx: 18, vy: -780, life: 0.9, power: 9, age: 0 });
        }

        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const b = this.bullets[i];
            b.age += dt;
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.life -= dt;

            const m = this.monster;
            const hit = b.x > m.x - m.width * 0.85 && b.x < m.x + m.width * 0.85 &&
                b.y > m.y - m.height * 0.8 && b.y < m.y + m.height * 0.9;
            if (hit && m.y > -85) {
                m.hp -= b.power;
                m.hitFlash = 1;
                m.eyeGlow = Math.max(m.eyeGlow, 0.9);
                this.score += 7 * this.multiplier;
                this.cameraShake = Math.max(this.cameraShake, 0.035);
                effects.spawnGoldCollect(b.x, b.y);
                this.bullets.splice(i, 1);
                if (m.hp <= 0) this._destroyMonster();
                continue;
            }

            if (b.life <= 0 || b.y < -40) this.bullets.splice(i, 1);
        }
    }

    _destroyMonster() {
        this.killCount++;
        this.score += 300 * this.multiplier;
        this.multiplier = Math.min(5, this.multiplier + 0.25);
        this.cameraShake = Math.max(this.cameraShake, 0.18);
        this.screenFlash = 0.25;
        effects.spawnHitEffect(this.monster.x, this.monster.y);
        for (let i = 0; i < 18; i++) {
            this.goldItems.push({
                x: this.monster.x + (Math.random() - 0.5) * 90,
                y: this.monster.y + (Math.random() - 0.5) * 50,
                vx: (Math.random() - 0.5) * 180,
                vy: -120 - Math.random() * 120,
                collected: false
            });
        }
        this._resetMonster();
    }

    _resetMonster() {
        this.monster.x = 80 + Math.random() * (this.width - 160);
        this.monster.y = -70;
        this.monster.maxHp = 260 + this.phase * 40;
        this.monster.hp = this.monster.maxHp;
        this.monster.state = 'approaching';
        this.monster.stateTimer = 0;
        this.monster.eyeGlow = 0.35;
        this.monster.hitFlash = 0;
    }
    _updateGoldItems(dt) {
        // Spawn gold
        if (Math.random() < dt * 2) {
            this.goldItems.push({
                x: Math.random() * (this.width - 40) + 20,
                y: -20,
                vx: (Math.random() - 0.5) * 100,
                vy: 0,
                collected: false
            });
        }
        
        // Update gold
        for (let gold of this.goldItems) {
            gold.y += gold.vy * dt + dt * 200; // Gravity
            gold.vy += dt * 400;
            gold.x += gold.vx * dt;
            
            // Collect check
            if (!gold.collected && this._checkGoldCollision(gold)) {
                gold.collected = true;
                this.score += 10 * this.multiplier;
                audioManager.onCollectGold();
                effects.spawnGoldCollect(gold.x, gold.y);
            }
            
            // Remove if below screen
            if (gold.y > this.height + 50) {
                this.goldItems = this.goldItems.filter(g => g !== gold);
            }
        }
    }
    
    _updateExtraction(dt) {
        // Extraction window opens ~every 40-60 seconds
        let extractionTrigger = Math.floor(this.distance / 500) > Math.floor((this.distance - dt * 60) / 500);
        
        if (extractionTrigger && !this.extractionAvailable) {
            this.extractionAvailable = true;
            this.extractionHold = 0;
            audioManager.onExtractionOpen();
            uiManager.showExtraction(true);
        }
        
        // Hold E to extract
        if (this.extractionAvailable) {
            if (this.keys['e'] || this.keys['E']) {
                this.extractionHold = Math.min(1.5, this.extractionHold + dt);
                uiManager.updateExtractionProgress(this.extractionHold / 1.5);
                audioManager.onExtractionProgress(this.extractionHold / 1.5);
                
                // GAME FEEL: Extraction tension feedback
                if (typeof gameFeel !== 'undefined' && gameFeel.extractionTension) {
                    let tension = gameFeel.extractionTension(this.extractionHold / 1.5);
                    if (tension) {
                        this.cameraShake = Math.max(this.cameraShake, tension.screenShake);
                        this.vignette = Math.max(this.vignette, tension.vignette);
                    }
                }
                
                if (this.extractionHold >= 1.5) {
                    this._triggerExtraction();
                }
            } else {
                this.extractionHold = Math.max(0, this.extractionHold - dt * 2); // Decay
                uiManager.updateExtractionProgress(this.extractionHold / 1.5);
            }
        }
    }
    
    // ===== COLLISION =====
    _checkMonsterCollision() {
        return this._aabbCollision(this.player, this.monster);
    }
    
    _checkGoldCollision(gold) {
        return this._aabbCollision(
            this.player,
            { x: gold.x, y: gold.y, width: 12, height: 12 }
        );
    }
    
    _aabbCollision(a, b) {
        return a.x < b.x + b.width &&
               a.x + a.width > b.x &&
               a.y < b.y + b.height &&
               a.y + a.height > b.y;
    }
    
    // ===== EVENTS =====
    _triggerGameOver() {
        this.stop();
        const stats = this.getStats();
        uiManager.showGameOver(stats);
    }
    
    _triggerExtraction() {
        this.stop();
        const stats = this.getStats();
        stats.bonusScore = Math.floor(this.distance * 2);
        stats.totalScore = stats.score + stats.bonusScore;
        uiManager.showExtScreen(stats);
        audioManager.onExtractionSuccess();
    }
    
    getStats() {
        return {
            score: Math.floor(this.score),
            distance: Math.floor(this.distance),
            phase: this.phase,
            corruption: Math.floor(this.corruption * 100),
            shields: this.shields,
            multiplier: this.multiplier.toFixed(1)
        };
    }
    
    // ===== RENDERING =====
    _render() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Apply micro-vibrations from psychological presence
        if (typeof psychologicalEngine !== 'undefined' && this.presenceState) {
            psychologicalEngine.applyMicroVibrations(this.ctx, this.width, this.height, this.presenceState.vibrationStrength);
        }
        
        // ===== CORRIDOR BACKGROUND (ENHANCED) =====
        this._renderCorridorEnhanced();
        
        // ===== PLAYER - RUNNING FIGURE =====
        this._renderCombatShip();
        
        // ===== GOLD ITEMS (GLOWING) =====
        this.ctx.fillStyle = '#FFD700';
        this.ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        this.ctx.shadowBlur = 15;
        for (let gold of this.goldItems) {
            this.ctx.beginPath();
            this.ctx.arc(gold.x, gold.y, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.shadowColor = 'transparent';
        
        // ===== MONSTER - ENHANCED =====
        this._renderBullets();
        this._renderMonsterEnhanced();
        
        // ===== ANOMALY EFFECTS =====
        if (typeof anomalyEngine !== 'undefined') {
            anomalyEngine.renderEcho(this, this.ctx);
            anomalyEngine.renderGhost(this, this.ctx);
        }
        
        // ===== PSYCHOLOGICAL EFFECTS =====
        if (typeof psychologicalEngine !== 'undefined' && this.presenceState) {
            psychologicalEngine.renderBreathingEffect(this.ctx, this.presenceState, this.width, this.height);
            psychologicalEngine.renderDistortion(this.ctx, this.presenceState, this.width, this.height);
            psychologicalEngine.renderDreadIndicator(this.ctx, this.presenceState, this.width, this.height);
            
            // Render monster shadow at periphery
            if (psychologicalEngine.shouldRenderMonsterShadow(this, this.presenceState)) {
                psychologicalEngine.renderMonsterShadow(this.ctx, this);
            }
        }
        
        // ===== EFFECTS LAYER =====
        effects.render(this.ctx);
        effects.renderPost();
        
        // ===== ACT INDICATOR =====
        if (typeof actSystem !== 'undefined') {
            actSystem.renderActIndicator(this.ctx, this.width, this.height, this);
        }
        
        // Restore from micro-vibrations
        if (typeof psychologicalEngine !== 'undefined' && this.presenceState) {
            psychologicalEngine.restoreMicroVibrations(this.ctx);
        }
    }
    
    _renderCorridor() {
        // Perspective lines suggesting infinite depth
        const centerX = this.width / 2;
        const centerY = this.height * 0.7;
        
        this.ctx.strokeStyle = 'rgba(201, 149, 42, 0.08)';
        this.ctx.lineWidth = 1;
        
        // Left wall
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.height);
        this.ctx.lineTo(centerX - 200, centerY);
        this.ctx.stroke();
        
        // Right wall
        this.ctx.beginPath();
        this.ctx.moveTo(this.width, this.height);
        this.ctx.lineTo(centerX + 200, centerY);
        this.ctx.stroke();
        
        // Depth lines
        this.ctx.strokeStyle = 'rgba(201, 149, 42, 0.04)';
        for (let i = 0; i < 10; i++) {
            let depth = (i - (this.corridor.depthOffset % 100)) / 100;
            let scale = 1 - depth;
            if (scale < 0) continue;
            
            let y = centerY + (this.height - centerY) * (1 - scale);
            let width = this.width * scale * 0.8;
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - width / 2, y);
            this.ctx.lineTo(centerX + width / 2, y);
            this.ctx.stroke();
        }
        
        // Fog effect (corruption)
        if (this.corruption > 0.3) {
            this.ctx.fillStyle = `rgba(0, 0, 0, ${this.corruption * 0.2})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }
    }
    
    _renderMonster() {
        const m = this.monster;
        
        // Monster body (silhouette with glow)
        this.ctx.fillStyle = `rgba(30, 20, 10, ${0.7 + m.psychological * 0.3})`;
        this.ctx.fillRect(m.x - m.width / 2, m.y, m.width, m.height);
        
        // Eye glow
        if (m.eyeGlow > 0) {
            this.ctx.fillStyle = `rgba(255, 100, 0, ${m.eyeGlow * 0.8})`;
            this.ctx.beginPath();
            this.ctx.arc(m.x - 8, m.y + 15, 5, 0, Math.PI * 2);
            this.ctx.fill();
            
            this.ctx.beginPath();
            this.ctx.arc(m.x + 8, m.y + 15, 5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // Charging ring
        if (m.state === 'charging') {
            const ringSize = 60 + Math.sin(m.stateTimer * 8) * 10;
            this.ctx.strokeStyle = `rgba(255, 100, 0, ${0.5 - m.stateTimer / 2.3})`;
            this.ctx.lineWidth = 2;
            this.ctx.beginPath();
            this.ctx.arc(m.x, m.y + m.height / 2, ringSize, 0, Math.PI * 2);
            this.ctx.stroke();
        }
    }
    
    // ===== INPUT =====
    onKeyDown(e) { this.keys[e.key] = true; }
    onKeyUp(e) { this.keys[e.key] = false; }
    onMouseDown(e) { this.mouseDown = true; }
    onMouseUp(e) { this.mouseDown = false; }
    
    onTouchStart(e) {
        e.preventDefault();
        if (e.touches.length === 1) {
            this.touchX = e.touches[0].clientX;
            this.touchDashing = false;
        }
    }
    
    onTouchEnd(e) {
        e.preventDefault();
        this.touchDashing = false;
    }
    
    onTouchMove(e) {
        e.preventDefault();
        if (!this.touchX) return;
        
        const newX = e.touches[0].clientX;
        const delta = newX - this.touchX;
        
        if (Math.abs(delta) > 30) {
            if (delta < 0) this.keys['a'] = true;
            if (delta > 0) this.keys['d'] = true;
        }
    }
    
    
    // ===== ENHANCED CORRIDOR =====
    _renderCorridorEnhanced() {
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        
        this.ctx.strokeStyle = 'rgba(201, 149, 42, 0.3)';
        this.ctx.lineWidth = 2;
        
        for (let i = 0; i < 15; i++) {
            let depth = (i - this.corridor.depthOffset % 100) / 100;
            if (depth < 0) depth += 1;
            
            let scale = depth * 0.8 + 0.2;
            let widthAtDepth = this.width * scale * 0.4;
            let heightAtDepth = 20 * scale;
            let yPos = centerY + (depth * this.height * 0.6) - this.height / 4;
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX - widthAtDepth, yPos);
            this.ctx.lineTo(centerX - widthAtDepth, yPos + heightAtDepth);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX + widthAtDepth, yPos);
            this.ctx.lineTo(centerX + widthAtDepth, yPos + heightAtDepth);
            this.ctx.stroke();
        }
        
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(0.5, 'rgba(201, 149, 42, 0.05)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }
    
    _renderBullets() {
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        for (const b of this.bullets) {
            const trail = this.ctx.createLinearGradient(b.x, b.y + 18, b.x, b.y - 18);
            trail.addColorStop(0, 'rgba(0,245,255,0)');
            trail.addColorStop(0.35, 'rgba(0,245,255,0.85)');
            trail.addColorStop(1, 'rgba(255,236,139,0.95)');
            this.ctx.strokeStyle = trail;
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(b.x, b.y + 18);
            this.ctx.lineTo(b.x, b.y - 18);
            this.ctx.stroke();
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(b.x, b.y - 18, 2.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    _renderCombatShip() {
        const x = this.player.x;
        const y = this.player.y;
        const t = performance.now() / 1000;
        this.ctx.save();
        this.ctx.translate(x, y);

        const enginePulse = 0.65 + Math.sin(t * 18) * 0.25;
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.fillStyle = `rgba(0,245,255,${0.18 + enginePulse * 0.14})`;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 10, 38, 52, 0, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.fillStyle = `rgba(255,107,53,${0.55 + enginePulse * 0.25})`;
        this.ctx.beginPath();
        this.ctx.moveTo(-12, 27);
        this.ctx.lineTo(0, 52 + enginePulse * 10);
        this.ctx.lineTo(12, 27);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalCompositeOperation = 'source-over';

        const hull = this.ctx.createLinearGradient(0, -42, 0, 35);
        hull.addColorStop(0, '#FFEC8B');
        hull.addColorStop(0.45, '#FFD700');
        hull.addColorStop(1, '#8B6914');
        this.ctx.fillStyle = hull;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -46);
        this.ctx.lineTo(-27, 18);
        this.ctx.lineTo(-11, 34);
        this.ctx.lineTo(0, 25);
        this.ctx.lineTo(11, 34);
        this.ctx.lineTo(27, 18);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.strokeStyle = 'rgba(255,236,139,0.9)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.fillStyle = '#07131f';
        this.ctx.beginPath();
        this.ctx.moveTo(0, -25);
        this.ctx.lineTo(-9, 2);
        this.ctx.lineTo(9, 2);
        this.ctx.closePath();
        this.ctx.fill();

        this.ctx.fillStyle = '#00F5FF';
        this.ctx.shadowColor = '#00F5FF';
        this.ctx.shadowBlur = 12;
        this.ctx.fillRect(-24, 5, 8, 17);
        this.ctx.fillRect(16, 5, 8, 17);
        if (this.muzzleFlash > 0) {
            this.ctx.fillStyle = `rgba(255,255,255,${this.muzzleFlash})`;
            this.ctx.beginPath();
            this.ctx.arc(-12, -44, 6 + this.muzzleFlash * 10, 0, Math.PI * 2);
            this.ctx.arc(12, -44, 6 + this.muzzleFlash * 10, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.shadowBlur = 0;

        if (this.isDashing) {
            this.ctx.strokeStyle = 'rgba(0,245,255,0.8)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, 42, 58, 0, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }
    _renderPlayerAsRunner() {
        const x = this.player.x;
        const y = this.player.y;
        const size = 12;
        
        const runCycle = (performance.now() % 600) / 600;
        const legOffset = Math.sin(runCycle * Math.PI * 2) * 3;
        const armOffset = Math.sin(runCycle * Math.PI * 2 + Math.PI) * 3;
        
        this.ctx.fillStyle = '#C9952A';
        this.ctx.beginPath();
        this.ctx.arc(x, y - size, size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.fillRect(x - size / 3, y - size, size * 0.66, size * 1.2);
        
        this.ctx.beginPath();
        this.ctx.moveTo(x - size / 4, y);
        this.ctx.lineTo(x - size / 4 + legOffset, y + size);
        this.ctx.strokeStyle = '#C9952A';
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + size / 4, y);
        this.ctx.lineTo(x + size / 4 - legOffset, y + size);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(x - size / 3, y - size / 2);
        this.ctx.lineTo(x - size / 3 - armOffset, y - size / 4);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.moveTo(x + size / 3, y - size / 2);
        this.ctx.lineTo(x + size / 3 + armOffset, y - size / 4);
        this.ctx.stroke();
        
        this.ctx.fillStyle = 'rgba(201, 149, 42, 0.2)';
        this.ctx.beginPath();
        this.ctx.arc(x, y, size + 3, 0, Math.PI * 2);
        this.ctx.fill();
        
        if (this.isDashing) {
            this.ctx.strokeStyle = 'rgba(201, 149, 42, 0.8)';
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.arc(x, y, size + 10, 0, Math.PI * 2);
            this.ctx.stroke();
            
            this.ctx.strokeStyle = 'rgba(201, 149, 42, 0.4)';
            this.ctx.lineWidth = 2;
            for (let i = 1; i <= 3; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(x - size - i * 5, y);
                this.ctx.lineTo(x - size - i * 5 - 8, y);
                this.ctx.stroke();
            }
        }
    }
    
    _renderMonsterEnhanced() {
        const m = this.monster;
        const distToPlayer = Math.hypot(m.x - this.player.x, m.y - this.player.y);
        const threat = Math.max(0, 1 - distToPlayer / 420);
        const size = 44 + threat * 34 + Math.sin(performance.now() / 180) * 3;

        this.ctx.save();
        this.ctx.translate(m.x, m.y);
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.fillStyle = `rgba(255, 68, 170, ${0.12 + threat * 0.16})`;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 4, size * 1.25, size * 1.45, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalCompositeOperation = 'source-over';

        const body = this.ctx.createRadialGradient(0, -10, 4, 0, 0, size);
        body.addColorStop(0, m.hitFlash > 0 ? '#FFFFFF' : '#3b0b45');
        body.addColorStop(0.55, '#16071f');
        body.addColorStop(1, 'rgba(0,0,0,0.9)');
        this.ctx.fillStyle = body;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -size * 0.95);
        this.ctx.bezierCurveTo(-size * 0.9, -size * 0.55, -size * 0.72, size * 0.75, 0, size * 0.95);
        this.ctx.bezierCurveTo(size * 0.72, size * 0.75, size * 0.9, -size * 0.55, 0, -size * 0.95);
        this.ctx.fill();
        this.ctx.strokeStyle = m.hitFlash > 0 ? '#FFFFFF' : 'rgba(255,68,170,0.85)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.strokeStyle = 'rgba(255,68,170,0.55)';
        this.ctx.lineWidth = 4;
        for (let i = -2; i <= 2; i++) {
            if (i === 0) continue;
            this.ctx.beginPath();
            this.ctx.moveTo(i * 12, -4);
            this.ctx.quadraticCurveTo(i * 34, 12 + Math.sin(performance.now() / 160 + i) * 10, i * 24, size * 0.95);
            this.ctx.stroke();
        }

        this.ctx.shadowColor = '#FF6B35';
        this.ctx.shadowBlur = 18;
        this.ctx.fillStyle = `rgba(255,107,53,${0.65 + m.eyeGlow * 0.35})`;
        this.ctx.beginPath();
        this.ctx.ellipse(-size * 0.25, -size * 0.28, size * 0.13, size * 0.08, 0, 0, Math.PI * 2);
        this.ctx.ellipse(size * 0.25, -size * 0.28, size * 0.13, size * 0.08, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;

        const hpR = Math.max(0, m.hp / m.maxHp);
        this.ctx.fillStyle = 'rgba(0,0,0,0.65)';
        this.ctx.fillRect(-42, -size - 18, 84, 5);
        this.ctx.fillStyle = hpR > 0.35 ? '#FF44AA' : '#FF3333';
        this.ctx.fillRect(-42, -size - 18, 84 * hpR, 5);

        if (m.state === 'charging') {
            this.ctx.strokeStyle = 'rgba(255,107,53,0.7)';
            this.ctx.lineWidth = 2;
            const pulseSize = size + Math.sin(performance.now() / 90) * 7;
            this.ctx.beginPath();
            this.ctx.ellipse(0, 0, pulseSize * 1.05, pulseSize * 1.28, 0, 0, Math.PI * 2);
            this.ctx.stroke();
        }
        this.ctx.restore();
    }

    onResize() {
        this.width = this.canvas.clientWidth;
        this.height = this.canvas.clientHeight;
        
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        this.canvas.width = this.width * dpr;
        this.canvas.height = this.height * dpr;
        this.ctx.scale(dpr, dpr);
    }
}




