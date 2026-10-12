import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { STUB_ROLE_COOKIE, isSupabaseAuthEnabled, parseRole, type AppRole } from "@/features/auth/access";
import { createClient } from "@/lib/supabase/server";

export async function currentPreviewRole(): Promise<AppRole | null> {
  if (isSupabaseAuthEnabled()) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const userId = typeof data?.claims?.sub === "string" ? data.claims.sub : null;
    if (!userId) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .maybeSingle();
    return parseRole(profile && typeof profile.role === "string" ? profile.role : null);
  }

  const jar = await cookies();
  return parseRole(jar.get(STUB_ROLE_COOKIE)?.value);
}

export async function rejectUnlessLead(): Promise<NextResponse | null> {
  if ((await currentPreviewRole()) !== "lead") {
    return NextResponse.json({ error: "Only a lead can edit this." }, { status: 403 });
  }
  return null;
}

export async function rejectUnlessCommsOrLead(): Promise<NextResponse | null> {
  const role = await currentPreviewRole();
  if (role !== "lead" && role !== "comms") {
    return NextResponse.json({ error: "Only a lead or comms person can edit this." }, { status: 403 });
  }
  return null;
}
