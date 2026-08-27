"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const SUPABASE_FUNCTIONS = "https://retoydsgsuvznlpsguts.supabase.co/functions/v1";

type Locale = "pt" | "en" | "fr" | "ja";

const ui = {
  en: {
    secureOrder: "Secure Order",
    paymentReceived: "Payment received",
    thankYou: "Thank you for buying directly from KAM DRIDI. This page is tied to your Stripe checkout session. A confirmation message is sent to the email used at checkout with your purchased items, delivery instructions, and included artwork when available.",
    digitalConfirmed: "Digital purchase confirmed",
    digitalBody: "Your digital purchase is confirmed. Keep your Stripe receipt. When a private-vault download is active it appears here; otherwise secure delivery is sent to the email entered at checkout.",
    madeToOrder: "Made to order",
    madeBody: "Your physical edition enters production after payment. Please allow several weeks for manufacturing, quality control and delivery. You do not need to place another order or make another payment for production.",
    missing: "Missing checkout session.",
    finalizing: "Payment is confirmed by Stripe. Finalizing the order record…",
    payment: "Payment",
    fulfillment: "Fulfillment",
    total: "Total",
    productionTracking: "Production tracking",
    journey: "Your order journey",
    partner: "Production partner",
    assigned: "Production partner assigned",
    issue: "Production review required",
    trackShipment: "Track shipment",
    tracking: "Tracking",
    orderItems: "Order items",
    standardEdition: "Standard edition",
    productionQueued: "Production queued · made to order",
    qty: "Qty",
    digitalVault: "Digital vault",
    secureDownload: "Secure Download",
    masterPending: "Master Pending",
    remaining: "secure download(s) remaining",
    backStore: "Back to Store",
    music: "Music",
    stages: { queued: "Queued", in_production: "In production", quality_check: "Quality check", shipped: "Shipped", delivered: "Delivered" }
  },
  pt: {
    secureOrder: "Pedido seguro",
    paymentReceived: "Pagamento recebido",
    thankYou: "Obrigado por comprar diretamente da KAM DRIDI. Esta página está vinculada à sua sessão segura da Stripe. Uma confirmação é enviada ao e-mail usado no checkout com os itens comprados, instruções de entrega e arte incluída quando disponível.",
    digitalConfirmed: "Compra digital confirmada",
    digitalBody: "Sua compra digital está confirmada. Guarde o recibo da Stripe. Quando o download no cofre privado estiver ativo, ele aparecerá aqui; caso contrário, a entrega segura será enviada ao e-mail usado no checkout.",
    madeToOrder: "Produzido sob encomenda",
    madeBody: "Sua edição física entra em produção após o pagamento. Reserve algumas semanas para fabricação, controle de qualidade e entrega. Você não precisa fazer outro pedido nem pagar novamente pela produção.",
    missing: "Sessão de checkout ausente.",
    finalizing: "Pagamento confirmado pela Stripe. Finalizando o registro do pedido…",
    payment: "Pagamento",
    fulfillment: "Produção / entrega",
    total: "Total",
    productionTracking: "Acompanhamento da produção",
    journey: "Caminho do seu pedido",
    partner: "Parceiro de produção",
    assigned: "Parceiro de produção atribuído",
    issue: "Revisão de produção necessária",
    trackShipment: "Rastrear envio",
    tracking: "Rastreamento",
    orderItems: "Itens do pedido",
    standardEdition: "Edição padrão",
    productionQueued: "Produção na fila · sob encomenda",
    qty: "Qtd.",
    digitalVault: "Cofre digital",
    secureDownload: "Download seguro",
    masterPending: "Master pendente",
    remaining: "download(s) seguro(s) restante(s)",
    backStore: "Voltar à loja",
    music: "Música",
    stages: { queued: "Na fila", in_production: "Em produção", quality_check: "Controle de qualidade", shipped: "Enviado", delivered: "Entregue" }
  },
  fr: {
    secureOrder: "Commande sécurisée",
    paymentReceived: "Paiement reçu",
    thankYou: "Merci d’acheter directement auprès de KAM DRIDI. Cette page est liée à votre session Stripe sécurisée. Une confirmation est envoyée à l’adresse utilisée au paiement avec les articles achetés, les instructions de livraison et le visuel inclus lorsqu’il est disponible.",
    digitalConfirmed: "Achat numérique confirmé",
    digitalBody: "Votre achat numérique est confirmé. Conservez votre reçu Stripe. Lorsqu’un téléchargement du coffre privé est actif, il apparaît ici; sinon, la livraison sécurisée est envoyée à l’adresse utilisée au paiement.",
    madeToOrder: "Fabriqué sur commande",
    madeBody: "Votre édition physique entre en production après le paiement. Prévoir plusieurs semaines pour la fabrication, le contrôle qualité et la livraison. Aucun autre paiement de production n’est requis.",
    missing: "Session de paiement manquante.",
    finalizing: "Paiement confirmé par Stripe. Finalisation de la commande…",
    payment: "Paiement",
    fulfillment: "Production / livraison",
    total: "Total",
    productionTracking: "Suivi de production",
    journey: "Parcours de votre commande",
    partner: "Partenaire de production",
    assigned: "Partenaire de production assigné",
    issue: "Révision de production requise",
    trackShipment: "Suivre l’envoi",
    tracking: "Suivi",
    orderItems: "Articles commandés",
    standardEdition: "Édition standard",
    productionQueued: "Production en attente · sur commande",
    qty: "Qté",
    digitalVault: "Coffre numérique",
    secureDownload: "Téléchargement sécurisé",
    masterPending: "Master en attente",
    remaining: "téléchargement(s) sécurisé(s) restant(s)",
    backStore: "Retour à la boutique",
    music: "Musique",
    stages: { queued: "En attente", in_production: "En production", quality_check: "Contrôle qualité", shipped: "Expédié", delivered: "Livré" }
  },
  ja: {
    secureOrder: "安全な注文",
    paymentReceived: "お支払いを確認しました",
    thankYou: "KAM DRIDIから直接ご購入いただき、ありがとうございます。このページはStripeの安全なチェックアウトに紐づいています。購入内容、配信案内、利用可能なアートワークを記載した確認メールをお送りします。",
    digitalConfirmed: "デジタル購入を確認しました",
    digitalBody: "デジタル購入が完了しました。Stripeの領収書を保管してください。プライベート・ダウンロードが有効な場合はここに表示されます。それ以外の場合は、チェックアウトで使用したメールアドレスへ安全に配信します。",
    madeToOrder: "受注生産",
    madeBody: "フィジカル商品はお支払い確認後に生産へ進みます。製造、品質確認、配送に数週間かかる場合があります。生産のために追加で注文や支払いを行う必要はありません。",
    missing: "チェックアウト情報が見つかりません。",
    finalizing: "Stripeでのお支払いを確認しました。注文情報を確定しています…",
    payment: "お支払い",
    fulfillment: "配送 / 生産",
    total: "合計",
    productionTracking: "生産状況",
    journey: "ご注文の進行状況",
    partner: "生産パートナー",
    assigned: "生産パートナーを割り当てました",
    issue: "生産内容の確認が必要です",
    trackShipment: "配送を追跡",
    tracking: "追跡番号",
    orderItems: "注文内容",
    standardEdition: "通常仕様",
    productionQueued: "生産待ち · 受注生産",
    qty: "数量",
    digitalVault: "デジタル・ボールト",
    secureDownload: "安全にダウンロード",
    masterPending: "マスター準備中",
    remaining: "回の安全なダウンロードが残っています",
    backStore: "ストアへ戻る",
    music: "音楽",
    stages: { queued: "受付済み", in_production: "生産中", quality_check: "品質確認", shipped: "発送済み", delivered: "配達済み" }
  }
} as const;

