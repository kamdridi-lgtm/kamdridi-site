import type { Metadata } from "next";
import { LabelAdminDashboardV2 } from "@/label/admin/dashboard_v2";

export const metadata: Metadata = {
  title: "Label Admin",
  description: "Private KAMDRIDI RECORDS label dashboard."
};

export default function LabelAdminPage() {
  return (
    <main className="min-h-screen bg-[#050403] px-5 py-20 text-white">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Private Admin</p>
        <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] md:text-7xl">
          Label
          <br />
          Dashboard
        </h1>
        <div className="mt-10">
          <LabelAdminDashboardV2 />
        </div>
      </div>
    </main>
  );
}
