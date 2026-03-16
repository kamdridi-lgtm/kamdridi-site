import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import { Storefront } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Store",
  description:
    "Shop the official KAMDRIDI merch store with cinematic collector products, Stripe checkout, and automated fulfillment."
};

export default function StorePage() {
  return (
    <>
      <PageHero
        eyebrow="Store"
        title="Collector merch, artifact drops, and physical formats"
        description="A cinematic KAMDRIDI merch store with featured bundles, cart-based checkout, secure Stripe payments, and automated fulfillment routing."
        image="/store/artifact-bundle.jpg"
      />
      <Section>
        <SectionHeading
          eyebrow="Merch Store"
          title="Professional storefront for Echoes Unearthed"
          description="Featured collector bundle, merch grid, persistent cart, Stripe-hosted checkout, and fulfillment flow prepared for automatic production and shipping."
        />
        <div className="mt-12">
          <Suspense fallback={<div className="text-sm text-stone-400">Loading storefront...</div>}>
            <Storefront />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
