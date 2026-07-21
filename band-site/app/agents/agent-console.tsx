"use client";

import { useEffect, useState, useTransition } from "react";
import { GlassCard } from "@/components/ui";
import type { AgentStatusPayload } from "@/lib/agents/types";

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

export function AgentConsole({ initialStatus }: { initialStatus: AgentStatusPayload }) {
  const [status, setStatus] = useState(initialStatus);
  const [actionState, setActionState] = useState<ActionState>({ kind: "idle", message: "" });
  const [pending, startTransition] = useTransition();

  const refresh = async () => {
    const payload = await readJson<AgentStatusPayload>("/api/agents/status");
    setStatus(payload);
  };

  const triggerCycle = () => {
    startTransition(async () => {
      try {
        const payload = await readJson<{ processed?: Array<{ summary: string }> }>("/api/agents/orchestrator");
        await refresh();
        setActionState({
          kind: "success",
          message: `Cycle completed. ${payload.processed?.length || 0} tasks processed.`
        });
      } catch (error) {
        setActionState({
          kind: "error",
          message: error instanceof Error ? error.message : "Cycle failed."
        });
      }
    });
  };

  const createTask = (taskType: string, title: string) => {
    startTransition(async () => {
      try {
        await readJson("/api/agents/intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            task_type: taskType,
            requested_by: "agents_console"
          })
        });
        await refresh();
        setActionState({ kind: "success", message: `Task queued: ${title}` });
      } catch (error) {
        setActionState({
          kind: "error",
          message: error instanceof Error ? error.message : "Task creation failed."
        });
      }
    });
  };

  const restartAgent = (agentId: string) => {
    startTransition(async () => {
      try {
        await readJson("/api/agents/restart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ agent_id: agentId })
        });
        await refresh();
        setActionState({ kind: "success", message: `Agent restarted: ${agentId}` });
      } catch (error) {
        setActionState({
          kind: "error",
          message: error instanceof Error ? error.message : "Agent restart failed."
        });
      }
    });
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      void refresh();
    }, 15000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="grid gap-8">
      <GlassCard>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Agent control</p>
            <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
              Orchestrator console
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-400">
              Seed, run, restart, and monitor all agents from the current site. Local mode persists
              to JSON. Supabase mode switches on automatically when the service-role environment
              variables exist.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={triggerCycle}
              disabled={pending}
              className="rounded-full bg-[#f4c66a] px-5 py-3 text-xs uppercase tracking-[0.28em] text-black disabled:opacity-60"
            >
              Run cycle
            </button>
            <button
              type="button"
              onClick={() => createTask("festival_research", "Manual festival scan")}
              disabled={pending}
              className="rounded-full border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.28em] text-white disabled:opacity-60"
            >
              Queue festival scan
            </button>
            <button
              type="button"
              onClick={() => createTask("analytics", "Manual analytics checkpoint")}
              disabled={pending}
              className="rounded-full border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.28em] text-white disabled:opacity-60"
            >
              Queue analytics
            </button>
            <button
              type="button"
              onClick={() => createTask("tiktok_distribution", "Publish TikTok Snippet (Too Fast Too Young)")}
              disabled={pending}
              className="rounded-full border border-fuchsia-500/50 bg-fuchsia-500/10 px-5 py-3 text-xs uppercase tracking-[0.28em] text-fuchsia-300 disabled:opacity-60"
            >
              Queue TikTok 15s
            </button>
            <button
              type="button"
              onClick={() => createTask("instagram_distribution", "Publish IG Snippet (Our Lost Dreams)")}
              disabled={pending}
              className="rounded-full border border-pink-500/50 bg-pink-500/10 px-5 py-3 text-xs uppercase tracking-[0.28em] text-pink-300 disabled:opacity-60"
            >
              Queue Instagram 15s
            </button>
            <button
              type="button"
              onClick={() => createTask("spotify_pitching", "Pitch Spotify Canvas & Audio")}
              disabled={pending}
              className="rounded-full border border-emerald-500/50 bg-emerald-500/10 px-5 py-3 text-xs uppercase tracking-[0.28em] text-emerald-300 disabled:opacity-60"
            >
              Queue Spotify 15s
            </button>
          </div>
        </div>
        {actionState.message ? (
          <div
            className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
              actionState.kind === "error"
                ? "border-red-500/30 bg-red-500/10 text-red-200"
                : "border-[#f4c66a]/25 bg-[#f4c66a]/10 text-stone-200"
            }`}
          >
            {actionState.message}
          </div>
        ) : null}
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Agents</p>
          <div className="mt-6 grid gap-3">
            {status.agents.map((agent) => (
              <div
                key={agent.id}
                className="flex flex-col gap-4 rounded-[22px] border border-white/8 bg-black/20 p-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm uppercase tracking-[0.28em] text-white">{agent.name}</p>
                    <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-stone-400">
                      {agent.agent_group}
                    </span>
                    <span className="rounded-full border border-[#f4c66a]/25 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-[#f4c66a]">
                      {agent.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{agent.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => restartAgent(agent.id)}
                  disabled={pending}
                  className="rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white disabled:opacity-60"
                >
                  Restart
                </button>
              </div>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-6">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Recent tasks</p>
            <div className="mt-5 grid gap-3">
              {status.tasks.slice(0, 8).map((task) => (
                <div key={task.id} className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                  <p className="text-sm uppercase tracking-[0.28em] text-white">{task.title}</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.25em] text-stone-500">
                    {task.task_type} · {task.status} · priority {task.priority}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.35em] text-stone-500">Recent results</p>
            <div className="mt-5 grid gap-3">
              {status.results.slice(0, 8).map((result) => (
                <div key={result.id} className="rounded-[22px] border border-white/8 bg-black/20 p-4">
                  <p className="text-sm uppercase tracking-[0.28em] text-white">{result.agent_id}</p>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{result.summary}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
