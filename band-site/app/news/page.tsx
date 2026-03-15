import type { Metadata } from "next";
import Image from "next/image";
import { PageHero, GlassCard, Section } from "@/components/ui";
import { newsPosts } from "@/data/site";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
  description: "Official news, campaign updates, releases, and announcements from KAMDRIDI."
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="News"
        title="Official headlines, updates, and campaign stories"
        description="A blog-style news feed for album rollouts, touring news, media premieres, merch drops, and all artist announcements."
        image="/assets/images/press-bio-bg.jpg"
      />
      <Section id="latest-headlines">
        <div className="grid gap-6">
          {newsPosts.map((post) => (
            <GlassCard key={post.slug} className="grid gap-8 overflow-hidden p-0 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="relative min-h-72">
                <Image src={post.image} alt={post.title} fill className="object-cover" />
              </div>
              <div className="p-8">
                <p className="text-xs uppercase tracking-[0.4em] text-[#f4c66a]">{formatDate(post.date)}</p>
                <h2 className="mt-4 text-3xl text-white md:text-4xl">{post.title}</h2>
                <p className="mt-4 text-base leading-8 text-stone-400">{post.excerpt}</p>
                <div className="mt-6 grid gap-4 text-sm leading-8 text-stone-300">
                  {post.content.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>
    </>
  );
}
