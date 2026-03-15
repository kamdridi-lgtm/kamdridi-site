"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Gamepad2, Menu, User, X } from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { navigation, siteMeta, socialLinks } from "@/data/site";
import { useApp } from "@/components/providers";

function SocialBar() {
  return (
    <div className="border-b border-white/10 bg-black/30">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.35em] text-stone-300 sm:px-6">
        <span className="text-stone-500">Streaming + social</span>
        <div className="flex flex-wrap gap-4">
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-[#f4c66a]"
            >
              {link.label}
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
  const { fan } = useApp();

  return (
    <div className="min-h-screen bg-[#090909] text-white">
      <SocialBar />
      <header className="sticky top-0 z-50 border-b border-white/10 bg-[#090909]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
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
                  <div className="pointer-events-none absolute left-0 top-full mt-4 w-64 translate-y-2 rounded-2xl border border-white/10 bg-black/90 p-3 opacity-0 shadow-2xl shadow-black/40 transition duration-300 group-hover:pointer-events-auto group-hover:translate-y-0 group-hover:opacity-100">
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
                ) : null}
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/fan-club"
              className="hidden rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-stone-200 transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a] md:inline-flex"
            >
              <User className="mr-2 h-4 w-4" />
              {fan ? fan.name : "Fan Club"}
            </Link>
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
