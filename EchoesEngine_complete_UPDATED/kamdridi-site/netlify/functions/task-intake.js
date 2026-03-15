const { insert } = require("./_lib/supabase-admin");
const { ensureRegistrySeeded } = require("./_lib/agents");

exports.handler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, headers: { Allow: "POST" }, body: "Method Not Allowed" };
    }

    await ensureRegistrySeeded();
    const payload = JSON.parse(event.body || "{}");
    const [task] = await insert("agent_tasks", {
      title: payload.title || "Untitled agent task",
      description: payload.description || "",
      task_type: payload.task_type || "project_planning",
      priority: Number(payload.priority || 50),
      requested_by: payload.requested_by || "manual",
      parent_task_id: payload.parent_task_id || null,
      scheduled_for: payload.scheduled_for || new Date().toISOString(),
      payload: payload.payload || {}
    });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true, task })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: false, error: error.message })
    };
  }
};
