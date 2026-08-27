"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const SUPABASE_FUNCTIONS = "https://retoydsgsuvznlpsguts.supabase.co/functions/v1";

type OrderPayload = {
  ready?: boolean;
  state?: string;
  order?: {
    payment_status?: string;
    fulfillment_status?: string;
    currency?: string;
    amount_total?: number | null;
    created_at?: string;
  };
  items?: Array<{
    id: string;
    product_id?: string | null;
    product_name: string;
    quantity: number;
    color?: string | null;
    size?: string | null;
    format?: string | null;
    fulfillment_mode?: string | null;
  }>;
  fulfillment_tasks?: Array<{
    id: string;
    order_item_id?: string | null;
    product_id?: string | null;
    task_type: string;
    provider?: string | null;
    status: string;
    customer_stage: "queued" | "in_production" | "quality_check" | "shipped" | "delivered" | "issue";
    due_at?: string | null;
    created_at?: string | null;
    updated_at?: string | null;
    tracking_number?: string | null;
    tracking_url?: string | null;
    customer_note?: string | null;
  }>;
  digital_entitlements?: Array<{
    entitlement_id: string;
    product_id?: string | null;
    track_id?: string | null;
    label: string;
    subtitle?: string | null;
    ready: boolean;
    state: string;
    downloads_remaining: number;
    expires_at: string;
  }>;
  error?: string;
};

const stages = [
  { key: "queued", label: "Queued" },
  { key: "in_production", label: "In production" },
  { key: "quality_check", label: "Quality check" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" }
] as const;

function money(amount: number | null | undefined, currency: string | undefined) {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: (currency || "CAD").toUpperCase()
  }).format(amount / 100);
}

function stageIndex(stage: string | undefined) {
  return Math.max(0, stages.findIndex((item) => item.key === stage));
}

