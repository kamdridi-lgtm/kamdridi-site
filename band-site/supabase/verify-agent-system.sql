select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'fans',
    'press_contact',
    'festivals',
    'radios',
    'playlists',
    'outreach_emails',
    'agent_registry',
    'agent_tasks',
    'agent_runs',
    'agent_messages',
    'agent_metrics',
    'agent_results'
  )
order by table_name;

select count(*) as agent_count
from public.agent_registry;

select count(*) as pending_tasks
from public.agent_tasks
where status = 'pending';

select count(*) as completed_tasks
from public.agent_tasks
where status = 'completed';

select count(*) as stored_results
from public.agent_results;
