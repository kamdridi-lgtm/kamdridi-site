import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import type {
  AgentManifestEntry,
  AgentMessageRecord,
  AgentMetricRecord,
  AgentRegistryRecord,
  AgentResultRecord,
  AgentRunRecord,
  AgentSystemState,
  AgentTaskRecord,
  FanLeadRecord,
  FestivalRecord,
  OutreachEmailRecord,
  PlaylistRecord,
  PressContactRecord,
  RadioRecord
} from "@/lib/agents/types";

const root = process.cwd();
const localStatePath = path.join(root, "data", "agent-system.json");

const defaultState: AgentSystemState = {
  agent_registry: [],
  agent_tasks: [],
  agent_runs: [],
  agent_messages: [],
  agent_metrics: [],
  agent_results: [],
  fans: [],
  festivals: [],
  press_contact: [],
  radios: [],
  playlists: [],
  outreach_emails: []
};

function now() {
  return new Date().toISOString();
}

function newId() {
  return crypto.randomUUID();
}

function getSupabaseBaseUrl() {
  const value = process.env.SUPABASE_URL || "";
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function hasSupabaseConfig() {
  return Boolean(getSupabaseBaseUrl() && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function readLocalState() {
  try {
    const raw = await fs.readFile(localStatePath, "utf8");
    return { ...defaultState, ...(JSON.parse(raw) as Partial<AgentSystemState>) };
  } catch {
    return structuredClone(defaultState);
  }
}

async function writeLocalState(state: AgentSystemState) {
  await fs.mkdir(path.dirname(localStatePath), { recursive: true });
  await fs.writeFile(localStatePath, JSON.stringify(state, null, 2), "utf8");
}

async function supabaseRequest<T>(table: string, options: RequestInit = {}, query = ""): Promise<T> {
  const baseUrl = getSupabaseBaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!baseUrl || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  const response = await fetch(`${baseUrl}/rest/v1/${table}${query}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=representation",
      ...(options.headers || {})
    },
    cache: "no-store"
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `Supabase request failed (${response.status})`);
  }

  return (text ? JSON.parse(text) : []) as T;
}

function sortByNewest<T extends { created_at: string }>(rows: T[], limit?: number) {
  const sorted = [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at));
  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

function sortTasksForDispatch(rows: AgentTaskRecord[]) {
  return [...rows].sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return a.scheduled_for.localeCompare(b.scheduled_for);
  });
}

export async function getRegistryIds() {
  if (hasSupabaseConfig()) {
    const rows = await supabaseRequest<Array<Pick<AgentRegistryRecord, "id">>>(
      "agent_registry",
      { method: "GET" },
      "?select=id"
    );
    return rows.map((row) => row.id);
  }

  const state = await readLocalState();
  return state.agent_registry.map((row) => row.id);
}

export async function seedRegistryEntries(entries: AgentManifestEntry[]) {
  if (hasSupabaseConfig()) {
    const payload = entries.map((entry) => ({
      id: entry.id,
      name: entry.name,
      agent_group: entry.group,
      description: entry.description,
      is_chief: Boolean(entry.isChief),
      status: "idle",
      autonomy_mode: "autonomous"
    }));

    if (payload.length) {
      await supabaseRequest("agent_registry", {
        method: "POST",
        body: JSON.stringify(payload)
      });
    }
    return;
  }

  const state = await readLocalState();
  entries.forEach((entry) => {
    state.agent_registry.push({
      id: entry.id,
      name: entry.name,
      agent_group: entry.group,
      description: entry.description,
      is_chief: Boolean(entry.isChief),
      status: "idle",
      autonomy_mode: "autonomous",
      restart_count: 0,
      last_seen: null,
      created_at: now()
    });
  });
  await writeLocalState(state);
}

export async function insertAgentTask(
  payload: Partial<AgentTaskRecord> & Pick<AgentTaskRecord, "title" | "task_type">
) {
  const row: AgentTaskRecord = {
    id: newId(),
    title: payload.title,
    description: payload.description || "",
    task_type: payload.task_type,
    status: payload.status || "pending",
    priority: payload.priority ?? 50,
    requested_by: payload.requested_by || "manual",
    assigned_agent_id: payload.assigned_agent_id || null,
    parent_task_id: payload.parent_task_id || null,
    payload: payload.payload || {},
    result: payload.result || null,
    retry_count: payload.retry_count ?? 0,
    scheduled_for: payload.scheduled_for || now(),
    started_at: payload.started_at || null,
    completed_at: payload.completed_at || null,
    created_at: payload.created_at || now()
  };

  if (hasSupabaseConfig()) {
    const [inserted] = await supabaseRequest<AgentTaskRecord[]>("agent_tasks", {
      method: "POST",
      body: JSON.stringify([row])
    });
    return inserted;
  }

  const state = await readLocalState();
  state.agent_tasks.push(row);
  await writeLocalState(state);
  return row;
}

export async function insertAgentTasks(
  rows: Array<Partial<AgentTaskRecord> & Pick<AgentTaskRecord, "title" | "task_type">>
) {
  if (!rows.length) {
    return [];
  }

  const payload = rows.map((row) => ({
    id: newId(),
    title: row.title,
    description: row.description || "",
    task_type: row.task_type,
    status: row.status || "pending",
    priority: row.priority ?? 50,
    requested_by: row.requested_by || "system",
    assigned_agent_id: row.assigned_agent_id || null,
    parent_task_id: row.parent_task_id || null,
    payload: row.payload || {},
    result: row.result || null,
    retry_count: row.retry_count ?? 0,
    scheduled_for: row.scheduled_for || now(),
    started_at: row.started_at || null,
    completed_at: row.completed_at || null,
    created_at: row.created_at || now()
  }));

  if (hasSupabaseConfig()) {
    return supabaseRequest<AgentTaskRecord[]>("agent_tasks", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  const state = await readLocalState();
  state.agent_tasks.push(...payload);
  await writeLocalState(state);
  return payload;
}

export async function getPendingTasks(limit = 6) {
  if (hasSupabaseConfig()) {
    return supabaseRequest<AgentTaskRecord[]>(
      "agent_tasks",
      { method: "GET" },
      `?select=*&status=eq.pending&scheduled_for=lte.${encodeURIComponent(now())}&order=priority.desc,scheduled_for.asc&limit=${limit}`
    );
  }

  const state = await readLocalState();
  return sortTasksForDispatch(
    state.agent_tasks.filter((task) => task.status === "pending" && task.scheduled_for <= now())
  ).slice(0, limit);
}

export async function getFailedTasks(limit = 5) {
  if (hasSupabaseConfig()) {
    return supabaseRequest<AgentTaskRecord[]>(
      "agent_tasks",
      { method: "GET" },
      `?select=*&status=eq.failed&retry_count=lt.3&order=created_at.asc&limit=${limit}`
    );
  }

  const state = await readLocalState();
  return state.agent_tasks
    .filter((task) => task.status === "failed" && task.retry_count < 3)
    .sort((a, b) => a.created_at.localeCompare(b.created_at))
    .slice(0, limit);
}

export async function getActiveTaskTypes() {
  if (hasSupabaseConfig()) {
    const rows = await supabaseRequest<Array<Pick<AgentTaskRecord, "task_type">>>(
      "agent_tasks",
      { method: "GET" },
      "?select=task_type&status=in.(pending,running)&limit=200"
    );
    return new Set(rows.map((row) => row.task_type));
  }

  const state = await readLocalState();
  return new Set(
    state.agent_tasks
      .filter((task) => task.status === "pending" || task.status === "running")
      .map((task) => task.task_type)
  );
}

export async function updateAgentTask(id: string, payload: Partial<AgentTaskRecord>) {
  if (hasSupabaseConfig()) {
    const [updated] = await supabaseRequest<AgentTaskRecord[]>(
      "agent_tasks",
      {
        method: "PATCH",
        body: JSON.stringify(payload)
      },
      `?id=eq.${encodeURIComponent(id)}`
    );
    return updated;
  }

  const state = await readLocalState();
  const task = state.agent_tasks.find((row) => row.id === id);
  if (!task) {
    throw new Error(`Task not found: ${id}`);
  }
  Object.assign(task, payload);
  await writeLocalState(state);
  return task;
}

export async function insertAgentRun(taskId: string, agentId: string) {
  const row: AgentRunRecord = {
    id: newId(),
    task_id: taskId,
    agent_id: agentId,
    status: "running",
    summary: "",
    log_entries: [],
    created_at: now(),
    updated_at: now()
  };

  if (hasSupabaseConfig()) {
    const [inserted] = await supabaseRequest<AgentRunRecord[]>("agent_runs", {
      method: "POST",
      body: JSON.stringify([row])
    });
    return inserted;
  }

  const state = await readLocalState();
  state.agent_runs.push(row);
  await writeLocalState(state);
  return row;
}

export async function updateAgentRun(id: string, payload: Partial<AgentRunRecord>) {
  const nextPayload = { ...payload, updated_at: now() };
  if (hasSupabaseConfig()) {
    const [updated] = await supabaseRequest<AgentRunRecord[]>(
      "agent_runs",
      {
        method: "PATCH",
        body: JSON.stringify(nextPayload)
      },
      `?id=eq.${encodeURIComponent(id)}`
    );
    return updated;
  }

  const state = await readLocalState();
  const run = state.agent_runs.find((row) => row.id === id);
  if (!run) {
    throw new Error(`Run not found: ${id}`);
  }
  Object.assign(run, nextPayload);
  await writeLocalState(state);
  return run;
}

export async function updateAgentRegistry(id: string, payload: Partial<AgentRegistryRecord>) {
  if (hasSupabaseConfig()) {
    const [updated] = await supabaseRequest<AgentRegistryRecord[]>(
      "agent_registry",
      {
        method: "PATCH",
        body: JSON.stringify(payload)
      },
      `?id=eq.${encodeURIComponent(id)}`
    );
    return updated;
  }

  const state = await readLocalState();
  const agent = state.agent_registry.find((row) => row.id === id);
  if (!agent) {
    throw new Error(`Agent not found: ${id}`);
  }
  Object.assign(agent, payload);
  await writeLocalState(state);
  return agent;
}

export async function getAgentRegistryById(id: string) {
  if (hasSupabaseConfig()) {
    const rows = await supabaseRequest<AgentRegistryRecord[]>(
      "agent_registry",
      { method: "GET" },
      `?select=*&id=eq.${encodeURIComponent(id)}&limit=1`
    );
    return rows[0] || null;
  }

  const state = await readLocalState();
  return state.agent_registry.find((row) => row.id === id) || null;
}

export async function getRunningTasksForAgent(agentId: string, limit = 20) {
  if (hasSupabaseConfig()) {
    return supabaseRequest<AgentTaskRecord[]>(
      "agent_tasks",
      { method: "GET" },
      `?select=*&assigned_agent_id=eq.${encodeURIComponent(agentId)}&status=eq.running&limit=${limit}`
    );
  }

  const state = await readLocalState();
  return state.agent_tasks.filter(
    (task) => task.assigned_agent_id === agentId && task.status === "running"
  );
}

export async function insertAgentMessages(rows: Omit<AgentMessageRecord, "id" | "created_at">[]) {
  if (!rows.length) {
    return [];
  }

  const payload = rows.map((row) => ({
    ...row,
    id: newId(),
    created_at: now()
  }));

  if (hasSupabaseConfig()) {
    return supabaseRequest<AgentMessageRecord[]>("agent_messages", {
      method: "POST",
      body: JSON.stringify(payload)
    });
  }

  const state = await readLocalState();
  state.agent_messages.push(...payload);
  await writeLocalState(state);
  return payload;
}

export async function insertAgentResult(row: Omit<AgentResultRecord, "id" | "created_at">) {
  const payload: AgentResultRecord = { ...row, id: newId(), created_at: now() };

  if (hasSupabaseConfig()) {
    const [inserted] = await supabaseRequest<AgentResultRecord[]>("agent_results", {
      method: "POST",
      body: JSON.stringify([payload])
    });
    return inserted;
  }

  const state = await readLocalState();
  state.agent_results.push(payload);
  await writeLocalState(state);
  return payload;
}

export async function insertAgentMetric(row: Omit<AgentMetricRecord, "id" | "captured_at">) {
  const payload: AgentMetricRecord = { ...row, id: newId(), captured_at: now() };

  if (hasSupabaseConfig()) {
    const [inserted] = await supabaseRequest<AgentMetricRecord[]>("agent_metrics", {
      method: "POST",
      body: JSON.stringify([payload])
    });
    return inserted;
  }

  const state = await readLocalState();
  state.agent_metrics.push(payload);
  await writeLocalState(state);
  return payload;
}

type OutreachSourceRow =
  | FestivalRecord
  | PressContactRecord
  | RadioRecord
  | PlaylistRecord;

export async function getOutreachSourceRows(
  table: "festivals" | "press_contact" | "radios" | "playlists",
  limit = 10
): Promise<OutreachSourceRow[]> {
  if (hasSupabaseConfig()) {
    return supabaseRequest<OutreachSourceRow[]>(
      table,
      { method: "GET" },
      `?select=*&sent=eq.false&limit=${limit}`
    );
  }

  const state = await readLocalState();
  return state[table].filter((row) => !row.sent).slice(0, limit) as OutreachSourceRow[];
}

export async function insertFestivalRows(rows: Omit<FestivalRecord, "id" | "created_at">[]) {
  const payload = rows.map((row) => ({ ...row, id: newId(), created_at: now() }));
  if (!payload.length) return 0;

  if (hasSupabaseConfig()) {
    await supabaseRequest("festivals", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return payload.length;
  }

  const state = await readLocalState();
  state.festivals.push(...payload);
  await writeLocalState(state);
  return payload.length;
}

export async function insertPressContactRows(rows: Omit<PressContactRecord, "id" | "created_at">[]) {
  const payload = rows.map((row) => ({ ...row, id: newId(), created_at: now() }));
  if (!payload.length) return 0;

  if (hasSupabaseConfig()) {
    await supabaseRequest("press_contact", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return payload.length;
  }

  const state = await readLocalState();
  state.press_contact.push(...payload);
  await writeLocalState(state);
  return payload.length;
}

export async function insertRadioRows(rows: Omit<RadioRecord, "id" | "created_at">[]) {
  const payload = rows.map((row) => ({ ...row, id: newId(), created_at: now() }));
  if (!payload.length) return 0;

  if (hasSupabaseConfig()) {
    await supabaseRequest("radios", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return payload.length;
  }

  const state = await readLocalState();
  state.radios.push(...payload);
  await writeLocalState(state);
  return payload.length;
}

export async function insertPlaylistRows(rows: Omit<PlaylistRecord, "id" | "created_at">[]) {
  const payload = rows.map((row) => ({ ...row, id: newId(), created_at: now() }));
  if (!payload.length) return 0;

  if (hasSupabaseConfig()) {
    await supabaseRequest("playlists", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return payload.length;
  }

  const state = await readLocalState();
  state.playlists.push(...payload);
  await writeLocalState(state);
  return payload.length;
}

export async function insertFanRows(rows: Omit<FanLeadRecord, "id" | "created_at">[]) {
  const payload = rows.map((row) => ({ ...row, id: newId(), created_at: now() }));
  if (!payload.length) return 0;

  if (hasSupabaseConfig()) {
    await supabaseRequest("fans", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return payload.length;
  }

  const state = await readLocalState();
  state.fans.push(...payload);
  await writeLocalState(state);
  return payload.length;
}

export async function insertOutreachRows(rows: Omit<OutreachEmailRecord, "id" | "created_at">[]) {
  const payload = rows.map((row) => ({ ...row, id: newId(), created_at: now() }));
  if (!payload.length) return 0;

  if (hasSupabaseConfig()) {
    await supabaseRequest("outreach_emails", {
      method: "POST",
      body: JSON.stringify(payload)
    });
    return payload.length;
  }

  const state = await readLocalState();
  state.outreach_emails.push(...payload);
  await writeLocalState(state);
  return payload.length;
}

export async function getAgentStatusSnapshot() {
  if (hasSupabaseConfig()) {
    const [agents, tasks, runs, results] = await Promise.all([
      supabaseRequest<AgentRegistryRecord[]>(
        "agent_registry",
        { method: "GET" },
        "?select=*&order=is_chief.desc,name.asc"
      ),
      supabaseRequest<AgentTaskRecord[]>(
        "agent_tasks",
        { method: "GET" },
        "?select=*&order=created_at.desc&limit=30"
      ),
      supabaseRequest<AgentRunRecord[]>(
        "agent_runs",
        { method: "GET" },
        "?select=*&order=created_at.desc&limit=30"
      ),
      supabaseRequest<AgentResultRecord[]>(
        "agent_results",
        { method: "GET" },
        "?select=*&order=created_at.desc&limit=30"
      )
    ]);

    return { agents, tasks, runs, results };
  }

  const state = await readLocalState();
  return {
    agents: [...state.agent_registry].sort(
      (a, b) => Number(b.is_chief) - Number(a.is_chief) || a.name.localeCompare(b.name)
    ),
    tasks: sortByNewest(state.agent_tasks, 30),
    runs: sortByNewest(state.agent_runs, 30),
    results: sortByNewest(state.agent_results, 30)
  };
}
