"use client";
import { useEffect, useState } from "react";

export function DemographicsDashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/track/stats')
      .then(r => r.json())
      .then(d => setData(d))
      .catch(console.error);
    
    const interval = setInterval(() => {
      fetch('/api/track/stats')
        .then(r => r.json())
        .then(d => setData(d))
        .catch(console.error);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!data) return <div className="text-[#f4c66a]">Loading Radar...</div>;

  return (
    <div className="grid gap-8 mt-10">
      <div className="label-panel">
        <h2 className="text-2xl font-display uppercase tracking-[0.1em] text-[#f4c66a] border-b border-white/10 pb-4 mb-4">
          Global Demographics Radar
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg text-white mb-3">Top Countries</h3>
            <ul className="space-y-2">
              {data.countries.map((c: any, i: number) => (
                <li key={i} className="flex justify-between border-b border-white/5 pb-1">
                  <span className="text-stone-300">{c.country}</span>
                  <span className="text-[#f4c66a]">{c.count} visits</span>
                </li>
              ))}
              {data.countries.length === 0 && <li className="text-stone-500">No data yet.</li>}
            </ul>
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="text-white">Total Unique Visits: </span>
              <span className="text-2xl text-[#f4c66a] font-bold">{data.total}</span>
            </div>
          </div>
          <div>
            <h3 className="text-lg text-white mb-3">Live Feed (Real-Time)</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {data.recent.map((r: any, i: number) => (
                <div key={i} className="text-xs p-2 bg-black/40 border border-white/5 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span className="text-stone-400">{new Date(r.visited_at).toLocaleTimeString()}</span>
                    <span className="text-[#f4c66a]">{r.ip.substring(0, 8)}...</span>
                  </div>
                  <div className="text-white">{r.country} - {r.city}</div>
                  <div className="text-stone-500 truncate">{r.path}</div>
                </div>
              ))}
              {data.recent.length === 0 && <div className="text-stone-500">Awaiting connections...</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
