import type { Metadata } from "next";
import "./globals.css";
import { siteMeta } from "@/data/site";
import { Providers } from "@/components/providers";
import { SiteShell } from "@/components/site-shell";
import { UnLetterHighlighter } from "@/components/un-letter-highlighter";
import { MyriamWidget } from "@/components/myriam-widget";
import { DemographicsTracker } from "@/components/demographics-tracker";
import { GlobalAudioPlayer } from "@/components/global-audio-player";

let siteUrl = process.env.NEXT_PUBLIC_SITE_URL || siteMeta.domain;
if (siteUrl && !siteUrl.startsWith("http")) {
  siteUrl = `https://${siteUrl}`;
}
const metadataBase = new URL(siteUrl);

export const metadata: Metadata = {
  metadataBase,
  manifest: "/manifest.json",
  icons: {
    icon: "/assets/images/kamdridi-pwa-icon.png",
    apple: "/assets/images/kamdridi-pwa-icon.png"
  },
  appleWebApp: {
    capable: true,
    title: "KAM DRIDI",
    statusBarStyle: "black-translucent"
  },
  title: {
    default: "KAM DRIDI | Official Website",
    template: "%s | KAM DRIDI"
  },
  description: siteMeta.description,
  keywords: siteMeta.keywords,
  authors: [{ name: "KAM DRIDI", url: metadataBase }],
  creator: "KAM DRIDI",
  publisher: "KAM DRIDI",
  category: "music",
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: "KAM DRIDI | Official Website",
    description: siteMeta.description,
    url: metadataBase,
    siteName: "KAM DRIDI",
    locale: "en_CA",
    type: "website",
    images: [
      {
        url: "/assets/images/releases/echoes-unearthed-cover.jpg",
        width: 1200,
        height: 630,
        alt: `KAM DRIDI - ${siteMeta.albumName}`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "KAM DRIDI | Official Website",
    description: siteMeta.description,
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"]
  }
};

const artistStructuredData = {
  "@context": "https://schema.org",
  "@type": "MusicGroup",
  "@id": `${siteUrl}/#artist`,
  name: "KAM DRIDI",
  alternateName: "KAMDRIDI",
  url: siteUrl,
  image: `${siteUrl}/assets/images/kamdridi-pwa-icon.png`,
  description: siteMeta.description,
  genre: ["Cinematic Rock", "Hard Rock", "Industrial Rock"],
  foundingLocation: {
    "@type": "Place",
    name: "Montreal, Quebec, Canada"
  },
  sameAs: [
    "https://youtube.com/@kamdridi",
    "https://instagram.com/kamdridi",
    "https://tiktok.com/@kamdridi",
    "https://music.apple.com/us/artist/kam-dridi/1871722663",
    "https://facebook.com/kamdridi",
    "https://x.com/kamdridi"
  ]
};

const websiteStructuredData = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteUrl}/#website`,
  url: siteUrl,
  name: "KAM DRIDI",
  alternateName: "KAMDRIDI",
  publisher: {
    "@id": `${siteUrl}/#artist`
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(artistStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        />
        <Providers>
          <DemographicsTracker />
          <UnLetterHighlighter />
          <MyriamWidget />
          <GlobalAudioPlayer />
          <SiteShell>{children}</SiteShell>
        </Providers>
      </body>
    </html>
  );
}
