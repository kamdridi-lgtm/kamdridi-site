const fs = require("node:fs");
const path = require("node:path");
const { select, insert, update, encodeFilter } = require("./supabase-admin");

const manifestPath = path.resolve(__dirname, "..", "..", "..", "ops", "agent-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const AGENT_FOR_TASK = {
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
  analytics: "analytics_agent"
};

function getManifest() {
  return manifest;
}

function normalizeDate(value) {
  const trimmed = String(value || "").trim();
  return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
}

function uniqueBy(items, key) {
  const seen = new Set();
  return items.filter((item) => {
    const value = item[key];
    if (!value || seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

async function ensureRegistrySeeded() {
  const existing = await select("agent_registry", "select=id");
  const existingIds = new Set(existing.map((item) => item.id));
  const missing = manifest.filter((agent) => !existingIds.has(agent.id));
  if (!missing.length) return { inserted: 0 };

  await insert(
    "agent_registry",
    missing.map((agent) => ({
      id: agent.id,
      name: agent.name,
      agent_group: agent.group,
      description: agent.description,
      is_chief: Boolean(agent.isChief),
      status: "idle",
      autonomy_mode: "autonomous"
    }))
  );

  return { inserted: missing.length };
}

function chooseAgent(taskType) {
  return AGENT_FOR_TASK[taskType] || "project_manager_agent";
}

function buildMessages(task, agentId, result) {
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

async function createFollowUpTasks(task, result) {
  const tasks = [];

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

  if (tasks.length) {
    await insert("agent_tasks", tasks);
  }

  return tasks;
}

async function createRun(taskId, agentId) {
  const [run] = await insert("agent_runs", {
    task_id: taskId,
    agent_id: agentId,
    status: "running",
    summary: "",
    log_entries: []
  });
  return run;
}

async function finishRun(runId, summary, status) {
  return update("agent_runs", [encodeFilter("id", "eq", runId)], {
    status,
    summary,
    updated_at: new Date().toISOString()
  });
}

async function touchAgent(agentId, status, incrementRestart = false) {
  let payload = {
    status,
    last_seen: new Date().toISOString()
  };

  if (incrementRestart) {
    const [agent] = await select("agent_registry", `select=restart_count&id=eq.${encodeURIComponent(agentId)}`);
    payload.restart_count = (agent?.restart_count || 0) + 1;
  }

  return update("agent_registry", [encodeFilter("id", "eq", agentId)], payload);
}

async function markTask(taskId, payload) {
  return update("agent_tasks", [encodeFilter("id", "eq", taskId)], payload);
}

async function storeAgentResult(task, agentId, result) {
  return insert("agent_results", {
    task_id: task.id,
    agent_id: agentId,
    result_type: task.task_type,
    summary: result.summary,
    payload: result
  });
}

async function persistFestivals(leads) {
  const rows = uniqueBy(
    leads
      .map((lead) => ({
        festival_name: lead.festival_name || lead.name || lead.title,
        email: lead.email || null,
        country: lead.country || null,
        submission_deadline: normalizeDate(lead.submission_deadline),
        sent: Boolean(lead.sent)
      }))
      .filter((lead) => lead.festival_name),
    "festival_name"
  );

  if (rows.length) {
    await insert("festivals", rows);
  }

  return rows.length;
}

async function persistPressContacts(opportunities) {
  const rows = [];
  const seen = new Set();

  opportunities
    .map((item) => ({
      email: item.email || null,
      media_name: item.media_name || item.name || item.publication,
      country: item.country || null,
      sent: Boolean(item.sent)
    }))
    .filter((item) => item.media_name || item.email)
    .forEach((item) => {
      const dedupeKey = item.email || item.media_name;
      if (!dedupeKey || seen.has(dedupeKey)) return;
      seen.add(dedupeKey);
      rows.push(item);
    });

  if (rows.length) {
    await insert("press_contact", rows);
  }

  return rows.length;
}

async function persistRadios(opportunities) {
  const rows = uniqueBy(
    opportunities
      .map((item) => ({
        name: item.name || item.radio_name,
        email: item.email || null,
        country: item.country || null,
        genre: item.genre || "rock",
        notes: item.notes || null,
        source: item.source || "agent",
        sent: Boolean(item.sent)
      }))
      .filter((item) => item.name),
    "name"
  );

  if (rows.length) {
    await insert("radios", rows);
  }

  return rows.length;
}

async function persistPlaylists(opportunities) {
  const rows = uniqueBy(
    opportunities
      .map((item) => ({
        name: item.name || item.playlist_name,
        curator_name: item.curator_name || item.curator || null,
        email: item.email || null,
        country: item.country || null,
        platform: item.platform || "spotify",
        url: item.url || null,
        notes: item.notes || null,
        sent: Boolean(item.sent)
      }))
      .filter((item) => item.name),
    "name"
  );

  if (rows.length) {
    await insert("playlists", rows);
  }

  return rows.length;
}

async function persistFans(leads) {
  const rows = uniqueBy(
    leads
      .map((item) => ({
        email: item.email || null,
        name: item.name || item.full_name || "Fan lead",
        country: item.country || null
      }))
      .filter((item) => item.email),
    "email"
  );

  if (rows.length) {
    await insert("fans", rows);
  }

  return rows.length;
}

async function buildOutreachRows(task, agentId, sourceType) {
  const sourceMap = {
    festival_research: { table: "festivals", email: "email", name: "festival_name", leadType: "festival" },
    press_research: { table: "press_contact", email: "email", name: "media_name", leadType: "press" },
    radio_research: { table: "radios", email: "email", name: "name", leadType: "radio" },
    playlist_research: { table: "playlists", email: "email", name: "name", leadType: "playlist" }
  };

  const source = sourceMap[sourceType];
  if (!source) return [];

  const leads = await select(source.table, "select=*&sent=eq.false&limit=10");
  return leads
    .filter((lead) => lead[source.email])
    .map((lead) => ({
      lead_type: source.leadType,
      lead_id: lead.id,
      recipient_email: lead[source.email],
      recipient_name: lead[source.name] || "Contact",
      subject: `KAM DRIDI - ${source.leadType} outreach`,
      body: `Hello ${lead[source.name] || "team"},\n\nWe would like to introduce KAM DRIDI and the Echoes Unearthed campaign.\n\nThis draft was prepared by the autonomous outreach system and can be refined before sending.`,
      status: "draft",
      source_agent_id: agentId,
      source_task_id: task.id,
      metadata: {
        source_table: source.table,
        source_type: sourceType
      }
    }));
}

async function persistOutreach(task, agentId, result) {
  const rows = result.emails || [];
  if (!rows.length) return 0;
  await insert("outreach_emails", rows);
  return rows.length;
}

async function persistTaskArtifacts(task, agentId, result) {
  let stored = 0;

  if (task.task_type === "festival_research") {
    stored += await persistFestivals(result.leads || []);
  }

  if (task.task_type === "press_research") {
    stored += await persistPressContacts(result.opportunities || []);
  }

  if (task.task_type === "radio_research") {
    stored += await persistRadios(result.opportunities || []);
  }

  if (task.task_type === "playlist_research") {
    stored += await persistPlaylists(result.opportunities || []);
  }

  if (task.task_type === "fan_growth") {
    stored += await persistFans(result.fans || []);
  }

  if (task.task_type === "outreach_email") {
    stored += await persistOutreach(task, agentId, result);
  }

  if (task.task_type === "analytics" && result.metric_name) {
    await insert("agent_metrics", {
      metric_name: result.metric_name,
      metric_value: result.metric_value || null,
      metric_payload: result.metric_payload || {}
    });
    stored += 1;
  }

  return stored;
}

async function runSpecialist(task, agentId) {
  const payload = task.payload || {};
  const baseSummary = `${agentId} processed ${task.task_type}`;

  const handlers = {
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
      opportunities: payload.seed_opportunities || [],
      next_actions: ["Store radios in Supabase", "Queue outreach drafts"]
    }),
    festival_finder_agent: async () => ({
      summary: `${baseSummary} and prepared festival leads for follow-up.`,
      leads: payload.seed_leads || [],
      next_actions: ["Persist festivals", "Trigger outreach drafting"]
    }),
    press_finder_agent: async () => ({
      summary: `${baseSummary} and prepared editorial targets.`,
      opportunities: payload.seed_opportunities || [],
      next_actions: ["Normalize press contacts", "Prepare personalized messaging"]
    }),
    playlist_finder_agent: async () => ({
      summary: `${baseSummary} and prepared playlist curator targets.`,
      opportunities: payload.seed_opportunities || [],
      next_actions: ["Store playlist leads", "Queue outreach sequences"]
    }),
    email_outreach_agent: async () => {
      const sourceType = payload.source_type || "festival_research";
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
      fans: payload.seed_fans || [],
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
    })
  };

  const handler = handlers[agentId] || handlers.project_manager_agent;
  return handler();
}

async function dispatchTask(task) {
  const agentId = chooseAgent(task.task_type);
  const run = await createRun(task.id, agentId);

  await markTask(task.id, {
    assigned_agent_id: agentId,
    status: "running",
    started_at: new Date().toISOString()
  });

  await touchAgent(agentId, "busy");

  try {
    const result = await runSpecialist(task, agentId);
    const stored_records = await persistTaskArtifacts(task, agentId, result);
    result.stored_records = stored_records;

    const messages = buildMessages(task, agentId, result);
    const nextTasks = await createFollowUpTasks(task, result);

    if (messages.length) {
      await insert("agent_messages", messages);
    }

    await storeAgentResult(task, agentId, result);
    await markTask(task.id, {
      status: "completed",
      completed_at: new Date().toISOString(),
      result
    });
    await finishRun(run.id, result.summary, "completed");
    await touchAgent(agentId, "idle");

    return {
      task_id: task.id,
      agent_id: agentId,
      summary: result.summary,
      spawned_tasks: nextTasks.length,
      stored_records
    };
  } catch (error) {
    await storeAgentResult(task, agentId, { error: error.message });
    await markTask(task.id, {
      status: "failed",
      result: { error: error.message }
    });
    await finishRun(run.id, error.message, "failed");
    await touchAgent(agentId, "error");
    throw error;
  }
}

async function restartFailedTasks(limit = 5) {
  const failed = await select(
    "agent_tasks",
    `select=*&status=eq.failed&retry_count=lt.3&order=created_at.asc&limit=${limit}`
  );

  for (const task of failed) {
    await update("agent_tasks", [encodeFilter("id", "eq", task.id)], {
      status: "pending",
      retry_count: (task.retry_count || 0) + 1,
      scheduled_for: new Date().toISOString()
    });
    if (task.assigned_agent_id) {
      await touchAgent(task.assigned_agent_id, "idle", true);
    }
  }

  return failed.length;
}

async function seedRecurringTasks() {
  const existing = await select(
    "agent_tasks",
    "select=id,task_type,status&status=in.(pending,running)&limit=200"
  );

  const activeTypes = new Set(existing.map((task) => task.task_type));
  const seeds = [];
  const recurring = [
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
    }
  ];

  recurring.forEach((item) => {
    if (!activeTypes.has(item.task_type)) {
      seeds.push({
        ...item,
        requested_by: "orchestrator_agent"
      });
    }
  });

  if (seeds.length) {
    await insert("agent_tasks", seeds);
  }

  return seeds.length;
}

module.exports = {
  getManifest,
  ensureRegistrySeeded,
  chooseAgent,
  dispatchTask,
  restartFailedTasks,
  seedRecurringTasks
};
