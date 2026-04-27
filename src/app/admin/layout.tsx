import { DashboardSidebar } from "@/components/DashboardSidebar";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  if (!sessionCookie) { redirect("/login"); }
  try {
    const claims = await adminAuth.verifySessionCookie(sessionCookie, true);
    if (!claims.admin) { redirect("/dashboard"); }
  } catch (error) { redirect("/login"); }
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar isAdminView={true} userHasAdminPrivileges={true} />
      <main className="flex-1 overflow-y-auto"><div className="h-full p-8 max-w-7xl mx-auto">{children}</div></main>
    </div>
  );
}
