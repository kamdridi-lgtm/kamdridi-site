"use client";

import { CheckCircle2, Circle, Clock, Flame, Loader2, Play, AlertTriangle } from "lucide-react";
import clsx from "clsx";

export type TaskStatus = "pending" | "rendering" | "completed" | "failed";

export interface RenderTask {
  id: string;
  type: string;
  subject: string;
  status: TaskStatus;
  progress: number;
  timeAdded: string;
}

export function RenderPipeline({ tasks }: { tasks: RenderTask[] }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3 border-b border-white/10 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-400">
          <Flame className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold tracking-[0.15em] uppercase text-stone-100">Render Pipeline</h2>
          <p className="text-xs tracking-[0.05em] text-stone-400">Echoes Engine Video Queue</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="group relative flex flex-col sm:flex-row sm:items-center gap-4 overflow-hidden rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-all hover:bg-white/[0.04]"
          >
            {/* Status Icon */}
            <div className="flex shrink-0 items-center justify-center">
              {task.status === "completed" && <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
              {task.status === "rendering" && <Loader2 className="h-6 w-6 animate-spin text-[#f4c66a]" />}
              {task.status === "pending" && <Circle className="h-6 w-6 text-stone-500" />}
              {task.status === "failed" && <AlertTriangle className="h-6 w-6 text-red-500" />}
            </div>

            {/* Task Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="rounded bg-white/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-stone-300">
                  {task.type}
                </span>
                <span className="text-[10px] font-mono text-stone-500">{task.id}</span>
              </div>
              <h3 className="mt-1 font-semibold text-stone-200">{task.subject}</h3>
            </div>

            {/* Progress Bar (if rendering) */}
            {task.status === "rendering" && (
              <div className="flex-1 sm:max-w-xs">
                <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-wider">
                  <span className="text-[#f4c66a]">Rendering</span>
                  <span className="text-stone-400">{task.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/50">
                  <div 
                    className="h-full rounded-full bg-gradient-to-r from-[#a86225] to-[#f4c66a] transition-all duration-500"
                    style={{ width: `${task.progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="flex shrink-0 items-center gap-4 text-[10px] uppercase tracking-wider text-stone-500 sm:w-32 sm:justify-end">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" />
                {task.timeAdded}
              </div>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 py-12 text-center">
            <Play className="h-8 w-8 text-stone-600 mb-3" />
            <p className="text-sm font-medium text-stone-400">Pipeline is empty</p>
            <p className="text-xs text-stone-500">No render tasks currently queued</p>
          </div>
        )}
      </div>
    </div>
  );
}
