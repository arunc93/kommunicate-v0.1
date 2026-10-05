"use client";

import { createContext, useContext } from "react";
import { DEFAULT_PERSON, type AppRole } from "@/features/auth/access";

const SessionContext = createContext<{ role: AppRole; person: string } | null>(null);

export function RoleProvider({
  role,
  person,
  children,
}: {
  role: AppRole;
  person: string;
  children: React.ReactNode;
}) {
  return <SessionContext.Provider value={{ role, person }}>{children}</SessionContext.Provider>;
}

export function useAppRole(): AppRole | null {
  return useContext(SessionContext)?.role ?? null;
}

export function useAppPerson(): string {
  return useContext(SessionContext)?.person ?? DEFAULT_PERSON;
}
