import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, GlassCard, Section, SectionHeading } from "@/components/ui";
import { newsPosts } from "@/data/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
  description: "Official news, campaign updates, releases, and announcements from KAMDRIDI."
};

const [leadPost, ...archivePosts] = newsPosts;

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News"
        title="Official headlines, updates, and campaign stories"
        description="Campaign updates, release notes, touring signals, and public headlines from the KAMDRIDI universe."
        image="/assets/images/press-bio-bg.jpg"
      />
      <Section id="latest-headlines">
        {leadPost ? (
          <>
            <SectionHeading
              eyebrow="Lead Story"
              title={leadPost.title}
              description={leadPost.excerpt}
            />
            <GlassCard className="mt-12 grid gap-8 overflow-hidden p-0 lg:grid-cols-[0.92fr_1.08fr]">
              <div className="relative min-h-80">
                <Image src={leadPost.image} alt={leadPost.title} fill className="object-cover" />
              </div>
              <div className="p-8">
                <p className="text-xs uppercase tracking-[0.4em] text-[#f4c66a]">
                  {formatDate(leadPost.date)}
                </p>
                <div className="mt-6 grid gap-4 text-sm leading-8 text-stone-300">
                  {leadPost.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/media#featured-video"
                    className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-6 py-3 text-sm uppercase tracking-[0.25em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989]"
                  >
                    Open Media
                  </Link>
                  <Link
                    href="/tour#dates"
                    className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
                  >
                    View Tour
                  </Link>
                </div>
              </div>
            </GlassCard>
          </>
        ) : null}

        {archivePosts.length ? (
          <>
            <SectionHeading
              eyebrow="Archive"
              title="Previous campaign notes"
              description="Earlier release announcements, rollout milestones, and public updates from the Echoes Unearthed cycle."
            />
            <div className="mt-12 grid gap-6 xl:grid-cols-2">
              {archivePosts.map((post) => (
                <GlassCard
                  key={post.slug}
                  className="grid gap-6 overflow-hidden p-0 lg:grid-cols-[0.44fr_0.56fr]"
                >
                  <div className="relative min-h-72">
                    <Image src={post.image} alt={post.title} fill className="object-cover" />
                  </div>
                  <div className="p-7">
                    <p className="text-xs uppercase tracking-[0.4em] text-[#f4c66a]">
                      {formatDate(post.date)}
                    </p>
                    <h2 className="mt-4 text-3xl text-white">{post.title}</h2>
                    <p className="mt-4 text-base leading-8 text-stone-400">{post.excerpt}</p>
                    <p className="mt-5 text-sm leading-8 text-stone-300">{post.content[0]}</p>
                  </div>
                </GlassCard>
              ))}
            </div>
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <Link href="/store" className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]">
                <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Store</span>
                <span className="mt-3 block leading-7">Move from the headlines into the current merch and collector drops.</span>
              </Link>
              <Link href="/fan-club#membership" className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]">
                <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Fan Club</span>
                <span className="mt-3 block leading-7">Use the membership area for private updates and deeper campaign access.</span>
              </Link>
              <Link href="/music#discography" className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]">
                <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Music</span>
                <span className="mt-3 block leading-7">Jump from the news archive into the live music and release timeline.</span>
              </Link>
            </div>
          </>
        ) : null}
      </Section>
    </>
  );
}
