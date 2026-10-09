import { Suspense } from "react";
import { OrderClient } from "./order-client";

function OrderLoading() {
  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <section className="mx-auto max-w-5xl">
        <p className="text-xs font-bold uppercase tracking-[0.34em] text-[#f4c66a]">Secure Order</p>
        <h1 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] md:text-6xl">Finalizing order</h1>
        <div className="mt-8 rounded-2xl border border-amber-500/25 bg-amber-500/10 p-5 text-amber-100">
          Loading your secure order…
        </div>
      </section>
    </main>
  );
}

export default function StoreOrderPage() {
  return (
    <Suspense fallback={<OrderLoading />}>
      <OrderClient />
    </Suspense>
  );
}
