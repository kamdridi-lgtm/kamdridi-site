"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  ChevronRight,
  Gamepad2,
  Menu,
  Music2,
  ShoppingBag,
  X,
} from "lucide-react";
import { useState } from "react";
import clsx from "clsx";
import { navigation, siteMeta, socialLinks } from "@/data/site";
import { CartDrawer } from "@/components/cart-drawer";
import { useApp } from "@/components/providers";
const brandLogo = "/assets/images/kamdridi-logo-hd.png";
const salieriReleaseHref = "/releases/salieris-hands";
const salieriPanelImage =
  "/assets/images/salieris-hands/front-cover-approved.png";
function AustraliaCollectorIcon() {
  return (
    <svg viewBox="0 0 48 48" aria-hidden="true" className="h-full w-full">
      <defs>
        <linearGradient id="aus-vinyl-rim" x1="8" y1="6" x2="40" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f5ddaa" />
          <stop offset="0.48" stopColor="#8b6a37" />
          <stop offset="1" stopColor="#fff0c5" />
        </linearGradient>
        <radialGradient id="aus-vinyl-face" cx="0" cy="0" r="1" gradientTransform="translate(18 14) rotate(47) scale(38)">
          <stop stopColor="#24384e" />
          <stop offset="0.5" stopColor="#070a0e" />
          <stop offset="1" stopColor="#020203" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="24" r="21.5" fill="url(#aus-vinyl-rim)" />
      <circle cx="24" cy="24" r="19.5" fill="url(#aus-vinyl-face)" stroke="#111820" />
      <path d="M24 4.5A19.5 19.5 0 0 0 6.2 32l17.8-8Z" fill="#b3212c" fillOpacity=".82" />
      <path d="M24 4.5A19.5 19.5 0 0 1 42.4 30.5L24 24Z" fill="#174a83" fillOpacity=".9" />
      <circle cx="24" cy="24" r="15.5" fill="none" stroke="#f5ddaa" strokeOpacity=".18" />
      <circle cx="24" cy="24" r="11.7" fill="none" stroke="#f5ddaa" strokeOpacity=".16" />
      <circle cx="24" cy="24" r="8" fill="#07090c" stroke="#d8b875" strokeWidth=".8" />
      <circle cx="24" cy="24" r="2.1" fill="#e8ce93" />
      <path d="m33.8 10.5.8 1.7 1.8.2-1.3 1.3.3 1.8-1.6-.9-1.6.9.3-1.8-1.3-1.3 1.8-.2.8-1.7Zm4.2 7.7.55 1.16 1.28.16-.92.9.22 1.25-1.13-.6-1.13.6.22-1.25-.92-.9 1.28-.16.55-1.16Zm-6.4 3.1.62 1.3 1.43.18-1.03 1 .25 1.42-1.27-.68-1.27.68.25-1.42-1.03-1 1.43-.18.62-1.3Z" fill="#fff7db" />
      <text x="24" y="36.5" textAnchor="middle" fill="#fff0c5" fontSize="5.6" fontWeight="900" letterSpacing="1.1">17</text>
    </svg>
  );
}
function SpotifyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      {" "}
      <circle cx="12" cy="12" r="10" fill="#1DB954" />{" "}
      <path
        d="M7.3 9.65c3.15-.92 6.4-.68 9.34.98M7.8 12.45c2.55-.73 5.08-.54 7.42.77M8.45 15.05c1.78-.47 3.7-.35 5.38.54"
        fill="none"
        stroke="#0b0b0b"
        strokeLinecap="round"
        strokeWidth="1.55"
      />{" "}
    </svg>
  );
}
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      {" "}
      <path
        d="M15.45 4.15v8.05a4.35 4.35 0 1 1-3.7-4.3v2.7a1.68 1.68 0 1 0 1.1 1.58V4.15h2.6Z"
        fill="#25F4EE"
      />{" "}
      <path
        d="M16.75 5.42c.86 1.34 2.05 2.1 3.45 2.28v2.7c-1.6-.08-2.78-.5-3.45-1.05v3.68a4.35 4.35 0 0 1-6.45 3.82 4.35 4.35 0 0 0 7.76-2.68V9.9c.67.55 1.85.97 3.45 1.05V8.25c-1.4-.18-2.6-.94-3.45-2.28-.44-.25-.86-.43-1.31-.55Z"
        fill="#FE2C55"
      />{" "}
      <path
        d="M14.3 4.15v8.03a1.68 1.68 0 1 1-1.1-1.58V7.9a4.35 4.35 0 1 0 3.7 4.3V4.15h-2.6Zm2.6 0c.56 1.95 1.74 3.22 3.3 3.55v2.7c-1.5-.1-2.62-.5-3.3-1.05v-5.2Z"
        fill="#fff"
      />{" "}
    </svg>
  );
}
function AppleMusicIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      {" "}
      <defs>
        {" "}
        <linearGradient
          id="apple-music-gradient"
          x1="5"
          x2="19"
          y1="19"
          y2="5"
          gradientUnits="userSpaceOnUse"
        >
          {" "}
          <stop stopColor="#FA233B" /> <stop offset="0.5" stopColor="#FB5C74" />{" "}
          <stop offset="1" stopColor="#A64DFF" />{" "}
        </linearGradient>{" "}
      </defs>{" "}
      <rect
        width="20"
        height="20"
        x="2"
        y="2"
        rx="5"
        fill="url(#apple-music-gradient)"
      />{" "}
      <path
        d="M16.2 6.15v8.02a2.38 2.38 0 1 1-1.55-2.23V8.4l-5.05.95v6.1a2.38 2.38 0 1 1-1.55-2.24V7.6l8.15-1.45Z"
        fill="#fff"
      />{" "}
    </svg>
  );
}
function XIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      {" "}
      <rect width="20" height="20" x="2" y="2" rx="10" fill="#fff" />{" "}
      <path
        d="M13.9 10.6 19.1 4.6h-1.24l-4.5 5.16-3.59-5.16H5.6l5.45 7.82-5.45 6.23h1.24l4.76-5.43 3.8 5.43h4.17l-5.67-8.05Zm-1.69 1.93-.55-.78-4.4-6.22h1.92l3.54 5 .55.78 4.62 6.54h-1.92l-3.76-5.32Z"
        fill="#000"
      />{" "}
    </svg>
  );
}
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      {" "}
      <rect width="21" height="15" x="1.5" y="4.5" rx="4" fill="#FF0000" />{" "}
      <path d="m10 8.35 6 3.65-6 3.65v-7.3Z" fill="#fff" />{" "}
    </svg>
  );
}
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      {" "}
      <defs>
        {" "}
        <radialGradient id="instagram-gradient" cx="30%" cy="107%" r="130%">
          {" "}
          <stop offset="0" stopColor="#fdf497" />{" "}
          <stop offset="0.2" stopColor="#fdf497" />{" "}
          <stop offset="0.45" stopColor="#fd5949" />{" "}
          <stop offset="0.65" stopColor="#d6249f" />{" "}
          <stop offset="1" stopColor="#285AEB" />{" "}
        </radialGradient>{" "}
      </defs>{" "}
      <rect
        width="20"
        height="20"
        x="2"
        y="2"
        rx="5.5"
        fill="url(#instagram-gradient)"
      />{" "}
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
      />{" "}
      <circle cx="17.2" cy="6.8" r="1.2" fill="#fff" />{" "}
    </svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
      {" "}
      <circle cx="12" cy="12" r="10" fill="#1877F2" />{" "}
      <path
        d="M13.35 18v-5.48h1.85l.28-2.14h-2.13V9.02c0-.62.17-1.04 1.06-1.04h1.14V6.06c-.2-.03-.87-.08-1.66-.08-1.64 0-2.76 1-2.76 2.84v1.56H9.28v2.14h1.85V18h2.22Z"
        fill="#fff"
      />{" "}
    </svg>
  );
}
const socialIcons: Record<string, React.ReactNode> = {
  YouTube: <YouTubeIcon />,
  Instagram: <InstagramIcon />,
  TikTok: <TikTokIcon />,
  Spotify: <SpotifyIcon />,
  "Apple Music": <AppleMusicIcon />,
  Facebook: <FacebookIcon />,
  Twitter: <XIcon />,
};
const socialBrandClasses: Record<string, string> = {
  YouTube:
    "border-[#ff0000]/35 bg-[#ff0000]/10 hover:border-[#ff0000]/70 hover:bg-[#ff0000]/18",
  Instagram:
    "border-[#d6249f]/35 bg-[radial-gradient(circle_at_28%_110%,rgba(253,244,151,0.18),rgba(253,89,73,0.14)_36%,rgba(214,36,159,0.12)_58%,rgba(40,90,235,0.12))] hover:border-[#fd5949]/70",
  TikTok:
    "border-[#25f4ee]/35 bg-[#fe2c55]/10 hover:border-[#25f4ee]/70 hover:bg-[#fe2c55]/16",
  Spotify:
    "border-[#1db954]/35 bg-[#1db954]/10 hover:border-[#1db954]/70 hover:bg-[#1db954]/16",
  "Apple Music":
    "border-[#fa233b]/35 bg-[#fa233b]/10 hover:border-[#fb5c74]/70 hover:bg-[#fa233b]/16",
  Facebook:
    "border-[#1877f2]/35 bg-[#1877f2]/10 hover:border-[#1877f2]/70 hover:bg-[#1877f2]/16",
  Twitter:
    "border-white/35 bg-white/10 hover:border-white/70 hover:bg-white/16",
};
const footerRoutes = [
  { label: "Home", href: "/" },
  { label: "Music", href: "/music" },
  { label: "Label", href: "/label" },
  { label: "Submit", href: "/submit" },
  { label: "Roster", href: "/roster" },
  { label: "Releases", href: "/releases" },
  { label: "Lost Requiem", href: "/the-lost-requiem" },
  { label: "Store", href: "/store" },
  { label: "Contact", href: "/contact" },
];
const mobileRoutes = [
  { label: "Home", href: "/" },
  { label: "ORACLE (MYRIAM)", href: "/myriam" },
  { label: "Music", href: "/music" },
  { label: "Store", href: "/store" },
  { label: "Label", href: "/label" },
  { label: "Submit Music", href: "/submit" },
  { label: "Roster", href: "/roster" },
  { label: "Releases", href: "/releases" },
  { label: "NEW · SALIERI’S HANDS", href: salieriReleaseHref, special: true },
  { label: "Lost Requiem", href: "/the-lost-requiem" },
  { label: "IRON COUNTY GHOSTS", href: "/iron-county-ghosts" },
  { label: "Contact", href: "/contact" },
];
const primaryNavLabels = new Set([
  "Home",
  "ORACLE (MYRIAM)",
  "Music",
  "Store",
  "Label",
  "Roster",
  "Releases",
  "Lost Requiem",
  "Submit",
  "Contact",
]);
const lowerPriorityNavLabels = new Set([
  "Japan",
  "Fan Club",
  "Games",
  "Visual Album",
  "Who is Kam Dridi",
]);
function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
function stripHash(href: string) {
  return href.split("#")[0] || href;
}
function isNavItemActive(pathname: string, item: (typeof navigation)[number]) {
  if (isActivePath(pathname, item.href)) {
    return true;
  }
  return item.children?.some((child) => {
    const childPath = stripHash(child.href);
    return childPath.startsWith("/")
      ? isActivePath(pathname, childPath)
      : false;
  });
}
function SalieriNavTab({
  mobile = false,
  active = false,
  onClick,
}: {
  mobile?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className={clsx("group relative", mobile && "w-full")}>
      {" "}
      <Link
        href={salieriReleaseHref}
        onClick={onClick}
        className={clsx(
          "nav-salieri-special",
          mobile && "nav-salieri-special-mobile",
          active && "is-active",
        )}
      >
        {" "}
        <span className="nav-salieri-badge">NEW</span>{" "}
        <span>SALIERI’S HANDS</span>{" "}
      </Link>{" "}
      {!mobile ? (
        <div className="invisible absolute left-1/2 top-full z-[2000] mt-3 w-[360px] -translate-x-1/2 translate-y-1 opacity-0 transition duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
          {" "}
          <Link
            href={salieriReleaseHref}
            className="block overflow-hidden rounded-3xl border border-[#f4c66a]/30 bg-[#120f0b]/96 shadow-2xl shadow-black/50 ring-1 ring-white/5"
          >
            {" "}
            <div className="relative aspect-[16/9]">
              {" "}
              <Image
                src={salieriPanelImage}
                alt="Salieri's Hands release art"
                fill
                className="object-cover transition duration-700 group-hover:scale-[1.03]"
              />{" "}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,6,0.08)_0%,rgba(10,8,6,0.38)_55%,rgba(10,8,6,0.9)_100%)]" />{" "}
              <div className="absolute left-3 top-3 inline-flex items-center rounded-full border border-[#f4c66a]/35 bg-black/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#f4c66a]">
                New signal
              </div>{" "}
            </div>{" "}
            <div className="space-y-2 px-4 py-4">
              {" "}
              <div className="flex items-center justify-between gap-3">
                {" "}
                <p className="text-[10px] uppercase tracking-[0.3em] text-stone-500">
                  Salieri’s Hands
                </p>{" "}
                <ChevronRight className="h-4 w-4 text-[#f4c66a]/70" />{" "}
              </div>{" "}
              <p className="text-sm font-semibold tracking-[0.08em] text-white">
                Open the release page
              </p>{" "}
              <p className="text-[13px] leading-5 text-stone-300">
                Compact collector signal with teaser, tracklist, editions, and
                merch.
              </p>{" "}
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#f4c66a]">
                Open release <ChevronRight className="h-3.5 w-3.5" />
              </span>{" "}
            </div>{" "}
          </Link>{" "}
        </div>
      ) : null}{" "}
    </div>
  );
}
function SocialBar() {
  return (
    <div className="border-b border-white/10 bg-black/30">
      {" "}
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.35em] text-stone-300 sm:px-6">
        {" "}
        <span className="text-stone-500">Streaming + social</span>{" "}
        <div className="flex flex-wrap items-center gap-3">
          {" "}
          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              aria-label={link.label}
              title={link.label}
              className={clsx(
                "inline-flex h-9 w-9 items-center justify-center rounded-full border text-white shadow-[0_10px_30px_rgba(0,0,0,0.24)] transition hover:-translate-y-0.5",
                socialBrandClasses[link.label] ??
                  "border-white/10 bg-black/40 hover:border-[#f4c66a]/50",
              )}
            >
              {" "}
              {socialIcons[link.label] ?? <Music2 className="h-4 w-4" />}{" "}
            </a>
          ))}{" "}
        </div>{" "}
      </div>{" "}
    </div>
  );
}
export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { cartCount, setCartOpen } = useApp();
  const isHome = pathname === "/";
  const isStandalonePoster = pathname === "/app/war-machines-jp";
  const isStandaloneMyriam = pathname === "/myriam";
  const isStandaloneArtistSite = pathname.startsWith("/iron-county-ghosts");
  const showCart =
    pathname === "/" ||
    pathname.startsWith("/store") ||
    pathname === salieriReleaseHref;
  const primaryNavItems = navigation.filter((item) =>
    primaryNavLabels.has(item.label),
  );
  const moreNavItems = navigation.filter((item) =>
    lowerPriorityNavLabels.has(item.label),
  );
  const isMoreActive = moreNavItems.some((item) =>
    isNavItemActive(pathname, item),
  );
  const isAustraliaCampaign = pathname === "/australia";
  const showSecondaryExplore = !isHome && pathname !== salieriReleaseHref && !isAustraliaCampaign;
  if (isStandalonePoster || isStandaloneArtistSite || isStandaloneMyriam) {
    return <>{children}</>;
  }
  return (
    <div className="min-h-screen bg-[#090909] text-white">
      {" "}
      <SocialBar />{" "}
      <header className="sticky top-0 z-[1000] border-b border-white/10 bg-[#090909]/88 backdrop-blur-xl">
        {" "}
        <div className="relative mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-2.5 sm:px-6">
          {" "}
          <Link href="/" className="flex shrink-0 items-center gap-3">
            {" "}
            <div className="relative h-12 w-32 shrink-0 sm:w-36 2xl:w-44">
              {" "}
              <Image
                src={brandLogo}
                alt="KAMDRIDI logo"
                fill
                priority
                className="object-contain object-left"
              />{" "}
            </div>{" "}
            <p className="hidden max-w-[170px] text-[10px] uppercase leading-4 tracking-[0.2em] text-stone-400 2xl:block">
              {" "}
              echoes unearthed universe{" "}
            </p>{" "}
          </Link>{" "}
          <nav className="hidden min-w-0 flex-1 items-center justify-end gap-2 xl:flex 2xl:gap-3">
            {" "}
            {primaryNavItems
              .map((item) => (
                <div key={item.label} className="group relative shrink-0">
                  {" "}
                  {item.label === "Lost Requiem" ? (
                    <Link
                      href={item.href}
                      className={clsx(
                        "relative block whitespace-nowrap px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#d49a5b] transition hover:text-[#f4c66a] 2xl:text-[11px] 2xl:tracking-[0.18em]",
                        isNavItemActive(pathname, item) && "text-[#f4c66a]"
                      )}
                    >
                      <span aria-hidden="true" className="mr-1.5 inline-block h-1 w-1 -translate-y-0.5 rounded-full bg-[#d49a5b] transition group-hover:bg-[#f4c66a]" />
                      {item.label}
                      <span className="absolute bottom-1 left-1/2 h-[1px] w-[60%] -translate-x-1/2 bg-[#c98542]/40 transition group-hover:bg-[#f4c66a]/80" />
                    </Link>
                  ) : item.label === "ORACLE (MYRIAM)" ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        document.dispatchEvent(new CustomEvent('openMyriamWidget'));
                      }}
                      className={clsx(
                        "relative block whitespace-nowrap px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#050403] bg-[#f4c66a] border border-[#f4c66a] transition hover:bg-transparent hover:text-[#f4c66a] 2xl:text-[11px] 2xl:tracking-[0.18em]",
                        isNavItemActive(pathname, item) && "bg-transparent text-[#f4c66a]"
                      )}
                    >
                      <span className="absolute -top-1 -right-1 flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-white opacity-75 animate-ping"></span>
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                      </span>
                      {item.label}
                    </button>
                  ) : (
                    <Link
                      href={item.href}
                      className={clsx(
                        "block whitespace-nowrap px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-200 transition hover:text-[#f4c66a] 2xl:text-[11px] 2xl:tracking-[0.18em]",
                        isNavItemActive(pathname, item) && "text-[#f4c66a]",
                      )}
                    >
                      {" "}
                      {item.label}{" "}
                    </Link>
                  )}{" "}
                  {item.children ? (
                    <div className="invisible absolute left-0 top-full z-[2000] pt-4 opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100">
                      {" "}
                      <div className="pointer-events-auto w-64 rounded-2xl border border-white/10 bg-black/90 p-3 shadow-2xl shadow-black/40">
                        {" "}
                        {item.children.map((child) => (
                          <Link
                            key={child.label}
                            href={child.href}
                            className="flex items-center justify-between rounded-xl px-3 py-2 text-sm text-stone-300 transition hover:bg-white/5 hover:text-[#f4c66a]"
                          >
                            {" "}
                            {child.label}{" "}
                            <ChevronRight className="h-4 w-4 opacity-50" />{" "}
                          </Link>
                        ))}{" "}
                      </div>{" "}
                    </div>
                  ) : null}{" "}
                </div>
              ))
              .flatMap((node, index) => {
                const item = primaryNavItems[index];
                return item?.label === "Releases"
                  ? [
                      node,
                      <div key="salieris-hands-special" className="shrink-0">
                        {" "}
                        <SalieriNavTab
                          active={isActivePath(pathname, salieriReleaseHref)}
                        />{" "}
                      </div>,
                    ]
                  : [node];
              })}{" "}
            <div className="group relative shrink-0">
              {" "}
              <button
                type="button"
                className={clsx(
                  "inline-flex items-center gap-1 whitespace-nowrap px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-stone-200 transition hover:text-[#f4c66a] 2xl:text-[11px] 2xl:tracking-[0.18em]",
                  isMoreActive && "text-[#f4c66a]",
                )}
                aria-label="More navigation links"
              >
                {" "}
                More <ChevronDown className="h-3.5 w-3.5" />{" "}
              </button>{" "}
              <div className="invisible absolute right-0 top-full z-[2000] pt-4 opacity-0 transition duration-300 group-hover:visible group-hover:opacity-100">
                {" "}
                <div className="pointer-events-auto w-72 rounded-2xl border border-white/10 bg-black/92 p-3 shadow-2xl shadow-black/40">
                  {" "}
                  {moreNavItems.map((item) => (
                    <Link
                      key={item.label}
                      href={item.href}
                      className={clsx(
                        "flex items-center justify-between rounded-xl px-3 py-2 text-sm text-stone-300 transition hover:bg-white/5 hover:text-[#f4c66a]",
                        isNavItemActive(pathname, item) &&
                          "bg-[#f4c66a]/10 text-[#f4c66a]",
                      )}
                    >
                      {" "}
                      {item.label}{" "}
                      <ChevronRight className="h-4 w-4 opacity-50" />{" "}
                    </Link>
                  ))}{" "}
                </div>{" "}
              </div>{" "}
            </div>{" "}
          </nav>{" "}
          <div className="flex shrink-0 items-center gap-2">
            {" "}
            <Link
              href="/australia"
              className={clsx(
                "group relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-0.5 shadow-[0_0_22px_rgba(42,91,151,0.18)] transition hover:-translate-y-0.5 hover:shadow-[0_0_28px_rgba(190,42,48,0.34)] focus:outline-none focus:ring-2 focus:ring-[#e8ce93]/70",
                isAustraliaCampaign && "ring-2 ring-[#e8ce93]/80",
              )}
              aria-label="17 FOR EVER — Australia 2027"
              title="17 FOR EVER — Australia 2027"
            >
              <span className="absolute inset-0 rounded-full bg-[#e8ce93]/20 opacity-0 blur-md transition group-hover:opacity-100" />
              <span className="relative h-full w-full transition duration-700 group-hover:rotate-12">
                <AustraliaCollectorIcon />
              </span>
              <span className="absolute -bottom-1 -right-1 rounded-full border border-[#e8ce93]/70 bg-[#07101b] px-1.5 py-0.5 text-[7px] font-black uppercase tracking-[0.08em] text-[#fff0c5] shadow-lg">
                AUS
              </span>
            </Link>{" "}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className={clsx(
                "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-stone-200 transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a]",
                !showCart && "hidden",
              )}
              aria-label="Open cart"
              title="Cart"
            >
              {" "}
              <ShoppingBag className="h-4 w-4" />{" "}
              {cartCount ? (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#f4c66a] px-1 text-[10px] font-semibold text-black">
                  {" "}
                  {cartCount}{" "}
                </span>
              ) : null}{" "}
            </button>{" "}
            <Link
              href="/games"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-white/10 text-stone-200 transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a] xl:inline-flex"
              aria-label="Games"
              title="Games"
            >
              {" "}
              <Gamepad2 className="h-4 w-4" />{" "}
            </Link>{" "}
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex rounded-full border border-white/10 p-3 text-stone-200 transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a] xl:hidden"
              aria-label="Toggle menu"
            >
              {" "}
              {open ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}{" "}
            </button>{" "}
          </div>{" "}
        </div>{" "}
        {open ? (
          <div className="border-t border-white/10 px-4 py-4 xl:hidden">
            {" "}
            <div className="flex flex-col gap-2">
              {" "}
              {mobileRoutes.map((item) =>
                item.special ? (
                  <SalieriNavTab
                    key={item.label}
                    mobile
                    active={isActivePath(pathname, item.href)}
                    onClick={() => setOpen(false)}
                  />
                ) : item.label === "ORACLE (MYRIAM)" ? (
                  <button
                    key={item.label}
                    onClick={(e) => {
                      e.preventDefault();
                      setOpen(false);
                      document.dispatchEvent(new CustomEvent('openMyriamWidget'));
                    }}
                    className={clsx(
                      "rounded-2xl border border-[#f4c66a] bg-[#f4c66a] px-4 py-3 text-left text-sm font-bold uppercase tracking-[0.22em] text-[#050403] transition hover:bg-transparent hover:text-[#f4c66a]",
                      isActivePath(pathname, item.href) &&
                        "bg-transparent text-[#f4c66a]",
                    )}
                  >
                    {" "}
                    {item.label}{" "}
                  </button>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={clsx(
                      "rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-3 text-sm font-semibold uppercase tracking-[0.22em] text-white transition hover:border-[#f4c66a]/45 hover:text-[#f4c66a]",
                      isActivePath(pathname, item.href) &&
                        "border-[#f4c66a]/35 bg-[#f4c66a]/10 text-[#f4c66a]",
                    )}
                  >
                    {" "}
                    {item.label}{" "}
                  </Link>
                ),
              )}{" "}
            </div>{" "}
          </div>
        ) : null}{" "}
        {showSecondaryExplore ? (
          <div className="hidden border-t border-white/5 bg-black/25 xl:block">
            {" "}
            <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3 px-4 py-3 text-[11px] uppercase tracking-[0.3em] text-stone-400 sm:px-6">
              {" "}
              <span className="text-stone-500">Explore</span>{" "}
              {footerRoutes.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={clsx(
                    "rounded-full border border-white/10 px-4 py-2 transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a]",
                    isActivePath(pathname, item.href) &&
                      "border-[#f4c66a]/35 bg-[#f4c66a]/10 text-[#f4c66a]",
                  )}
                >
                  {" "}
                  {item.label}{" "}
                </Link>
              ))}{" "}
            </div>{" "}
          </div>
        ) : null}{" "}
      </header>{" "}
      <main>{children}</main> <CartDrawer />{" "}
      {isAustraliaCampaign ? null : <footer className="border-t border-white/10 bg-black/60">
        {" "}
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.8fr]">
          {" "}
          <div>
            {" "}
            <div className="relative h-20 w-64">
              {" "}
              <Image
                src={brandLogo}
                alt="KAMDRIDI logo"
                fill
                className="object-contain object-left"
              />{" "}
            </div>{" "}
            <p className="mt-3 max-w-xl text-sm leading-7 text-stone-400">
              {" "}
              {siteMeta.tagline} Built as a living fan universe with music,
              games, visual-album layers, collector drops, and fan-club access
              under one cinematic identity.{" "}
            </p>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
              Navigate
            </p>{" "}
            <div className="mt-4 grid gap-2">
              {" "}
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-stone-300 transition hover:text-[#f4c66a]"
                >
                  {" "}
                  {item.label}{" "}
                </Link>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
              Explore
            </p>{" "}
            <div className="mt-4 grid gap-2">
              {" "}
              {footerRoutes.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-stone-300 transition hover:text-[#f4c66a]"
                >
                  {" "}
                  {item.label}{" "}
                </Link>
              ))}{" "}
            </div>{" "}
          </div>{" "}
          <div>
            {" "}
            <p className="text-sm uppercase tracking-[0.3em] text-stone-500">
              Contact
            </p>{" "}
            <div className="mt-4 grid gap-2 text-sm text-stone-300">
              {" "}
              <p>{siteMeta.email}</p>{" "}
              <p>Booking, press, management, licensing</p>{" "}
              <div className="mt-8 flex items-center text-stone-600 text-xs">
                <div className="flex items-center gap-3">
                  <span>(c) 2026</span>
                  <Link href="/label/system-access" className="relative inline-block h-4 w-16 opacity-50 transition-opacity hover:opacity-100">
                    <Image
                      src={brandLogo}
                      alt="KAMDRIDI logo"
                      fill
                      className="object-contain object-left"
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>{" "}
        </div>{" "}
      </footer>}{" "}
    </div>
  );
}
