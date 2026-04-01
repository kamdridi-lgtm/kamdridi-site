const previewPages = [
  { title: "Home", href: "/" },
  { title: "Music", href: "/music" },
  { title: "Store", href: "/store" },
  { title: "Fan Club", href: "/fan-club" },
  { title: "Games", href: "/games" },
  { title: "Visual Album", href: "/visual-album" },
  { title: "Who is Kam Dridi", href: "/who-is-kam-dridi" },
  { title: "Band", href: "/band" },
  { title: "Media", href: "/media" },
  { title: "News", href: "/news" },
  { title: "Tour", href: "/tour" },
  { title: "Contact", href: "/contact" }
];

export default function SitePreviewPage() {
  return (
    <main className="min-h-screen bg-[#070707] px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">KAMDRIDI</p>
          <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white md:text-6xl">
            Full Site Preview
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-400">
            Live preview board of the real pages currently served from the local KAMDRIDI site.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {previewPages.map((page) => (
            <section
              key={page.href}
              className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_35px_80px_rgba(0,0,0,0.35)]"
            >
              <div className="flex items-center justify-between border-b border-white/10 bg-black/40 px-4 py-3">
                <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">{page.title}</p>
                <p className="text-[10px] uppercase tracking-[0.28em] text-stone-500">{page.href}</p>
              </div>
              <div className="relative aspect-[16/10] bg-black">
                <iframe
                  src={page.href}
                  title={page.title}
                  className="absolute left-0 top-0 h-[400%] w-[400%] origin-top-left scale-[0.25] border-0 bg-black"
                />
              </div>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
