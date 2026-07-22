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
  title: {
    default: `${siteMeta.bandName} | Official Website`,
    template: `%s | ${siteMeta.bandName}`
  },
  description: siteMeta.description,
  keywords: siteMeta.keywords,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: `${siteMeta.bandName} | Official Website`,
    description: siteMeta.description,
    url: metadataBase,
    siteName: siteMeta.bandName,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/assets/images/releases/echoes-unearthed-cover.jpg",
        width: 1200,
        height: 630,
        alt: `${siteMeta.bandName} - ${siteMeta.albumName}`
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteMeta.bandName} | Official Website`,
    description: siteMeta.description,
    images: ["/assets/images/releases/echoes-unearthed-cover.jpg"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
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
