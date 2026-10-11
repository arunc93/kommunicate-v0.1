"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  STUB_PERSON_COOKIE,
  STUB_ROLE_COOKIE,
  type AppRole,
  type PreviewPerson,
  homeForRole,
  parsePerson,
  parseRole,
} from "@/features/auth/access";
import { clearStubSession, readStubCookie, writeStubSession } from "@/features/auth/stub-session";
import { signUpWithRole } from "@/features/auth/sign-up";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: { value: AppRole; label: string; detail: string }[] = [
  { value: "stakeholder", label: "Stakeholder", detail: "Raise and track your own requests" },
  { value: "comms", label: "Comms", detail: "Work the shared queue" },
  { value: "lead", label: "Lead", detail: "Assign, prioritise, read the desk" },
];

const NO_ROLE = "This account has no desk role yet.";

export function LoginForm({
  supabaseConfigured,
  notice,
}: {
  supabaseConfigured: boolean;
  notice?: string | null;
}) {
  const router = useRouter();
  const [role, setRole] = useState<AppRole>("lead");
  const [signupRole, setSignupRole] = useState<AppRole>("stakeholder");
  const [person, setPerson] = useState<PreviewPerson>("Chacko, Arun");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(notice === "no-role" ? NO_ROLE : null);
  const [pending, setPending] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");

  useEffect(() => {
    if (supabaseConfigured) return;
    const savedRole = parseRole(readStubCookie(STUB_ROLE_COOKIE));
    if (savedRole) setRole(savedRole);
    setPerson(parsePerson(readStubCookie(STUB_PERSON_COOKIE)));
  }, [supabaseConfigured]);

  const loginPreview = () => {
    writeStubSession(role, person);
    router.push(homeForRole(role));
    router.refresh();
  };

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !password) {
      setError("Enter your email and password.");
      return;
    }

    setPending(true);
    setError(null);
    const supabase = createClient();
    const { data, error: signError } = await supabase.auth.signInWithPassword({
      email: trimmed,
      password,
    });
    if (signError || !data.user) {
      setPending(false);
      setError(signError?.message ?? "Could not sign in.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .maybeSingle();
    const nextRole = parseRole(profile && typeof profile.role === "string" ? profile.role : null);
    if (!nextRole) {
      await supabase.auth.signOut();
      setPending(false);
      setError(NO_ROLE);
      return;
    }

    clearStubSession();
    router.push(homeForRole(nextRole));
    router.refresh();
  };

  const signUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !password) {
      setError("Enter your email and password.");
      return;
    }

    setPending(true);
    setError(null);
    const result = await signUpWithRole({ email: trimmed, password, role: signupRole });
    if ("error" in result) {
      setPending(false);
      setError(result.error);
      return;
    }

    clearStubSession();
    router.push(homeForRole(result.role));
    router.refresh();
  };

  const showMode = (next: "login" | "signup") => {
    setMode(next);
    setError(null);
  };

  return (
    <div className="login-brand flex min-h-dvh flex-col items-center px-8 py-10 text-center md:px-16 md:py-12">
      <div className="flex w-full max-w-[440px] flex-col items-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-white">KGS Consulting</p>
        <h1 className="mt-4 text-5xl font-semibold leading-none tracking-[-0.03em]">Kommunicate</h1>
        <p className="mt-4 max-w-[360px] text-sm leading-relaxed text-white/75">
          The desk for briefs, reviews, and delivery. One queue for stakeholders, comms, and leads.
        </p>
        <div className="panel mt-8 w-full rounded-[24px] p-7">
          <p className="kicker">{supabaseConfigured && mode === "signup" ? "Sign up" : "Sign in"}</p>
          <h2 className="mt-1.5 text-2xl font-semibold leading-8 text-text">
            {supabaseConfigured && mode === "signup" ? "Create your account" : "Welcome back"}
          </h2>

          {supabaseConfigured ? (
            <form className="mt-4 text-left" onSubmit={mode === "signup" ? signUp : login}>
              <Input
                label="Email"
                type="email"
                autoComplete={mode === "signup" ? "email" : "username"}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <div className="mt-3">
                <Input
                  label="Password"
                  type="password"
                  autoComplete={mode === "signup" ? "new-password" : "current-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              {mode === "signup" ? (
                <div className="mt-4 flex flex-col gap-2">
                  {ROLE_OPTIONS.map((option) => {
                    const selected = signupRole === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        className={cn("choice justify-start text-left", selected && "on")}
                        aria-pressed={selected}
                        onClick={() => setSignupRole(option.value)}
                      >
                        <span
                          className={cn("h-2.5 w-2.5 shrink-0 rounded-full bg-border", selected && "bg-cobalt")}
                        />
                        <span>
                          <b className="block text-sm text-text">{option.label}</b>
                          <span className="block text-xs text-text-muted">{option.detail}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
              {error ? <p className="mt-3 text-sm text-error">{error}</p> : null}
              <Button className="mt-5 w-full justify-center" size="lg" type="submit" disabled={pending}>
                {pending ? (mode === "signup" ? "Creating account" : "Signing in") : mode === "signup" ? "Sign up" : "Login"}
              </Button>
              <button
                type="button"
                className="mt-4 w-full text-center text-sm font-semibold text-cobalt"
                onClick={() => showMode(mode === "signup" ? "login" : "signup")}
              >
                {mode === "signup" ? "Log in" : "Sign up"}
              </button>
            </form>
          ) : (
            <div className="mt-2">
              <p className="mb-4 text-sm text-text-muted">
                Supabase is not configured. Choose a preview role to open that desk.
              </p>
              <div className="flex flex-col gap-2">
                {ROLE_OPTIONS.map((option) => {
                  const selected = role === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      className={cn("choice justify-start text-left", selected && "on")}
                      aria-pressed={selected}
                      onClick={() => setRole(option.value)}
                    >
                      <span
                        className={cn("h-2.5 w-2.5 shrink-0 rounded-full bg-border", selected && "bg-cobalt")}
                      />
                      <span>
                        <b className="block text-sm text-text">{option.label}</b>
                        <span className="block text-xs text-text-muted">{option.detail}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <Button className="mt-5 w-full justify-center" size="lg" onClick={loginPreview}>
                Login
              </Button>
            </div>
          )}
        </div>
      </div>
      <p className="mt-auto pt-10 text-xs text-white/50">Internal preview · communication requests</p>
    </div>
  );
}
