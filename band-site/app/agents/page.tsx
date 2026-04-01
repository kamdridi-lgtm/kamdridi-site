import { PageHero, Section } from "@/components/ui";
import { AgentConsole } from "@/app/agents/agent-console";
import { getAgentStatus } from "@/lib/agents/system";

export const metadata = {
  title: "Agents",
  description: "Autonomous agent operations layer for the KAMDRIDI site."
};

export default async function AgentsPage() {
  const status = await getAgentStatus();

  return (
    <>
      <PageHero
        eyebrow="Operations"
        title="KAMDRIDI agent system"
        description="Chief orchestrator, specialist agents, recurring tasks and local activation console for the recovered advanced site."
        image="/assets/images/band/live_stage.jpg"
      />
      <Section>
        <AgentConsole initialStatus={status} />
      </Section>
    </>
  );
}
