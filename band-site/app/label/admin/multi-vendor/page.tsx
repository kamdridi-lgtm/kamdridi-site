import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Box, CheckCircle2, Clock, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Multi-Vendor Dispatch - Label Admin",
  description: "Track automated dispatch routing for multi-vendor collector bundles."
};

const mockDispatches = [
  {
    id: "DISP-8921-A",
    orderId: "cs_test_a1b2c3",
    customer: "Alex Mercer",
    vendor: "custom_jeweler",
    vendorName: "Medallion Forge Co.",
    component: "Collector Medallion (SKU: SAL-MED-01)",
    status: "sent",
    date: "2026-07-23 18:42"
  },
  {
    id: "DISP-8921-B",
    orderId: "cs_test_a1b2c3",
    customer: "Alex Mercer",
    vendor: "qrates_vinyl",
    vendorName: "Qrates Production",
    component: "Salieri's Hands Vinyl (SKU: SAL-VINYL-01)",
    status: "sent",
    date: "2026-07-23 18:42"
  },
  {
    id: "DISP-8921-C",
    orderId: "cs_test_a1b2c3",
    customer: "Alex Mercer",
    vendor: "book_printer",
    vendorName: "Elite Print House",
    component: "Lore Booklet (SKU: SAL-BOOK-01)",
    status: "pending",
    date: "2026-07-23 18:42"
  }
];

export default function MultiVendorAdminPage() {
  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white md:py-24">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/label/admin"
          className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#f4c66a] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="mb-12 border-b border-[#f4c66a]/20 pb-8">
          <p className="text-xs font-bold uppercase tracking-[0.45em] text-[#f4c66a]">
            Logistics & Routing
          </p>
          <h1 className="mt-4 font-display text-4xl uppercase leading-none tracking-[0.06em] md:text-5xl">
            Multi-Vendor Dispatches
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">
            Automated tracking for collector bundles (e.g., Salieri's Hands Box Set). 
            When an order contains multiple components handled by different suppliers, 
            the system splits the fulfillment request and dispatches it here.
          </p>
        </div>

        <div className="grid gap-6">
          {mockDispatches.map((dispatch) => (
            <div
              key={dispatch.id}
              className="flex flex-col gap-5 border border-[#f4c66a]/15 bg-[linear-gradient(135deg,rgba(244,198,106,0.05),rgba(0,0,0,0.5))] p-5 md:flex-row md:items-center md:justify-between md:p-6"
            >
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#f4c66a]">
                    Order {dispatch.orderId}
                  </span>
                  <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.1em] text-stone-400">
                    {dispatch.date}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-stone-100">{dispatch.customer}</h3>
                <p className="mt-1 text-sm text-stone-400">
                  <span className="text-stone-300">Component:</span> {dispatch.component}
                </p>
                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-stone-400">
                  <Box className="h-4 w-4" />
                  Routed to: <span className="text-[#f4c66a]">{dispatch.vendorName} ({dispatch.vendor})</span>
                </div>
              </div>
              <div className="flex shrink-0 items-center justify-between gap-4 border-t border-white/10 pt-4 md:border-0 md:pt-0">
                <div className="flex items-center gap-2">
                  {dispatch.status === "sent" ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                      <span className="text-xs uppercase tracking-[0.15em] text-green-500">Dispatch Sent</span>
                    </>
                  ) : (
                    <>
                      <Clock className="h-5 w-5 text-orange-500" />
                      <span className="text-xs uppercase tracking-[0.15em] text-orange-500">Pending Review</span>
                    </>
                  )}
                </div>
                {dispatch.status !== "sent" && (
                  <button className="flex items-center gap-2 rounded bg-[#f4c66a]/10 px-4 py-2 text-xs uppercase tracking-widest text-[#f4c66a] transition hover:bg-[#f4c66a]/20">
                    <Send className="h-3 w-3" /> Force Send
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
