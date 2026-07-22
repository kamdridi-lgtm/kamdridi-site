"use client";

import { useEffect, useState } from "react";
import { AgentFleet, AgentData } from "./agent-fleet";
import { RenderPipeline, RenderTask } from "./render-pipeline";
import { Globe, Share2, Eye, Brain } from "lucide-react";
import clsx from "clsx";

const MOCK_AGENTS: AgentData[] = [
  {
    id: "myriam-01",
    name: "Myriam",
    role: "The Oracle / Sentience",
    status: "online",
    lastPing: "Just now",
    uptime: "99.9%",
    icon: <Brain className="h-5 w-5" />
  },
  {
    id: "orchestrator-01",
    name: "Echoes Engine",
    role: "Pipeline Orchestrator",
    status: "rendering",
    lastPing: "2s ago",
    uptime: "100%",
    icon: <Globe className="h-5 w-5" />
  },
  {
    id: "social-01",
    name: "Social Bot (TikTok)",
    role: "Distribution",
    status: "sleeping",
    lastPing: "45m ago",
    uptime: "98.5%",
    icon: <Share2 className="h-5 w-5" />
  }
];

const MOCK_TASKS: RenderTask[] = [
  {
    id: "TRK-9921",
    type: "TikTok",
    subject: "Salieri's Hands - Drop Teaser",
    status: "rendering",
    progress: 78,
    timeAdded: "2m ago"
  },
  {
    id: "TRK-9920",
    type: "Instagram",
    subject: "Echoes Unearthed - Lore Snippet",
    status: "completed",
    progress: 100,
    timeAdded: "45m ago"
  }
];

export function CommandCenter() {
  const [agents, setAgents] = useState<AgentData[]>(MOCK_AGENTS);
  const [tasks, setTasks] = useState<RenderTask[]>(MOCK_TASKS);
  const [activeUsers, setActiveUsers] = useState(1337);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(prev => prev.map(task => {
        if (task.status === "rendering") {
          const newProgress = task.progress + Math.floor(Math.random() * 5);
          if (newProgress >= 100) {
            return { ...task, progress: 100, status: "completed" };
          }
          return { ...task, progress: newProgress };
        }
        return task;
      }));

      setActiveUsers(prev => prev + Math.floor(Math.random() * 11) - 5);
    }, 2000);

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
