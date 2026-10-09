const { select } = require("./_lib/supabase-admin");

exports.handler = async () => {
  try {
    const [agents, tasks, runs, results] = await Promise.all([
      select("agent_registry", "select=*&order=is_chief.desc,name.asc"),
      select("agent_tasks", "select=id,title,task_type,status,priority,assigned_agent_id,created_at&order=created_at.desc&limit=30"),
      select("agent_runs", "select=id,task_id,agent_id,status,summary,created_at&order=created_at.desc&limit=30"),
      select("agent_results", "select=id,task_id,agent_id,result_type,summary,created_at&order=created_at.desc&limit=30")
    ]);

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ok: true,
        agents,
        tasks,
        runs,
        results
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
