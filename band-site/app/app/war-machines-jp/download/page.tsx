"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const STATUS_ENDPOINT = "https://retoydsgsuvznlpsguts.supabase.co/functions/v1/war-machines-download";

type DownloadStatus = {
  ready?: boolean;
  state?: string;
  track_title?: string;
  downloads_remaining?: number;
  expires_at?: string;
  error?: string;
};

export default function WarMachinesJapanDownloadPage() {
  const [sessionId, setSessionId] = useState("");
  const [status, setStatus] = useState<DownloadStatus>({ state: "loading" });
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("session_id") || "";
    setSessionId(id);
    if (!id.startsWith("cs_")) setStatus({ state: "invalid" });
  }, []);

  useEffect(() => {
    if (!sessionId.startsWith("cs_") || status.ready || attempts >= 12) return;

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `${STATUS_ENDPOINT}?mode=status&session_id=${encodeURIComponent(sessionId)}`,
          { cache: "no-store" },
        );
        const data = (await response.json().catch(() => ({}))) as DownloadStatus;
        if (cancelled) return;

        if (response.ok && data.ready) {
          setStatus(data);
          return;
        }

        if (response.status === 202 || data.state === "processing") {
          setStatus({ ...data, state: "processing" });
          setAttempts((value) => value + 1);
          return;
        }

        setStatus(data.state ? data : { state: "unavailable" });
      } catch {
        if (!cancelled) {
          setStatus({ state: "processing" });
          setAttempts((value) => value + 1);
        }
      }
    }, attempts === 0 ? 250 : 1800);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [sessionId, status.ready, status.state, attempts]);

  const downloadHref = useMemo(() => {
    if (!sessionId) return "#";
    return `${STATUS_ENDPOINT}?session_id=${encodeURIComponent(sessionId)}`;
  }, [sessionId]);

  const ready = Boolean(status.ready);
  const processing = ["loading", "processing"].includes(status.state || "");
  const limitReached = status.state === "limit_reached";
  const expired = status.state === "expired";

  return (
    <main lang="ja" className="min-h-screen bg-black px-5 py-14 text-white">
      <div className="mx-auto max-w-2xl border border-[#a51b18]/80 bg-[linear-gradient(180deg,rgba(24,18,18,0.96),rgba(5,5,6,0.99))] p-6 shadow-[0_0_50px_rgba(170,20,10,0.25)] sm:p-10">
        <p className="text-xs font-black uppercase tracking-[0.32em] text-[#ff6d49]">KAM DRIDI • JAPAN DIGITAL DELIVERY</p>
        <h1 className="mt-4 text-3xl font-black tracking-[0.03em] sm:text-5xl">WAR MACHINES</h1>
        <p className="mt-4 text-base font-semibold leading-7 text-stone-300">
          ご購入ありがとうございます。Stripeでのお支払い確認後、このページから購入した音源を安全にダウンロードできます。
        </p>
        <p className="mt-2 text-sm leading-6 text-stone-400">
          Thank you for your purchase. Your secure download becomes available here as soon as Stripe confirms the payment.
        </p>

        <div className="mt-8 border border-[#4f1b18] bg-black/45 p-5">
          {processing && attempts < 12 ? (
            <>
              <p className="font-black text-[#ffb28a]">お支払いを確認しています…</p>
              <p className="mt-2 text-sm text-stone-400">Payment confirmation is processing. This page checks automatically.</p>
            </>
          ) : ready ? (
            <>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#ff6d49]">READY</p>
              <p className="mt-2 text-xl font-black">{status.track_title}</p>
              <p className="mt-2 text-sm text-stone-400">
                Remaining secure downloads: {status.downloads_remaining ?? 0}
              </p>
              <a
                href={downloadHref}
                className="mt-5 inline-flex min-h-12 items-center justify-center border border-[#ff321d] bg-[linear-gradient(180deg,#b81710,#4a0807)] px-5 py-3 text-sm font-black tracking-[0.08em] text-white shadow-[0_0_28px_rgba(255,31,18,0.24)]"
              >
                WAVをダウンロード / DOWNLOAD WAV
              </a>
              <p className="mt-4 text-xs leading-5 text-stone-500">
                The generated file link is temporary. Keep this purchase-confirmation page private.
              </p>
            </>
          ) : limitReached ? (
            <>
              <p className="font-black text-[#ffb28a]">ダウンロード上限に達しました。</p>
              <p className="mt-2 text-sm text-stone-400">The secure download limit for this purchase has been reached.</p>
            </>
          ) : expired ? (
            <>
              <p className="font-black text-[#ffb28a]">ダウンロード期間が終了しました。</p>
              <p className="mt-2 text-sm text-stone-400">This secure download entitlement has expired.</p>
            </>
          ) : (
            <>
              <p className="font-black text-[#ffb28a]">まだダウンロードを準備できません。</p>
              <p className="mt-2 text-sm text-stone-400">
                We could not verify a downloadable purchase from this link. If you just paid, wait a few seconds and refresh this page.
              </p>
            </>
          )}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="border border-[#5e2a25] px-4 py-2 text-xs font-black tracking-[0.1em] text-stone-200"
          >
            再確認 / REFRESH
          </button>
          <Link
            href="/app/war-machines-jp"
            className="border border-[#5e2a25] px-4 py-2 text-xs font-black tracking-[0.1em] text-stone-200"
          >
            WAR MACHINESへ戻る
          </Link>
        </div>
      </div>
    </main>
  );
}
