import { DashboardSidebar } from "@/components/DashboardSidebar";
import { cookies } from "next/headers";
import { adminAuth } from "@/lib/firebase-admin";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("session")?.value;
  let userHasAdminPrivileges = false;
  if (sessionCookie) {
    try {
      const claims = await adminAuth.verifySessionCookie(sessionCookie, true);
      userHasAdminPrivileges = !!claims.admin;
    } catch (error) { console.error("Session verification failed", error); }
  }
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <DashboardSidebar isAdminView={false} userHasAdminPrivileges={userHasAdminPrivileges} />
      <main className="flex-1 overflow-y-auto"><div className="h-full p-8 max-w-7xl mx-auto">{children}</div></main>
    </div>
  );
}
