import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { STUB_ROLE_COOKIE, parseRole, type AppRole } from "@/features/auth/access";

export async function currentPreviewRole(): Promise<AppRole | null> {
  const jar = await cookies();
  return parseRole(jar.get(STUB_ROLE_COOKIE)?.value);
}

export async function rejectUnlessLead(): Promise<NextResponse | null> {
  if ((await currentPreviewRole()) !== "lead") {
    return NextResponse.json({ error: "Only a lead can edit this." }, { status: 403 });
  }
  return null;
}
