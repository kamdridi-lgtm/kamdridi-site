create extension if not exists pgcrypto;

create table if not exists public.agent_registry (
  id text primary key,
  name text not null,
  agent_group text not null,
  description text not null,
  is_chief boolean not null default false,
  status text not null default 'idle',
  autonomy_mode text not null default 'autonomous',
  restart_count integer not null default 0,
  last_seen timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  task_type text not null,
  status text not null default 'pending',
  priority integer not null default 50,
  requested_by text not null default 'system',
  assigned_agent_id text references public.agent_registry(id),
  parent_task_id uuid references public.agent_tasks(id) on delete set null,
  payload jsonb not null default '{}'::jsonb,
  result jsonb,
  retry_count integer not null default 0,
  scheduled_for timestamptz not null default now(),
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_runs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.agent_tasks(id) on delete cascade,
  agent_id text not null references public.agent_registry(id),
  status text not null default 'running',
  summary text,
  log_entries jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.agent_messages (
  id uuid primary key default gen_random_uuid(),
  from_agent_id text not null references public.agent_registry(id),
  to_agent_id text not null references public.agent_registry(id),
  task_id uuid references public.agent_tasks(id) on delete set null,
  message_type text not null default 'handoff',
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.agent_metrics (
  id uuid primary key default gen_random_uuid(),
  metric_name text not null,
  metric_value numeric,
  metric_payload jsonb not null default '{}'::jsonb,
  captured_at timestamptz not null default now()
);

create table if not exists public.agent_results (
  id uuid primary key default gen_random_uuid(),
  task_id uuid references public.agent_tasks(id) on delete set null,
  agent_id text not null references public.agent_registry(id),
  result_type text not null default 'summary',
  summary text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.radios (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text,
  country text,
  genre text,
  notes text,
  source text,
  sent boolean not null default false
);

create table if not exists public.playlists (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  curator_name text,
  email text,
  country text,
  platform text not null default 'spotify',
  url text,
  notes text,
  sent boolean not null default false
);

create table if not exists public.outreach_emails (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lead_type text not null,
  lead_id text,
  recipient_email text not null,
  recipient_name text,
  subject text not null,
  body text not null,
  status text not null default 'draft',
  source_agent_id text references public.agent_registry(id),
  source_task_id uuid references public.agent_tasks(id) on delete set null,
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists idx_agent_tasks_status_priority
on public.agent_tasks(status, priority desc, scheduled_for asc);

create index if not exists idx_agent_tasks_assigned_agent
on public.agent_tasks(assigned_agent_id, status);

create index if not exists idx_agent_runs_agent_created_at
on public.agent_runs(agent_id, created_at desc);

create index if not exists idx_agent_results_task_created_at
on public.agent_results(task_id, created_at desc);

create index if not exists idx_outreach_emails_status_created_at
on public.outreach_emails(status, created_at desc);

alter table public.agent_registry enable row level security;
alter table public.agent_tasks enable row level security;
alter table public.agent_runs enable row level security;
alter table public.agent_messages enable row level security;
alter table public.agent_metrics enable row level security;
alter table public.agent_results enable row level security;
alter table public.radios enable row level security;
alter table public.playlists enable row level security;
alter table public.outreach_emails enable row level security;

drop policy if exists "service_role_all_agent_registry" on public.agent_registry;
create policy "service_role_all_agent_registry"
on public.agent_registry for all to service_role
using (true) with check (true);

drop policy if exists "service_role_all_agent_tasks" on public.agent_tasks;
create policy "service_role_all_agent_tasks"
on public.agent_tasks for all to service_role
using (true) with check (true);

drop policy if exists "service_role_all_agent_runs" on public.agent_runs;
create policy "service_role_all_agent_runs"
on public.agent_runs for all to service_role
using (true) with check (true);

drop policy if exists "service_role_all_agent_messages" on public.agent_messages;
create policy "service_role_all_agent_messages"
on public.agent_messages for all to service_role
using (true) with check (true);

drop policy if exists "service_role_all_agent_metrics" on public.agent_metrics;
create policy "service_role_all_agent_metrics"
on public.agent_metrics for all to service_role
using (true) with check (true);

drop policy if exists "service_role_all_agent_results" on public.agent_results;
create policy "service_role_all_agent_results"
on public.agent_results for all to service_role
using (true) with check (true);

drop policy if exists "service_role_all_radios" on public.radios;
create policy "service_role_all_radios"
on public.radios for all to service_role
using (true) with check (true);

drop policy if exists "service_role_all_playlists" on public.playlists;
create policy "service_role_all_playlists"
on public.playlists for all to service_role
using (true) with check (true);

drop policy if exists "service_role_all_outreach_emails" on public.outreach_emails;
create policy "service_role_all_outreach_emails"
on public.outreach_emails for all to service_role
using (true) with check (true);
