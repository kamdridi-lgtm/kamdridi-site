import type { Metadata } from "next";
import { CommandCenter } from "@/components/echoes/command-center";
import { getAgentStatusSnapshot } from "@/lib/agents/store";
import type { AgentStatusPayload } from "@/lib/agents/types";

export const metadata: Metadata = {
  title: "Echoes Command Center",
  description: "Unified AI orchestrator and radar."
};

export const dynamic = "force-dynamic";

export default async function AgentsPage() {
  const status = await getAgentStatusSnapshot();
  const initialStatus: AgentStatusPayload = {
    ok: true,
    agents: status.agents,
    tasks: status.tasks,
    runs: status.runs,
    results: status.results
  };

  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12">
          <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">
            Echoes Engine
          </p>
          <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] md:text-7xl">
            Command
            <br />
            Center
          </h1>
        </div>

        <CommandCenter initialStatus={initialStatus} />
      </div>
    </main>
  );
}
