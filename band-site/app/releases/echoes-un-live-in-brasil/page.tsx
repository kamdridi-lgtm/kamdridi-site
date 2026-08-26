import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getUnifiedCommerceProducts } from "@/lib/unified-commerce";

export const metadata: Metadata = {
  metadataBase: new URL("https://kamdridi.com"),
  title: "ECHOES UNlive in Brasil - KAM DRIDI",
  description:
    "ECHOES UNlive in Brasil — Direct Artist Edition. Four acts, one room, fourteen performances and collector editions manufactured on demand.",
  alternates: { canonical: "/releases/echoes-un-live-in-brasil" },
  openGraph: {
    title: "ECHOES UNlive in Brasil - KAM DRIDI",
    description: "One night. One room. One memory. Direct Artist Edition, manufactured on demand.",
    url: "/releases/echoes-un-live-in-brasil",
    siteName: "KAM DRIDI",
    images: [{ url: "/echoes-un-live-in-brasil/assets/images/edition-expanded.webp", width: 1200, height: 1200 }],
    type: "music.album"
  }
};

const tracks = [
  ["01", "Dream Machines"],
  ["02", "Michael Remembers"],
  ["03", "The Time of Signs"],
  ["04", "17 Forever"],
  ["05", "Too Fast Too Young"],
  ["06", "For Some Dialog..."],
  ["07", "Alone Apart / One Apart"],
  ["08", "Our Lost Dreams"],
  ["09", "The Fall of the First Knight"],
  ["10", "War Machines"],
  ["11", "Junction Ahead"],
  ["12", "Into The News"],
  ["13", "Tough Boys Rumble"],
  ["14", "Dream Machines / Solo Remix"]
] as const;

const productRoutes: Record<string, string> = {
  "echoes-brasil-expanded-2026": "/store/echoes-brasil-expanded",
  "echoes-brasil-livreto-2026": "/store/echoes-brasil-livreto",
  "echoes-brasil-deluxe-2026": "/store/echoes-brasil-deluxe"
};

function money(cents: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", maximumFractionDigits: 0 }).format(cents / 100);
}

export default async function EchoesBrasilReleasePage() {
  const products = (await getUnifiedCommerceProducts()).filter(
    (product) => product.projectSlug === "echoes-un-live-in-brasil" && product.visible
  );
  const physical = products.filter((product) => product.requiresShipping && product.priceCents > 0);

  return (
    <main className="min-h-screen bg-[#070504] text-white">
      <section className="relative isolate min-h-[78svh] overflow-hidden border-b border-[#bc8b49]/20">
        <Image
          src="/echoes-un-live-in-brasil/assets/images/edition-expanded.webp"
          alt="ECHOES UNlive in Brasil"
          fill
          priority
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,3,2,.20),rgba(5,3,2,.72)_58%,#070504)]" />
        <div className="relative mx-auto flex min-h-[78svh] max-w-7xl items-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.36em] text-[#c94b3f]">Direct Artist Edition · Brasil</p>
            <h1 className="mt-5 font-display text-[clamp(3rem,9vw,7.5rem)] uppercase leading-[.82] tracking-[0.02em] text-[#f3eadc]">
              ECHOES <span className="text-[#a92d2d]">UN</span>live in Brasil
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300">
              One night. One room. One memory. Four acts, fourteen performances, and the audience inside the arrangement.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#editions" className="rounded-full bg-[#d6a55b] px-7 py-3 text-xs font-black uppercase tracking-[0.18em] text-black">Collector editions</Link>
              <Link href="#programme" className="rounded-full border border-white/20 px-7 py-3 text-xs font-black uppercase tracking-[0.18em] text-white">Full programme</Link>
            </div>
          </div>
        </div>
      </section>

      <section id="programme" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c94b3f]">The complete programme</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.05em] text-[#f0d7ad] md:text-6xl">Four acts. One room.</h2>
            <p className="mt-6 max-w-xl leading-8 text-stone-400">
              The Direct Artist Edition follows the current fourteen-title programme, including the four bonus sessions after the main set.
            </p>
          </div>
          <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {tracks.map(([number, title]) => (
              <div key={number} className="flex items-baseline gap-4 border-b border-white/10 py-3">
                <span className="w-8 text-[10px] tracking-[0.2em] text-[#c94b3f]">{number}</span>
                <span className="text-sm uppercase tracking-[0.08em] text-stone-200">{title}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="editions" className="border-y border-[#bc8b49]/15 bg-black/40 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c94b3f]">Physical editions</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl uppercase tracking-[0.05em] text-[#f0d7ad] md:text-6xl">Made to order</h2>
            <p className="max-w-xl text-sm leading-7 text-stone-400">Payment is accepted first; physical production and fulfillment follow after the order. Please allow several weeks for manufacturing and delivery.</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {physical.map((product) => (
              <article key={product.id} className="overflow-hidden border border-white/10 bg-[#0c0907]">
                <div className="relative aspect-square bg-black">
                  {product.images?.[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" />}
                </div>
                <div className="p-6">
                  <p className="text-[10px] font-black uppercase tracking-[0.26em] text-[#c94b3f]">{product.subtitle}</p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{product.name}</h3>
                  <p className="mt-4 min-h-20 text-sm leading-7 text-stone-400">{product.description}</p>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-xl font-semibold text-[#e0b36f]">{money(product.priceCents)}</span>
                    <Link href={productRoutes[product.id] || product.productPath} className="rounded-full border border-[#d6a55b]/45 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#e0b36f] hover:bg-[#d6a55b] hover:text-black">View / Order</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
        <div className="relative min-h-[420px] overflow-hidden border border-white/10">
          <Image src="/echoes-un-live-in-brasil/assets/images/edition-livret.webp" alt="ECHOES UNlive in Brasil collector booklet" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center border border-[#bc8b49]/20 bg-[#0d0907] p-8 md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c94b3f]">KDR-EUB-001</p>
          <h2 className="mt-4 font-display text-4xl uppercase text-[#f0d7ad]">Direct Artist Edition</h2>
          <p className="mt-6 leading-8 text-stone-300">No retail barcode is required for this direct edition. The 16-page booklet, CD presentation and deluxe configuration are managed as artist-direct made-to-order products.</p>
          <p className="mt-5 text-sm leading-7 text-stone-500">© 2026 Kam Dridi · KAMDRIDI RECORDS</p>
          <Link href="/store" className="mt-8 w-fit rounded-full bg-[#d6a55b] px-7 py-3 text-xs font-black uppercase tracking-[0.18em] text-black">Official store</Link>
        </div>
      </section>
    </main>
  );
}
