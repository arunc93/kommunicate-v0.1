import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { STUB_ROLE_COOKIE, homeForRole, parseRole } from "@/features/auth/access";

export default async function RootPage() {
  const jar = await cookies();
  const role = parseRole(jar.get(STUB_ROLE_COOKIE)?.value);
  redirect(role ? homeForRole(role) : "/login");
}
