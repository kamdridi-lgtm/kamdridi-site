"use client";

import { useEffect, useRef, useState } from "react";

const V20_PATH = "/war-machines-premium-v20/assets/videos/";

const PHASES = {
  VOID: [
    "Video_Production_An_astronaut_drifts_through_the_vast_darkness_of_cHXrtmnX.mp4",
    "Grey_Desert_Ground_War_and_Flight.mp4",
    "Trailer_TVxaNOjn.mp4",
    "scene2.mp4"
  ],
  TRANSMISSION: [
    "Video_Production_A_dashboard_display_shows_a_crosshair_focused_on_o-VBrZM5 (2).mp4",
    "Video_Production_In_a_sci-fi_cinematic_style_a_cockpit_displays_a_BWPtzcI3.mp4",
    "Video_Production_In_a_cinematic_style_a_close-up_shot_shows_an_91C_SxsS.mp4"
  ],
  WAR: [
    "war_machines_cinematic_12s.mp4",
    "Mech_Laser_Barrage_in_Grey_Desert.mp4",
    "war_machines_machine_vs_machine_6s.mp4",
    "2026-03-12T08-41-13_generation_watermarked.mp4",
    "2026-03-31T12-16-52_generation_watermarked.mp4",
    "gemini_generated_video_34c2e5a7.mp4",
    "gemini_generated_video_d6736987.mp4",
    "Video_Generation_Activated.mp4",
    "Video_Generation_Complete.mp4",
    "scene3.mp4"
  ],
  CLIMAX: [
    "2026-02-22T02-33-34_ultra_realistic_watermarked-2.mp4",
    "2026-02-22T02-56-40_ultra_realistic_watermarked.mp4",
    "2026-02-22T03-11-27_ultra_realistic_watermarked.mp4",
    "2026-02-22T03-13-59_ultra_realistic_watermarked.mp4",
    "2026-03-12T09-20-15_enjoying_kam_dridi_watermarked.mp4",
    "2026-03-12T09-21-57_calmly_emotion_watermarked.mp4",
    "scene4.mp4"
  ]
};

