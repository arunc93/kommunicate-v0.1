"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  PREVIEW_PEOPLE,
  STUB_PERSON_COOKIE,
  STUB_ROLE_COOKIE,
  type AppRole,
  type PreviewPerson,
  homeForRole,
  parsePerson,
  parseRole,
} from "@/features/auth/access";
import { readStubCookie, writeStubSession } from "@/features/auth/stub-session";

const ROLE_OPTIONS: { value: AppRole; label: string }[] = [
  { value: "stakeholder", label: "Stakeholder" },
  { value: "comms", label: "Comms" },
  { value: "lead", label: "Lead" },
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
    <div className="login-gradient flex min-h-screen items-center px-4 py-8 md:px-16">
      <div className="w-full max-w-[336px] rounded-lg bg-white p-8 shadow-elevation-1">
        <h1 className="text-2xl font-semibold leading-8 text-text">Welcome to Kommunicate</h1>
        <hr className="my-6 border-border" />
        <p className="mb-6 text-sm font-semibold leading-5 text-text">KGS Consulting</p>

        {supabaseConfigured ? (
          <p className="mb-6 text-xs leading-4 text-text-muted">
            Supabase is configured. Sign-in is not wired yet.
          </p>
        ) : (
          <div className="mb-6 flex flex-col gap-4">
            <p className="text-xs leading-4 text-text-muted">
              Supabase is not configured. This sign-in is a local preview. Choose a role to
              see that role&apos;s navigation.
            </p>
            <label className="flex flex-col gap-1 text-sm font-medium text-text" htmlFor="preview-role">
              Preview role
              <select
                id="preview-role"
                value={role}
                onChange={(event) => setRole(event.target.value as AppRole)}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-normal text-text outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt"
              >
                {ROLE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium text-text" htmlFor="preview-person">
              Preview person
              <select
                id="preview-person"
                value={person}
                onChange={(event) => setPerson(event.target.value as PreviewPerson)}
                className="rounded-md border border-border bg-surface px-3 py-2 text-sm font-normal text-text outline-none focus:border-cobalt focus:ring-1 focus:ring-cobalt"
              >
                {PREVIEW_PEOPLE.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}

        <Button className="w-full justify-center" size="lg" disabled={supabaseConfigured} onClick={login}>
          Login
        </Button>
      </div>
    </div>
  );
}
