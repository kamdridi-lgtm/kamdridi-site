import type { AgentRegistryRecord } from "@/lib/agents/types";
import { GlassCard } from "@/components/ui";

function StatusDot({ status }: { status: AgentRegistryRecord["status"] }) {
  const colors: Record<string, string> = {
    idle: "bg-stone-500 shadow-stone-500/50",
    running: "bg-emerald-400 shadow-emerald-400/80 animate-pulse",
    sleeping: "bg-blue-400 shadow-blue-400/50",
    error: "bg-red-500 shadow-red-500/80 animate-pulse"
  };
  return <div className={`h-2 w-2 rounded-full shadow-[0_0_8px] ${colors[status]}`} />;
}

export function AgentFleet({ agents, onRestart, pending }: { agents: AgentRegistryRecord[], onRestart: (id: string) => void, pending: boolean }) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#f4c66a]">Fleet Command</p>
          <h3 className="mt-1 font-display text-2xl uppercase tracking-[0.08em] text-white">Active Agents</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
          <span className="text-[10px] uppercase tracking-widest text-emerald-500">Live</span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        {agents.map((agent) => (
          <div key={agent.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-5 transition-all hover:border-[#f4c66a]/30 hover:bg-black/60">
            {/* Background Glow */}
            <div className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100">
              <div className="absolute inset-0 bg-gradient-to-br from-[#f4c66a]/5 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <StatusDot status={agent.status} />
                  <h4 className="font-display text-lg uppercase tracking-wider text-white">{agent.name}</h4>
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded bg-white/5 px-2 py-0.5 text-[9px] uppercase tracking-widest text-stone-400">{agent.agent_group}</span>
                  {agent.is_chief && (
                    <span className="rounded bg-[#f4c66a]/10 px-2 py-0.5 text-[9px] uppercase tracking-widest text-[#f4c66a] border border-[#f4c66a]/20">Orchestrator</span>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => onRestart(agent.id)}
                disabled={pending}
                className="rounded border border-white/10 bg-white/5 px-3 py-1.5 text-[9px] uppercase tracking-widest text-stone-300 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                Restart
              </button>
            </div>

            <div className="relative z-10 mt-4 border-t border-white/5 pt-4">
              <p className="text-xs leading-relaxed text-stone-400 line-clamp-2">{agent.description}</p>
              <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-widest text-stone-500">
                <span>Mode: <span className="text-stone-300">{agent.autonomy_mode}</span></span>
                <span>Restarts: {agent.restart_count}</span>
              </div>
            </div>
          </div>
        ))}
        {agents.length === 0 && (
          <div className="col-span-full py-8 text-center text-sm text-stone-500">
            No agents registered in the fleet.
          </div>
        )}
      </div>
    </GlassCard>
  );
}
