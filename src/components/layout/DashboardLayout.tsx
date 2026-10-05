import { Sidebar } from "./Sidebar";
import { RoleProvider } from "@/features/auth/role-context";
import type { AppRole } from "@/features/auth/access";

export function DashboardLayout({
  children,
  role,
  person,
  stub,
}: {
  children: React.ReactNode;
  role: AppRole;
  person: string;
  stub: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-surface md:flex-row">
      <Sidebar role={role} person={person} stub={stub} />
      <main className="min-w-0 flex-1 overflow-auto p-4 md:p-8">
        <RoleProvider role={role} person={person}>
          {children}
        </RoleProvider>
      </main>
    </div>
  );
}
