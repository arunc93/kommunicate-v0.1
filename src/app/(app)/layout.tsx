import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  STUB_PERSON_COOKIE,
  STUB_ROLE_COOKIE,
  isSupabaseConfigured,
  parsePerson,
  parseRole,
} from "@/features/auth/access";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseConfigured();
  const jar = await cookies();
  const role = parseRole(jar.get(STUB_ROLE_COOKIE)?.value);
  const person = parsePerson(jar.get(STUB_PERSON_COOKIE)?.value);

  if (!configured && !role) redirect("/login");

  return (
    <DashboardLayout role={role ?? "lead"} person={person} stub={!configured}>
      {children}
    </DashboardLayout>
  );
}
