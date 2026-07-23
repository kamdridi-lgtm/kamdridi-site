"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ShoppingCart, Loader2, RefreshCw, Layers } from "lucide-react";
import { CTAButton, Section } from "@/components/ui";

function DraggableLayer({ item, updateItem, removeItem, isImage = false }: { item: any, updateItem: any, removeItem?: any, isImage?: boolean }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startScale, setStartScale] = useState(1);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('.resize-handle')) {
      setIsResizing(true);
      setStartPos({ x: e.clientX, y: e.clientY });
      setStartScale(item.scale || 1);
    } else {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - item.x,
        y: e.clientY - item.y
      });
    }
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    e.stopPropagation();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDragging) {
      updateItem(item.id, { x: e.clientX - startPos.x, y: e.clientY - startPos.y });
    } else if (isResizing) {
      const dx = e.clientX - startPos.x;
      const newScale = Math.max(0.2, startScale + dx * 0.02);
      updateItem(item.id, { scale: newScale });
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    setIsResizing(false);
    (e.currentTarget as Element).releasePointerCapture(e.pointerId);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.stopPropagation();
    // Delta Y dictates scale up/down. We use a small multiplier for smooth wheel scaling.
    const delta = e.deltaY * -0.005;
    const currentScale = item.scale || 1;
    const newScale = Math.max(0.2, currentScale + delta);
    updateItem(item.id, { scale: newScale });
  };

  return (
    <div
      className="absolute cursor-move group touch-none"
      style={{ 
        left: item.x, 
        top: item.y, 
        transform: `scale(${item.scale || 1})`,
        transformOrigin: 'top left',
        width: isImage ? 192 : 80,
        height: isImage ? 192 : 80,
        zIndex: isImage ? 20 : 30
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onWheel={handleWheel}
    >
      <div className={`relative w-full h-full pointer-events-none ${isImage ? 'rounded-md overflow-hidden mix-blend-screen' : 'mix-blend-screen'}`}>
        <Image src={item.src} alt="layer" fill className="object-cover" unoptimized />
      </div>
      
      {removeItem && (
        <button 
          className="absolute -top-3 -right-3 bg-red-500/80 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm opacity-0 group-hover:opacity-100 z-40 transition-opacity"
          onPointerDown={(e) => { 
            e.stopPropagation(); 
            removeItem(item.id);
          }}
        >
          ×
        </button>
      )}

      <div 
        className="resize-handle absolute -bottom-2 -right-2 w-5 h-5 bg-[#f4c66a] rounded-full opacity-0 group-hover:opacity-100 cursor-nwse-resize z-40 transition-opacity flex items-center justify-center border-2 border-black"
        title="Drag to resize"
      >
        <div className="w-2 h-2 bg-black rounded-full" />
      </div>
    </div>
  );
}
const BRAND_LOGOS = [
  { id: "logo1", src: "/brand/kamdridi-records-logo.png", name: "Classic" },
  { id: "logo2", src: "/brand/logo_transparent_1.png", name: "Gilded Null" },
  { id: "logo3", src: "/brand/logo_transparent_2.png", name: "Ember" }
];

export default function EchoesForge() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiImageState, setAiImageState] = useState<any>(null);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [error, setError] = useState("");
  
  // State for placed logos
  const [placedLogos, setPlacedLogos] = useState<any[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError("");
    
    try {
      const res = await fetch("/api/forge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Failed to generate design");
      
      setAiImageState({ id: 'ai-gen', src: data.imageUrl, x: 100, y: 150, scale: 1 });
      setEnhancedPrompt(data.finalPrompt);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const addLogoToDesign = (src: string) => {
    setPlacedLogos([
      ...placedLogos,
      {
        id: Date.now() + Math.random(),
        src,
        x: 150,
        y: 150,
        scale: 1
      }
    ]);
  };

  return (
    <main className="min-h-[100dvh] bg-[#050403] text-stone-200">
      <section className="relative overflow-hidden border-b border-white/10 pt-24 pb-12">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.8),#050403)] z-0" />
        <div className="pointer-events-none absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay z-0"></div>
        
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.4em] text-[#f4c66a] mb-4">Kam Dridi AI Merch Creator</p>
            <h1 className="font-display text-5xl md:text-7xl uppercase tracking-[0.1em] text-white">The Echoes Forge</h1>
            <p className="mt-6 text-sm leading-relaxed text-stone-400">
              Describe your vision. The Oracle AI will forge a unique, one-of-a-kind design in the style of the Kam Dridi cinematic universe. 
              Once generated, secure your physical custom 1-of-1 premium shirt.
            </p>
          </div>
        </div>
      </section>

      <Section className="py-12 md:py-20">
        <div className="mx-auto max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Column: T-Shirt Preview */}
          <div className="relative aspect-[3/4] w-full max-w-md mx-auto bg-black rounded-3xl border border-white/10 p-8 shadow-[0_30px_90px_rgba(0,0,0,0.5)]">
            
            {/* The T-Shirt Canvas with Clip Path Masking */}
            <div 
              className="relative w-full h-full bg-[#111] overflow-hidden transition-all duration-300"
              style={{
                clipPath: "polygon(30% 0%, 70% 0%, 100% 25%, 90% 45%, 75% 35%, 80% 100%, 20% 100%, 25% 35%, 10% 45%, 0% 25%)"
              }}
            >
              {/* Neck curve simulation (inner shadow) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[45%] h-8 bg-black rounded-[50%] -translate-y-1/2 opacity-60 z-50 pointer-events-none" />

              {/* Placed Logos Overlay */}
              {placedLogos.map(logo => (
                <DraggableLayer 
                  key={logo.id} 
                  item={logo} 
                  updateItem={(id: string, updates: any) => setPlacedLogos(prev => prev.map(l => l.id === id ? { ...l, ...updates } : l))}
                  removeItem={(id: string) => setPlacedLogos(prev => prev.filter(l => l.id !== id))}
                />
              ))}

              {/* Generated Design Overlay */}
              <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none mt-10">
                {isGenerating && (
                  <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-10 w-10 animate-spin text-[#f4c66a]" />
                    <span className="text-[10px] uppercase tracking-widest text-[#f4c66a] animate-pulse">Forging Artefact...</span>
                  </div>
                )}
                {!isGenerating && !aiImageState && (
                  <div className="w-48 h-48 border border-dashed border-white/20 flex items-center justify-center text-center p-4 text-[10px] uppercase tracking-widest text-stone-500">
                    Design will appear here
                  </div>
                )}
              </div>
              
              {!isGenerating && aiImageState && (
                <DraggableLayer 
                  item={aiImageState} 
                  updateItem={(id: string, updates: any) => setAiImageState((prev: any) => prev ? { ...prev, ...updates } : null)}
                  isImage={true}
                />
              )}
            </div>
            
            {/* Details */}
            <div className="absolute bottom-4 left-4 right-4 text-center z-50 pointer-events-none">
              <span className="bg-black/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-[9px] uppercase tracking-widest text-stone-400">
                Premium Heavyweight Cotton • 1 of 1 Edition
              </span>
            </div>
          </div>

          {/* Right Column: Controls */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-xl font-display uppercase tracking-widest text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#f4c66a]" /> Step 1: Envision
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed">
                Describe any element from the lore: "a lone cyborg wandering the salt flats", "the neon sign of Echoes Brasil", or "a skull forged from molten gold".
              </p>
              
              <div className="relative">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                  placeholder="E.g., A shattered guitar glowing with red neon in a dark alleyway..."
                  className="w-full h-32 bg-black border-2 border-white/10 rounded-xl p-4 text-sm text-white focus:border-[#f4c66a] outline-none resize-none transition-colors disabled:opacity-50"
                />
              </div>

              {error && <p className="text-red-500 text-xs">{error}</p>}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !prompt.trim()}
                className="w-full flex items-center justify-center gap-2 bg-[#f4c66a] text-black py-4 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-colors disabled:opacity-50"
              >
                {isGenerating ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                {isGenerating ? "Synthesizing..." : "Forge Design"}
              </button>
            </div>
            
            <div className="space-y-4 pt-6 border-t border-white/10">
              <h2 className="text-xl font-display uppercase tracking-widest text-white flex items-center gap-2">
                <Layers className="h-5 w-5 text-[#f4c66a]" /> Step 2: Brand Placement
              </h2>
              <p className="text-sm text-stone-400 leading-relaxed">
                Add official Kam Dridi logos. Drag to position them anywhere on the garment to finalize your custom piece.
              </p>
              <div className="grid grid-cols-3 gap-3">
                {BRAND_LOGOS.map(logo => (
                  <button
                    key={logo.id}
                    onClick={() => addLogoToDesign(logo.src)}
                    className="flex flex-col items-center justify-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-[#f4c66a] transition-all"
                  >
                    <div className="relative w-12 h-12 mix-blend-screen bg-black rounded-lg">
                      <Image src={logo.src} alt={logo.name} fill className="object-contain" unoptimized />
                    </div>
                    <span className="text-[10px] uppercase tracking-widest text-stone-300">{logo.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {aiImageState && (
              <GarmentConfiguration 
                imageUrl={aiImageState.src} 
                enhancedPrompt={enhancedPrompt} 
                placedLogos={placedLogos}
              />
            )}
          </div>
        </div>
      </Section>
    </main>
  );
}

function GarmentConfiguration({ imageUrl, enhancedPrompt, placedLogos }: { imageUrl: string, enhancedPrompt: string, placedLogos: any[] }) {
  const [gender, setGender] = useState("men");
  const [sleeves, setSleeves] = useState("short");
  const [printSides, setPrintSides] = useState("front");

  let basePrice = 45;
  if (sleeves === "long") basePrice += 10;
  if (printSides === "both") basePrice += 15;

  const checkoutUrl = `/checkout-ppv?item=${encodeURIComponent("Echoes Forge Custom Merch")}&gender=${gender}&sleeves=${sleeves}&printSides=${printSides}&imageUrl=${encodeURIComponent(imageUrl)}&logos=${placedLogos.length}`;

  return (
    <div className="space-y-6 pt-8 border-t border-white/10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mb-2">Myriam's Translation</h3>
        <p className="text-xs text-stone-300 italic border-l-2 border-[#f4c66a]/50 pl-3">
          "{enhancedPrompt}"
        </p>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-[10px] uppercase tracking-[0.2em] text-stone-500">Step 3: Garment Specs</h3>
        
        <div className="space-y-3">
          <div>
            <label className="text-xs uppercase tracking-widest text-stone-400 block mb-2">Cut / Fit</label>
            <div className="grid grid-cols-3 gap-2">
              {['men', 'women', 'unisex'].map(v => (
                <button 
                  key={v}
                  onClick={() => setGender(v)}
                  className={`py-2 text-[10px] uppercase tracking-widest border rounded-md transition-colors ${gender === v ? 'border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]' : 'border-white/10 text-stone-400 hover:border-white/30'}`}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-widest text-stone-400 block mb-2">Sleeve Length</label>
            <div className="grid grid-cols-2 gap-2">
              {[{ id: 'short', label: 'Short Sleeve' }, { id: 'long', label: 'Long Sleeve (+$10)' }].map(v => (
                <button 
                  key={v.id}
                  onClick={() => setSleeves(v.id)}
                  className={`py-2 text-[10px] uppercase tracking-widest border rounded-md transition-colors ${sleeves === v.id ? 'border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]' : 'border-white/10 text-stone-400 hover:border-white/30'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-xs uppercase tracking-widest text-stone-400 block mb-2">Print Coverage</label>
            <div className="grid grid-cols-3 gap-2">
              {[{ id: 'front', label: 'Front Only' }, { id: 'back', label: 'Back Only' }, { id: 'both', label: 'La Totale (+$15)' }].map(v => (
                <button 
                  key={v.id}
                  onClick={() => setPrintSides(v.id)}
                  className={`py-2 text-[10px] uppercase tracking-widest border rounded-md transition-colors ${printSides === v.id ? 'border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]' : 'border-white/10 text-stone-400 hover:border-white/30'}`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[linear-gradient(180deg,rgba(214,106,22,0.1),rgba(143,50,8,0.05))] border border-[#f4a33f]/30 rounded-xl p-6 mt-6">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-lg font-display uppercase tracking-widest text-white">Custom Artifact</h2>
            <p className="text-xs text-[#f4c66a] uppercase tracking-widest mt-1">1-of-1 Edition</p>
          </div>
          <p className="text-2xl font-bold font-mono text-white">${basePrice}.00</p>
        </div>
        
        <Link 
          href={checkoutUrl}
          className="w-full flex items-center justify-center gap-2 border border-[#f4a33f]/70 bg-[linear-gradient(180deg,#d66a16,#8f3208)] py-4 text-xs font-bold uppercase tracking-[0.18em] text-white hover:border-[#ffd18a] transition-all shadow-[0_10px_30px_rgba(201,82,16,0.3)]"
        >
          <ShoppingCart className="h-4 w-4" /> Secure Physical Artefact
        </Link>
        <p className="text-center text-[9px] uppercase tracking-widest text-stone-500 mt-4">
          Printed via Print-on-Demand. Ships globally in 3-5 days.
        </p>
      </div>
    </div>
  );
}

