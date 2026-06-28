/**
 * EXTRACTION TENSION SYSTEM
 * Creates psychological pressure around extraction
 * "Do I leave... or go deeper?"
 */

const extractionTension = (() => {
    
    // ===== EXTRACTION STATE =====
    const createExtractionState = () => ({
        isActive: false,
        timeOpen: 0,
        maxTime: 10,       // Extraction window lasts 10 seconds
        playerHoldTime: 0,
        requiredHoldTime: 1.5,
        tension: 0,        // 0-1, visual/audio feedback
        temptation: 0      // How much risk vs reward
    });
    
    // ===== UPDATE TENSION =====
    const updateTension = (game, extraction, dt) => {
        if (!extraction.isActive) return;
        
        extraction.timeOpen += dt;
        
        // Tension rises as window closes
        extraction.tension = Math.min(1, extraction.timeOpen / extraction.maxTime);
        
        // Temptation increases with distance/corruption
        extraction.temptation = (game.distance / 2000) + (game.corruption * 0.3);
        
        // Audio responds to tension
        audioManager.onExtractionProgress(extraction.tension);
        
        // Check if window closes
        if (extraction.timeOpen >= extraction.maxTime) {
            closeExtractionWindow(extraction);
        }
    };
    
    // ===== HOLD MECHANICS =====
    const startExtraction = (extraction) => {
        extraction.playerHoldTime = 0;
    };
    
    const updateExtraction = (extraction, dt, isKeyDown) => {
        if (!extraction.isActive) return false;
        
        if (isKeyDown) {
            extraction.playerHoldTime += dt;
            
            // Check completion
            if (extraction.playerHoldTime >= extraction.requiredHoldTime) {
                return true; // Extraction success
            }
        } else {
            // Key released, reset hold
            extraction.playerHoldTime = Math.max(0, extraction.playerHoldTime - dt * 2);
        }
        
        return false;
    };
    
    // ===== WINDOW LOGIC =====
    const openExtractionWindow = (game, extraction) => {
        extraction.isActive = true;
        extraction.timeOpen = 0;
        extraction.playerHoldTime = 0;
        
        audioManager.onExtractionOpen();
        uiManager.showExtraction(true);
        
        // Message based on situation
        const riskyness = game.corruption > 0.8 ? "URGENT" : 
                          game.corruption > 0.5 ? "OPEN" : 
                          "AVAILABLE";
        uiManager.showWarning(`EXTRACTION ${riskyness}`);
    };
    
    const closeExtractionWindow = (extraction) => {
        extraction.isActive = false;
        extraction.playerHoldTime = 0;
        uiManager.showExtraction(false);
    };
    
    // ===== VISUAL FEEDBACK =====
    const renderExtractionIndicator = (ctx, game, extraction, width, height) => {
        if (!extraction.isActive) return;
        
        // Pulsing border indicating extraction available
        const pulse = Math.sin(extraction.timeOpen * 3) * 0.5 + 0.5;
        ctx.strokeStyle = `rgba(255, 150, 0, ${pulse * 0.6})`;
        ctx.lineWidth = 2 + extraction.tension * 2;
        ctx.strokeRect(10, 10, width - 20, height - 20);
    };
    
    const renderExtractionTimer = (ctx, extraction, width, height) => {
        if (!extraction.isActive) return;
        
        // Top right timer
        ctx.fillStyle = `rgba(255, 150, 0, ${1 - extraction.tension})`;
        ctx.font = 'bold 12px "Share Tech Mono"';
        ctx.textAlign = 'right';
        
        const timeLeft = Math.max(0, extraction.maxTime - extraction.timeOpen);
        ctx.fillText(`EXTRACTION CLOSES IN ${timeLeft.toFixed(1)}s`, width - 20, 30);
    };
    
    const renderHoldProgress = (ctx, extraction, width, height) => {
        if (!extraction.isActive || extraction.playerHoldTime <= 0) return;
        
        // Bottom center progress bar
        const barWidth = 150;
        const barHeight = 8;
        const progress = extraction.playerHoldTime / extraction.requiredHoldTime;
        
        ctx.fillStyle = 'rgba(100, 100, 100, 0.3)';
        ctx.fillRect(width / 2 - barWidth / 2, height - 40, barWidth, barHeight);
        
        ctx.fillStyle = `rgba(255, 150, 0, ${0.6 + progress * 0.4})`;
        ctx.fillRect(width / 2 - barWidth / 2, height - 40, barWidth * progress, barHeight);
        
        ctx.strokeStyle = 'rgba(255, 150, 0, 0.5)';
        ctx.lineWidth = 1;
        ctx.strokeRect(width / 2 - barWidth / 2, height - 40, barWidth, barHeight);
    };
    
    // ===== DILEMMA LOGIC =====
    const shouldPlayerExtract = (game, extraction) => {
        // Return value indicates how tempting it is to stay
        // Based on risk vs reward
        
        const riskOfStaying = game.corruption; // 0-1
        const rewardOfStaying = game.multiplier / 3; // Potential score
        const distanceBonus = game.distance / 500;
        
        return {
            riskScore: riskOfStaying,
            rewardScore: rewardOfStaying + distanceBonus,
            temptation: rewardOfStaying + distanceBonus - riskOfStaying,
            shouldExtract: riskOfStaying > 0.7 // Auto-recommend at 70% corruption
        };
    };
    
    // ===== PUBLIC API =====
    return {
        createExtractionState,
        updateTension,
        startExtraction,
        updateExtraction,
        openExtractionWindow,
        closeExtractionWindow,
        renderExtractionIndicator,
        renderExtractionTimer,
        renderHoldProgress,
        shouldPlayerExtract
    };
})();
