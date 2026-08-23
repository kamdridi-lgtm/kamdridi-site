import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Gilded Null",
  description:
    "The Gilded Null — Act I is currently in active development inside the KAMDRIDI games universe."
};

export default function TheGildedNullPage() {
  return (
    <>
      <section className="overflow-hidden border-b border-white/10">
        <div className="relative min-h-[76svh] overflow-hidden">
          <Image
            src="/assets/images/games/gilded-null-master.png"
            alt="The Gilded Null corridor protocol hero"
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.05),rgba(0,0,0,0.2)_42%,rgba(0,0,0,0.86))]" />
          <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-4 pb-10 sm:px-6 md:pb-14">
            <div className="max-w-4xl">
              <Image
                src="/assets/images/games/gilded-null-logo.png"
                alt="KAMDRIDI - The Gilded Null"
                width={1672}
                height={941}
                priority
                className="h-auto w-full max-w-4xl object-contain drop-shadow-[0_24px_45px_rgba(0,0,0,0.72)]"
              />
            </div>
          </div>
        </div>
        <Section className="py-10 md:py-12">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">
              Corridor Protocol
            </p>
            <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-7xl">
              The Gilded Null
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
              Act I is currently in active development. The public playable build is temporarily
              offline while the next development pass is completed.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.28em] text-stone-400">
              <span className="rounded-full border border-[#f4c66a]/40 bg-[#f4c66a]/10 px-4 py-2 text-[#f4c66a]">
                In Development
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2 text-white">
                Act I
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2 text-white">
                Next Build In Progress
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <CTAButton href="/games" tone="secondary">
                Back To Games
              </CTAButton>
              <CTAButton href="/visual-album#featured-sequence" tone="secondary">
                View Visual Album
              </CTAButton>
            </div>
          </div>
        </Section>
      </section>

      <Section>
        <div className="overflow-hidden rounded-[32px] border border-[#f4c66a]/20 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.35em] text-stone-400">
            Development Status
          </div>
          <div className="relative flex min-h-[420px] w-full items-center justify-center overflow-hidden bg-black px-6 py-16 text-center">
            <Image
              src="/assets/images/games/gilded-null-master.png"
              alt="The Gilded Null development preview"
              fill
              className="object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,198,106,0.08),rgba(0,0,0,0.88)_65%)]" />
            <div className="relative z-10 mx-auto max-w-2xl">
              <p className="text-xs uppercase tracking-[0.42em] text-[#f4c66a]">
                Public Build Temporarily Offline
              </p>
              <h2 className="mt-5 font-display text-3xl uppercase tracking-[0.08em] text-white md:text-5xl">
                The Next Build Is Being Forged
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-stone-300 md:text-base">
                Development continues on The Gilded Null — Act I. This page will reopen the playable
                build when the current production pass is ready for public testing.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-sm leading-7 text-stone-500">
          Explore the full universe from <Link href="/games" className="text-[#f4c66a] transition hover:text-[#ffd989]">Games</Link>,{" "}
          <Link href="/fan-club#membership" className="text-[#f4c66a] transition hover:text-[#ffd989]">Fan Club</Link>, or{" "}
          <Link href="/visual-album#featured-sequence" className="text-[#f4c66a] transition hover:text-[#ffd989]">Visual Album</Link>.
        </div>
      </Section>
    </>
  );
}
