"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Box, CheckCircle2, Clock } from "lucide-react";

type Task={id:string;order_id?:string;orderId?:string;status:string;task_type?:string;provider?:string;payload?:Record<string,unknown>;created_at?:string};

export default function MultiVendorAdminPage(){
 const [tasks,setTasks]=useState<Task[]>([]); const [error,setError]=useState("");
 useEffect(()=>{fetch("/api/commerce/ops").then(async r=>{const d=await r.json();if(!r.ok)throw new Error(d.error||"Unable to load fulfillment.");setTasks(d.fulfillmentTasks||d.tasks||[])}).catch(e=>setError(e.message))},[]);
 return <main className="min-h-screen bg-[#050403] px-5 py-20 text-white md:py-24"><div className="mx-auto max-w-7xl">
 <Link href="/label/admin" className="mb-8 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#f4c66a]"><ArrowLeft className="h-4 w-4"/> Back to Dashboard</Link>
 <p className="text-xs font-bold uppercase tracking-[0.45em] text-[#f4c66a]">Logistics & Routing</p><h1 className="mt-4 font-display text-4xl uppercase md:text-5xl">Multi-Vendor Dispatches</h1>
 <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">Live fulfillment routing from the commerce backend. No demo orders are shown here.</p>
 {error?<div className="mt-8 border border-red-500/40 p-4 text-red-400">{error}</div>:null}
 <div className="mt-10 grid gap-6">{tasks.map(t=><div key={t.id} className="border border-[#f4c66a]/15 bg-black/40 p-5 md:p-6"><div className="flex items-center justify-between gap-4"><div><span className="text-[10px] font-bold uppercase tracking-[.22em] text-[#f4c66a]">Order {t.order_id||t.orderId||"—"}</span><h3 className="mt-2 text-lg font-bold">{t.task_type||"Fulfillment task"}</h3><div className="mt-3 flex items-center gap-2 text-xs text-stone-400"><Box className="h-4 w-4"/> Provider: <span className="text-[#f4c66a]">{t.provider||"unassigned"}</span></div></div><div className="flex items-center gap-2">{/sent|complete|fulfilled/i.test(t.status)?<CheckCircle2 className="h-5 w-5 text-green-500"/>:<Clock className="h-5 w-5 text-orange-500"/>}<span className="text-xs uppercase tracking-widest">{t.status}</span></div></div></div>)}
 {!tasks.length&&!error?<div className="rounded-2xl border border-white/10 bg-black/30 p-8 text-sm text-stone-400">No active fulfillment dispatches.</div>:null}</div>
 </div></main>
}