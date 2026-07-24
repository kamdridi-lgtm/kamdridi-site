import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download, ExternalLink, Gamepad2, Music2, QrCode, RadioTower, ShoppingBag, Smartphone } from "lucide-react";

const appLogo = "/assets/images/kamdridi-app-logo-blue.png";
const appQr = "/assets/images/kamdridi-app-qr.png";
const albumCover = "/assets/images/releases/echoes-unearthed-cover.jpg";
const warMachinesCover = "/assets/images/war-machines-jp-cover.png";
const androidDownloadHref = "https://expo.dev/artifacts/eas/fZGfB7putr37Q3W5iD5htH.apk";
const googlePlayBundleHref = "https://expo.dev/artifacts/eas/rtU8eBkCDLdGH94XQbYVxd.aab";

export const metadata: Metadata = {
  title: "KAMDRIDI Mobile App - Companion Hub",
  description:
    "Scan or open the KAMDRIDI mobile companion for music, games, Japan campaign access, fan updates, and collector drops."
};

const companionLinks = [
  {
    title: "Listen",
    text: "Open the album and official platforms.",
    href: "/#listen-now",
    icon: Music2
  },
  {
    title: "Games",
    text: "Enter The Gilded Null and the archive.",
    href: "/games",
    icon: Gamepad2
  },
  {
    title: "Japan",
    text: "Launch the War Machines campaign page.",
    href: "/app/war-machines-jp",
    icon: RadioTower
  },
  {
    title: "Store",
    text: "Collector CD and premium editions.",
    href: "/store",
    icon: ShoppingBag
  }
];

export default function MobileCompanionPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#020407] text-white">
      <section className="relative isolate min-h-screen px-4 py-8 sm:px-6 lg:px-8">
        <Image
          src={warMachinesCover}
          alt=""
          fill
          priority
          className="absolute inset-0 -z-20 object-cover opacity-22"
        />
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_18%,rgba(0,148,255,0.22),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.72),#020407_72%)]" />
        <div className="absolute inset-x-0 top-0 -z-10 h-1/2 bg-[linear-gradient(90deg,transparent,rgba(80,192,255,0.18),transparent)]" />

        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <Link href="/" className="relative h-16 w-48 sm:h-20 sm:w-64" aria-label="Back to KAMDRIDI home">
            <Image src={appLogo} alt="KAMDRIDI" fill priority className="object-contain object-left" />
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center border border-white/15 bg-white/5 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-100 transition hover:border-[#73dcff] hover:text-white"
          >
            Home
          </Link>
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-8 pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:pt-20">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#56c7ff]/30 bg-[#04152b]/70 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.26em] text-[#9be8ff]">
              <Smartphone className="h-4 w-4" />
              KAMDRIDI Companion
            </div>
            <h1 className="mt-6 max-w-4xl font-display text-[clamp(3rem,9vw,7.6rem)] uppercase leading-[0.8] tracking-[0.08em] text-white">
              Get the
              <br />
              mobile app
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-blue-100/82 sm:text-lg">
              The premium companion hub for the KAMDRIDI universe: music access, game portals,
              Japan campaign signals, collector drops, and fan updates in one fast mobile gateway.
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <div className="flex flex-wrap gap-3">
                <div className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#64d5ff]/60 bg-[linear-gradient(180deg,#0b86ff,#06327a)] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_18px_55px_rgba(0,119,255,0.32)]">
                  <Download className="h-4 w-4" />
                  PWA Ready
                </div>
                <Link
                  href="/fan-club"
                  className="inline-flex min-h-12 items-center justify-center border border-white/15 bg-black/35 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-blue-100 transition hover:-translate-y-0.5 hover:border-[#64d5ff]/70"
                >
                  Fan Access
                </Link>
              </div>
              <div className="mt-2 text-sm text-blue-200/80 bg-blue-900/20 p-4 border border-blue-500/20 rounded">
                <strong>INSTALL THE COMPANION APP:</strong><br/>
                • <strong>Android:</strong> Tap your browser menu (3 dots) and select <em>"Add to Home Screen"</em>.<br/>
                • <strong>iPhone:</strong> Tap the Share button at the bottom of Safari, then select <em>"Add to Home Screen"</em>.
              </div>
            </div>
            <p className="mt-4 max-w-xl text-xs leading-6 text-blue-100/64">
              Add the KAMDRIDI Companion to your home screen for an app-like experience without going through the app stores.
            </p>
          </div>

          <div id="scan" className="relative mx-auto w-full max-w-[430px] border border-[#3dc9ff]/38 bg-black/70 p-5 shadow-[0_36px_120px_rgba(0,74,190,0.38)]">
            <div className="absolute -inset-px -z-10 bg-[linear-gradient(135deg,rgba(80,203,255,0.42),transparent_42%,rgba(30,86,255,0.32))]" />
            <div className="relative aspect-[4/3] overflow-hidden border border-white/10 bg-[#06101d]">
              <Image src={albumCover} alt="Echoes Unearthed" fill className="object-cover opacity-78" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,transparent,rgba(0,0,0,0.76))]" />
              <div className="absolute inset-x-5 bottom-5">
                <div className="relative h-16 w-full">
                  <Image src={appLogo} alt="KAMDRIDI app logo" fill className="object-contain object-left" />
                </div>
              </div>
            </div>
            <div className="mt-5 rounded bg-blue-900/20 p-4 border border-blue-500/20 text-sm leading-6 text-blue-100/80">
              <strong className="text-white">PWA Ready:</strong> No need for App Stores.<br/>
              Simply open your browser menu and select <em>"Add to Home Screen"</em>.
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 grid max-w-7xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {companionLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group border border-white/10 bg-black/52 p-5 transition hover:-translate-y-1 hover:border-[#64d5ff]/55"
              >
                <Icon className="h-6 w-6 text-[#73dcff]" />
                <h3 className="mt-4 font-display text-2xl uppercase tracking-[0.08em] text-white">{item.title}</h3>
                <p className="mt-2 min-h-12 text-sm leading-6 text-blue-100/68">{item.text}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9be8ff]">
                  Open <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
