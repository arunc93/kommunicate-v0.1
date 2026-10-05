import { LoginForm } from "@/features/auth/login-form";
import { isSupabaseConfigured } from "@/features/auth/access";

export default function LoginPage() {
  return <LoginForm supabaseConfigured={isSupabaseConfigured()} />;
}
