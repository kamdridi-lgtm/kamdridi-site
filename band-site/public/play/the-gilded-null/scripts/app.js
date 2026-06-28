/**
 * KAMDRIDI â€” PROTOCOL BOOTSTRAP
 * App initialization and control flow
 */

(function() {
    'use strict';
    
    let game = null;
    let introActive = true;
    
    // ===== INTRO SEQUENCE TIMING =====
    // Total: ~17 seconds of pure atmosphere
    const introSequence = [
        { time: 0,    action: 'darkness' },         // Black silence
        { time: 0.5,  action: 'shows', el: 'intro-presents' },
        { time: 2.5,  action: 'hide',  el: 'intro-presents' },
        { time: 3,    action: 'shows', el: 'intro-signal' },
        { time: 5.5,  action: 'hide',  el: 'intro-signal' },
        { time: 6,    action: 'shows', el: 'intro-logo' },
        { time: 9,    action: 'reveals', el: 'logo-img' },      // Logo glows
        { time: 9.5,  action: 'shows', el: 'logo-glow' },
        { time: 10.5, action: 'hide',  el: 'intro-logo' },
        { time: 0.8,  action: 'shows', el: 'intro-title' },
        { time: 1.0,  action: 'shows', el: 'intro-system' },
        { time: 14,   action: 'hide',  el: 'intro-title' },
        { time: 14,   action: 'hide',  el: 'intro-system' },
        { time: 1.2, action: 'shows', el: 'btn-start' }
    ];
    
    let currentSequenceIndex = 0;
    let introStartTime = 0;
    
    // ===== INTRO CANVAS ANIMATION =====
    // Subtle particle system in intro (signal recovery feeling)
    const initIntroCanvas = () => {
        const canvas = document.getElementById('intro-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        let particles = [];
        
        // Generate signal particles
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1 + 0.5,
                opacity: Math.random() * 0.3,
                vx: (Math.random() - 0.5) * 0.05,
                vy: (Math.random() - 0.5) * 0.05
            });
        }
        
        const renderIntroCanvas = () => {
            // Very subtle: mostly black
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw particles
            ctx.fillStyle = 'rgba(201, 149, 42, 0.15)';
            for (let p of particles) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
                
                // Move
                p.x += p.vx;
                p.y += p.vy;
                
                // Bounce
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            }
            
            if (introActive) {
                requestAnimationFrame(renderIntroCanvas);
            }
        };
        
        renderIntroCanvas();
    };
    
    // ===== PROCESS INTRO SEQUENCE =====
    const processIntroSequence = (elapsed) => {
        while (currentSequenceIndex < introSequence.length) {
            const step = introSequence[currentSequenceIndex];
            
            if (elapsed < step.time) break;
            
            switch (step.action) {
                case 'shows':
                    const el = document.getElementById(step.el);
                    if (el) el.classList.add('show');
                    break;
                case 'hide':
                    const hide = document.getElementById(step.el);
                    if (hide) hide.classList.remove('show');
                    break;
                case 'reveals':
                    const reveal = document.getElementById(step.el);
                    if (reveal) reveal.classList.add('revealed');
                    break;
                case 'darkness':
                    // Pure black, waiting for audio
                    break;
            }
            
            currentSequenceIndex++;
        }
    };
    
    // ===== INTRO LOOP =====
    const runIntroLoop = () => {
        const elapsed = performance.now() - introStartTime;
        processIntroSequence(elapsed / 1000);
        
        if (introActive) {
            requestAnimationFrame(runIntroLoop);
        }
    };
    
    // ===== START BUTTON =====
    const startGame = () => {
        introActive = false;
        
        // Initialize audio
        audioManager.init();
        audioManager.onProtocolStart();
        
        // Hide intro
        const introScreen = document.getElementById('intro-screen');
        if (introScreen) {
            introScreen.classList.add('exit-protocol');
            setTimeout(() => {
                introScreen.style.display = 'none';
            }, 800);
        }
        
        // Show game
        uiManager.showGame();
        
        // Create and start game
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            game = new GildedNullGame(canvas);
            game.start();
        }
    };
    
    // ===== RESTART =====
    const restartGame = () => {
        if (game) game.stop();
        
        const gameScreen = document.getElementById('game-screen');
        const gameoverScreen = document.getElementById('gameover-screen');
        const extractScreen = document.getElementById('extract-screen');
        
        if (gameScreen) gameScreen.classList.remove('hidden');
        if (gameoverScreen) gameoverScreen.classList.add('hidden');
        if (extractScreen) extractScreen.classList.add('hidden');
        
        const canvas = document.getElementById('game-canvas');
        if (canvas) {
            game = new GildedNullGame(canvas);
            game.start();
        }
    };
    
    // ===== SAVE SCORE =====
    const saveScore = () => {
        const nameInput = document.getElementById('go-name');
        const playerName = (nameInput && nameInput.value) || 'Anonymous';
        
        gameStorage.savePlayerName(playerName);
        gameStorage.saveScore(game.getStats());
        
        // Show leaderboard
        const leaderboard = gameStorage.getLeaderboard();
        const leaderboardDiv = document.getElementById('go-leaderboard');
        if (leaderboardDiv) {
            leaderboardDiv.innerHTML = '<div style="margin-top: 20px; text-align: center;">' +
                '<div style="font-size: 12px; letter-spacing: 0.1em; color: #C9952A; margin-bottom: 10px;">LEADERBOARD</div>' +
                leaderboard.map((score, i) => 
                    `<div style="font-size: 11px; margin: 4px 0;">${i+1}. ${score.name} â€” ${score.score}</div>`
                ).join('') +
                '</div>';
        }
    };
    
    // ===== SETUP INPUT =====
    const setupInput = () => {
        const startBtn = document.getElementById('btn-start');
        if (startBtn) {
            startBtn.addEventListener('click', startGame);
        }
        
        const restartBtn = document.getElementById('go-restart');
        if (restartBtn) {
            restartBtn.addEventListener('click', restartGame);
        }
        
        const saveBtn = document.getElementById('go-save');
        if (saveBtn) {
            saveBtn.addEventListener('click', saveScore);
        }
        
        const extRestartBtn = document.getElementById('ext-restart');
        if (extRestartBtn) {
            extRestartBtn.addEventListener('click', restartGame);
        }
    };
    
    // ===== HANDLE PAGE VISIBILITY =====
    const setupPageVisibility = () => {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && game) {
                // Pause if needed
            } else if (!document.hidden && game) {
                // Resume
            }
        });
    };
    
    // ===== INIT =====
    const init = () => {
        // Initialize managers
        gameStorage.init();
        effects.initFX();
        uiManager.init();
        
        // Initialize performance monitor
        if (typeof performanceMonitor !== 'undefined') {
            performanceMonitor.setupControls();
            console.log('Performance Monitor active. Press P to toggle, O to log report.');
        }
        
        // Setup input
        setupInput();
        setupPageVisibility();
        
        // Start intro
        initIntroCanvas();
        introStartTime = performance.now();
        runIntroLoop();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            effects.initFX();
            if (game) game.onResize();
        });
    };
    
    // ===== START =====
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose for debugging
    window.appDebug = {
        game: () => game,
        startGame,
        restartGame,
        saveScore
    };
    
})();