export function WarMachinesV20Experience() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState("STANDBY");
  const [timecode, setTimecode] = useState("T-00:00:00");
  const [logs, setLogs] = useState<string[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const vidARef = useRef<HTMLVideoElement | null>(null);
  const vidBRef = useRef<HTMLVideoElement | null>(null);
  
  const activeLayer = useRef<"A" | "B">("A");
  const currentPhaseRef = useRef("VOID");
  const nextCutTimeRef = useRef(0);
  const historyRef = useRef<Set<string>>(new Set());

  // Function to determine phase based on audio time
  const getPhase = (ct: number) => {
    if (ct < 72) return 'VOID';
    if (ct < 75) return 'TRANSMISSION';
    if (ct < 165) return 'WAR';
    if (ct < 240) return 'CLIMAX';
    return 'BLACKOUT';
  };

  const getNextVideo = (currentPhase: string) => {
    let pool = PHASES[currentPhase as keyof typeof PHASES] || PHASES.VOID;
    let unplayed = pool.filter(v => !historyRef.current.has(v));
    
    if (unplayed.length === 0) {
      historyRef.current.clear();
      unplayed = pool;
    }
    
    const selection = unplayed[Math.floor(Math.random() * unplayed.length)];
    historyRef.current.add(selection);
    return V20_PATH + selection;
  };

  const triggerCut = (currentPhase: string) => {
    const nextSrc = getNextVideo(currentPhase);
    const standbyVid = activeLayer.current === "A" ? vidBRef.current : vidARef.current;
    const activeVid = activeLayer.current === "A" ? vidARef.current : vidBRef.current;
    
    if (!standbyVid || !activeVid) return;

    standbyVid.src = nextSrc;
    standbyVid.play().catch(() => {});
    
    // Crossfade Logic
    standbyVid.style.opacity = "1";
    activeVid.style.opacity = "0";
    
    activeLayer.current = activeLayer.current === "A" ? "B" : "A";
  };

  useEffect(() => {
    if (!audioRef.current) return;
    
    const handleTimeUpdate = () => {
      const ct = audioRef.current!.currentTime;
      const currentPhase = getPhase(ct);
      
      // Update UI Timecode
      const date = new Date(ct * 1000);
      setTimecode(`T-${date.toISOString().substring(14, 19)}:${Math.floor((ct % 1) * 100).toString().padStart(2, '0')}`);
      
      if (currentPhase !== currentPhaseRef.current) {
        currentPhaseRef.current = currentPhase;
        setPhase(currentPhase);
        
        if (currentPhase === "BLACKOUT") {
           if (vidARef.current) vidARef.current.style.opacity = "0";
           if (vidBRef.current) vidBRef.current.style.opacity = "0";
        }
      }

      // Trigger cuts
      if (ct >= nextCutTimeRef.current && currentPhase !== "BLACKOUT") {
        triggerCut(currentPhase);
        
        // Dynamic intervals based on phase to match intensity
        let interval = 4.0; // VOID
        if (currentPhase === 'TRANSMISSION') interval = 0.5;
        if (currentPhase === 'WAR') interval = Math.random() * 2 + 1.5; // 1.5 - 3.5s
        if (currentPhase === 'CLIMAX') interval = Math.random() * 1 + 0.8; // 0.8 - 1.8s
        
        nextCutTimeRef.current = ct + interval;
      }
      
      // Telemetry Logs
      if (Math.random() > 0.95 && currentPhase !== "BLACKOUT") {
        const newLog = `[${ct.toFixed(2)}] ${["SYS_OK", "TRGT_LCK", "HULL_WARN", "SYNCING", "DEPLOY_RDY"][Math.floor(Math.random() * 5)]}`;
        setLogs(prev => [newLog, ...prev].slice(0, 5));
      }
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    return () => audioRef.current?.removeEventListener("timeupdate", handleTimeUpdate);
  }, []);

  const handleIgnite = () => {
    setIsPlaying(true);
    setPhase("VOID");
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div className="relative w-full h-full bg-black text-[#f4c66a] overflow-hidden font-mono select-none">
      {/* Audio Engine */}
      <audio ref={audioRef} src="/war-machines-premium-v20/assets/audio/war-machines-full.wav" preload="auto" />

      {/* Video Layers for Crossfading */}
      <video ref={vidARef} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-0" muted playsInline />
      <video ref={vidBRef} className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 opacity-0" muted playsInline />
      
      {/* Cinematic Overlays (CRT, Vignette, Scanlines) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-30" />
      
      {/* Initial Boot Screen */}
      {!isPlaying && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
          <button 
            onClick={handleIgnite}
            className="px-8 py-4 border border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a] tracking-[0.3em] uppercase text-sm hover:bg-[#f4c66a] hover:text-black transition-all shadow-[0_0_20px_rgba(244,198,106,0.3)]"
          >
            INITIALIZE V20 PROTOCOL
          </button>
        </div>
      )}

      {/* Tactical HUD */}
      {isPlaying && phase !== "BLACKOUT" && (
        <div className="absolute inset-0 z-40 pointer-events-none p-4 flex flex-col justify-between">
          
          {/* Top HUD */}
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-1">
              <span className="text-xs tracking-widest text-[#f4c66a]/70">SYS.COMMS.V20</span>
              <span className="text-[10px] tracking-widest text-red-500 animate-pulse">{phase === "WAR" ? "COMBAT ACTIVE" : phase === "CLIMAX" ? "HULL CRITICAL" : "SCANNING"}</span>
            </div>
            <div className="text-right flex flex-col gap-1">
              <span className="text-lg font-bold tracking-widest">{timecode}</span>
              <span className="text-xs text-[#f4c66a]/50">PHASE: {phase}</span>
            </div>
          </div>

          {/* Center Targeting Reticle (Mire d'attaque) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-[#f4c66a]/20 rounded-full flex items-center justify-center">
            <div className={`w-48 h-48 border-t border-b rounded-full animate-[spin_8s_linear_infinite] ${phase === "WAR" || phase === "CLIMAX" ? "border-red-500/50" : "border-[#f4c66a]/40"}`} />
            <div className={`absolute w-32 h-32 border-l border-r rounded-full animate-[spin_6s_linear_infinite_reverse] ${phase === "WAR" || phase === "CLIMAX" ? "border-red-500/70" : "border-[#f4c66a]/60"}`} />
            <div className="absolute w-2 h-2 bg-[#f4c66a] rounded-full" />
            <div className="absolute top-1/2 left-0 w-8 h-[1px] bg-[#f4c66a]/50 -translate-y-1/2 -translate-x-full" />
            <div className="absolute top-1/2 right-0 w-8 h-[1px] bg-[#f4c66a]/50 -translate-y-1/2 translate-x-full" />
            <div className="absolute left-1/2 top-0 w-[1px] h-8 bg-[#f4c66a]/50 -translate-x-1/2 -translate-y-full" />
            <div className="absolute left-1/2 bottom-0 w-[1px] h-8 bg-[#f4c66a]/50 -translate-x-1/2 translate-y-full" />
          </div>

          {/* Side Telemetry Data */}
          <div className="absolute left-4 top-1/2 -translate-y-1/2 w-32 hidden md:flex flex-col gap-1">
            {logs.map((log, i) => (
              <span key={i} className="text-[9px] tracking-wider text-[#f4c66a]/60 font-mono opacity-80">
                {log}
              </span>
            ))}
          </div>

          {/* Bottom HUD */}
          <div className="flex justify-between items-end border-b border-[#f4c66a]/30 pb-2">
            <div className="text-xs tracking-widest text-[#f4c66a]/80">TARGET: KAM DRIDI</div>
            <div className="text-xs tracking-widest text-[#f4c66a]/80">DIST: 84.22.9A</div>
          </div>
        </div>
      )}

      {/* Blackout Phase */}
      {phase === "BLACKOUT" && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black">
          <h1 className="text-4xl md:text-6xl font-bold tracking-[0.5em] text-[#f4c66a] opacity-80 animate-pulse">WAR MACHINES</h1>
        </div>
      )}
    </div>
  );
}