export function OrderClient() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id") || "";
  const [payload, setPayload] = useState<OrderPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  const orderUrl = useMemo(() => {
    if (!sessionId) return null;
    return `${SUPABASE_FUNCTIONS}/commerce-order-access?session_id=${encodeURIComponent(sessionId)}`;
  }, [sessionId]);

  useEffect(() => {
    if (!orderUrl) {
      setError("Missing checkout session.");
      return;
    }
    let cancelled = false;
    const run = async () => {
      try {
        const response = await fetch(orderUrl, { cache: "no-store" });
        const data = (await response.json().catch(() => ({}))) as OrderPayload;
        if (cancelled) return;
        if (response.status === 202) {
          setPayload(data);
          window.setTimeout(() => setAttempt((value) => value + 1), 1500);
          return;
        }
        if (!response.ok) throw new Error(data.error || "Unable to load this order.");
        setPayload(data);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Unable to load this order.");
      }
    };
    void run();
    return () => { cancelled = true; };
  }, [orderUrl, attempt]);

  const hasMadeToOrder = Boolean(payload?.items?.some((item) => item.fulfillment_mode === "made_to_order"));
  const hasManualDigital = Boolean(payload?.items?.some((item) => item.fulfillment_mode === "digital_manual"));
  const madeToOrderTasks = (payload?.fulfillment_tasks || []).filter((task) => task.task_type === "made_to_order_production");

  const download = (entitlementId: string) => {
    if (!sessionId) return;
    window.location.href = `${SUPABASE_FUNCTIONS}/commerce-download?entitlement_id=${encodeURIComponent(entitlementId)}&session_id=${encodeURIComponent(sessionId)}`;
  };

  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#f4c66a]">Secure Order</p>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] md:text-6xl">Payment received</h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-300">
          Thank you for buying directly from KAM DRIDI. This page is tied to your Stripe checkout session. A confirmation message is sent to the email used at checkout with your purchased items, delivery instructions, and included artwork when available.
        </p>

        {hasManualDigital && (
          <div className="mt-7 rounded-2xl border border-[#f4c66a]/30 bg-[#f4c66a]/[0.07] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f4c66a]">Digital purchase confirmed</p>
            <p className="mt-2 text-sm leading-7 text-stone-200">
              Your digital purchase is confirmed. Keep your Stripe receipt. When a private-vault download is active it appears here; otherwise secure delivery is sent to the email entered at checkout.
            </p>
          </div>
        )}

        {hasMadeToOrder && (
          <div className="mt-7 rounded-2xl border border-[#f4c66a]/30 bg-[#f4c66a]/[0.07] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f4c66a]">Made to order</p>
            <p className="mt-2 text-sm leading-7 text-stone-200">
              Your physical edition enters production after payment. Please allow several weeks for manufacturing, quality control and delivery. You do not need to place another order or make another payment for production.
            </p>
          </div>
        )}

        {!sessionId && <div className="mt-8 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-5 text-rose-100">Missing checkout session.</div>}
        {error && <div className="mt-8 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-5 text-rose-100">{error}</div>}
        {!error && payload?.state === "processing" && <div className="mt-8 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 text-amber-100">Payment is confirmed by Stripe. Finalizing the order record…</div>}

        {payload?.order && (
          <div className="mt-8 grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-3">
            <div><p className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Payment</p><p className="mt-2 text-lg font-semibold text-white">{payload.order.payment_status || "paid"}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Fulfillment</p><p className="mt-2 text-lg font-semibold text-white">{(payload.order.fulfillment_status || "pending").replaceAll("_", " ")}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.25em] text-stone-500">Total</p><p className="mt-2 text-lg font-semibold text-[#f4c66a]">{money(payload.order.amount_total, payload.order.currency)}</p></div>
          </div>
        )}

        {madeToOrderTasks.length > 0 && (
          <section className="mt-10 rounded-[28px] border border-[#f4c66a]/20 bg-[#f4c66a]/[0.03] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#f4c66a]">Production tracking</p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em]">Your order journey</h2>
            <div className="mt-8 grid gap-6">
              {madeToOrderTasks.map((task) => {
                const current = stageIndex(task.customer_stage);
                return (
                  <article key={task.id} className="rounded-2xl border border-white/10 bg-black/35 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{task.provider ? `Production partner · ${task.provider}` : "Production partner assigned"}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{task.customer_stage === "issue" ? "Production review required" : stages[current]?.label || "Queued"}</p>
                      </div>
                      {task.tracking_url && (
                        <a href={task.tracking_url} target="_blank" rel="noreferrer" className="rounded-full border border-[#f4c66a]/40 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#f4c66a] hover:bg-[#f4c66a]/10">Track shipment</a>
                      )}
                    </div>

                    {task.customer_stage !== "issue" && (
                      <div className="mt-6 grid grid-cols-5 gap-2">
                        {stages.map((stage, index) => (
                          <div key={stage.key}>
                            <div className={`h-1.5 rounded-full ${index <= current ? "bg-[#f4c66a]" : "bg-white/10"}`} />
                            <p className={`mt-2 text-[9px] font-bold uppercase tracking-[0.12em] ${index <= current ? "text-[#f4c66a]" : "text-stone-600"}`}>{stage.label}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {task.customer_note && <p className="mt-5 text-sm leading-6 text-stone-300">{task.customer_note}</p>}
                    {task.tracking_number && <p className="mt-3 text-xs uppercase tracking-[0.14em] text-stone-500">Tracking · {task.tracking_number}</p>}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {(payload?.items?.length || 0) > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl uppercase tracking-[0.08em]">Order items</h2>
            <div className="mt-4 grid gap-3">
              {payload!.items!.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{item.product_name}</h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-500">{[item.color, item.size, item.format].filter(Boolean).join(" · ") || "Standard edition"}</p>
                      {item.fulfillment_mode === "made_to_order" && <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#f4c66a]">Production queued · made to order</p>}
                    </div>
                    <span className="text-sm text-[#f4c66a]">Qty {item.quantity}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(payload?.digital_entitlements?.length || 0) > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl uppercase tracking-[0.08em]">Digital vault</h2>
            <div className="mt-4 grid gap-3">
              {payload!.digital_entitlements!.map((entitlement) => (
                <article key={entitlement.entitlement_id} className="rounded-2xl border border-[#f4c66a]/20 bg-[#f4c66a]/[0.04] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{entitlement.label}</h3>
                      {entitlement.subtitle && <p className="mt-1 text-sm text-stone-400">{entitlement.subtitle}</p>}
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">{entitlement.ready ? `${entitlement.downloads_remaining} secure download${entitlement.downloads_remaining === 1 ? "" : "s"} remaining` : entitlement.state.replaceAll("_", " ")}</p>
                    </div>
                    <button type="button" disabled={!entitlement.ready} onClick={() => download(entitlement.entitlement_id)} className={`rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.18em] ${entitlement.ready ? "bg-[#f4c66a] text-black hover:bg-[#ffe09a]" : "cursor-not-allowed bg-stone-800 text-stone-500"}`}>{entitlement.ready ? "Secure Download" : "Master Pending"}</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/store" className="rounded-full border border-[#f4c66a]/35 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#f4c66a] hover:bg-[#f4c66a]/10">Back to Store</Link>
          <Link href="/music" className="rounded-full border border-white/15 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white hover:border-white/30">Music</Link>
        </div>
      </section>
    </main>
  );
}
