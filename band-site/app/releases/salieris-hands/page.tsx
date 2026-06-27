import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "SALIERI'S HANDS - KAMDRIDI",
  description:
    "SALIERI'S HANDS - a special off-series KAMDRIDI release. Vienna, 1791. Faith. Envy. Confession. Album coming July 2026."
};

export default function SalierisHandsReleasePage() {
  return (
    <iframe
      src="/releases/salieris-hands/index.html"
      title="SALIERI'S HANDS - KAMDRIDI"
      className="block h-screen w-full border-0 bg-black"
    />
  );
}