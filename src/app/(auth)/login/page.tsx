import { LoginForm } from "@/features/auth/login-form";
import { isSupabaseAuthEnabled } from "@/features/auth/access";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const params = await searchParams;
  return <LoginForm supabaseConfigured={isSupabaseAuthEnabled()} notice={params.notice ?? null} />;
}
