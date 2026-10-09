export type AgentManifestEntry = {
  id: string;
  name: string;
  group: string;
  description: string;
  isChief?: boolean;
};

export type AgentRegistryRecord = {
  id: string;
  name: string;
  agent_group: string;
  description: string;
  is_chief: boolean;
  status: string;
  autonomy_mode: string;
  restart_count: number;
  last_seen: string | null;
  created_at: string;
};

export type AgentTaskRecord = {
  id: string;
  title: string;
  description: string;
  task_type: string;
  status: string;
  priority: number;
  requested_by: string;
  assigned_agent_id: string | null;
  parent_task_id: string | null;
  payload: Record<string, unknown>;
  result: Record<string, unknown> | null;
  retry_count: number;
  scheduled_for: string;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
};

export type AgentRunRecord = {
  id: string;
  task_id: string;
  agent_id: string;
  status: string;
  summary: string;
  log_entries: unknown[];
  created_at: string;
  updated_at: string;
};

export type AgentMessageRecord = {
  id: string;
  from_agent_id: string;
  to_agent_id: string;
  task_id: string | null;
  message_type: string;
  content: Record<string, unknown>;
  created_at: string;
};

export type AgentMetricRecord = {
  id: string;
  metric_name: string;
  metric_value: number | null;
  metric_payload: Record<string, unknown>;
  captured_at: string;
};

export type AgentResultRecord = {
  id: string;
  task_id: string | null;
  agent_id: string;
  result_type: string;
  summary: string;
  payload: Record<string, unknown>;
  created_at: string;
};

export type FanLeadRecord = {
  id: string;
  email: string;
  name: string;
  country: string | null;
  created_at: string;
};

export type FestivalRecord = {
  id: string;
  festival_name: string;
  email: string | null;
  country: string | null;
  submission_deadline: string | null;
  sent: boolean;
  created_at: string;
};

export type PressContactRecord = {
  id: string;
  media_name: string;
  email: string | null;
  country: string | null;
  sent: boolean;
  created_at: string;
};

export type RadioRecord = {
  id: string;
  name: string;
  email: string | null;
  country: string | null;
  genre: string | null;
  notes: string | null;
  source: string | null;
  sent: boolean;
  created_at: string;
};

export type PlaylistRecord = {
  id: string;
  name: string;
  curator_name: string | null;
  email: string | null;
  country: string | null;
  platform: string;
  url: string | null;
  notes: string | null;
  sent: boolean;
  created_at: string;
};

export type OutreachEmailRecord = {
  id: string;
  lead_type: string;
  lead_id: string | null;
  recipient_email: string;
  recipient_name: string | null;
  subject: string;
  body: string;
  status: string;
  source_agent_id: string | null;
  source_task_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type AgentSystemState = {
  agent_registry: AgentRegistryRecord[];
  agent_tasks: AgentTaskRecord[];
  agent_runs: AgentRunRecord[];
  agent_messages: AgentMessageRecord[];
  agent_metrics: AgentMetricRecord[];
  agent_results: AgentResultRecord[];
  fans: FanLeadRecord[];
  festivals: FestivalRecord[];
  press_contact: PressContactRecord[];
  radios: RadioRecord[];
  playlists: PlaylistRecord[];
  outreach_emails: OutreachEmailRecord[];
};

export type AgentStatusPayload = {
  ok: true;
  agents: AgentRegistryRecord[];
  tasks: AgentTaskRecord[];
  runs: AgentRunRecord[];
  results: AgentResultRecord[];
};
