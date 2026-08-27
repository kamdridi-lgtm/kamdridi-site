import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getUnifiedCommerceProducts } from "@/lib/unified-commerce";

export const metadata: Metadata = {
  metadataBase: new URL("https://kamdridi.com"),
  title: "ECHOES UNlive in Brasil - KAM DRIDI",
  description:
    "ECHOES UNlive in Brasil — edição direta do artista, com programa completo e edições de colecionador.",
  alternates: { canonical: "/releases/echoes-un-live-in-brasil" },
  openGraph: {
    title: "ECHOES UNlive in Brasil - KAM DRIDI",
    description: "Uma noite. Uma sala. Uma memória. Edição direta do artista.",
    url: "/releases/echoes-un-live-in-brasil",
    siteName: "KAM DRIDI",
    images: [{ url: "/echoes-un-live-in-brasil/assets/images/edition-expanded.webp", width: 1200, height: 1200 }],
    type: "music.album"
  }
};

type Locale = "pt" | "en" | "fr";

const tracks = [
  ["01", "Dream Machines"],
  ["02", "Michael Remembers"],
  ["03", "The Time of Signs"],
  ["04", "17 FOR EVER"],
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
  "echoes-brasil-deluxe-2026": "/store/echoes-brasil-deluxe",
  "echoes-brasil-vinyl-2026": "/store/echoes-brasil-vinyl"
};

const copy = {
  pt: {
    htmlLang: "pt-BR",
    heroEyebrow: "EDIÇÃO DIRETA DO ARTISTA · BRASIL",
    heroText:
      "Uma noite. Uma sala. Uma memória. Quatro atos, quatorze performances e o público dentro do arranjo.",
    collectorEditions: "Edições de colecionador",
    fullProgramme: "Programa completo",
    programmeEyebrow: "O PROGRAMA COMPLETO",
    programmeTitle: "Quatro atos. Uma sala.",
    programmeText:
      "A Edição Direta do Artista segue o programa atual de quatorze títulos, incluindo quatro sessões bônus depois do set principal.",
    physicalEyebrow: "EDIÇÕES FÍSICAS",
    madeToOrder: "Produzido sob encomenda",
    productionText:
      "O pagamento é feito primeiro; a produção física e o envio começam depois da confirmação do pedido. Reserve algumas semanas para fabricação e entrega.",
    viewOrder: "Ver / Pedir",
    directArtistEdition: "Edição Direta do Artista",
    directText:
      "Esta edição direta é administrada pelo artista. O livreto de 16 páginas, a apresentação em CD e a configuração deluxe fazem parte do sistema de produtos sob encomenda.",
    officialStore: "Loja oficial"
  },
  en: {
    htmlLang: "en",
    heroEyebrow: "DIRECT ARTIST EDITION · BRAZIL",
    heroText:
      "One night. One room. One memory. Four acts, fourteen performances, and the audience inside the arrangement.",
    collectorEditions: "Collector editions",
    fullProgramme: "Full programme",
    programmeEyebrow: "THE COMPLETE PROGRAMME",
    programmeTitle: "Four acts. One room.",
    programmeText:
      "The Direct Artist Edition follows the current fourteen-title programme, including four bonus sessions after the main set.",
    physicalEyebrow: "PHYSICAL EDITIONS",
    madeToOrder: "Made to order",
    productionText:
      "Payment is accepted first; physical production and fulfillment begin after the order is confirmed. Please allow several weeks for manufacturing and delivery.",
    viewOrder: "View / Order",
    directArtistEdition: "Direct Artist Edition",
    directText:
      "This artist-direct edition is managed directly by KAM DRIDI. The 16-page booklet, CD presentation and deluxe configuration are handled as made-to-order products.",
    officialStore: "Official store"
  },
  fr: {
    htmlLang: "fr",
    heroEyebrow: "ÉDITION DIRECTE DE L’ARTISTE · BRÉSIL",
    heroText:
      "Une nuit. Une salle. Un souvenir. Quatre actes, quatorze performances et le public au cœur de l’arrangement.",
    collectorEditions: "Éditions de collection",
    fullProgramme: "Programme complet",
    programmeEyebrow: "LE PROGRAMME COMPLET",
    programmeTitle: "Quatre actes. Une salle.",
    programmeText:
      "L’Édition Directe de l’Artiste suit le programme actuel de quatorze titres, avec quatre sessions bonus après le set principal.",
    physicalEyebrow: "ÉDITIONS PHYSIQUES",
    madeToOrder: "Fabriqué sur commande",
    productionText:
      "Le paiement est effectué d’abord; la production physique et l’expédition commencent après confirmation de la commande. Prévoir plusieurs semaines pour la fabrication et la livraison.",
    viewOrder: "Voir / Commander",
    directArtistEdition: "Édition Directe de l’Artiste",
    directText:
      "Cette édition directe est gérée par KAM DRIDI. Le livret de 16 pages, la présentation CD et la configuration deluxe sont traités comme des produits fabriqués sur commande.",
    officialStore: "Boutique officielle"
  }
} as const;

