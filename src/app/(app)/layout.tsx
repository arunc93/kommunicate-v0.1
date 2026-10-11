import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import {
  STUB_PERSON_COOKIE,
  STUB_ROLE_COOKIE,
  isSupabaseAuthEnabled,
  parsePerson,
  parseRole,
} from "@/features/auth/access";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const configured = isSupabaseAuthEnabled();

  if (configured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
    if (!userId) redirect("/login");

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role")
      .eq("id", userId)
      .maybeSingle();
    const role = parseRole(profile && typeof profile.role === "string" ? profile.role : null);
    const person = profile && typeof profile.full_name === "string" ? profile.full_name : "";
    if (!role || !person) redirect("/login?notice=no-role");

    return (
      <DashboardLayout role={role} person={person} stub={false}>
        {children}
      </DashboardLayout>
    );
  }

  const jar = await cookies();
  const role = parseRole(jar.get(STUB_ROLE_COOKIE)?.value);
  const person = parsePerson(jar.get(STUB_PERSON_COOKIE)?.value);
  if (!role) redirect("/login");

  return (
    <DashboardLayout role={role} person={person} stub>
      {children}
    </DashboardLayout>
  );
}
