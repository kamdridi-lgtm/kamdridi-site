"use client";

import { useState, useEffect } from "react";
import {
  EchoesCostPlan,
  defaultEchoesCostPlans,
  calculateFinancials,
  costPlanFieldDefinitions,
} from "@/data/echoes-brasil-cost-planning";

const LOCAL_STORAGE_KEY = "kamdridi_echoes_brasil_cost_plan_v1";

const formatCAD = (cents: number) => {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
  }).format(cents / 100);
};

export default function EchoesBrasilMarginPlanner() {
  const [plans, setPlans] = useState<EchoesCostPlan[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 3) {
          // Merge with default to ensure structure, reset invalid fields to null
          const mergedPlans = defaultEchoesCostPlans.map((defaultPlan) => {
            const savedPlan = parsed.find((p: any) => p.productSlug === defaultPlan.productSlug);
            if (!savedPlan) return defaultPlan;
            
            const newPlan = { ...defaultPlan };
            costPlanFieldDefinitions.forEach((def) => {
              const val = savedPlan[def.key];
              if (typeof val === "number" && !isNaN(val)) {
                (newPlan as any)[def.key] = val;
              } else {
                (newPlan as any)[def.key] = null;
              }
            });
            return newPlan;
          });
          setPlans(mergedPlans);
        } else {
          setPlans(defaultEchoesCostPlans);
        }
      } catch (e) {
        setPlans(defaultEchoesCostPlans);
      }
    } else {
      setPlans(defaultEchoesCostPlans);
    }
    setMounted(true);
  }, []);

  const handleReset = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setPlans(defaultEchoesCostPlans);
  };

  const updatePlan = (slug: string, field: keyof EchoesCostPlan, value: string) => {
    const newPlans = plans.map((p) => {
      if (p.productSlug === slug) {
        return {
          ...p,
          [field]: value === "" ? null : Number(value),
        };
      }
      return p;
    });
    setPlans(newPlans);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPlans));
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#080604] font-sans text-stone-300">
      <div className="mx-auto max-w-6xl px-4 py-12 md:py-24">
        <div className="mb-12 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-display text-3xl uppercase tracking-widest text-amber-500">
              ECHOES UN LIVE IN BRASIL
            </h1>
            <h2 className="mt-2 text-xl tracking-[0.2em] text-white">Cost & Margin Planner</h2>
          </div>
          <button
            onClick={handleReset}
            className="rounded border border-red-900/50 bg-red-950/30 px-4 py-2 text-xs uppercase tracking-widest text-red-400 transition hover:bg-red-900/50"
          >
            Reset Local Estimates
          </button>
        </div>

        <p className="mb-12 text-sm text-stone-500 italic">
          Note: Margin indicators are planning aids only. Final decisions require supplier quotations, taxes and fulfillment confirmation.
        </p>

        <div className="space-y-16">
          {plans.map((plan) => (
            <PlanSection
              key={plan.productSlug}
              plan={plan}
              updatePlan={updatePlan}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function PlanSection({
  plan,
  updatePlan,
}: {
  plan: EchoesCostPlan;
  updatePlan: (s: string, f: keyof EchoesCostPlan, v: string) => void;
}) {
  const result = calculateFinancials(plan);

  const productTitles: Record<string, string> = {
    "echoes-brasil-expanded": "ECHOES UN LIVE IN BRASIL — EXPANDED EDITION",
    "echoes-brasil-livreto": "ECHOES UN LIVE IN BRASIL — COLLECTOR BOOKLET",
    "echoes-brasil-deluxe": "ECHOES UN LIVE IN BRASIL — DELUXE BOX + VINYL",
  };

  const title = productTitles[plan.productSlug] || plan.productSlug;

  return (
    <div className="rounded-[20px] border border-white/5 bg-white/[0.02] p-6 lg:p-10">
      <div className="mb-8 border-b border-white/5 pb-4">
        <h3 className="text-2xl uppercase tracking-[0.1em] text-white">
          {title}
        </h3>
        <p className="mt-1 font-mono text-xs text-stone-500">{plan.productSlug}</p>
        <p className="mt-4 text-lg text-amber-500">{formatCAD(plan.salePriceCents)}</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* INPUTS */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm uppercase tracking-widest text-stone-500">Estimates (Input)</h4>
            <span className="text-[10px] text-stone-500">Enter 0 only when the cost has been confirmed as not applicable.</span>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <InputField label="Manufacturing (cents)" value={plan.manufacturingCostCents} onChange={(v) => updatePlan(plan.productSlug, "manufacturingCostCents", v)} type="cents" />
            <InputField label="Packaging (cents)" value={plan.packagingCostCents} onChange={(v) => updatePlan(plan.productSlug, "packagingCostCents", v)} type="cents" />
            <InputField label="Printing (cents)" value={plan.printingCostCents} onChange={(v) => updatePlan(plan.productSlug, "printingCostCents", v)} type="cents" />
            <InputField label="Inbound Freight (cents)" value={plan.inboundFreightCents} onChange={(v) => updatePlan(plan.productSlug, "inboundFreightCents", v)} type="cents" />
            <InputField label="Assembly (cents)" value={plan.assemblyCostCents} onChange={(v) => updatePlan(plan.productSlug, "assemblyCostCents", v)} type="cents" />
            <InputField label="Payment Fee (%)" value={plan.paymentFeePercent} onChange={(v) => updatePlan(plan.productSlug, "paymentFeePercent", v)} type="percent" />
            <InputField label="Payment Fixed (cents)" value={plan.paymentFeeFixedCents} onChange={(v) => updatePlan(plan.productSlug, "paymentFeeFixedCents", v)} type="cents" />
            <InputField label="Shipping Subsidy (cents)" value={plan.shippingSubsidyCents} onChange={(v) => updatePlan(plan.productSlug, "shippingSubsidyCents", v)} type="cents" />
            <InputField label="Returns Reserve (%)" value={plan.returnsReservePercent} onChange={(v) => updatePlan(plan.productSlug, "returnsReservePercent", v)} type="percent" />
            <InputField label="Marketing / Unit (cents)" value={plan.marketingCostPerUnitCents} onChange={(v) => updatePlan(plan.productSlug, "marketingCostPerUnitCents", v)} type="cents" />
            <InputField label="Other Variable Cost (cents)" value={plan.otherVariableCostCents} onChange={(v) => updatePlan(plan.productSlug, "otherVariableCostCents", v)} type="cents" />
            
            <div className="col-span-full mt-4">
              <h4 className="mb-4 text-xs uppercase tracking-widest text-stone-500">Fixed Costs & Volume</h4>
              <div className="grid gap-4 sm:grid-cols-2">
                <InputField label="Artwork (cents)" value={plan.oneTimeArtworkCostCents} onChange={(v) => updatePlan(plan.productSlug, "oneTimeArtworkCostCents", v)} type="cents" />
                <InputField label="Setup (cents)" value={plan.oneTimeSetupCostCents} onChange={(v) => updatePlan(plan.productSlug, "oneTimeSetupCostCents", v)} type="cents" />
                <InputField label="Prototype (cents)" value={plan.oneTimePrototypeCostCents} onChange={(v) => updatePlan(plan.productSlug, "oneTimePrototypeCostCents", v)} type="cents" />
                <InputField label="Planned Quantity" value={plan.plannedQuantity} onChange={(v) => updatePlan(plan.productSlug, "plannedQuantity", v)} type="quantity" />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS */}
        <div>
          <h4 className="mb-6 text-sm uppercase tracking-widest text-stone-500">Financial Projection</h4>
          
          {!result.isComplete ? (
            <div className="space-y-4">
              <div className="rounded-lg border border-red-900/50 bg-red-950/20 p-6">
                <p className="font-mono text-sm font-bold text-red-500">CALCULATION INCOMPLETE</p>
                {result.missingFields && result.missingFields.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs text-red-400">Missing values:</p>
                    <ul className="mt-2 list-inside list-disc text-xs text-stone-400">
                      {result.missingFields.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.invalidFields && result.invalidFields.length > 0 && (
                  <div className="mt-4 border-t border-red-900/30 pt-4">
                    <p className="text-xs text-red-400">Invalid values:</p>
                    <ul className="mt-2 list-inside list-disc text-xs text-stone-400">
                      {result.invalidFields.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ) : result.profitPerUnit! <= 0 ? (
            <div className="space-y-6 rounded-lg border border-red-900/30 bg-black/30 p-6">
               <div className="mb-4 rounded border border-red-900/50 bg-red-950/30 p-3 text-center">
                 <span className="font-mono text-sm font-bold text-red-500">NEGATIVE UNIT ECONOMICS</span>
               </div>
               <ResultRow label="Sale Price" value={formatCAD(plan.salePriceCents)} />
               <ResultRow label="Variable Cost" value={formatCAD(result.variableCost!)} />
               <ResultRow label="Gross Profit / Unit" value={formatCAD(result.profitPerUnit!)} />
               <div className="flex items-center justify-between border-b border-white/10 pb-4">
                 <span className="text-xs uppercase tracking-widest text-stone-400">Gross Margin</span>
                 <span className="font-mono text-lg text-red-500">
                   {result.grossMarginPercent!.toFixed(2)}%
                 </span>
               </div>
               <ResultRow label="Fixed Costs" value={formatCAD(result.fixedCosts!)} />
               <ResultRow label="Planned Quantity" value={plan.plannedQuantity?.toString() || "0"} />
               <ResultRow label="Total Est. Profit" value={formatCAD(result.totalProfit!)} />
               <div className="flex items-center justify-between border-b border-white/5 pb-2">
                 <span className="text-xs uppercase tracking-widest text-stone-400">Break-Even Units</span>
                 <span className="font-mono text-sm font-bold text-red-500">NOT REACHABLE</span>
               </div>
            </div>
          ) : (
            <div className="space-y-6 rounded-lg border border-white/10 bg-black/30 p-6">
              <ResultRow label="Sale Price" value={formatCAD(plan.salePriceCents)} />
              <ResultRow label="Variable Cost" value={formatCAD(result.variableCost!)} />
              <ResultRow label="Gross Profit / Unit" value={formatCAD(result.profitPerUnit!)} />
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-xs uppercase tracking-widest text-stone-400">Gross Margin</span>
                <span className={`font-mono text-lg ${result.grossMarginPercent! < 30 ? 'text-amber-500' : 'text-green-500'}`}>
                  {result.grossMarginPercent!.toFixed(2)}%
                </span>
              </div>

              <ResultRow label="Fixed Costs" value={formatCAD(result.fixedCosts!)} />
              <ResultRow label="Planned Quantity" value={plan.plannedQuantity?.toString() || "0"} />
              <ResultRow label="Total Est. Profit" value={formatCAD(result.totalProfit!)} />
              <ResultRow label="Break-Even Units" value={result.breakEvenUnits?.toString() || "0"} />
            </div>
          )}

          <div className="mt-12">
            <h4 className="mb-4 text-xs uppercase tracking-widest text-amber-500/80">Product Content Decisions</h4>
            <div className="rounded border border-amber-900/30 bg-amber-950/10 p-4 text-xs text-stone-400">
              {plan.productSlug === "echoes-brasil-expanded" && (
                <ul className="list-inside list-disc space-y-1">
                  <li>visual officiel</li>
                  <li>standard edition + bonus</li>
                  <li>présence d’un vinyle indiquée par le visuel</li>
                  <li>contenu détaillé : À CONFIRMER</li>
                </ul>
              )}
              {plan.productSlug === "echoes-brasil-livreto" && (
                <ul className="list-inside list-disc space-y-1">
                  <li>booklet avec images live et crédits</li>
                  <li>vente indépendante : À CONFIRMER</li>
                  <li>nombre de pages : À CONFIRMER</li>
                  <li>dimensions : À CONFIRMER</li>
                  <li>type de papier : À CONFIRMER</li>
                </ul>
              )}
              {plan.productSlug === "echoes-brasil-deluxe" && (
                <ul className="list-inside list-disc space-y-1">
                  <li>premium case</li>
                  <li>black vinyl</li>
                  <li>edition card</li>
                  <li>contenu supplémentaire : À CONFIRMER</li>
                  <li>dimensions du coffret : À CONFIRMER</li>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InputField({ label, value, onChange, type }: { label: string; value: number | null; onChange: (v: string) => void; type: "cents" | "percent" | "quantity" }) {
  const min = type === "quantity" ? "1" : "0";
  const step = type === "percent" ? "0.01" : "1";
  const max = type === "percent" ? "100" : undefined;

  return (
    <div className="flex flex-col gap-1">
      <label className="text-[10px] uppercase tracking-widest text-stone-500">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        step={step}
        className="rounded border border-white/10 bg-transparent px-3 py-2 font-mono text-sm text-white placeholder-stone-700 outline-none focus:border-amber-500"
        placeholder="À CONFIRMER"
        value={value === null ? "" : value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 pb-2">
      <span className="text-xs uppercase tracking-widest text-stone-400">{label}</span>
      <span className="font-mono text-sm text-white">{value}</span>
    </div>
  );
}
