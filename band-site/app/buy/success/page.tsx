"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Status = "checking" | "confirmed" | "pending" | "error";

export default function BuySuccessPage() {
  const [status, setStatus] = useState<Status>("checking");

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get("session_id") || "";
    if (!sessionId) {
      setStatus("error");
      return;
    }

    void fetch(`/api/buy-our-lost-dreams/session?session_id=${encodeURIComponent(sessionId)}`, {
      cache: "no-store"
    })
      .then(async (response) => {
        const data = await response.json().catch(() => ({}));
        if (response.ok && data.paid === true) {
          setStatus("confirmed");
        } else {
          setStatus("pending");
        }
      })
      .catch(() => setStatus("error"));
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] px-5 py-12 text-white">
      <section className="mx-auto flex min-h-[82vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-[28px] border border-white/10 bg-[#0b0b0b] p-8 text-center shadow-2xl sm:p-12">
          {status === "confirmed" ? (
            <>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#f4c66a]">
                Payment confirmed
              </p>
              <h1 className="mt-5 font-display text-4xl uppercase tracking-[0.06em] sm:text-5xl">
                THANK YOU
              </h1>
              <p className="mt-5 text-lg text-stone-200">
                OUR LOST DREAMS — purchase complete.
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-400">
                Your Stripe receipt is your proof of purchase. The digital copy will be sent to
                the email used at checkout.
              </p>
            </>
          ) : status === "checking" ? (
            <p className="text-stone-300">Confirming your payment…</p>
          ) : status === "pending" ? (
            <>
              <h1 className="text-3xl font-bold">Payment is still processing</h1>
              <p className="mt-4 text-stone-400">Please wait a moment and refresh this page.</p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold">We could not verify this payment</h1>
              <p className="mt-4 text-stone-400">
                Please keep your Stripe receipt and contact KAM DRIDI if you need help.
              </p>
            </>
          )}

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-stone-200 hover:bg-white/[0.05]"
            >
              KAM DRIDI
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
