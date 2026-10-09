import { redirect } from "next/navigation";
import { requireLabelAdmin } from "@/lib/label-auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    await requireLabelAdmin();
  } catch (error) {
    // If not logged in as admin, redirect to the login page
    redirect("/label/system-access");
  }

  return (
    <>
      {children}
    </>
  );
}
