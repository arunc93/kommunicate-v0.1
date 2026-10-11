import { LoginForm } from "@/features/auth/login-form";
import { isSupabaseAuthEnabled } from "@/features/auth/access";

export default function LoginPage() {
  return <LoginForm supabaseConfigured={isSupabaseAuthEnabled()} />;
}
