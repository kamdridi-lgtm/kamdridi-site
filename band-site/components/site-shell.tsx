"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Facebook, Gamepad2, Instagram, Menu, Music2, X, Youtube } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { navigation, siteMeta, socialLinks } from "@/data/site";

function IconBase({
  children,
  viewBox = "0 0 24 24"
}: {
  children: React.ReactNode;
  viewBox?: string;
}) {
  return (
    <svg viewBox={viewBox} aria-hidden="true" className="h-4 w-4 fill-none stroke-current">
      {children}
    </svg>
  );
}

function SpotifyIcon() {
  return (
    <IconBase>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 10.2c2.8-1 5.9-.8 8.3.5" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8.8 13c2.1-.7 4.4-.6 6.2.4" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9.6 15.6c1.5-.4 3-.3 4.2.3" strokeWidth="1.8" strokeLinecap="round" />
    </IconBase>
  );
}

function TikTokIcon() {
  return (
    <IconBase>
      <path
        d="M14 4v8.3a3.2 3.2 0 1 1-2.4-3.1"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 4c.6 1.8 2 3.2 3.8 3.8"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function AppleMusicIcon() {
  return (
    <IconBase>
      <path
        d="M15 5v9.5a2.5 2.5 0 1 1-1.8-2.4V7.2L9 8.2v7.3a2.5 2.5 0 1 1-1.8-2.4V6.8L15 5Z"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function XIcon() {
  return (
    <IconBase>
      <path d="M5 5l14 14M19 5 5 19" strokeWidth="1.8" strokeLinecap="round" />
    </IconBase>
  );
}

const socialIcons: Record<string, React.ReactNode> = {
  YouTube: <Youtube className="h-4 w-4" />,
  Instagram: <Instagram className="h-4 w-4" />,
  TikTok: <TikTokIcon />,
  Spotify: <SpotifyIcon />,
  "Apple Music": <AppleMusicIcon />,
  Facebook: <Facebook className="h-4 w-4" />,
  Twitter: <XIcon />
};

function SocialBar() {
  return (
    <div className="border-b border-white/10 bg-black/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.35em] text-stone-300 sm:px-6">
        <span className="text-stone-500">Streaming + social</span>
        <div className="flex flex-wrap items-center gap-3">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              title={link.label}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a]"
            >
              {socialIcons[link.label] ?? <Music2 className="h-4 w-4" />}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <SocialBar />
      <header className="sticky top-0 z-[1000] border-b border-white/10 bg-[#090909]/85 backdrop-blur-xl">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-full border border-[#f4c66a]/40 bg-[#111] shadow-[0_0_30px_rgba(244,198,106,0.15)]">
              <Image src="/assets/images/logo.png" alt="KAMDRIDI logo" fill className="object-contain p-1.5" />
            </div>
            <div>
              <p className="font-display text-2xl uppercase tracking-[0.25em] text-[#f4c66a]">
                {siteMeta.bandName}
              </p>
              <p className="text-xs uppercase tracking-[0.35em] text-stone-400">
                echoes unearthed universe
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 lg:flex">
            {navigation.map((item) => (
              <div key={item.label} className="group relative">
                <Link
                  href={item.href}
                  className={clsx(
                    "text-sm uppercase tracking-[0.28em] text-stone-200 transition hover:text-[#f4c66a]",
                    pathname === item.href && "text-[#f4c66a]"
                  )}
                >
                  {item.label}
                </Link>
                {item.children ? (
                  <div className="invisible absolute left-0 top-full z-[2000] pt-4 opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100">
                    <div className="pointer-events-auto w-64 rounded-2xl border border-white/10 bg-black/90 p-3 shadow-2xl shadow-black/40">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-stone-300 transition hover:bg-white/5 hover:text-[#f4c66a]"
                        >
                          {child.label}
                          <ChevronRight className="h-4 w-4 opacity-50" />
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/games"
              className="inline-flex items-center rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-stone-200 transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a]"
            >
              <Gamepad2 className="mr-2 h-4 w-4" />
              Games
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex rounded-full border border-white/10 p-3 text-stone-200 transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a] lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-white/10 px-4 py-4 lg:hidden">
            <div className="flex flex-col gap-2">
              {navigation.map((item) => (
                <div key={item.label} className="rounded-2xl border border-white/5 bg-white/[0.03] p-3">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block text-sm uppercase tracking-[0.28em] text-white"
                  >
                    {item.label}
                  </Link>
                  {item.children ? (
                    <div className="mt-3 grid gap-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={() => setOpen(false)}
                          className="text-sm text-stone-400 transition hover:text-[#f4c66a]"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </header>

      <main>{children}</main>

      <footer className="border-t border-white/10 bg-black/60">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div>
            <p className="font-display text-3xl uppercase tracking-[0.24em] text-[#f4c66a]">
              {siteMeta.bandName}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-7 text-stone-400">
              {siteMeta.tagline} Built as a living fan universe with music, games, visual-album
              layers, collector drops, and fan-club access ready for expansion.
            </p>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Navigate</p>
            <div className="mt-4 grid gap-2">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-stone-300 transition hover:text-[#f4c66a]"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">Contact</p>
            <div className="mt-4 grid gap-2 text-sm text-stone-300">
              <p>{siteMeta.email}</p>
              <p>Booking, press, management, licensing</p>
              <p className="text-stone-500">(c) 2026 KAMDRIDI</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
