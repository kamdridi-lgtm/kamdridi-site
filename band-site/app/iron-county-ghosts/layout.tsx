import Link from "next/link";
import { IronCountyGhostsLogo } from "@/components/iron-county-ghosts-logo";

const navItems = [
  { label: "Home", href: "/iron-county-ghosts" },
  { label: "Music", href: "/iron-county-ghosts/music" },
  { label: "Lyrics", href: "/iron-county-ghosts/lyrics" },
  { label: "Photos", href: "/iron-county-ghosts/photos" },
  { label: "Videos", href: "/iron-county-ghosts/videos" },
  { label: "EPK", href: "/iron-county-ghosts/epk" },
  { label: "Contact", href: "/iron-county-ghosts/contact" }
];

export default function IronCountyGhostsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080503] text-stone-100">
      <header className="fixed left-0 right-0 top-0 z-50 border-b border-[#c9903d]/20 bg-[#080503]/82 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-2 md:py-4">
          <Link href="/iron-county-ghosts" className="min-w-0">
            <p className="text-[8px] uppercase tracking-[0.17em] text-[#d9a95d] md:text-[10px] md:tracking-[0.28em]">KAMDRIDI RECORDS presents</p>
            <IronCountyGhostsLogo className="mt-0.5 max-h-11 w-24 drop-shadow-[0_8px_18px_rgba(0,0,0,.72)] sm:w-28 md:mt-1 md:max-h-24 md:w-52" />
          </Link>
          <nav className="hidden flex-wrap items-center justify-end gap-3 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[10px] font-bold uppercase tracking-[0.16em] text-stone-300 transition hover:text-[#d9a95d] lg:text-[11px] lg:tracking-[0.2em]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <nav className="grid grid-cols-4 gap-1.5 px-4 pb-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full border border-[#d9a95d]/25 px-2 py-1.5 text-center text-[9px] font-bold uppercase tracking-[0.08em] text-[#d9a95d]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className="border-t border-[#c9903d]/20 bg-black/50 px-5 py-10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em] text-[#d9a95d]">IRON COUNTY GHOSTS</p>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-400">
              IRON COUNTY GHOSTS is a fictional AI-assisted country-rock project created and produced by KAMDRIDI RECORDS.
            </p>
          </div>
          <Link href="/label/ai-artists/iron-county-ghosts" className="text-xs uppercase tracking-[0.24em] text-stone-500 hover:text-[#d9a95d]">
            Label profile
          </Link>
        </div>
      </footer>
    </div>
  );
}
