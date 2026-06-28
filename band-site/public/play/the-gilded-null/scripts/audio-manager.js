/**
 * ECHOES ENGINE
 * KAMDRIDI Audio System v2.1
 * 
 * Philosophy:
 * - Audio is the soul
 * - Silence is powerful
 * - Pressure builds through frequency
 * - Corruption degrades the signal
 * - Atmosphere above everything
 */

const audioManager = (() => {
    // ===== STATE =====
    let audioContext = null;
    let enabled = false;
    let masterGain = null;
    let now = 0;
    
    // Layer nodes
    let droneLayer1, droneLayer2, droneLayer3;
    let breathingNode;
    let pulseNode;
    let pressureNode;
    let masterCompressor;
    
    // Filters
    let lowpassDrone, lowpassBreathing;
    let highpassDanger;
    
    // Gain nodes
    let droneMaster, breathingGain, pulseGain, pressureGain;
    
    // Current state
    let gameState = {
        danger: 0,           // 0-1, monster proximity
        corruption: 0,       // 0-1, corruption level
        phase: 1,            // 1-6, game phase
        intensity: 0,        // 0-1, overall intensity
        inExtraction: false, // extraction window open
        nearMiss: false      // just dodged monster
    };
    
    // ===== INIT =====
    const init = () => {
        if (audioContext) return;
        
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        now = audioContext.currentTime;
        
        try {
            // Master gain
            masterGain = audioContext.createGain();
            masterGain.gain.value = 0.4;
            masterGain.connect(audioContext.destination);
            
            // Master compressor (prevent peaks)
            masterCompressor = audioContext.createDynamicsCompressor();
            masterCompressor.threshold.value = -30;
            masterCompressor.knee.value = 40;
            masterCompressor.ratio.value = 12;
            masterCompressor.connect(masterGain);
            
            // ===== DRONE LAYER 1: 26Hz sawtooth =====
            droneLayer1 = audioContext.createOscillator();
            droneLayer1.type = 'sawtooth';
            droneLayer1.frequency.value = 26;
            
            // Lowpass filter for drone 1
            lowpassDrone = audioContext.createBiquadFilter();
            lowpassDrone.type = 'lowpass';
            lowpassDrone.frequency.value = 60;
            lowpassDrone.Q.value = 2;
            
            droneMaster = audioContext.createGain();
            droneMaster.gain.value = 0.08;
            
            droneLayer1.connect(lowpassDrone);
            lowpassDrone.connect(droneMaster);
            droneMaster.connect(masterCompressor);
            droneLayer1.start(0);
            
            // ===== DRONE LAYER 2: 18Hz sine =====
            droneLayer2 = audioContext.createOscillator();
            droneLayer2.type = 'sine';
            droneLayer2.frequency.value = 18;
            
            let droneGain2 = audioContext.createGain();
            droneGain2.gain.value = 0.05;
            
            droneLayer2.connect(droneGain2);
            droneGain2.connect(masterCompressor);
            droneLayer2.start(0);
            
            // ===== DRONE LAYER 3: 14Hz square =====
            droneLayer3 = audioContext.createOscillator();
            droneLayer3.type = 'square';
            droneLayer3.frequency.value = 14;
            
            let lowpass3 = audioContext.createBiquadFilter();
            lowpass3.type = 'lowpass';
            lowpass3.frequency.value = 50;
            lowpass3.Q.value = 3;
            
            let droneGain3 = audioContext.createGain();
            droneGain3.gain.value = 0.06;
            
            droneLayer3.connect(lowpass3);
            lowpass3.connect(droneGain3);
            droneGain3.connect(masterCompressor);
            droneLayer3.start(0);
            
            // ===== BREATHING: Filtered noise =====
            let breathingBuffer = createBreathingBuffer();
            let breathingSource = audioContext.createBufferSource();
            breathingSource.buffer = breathingBuffer;
            breathingSource.loop = true;
            breathingSource.playbackRate.value = 0.8;
            
            lowpassBreathing = audioContext.createBiquadFilter();
            lowpassBreathing.type = 'bandpass';
            lowpassBreathing.frequency.value = 350;
            lowpassBreathing.Q.value = 2;
            
            breathingGain = audioContext.createGain();
            breathingGain.gain.value = 0.05;
            
            breathingSource.connect(lowpassBreathing);
            lowpassBreathing.connect(breathingGain);
            breathingGain.connect(masterCompressor);
            breathingSource.start(0);
            breathingNode = breathingSource;
            
            // ===== PULSE: Danger indicator =====
            pulseNode = audioContext.createOscillator();
            pulseNode.type = 'sine';
            pulseNode.frequency.value = 0.3; // LFO
            
            pulseGain = audioContext.createGain();
            pulseGain.gain.value = 0;
            
            pulseNode.connect(pulseGain);
            pulseGain.connect(masterCompressor);
            pulseNode.start(0);
            
            // ===== PRESSURE: Corruption indicator =====
            pressureNode = audioContext.createOscillator();
            pressureNode.type = 'square';
            pressureNode.frequency.value = 12;
            
            pressureGain = audioContext.createGain();
            pressureGain.gain.value = 0;
            
            pressureNode.connect(pressureGain);
            pressureGain.connect(masterCompressor);
            pressureNode.start(0);
            
            enabled = true;
            
        } catch (e) {
            console.error('AudioContext init failed:', e);
            enabled = false;
        }
    };
    
    // ===== BREATHING BUFFER =====
    const createBreathingBuffer = () => {
        const sampleRate = audioContext.sampleRate;
        const duration = 4;
        const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
        const data = buffer.getChannelData(0);
        
        // White noise with slow modulation
        for (let i = 0; i < data.length; i++) {
            let noise = Math.random() * 2 - 1;
            let envelope = Math.sin((i / data.length) * Math.PI * 2) * 0.5 + 0.5;
            data[i] = noise * envelope * 0.4;
        }
        
        return buffer;
    };
    
    // ===== UPDATE LOOP =====
    const updateFrame = (data = {}) => {
        if (!enabled || !audioContext) return;
        
        now = audioContext.currentTime;
        
        // Update state
        gameState = { ...gameState, ...data };
        
        const danger = gameState.danger;
        const corruption = gameState.corruption;
        const intensity = gameState.intensity;
        
        // ===== DANGER PULSE =====
        // As monster approaches, bass pulses faster and louder
        if (danger > 0.1) {
            let pulseFreq = 0.5 + danger * 3; // 0.5 → 3.5 Hz
            pulseNode.frequency.value = pulseFreq;
            pulseGain.gain.value = danger * 0.08;
            
            // Modulate drone frequency under pressure
            droneMaster.gain.value = 0.08 + danger * 0.04;
            
        } else {
            pulseGain.gain.value = 0;
            droneMaster.gain.value = 0.08;
        }
        
        // ===== BREATHING MODULATION =====
        // Breathing gets heavier under pressure
        let breathingLevel = 0.05 + danger * 0.08 + corruption * 0.05;
        breathingGain.gain.setValueAtTime(breathingLevel, now);
        
        // ===== CORRUPTION PRESSURE =====
        // High corruption creates a heavy low frequency
        if (corruption > 0.2) {
            let pressureFreq = 8 + corruption * 6; // 8 → 14 Hz
            pressureNode.frequency.value = pressureFreq;
            pressureGain.gain.value = (corruption - 0.2) * 0.3;
            
            // Distort lowpass filter
            lowpassDrone.frequency.value = 60 - corruption * 30;
            
        } else {
            pressureGain.gain.value = 0;
            lowpassDrone.frequency.value = 60;
        }
        
        // ===== EXTRACTION TENSION =====
        if (gameState.inExtraction) {
            // Extraction window: audio gets higher, tighter
            lowpassBreathing.frequency.value = 400 + gameState.extractionProgress * 100;
        } else {
            lowpassBreathing.frequency.value = 350;
        }
        
        // ===== NEAR MISS RUSH =====
        if (gameState.nearMiss) {
            pulseGain.gain.value = Math.min(0.15, pulseGain.gain.value + 0.05);
        }
    };
    
    // ===== EVENT HOOKS =====
    const onProtocolStart = () => {
        if (!enabled) return;
        // Audio already running
    };
    
    const onDash = () => {
        if (!enabled) return;
        // Quick frequency spike
        let originalFreq = pulseNode.frequency.value;
        pulseNode.frequency.setValueAtTime(8, now);
        pulseNode.frequency.setValueAtTime(originalFreq, now + 0.05);
    };
    
    const onMonsterNear = (distance) => {
        // Distance: 0 (on screen) → 1 (far)
        // Danger: 1 (close) → 0 (far)
        const danger = 1 - Math.min(1, distance / 300);
        updateFrame({ danger });
    };
    
    const onDamage = (shields) => {
        if (!enabled) return;
        // Low frequency thump on damage
        let thump = audioContext.createOscillator();
        thump.type = 'sine';
        thump.frequency.setValueAtTime(40, now);
        thump.frequency.setValueAtTime(20, now + 0.1);
        
        let thumpGain = audioContext.createGain();
        thumpGain.gain.setValueAtTime(0.2, now);
        thumpGain.gain.setValueAtTime(0, now + 0.15);
        
        thump.connect(thumpGain);
        thumpGain.connect(masterCompressor);
        thump.start(now);
        thump.stop(now + 0.15);
    };
    
    const onCollectGold = () => {
        if (!enabled) return;
        // Bright frequency spike
        let collect = audioContext.createOscillator();
        collect.type = 'sine';
        collect.frequency.value = 800;
        
        let collectGain = audioContext.createGain();
        collectGain.gain.setValueAtTime(0.1, now);
        collectGain.gain.setValueAtTime(0, now + 0.08);
        
        collect.connect(collectGain);
        collectGain.connect(masterCompressor);
        collect.start(now);
        collect.stop(now + 0.08);
    };
    
    const onNearMiss = () => {
        if (!enabled) return;
        // Adrenaline rush: quick bass spike
        let miss = audioContext.createOscillator();
        miss.type = 'sine';
        miss.frequency.setValueAtTime(50, now);
        miss.frequency.setValueAtTime(80, now + 0.05);
        
        let missGain = audioContext.createGain();
        missGain.gain.setValueAtTime(0.15, now);
        missGain.gain.setValueAtTime(0, now + 0.1);
        
        miss.connect(missGain);
        missGain.connect(masterCompressor);
        miss.start(now);
        miss.stop(now + 0.1);
    };
    
    const onGameOver = (stats) => {
        if (!enabled) return;
        // Descending tone of defeat
        let gameOver = audioContext.createOscillator();
        gameOver.type = 'sine';
        gameOver.frequency.setValueAtTime(200, now);
        gameOver.frequency.setValueAtTime(80, now + 1);
        
        let goGain = audioContext.createGain();
        goGain.gain.setValueAtTime(0.1, now);
        goGain.gain.setValueAtTime(0, now + 1);
        
        gameOver.connect(goGain);
        goGain.connect(masterCompressor);
        gameOver.start(now);
        gameOver.stop(now + 1);
    };
    
    const onPhaseChange = (phase) => {
        // Phase escalation: audio intensity increases
        let intensity = phase / 6;
        updateFrame({ phase, intensity });
    };
    
    const onCorruptionChange = (level) => {
        // Corruption: 0-1
        updateFrame({ corruption: level });
    };
    
    const onBlackout = (active) => {
        if (!enabled) return;
        if (active) {
            // Sudden silence or harsh noise?
            masterGain.gain.setValueAtTime(0.4, now);
            masterGain.gain.setValueAtTime(0.1, now + 0.1);
        } else {
            masterGain.gain.setValueAtTime(0.4, now);
        }
    };
    
    const onAnomaly = (type) => {
        if (!enabled) return;
        // Different anomalies = different audio signatures
        switch (type) {
            case 'blackout':
                // Harsh noise burst
                break;
            case 'goldfever':
                // High frequency excitement
                pulseGain.gain.value = 0.12;
                break;
            case 'echo':
                // Delayed feedback
                break;
            case 'ghost':
                // Whisper noise
                break;
        }
    };
    
    const onExtractionOpen = () => {
        if (!enabled) return;
        updateFrame({ inExtraction: true, extractionProgress: 0 });
        
        // Extraction opening: ascending tone
        let extraction = audioContext.createOscillator();
        extraction.type = 'sine';
        extraction.frequency.setValueAtTime(300, now);
        extraction.frequency.setValueAtTime(600, now + 0.4);
        
        let exGain = audioContext.createGain();
        exGain.gain.setValueAtTime(0.08, now);
        exGain.gain.setValueAtTime(0, now + 0.4);
        
        extraction.connect(exGain);
        exGain.connect(masterCompressor);
        extraction.start(now);
        extraction.stop(now + 0.4);
    };
    
    const onExtractionProgress = (progress) => {
        // 0-1, how far through extraction
        updateFrame({ extractionProgress: progress });
    };
    
    const onExtractionSuccess = () => {
        if (!enabled) return;
        // Escape: uplifting tone sequence
        let success = audioContext.createOscillator();
        success.type = 'sine';
        success.frequency.setValueAtTime(800, now);
        success.frequency.setValueAtTime(600, now + 0.3);
        
        let sucGain = audioContext.createGain();
        sucGain.gain.setValueAtTime(0.12, now);
        sucGain.gain.setValueAtTime(0, now + 0.5);
        
        success.connect(sucGain);
        sucGain.connect(masterCompressor);
        success.start(now);
        success.stop(now + 0.5);
    };
    
    // ===== PUBLIC API =====
    return {
        init,
        enabled: () => enabled,
        updateFrame,
        onProtocolStart,
        onDash,
        onMonsterNear,
        onDamage,
        onCollectGold,
        onNearMiss,
        onGameOver,
        onPhaseChange,
        onCorruptionChange,
        onBlackout,
        onAnomaly,
        onExtractionOpen,
        onExtractionProgress,
        onExtractionSuccess
    };
})();
