/**
 * UI MANAGER
 * HUD, settings, game over screens
 */

const uiManager = (() => {
    let settingsOpen = false;
    
    const init = () => {
        setupSettingsMenu();
    };
    
    // ===== SETTINGS MENU =====
    const setupSettingsMenu = () => {
        // Create settings overlay if not exists
        if (!document.getElementById('settings-overlay')) {
            const overlay = document.createElement('div');
            overlay.id = 'settings-overlay';
            overlay.className = 'hidden';
            overlay.innerHTML = `
                <div class="settings-panel">
                    <div class="settings-title">SYSTEM SETTINGS</div>
                    
                    <div class="settings-group">
                        <label>Master Volume</label>
                        <input type="range" id="vol-master" min="0" max="100" value="40" class="slider">
                        <span id="vol-master-val">40%</span>
                    </div>
                    
                    <div class="settings-group">
                        <label>Music Volume</label>
                        <input type="range" id="vol-music" min="0" max="100" value="60" class="slider">
                        <span id="vol-music-val">60%</span>
                    </div>
                    
                    <div class="settings-group">
                        <label>SFX Volume</label>
                        <input type="range" id="vol-sfx" min="0" max="100" value="80" class="slider">
                        <span id="vol-sfx-val">80%</span>
                    </div>
                    
                    <div class="settings-group">
                        <label>Visual FX Quality</label>
                        <select id="fx-quality" class="dropdown">
                            <option value="low">Low (better performance)</option>
                            <option value="medium" selected>Medium</option>
                            <option value="high">High</option>
                        </select>
                    </div>
                    
                    <div class="settings-group checkbox">
                        <input type="checkbox" id="screen-shake" checked>
                        <label>Screen Shake</label>
                    </div>
                    
                    <div class="settings-group checkbox">
                        <input type="checkbox" id="fullscreen-toggle">
                        <label>Fullscreen Mode</label>
                    </div>
                    
                    <div class="settings-divider"></div>
                    
                    <div class="settings-group">
                        <button id="btn-reset-saves" class="settings-btn danger">RESET SAVE DATA</button>
                    </div>
                    
                    <button id="btn-close-settings" class="settings-btn">CLOSE SETTINGS</button>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        
        // Wire up controls
        const masterVol = document.getElementById('vol-master');
        const musicVol = document.getElementById('vol-music');
        const sfxVol = document.getElementById('vol-sfx');
        const fxQuality = document.getElementById('fx-quality');
        const screenShake = document.getElementById('screen-shake');
        const fullscreenToggle = document.getElementById('fullscreen-toggle');
        const resetBtn = document.getElementById('btn-reset-saves');
        const closeBtn = document.getElementById('btn-close-settings');
        
        if (masterVol) {
            masterVol.addEventListener('input', (e) => {
                document.getElementById('vol-master-val').textContent = e.target.value + '%';
                gameStorage.setSetting('masterVolume', parseInt(e.target.value));
            });
        }
        
        if (musicVol) {
            musicVol.addEventListener('input', (e) => {
                document.getElementById('vol-music-val').textContent = e.target.value + '%';
                gameStorage.setSetting('musicVolume', parseInt(e.target.value));
            });
        }
        
        if (sfxVol) {
            sfxVol.addEventListener('input', (e) => {
                document.getElementById('vol-sfx-val').textContent = e.target.value + '%';
                gameStorage.setSetting('sfxVolume', parseInt(e.target.value));
            });
        }
        
        if (fxQuality) {
            fxQuality.addEventListener('change', (e) => {
                gameStorage.setSetting('fxQuality', e.target.value);
            });
        }
        
        if (screenShake) {
            screenShake.addEventListener('change', (e) => {
                gameStorage.setSetting('screenShake', e.target.checked);
            });
        }
        
        if (fullscreenToggle) {
            fullscreenToggle.addEventListener('change', (e) => {
                if (e.target.checked) {
                    document.documentElement.requestFullscreen().catch(() => {});
                } else {
                    document.exitFullscreen().catch(() => {});
                }
            });
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Really reset all save data? This cannot be undone.')) {
                    gameStorage.resetAll();
                    closeSettings();
                    alert('Save data cleared.');
                }
            });
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSettings);
        }
        
        // Load settings
        const masterVal = gameStorage.getSetting('masterVolume', 40);
        const musicVal = gameStorage.getSetting('musicVolume', 60);
        const sfxVal = gameStorage.getSetting('sfxVolume', 80);
        const fxQualityVal = gameStorage.getSetting('fxQuality', 'medium');
        const shakeVal = gameStorage.getSetting('screenShake', true);
        
        if (masterVol) masterVol.value = masterVal;
        if (musicVol) musicVol.value = musicVal;
        if (sfxVol) sfxVol.value = sfxVal;
        if (fxQuality) fxQuality.value = fxQualityVal;
        if (screenShake) screenShake.checked = shakeVal;
        
        if (masterVol) document.getElementById('vol-master-val').textContent = masterVal + '%';
        if (musicVol) document.getElementById('vol-music-val').textContent = musicVal + '%';
        if (sfxVol) document.getElementById('vol-sfx-val').textContent = sfxVal + '%';
    };
    
    const openSettings = () => {
        settingsOpen = true;
        const overlay = document.getElementById('settings-overlay');
        if (overlay) overlay.classList.remove('hidden');
    };
    
    const closeSettings = () => {
        settingsOpen = false;
        const overlay = document.getElementById('settings-overlay');
        if (overlay) overlay.classList.add('hidden');
    };
    
    const toggleSettings = () => {
        if (settingsOpen) closeSettings();
        else openSettings();
    };
    
    // ===== HUD UPDATES =====
    const updateScore = (val) => {
        const el = document.getElementById('hud-score');
        if (el) el.textContent = val;
    };
    
    const updateDepth = (val) => {
        const el = document.getElementById('hud-depth');
        if (el) el.textContent = val + 'm';
    };
    
    const updateMult = (val) => {
        const el = document.getElementById('hud-mult');
        if (el) el.textContent = val + 'x';
    };
    
    const updateShields = (val) => {
        const el = document.getElementById('hud-shields');
        if (el) {
            el.innerHTML = '';
            for (let i = 0; i < 4; i++) {
                const shield = document.createElement('div');
                shield.className = i < val ? 'shield active' : 'shield';
                el.appendChild(shield);
            }
        }
    };
    
    const updateDanger = (val) => {
        const el = document.getElementById('danger-fill');
        if (el) el.style.width = (val * 100) + '%';
    };
    
    const updateDash = (val) => {
        const el = document.getElementById('dash-fill');
        if (el) el.style.width = (val * 100) + '%';
    };
    
    const updateCorruption = (val) => {
        const el = document.getElementById('corruption-fill');
        if (el) el.style.width = (val * 100) + '%';
    };
    
    const updateExtractionProgress = (val) => {
        const el = document.getElementById('ext-fill');
        if (el) el.style.width = (val * 100) + '%';
    };
    
    const showWarning = (text) => {
        const el = document.getElementById('hud-warning');
        if (el) {
            el.textContent = text;
            el.style.opacity = '1';
            setTimeout(() => el.style.opacity = '0', 3000);
        }
    };
    
    const showExtraction = (active) => {
        const el = document.getElementById('hud-extraction');
        if (el) {
            el.classList.toggle('hidden', !active);
            const mobileExt = document.getElementById('mobile-ext');
            if (mobileExt) mobileExt.classList.toggle('hidden', !active);
        }
    };
    
    const showTransmission = (message) => {
        const el = document.getElementById('hud-transmission');
        if (el) {
            el.textContent = message;
            el.style.opacity = '0.6';
            el.style.transition = 'opacity 0.3s ease';
            setTimeout(() => {
                el.style.opacity = '0.2';
            }, 3000);
        }
    };
    
    const showGame = () => {
        const intro = document.getElementById('intro-screen');
        const game = document.getElementById('game-screen');
        const gameover = document.getElementById('gameover-screen');
        const extract = document.getElementById('extract-screen');
        
        if (intro) intro.classList.add('hidden');
        if (game) game.classList.remove('hidden');
        if (gameover) gameover.classList.add('hidden');
        if (extract) extract.classList.add('hidden');
    };
    
    const showGameOver = (stats) => {
        const game = document.getElementById('game-screen');
        const gameover = document.getElementById('gameover-screen');
        
        if (game) game.classList.add('hidden');
        if (gameover) {
            gameover.classList.remove('hidden');
            
            const statsDiv = document.getElementById('go-stats');
            if (statsDiv) {
                statsDiv.innerHTML = `
                    <div class="stat">Score: ${stats.score}</div>
                    <div class="stat">Distance: ${stats.distance}m</div>
                    <div class="stat">Phase: ${stats.phase}</div>
                    <div class="stat">Corruption: ${stats.corruption}%</div>
                `;
            }
        }
    };
    
    const showExtScreen = (stats) => {
        const game = document.getElementById('game-screen');
        const extract = document.getElementById('extract-screen');
        
        if (game) game.classList.add('hidden');
        if (extract) {
            extract.classList.remove('hidden');
            
            const statsDiv = document.getElementById('ext-stats');
            if (statsDiv) {
                statsDiv.innerHTML = `
                    <div class="stat">Base Score: ${stats.score}</div>
                    <div class="stat">Extraction Bonus: ${stats.bonusScore || 0}</div>
                    <div class="stat">Total: ${stats.totalScore || stats.score}</div>
                    <div class="stat">Distance: ${stats.distance}m</div>
                `;
            }
        }
    };
    
    // ===== PUBLIC API =====
    return {
        init,
        openSettings,
        closeSettings,
        toggleSettings,
        updateScore,
        updateDepth,
        updateMult,
        updateShields,
        updateDanger,
        updateDash,
        updateCorruption,
        updateExtractionProgress,
        showWarning,
        showTransmission,
        showExtraction,
        showGame,
        showGameOver,
        showExtScreen
    };
})();
