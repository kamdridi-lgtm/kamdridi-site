/**
 * TRANSMISSION SYSTEM
 * Dynamic messages based on player progress
 * Archive data recovered as player plays
 */

const transmissionSystem = (() => {
    // ===== TRANSMISSION LIBRARY =====
    // Messages change based on runs, corruption, phase
    
    const transmissions = {
        startup: [
            "PROTOCOL INITIATED",
            "SIGNAL RECOVERY IN PROGRESS",
            "ARCHIVE LINK ESTABLISHING",
            "ECHOES ENGINE CONNECTED",
            "NEURAL INTERFACE READY"
        ],
        
        early: [
            "CORRIDOR DEPTH: SHALLOW",
            "THREAT ASSESSMENT: MINIMAL",
            "CONTAMINATION: 0.2%",
            "PLEASE PROCEED",
            "ARCHIVE STABLE"
        ],
        
        mid: [
            "THREAT LEVEL RISING",
            "CONTAMINATION SPREADING",
            "ARCHIVE DEGRADING",
            "SIGNAL UNSTABLE",
            "CAUTION ADVISED"
        ],
        
        late: [
            "CRITICAL THREAT DETECTED",
            "CONTAMINATION CRITICAL",
            "ARCHIVE COLLAPSE IMMINENT",
            "EXTRACTION RECOMMENDED",
            "DANGER ZONE ACTIVE"
        ],
        
        extraction: [
            "EXTRACTION WINDOW OPEN",
            "CORRIDOR CONVERGING",
            "SAFETY PROTOCOL AVAILABLE",
            "DECONTAMINATION POSSIBLE",
            "RETURN OPPORTUNITY"
        ],
        
        deepRunner: [
            "YOU RETURN OFTEN",
            "WHY DO YOU STAY",
            "THE CORRUPTION CALLS",
            "YOU CANNOT LEAVE",
            "DEEPER STILL"
        ],
        
        corrupted: [
            "YOU ARE CHANGING",
            "THE ARCHIVE REMEMBERS",
            "YOU WILL RETURN",
            "ALWAYS RETURN",
            "ETERNITY AWAITS"
        ],
        
        failure: [
            "PROTOCOL TERMINATED",
            "ARCHIVE LOSS DETECTED",
            "SIGNAL ENDED",
            "CONTAINMENT FAILED",
            "TRY AGAIN"
        ]
    };
    
    // ===== GET TRANSMISSION =====
    const getTransmission = (game, runCount, totalCorruption) => {
        // Determine context
        let context = 'early';
        
        if (game.phase >= 6) {
            context = 'late';
        } else if (game.phase >= 4) {
            context = 'mid';
        }
        
        // Deep runner behavior (played 10+ times)
        if (runCount > 10) {
            if (Math.random() < 0.3) {
                return getRandomFrom(transmissions.deepRunner);
            }
        }
        
        // High corruption behavior
        if (game.corruption > 0.7) {
            if (Math.random() < 0.4) {
                return getRandomFrom(transmissions.corrupted);
            }
        }
        
        // Extraction available
        if (game.extractionAvailable && Math.random() < 0.3) {
            return getRandomFrom(transmissions.extraction);
        }
        
        // Default by context
        return getRandomFrom(transmissions[context]);
    };
    
    // ===== GAME OVER TRANSMISSIONS =====
    const getGameOverMessage = (stats, runCount) => {
        if (runCount < 3) {
            return "OPERATOR LOST — ARCHIVE CONTINUES";
        } else if (runCount < 10) {
            return "ANOTHER OPERATOR FALLS — PATTERN DETECTED";
        } else if (runCount < 20) {
            return "YOU RETURN... AGAIN — ADDICTION CONFIRMED";
        } else {
            return "ETERNAL RETURNER — ACCEPTANCE INEVITABLE";
        }
    };
    
    // ===== EXTRACTION TRANSMISSIONS =====
    const getExtractionMessage = (stats) => {
        if (stats.corruption > 80) {
            return "ESCAPE SUCCESSFUL — BUT YOU ARE CHANGED";
        } else if (stats.corruption > 50) {
            return "DECONTAMINATION PARTIAL — TRACES REMAIN";
        } else {
            return "CLEAN EXTRACTION — ARCHIVE PRESERVED";
        }
    };
    
    // ===== UTILITY =====
    const getRandomFrom = (arr) => {
        return arr[Math.floor(Math.random() * arr.length)];
    };
    
    // ===== PUBLIC API =====
    return {
        getTransmission,
        getGameOverMessage,
        getExtractionMessage
    };
})();