function resolveLocale(value: string | null): Locale {
  if (value === "pt" || value === "fr" || value === "ja") return value;
  return "en";
}

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

const stageKeys = ["queued", "in_production", "quality_check", "shipped", "delivered"] as const;

function money(amount: number | null | undefined, currency: string | undefined) {
  if (amount == null) return "—";
  const code = (currency || "CAD").toUpperCase();
  return new Intl.NumberFormat(code === "JPY" ? "ja-JP" : "en-CA", {
    style: "currency",
    currency: code
  }).format(amount / 100);
}

function stageIndex(stage: string | undefined) {
  return Math.max(0, stageKeys.findIndex((item) => item === stage));
}

export function OrderClient() {
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const t = ui[locale];
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
      setError(t.missing);
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
    <main lang={locale === "pt" ? "pt-BR" : locale} translate="no" className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#f4c66a]">{t.secureOrder}</p>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] md:text-6xl">{t.paymentReceived}</h1>
        <p className="mt-5 max-w-3xl text-sm leading-7 text-stone-300">
          {t.thankYou}
        </p>

        {hasManualDigital && (
          <div className="mt-7 rounded-2xl border border-[#f4c66a]/30 bg-[#f4c66a]/[0.07] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f4c66a]">{t.digitalConfirmed}</p>
            <p className="mt-2 text-sm leading-7 text-stone-200">
              {t.digitalBody}
            </p>
          </div>
        )}

        {hasMadeToOrder && (
          <div className="mt-7 rounded-2xl border border-[#f4c66a]/30 bg-[#f4c66a]/[0.07] p-5">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f4c66a]">{t.madeToOrder}</p>
            <p className="mt-2 text-sm leading-7 text-stone-200">
              {t.madeBody}
            </p>
          </div>
        )}

        {!sessionId && <div className="mt-8 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-5 text-rose-100">{t.missing}</div>}
        {error && <div className="mt-8 rounded-2xl border border-rose-500/25 bg-rose-500/10 p-5 text-rose-100">{error}</div>}
        {!error && payload?.state === "processing" && <div className="mt-8 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 text-amber-100">{t.finalizing}</div>}

        {payload?.order && (
          <div className="mt-8 grid gap-4 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 sm:grid-cols-3">
            <div><p className="text-[10px] uppercase tracking-[0.25em] text-stone-500">{t.payment}</p><p className="mt-2 text-lg font-semibold text-white">{payload.order.payment_status || "paid"}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.25em] text-stone-500">{t.fulfillment}</p><p className="mt-2 text-lg font-semibold text-white">{(payload.order.fulfillment_status || "pending").replaceAll("_", " ")}</p></div>
            <div><p className="text-[10px] uppercase tracking-[0.25em] text-stone-500">{t.total}</p><p className="mt-2 text-lg font-semibold text-[#f4c66a]">{money(payload.order.amount_total, payload.order.currency)}</p></div>
          </div>
        )}

        {madeToOrderTasks.length > 0 && (
          <section className="mt-10 rounded-[28px] border border-[#f4c66a]/20 bg-[#f4c66a]/[0.03] p-6 sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-[#f4c66a]">{t.productionTracking}</p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.06em]">{t.journey}</h2>
            <div className="mt-8 grid gap-6">
              {madeToOrderTasks.map((task) => {
                const current = stageIndex(task.customer_stage);
                return (
                  <article key={task.id} className="rounded-2xl border border-white/10 bg-black/35 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{task.provider ? `${t.partner} · ${task.provider}` : t.assigned}</p>
                        <p className="mt-2 text-lg font-semibold text-white">{task.customer_stage === "issue" ? t.issue : t.stages[stageKeys[current] || "queued"]}</p>
                      </div>
                      {task.tracking_url && (
                        <a href={task.tracking_url} target="_blank" rel="noreferrer" className="rounded-full border border-[#f4c66a]/40 px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] text-[#f4c66a] hover:bg-[#f4c66a]/10">{t.trackShipment}</a>
                      )}
                    </div>

                    {task.customer_stage !== "issue" && (
                      <div className="mt-6 grid grid-cols-5 gap-2">
                        {stageKeys.map((stage, index) => (
                          <div key={stage}>
                            <div className={`h-1.5 rounded-full ${index <= current ? "bg-[#f4c66a]" : "bg-white/10"}`} />
                            <p className={`mt-2 text-[9px] font-bold uppercase tracking-[0.12em] ${index <= current ? "text-[#f4c66a]" : "text-stone-600"}`}>{t.stages[stage]}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {task.customer_note && <p className="mt-5 text-sm leading-6 text-stone-300">{task.customer_note}</p>}
                    {task.tracking_number && <p className="mt-3 text-xs uppercase tracking-[0.14em] text-stone-500">{t.tracking} · {task.tracking_number}</p>}
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {(payload?.items?.length || 0) > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl uppercase tracking-[0.08em]">{t.orderItems}</h2>
            <div className="mt-4 grid gap-3">
              {payload!.items!.map((item) => (
                <article key={item.id} className="rounded-2xl border border-white/10 bg-black/40 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h3 translate="no" className="notranslate text-lg font-semibold text-white">{item.product_name}</h3>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-500">{[item.color, item.size, item.format].filter(Boolean).join(" · ") || t.standardEdition}</p>
                      {item.fulfillment_mode === "made_to_order" && <p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-[#f4c66a]">{t.productionQueued}</p>}
                    </div>
                    <span className="text-sm text-[#f4c66a]">{t.qty} {item.quantity}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {(payload?.digital_entitlements?.length || 0) > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-2xl uppercase tracking-[0.08em]">{t.digitalVault}</h2>
            <div className="mt-4 grid gap-3">
              {payload!.digital_entitlements!.map((entitlement) => (
                <article key={entitlement.entitlement_id} className="rounded-2xl border border-[#f4c66a]/20 bg-[#f4c66a]/[0.04] p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{entitlement.label}</h3>
                      {entitlement.subtitle && <p className="mt-1 text-sm text-stone-400">{entitlement.subtitle}</p>}
                      <p className="mt-2 text-xs uppercase tracking-[0.18em] text-stone-500">{entitlement.ready ? `${entitlement.downloads_remaining} ${t.remaining}` : entitlement.state.replaceAll("_", " ")}</p>
                    </div>
                    <button type="button" disabled={!entitlement.ready} onClick={() => download(entitlement.entitlement_id)} className={`rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.18em] ${entitlement.ready ? "bg-[#f4c66a] text-black hover:bg-[#ffe09a]" : "cursor-not-allowed bg-stone-800 text-stone-500"}`}>{entitlement.ready ? t.secureDownload : t.masterPending}</button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="mt-12 flex flex-wrap gap-3">
          <Link href="/store" className="rounded-full border border-[#f4c66a]/35 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-[#f4c66a] hover:bg-[#f4c66a]/10">{t.backStore}</Link>
          <Link href="/music" className="rounded-full border border-white/15 px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-white hover:border-white/30">{t.music}</Link>
        </div>
      </section>
    </main>
  );
}
