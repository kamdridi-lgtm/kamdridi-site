console.log(">>> [BOOT] MAIN.JS LOADED");

document.addEventListener('DOMContentLoaded', () => {
    console.log(">>> [BOOT] DOMCONTENTLOADED FIRED");
    
    // UI Elements
    const btn = document.getElementById('ignite-btn');
    const forceBtn = document.getElementById('force-debug-btn');
    const boot = document.getElementById('boot-sequence');
    const dataStream = document.getElementById('data-stream');
    const timecode = document.getElementById('timecode');
    const statusText = document.getElementById('system-status');
    const mainTitle = document.getElementById('main-title');
    const worldLayer = document.getElementById('world-layer');
    const flashLayer = document.getElementById('subliminal-flash-layer');

    const vA = document.getElementById('vid-a');
    const bA = document.getElementById('blur-a');
    const vB = document.getElementById('vid-b');
    const bB = document.getElementById('blur-b');

    // Defensive check
    if (!vA || !vB || !btn) {
        console.error(">>> CRITICAL ERROR: MISSION-CRITICAL HUD ELEMENTS MISSING.");
        return;
    }

    // Audio Initialization
    const audioEl = new Audio('assets/audio/war-machines-full.wav');
    audioEl.preload = 'auto';
    audioEl.crossOrigin = "anonymous";

    // Engine State
    let activeV = vA, standbyV = vB;
    let activeB = bA, standbyB = bB;
    let isPlaying = false;
    let lastPhase = null;
    let nextCutTime = 0;
    
    // Asset Pools & History Tracking
    let history = new Set();
    const D_KEYWORDS = ['explosion', 'mech', 'laser', 'barrage', 'machine', 'horizon', 'debris', 'war', 'ground', 'flight', 'cockpit', 'generation', 'trailer', 'scene'];
    const P_KEYWORDS = ['live', 'crowd', 'singing', 'band', 'singer', 'kam', 'face', 'emotion', 'dridi', 'performance', 'enjoying'];

    // --- MASTER TIMELINE LOGIC ---
    function getPhase(ct) {
        if (ct < 72) return 'VOID';
        if (ct < 75) return 'TRANSMISSION';
        if (ct < 165) return 'WAR';
        if (ct < 240) return 'CLIMAX';
        return 'BLACKOUT';
    }

    function getTransitionInterval(phase) {
        switch(phase) {
            case 'VOID': return 4.0;
            case 'TRANSMISSION': return 0.3;
            case 'WAR': return Math.random() + 1.0; // 1-2s
            case 'CLIMAX': return 0.15;
            default: return 999;
        }
    }

    // --- ASSET DISPATCHER ---
    function getNextAsset(phase) {
        let pool = [];
        const ct = audioEl.currentTime;

        if (phase === 'VOID') {
            // Space/Astronaut clips + potential logo reveal
            pool = ALL_VIDEOS.filter(v => ['astronaut', 'space'].some(k => v.toLowerCase().includes(k)));
        } else if (phase === 'TRANSMISSION') {
            // Strobe images: historical + flashes
            const imgPool = ALL_IMAGES.filter(i => ['historical', 'jfk', 'apollo', 'space', 'flash'].some(k => i.toLowerCase().includes(k)));
            return { type: 'image', src: imgPool[Math.floor(Math.random() * imgPool.length)] };
        } else if (phase === 'WAR' || phase === 'CLIMAX') {
            const isClimax = phase === 'CLIMAX';
            // Weighted randomization for performance vs destruction
            const performanceProb = isClimax ? 0.7 : 0.3; 
            
            if (Math.random() > performanceProb) {
                // Destruction pool
                pool = ALL_VIDEOS.filter(v => D_KEYWORDS.some(k => v.toLowerCase().includes(k)));
                // Priority: Nebula Dogfight
                if (Math.random() > 0.8) return { type: 'video', src: 'assets/videos/war_machines_cinematic_12s.mp4' };
            } else {
                // Performance pool
                pool = ALL_VIDEOS.filter(v => P_KEYWORDS.some(k => v.toLowerCase().includes(k)));
            }
        }

        if (pool.length === 0) pool = ALL_VIDEOS;
        
        let unplayed = pool.filter(v => !history.has(v));
        if (unplayed.length === 0) { history.clear(); unplayed = pool; }
        
        const selection = unplayed[Math.floor(Math.random() * unplayed.length)];
        history.add(selection);
        return { type: 'video', src: selection };
    }

    // --- RENDER CORE ---
    function triggerCut(phase) {
        const asset = getNextAsset(phase);

        if (asset.type === 'image') {
            // Flash historical images as hard cuts (strobe)
            flashLayer.style.backgroundImage = `url('${asset.src}')`;
            flashLayer.style.opacity = 1;
            // Short duration for strobe
            setTimeout(() => { flashLayer.style.opacity = 0; }, phase === 'TRANSMISSION' ? 100 : 200);
            return;
        }

        standbyV.src = asset.src;
        standbyB.src = asset.src;
        
        Promise.all([standbyV.play(), standbyB.play()]).then(() => {
            if (phase === 'VOID') {
                // Cinematic 4s crossfade
                standbyV.style.transition = 'opacity 4s ease-in-out';
                standbyB.style.transition = 'opacity 4s ease-in-out';
            } else {
                // Hard cuts or fast transitions
                standbyV.style.transition = 'opacity 0.1s';
                standbyB.style.transition = 'opacity 0.1s';
            }

            standbyV.classList.add('active');
            standbyB.classList.add('active');
            activeV.classList.remove('active');
            activeB.classList.remove('active');
            
            [activeV, standbyV] = [standbyV, activeV];
            [activeB, standbyB] = [standbyB, activeB];

            // FX: Screen Shake
            if (phase === 'WAR' || phase === 'CLIMAX') {
                document.body.classList.add('shake');
                setTimeout(() => document.body.classList.remove('shake'), phase === 'CLIMAX' ? 100 : 400);
            }
        }).catch(err => {
            console.warn("Retrying clip...", asset.src);
            nextCutTime = audioEl.currentTime; 
        });
    }

    function handlePhaseTransition(phase) {
        console.log(`>>> STATE_CHANGE: ${phase}`);
        document.body.className = `phase-${phase.toLowerCase()}`;
        
        if (phase === 'WAR') {
            document.body.classList.add('state-intense');
            mainTitle.classList.add('showing', 'glitch-heavy');
            setTimeout(() => mainTitle.classList.remove('showing'), 8000);
        }
        if (phase === 'CLIMAX') {
            statusText.innerText = 'HULL INTEGRITY CRITICAL';
            statusText.classList.add('hull-critical');
            statusText.style.color = '#ff0000';
            document.body.classList.add('max-crt');
        }
    }

    function handleBlackout(ct) {
        // At the final note (approx 4:00), set opacity: 0 for all layers except #main-title
        worldLayer.style.opacity = '0';
        document.getElementById('mech-hud').style.opacity = '0';
        document.getElementById('waveform-canvas').style.opacity = '0';
        document.getElementById('warp-canvas').style.opacity = '0';
        
        if (ct > 240.5) {
            mainTitle.classList.add('showing', 'glitch-heavy');
            mainTitle.innerText = "WAR MACHINES";
            mainTitle.style.opacity = '1';
            
            // Glitch for 2.5 seconds, then hard exit
            if (ct > 243.0) {
                mainTitle.style.opacity = '0';
                document.body.style.backgroundColor = '#000';
            }
        }
    }

    // --- MAIN TICK ---
    audioEl.ontimeupdate = () => {
        if (!isPlaying) return;
        const ct = audioEl.currentTime;
        const phase = getPhase(ct);

        // UI Feedback
        timecode.innerText = `T-${new Date(ct * 1000).toISOString().substr(14, 5)}:00`;

        if (phase !== lastPhase) {
            handlePhaseTransition(phase);
            lastPhase = phase;
        }

        if (ct >= nextCutTime && phase !== 'BLACKOUT') {
            triggerCut(phase);
            nextCutTime = ct + getTransitionInterval(phase);
        }

        if (phase === 'BLACKOUT') handleBlackout(ct);

        // Terminal Log Generation
        if (Math.random() > 0.96) {
            const logs = ["NEURAL LINK STABLE", "SECTOR_7 SCAN", "HULL_LOW", "RECOIL_INIT", "VOICE_KEY: YES"];
            const div = document.createElement('div');
            div.innerText = `[${ct.toFixed(1)}] ${logs[Math.floor(Math.random()*logs.length)]}`;
            dataStream.prepend(div);
            if (dataStream.children.length > 8) dataStream.lastChild.remove();
        }
    };

    // --- BOOT SYSTEM ---
    function updatePreload() {
        if (!audioEl.duration) return;
        const buffered = audioEl.buffered;
        const bar = document.getElementById('sync-bar-fill');
        const percText = document.getElementById('sync-percent');

        if (buffered.length > 0) {
            const percent = (buffered.end(0) / audioEl.duration) * 100;
            if (bar) bar.style.width = percent + '%';
            if (percText) percText.innerText = Math.floor(percent) + '%';
            
            if (percent > 95) {
                btn.innerText = 'IGNITE TRANSMISSION';
                btn.disabled = false;
                btn.classList.add('ready');
            }
        }
    }

    // Explicit Load Call
    audioEl.load();

    // FAIL-SAFE: If stuck in "SYNCING" for too long, allow forced entry
    setTimeout(() => {
        if (btn.disabled) {
            console.warn(">>> PRELOADER FAIL-SAFE TRIGGERED: ENABLING IGNITE.");
            btn.innerText = 'IGNITE (BYPASSING SYNC)';
            btn.disabled = false;
            btn.classList.add('ready');
        }
    }, 6000);

    function ignite() {
        isPlaying = true;
        boot.style.opacity = '0';
        setTimeout(() => boot.remove(), 1000);
        audioEl.play().catch(e => {
            console.warn("Autoplay block detected. Retrying on user interaction.");
            // Already inside a user interaction (click), so this is rare but defensive.
        });
        document.body.classList.remove('state-inactive');
    }

    btn.onclick = ignite;
    if (forceBtn) forceBtn.onclick = ignite;

    setInterval(updatePreload, 500);
});
