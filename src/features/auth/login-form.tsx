"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  STUB_PERSON_COOKIE,
  STUB_ROLE_COOKIE,
  type AppRole,
  type PreviewPerson,
  homeForRole,
  parsePerson,
  parseRole,
} from "@/features/auth/access";
import { readStubCookie, writeStubSession } from "@/features/auth/stub-session";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS: { value: AppRole; label: string; detail: string }[] = [
  { value: "stakeholder", label: "Stakeholder", detail: "Raise and track your own requests" },
  { value: "comms", label: "Comms", detail: "Work the shared queue" },
  { value: "lead", label: "Lead", detail: "Assign, prioritise, read the desk" },
];

export function LoginForm({ supabaseConfigured }: { supabaseConfigured: boolean }) {
  const router = useRouter();
  const [role, setRole] = useState<AppRole>("lead");
  const [person, setPerson] = useState<PreviewPerson>("Chacko, Arun");

  useEffect(() => {
    const savedRole = parseRole(readStubCookie(STUB_ROLE_COOKIE));
    if (savedRole) setRole(savedRole);
    setPerson(parsePerson(readStubCookie(STUB_PERSON_COOKIE)));
  }, []);

  const login = () => {
    if (supabaseConfigured) return;
    writeStubSession(role, person);
    router.push(homeForRole(role));
    router.refresh();
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
          <p className="kicker">Sign in</p>
          <h2 className="mt-1.5 text-2xl font-semibold leading-8 text-text">Welcome back</h2>

          {supabaseConfigured ? (
            <p className="mb-6 mt-2 text-sm text-text-muted">
              Supabase is configured. Sign-in is not wired yet.
            </p>
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
                      className={cn("choice justify-center", selected && "on")}
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
            </div>
          )}

          <Button className="mt-5 w-full justify-center" size="lg" disabled={supabaseConfigured} onClick={login}>
            Login
          </Button>
        </div>
      </div>
      <p className="mt-auto pt-10 text-xs text-white/50">Internal preview · communication requests</p>
    </div>
  );
}
