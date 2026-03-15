import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHero, Section, SectionHeading } from "@/components/ui";
import { Storefront } from "@/components/storefront";

export const metadata: Metadata = {
  title: "Store",
  description: "Shop official KAMDRIDI merch, Echoes Unearthed formats, and collector editions."
};

export default function StorePage() {
  return (
    <>
      <PageHero
        eyebrow="Store"
        title="Merch, music, and premium collector drops"
        description="A full merchandise storefront with product imagery, descriptions, price, size selection, add-to-cart actions, and Stripe checkout."
        image="/assets/images/merch/tee_black.png"
      />
      <Section>
        <SectionHeading
          eyebrow="Merch Store"
          title="Everything a professional artist store needs"
          description="T-shirts, hoodies, vinyl, CDs, limited editions, and accessories are all included with ready-to-expand product data."
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
