import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: {
  eyebrow: string;
  title: string;
  description: string;
  align?: "left" | "center";
}) {
  return (
    <div className={clsx("max-w-3xl", align === "center" && "mx-auto text-center")}>
      <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{eyebrow}</p>
      <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.1em] text-white md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-stone-400">{description}</p>
    </div>
  );
}

export function Section({
  id,
  className,
  children
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={clsx("mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-28", className)}>
      {children}
    </section>
  );
}

export function GlassCard({
  className,
  children,
  id
}: {
  className?: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={clsx(
        "rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_35px_80px_rgba(0,0,0,0.35)] backdrop-blur",
        className
      )}
    >
      {children}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  description,
  image
}: {
  eyebrow: string;
  title: string;
  description: string;
  image: string;
}) {
  return (
    <section className="relative isolate overflow-hidden border-b border-white/10">
      <div className="absolute inset-0">
        <Image src={image} alt={title} fill className="object-cover opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.22),transparent_30%),linear-gradient(180deg,rgba(6,6,6,0.25),rgba(6,6,6,0.95))]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32">
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{eyebrow}</p>
        <h1 className="mt-5 max-w-4xl font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-7xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300">{description}</p>
      </div>
    </section>
  );
}

export function CTAButton({
  href,
  children,
  tone = "primary"
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center rounded-full px-6 py-3 text-sm uppercase tracking-[0.25em] transition duration-300",
        tone === "primary"
          ? "bg-[#f4c66a] text-black hover:-translate-y-0.5 hover:bg-[#ffd989]"
          : "border border-white/15 text-white hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
      )}
    >
      {children}
    </Link>
  );
}
