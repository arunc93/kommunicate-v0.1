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
    <div className="flex h-dvh flex-col overflow-hidden bg-surface md:flex-row">
      <Sidebar role={role} person={person} stub={stub} />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main className="min-h-0 min-w-0 flex-1 overflow-auto">
          <div className="mx-auto w-full max-w-[1180px] px-4 py-7 md:px-8 md:pb-12">
            <RoleProvider role={role} person={person}>
              {children}
            </RoleProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
