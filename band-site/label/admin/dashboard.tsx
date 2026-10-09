"use client";

import { useEffect, useState } from "react";
import type { LabelApplication } from "@/lib/label-storage";

export function LabelAdminDashboard() {
  const [applications, setApplications] = useState<LabelApplication[]>([]);
  const [status, setStatus] = useState("");

  async function load() {
    const response = await fetch("/api/label/applications");
    const payload = await response.json();
    if (!response.ok) {
      setStatus(payload.error || "Admin access required.");
      return;
    }
    setApplications(payload.applications);
  }

  useEffect(() => {
    void load();
  }, []);

  async function action(artistId: string, actionName: string) {
    setStatus("Processing...");
    const response = await fetch("/api/label/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ artistId, action: actionName })
    });
    const payload = await response.json();
    setStatus(response.ok ? `${actionName} complete.` : payload.error || "Action failed.");
    await load();
  }

  const pending = applications.filter((app) => app.status === "pending_review" || app.status === "awaiting_payment");
  const signed = applications.filter((app) => app.status === "signed");

  return (
    <div className="grid gap-8">
      {status ? <p className="rounded-2xl border border-[#f4c66a]/20 bg-[#f4c66a]/10 p-4 text-sm text-[#f4c66a]">{status}</p> : null}
      <section>
        <h2 className="font-display text-4xl uppercase tracking-[0.08em] text-white">Pending Review</h2>
        <div className="mt-5 grid gap-4">
          {pending.map((app) => (
            <div key={app.id} className="label-panel">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#f4c66a]">{app.artistName}</p>
                <p className="mt-2 text-sm text-stone-300">{app.email} / {app.paymentStatus} / {app.status}</p>
                <p className="mt-3 text-sm leading-6 text-stone-400">{app.bio}</p>
                <p className="mt-3 text-xs text-stone-500">{app.demos.map((demo) => `${demo.name} (${demo.storageMode || "metadata"})`).join(" / ")}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {app.demos.map((demo) =>
                    demo.url && !demo.url.startsWith("simulation://") ? (
                      <a key={demo.storageKey || demo.name} href={demo.url} className="text-xs uppercase tracking-[0.18em] text-[#f4c66a] hover:text-white">
                        Open demo
                      </a>
                    ) : null
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => void action(app.id, "sign")} className="label-action">Sign Artist</button>
                <button onClick={() => void action(app.id, "refuse")} className="label-action label-action-muted">Refuse</button>
              </div>
            </div>
          ))}
          {!pending.length ? <p className="text-sm text-stone-500">No pending artists.</p> : null}
        </div>
      </section>

      <section>
        <h2 className="font-display text-4xl uppercase tracking-[0.08em] text-white">Signed Artists</h2>
        <div className="mt-5 grid gap-4">
          {signed.map((app) => (
            <div key={app.id} className="label-panel">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[#f4c66a]">{app.artistName}</p>
                <p className="mt-2 text-sm text-stone-300">Payable royalties: ${(app.payableRoyaltiesCents / 100).toFixed(2)} CAD</p>
                <a className="mt-3 inline-flex text-xs uppercase tracking-[0.2em] text-stone-400 hover:text-[#f4c66a]" href={`/api/label/contract/${app.id}`}>Download contract</a>
              </div>
              <button onClick={() => void action(app.id, "payout")} className="label-action">Pay Royalties</button>
            </div>
          ))}
          {!signed.length ? <p className="text-sm text-stone-500">No signed artists yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
