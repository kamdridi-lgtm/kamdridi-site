# KAMDRIDI Multi-Agent System

This project now includes an autonomous multi-agent operations layer around the site. The site design and artistic direction remain untouched. The automation layer lives in Supabase plus Netlify Functions.

## Topology

- 1 chief agent
  - `orchestrator_agent`
- 20 specialist agents
  - leadership, development, backend, research, outreach, content, analytics

All communication goes through the orchestrator. No specialist agent directly coordinates with another specialist outside the orchestrator message bus.

## Core Files

- `ops/agent-manifest.json`
- `supabase/multi-agent-system.sql`
- `netlify/functions/orchestrator-cycle.js`
- `netlify/functions/task-intake.js`
- `netlify/functions/agent-status.js`
- `netlify/functions/agent-reset.js`
- `netlify/functions/_lib/supabase-admin.js`
- `netlify/functions/_lib/agents.js`

## Environment Variables

Set these in Netlify:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

The multi-agent backend uses `SUPABASE_SERVICE_ROLE_KEY` for orchestration writes. The site frontend should continue using the anon key only where needed.

## Supabase Setup

Run `supabase/multi-agent-system.sql` in the Supabase SQL editor.

This creates:

- `agent_registry`
- `agent_tasks`
- `agent_runs`
- `agent_messages`
- `agent_metrics`
- `agent_results`
- `radios`
- `playlists`
- `outreach_emails`

The system also writes directly into your existing Supabase tables:

- `fans`
- `press_contact`
- `festivals`

## 24/7 Operation

The orchestrator is implemented as a Netlify scheduled function:

- `orchestrator-cycle`
- schedule: every 5 minutes

Each cycle:

1. Seeds missing agents into `agent_registry`
2. Restarts failed tasks up to the retry limit
3. Seeds recurring autonomous tasks if the queue is empty for those categories
4. Dispatches due pending tasks to the correct specialist agent
5. Stores runs, messages, results, and follow-up tasks in Supabase

## Task Flow

`task -> orchestrator -> specialist agent -> result -> verification -> next task`

Specialist results can spawn new tasks. Example:

1. `festival_research`
2. orchestrator assigns `festival_finder_agent`
3. results spawn:
   - `outreach_email`
4. festival leads are stored in `festivals`
5. orchestrator routes `outreach_email` to `email_outreach_agent`
6. outreach drafts are stored in `outreach_emails`

## Manual Endpoints

- `POST /.netlify/functions/task-intake`
  - creates a new orchestrated task
- `GET /.netlify/functions/agent-status`
  - returns registry, recent tasks, recent runs, and recent results
- `POST /.netlify/functions/agent-reset`
  - resets an agent to idle and requeues its running tasks
- `GET /.netlify/functions/orchestrator-cycle`
  - can be invoked manually in addition to scheduled execution

## Example Intake Payload

```json
{
  "title": "Find festivals for War Machines campaign",
  "description": "Target EU and North American heavy festivals",
  "task_type": "festival_research",
  "priority": 90,
  "requested_by": "manual",
  "payload": {
    "territories": ["EU", "North America"],
    "era": "Echoes Unearthed"
  }
}
```

## Notes

- This system is autonomous in orchestration and lifecycle, but specialist intelligence still depends on what data sources, APIs, and outbound services you connect.
- Research and outreach agents are now wired to persist opportunities into Supabase-compatible tables so the orchestrator can continue the chain automatically.
- No frontend redesign or visual identity change was introduced.
- The current specialist handlers are structured to support continuous operation and handoff logic. You can later plug real data providers, LLM reasoning, email providers, or analytics services into the same flow without changing the website artistic layer.
