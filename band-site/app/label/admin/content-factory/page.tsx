import type { Metadata } from "next";
import { ContentGenerator } from "@/components/label/content-generator";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Content Factory - Label Admin",
  description: "AI Social Robot Content Generator."
};

export default function ContentFactoryPage() {
  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <Link href="/label/admin" className="inline-flex items-center gap-2 text-[#f4c66a] hover:text-white transition mb-6 text-sm uppercase tracking-widest">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Factory Level 2</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] md:text-7xl mb-12">
          Content
          <br />
          Factory
        </h1>
        
        <ContentGenerator />
        
      </div>
    </main>
  );
}
