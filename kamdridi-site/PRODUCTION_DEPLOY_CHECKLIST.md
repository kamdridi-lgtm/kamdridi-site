# KAMDRIDI Production Deploy Checklist

This checklist activates the autonomous multi-agent system in production without changing the public site design.

## 1. Supabase

Run these files in the Supabase SQL editor, in this order:

1. `supabase/multi-agent-system.sql`
2. `supabase/verify-agent-system.sql`

Expected result:

- existing tables available: `fans`, `press_contact`, `festivals`
- new tables available: `radios`, `playlists`, `outreach_emails`, `agent_registry`, `agent_tasks`, `agent_runs`, `agent_messages`, `agent_metrics`, `agent_results`

## 2. Netlify Environment Variables

Set these production environment variables:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`

## 3. Scheduled Orchestrator

The autonomous cycle is configured in:

- `netlify/functions/orchestrator-cycle.js`

Schedule:

- every 5 minutes

## 4. Deploy

Deploy the site to Netlify after environment variables are saved.

## 5. Smoke Test

Run these checks after deployment:

1. `POST /.netlify/functions/task-intake` with a `festival_research` task
2. `GET /.netlify/functions/orchestrator-cycle`
3. `GET /.netlify/functions/agent-status`
4. Confirm new rows appear in:
   - `agent_tasks`
   - `agent_runs`
   - `agent_results`
   - `festivals` or another lead table
   - `outreach_emails`

## 6. Full Cycle Confirmation

The production cycle is healthy when this chain succeeds:

`task -> orchestrator -> specialist agent -> Supabase storage -> follow-up task -> outreach draft -> agent results`
