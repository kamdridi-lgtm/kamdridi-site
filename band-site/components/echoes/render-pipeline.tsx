import type { AgentTaskRecord } from "@/lib/agents/types";
import { GlassCard } from "@/components/ui";

function PipelineTask({ task }: { task: AgentTaskRecord }) {
  const isRunning = task.status === "running";
  const isFailed = task.status === "failed";
  const isPending = task.status === "pending";

  return (
    <div className={`relative overflow-hidden rounded-xl border p-4 transition-colors ${isRunning ? "border-[#f4c66a]/30 bg-[#f4c66a]/5" : isFailed ? "border-red-500/30 bg-red-500/5" : "border-white/10 bg-black/40"}`}>
      {isRunning && (
        <div className="absolute top-0 left-0 h-0.5 w-full overflow-hidden bg-white/10">
          <div className="h-full w-1/3 animate-[slide_2s_ease-in-out_infinite] bg-[#f4c66a]" />
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-stone-500">{task.task_type}</p>
          <h4 className="mt-1 font-display text-sm uppercase tracking-widest text-white">{task.title}</h4>
        </div>
        <span className={`rounded-full border px-2 py-0.5 text-[9px] uppercase tracking-widest ${isRunning ? "border-[#f4c66a]/50 text-[#f4c66a]" : isFailed ? "border-red-500/50 text-red-400" : isPending ? "border-blue-400/50 text-blue-300" : "border-stone-500/50 text-stone-400"}`}>
          {task.status}
        </span>
      </div>
      
      <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-stone-500">
        <span>Priority: {task.priority}</span>
        <span>{new Date(task.created_at).toLocaleTimeString()}</span>
      </div>
    </div>
  );
}

export function RenderPipeline({ tasks, onTrigger, pending }: { tasks: AgentTaskRecord[], onTrigger: () => void, pending: boolean }) {
  const activeTasks = tasks.filter(t => t.status === "running" || t.status === "pending");
  const recentHistory = tasks.filter(t => t.status !== "running" && t.status !== "pending").slice(0, 4);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassCard>
        <div className="flex items-center justify-between border-b border-white/5 pb-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-[#f4c66a]">Media Queue</p>
            <h3 className="mt-1 font-display text-2xl uppercase tracking-[0.08em] text-white">Render Pipeline</h3>
          </div>
          <button
            type="button"
            onClick={onTrigger}
            disabled={pending}
            className="rounded bg-[#f4c66a] px-4 py-2 text-[10px] uppercase tracking-widest text-black transition-opacity hover:opacity-80 disabled:opacity-50"
          >
            Trigger Cycle
          </button>
        </div>

        <div className="mt-6">
          <p className="mb-3 text-[10px] uppercase tracking-widest text-stone-500">Active & Pending ({activeTasks.length})</p>
          <div className="grid gap-3">
            {activeTasks.map(task => <PipelineTask key={task.id} task={task} />)}
            {activeTasks.length === 0 && (
              <div className="rounded-xl border border-white/5 border-dashed py-8 text-center text-xs text-stone-600">
                Pipeline is idle.
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="border-b border-white/5 pb-4">
          <p className="text-[10px] uppercase tracking-[0.35em] text-stone-500">History</p>
          <h3 className="mt-1 font-display text-2xl uppercase tracking-[0.08em] text-white">Recent Jobs</h3>
        </div>

        <div className="mt-6">
          <div className="grid gap-3">
            {recentHistory.map(task => <PipelineTask key={task.id} task={task} />)}
            {recentHistory.length === 0 && (
              <div className="rounded-xl border border-white/5 border-dashed py-8 text-center text-xs text-stone-600">
                No recent jobs found.
              </div>
            )}
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
