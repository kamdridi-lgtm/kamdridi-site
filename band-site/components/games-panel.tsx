import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui";
import { gameExperiences } from "@/data/site";

export function GamesPanel() {
  const gildedNull = gameExperiences.find((game) => game.id === "the-gilded-null");

  return (
    <>
      {gildedNull ? (
        <Section id="the-gilded-null" className="py-10 md:py-12">
          <div className="game-banner overflow-hidden rounded-[32px] border border-[#f4c66a]/20 bg-black">
            <div className="relative aspect-[16/10] min-h-[360px] sm:aspect-[21/9]">
              <Image
                src={gildedNull.poster}
                alt="The Gilded Null launch art"
                fill
                className="object-cover object-center"
                sizes="(min-width: 1024px) 1120px, 100vw"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.03),rgba(0,0,0,0.32))]" />
            </div>
            <div className="flex justify-center border-t border-[#f4c66a]/15 bg-black px-5 py-6">
              <Link
                href={gildedNull.launchUrl}
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#f4c66a] px-7 py-3 text-sm uppercase tracking-[0.25em] text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffd989]"
              >
                INITIATE PROTOCOL
              </Link>
            </div>
          </div>
        </Section>
      ) : null}
    </>
  );
}
