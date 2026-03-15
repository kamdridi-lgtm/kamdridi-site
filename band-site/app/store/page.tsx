import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import { Storefront } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Store",
  description: "Shop official KAMDRIDI products and services with hosted Stripe Payment Links."
};

export default function StorePage() {
  return (
    <>
      <PageHero
        eyebrow="Store"
        title="Merch, music, and premium collector drops"
        description="A full merchandise and services storefront using secure hosted Stripe Payment Links."
        image="/assets/images/merch/tee_black.png"
      />
      <Section>
        <SectionHeading
          eyebrow="Merch Store"
          title="Hosted checkout for products and premium offers"
          description="Every buy button opens a secure Stripe hosted checkout in a new tab for direct product and service sales."
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
