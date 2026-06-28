import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function WarMachinesQwenPage() {
  return (
    <main className="fixed inset-0 z-[99999] bg-black text-white">
      <iframe
        title="KAMDRIDI War Machines Qwen Original"
        src="/games/war-machines-qwen/index.html"
        className="h-svh w-full border-0 bg-black"
        allow="autoplay; fullscreen; clipboard-write"
      />

      <Link
        href="/games"
        className="absolute left-3 top-3 z-10 inline-flex items-center gap-2 rounded-full border border-[#f4c66a]/25 bg-black/60 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-stone-300 backdrop-blur transition hover:text-[#f4c66a]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Compare
      </Link>

      <div className="pointer-events-none absolute right-3 top-3 rounded-full border border-[#00f5ff]/30 bg-black/70 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#00f5ff] backdrop-blur">
        Qwen original isolated
      </div>
    </main>
  );
}

