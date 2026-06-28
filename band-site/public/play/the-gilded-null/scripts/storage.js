/**
 * GAME STORAGE
 * Persistent data management
 */

const gameStorage = (() => {
    const PREFIX = 'kgn_';
    
    const init = () => {
        // Initialize default settings if not present
        if (!localStorage.getItem(PREFIX + 'settingsInit')) {
            setSetting('masterVolume', 40);
            setSetting('musicVolume', 60);
            setSetting('sfxVolume', 80);
            setSetting('fxQuality', 'medium');
            setSetting('screenShake', true);
            localStorage.setItem(PREFIX + 'settingsInit', '1');
        }
    };
    
    // ===== SETTINGS =====
    const getSetting = (key, defaultVal) => {
        const val = localStorage.getItem(PREFIX + key);
        if (val === null) return defaultVal;
        
        // Try to parse as JSON (for booleans, numbers)
        try {
            return JSON.parse(val);
        } catch {
            return val;
        }
    };
    
    const setSetting = (key, val) => {
        try {
            localStorage.setItem(PREFIX + key, JSON.stringify(val));
        } catch (e) {
            console.error('Storage error:', e);
        }
    };
    
    // ===== SCORES =====
    const saveScore = (stats) => {
        try {
            let leaderboard = getLeaderboard();
            
            const newScore = {
                name: localStorage.getItem(PREFIX + 'playerName') || 'Anonymous',
                score: stats.score,
                distance: stats.distance,
                phase: stats.phase,
                corruption: stats.corruption,
                timestamp: Date.now()
            };
            
            leaderboard.push(newScore);
            leaderboard.sort((a, b) => b.score - a.score);
            leaderboard = leaderboard.slice(0, 10);
            
            localStorage.setItem(PREFIX + 'leaderboard', JSON.stringify(leaderboard));
            
            // Track stats
            let runs = parseInt(localStorage.getItem(PREFIX + 'runCount') || '0') + 1;
            localStorage.setItem(PREFIX + 'runCount', runs);
            
        } catch (e) {
            console.error('Score save failed:', e);
        }
    };
    
    const getLeaderboard = () => {
        try {
            const data = localStorage.getItem(PREFIX + 'leaderboard');
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error('Leaderboard read failed:', e);
            return [];
        }
    };
    
    const savePlayerName = (name) => {
        try {
            localStorage.setItem(PREFIX + 'playerName', name);
        } catch (e) {
            console.error('Name save failed:', e);
        }
    };
    
    const getPlayerName = () => {
        return localStorage.getItem(PREFIX + 'playerName') || 'Anonymous';
    };
    
    const getRunCount = () => {
        return parseInt(localStorage.getItem(PREFIX + 'runCount') || '0');
    };
    
    // ===== CORRUPTION TRACKING =====
    const addCorruption = (amount) => {
        try {
            let total = parseFloat(localStorage.getItem(PREFIX + 'totalCorruption') || '0');
            total += amount;
            localStorage.setItem(PREFIX + 'totalCorruption', total.toFixed(2));
        } catch (e) {
            console.error('Corruption tracking failed:', e);
        }
    };
    
    const getTotalCorruption = () => {
        return parseFloat(localStorage.getItem(PREFIX + 'totalCorruption') || '0');
    };
    
    // ===== RESET =====
    const resetAll = () => {
        try {
            const keys = Object.keys(localStorage);
            keys.forEach(key => {
                if (key.startsWith(PREFIX)) {
                    localStorage.removeItem(key);
                }
            });
            init(); // Re-initialize with defaults
        } catch (e) {
            console.error('Reset failed:', e);
        }
    };
    
    // ===== PUBLIC API =====
    return {
        init,
        getSetting,
        setSetting,
        saveScore,
        getLeaderboard,
        savePlayerName,
        getPlayerName,
        getRunCount,
        addCorruption,
        getTotalCorruption,
        resetAll
    };
})();