const productDescriptions: Record<string, Record<Locale, string>> = {
  "echoes-brasil-deluxe-2026": {
    pt: "Apresentação de colecionador com estojo premium, disco preto e cartão da edição.",
    en: "Collector presentation with premium case, black disc and edition card.",
    fr: "Présentation de collection avec boîtier premium, disque noir et carte de l’édition."
  },
  "echoes-brasil-expanded-2026": {
    pt: "Apresentação refinada do álbum com visual principal, faixas bônus incluídas e pedido direto.",
    en: "Refined album presentation with main artwork, bonus tracks included and direct ordering.",
    fr: "Présentation raffinée de l’album avec visuel principal, titres bonus inclus et commande directe."
  },
  "echoes-brasil-livreto-2026": {
    pt: "Páginas internas com imagens ao vivo, créditos e o universo visual da Edição Expandida.",
    en: "Interior pages with live imagery, credits and the visual universe of the Expanded Edition.",
    fr: "Pages intérieures avec images live, crédits et univers visuel de l’Édition Étendue."
  },
  "echoes-brasil-vinyl-2026": {
    pt: "Edição de colecionador em vinil preto de 12 polegadas. O programa do LP é finalizado de acordo com o limite de fabricação por lado antes da produção.",
    en: "12-inch black-vinyl collector edition. The LP programme is finalized against the manufacturing limit per side before production.",
    fr: "Édition vinyle noir 12 pouces de collection. Le programme du LP est finalisé selon la limite de fabrication par face avant production."
  }
};

function resolveLocale(value: string | string[] | undefined): Locale {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === "en" || raw === "fr") return raw;
  return "pt";
}

function money(cents: number, locale: Locale) {
  const formatterLocale = locale === "pt" ? "pt-BR" : locale === "fr" ? "fr-CA" : "en-CA";
  return new Intl.NumberFormat(formatterLocale, {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0
  }).format(cents / 100);
}

function LanguageFlags({ locale }: { locale: Locale }) {
  const items = [
    { locale: "pt" as const, flag: "🇧🇷", label: "Português" },
    { locale: "en" as const, flag: "🇬🇧", label: "English" },
    { locale: "fr" as const, flag: "🇫🇷", label: "Français" }
  ];

  return (
    <nav
      aria-label="Idioma / Language / Langue"
      className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 p-1.5 shadow-xl backdrop-blur-md"
    >
      {items.map((item) => (
        <Link
          key={item.locale}
          href={`?lang=${item.locale}`}
          aria-label={item.label}
          title={item.label}
          className={`inline-flex h-8 min-w-9 items-center justify-center rounded-full border px-2 text-base transition ${
            locale === item.locale
              ? "border-[#d6a55b] bg-[#d6a55b]/20 shadow-[0_0_18px_rgba(214,165,91,.2)]"
              : "border-transparent bg-white/[0.03] hover:border-white/25"
          }`}
        >
          <span aria-hidden="true">{item.flag}</span>
        </Link>
      ))}
    </nav>
  );
}

