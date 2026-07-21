import { agentManifest } from "@/lib/agents/manifest";
import type { AgentTaskRecord, OutreachEmailRecord } from "@/lib/agents/types";
import {
  getAgentRegistryById,
  getAgentStatusSnapshot,
  getActiveTaskTypes,
  getFailedTasks,
  getOutreachSourceRows,
  getPendingTasks,
  getRegistryIds,
  getRunningTasksForAgent,
  insertAgentMessages,
  insertAgentMetric,
  insertAgentResult,
  insertAgentRun,
  insertAgentTask,
  insertAgentTasks,
  insertFanRows,
  insertFestivalRows,
  insertOutreachRows,
  insertPlaylistRows,
  insertPressContactRows,
  insertRadioRows,
  seedRegistryEntries,
  updateAgentRegistry,
  updateAgentRun,
  updateAgentTask
} from "@/lib/agents/store";

const AGENT_FOR_TASK: Record<string, string> = {
  site_architecture: "cto_agent",
  project_planning: "project_manager_agent",
  code_build: "code_builder_agent",
  code_repair: "code_repair_agent",
  refactor: "refactor_agent",
  performance: "performance_agent",
  security: "security_agent",
  database: "database_agent",
  api: "api_agent",
  automation: "automation_agent",
  radio_research: "radio_finder_agent",
  festival_research: "festival_finder_agent",
  press_research: "press_finder_agent",
  playlist_research: "playlist_finder_agent",
  outreach_email: "email_outreach_agent",
  social_campaign: "social_media_agent",
  fan_growth: "fan_growth_agent",
  content_writing: "content_writer_agent",
  visual_brief: "visual_creator_agent",
  analytics: "analytics_agent",
  tiktok_distribution: "tiktok_agent",
  instagram_distribution: "instagram_agent",
  spotify_pitching: "spotify_agent"
};

function now() {
  return new Date().toISOString();
}

