import type { Metadata } from "next";
import { CommandCenter } from "@/components/echoes/command-center";


export const metadata: Metadata = {
  title: "Echoes Command Center",
  description: "Unified AI orchestrator and radar."
};

export const dynamic = "force-dynamic";

export default function AgentsPage() {
  return (
    <CommandCenter />
  );
}
