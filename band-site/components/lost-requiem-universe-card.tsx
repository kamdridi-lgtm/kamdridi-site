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
      className="group overflow-hidden border border-white/10 bg-black/50 transition hover:-translate-y-1 hover:border-[#f4c66a]/50"
    >
      <div className="relative aspect-[16/10]">
        <Image 
          src="/the-lost-requiem/images/02-museum-case-hero.webp" 
          alt={t.hero.heroAlt} 
          fill 
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105" 
        />
      </div>
      <div className="p-4 text-center">
        <h3 className="font-display text-xl uppercase tracking-[0.08em] text-[#e8b777]">The Lost Requiem</h3>
        <p className="mt-2 text-sm leading-6 text-stone-400">{t.hero.description}</p>
        <span className="mt-4 inline-block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c98542]">
          {t.hero.enterButton}
        </span>
      </div>
    </Link>
  );
}
