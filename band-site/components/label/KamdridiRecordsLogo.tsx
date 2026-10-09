import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

const logoPath = "/brand/kamdridi-records-logo.png";
const logoFile = path.join(process.cwd(), "public", "brand", "kamdridi-records-logo.png");

type KamdridiRecordsLogoProps = {
  className?: string;
  priority?: boolean;
  size?: "hero" | "section" | "compact";
};

export function KamdridiRecordsLogo({ className = "", priority = false, size = "section" }: KamdridiRecordsLogoProps) {
  const hasLogoAsset = fs.existsSync(logoFile);

  const sizes = {
    hero: "mx-auto w-full max-w-[980px] sm:max-w-[1180px]",
    section: "mx-auto w-full max-w-[720px] sm:max-w-[900px]",
    compact: "mx-auto w-full max-w-[440px] sm:max-w-[560px]"
  };

  if (!hasLogoAsset) {
    return (
      <div
        className={`${sizes[size]} ${className}`}
        aria-label="KAMDRIDI RECORDS logo"
        role="img"
      >
        <div className="inline-flex w-full items-center justify-center gap-3 border border-[#f4c66a]/20 bg-black/35 px-4 py-4 text-center shadow-[0_22px_70px_rgba(0,0,0,0.26)]">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#f4c66a]/50 bg-black text-lg font-black text-[#f4c66a] shadow-[0_0_28px_rgba(244,198,106,0.18)] sm:h-14 sm:w-14">
            KR
          </span>
          <span className="font-display text-2xl uppercase tracking-[0.16em] text-[#f4c66a] sm:text-3xl">
            KAMDRIDI RECORDS
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${sizes[size]} ${className}`}>
      <Image
        src={logoPath}
        alt="KAMDRIDI RECORDS logo"
        width={2048}
        height={512}
        priority={priority}
        className="h-auto w-full object-contain"
        sizes={size === "compact" ? "(max-width: 768px) 88vw, 560px" : "(max-width: 768px) 94vw, 1120px"}
      />
    </div>
  );
}
