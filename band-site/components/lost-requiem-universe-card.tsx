"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { LanguageCode, dictionaries } from "@/components/lost-requiem/lost-requiem-translations";

export function LostRequiemUniverseCard() {
  const [language, setLanguage] = useState<LanguageCode>("en");

  useEffect(() => {
    const stored = localStorage.getItem("lr_lang_preference") as LanguageCode;
    if (stored && ["de", "en", "fr"].includes(stored)) {
      setLanguage(stored);
    }
  }, []);

  const t = dictionaries[language];

  return (
    <Link
      href="/the-lost-requiem"
      className="group relative block overflow-hidden border border-[#c98542]/40 bg-black/60 transition hover:-translate-y-1 hover:border-[#f4c66a]/70"
    >
      <div className="absolute left-3 top-3 z-10 inline-flex items-center rounded-full border border-[#f4c66a]/35 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f4c66a] shadow-[0_2px_10px_rgba(0,0,0,0.5)] backdrop-blur-sm">
        Featured Experience
      </div>
      <div className="relative aspect-[16/10] sm:aspect-[21/9] lg:aspect-[3/1]">
        <Image 
          src="/the-lost-requiem/images/02-museum-case-hero.webp" 
          alt={t.hero.heroAlt} 
          fill 
          sizes="100vw"
          className="object-cover transition duration-500 group-hover:scale-105" 
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_60%,rgba(0,0,0,0.5)_100%)]" />
      </div>
      <div className="p-4 text-center sm:p-6">
        <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-[#e8b777]">The Lost Requiem</h3>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-stone-300">{t.hero.description}</p>
        <span className="mt-5 inline-flex items-center justify-center border border-[#c98542]/30 px-6 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e8b777] transition group-hover:border-[#f4c66a]/60">
          {t.hero.enterButton}
        </span>
      </div>
    </Link>
  );
}