export default async function EchoesBrasilReleasePage({
  searchParams
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const locale = resolveLocale(params.lang);
  const t = copy[locale];

  const products = (await getUnifiedCommerceProducts()).filter(
    (product) => product.projectSlug === "echoes-un-live-in-brasil" && product.visible
  );
  const physical = products.filter((product) => product.requiresShipping && product.priceCents > 0);

  return (
    <main lang={t.htmlLang} translate="no" className="min-h-screen bg-[#070504] text-white">
      <section className="relative isolate min-h-[78svh] overflow-hidden border-b border-[#bc8b49]/20">
        <Image
          src="/echoes-un-live-in-brasil/assets/images/edition-expanded.webp"
          alt="ECHOES UNlive in Brasil"
          fill
          priority
          className="object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,3,2,.20),rgba(5,3,2,.72)_58%,#070504)]" />

        <div className="absolute right-4 top-5 z-20 md:right-8 md:top-8">
          <LanguageFlags locale={locale} />
        </div>

        <div className="relative mx-auto flex min-h-[78svh] max-w-7xl items-end px-5 pb-16 pt-28 md:px-8 md:pb-24">
          <div className="max-w-4xl">
            <p className="text-xs font-black uppercase tracking-[0.36em] text-[#c94b3f]">{t.heroEyebrow}</p>
            <h1 className="notranslate mt-5 font-display text-[clamp(3rem,9vw,7.5rem)] uppercase leading-[.82] tracking-[0.02em] text-[#f3eadc]">
              ECHOES <span className="text-[#a92d2d]">UN</span>live in Brasil
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-300">{t.heroText}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="#editions" className="rounded-full bg-[#d6a55b] px-7 py-3 text-xs font-black uppercase tracking-[0.18em] text-black">
                {t.collectorEditions}
              </Link>
              <Link href="#programme" className="rounded-full border border-white/20 px-7 py-3 text-xs font-black uppercase tracking-[0.18em] text-white">
                {t.fullProgramme}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section id="programme" className="mx-auto max-w-7xl px-5 py-20 md:px-8 md:py-28">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c94b3f]">{t.programmeEyebrow}</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.05em] text-[#f0d7ad] md:text-6xl">{t.programmeTitle}</h2>
            <p className="mt-6 max-w-xl leading-8 text-stone-400">{t.programmeText}</p>
          </div>
          <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
            {tracks.map(([number, title]) => (
              <div key={number} className="flex items-baseline gap-4 border-b border-white/10 py-3">
                <span className="w-8 text-[10px] tracking-[0.2em] text-[#c94b3f]">{number}</span>
                <span translate="no" className="notranslate text-sm uppercase tracking-[0.08em] text-stone-200">
                  {title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="editions" className="border-y border-[#bc8b49]/15 bg-black/40 px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c94b3f]">{t.physicalEyebrow}</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <h2 className="font-display text-4xl uppercase tracking-[0.05em] text-[#f0d7ad] md:text-6xl">{t.madeToOrder}</h2>
            <p className="max-w-xl text-sm leading-7 text-stone-400">{t.productionText}</p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {physical.map((product) => {
              const productHref = productRoutes[product.id] || product.productPath || "/store";
              const localizedHref = `${productHref}${productHref.includes("?") ? "&" : "?"}lang=${locale}`;
              return (
              <article key={product.id} className="overflow-hidden border border-white/10 bg-[#0c0907]">
                <div className="relative aspect-square bg-black">
                  {product.images?.[0] && <Image src={product.images[0]} alt={product.name} fill className="object-cover" />}
                </div>
                <div className="p-6">
                  <p className="notranslate text-[10px] font-black uppercase tracking-[0.26em] text-[#c94b3f]">{product.subtitle}</p>
                  <h3 className="notranslate mt-3 text-2xl font-semibold text-white">{product.name}</h3>
                  <p className="mt-4 min-h-20 text-sm leading-7 text-stone-400">
                    {productDescriptions[product.id]?.[locale] || product.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-4">
                    <span className="text-xl font-semibold text-[#e0b36f]">{money(product.priceCents, locale)}</span>
                    <Link
                      href={localizedHref}
                      className="rounded-full border border-[#d6a55b]/45 px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.18em] text-[#e0b36f] hover:bg-[#d6a55b] hover:text-black"
                    >
                      {t.viewOrder}
                    </Link>
                  </div>
                </div>
              </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-20 md:grid-cols-2 md:px-8 md:py-28">
        <div className="relative min-h-[420px] overflow-hidden border border-white/10">
          <Image src="/echoes-un-live-in-brasil/assets/images/edition-livret.webp" alt="ECHOES UNlive in Brasil collector booklet" fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center border border-[#bc8b49]/20 bg-[#0d0907] p-8 md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.34em] text-[#c94b3f]">KDR-EUB-001</p>
          <h2 className="mt-4 font-display text-4xl uppercase text-[#f0d7ad]">{t.directArtistEdition}</h2>
          <p className="mt-6 leading-8 text-stone-300">{t.directText}</p>
          <p className="mt-5 text-sm leading-7 text-stone-500">© 2026 Kam Dridi · KAMDRIDI RECORDS</p>
          <Link href="/store" className="mt-8 w-fit rounded-full bg-[#d6a55b] px-7 py-3 text-xs font-black uppercase tracking-[0.18em] text-black">
            {t.officialStore}
          </Link>
        </div>
      </section>
    </main>
  );
}
