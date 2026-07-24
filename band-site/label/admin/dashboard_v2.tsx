"use client";

import { useEffect, useMemo, useState } from "react";
import type { LabelApplication } from "@/lib/label-storage";
import { LabelAdminDashboard } from "@/label/admin/dashboard";

type Overview = {
  signedArtists: number;
  pendingArtists: number;
  releasesThisMonth: number;
  totalRevenueCents: number;
  totalStreams: number;
  payoutsPendingCents: number;
  topArtists: Array<{ artistId: string; artistName: string; streams: number; artistCents: number }>;
  contractAlerts: unknown[];
};

export function LabelAdminDashboardV2() {
  const [overview, setOverview] = useState<Overview | null>(null);
  const [applications, setApplications] = useState<LabelApplication[]>([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");

  async function load() {
    const [overviewResponse, appsResponse] = await Promise.all([fetch("/api/label/admin/overview"), fetch("/api/label/applications")]);
    const overviewPayload = await overviewResponse.json();
    const appsPayload = await appsResponse.json();
    if (overviewResponse.ok) setOverview(overviewPayload.overview);
    else setStatus(overviewPayload.error || "Admin overview unavailable.");
    if (appsResponse.ok) setApplications(appsPayload.applications);
  }

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return applications;
    return applications.filter((app) => `${app.artistName} ${app.email} ${app.status}`.toLowerCase().includes(needle));
  }, [applications, query]);

  function exportCsv() {
    const rows = [["artist", "email", "status", "generatedCAD", "payableCAD"]];
    for (const app of filtered) rows.push([app.artistName, app.email, app.status, (app.generatedRoyaltiesCents / 100).toFixed(2), (app.payableRoyaltiesCents / 100).toFixed(2)]);
    const blob = new Blob([rows.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "kamdridi-records-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8">
      {status ? <p className="label-panel text-sm text-[#f4c66a]">{status}</p> : null}

      <section className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[
          ["Signed", overview?.signedArtists ?? 0],
          ["Pending", overview?.pendingArtists ?? 0],
          ["Releases / Month", overview?.releasesThisMonth ?? 0],
          ["Streams", overview?.totalStreams ?? 0],
          ["Revenue", `$${((overview?.totalRevenueCents ?? 0) / 100).toFixed(2)}`],
          ["Payable", `$${((overview?.payoutsPendingCents ?? 0) / 100).toFixed(2)}`]
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-[#f4c66a]/20 bg-black/35 p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500">{label}</p>
            <p className="mt-3 font-display text-3xl uppercase tracking-[0.06em] text-white">{value}</p>
          </div>
        ))}
      </section>

      <section className="label-panel">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#f4c66a]">Command Center</p>
          <h2 className="mt-2 font-display text-4xl uppercase tracking-[0.08em] text-white">Admin Dashboard V2</h2>
          <p className="mt-3 text-sm text-stone-400">Recherche globale, exports, royalties, artistes, contrats et alertes.</p>
        </div>
        <div className="flex w-full flex-wrap gap-3 md:w-auto">
          <input value={query} onChange={(event) => setQuery(event.target.value)} className="label-input min-w-0 flex-1 md:w-80" placeholder="Search artists, status, email..." />
          <button onClick={exportCsv} className="label-action">Export CSV</button>
          <a href="/label/admin/content-factory" className="label-action border-[#f4c66a]/50 text-[#f4c66a]">Content Factory</a>
          <a href="/label/admin/media" className="label-action border-green-400/50 text-green-400">Media Manager</a>
          <a href="/label/admin/multi-vendor" className="label-action border-[#00f5ff]/50 text-[#00f5ff]">Multi-Vendor</a>
          <a href="/label/admin/live-comms" className="label-action border-red-500/50 text-red-500">Live Comms</a>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="label-panel block">
          <p className="text-xs uppercase tracking-[0.28em] text-[#f4c66a]">Top Artists</p>
          <div className="mt-5 grid gap-3">
            {(overview?.topArtists || []).map((artist) => (
              <div key={artist.artistId} className="flex items-center justify-between rounded-xl border border-white/10 p-3 text-sm">
                <span>{artist.artistName}</span>
                <span className="text-[#f4c66a]">{artist.streams.toLocaleString()} streams</span>
              </div>
            ))}
            {!overview?.topArtists?.length ? <p className="text-sm text-stone-500">No stream stats yet.</p> : null}
          </div>
        </div>
        <div className="label-panel block">
          <p className="text-xs uppercase tracking-[0.28em] text-[#f4c66a]">Alerts</p>
          <p className="mt-5 text-sm text-stone-400">{overview?.contractAlerts?.length || 0} contract renewal alerts.</p>
          <p className="mt-2 text-sm text-stone-400">{filtered.length} artists visible with current filter.</p>
        </div>
      </section>

      <LabelAdminDashboard />
    </div>
  );
}
