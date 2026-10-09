/**
 * PERFORMANCE MONITOR
 * Real-time FPS, frame time, memory tracking
 * Detects bottlenecks and memory leaks
 */

const performanceMonitor = (() => {
    let enabled = true;
    let fps = 0;
    let frameTime = 0;
    let maxFrameTime = 0;
    let frameCount = 0;
    let lastTime = performance.now();
    let fpsHistory = [];
    let frameTimeHistory = [];
    let memoryBaseline = 0;
    
    // System costs
    let systemCosts = {
        anomaly: 0,
        psychological: 0,
        extraction: 0,
        effects: 0,
        monster: 0,
        rendering: 0
    };
    
    // ===== UPDATE =====
    const update = () => {
        const now = performance.now();
        frameTime = now - lastTime;
        lastTime = now;
        
        // Track history
        frameTimeHistory.push(frameTime);
        if (frameTimeHistory.length > 60) frameTimeHistory.shift();
        
        // Calculate FPS
        if (frameTime > 0) {
            fps = Math.round(1000 / frameTime);
        }
        
        // Track peaks
        if (frameTime > maxFrameTime) {
            maxFrameTime = frameTime;
        }
        
        frameCount++;
    };
    
    // ===== SYSTEM COST TRACKING =====
    const startMeasure = (systemName) => {
        return performance.now();
    };
    
    const endMeasure = (systemName, startTime) => {
        const duration = performance.now() - startTime;
        if (systemCosts[systemName] !== undefined) {
            // Running average
            systemCosts[systemName] = systemCosts[systemName] * 0.9 + duration * 0.1;
        }
        return duration;
    };
    
    // ===== RENDER OVERLAY =====
    const render = (ctx, width, height) => {
        if (!enabled) return;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(10, 10, 200, 140);
        
        ctx.fillStyle = '#C9952A';
        ctx.font = 'bold 12px "Share Tech Mono"';
        ctx.fillText('PERFORMANCE', 15, 28);
        
        ctx.font = '10px "Share Tech Mono"';
        ctx.fillText(`FPS: ${fps}`, 15, 45);
        ctx.fillText(`Frame: ${frameTime.toFixed(1)}ms`, 15, 60);
        ctx.fillText(`Peak: ${maxFrameTime.toFixed(1)}ms`, 15, 75);
        
        // Memory
        if (performance.memory) {
            let usedMB = (performance.memory.usedJSHeapSize / 1048576).toFixed(1);
            ctx.fillText(`Memory: ${usedMB}MB`, 15, 90);
            
            // Memory growth detection
            if (frameCount === 60 && memoryBaseline === 0) {
                memoryBaseline = performance.memory.usedJSHeapSize;
            }
            
            if (memoryBaseline > 0) {
                let growth = ((performance.memory.usedJSHeapSize - memoryBaseline) / memoryBaseline * 100).toFixed(1);
                ctx.fillText(`Growth: ${growth}%`, 15, 105);
            }
        }
        
        // FPS color coding
        let fpsColor = '#C9952A';
        if (fps < 30) fpsColor = '#FF3030'; // Red: bad
        else if (fps < 50) fpsColor = '#FFA500'; // Orange: warning
        
        ctx.fillStyle = fpsColor;
        ctx.fillRect(10, 10, 4, 140);
    };
    
    // ===== REPORT =====
    const getReport = () => {
        let avgFrameTime = frameTimeHistory.length > 0 
            ? frameTimeHistory.reduce((a, b) => a + b, 0) / frameTimeHistory.length 
            : 0;
        
        return {
            fps,
            frameTime,
            maxFrameTime,
            avgFrameTime: avgFrameTime.toFixed(2),
            frameCount,
            systemCosts,
            memoryUsage: performance.memory ? {
                used: (performance.memory.usedJSHeapSize / 1048576).toFixed(1),
                limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(1)
            } : null
        };
    };
    
    // ===== CONSOLE LOG =====
    const logReport = () => {
        const report = getReport();
        console.log('=== PERFORMANCE REPORT ===');
        console.log(`FPS: ${report.fps}`);
        console.log(`Frame Time: ${report.frameTime.toFixed(2)}ms`);
        console.log(`Max Frame: ${report.maxFrameTime.toFixed(2)}ms`);
        console.log(`Avg Frame: ${report.avgFrameTime}ms`);
        console.log('System Costs (ms):');
        Object.keys(report.systemCosts).forEach(sys => {
            console.log(`  ${sys}: ${report.systemCosts[sys].toFixed(3)}`);
        });
        if (report.memoryUsage) {
            console.log(`Memory: ${report.memoryUsage.used}MB / ${report.memoryUsage.limit}MB`);
        }
    };
    
    // ===== KEYBOARD CONTROL =====
    const setupControls = () => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'p' || e.key === 'P') {
                enabled = !enabled;
                console.log(`Performance monitor ${enabled ? 'ENABLED' : 'DISABLED'}`);
            }
            if (e.key === 'o' || e.key === 'O') {
                logReport();
            }
        });
    };
    
    // ===== PUBLIC API =====
    return {
        update,
        render,
        startMeasure,
        endMeasure,
        getReport,
        logReport,
        setupControls,
        toggle: () => { enabled = !enabled; }
    };
})();
