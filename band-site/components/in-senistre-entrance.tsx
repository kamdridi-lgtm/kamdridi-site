"use client";

import { useEffect, useRef, useState } from "react";

const welcomeKey = "kamdridi-in-senistre-entry-seen-v1";
const imageUrl = "/in-senistre/assets/v33_exterior_spread_v55_lossless.webp";

export function InSenistreEntrance() {
  const [visible, setVisible] = useState(true);
  const portalRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    try {
      const deepLink = Boolean(window.location.hash) ||
        new URLSearchParams(window.location.search).get("skipEntrance") === "1";
      if (deepLink || window.sessionStorage.getItem(welcomeKey) === "1") {
        setVisible(false);
        return;
      }
    } catch {
      // When session storage is unavailable, the entrance still works.
    }
    portalRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!visible) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [visible]);

  function markEntered() {
    try { window.sessionStorage.setItem(welcomeKey, "1"); } catch {}
  }

  function continueToWebsite() {
    markEntered();
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <section
      aria-label="IN | SENISTRE — choose an entrance"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[2147483000] isolate overflow-y-auto bg-[#030302]"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-[position:83%_center] md:bg-center"
        style={{ backgroundImage: `url("${imageUrl}")` }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.78),transparent_53%),linear-gradient(90deg,rgba(0,0,0,0.48),transparent_65%)]"
      />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[120px] bg-[linear-gradient(180deg,#020202_0%,rgba(2,2,2,0.98)_60%,transparent_100%)] md:hidden" />
      <div className="relative mx-auto flex min-h-[100svh] w-full max-w-7xl flex-col items-center justify-end px-5 pb-[max(6vh,32px)] pt-6 text-center md:items-start md:px-12 md:pb-[max(9vh,52px)] md:text-left">
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.34em] text-[#d5c5b3] drop-shadow-[0_2px_8px_black]">
          KAM DRIDI · OFF-SERIES ALBUM
        </p>
        <nav aria-label="Choose a destination" className="flex w-full max-w-lg flex-col gap-3 sm:flex-row md:max-w-none">
          <a
            ref={portalRef}
            href="/in-senistre/index.html"
            onClick={(event) => {
              event.preventDefault();
              markEntered();
              window.location.assign("/in-senistre/index.html");
            }}
            className="inline-flex min-h-[56px] items-center justify-center border border-[#f3dcb9] bg-[#ddc5a2] px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.13em] text-[#18130f] shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition hover:bg-[#fff0d5] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            ENTER IN | SENISTRE
          </a>
          <button
            type="button"
            onClick={continueToWebsite}
            className="inline-flex min-h-[56px] items-center justify-center border border-[#b8a48b] bg-[#080807]/85 px-6 py-4 text-center text-xs font-bold uppercase tracking-[0.13em] text-[#f0e5d7] shadow-[0_10px_30px_rgba(0,0,0,0.4)] transition hover:bg-[#302923] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            CONTINUE TO KAMDRIDI.COM
          </button>
        </nav>
      </div>
    </section>
  );
}
