"use client";

import { useEffect, useState, useTransition } from "react";
import type { AgentStatusPayload } from "@/lib/agents/types";
import { AgentFleet } from "./agent-fleet";
import { RenderPipeline } from "./render-pipeline";
import { DemographicsDashboard } from "@/components/demographics-dashboard";
import { GlassCard } from "@/components/ui";

type ActionState = {
  kind: "idle" | "success" | "error";
  message: string;
};

async function readJson<T>(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  const payload = (await response.json()) as T & { ok?: boolean; error?: string };
  if (!response.ok || payload.ok === false) {
    throw new Error(payload.error || "Request failed");
  }
  return payload;
}

export function CommandCenter({ initialStatus }: { initialStatus: AgentStatusPayload }) {
  const [status, setStatus] = useState(initialStatus);
  const [actionState, setActionState] = useState<ActionState>({ kind: "idle", message: "" });
  const [pending, startTransition] = useTransition();

  const refresh = async () => {
    try {
      const payload = await readJson<AgentStatusPayload>("/api/agents/status");
      setStatus(payload);
    } catch {
      // Ignore background refresh errors
    }
  };

  useEffect(() => {
    const id = window.setInterval(refresh, 15000);
    return () => window.clearInterval(id);
  }, []);

  const executeAction = (action: () => Promise<string>) => {
    startTransition(async () => {
      try {
        const msg = await action();
        await refresh();
        setActionState({ kind: "success", message: msg });
      } catch (error) {
        setActionState({
          kind: "error",
          message: error instanceof Error ? error.message : "Action failed."
        });
      }
    });
  };

  const triggerCycle = () => executeAction(async () => {
    const payload = await readJson<{ processed?: Array<{ summary: string }> }>("/api/agents/orchestrator");
    return `Cycle completed. ${payload.processed?.length || 0} tasks processed.`;
  });

  const restartAgent = (agentId: string) => executeAction(async () => {
    await readJson("/api/agents/restart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent_id: agentId })
    });
    return `Agent ${agentId} restarting...`;
  });

  const createTask = (taskType: string, title: string) => executeAction(async () => {
    await readJson("/api/agents/intake", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, task_type: taskType, requested_by: "command_center" })
    });
    return `Task queued: ${title}`;
  });

  return (
    <div className="grid gap-8">
      {actionState.message && (
        <div className={`rounded-xl border px-4 py-3 text-sm flex items-center justify-between ${
          actionState.kind === "error" ? "border-red-500/30 bg-red-500/10 text-red-200" : "border-[#f4c66a]/30 bg-[#f4c66a]/10 text-[#f4c66a]"
        }`}>
          <span>{actionState.message}</span>
          <button onClick={() => setActionState({ kind: "idle", message: "" })} className="opacity-50 hover:opacity-100">&times;</button>
        </div>
      )}

      {/* 1. Agent Fleet */}
      <AgentFleet agents={status.agents} onRestart={restartAgent} pending={pending} />

      {/* 2. Media Pipeline */}
      <RenderPipeline tasks={status.tasks} onTrigger={triggerCycle} pending={pending} />

      {/* 3. Global Radar */}
      <DemographicsDashboard />

      {/* 4. Social Distribution & Bot Commands */}
      <GlassCard>
        <div className="border-b border-white/5 pb-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-[#f4c66a]">Social Bots</p>
          <h3 className="mt-1 font-display text-2xl uppercase tracking-[0.08em] text-white">Distribution Network</h3>
        </div>
        
        <div className="mt-6 flex flex-wrap gap-4">
          <button
            onClick={() => createTask("tiktok_distribution", "Publish TikTok Snippet")}
            disabled={pending}
            className="group relative overflow-hidden rounded-xl border border-fuchsia-500/30 bg-black/40 p-4 transition-all hover:bg-fuchsia-500/10"
          >
            <h4 className="font-display text-lg tracking-widest text-white">TikTok Bot</h4>
            <p className="mt-1 text-xs text-fuchsia-300">Queue Snippet Publish</p>
          </button>

          <button
            onClick={() => createTask("instagram_distribution", "Publish IG Snippet")}
            disabled={pending}
            className="group relative overflow-hidden rounded-xl border border-pink-500/30 bg-black/40 p-4 transition-all hover:bg-pink-500/10"
          >
            <h4 className="font-display text-lg tracking-widest text-white">Instagram Bot</h4>
            <p className="mt-1 text-xs text-pink-300">Queue Reels Publish</p>
          </button>

          <button
            onClick={() => createTask("spotify_pitching", "Pitch Spotify Canvas")}
            disabled={pending}
            className="group relative overflow-hidden rounded-xl border border-emerald-500/30 bg-black/40 p-4 transition-all hover:bg-emerald-500/10"
          >
            <h4 className="font-display text-lg tracking-widest text-white">Spotify Bot</h4>
            <p className="mt-1 text-xs text-emerald-300">Queue Canvas Update</p>
          </button>
        </div>
      </GlassCard>
    </div>
  );
}
