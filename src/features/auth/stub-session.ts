"use client";

import { STUB_PERSON_COOKIE, STUB_ROLE_COOKIE } from "@/features/auth/access";

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=2592000; SameSite=Lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function readStubCookie(name: string): string | null {
  const match = document.cookie.split("; ").find((row) => row.startsWith(`${name}=`));
  if (!match) return null;
  const raw = match.slice(name.length + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

export function writeStubRole(role: string) {
  writeCookie(STUB_ROLE_COOKIE, role);
}

export function writeStubPerson(person: string) {
  writeCookie(STUB_PERSON_COOKIE, person);
}

export function writeStubSession(role: string, person: string) {
  writeStubRole(role);
  writeStubPerson(person);
}

export function clearStubSession() {
  clearCookie(STUB_ROLE_COOKIE);
  clearCookie(STUB_PERSON_COOKIE);
}
