"use server";

import { parseRole, type AppRole } from "@/features/auth/access";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function signUpWithRole(input: {
  email: string;
  password: string;
  role: string;
}): Promise<{ role: AppRole } | { error: string }> {
  const email = input.email.trim().toLowerCase();
  const role = parseRole(input.role);
  if (!email.includes("@") || !input.password) {
    return { error: "Enter your email and password." };
  }
  if (!role) return { error: "Choose Stakeholder, Comms, or Lead." };

  const admin = createServiceClient();
  const created = await admin.auth.admin.createUser({
    email,
    password: input.password,
    email_confirm: true,
    user_metadata: { role },
  });
  if (created.error || !created.data.user) {
    const message = created.error?.message ?? "Could not create the account.";
    if (message.toLowerCase().includes("already")) {
      return { error: "That email is already registered. Log in instead." };
    }
    return { error: message };
  }

  const supabase = await createClient();
  const signed = await supabase.auth.signInWithPassword({
    email,
    password: input.password,
  });
  if (signed.error) return { error: signed.error.message };
  return { role };
}
