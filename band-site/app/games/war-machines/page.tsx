"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    KamdridiWarMachines?: {
      createGame?: (
        canvas: HTMLCanvasElement,
        overlay: HTMLDivElement,
        startButton: HTMLButtonElement | null,
        options?: { onFps?: (fps: number) => void }
      ) => { destroy: () => void };
    };
  }
}

const scripts = [
  "/games/war-machines/song-loader.js",
  "/games/war-machines/ecosystem-audio.js",
  "/games/war-machines/game.js"
];

function loadScript(src: string) {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[data-war-machines="${src}"]`);
    if (existing?.dataset.loaded === "true") {
      resolve();
      return;
    }

    const script = existing || document.createElement("script");
    script.src = src;
    script.async = false;
    script.dataset.warMachines = src;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve();
    };
    script.onerror = () => reject(new Error(`Failed to load ${src}`));

    if (!existing) document.body.appendChild(script);
  });
}

export default function WarMachinesPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const startRef = useRef<HTMLButtonElement | null>(null);
  const gameRef = useRef<{ destroy: () => void } | null>(null);
  const [fps, setFps] = useState(0);
  const [initState, setInitState] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    let cancelled = false;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const bootstrap = async () => {
      try {
        const canvas = canvasRef.current;
        const overlay = overlayRef.current;
        if (!canvas || !overlay) throw new Error("Canvas or overlay missing");

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Canvas 2D context unavailable");

        await new Promise((resolve) => window.setTimeout(resolve, 250));
        for (const src of scripts) {
          await loadScript(src);
        }

        if (cancelled) return;
        if (window.KamdridiWarMachines?.createGame) {
          gameRef.current = window.KamdridiWarMachines.createGame(canvas, overlay, startRef.current, {
            onFps: setFps
          });
        } else {
          overlay.style.display = "none";
          gameRef.current = { destroy: () => undefined };
        }

        console.log("Act II Qwen engine initialized on client");
        setInitState("ready");
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown engine error";
        console.error("War Machines init error:", err);
        setError(message);
        setInitState("error");
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
      document.body.style.overflow = previousOverflow;
      gameRef.current?.destroy();
      gameRef.current = null;
    };
  }, []);

  return (
    <main className="fixed inset-0 z-[99999] isolate bg-[#050403] text-white">
      <section className="h-full">
        <div className="h-full overflow-hidden bg-black shadow-[0_34px_140px_rgba(0,0,0,0.62)]">
          <div id="war-machines-root" className="relative h-full">
            <canvas
              ref={canvasRef}
              id="game-canvas"
              className="block h-svh w-full touch-none bg-black"
            />

            <Link
              href="/games"
              className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-[#f4c66a]/25 bg-black/55 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-stone-300 backdrop-blur transition hover:text-[#f4c66a]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Link>

            <div className="pointer-events-none absolute right-3 top-3 rounded border border-[#f4c66a]/30 bg-black/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#f4c66a]">
              FPS {fps}
            </div>

            <div className="wm-mobile-controls pointer-events-none absolute inset-x-0 bottom-5 z-10 flex items-end justify-between px-4 md:hidden">
              <div className="pointer-events-auto flex gap-3">
                <button data-wm-control="left" type="button" aria-label="Move left">
                  L
                </button>
                <button data-wm-control="right" type="button" aria-label="Move right">
                  R
                </button>
              </div>
              <div className="pointer-events-auto flex items-end gap-3">
                <button data-wm-control="reload" type="button" aria-label="Reload" className="wm-control-small">
                  R
                </button>
                <button data-wm-control="dash" type="button" aria-label="Dash" className="wm-control-small">
                  D
                </button>
                <button data-wm-control="fire" type="button" aria-label="Fire" className="wm-control-fire">
                  FIRE
                </button>
              </div>
            </div>

            {initState === "error" ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-red-950/88 p-6 text-center">
                <div className="max-w-xl border border-red-300/40 bg-black/65 p-5">
                  <p className="text-xs uppercase tracking-[0.34em] text-red-200">Engine Error</p>
                  <p className="mt-3 font-mono text-sm text-red-100">{error}</p>
                </div>
              </div>
            ) : null}

            <div
              ref={overlayRef}
              id="war-machines-overlay"
              className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/48 text-center"
            >
              <div className="mx-4 max-w-3xl">
                <p className="text-xs uppercase tracking-[0.44em] text-[#f4c66a]">
                  {initState === "loading" ? "Initialisation moteur..." : "KAMDRIDI Game Lab"}
                </p>
                <h1 className="mt-4 font-display text-5xl uppercase leading-none tracking-[0.06em] text-[#f3dfb6] md:text-7xl">
                  ACT II
                  <br />
                  War Machines
                </h1>
                <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-stone-300">
                  Shoot on beat. Collect gold orbs. Break the K-01 reactor.
                </p>
                <button
                  ref={startRef}
                  id="war-machines-start"
                  disabled={initState !== "ready"}
                  className="pointer-events-auto mt-7 rounded-full bg-[#f4c66a] px-7 py-3 text-xs font-bold uppercase tracking-[0.26em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989] disabled:cursor-wait disabled:opacity-60"
                >
                  {initState === "loading" ? "Loading Engine" : "Start Protocol"}
                </button>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden flex-wrap items-center justify-between gap-3 border-t border-[#f4c66a]/15 bg-[#080604]/78 px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-stone-400 backdrop-blur md:flex">
              <span>WASD / Arrows move</span>
              <span>Space dash</span>
              <span>Click / J fire</span>
              <span>R reload</span>
              <span>Mobile controls enabled</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
