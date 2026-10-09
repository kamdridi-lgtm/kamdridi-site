import manifest from "@/ops/agent-manifest.json";
import type { AgentManifestEntry } from "@/lib/agents/types";

export const agentManifest = manifest as AgentManifestEntry[];
