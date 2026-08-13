"use client";

import { useState } from "react";
import { featuredVideo } from "@/data/site";

export function ActiveSignalsTV() {
  const [channel, setChannel] = useState(2);

  return (
    <div className="group relative overflow-hidden border border-[#8f5728]/35 bg-black/55 shadow-[0_0_30px_rgba(244,198,106,0.05)] transition-all duration-500 hover:border-[#f4c66a]/50 hover:shadow-[0_0_40px_rgba(244,198,106,0.15)] flex flex-col">
      <div className="aspect-video relative bg-black">
        {channel === 1 && (
          <iframe
            className="h-full w-full border-none"
            src={featuredVideo.embedUrl}
            title={featuredVideo.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}
        {channel === 2 && (
          <video autoPlay controls className="h-full w-full" poster="/kamdridi-hero.jpg">
            <source src="/videos/too-fast-too-young-master.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {channel === 3 && (
          <video autoPlay controls className="h-full w-full" poster="/kamdridi-hero.jpg">
            <source src="/videos/our-lost-dreams-v5.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
      <div className="flex flex-col sm:flex-row border-t border-[#8f5728]/35 bg-black p-2 gap-2">
        <button
          onClick={() => setChannel(1)}
          className={`flex-1 border px-3 py-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest transition-colors ${
            channel === 1
              ? "border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]"
              : "border-white/10 text-stone-500 hover:border-[#8f5728]/50 hover:text-stone-300"
          }`}
        >
          CH 1: WAR MACHINES
        </button>
        <button
          onClick={() => setChannel(2)}
          className={`flex-1 border px-3 py-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest transition-colors ${
            channel === 2
              ? "border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]"
              : "border-white/10 text-stone-500 hover:border-[#8f5728]/50 hover:text-stone-300"
          }`}
        >
          CH 2: TOO FAST TOO YOUNG
        </button>
        <button
          onClick={() => setChannel(3)}
          className={`flex-1 border px-3 py-3 text-[10px] sm:text-xs font-mono uppercase tracking-widest transition-colors ${
            channel === 3
              ? "border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]"
              : "border-white/10 text-stone-500 hover:border-[#8f5728]/50 hover:text-stone-300"
          }`}
        >
          CH 3: OUR LOST DREAMS
        </button>
      </div>
    </div>
  );
}
