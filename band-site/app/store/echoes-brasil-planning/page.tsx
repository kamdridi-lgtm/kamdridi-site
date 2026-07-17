import { Metadata } from "next";
import { notFound } from "next/navigation";
import EchoesBrasilMarginPlanner from "@/components/echoes-brasil-margin-planner";

export const metadata: Metadata = {
  title: "ECHOES UN LIVE IN BRASIL - Internal Planning",
  description: "Internal cost and margin planner.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function EchoesBrasilPlanningPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_ECHOES_STORE_DRAFTS !== "true") {
    notFound();
  }

  return <EchoesBrasilMarginPlanner />;
}
