import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton, Section, SectionHeading } from "@/components/ui";
import { Storefront } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Shop the official KAMDRIDI merch store with cinematic collector products, hosted checkout support, and direct order capture."
};

const storeHeroVideo = "/videos/store-hero-grok.mp4";

export default function StorePage() {
  const checkoutEnabled = Boolean(process.env.NEXT_PUBLIC_STRIPE_LINK_COLLECTOR || process.env.STRIPE_SECRET_KEY);

  return (
    <>
      <section id="collector-artifact" className="relative z-10 overflow-hidden border-b border-white/10">
        <section className="relative h-[62svh] min-h-[420px] overflow-hidden md:h-[74svh]">
          <video
            className="absolute inset-0 h-full w-full object-cover object-top"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/store/merch/signal-target-collection.png"
            aria-label="KAMDRIDI store hero video"
          >
            <source src={storeHeroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,6,5,0.03),rgba(7,6,5,0.16))]" />
        </section>

        <Section className="relative py-12 md:py-16 overflow-hidden">
          {/* Fading Cyber Grid Background */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-40 [background-image:linear-gradient(to_right,rgba(244,198,106,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,198,106,0.04)_1px,transparent_1px)] [background-size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_20%,transparent_100%)]" />

          {/* Animated Ambient Glows */}
          <div className="pointer-events-none absolute left-0 top-0 z-0 h-[800px] w-[800px] -translate-x-1/2 -translate-y-1/4 rounded-full bg-[radial-gradient(circle_at_center,rgba(244,198,106,0.05),transparent_60%)] blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
          <div className="pointer-events-none absolute right-0 bottom-0 z-0 h-[1000px] w-[1000px] translate-x-1/3 translate-y-1/3 rounded-full bg-[radial-gradient(circle_at_center,rgba(180,30,10,0.03),transparent_70%)] blur-3xl animate-[pulse_12s_ease-in-out_infinite]" />
          
          <div className="relative z-10 mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
            <div className="relative overflow-hidden border border-[#f4c66a]/30 p-6 md:p-8">
              <Image src="/store/collage/photo_1.jpg" alt="Kam Dridi Signing" fill className="object-cover opacity-30 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(244,198,106,0.16),rgba(0,0,0,0.85))]" />
              <div className="relative z-10">
                <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Official Store</p>
                <h1 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.08em] text-white sm:text-5xl md:text-6xl">
                  Shop the drop
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-8 text-stone-300">
                  Best sellers first, prices visible, variants clear, and the cart always one click away.
                  Start with the logo tee, Echoes crest tee, or Signal Target capsule.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <CTAButton href="#featured">Shop Best Sellers</CTAButton>
                  <CTAButton href="#collector-artifact-pack" tone="secondary">
                    Collector Bundle
                  </CTAButton>
                </div>
                <div className="mt-7 grid gap-3 text-[11px] uppercase tracking-[0.26em] text-stone-300 sm:grid-cols-2">
                  <span className="border border-[#f4c66a]/35 bg-[#f4c66a]/10 px-4 py-3 text-[#f4c66a]">
                    {checkoutEnabled ? "Hosted checkout live" : "Demo checkout active"}
                  </span>
                  <span className="border border-white/10 bg-black/35 px-4 py-3">Tees from $38</span>
                  <span className="border border-white/10 bg-black/35 px-4 py-3">Hoodie $78</span>
                  <span className="border border-white/10 bg-black/35 px-4 py-3">Boxed keychain $36</span>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  title: "Gold Logo Tee",
                  price: "$38",
                  image: "/store/merch/gold-logo-tee-glow.png",
                  href: "#kamdridi-gold-logo-tee"
                },
                {
                  title: "Echoes Crest Tee",
                  price: "$46",
                  image: "/store/merch/echoes-crest-tee-duo.png",
                  href: "#echoes-unearthed-crest-tee"
                },
                {
                  title: "Signal Target",
                  price: "$44",
                  image: "/store/merch/signal-target-collection.png",
                  href: "#signal-target-tee-collection"
                },
                {
                  title: "Boxed Keychain",
                  price: "$36",
                  image: "/store/merch/logo-essentials-grid.png",
                  href: "#kamdridi-logo-keychain"
                }
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="group relative min-h-[300px] overflow-hidden border border-white/10 bg-black"
                >
                  <Image src={item.image} alt={item.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.78))]" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">Best Seller</p>
                    <h2 className="mt-2 text-xl text-white">{item.title}</h2>
                    <p className="mt-2 text-lg text-[#f4c66a]">{item.price}</p>
                    <p className="mt-3 text-[10px] uppercase tracking-[0.24em] text-stone-400">
                      Choose variant
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </div>
          
          <div className="mx-auto mt-12 grid max-w-7xl gap-6 md:grid-cols-2">
            <ul className="space-y-4 text-sm text-stone-300">
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4c66a]" /> 180g Heavyweight Double Vinyl
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4c66a]" /> Signed "Null Sector" Concept Art Print
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4c66a]" /> Hidden URL engraved in runout groove
              </li>
              <li className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#f4c66a]" /> Immediate lossless digital download
              </li>
            </ul>

            <div className="rounded-2xl border border-[#f4c66a]/20 bg-[linear-gradient(145deg,rgba(20,15,10,0.8),rgba(0,0,0,0.9))] p-6 flex flex-col justify-center text-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#f4c66a] mb-2">Want Custom Merch?</h3>
              <p className="text-xs text-stone-400 mb-4">Forge your own 1-of-1 T-Shirt design using our Oracle AI, printed on demand.</p>
              <Link href="/forge" className="inline-block rounded-full border border-[#f4c66a]/50 bg-black/50 px-6 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[#f4c66a] transition hover:bg-[#f4c66a] hover:text-black">
                Enter The Forge
              </Link>
            </div>
          </div>
        </Section>

        <Section id="collector-artifact-pack" className="relative py-14 md:py-18 overflow-hidden">
          <Image src="/store/collage/photo_4.jpg" alt="Kam Dridi Backstage" fill className="object-cover opacity-[0.15] mix-blend-luminosity" />
          {/* Fading Cyber Grid Background */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-40 [background-image:linear-gradient(to_right,rgba(244,198,106,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,198,106,0.04)_1px,transparent_1px)] [background-size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,#000_20%,transparent_100%)]" />
          <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.14),transparent_26%),linear-gradient(180deg,rgba(11,10,8,0.4),rgba(11,10,8,0.96))]" />
          <div className="relative z-10 mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Featured Drop</p>
              <h2 className="mt-5 font-display text-4xl uppercase leading-none tracking-[0.08em] text-white md:text-6xl">
                Collector merch wall
              </h2>
              <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
                Browse the current KAMDRIDI merch capsule, collector apparel, and physical release
                products in the official store flow.
              </p>
            </div>
            <div className="relative grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="relative min-h-[460px] overflow-hidden rounded-[34px] border border-[#f4c66a]/20 bg-black shadow-[0_35px_90px_rgba(0,0,0,0.45)]">
                <Image
                  src="/store/merch/signal-target-collection.png"
                  alt="Signal Target capsule merchandise board"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.06),rgba(0,0,0,0.56))]" />
                <div className="absolute left-5 top-5 rounded-full border border-[#f4c66a]/35 bg-black/55 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#f4c66a] backdrop-blur">
                  Signal Target Capsule
                </div>
              </div>

              <div className="grid gap-4">
                <div className="relative min-h-[220px] overflow-hidden rounded-[30px] border border-white/10 bg-black shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
                  <Image
                    src="/store/merch/echoes-crest-tee-duo.png"
                    alt="Echoes Unearthed crest tee variants"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.6))]" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="relative min-h-[220px] overflow-hidden rounded-[28px] border border-white/10 bg-black shadow-[0_30px_70px_rgba(0,0,0,0.4)]">
                    <Image
                      src="/store/merch/echoes-wordmark-tee-duo.png"
                      alt="Echoes Unearthed wordmark tee variants"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.62))]" />
                  </div>
                  <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
                    <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Checkout</p>
                    <p className="mt-3 text-lg text-white">
                      {checkoutEnabled ? "Hosted Stripe checkout is active" : "Local demo checkout is active"}
                    </p>
                    <p className="mt-4 text-sm leading-7 text-stone-400">
                      Sizes and variants stay in the cart, then move into one direct KAMDRIDI
                      checkout flow.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Section>
      </section>
      
      <section className="relative w-full overflow-hidden border-b border-white/10 bg-black">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 h-[40svh] md:h-[50svh] lg:h-[60svh] opacity-90 transition-opacity duration-700 hover:opacity-100">
          <div className="relative h-full w-full overflow-hidden group">
            <Image src="/store/collage/photo_1.jpg" alt="Kam Dridi Live" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          <div className="relative h-full w-full overflow-hidden group">
            <Image src="/store/collage/photo_2.jpg" alt="Kam Dridi Fans" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          <div className="relative h-full w-full overflow-hidden group">
            <Image src="/store/collage/photo_3.jpg" alt="Kam Dridi Merch" fill className="object-cover object-top transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
          </div>
          <div className="relative h-full w-full overflow-hidden group">
            <Image src="/store/collage/photo_4.jpg" alt="Kam Dridi Store" fill className="object-cover transition-transform duration-1000 group-hover:scale-110" />
            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700" />
          </div>
        </div>
      </section>

      <Section>
        <SectionHeading
          eyebrow="Merch Store"
          title="KAMDRIDI merch capsule and collector access"
          description="Gold-logo essentials, Echoes Unearthed apparel, Signal Target variants, print pieces, collector bundle, persistent cart, and one coherent storefront."
        />
        <div className="mt-12">
          <Suspense fallback={<div className="text-sm text-stone-400">Loading storefront...</div>}>
            <Storefront checkoutEnabled={checkoutEnabled} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
