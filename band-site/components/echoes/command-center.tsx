"use client";

import { useEffect, useState } from "react";
import { AgentFleet, AgentData } from "./agent-fleet";
import { RenderPipeline, RenderTask } from "./render-pipeline";
import { Globe, Share2, Eye, Brain } from "lucide-react";
import clsx from "clsx";

export function CommandCenter() {
  const [agents, setAgents] = useState<AgentData[]>([]);
  const [tasks, setTasks] = useState<RenderTask[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Agent Status
        const statusRes = await fetch("/api/agents/status");
        if (statusRes.ok) {
          const statusData = await statusRes.json();
          if (statusData.ok) {
            // Map Agents
            const mappedAgents: AgentData[] = (statusData.agents || []).map((a: any) => ({
              id: a.id,
              name: a.name,
              role: a.description || "Node",
              status: (a.status === "running" ? "rendering" : a.status === "offline" ? "offline" : a.status === "sleeping" ? "sleeping" : "online") as any,
              lastPing: a.last_seen ? new Date(a.last_seen).toLocaleTimeString() : "Just now",
              uptime: "99.9%",
              icon: a.is_chief ? <Brain className="h-5 w-5" /> : a.name.includes("Social") ? <Share2 className="h-5 w-5" /> : <Globe className="h-5 w-5" />
            }));
            setAgents(mappedAgents);

            // Map Tasks
            const mappedTasks: RenderTask[] = (statusData.tasks || []).map((t: any) => ({
              id: t.id.split("-")[0], // Short ID
              type: t.task_type || "Task",
              subject: t.title || "Unknown Task",
              status: (t.status === "running" ? "rendering" : t.status) as any,
              progress: t.status === "completed" ? 100 : t.status === "running" ? 45 : 0,
              timeAdded: new Date(t.created_at).toLocaleTimeString()
            }));
            setTasks(mappedTasks);
          }
        }

        // Fetch Demographics (Active Users)
        const demoRes = await fetch("/api/track/stats");
        if (demoRes.ok) {
          const demoData = await demoRes.json();
          // Active users could be represented by total distinct sessions or visits today
          // We'll just use total logs length for now to show real activity
          setActiveUsers(demoData.totalLogs || demoData.logs?.length || 0);
        }
      } catch (err) {
        console.error("Failed to fetch command center data", err);
      }
    }

    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#050403] p-4 sm:p-8 font-sans selection:bg-[#f4c66a]/30">
      <div className="mx-auto max-w-7xl space-y-8">
        
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-white">Command Center</h1>
            <p className="mt-2 text-sm tracking-[0.1em] text-[#f4c66a]">Echoes Engine Administration Node</p>
          </div>
          <div className="flex items-center gap-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-6 py-3">
            <div className="flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">System Nominal</span>
            </div>
            <div className="h-6 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-emerald-500/70" />
              <span className="text-xs font-bold tracking-widest text-emerald-400">{activeUsers} Active</span>
            </div>
          </div>
        </header>

        {/* Grid Layout */}
        <div className="grid gap-8 lg:grid-cols-12">
          
          {/* Main Column */}
          <div className="space-y-8 lg:col-span-8">
            <AgentFleet agents={agents} />
            <RenderPipeline tasks={tasks} />
          </div>

          {/* Side Column */}
          <div className="space-y-8 lg:col-span-4">
            
            {/* Social Distribution Radar */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-500/30 bg-blue-500/10 text-blue-400">
                  <Share2 className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-[0.15em] uppercase text-stone-100">Distribution</h2>
                  <p className="text-xs tracking-[0.05em] text-stone-400">Social Grid Status</p>
                </div>
              </div>

              <div className="space-y-3">
                {[
                  { name: "TikTok Node", status: "Active", posts: 24, sync: "2m ago" },
                  { name: "Instagram Sync", status: "Active", posts: 18, sync: "5m ago" },
                  { name: "Spotify Metadata", status: "Sleeping", posts: 0, sync: "1h ago" }
                ].map((node) => (
                  <div key={node.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-4">
                    <div>
                      <h3 className="font-semibold text-stone-200">{node.name}</h3>
                      <p className="text-[10px] uppercase tracking-wider text-stone-500">Last Sync: {node.sync}</p>
                    </div>
                    <div className="text-right">
                      <p className={clsx("text-xs font-bold uppercase tracking-wider", node.status === "Active" ? "text-emerald-400" : "text-stone-500")}>
                        {node.status}
                      </p>
                      <p className="text-[10px] text-stone-400">{node.posts} Posts Today</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Manual Override Controls */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-red-400">Manual Override</h3>
              <div className="space-y-3">
                <button className="w-full rounded-xl border border-red-500/50 bg-red-500/10 py-3 text-xs font-bold uppercase tracking-widest text-red-400 transition hover:bg-red-500 hover:text-black">
                  Force Pipeline Cycle
                </button>
                <button className="w-full rounded-xl border border-white/10 bg-white/5 py-3 text-xs font-bold uppercase tracking-widest text-stone-300 transition hover:bg-white/10">
                  Restart All Agents
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