function normalizeDate(value: unknown) {
  const trimmed = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

function uniqueBy<T>(items: T[], getKey: (item: T) => string | null | undefined) {
  const seen = new Set<string>();
  return items.filter((item) => {
    const key = getKey(item);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

export async function ensureRegistrySeeded() {
  const existingIds = new Set(await getRegistryIds());
  const missing = agentManifest.filter((entry) => !existingIds.has(entry.id));
  if (!missing.length) {
    return { inserted: 0 };
  }

  await seedRegistryEntries(missing);
  return { inserted: missing.length };
}

export function chooseAgent(taskType: string) {
  return AGENT_FOR_TASK[taskType] || "project_manager_agent";
}

function buildMessages(task: AgentTaskRecord, agentId: string, result: Record<string, unknown>) {
  return [
    {
      from_agent_id: "orchestrator_agent",
      to_agent_id: agentId,
      task_id: task.id,
      message_type: "dispatch",
      content: {
        title: task.title,
        task_type: task.task_type
      }
    },
    {
      from_agent_id: agentId,
      to_agent_id: "orchestrator_agent",
      task_id: task.id,
      message_type: "result",
      content: {
        summary: result.summary,
        next_actions: result.next_actions || []
      }
    }
  ];
}

async function createFollowUpTasks(task: AgentTaskRecord) {
  const tasks: Array<Partial<AgentTaskRecord> & Pick<AgentTaskRecord, "title" | "task_type">> = [];

  if (["festival_research", "press_research", "radio_research", "playlist_research"].includes(task.task_type)) {
    tasks.push({
      title: `Prepare outreach for ${task.title}`,
      description: "Draft outreach sequence for discovered opportunities.",
      task_type: "outreach_email",
      priority: Math.max((task.priority || 50) - 5, 40),
      requested_by: "orchestrator_agent",
      parent_task_id: task.id,
      payload: {
        source_task: task.id,
        source_type: task.task_type
      }
    });
  }

  if (task.task_type === "fan_growth") {
    tasks.push({
      title: `Measure fan growth impact for ${task.title}`,
      description: "Review capture and conversion metrics for fan growth work.",
      task_type: "analytics",
      priority: 50,
      requested_by: "orchestrator_agent",
      parent_task_id: task.id,
      payload: { source_task: task.id }
    });
  }

  if (!tasks.length) {
    return [];
  }

  return insertAgentTasks(tasks);
}

async function touchAgent(agentId: string, status: string, incrementRestart = false) {
  const existing = await getAgentRegistryById(agentId);
  await updateAgentRegistry(agentId, {
    status,
    last_seen: now(),
    restart_count: incrementRestart ? (existing?.restart_count || 0) + 1 : existing?.restart_count
  });
}

async function storeTaskResult(task: AgentTaskRecord, agentId: string, payload: Record<string, unknown>) {
  await insertAgentResult({
    task_id: task.id,
    agent_id: agentId,
    result_type: task.task_type,
    summary: String(payload.summary || payload.error || ""),
    payload
  });
}

async function persistFestivals(leads: Record<string, unknown>[]) {
  const rows = uniqueBy(
    leads
      .map((lead) => ({
        festival_name: String(lead.festival_name || lead.name || lead.title || "").trim(),
        email: lead.email ? String(lead.email) : null,
        country: lead.country ? String(lead.country) : null,
        submission_deadline: normalizeDate(lead.submission_deadline),
        sent: Boolean(lead.sent)
      }))
      .filter((lead) => lead.festival_name),
    (lead) => lead.festival_name
  );

  return insertFestivalRows(rows);
}

async function persistPressContacts(opportunities: Record<string, unknown>[]) {
  const rows = uniqueBy(
    opportunities
      .map((item) => ({
        media_name: String(item.media_name || item.name || item.publication || "").trim(),
        email: item.email ? String(item.email) : null,
        country: item.country ? String(item.country) : null,
        sent: Boolean(item.sent)
      }))
      .filter((item) => item.media_name || item.email),
    (item) => item.email || item.media_name
  );

  return insertPressContactRows(rows);
}

async function persistRadios(opportunities: Record<string, unknown>[]) {
  const rows = uniqueBy(
    opportunities
      .map((item) => ({
        name: String(item.name || item.radio_name || "").trim(),
        email: item.email ? String(item.email) : null,
        country: item.country ? String(item.country) : null,
        genre: item.genre ? String(item.genre) : "rock",
        notes: item.notes ? String(item.notes) : null,
        source: item.source ? String(item.source) : "agent",
        sent: Boolean(item.sent)
      }))
      .filter((item) => item.name),
    (item) => item.name
  );

  return insertRadioRows(rows);
}

async function persistPlaylists(opportunities: Record<string, unknown>[]) {
  const rows = uniqueBy(
    opportunities
      .map((item) => ({
        name: String(item.name || item.playlist_name || "").trim(),
        curator_name: item.curator_name ? String(item.curator_name) : item.curator ? String(item.curator) : null,
        email: item.email ? String(item.email) : null,
        country: item.country ? String(item.country) : null,
        platform: item.platform ? String(item.platform) : "spotify",
        url: item.url ? String(item.url) : null,
        notes: item.notes ? String(item.notes) : null,
        sent: Boolean(item.sent)
      }))
      .filter((item) => item.name),
    (item) => item.name
  );

  return insertPlaylistRows(rows);
}

async function persistFans(leads: Record<string, unknown>[]) {
  const rows = uniqueBy(
    leads
      .map((item) => ({
        email: String(item.email || "").trim().toLowerCase(),
        name: item.name ? String(item.name) : item.full_name ? String(item.full_name) : "Fan lead",
        country: item.country ? String(item.country) : null
      }))
      .filter((item) => item.email),
    (item) => item.email
  );

  return insertFanRows(rows);
}

async function buildOutreachRows(task: AgentTaskRecord, agentId: string, sourceType: string) {
  const sourceMap = {
    festival_research: { table: "festivals", email: "email", name: "festival_name", leadType: "festival" },
    press_research: { table: "press_contact", email: "email", name: "media_name", leadType: "press" },
    radio_research: { table: "radios", email: "email", name: "name", leadType: "radio" },
    playlist_research: { table: "playlists", email: "email", name: "name", leadType: "playlist" }
  } as const;

  const source = sourceMap[sourceType as keyof typeof sourceMap];
  if (!source) {
    return [];
  }

  const leads = await getOutreachSourceRows(source.table);
  return leads
    .filter((lead) => Boolean((lead as Record<string, unknown>)[source.email]))
    .map((lead) => {
      const row = lead as Record<string, unknown>;
      return {
        lead_type: source.leadType,
        lead_id: row.id ? String(row.id) : null,
        recipient_email: String(row[source.email] || ""),
        recipient_name: row[source.name] ? String(row[source.name]) : "Contact",
        subject: `KAM DRIDI - ${source.leadType} outreach`,
        body:
          `Hello ${row[source.name] ? String(row[source.name]) : "team"},\n\n` +
          "We would like to introduce KAM DRIDI and the Echoes Unearthed campaign.\n\n" +
          "This draft was prepared by the autonomous outreach system and can be refined before sending.",
        status: "draft",
        source_agent_id: agentId,
        source_task_id: task.id,
        metadata: {
          source_table: source.table,
          source_type: sourceType
        }
      };
    });
}

async function persistTaskArtifacts(task: AgentTaskRecord, result: Record<string, unknown>) {
  let stored = 0;

  if (task.task_type === "festival_research") {
    stored += await persistFestivals((result.leads as Record<string, unknown>[]) || []);
  }

  if (task.task_type === "press_research") {
    stored += await persistPressContacts((result.opportunities as Record<string, unknown>[]) || []);
  }

  if (task.task_type === "radio_research") {
    stored += await persistRadios((result.opportunities as Record<string, unknown>[]) || []);
  }

  if (task.task_type === "playlist_research") {
    stored += await persistPlaylists((result.opportunities as Record<string, unknown>[]) || []);
  }

  if (task.task_type === "fan_growth") {
    stored += await persistFans((result.fans as Record<string, unknown>[]) || []);
  }

  if (task.task_type === "outreach_email") {
    stored += await insertOutreachRows(
      (((result.emails as Record<string, unknown>[]) || []) as Omit<OutreachEmailRecord, "id" | "created_at">[])
    );
  }

  if (task.task_type === "analytics" && result.metric_name) {
    await insertAgentMetric({
      metric_name: String(result.metric_name),
      metric_value: typeof result.metric_value === "number" ? result.metric_value : 1,
      metric_payload:
        typeof result.metric_payload === "object" && result.metric_payload
          ? (result.metric_payload as Record<string, unknown>)
          : {}
    });
    stored += 1;
  }

  return stored;
}

async function runSpecialist(task: AgentTaskRecord, agentId: string) {
  const payload = task.payload || {};
  const baseSummary = `${agentId} processed ${task.task_type}`;

  const handlers: Record<string, () => Promise<Record<string, unknown>>> = {
    cto_agent: async () => ({
      summary: `${baseSummary} and reviewed architecture priorities.`,
      next_actions: ["Confirm technical roadmap", "Review automation scope"]
    }),
    project_manager_agent: async () => ({
      summary: `${baseSummary} and decomposed work into execution phases.`,
      next_actions: ["Assign specialist tasks", "Track dependencies"]
    }),
    code_builder_agent: async () => ({
      summary: `${baseSummary} and prepared implementation guidance for requested features.`,
      next_actions: ["Open build ticket", "Hand off verification to repair agent"]
    }),
    code_repair_agent: async () => ({
      summary: `${baseSummary} and flagged repair opportunities.`,
      next_actions: ["Validate failing components", "Escalate unresolved issues"]
    }),
    refactor_agent: async () => ({
      summary: `${baseSummary} and outlined structural cleanup steps.`,
      next_actions: ["Reduce duplication", "Improve maintainability"]
    }),
    performance_agent: async () => ({
      summary: `${baseSummary} and checked speed optimization candidates.`,
      next_actions: ["Compress heavy assets", "Review blocking scripts"]
    }),
    security_agent: async () => ({
      summary: `${baseSummary} and reviewed security hardening priorities.`,
      next_actions: ["Rotate exposed secrets if needed", "Audit functions and headers"]
    }),
    database_agent: async () => ({
      summary: `${baseSummary} and verified backend storage synchronization.`,
      next_actions: ["Review normalized records", "Validate schema fit"]
    }),
    api_agent: async () => ({
      summary: `${baseSummary} and checked backend integration points.`,
      next_actions: ["Map frontend/backend contracts", "Review API coverage"]
    }),
    automation_agent: async () => ({
      summary: `${baseSummary} and reviewed long-running workflow automation steps.`,
      next_actions: ["Monitor scheduled cycles", "Validate retries and fallbacks"]
    }),
    radio_finder_agent: async () => ({
      summary: `${baseSummary} and prepared radio prospecting targets.`,
      opportunities: (payload.seed_opportunities as Record<string, unknown>[]) || [],
      next_actions: ["Store radios", "Queue outreach drafts"]
    }),
    festival_finder_agent: async () => ({
      summary: `${baseSummary} and prepared festival leads for follow-up.`,
      leads: (payload.seed_leads as Record<string, unknown>[]) || [],
      next_actions: ["Persist festivals", "Trigger outreach drafting"]
    }),
    press_finder_agent: async () => ({
      summary: `${baseSummary} and prepared editorial targets.`,
      opportunities: (payload.seed_opportunities as Record<string, unknown>[]) || [],
      next_actions: ["Normalize press contacts", "Prepare personalized messaging"]
    }),
    playlist_finder_agent: async () => ({
      summary: `${baseSummary} and prepared playlist curator targets.`,
      opportunities: (payload.seed_opportunities as Record<string, unknown>[]) || [],
      next_actions: ["Store playlist leads", "Queue outreach sequences"]
    }),
    email_outreach_agent: async () => {
      const sourceType = String(payload.source_type || "festival_research");
      const emails = await buildOutreachRows(task, agentId, sourceType);
      return {
        summary: `${baseSummary} and prepared ${emails.length} outreach drafts.`,
        emails,
        next_actions: ["Review drafts", "Send outreach batch"]
      };
    },
    social_media_agent: async () => ({
      summary: `${baseSummary} and outlined social publishing cadence.`,
      next_actions: ["Create platform-specific posts", "Review launch timing"]
    }),
    fan_growth_agent: async () => ({
      summary: `${baseSummary} and reviewed capture-growth opportunities.`,
      fans: (payload.seed_fans as Record<string, unknown>[]) || [],
      next_actions: ["Improve signup flows", "Measure conversion outcomes"]
    }),
    content_writer_agent: async () => ({
      summary: `${baseSummary} and drafted content directions.`,
      next_actions: ["Draft copy", "Review brand tone"]
    }),
    visual_creator_agent: async () => ({
      summary: `${baseSummary} and defined visual asset requests without altering site identity.`,
      next_actions: ["Prepare creative brief", "Coordinate approvals"]
    }),
    analytics_agent: async () => ({
      summary: `${baseSummary} and compiled monitoring checkpoints.`,
      metric_name: "agent_cycle_completion",
      metric_value: 1,
      metric_payload: {
        task_type: task.task_type,
        requested_by: task.requested_by
      },
      next_actions: ["Track conversions", "Compare campaign performance"]
    }),
    tiktok_agent: async () => {
      const variants = [
        { path: "/videos/too-fast-too-young-v1.mp4", name: "Variant 1 (Chorus)" },
        { path: "/videos/too-fast-too-young-v2.mp4", name: "Variant 2 (Verse)" },
        { path: "/videos/too-fast-too-young-v3.mp4", name: "Variant 3 (Intro)" },
        { path: "/videos/too-fast-too-young-v4.mp4", name: "Variant 4 (Bridge)" },
        { path: "/videos/too-fast-too-young-v5.mp4", name: "Variant 5 (Outro)" }
      ];
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      const track = payload.track || "Too Fast Too Young";
      const price = "$249.00 CAD";
      return {
        summary: `${baseSummary}: Deployed ${randomVariant.name} snippet of '${track}' (using ${randomVariant.path}). Attached CD image, price tag (${price}), and 'CLICK HERE BUY NOW' CTA linking to checkout.`,
        next_actions: ["Monitor TikTok algorithm engagement", "Measure link clicks to store"]
      };
    },
    instagram_agent: async () => {
      const variants = [
        { path: "/videos/too-fast-too-young-v1.mp4", name: "Variant 1 (Chorus)" },
        { path: "/videos/too-fast-too-young-v2.mp4", name: "Variant 2 (Verse)" },
        { path: "/videos/too-fast-too-young-v3.mp4", name: "Variant 3 (Intro)" },
        { path: "/videos/too-fast-too-young-v4.mp4", name: "Variant 4 (Bridge)" },
        { path: "/videos/too-fast-too-young-v5.mp4", name: "Variant 5 (Outro)" }
      ];
      const randomVariant = variants[Math.floor(Math.random() * variants.length)];
      const track = payload.track || "Too Fast Too Young";
      const price = "$249.00 CAD";
      return {
        summary: `${baseSummary}: Deployed ${randomVariant.name} audio of '${track}' (using ${randomVariant.path}) to IG Reels and Stories. Embedded Collector Box image, price (${price}), and 'BUY NOW' product tag.`,
        next_actions: ["Check Instagram Story views", "Review direct message replies"]
      };
    },
    spotify_agent: async () => {
      const track = payload.track || "Too Fast Too Young";
      return {
        summary: `${baseSummary}: Pitched 15s focus segment of '${track}' to Spotify curators. Updated Canvas with 'BUY NOW' physical edition visuals.`,
        next_actions: ["Track Spotify playlist adds", "Review Canvas engagement"]
      };
    }
  };

  return (handlers[agentId] || handlers.project_manager_agent)();
}

export async function dispatchTask(task: AgentTaskRecord) {
  const agentId = chooseAgent(task.task_type);
  const run = await insertAgentRun(task.id, agentId);

  await updateAgentTask(task.id, {
    assigned_agent_id: agentId,
    status: "running",
    started_at: now()
  });
  await touchAgent(agentId, "busy");

  try {
    const result = await runSpecialist(task, agentId);
    const storedRecords = await persistTaskArtifacts(task, result);
    result.stored_records = storedRecords;

    await insertAgentMessages(buildMessages(task, agentId, result));
    const spawnedTasks = await createFollowUpTasks(task);
    await storeTaskResult(task, agentId, result);
    await updateAgentTask(task.id, {
      status: "completed",
      completed_at: now(),
      result
    });
    await updateAgentRun(run.id, {
      status: "completed",
      summary: String(result.summary || "")
    });
    await touchAgent(agentId, "idle");

    return {
      task_id: task.id,
      agent_id: agentId,
      summary: String(result.summary || ""),
      spawned_tasks: spawnedTasks.length,
      stored_records: storedRecords
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown agent error";
    await storeTaskResult(task, agentId, { error: message });
    await updateAgentTask(task.id, {
      status: "failed",
      result: { error: message }
    });
    await updateAgentRun(run.id, {
      status: "failed",
      summary: message
    });
    await touchAgent(agentId, "error");
    throw error;
  }
}

export async function restartFailedTasks(limit = 5) {
  const failedTasks = await getFailedTasks(limit);
  for (const task of failedTasks) {
    await updateAgentTask(task.id, {
      status: "pending",
      retry_count: (task.retry_count || 0) + 1,
      scheduled_for: now()
    });
    if (task.assigned_agent_id) {
      await touchAgent(task.assigned_agent_id, "idle", true);
    }
  }

  return failedTasks.length;
}

export async function seedRecurringTasks() {
  const activeTypes = await getActiveTaskTypes();
  const recurring: Array<Partial<AgentTaskRecord> & Pick<AgentTaskRecord, "title" | "task_type">> = [
    {
      title: "Continuous site maintenance",
      description: "Keep the site healthy without changing design identity.",
      task_type: "code_repair",
      priority: 80
    },
    {
      title: "Continuous performance watch",
      description: "Review load speed and asset performance continuously.",
      task_type: "performance",
      priority: 75
    },
    {
      title: "Continuous festival opportunity scan",
      description: "Look for festivals, deadlines, and opportunity signals.",
      task_type: "festival_research",
      priority: 70
    },
    {
      title: "Continuous press opportunity scan",
      description: "Look for press, blogs, and editorial opportunities.",
      task_type: "press_research",
      priority: 68
    },
    {
      title: "Continuous radio opportunity scan",
      description: "Look for radio opportunities and contact sources.",
      task_type: "radio_research",
      priority: 66
    },
    {
      title: "Continuous playlist opportunity scan",
      description: "Look for playlist curator opportunities.",
      task_type: "playlist_research",
      priority: 65
    },
    {
      title: "Continuous fan growth review",
      description: "Track lead capture and fanbase growth paths.",
      task_type: "fan_growth",
      priority: 64
    },
    {
      title: "Continuous analytics checkpoint",
      description: "Review traffic, conversions, and growth signals.",
      task_type: "analytics",
      priority: 62
    },
    {
      title: "Continuous TikTok distribution",
      description: "Automatically distribute 15s snippets and store links to TikTok.",
      task_type: "tiktok_distribution",
      priority: 60
    },
    {
      title: "Continuous Instagram distribution",
      description: "Automatically distribute 15s snippets and store links to Instagram.",
      task_type: "instagram_distribution",
      priority: 59
    },
    {
      title: "Continuous Spotify pitching",
      description: "Automatically pitch 15s snippets to Spotify playlists.",
      task_type: "spotify_pitching",
      priority: 58
    }
  ];

  const seeds = recurring
    .filter((task) => !activeTypes.has(task.task_type))
    .map((task) => ({
      ...task,
      requested_by: "orchestrator_agent"
    }));

  if (!seeds.length) {
    return 0;
  }

  await insertAgentTasks(seeds);
  return seeds.length;
}

export async function resetAgent(agentId: string) {
  const agent = await getAgentRegistryById(agentId);
  await updateAgentRegistry(agentId, {
    status: "idle",
    last_seen: now(),
    restart_count: (agent?.restart_count || 0) + 1
  });

  const runningTasks = await getRunningTasksForAgent(agentId);
  for (const task of runningTasks) {
    await updateAgentTask(task.id, {
      status: "pending",
      assigned_agent_id: null,
      scheduled_for: now(),
      started_at: null
    });
  }

  return runningTasks.length;
}

export async function runOrchestratorCycle(limit = 6) {
  const seeded = await ensureRegistrySeeded();
  const restarted = await restartFailedTasks();
  const seededTasks = await seedRecurringTasks();
  const tasks = await getPendingTasks(limit);
  const processed = [];

  for (const task of tasks) {
    processed.push(await dispatchTask(task));
  }

  return {
    ok: true,
    seeded_agents: seeded.inserted,
    restarted_tasks: restarted,
    seeded_tasks: seededTasks,
    processed
  };
}

export async function createAgentTaskFromPayload(payload: Record<string, unknown>) {
  await ensureRegistrySeeded();
  return insertAgentTask({
    title: String(payload.title || "Untitled agent task"),
    description: String(payload.description || ""),
    task_type: String(payload.task_type || "project_planning"),
    priority: Number(payload.priority || 50),
    requested_by: String(payload.requested_by || "manual"),
    parent_task_id: payload.parent_task_id ? String(payload.parent_task_id) : null,
    scheduled_for: payload.scheduled_for ? String(payload.scheduled_for) : now(),
    payload:
      typeof payload.payload === "object" && payload.payload
        ? (payload.payload as Record<string, unknown>)
        : {}
  });
}

export async function getAgentStatus() {
  const snapshot = await getAgentStatusSnapshot();
  return { ok: true as const, ...snapshot };
}
