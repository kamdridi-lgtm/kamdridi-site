"use client";

import { Activity, Brain, Server, Radio, Zap } from "lucide-react";
import clsx from "clsx";

export type AgentStatus = "online" | "rendering" | "sleeping" | "offline";

export interface AgentData {
  id: string;
  name: string;
  role: string;
  status: AgentStatus;
  lastPing: string;
  uptime: string;
  icon: React.ReactNode;
}

export function AgentFleet({ agents }: { agents: AgentData[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#f4c66a]/30 bg-[#f4c66a]/10 text-[#f4c66a]">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-[0.15em] uppercase text-stone-100">Agent Fleet</h2>
          <p className="text-xs tracking-[0.05em] text-stone-400">Autonomous Nodes & Sentience Engines</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div 
            key={agent.id}
            className="group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:border-white/15 hover:bg-white/[0.04]"
          >
            {/* Background Glow */}
            <div className={clsx(
              "absolute -inset-10 opacity-20 blur-3xl transition-all duration-700 pointer-events-none",
              agent.status === "online" ? "bg-emerald-500/20 group-hover:bg-emerald-500/30" : 
              agent.status === "rendering" ? "bg-[#f4c66a]/20 animate-pulse group-hover:bg-[#f4c66a]/30" : 
              agent.status === "sleeping" ? "bg-blue-500/10" : "bg-red-500/10"
            )} />
            
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={clsx(
                  "flex h-10 w-10 items-center justify-center rounded-lg border shadow-lg transition-all",
                  agent.status === "online" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-emerald-500/20" : 
                  agent.status === "rendering" ? "border-[#f4c66a]/30 bg-[#f4c66a]/10 text-[#f4c66a] shadow-[#f4c66a]/20" : 
                  agent.status === "sleeping" ? "border-blue-500/30 bg-blue-500/10 text-blue-400" : 
                  "border-red-500/30 bg-red-500/10 text-red-400"
                )}>
                  {agent.icon}
                </div>
                <div>
                  <h3 className="font-semibold tracking-wider text-stone-200">{agent.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500">{agent.role}</p>
                </div>
              </div>

              {/* Status Badge */}
              <div className={clsx(
                "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest",
                agent.status === "online" ? "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" : 
                agent.status === "rendering" ? "border-[#f4c66a]/30 text-[#f4c66a] bg-[#f4c66a]/10" : 
                agent.status === "sleeping" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" : 
                "border-red-500/30 text-red-400 bg-red-500/10"
              )}>
                {agent.status === "online" && <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />}
                {agent.status === "rendering" && <Activity className="h-3 w-3 animate-pulse" />}
                {agent.status === "sleeping" && <span className="h-1.5 w-1.5 rounded-full bg-blue-400 opacity-60" />}
                {agent.status === "offline" && <span className="h-1.5 w-1.5 rounded-full bg-red-500" />}
                {agent.status}
              </div>
            </div>

            <div className="relative z-10 mt-5 grid grid-cols-2 gap-4 border-t border-white/5 pt-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500">Last Ping</p>
                <p className="mt-0.5 text-xs font-medium text-stone-300">{agent.lastPing}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-stone-500">Uptime</p>
                <p className="mt-0.5 text-xs font-medium text-stone-300">{agent.uptime}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
