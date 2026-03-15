const { select, update, encodeFilter } = require("./_lib/supabase-admin");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, headers: { Allow: "POST" }, body: "Method Not Allowed" };
    }

    const payload = JSON.parse(event.body || "{}");
    if (!payload.agent_id) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ok: false, error: "agent_id is required" })
      };
    }

    const [agent] = await select(
      "agent_registry",
      `select=id,restart_count&id=eq.${encodeURIComponent(payload.agent_id)}&limit=1`
    );

    await update("agent_registry", [encodeFilter("id", "eq", payload.agent_id)], {
      status: "idle",
      last_seen: new Date().toISOString(),
      restart_count: (agent?.restart_count || 0) + 1
    });

    const runningTasks = await select(
      "agent_tasks",
      `select=id,status&assigned_agent_id=eq.${encodeURIComponent(payload.agent_id)}&status=eq.running&limit=20`
    );

    for (const task of runningTasks) {
      await update("agent_tasks", [encodeFilter("id", "eq", task.id)], {
        status: "pending",
        assigned_agent_id: null,
        scheduled_for: new Date().toISOString(),
        started_at: null
      });
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        agent_id: payload.agent_id,
        requeued_tasks: runningTasks.length
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: error.message })
    };
  }
};
