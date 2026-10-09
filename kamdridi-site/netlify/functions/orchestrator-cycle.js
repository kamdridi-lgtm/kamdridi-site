const { select } = require("./_lib/supabase-admin");
const {
  ensureRegistrySeeded,
  dispatchTask,
  restartFailedTasks,
  seedRecurringTasks
} = require("./_lib/agents");

exports.config = {
  schedule: "*/5 * * * *"
};

exports.handler = async () => {
  try {
    const seeded = await ensureRegistrySeeded();
    const restarted = await restartFailedTasks();
    const seededTasks = await seedRecurringTasks();

    const tasks = await select(
      "agent_tasks",
      `select=*&status=eq.pending&scheduled_for=lte.${encodeURIComponent(new Date().toISOString())}&order=priority.desc,scheduled_for.asc&limit=6`
    );

    const processed = [];
    for (const task of tasks) {
      processed.push(await dispatchTask(task));
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        seeded_agents: seeded.inserted,
        restarted_tasks: restarted,
        seeded_tasks: seededTasks,
        processed
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: false,
        error: error.message
      })
    };
  }
};
