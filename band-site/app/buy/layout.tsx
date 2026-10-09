import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OUR LOST DREAMS — $2.99 CAD",
  description:
    "Buy OUR LOST DREAMS by KAM DRIDI directly from the official artist website. Digital single: $2.99 CAD. Secure Stripe checkout.",
  alternates: {
    canonical: "/buy"
  },
  openGraph: {
    title: "OUR LOST DREAMS — $2.99 CAD | KAM DRIDI",
    description:
      "Official digital single by KAM DRIDI. Buy direct for $2.99 CAD through secure Stripe checkout.",
    url: "/buy",
    siteName: "KAM DRIDI",
    type: "website",
    locale: "en_CA",
    images: [
      {
        url: "/assets/images/our-lost-dreams-cover.jpg",
        width: 1200,
        height: 1200,
        alt: "OUR LOST DREAMS — KAM DRIDI"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "OUR LOST DREAMS — $2.99 CAD | KAM DRIDI",
    description:
      "Official digital single by KAM DRIDI. Buy direct for $2.99 CAD.",
    images: ["/assets/images/our-lost-dreams-cover.jpg"]
  }
};

export default function BuyLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
