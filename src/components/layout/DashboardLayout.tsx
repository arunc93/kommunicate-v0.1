import { Sidebar } from "./Sidebar";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto bg-[#f8f9fa]">{children}</main>
    </div>
  );
}
