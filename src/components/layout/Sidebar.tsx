"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Calendar,
  CalendarClock,
  FileText,
  Files,
  Image as ImageIcon,
  List,
  LogOut,
  Menu,
  Plus,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  NAV_ITEMS,
  PREVIEW_AVATARS,
  PREVIEW_PEOPLE,
  ROLES,
  type AppRole,
  type NavIcon,
  type PreviewPerson,
  givenName,
  homeForRole,
  parsePerson,
  roleLabel,
} from "@/features/auth/access";
import { clearStubSession, writeStubPerson, writeStubRole } from "@/features/auth/stub-session";
import { createClient } from "@/lib/supabase/client";

const ICONS: Record<NavIcon, LucideIcon> = {
  dashboard: Search,
  "new-request": Plus,
  "my-requests": List,
  templates: Files,
  delivery: Calendar,
  release: CalendarClock,
  metrics: BarChart3,
  gallery: ImageIcon,
  sops: FileText,
  team: Users,
};

const STORAGE_KEY = "km_sidebar_collapsed";

function initials(name: string): string {
  const given = givenName(name);
  const parts = given.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
  return (given[0] ?? "?").toUpperCase();
}

function Avatar({ name, className }: { name: string; className?: string }) {
  const known = (PREVIEW_PEOPLE as readonly string[]).includes(name);
  if (known) {
    return (
      <div className={cn("relative overflow-hidden rounded-full", className)} title={name}>
        <Image src={PREVIEW_AVATARS[name as PreviewPerson]} alt="" fill sizes="80px" className="object-cover" />
      </div>
    );
  }
  return (
    <div
      className={cn("grid place-items-center rounded-full bg-cobalt text-sm font-semibold text-white", className)}
      title={name}
    >
      {initials(name)}
    </div>
  );
}

export function Sidebar({
  role,
  person,
  stub,
}: {
  role: AppRole;
  person: string;
  stub: boolean;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [motionReady, setMotionReady] = useState(false);
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const previewPerson = parsePerson(person);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
    const frame = requestAnimationFrame(() => setMotionReady(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const toggle = () => {
    setCollapsed((current) => {
      const next = !current;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const switchRole = (next: AppRole) => {
    writeStubRole(next);
    router.push(homeForRole(next));
    router.refresh();
  };

  const switchPerson = (next: PreviewPerson) => {
    writeStubPerson(next);
    router.refresh();
  };

  const signOut = async () => {
    clearStubSession();
    if (!stub) {
      const supabase = createClient();
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  };

  const ease = cn(
    "duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    !motionReady && "transition-none",
  );

  return (
    <aside
      className={cn(
        "sidebar-surface flex w-full shrink-0 flex-col overflow-x-hidden text-white md:h-full md:overflow-y-auto md:transition-[width]",
        ease,
        collapsed ? "md:w-[60px]" : "md:w-[248px]",
      )}
    >
      <div
        className={cn(
          "relative flex shrink-0 items-center gap-2 overflow-hidden px-3 py-3 md:block md:transition-[height]",
          ease,
          collapsed ? "md:h-[104px]" : "md:h-[60px]",
        )}
      >
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Retract sidebar"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white/80 hover:bg-white/10 md:absolute md:left-3 md:top-3"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/login" title="Kommunicate" className="flex min-w-0 items-center gap-2.5 text-white md:contents">
          <span
            className={cn(
              "grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cobalt text-sm font-bold md:absolute md:left-3 md:top-3 md:transition-transform",
              ease,
              collapsed ? "md:translate-x-0 md:translate-y-11" : "md:translate-x-11 md:translate-y-0",
            )}
          >
            K
          </span>
          <span
            className={cn(
              "block min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] md:absolute md:left-26 md:top-3",
              ease,
              "max-w-[140px] opacity-100",
              collapsed && "md:max-w-0 md:opacity-0",
            )}
          >
            <span className="block text-[15px] font-bold leading-5">Kommunicate</span>
            <span className="hidden text-[11px] text-white/55 md:block">KGS Consulting</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <Avatar name={person} className="h-9 w-9 shrink-0" />
          <button
            type="button"
            onClick={signOut}
            aria-label="Sign out"
            className="rounded-lg p-2 text-white/80 hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="hidden items-center overflow-hidden px-3 pb-4 pt-1 md:flex">
        <div
          className={cn(
            "relative h-20 w-20 shrink-0 transition-[width,height]",
            ease,
            collapsed && "md:h-9 md:w-9",
          )}
        >
          <Avatar name={person} className="h-full w-full" />
          <div
            className={cn(
              "absolute left-full top-1/2 min-w-0 -translate-y-1/2 overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin]",
              ease,
              "ml-3 max-w-[140px] opacity-100",
              collapsed && "md:ml-0 md:max-w-0 md:opacity-0",
            )}
          >
            <b className="block text-sm">{givenName(person)}</b>
            <small className="block text-[11px] text-white/55">{roleLabel(role)}</small>
          </div>
        </div>
      </div>

      <nav className="flex min-w-0 gap-1 overflow-x-auto px-3 pb-2 md:flex-1 md:flex-col md:overflow-visible md:pb-4">
        {items.map((item) => {
          const Icon = ICONS[item.icon];
          const active =
            pathname === item.href ||
            (item.href === "/delivery-calendar" && pathname === "/release-calendar");
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex w-auto shrink-0 items-center overflow-hidden whitespace-nowrap rounded-lg py-1 text-sm leading-5 text-white/75 md:w-full md:shrink",
                active ? "bg-white/10 text-white" : "hover:bg-white/10 hover:text-white",
              )}
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center">
                <Icon className="h-4 w-4 text-light-blue" />
              </span>
              <span
                className={cn(
                  "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin]",
                  ease,
                  "ml-2.5 max-w-[11rem] opacity-100",
                  collapsed && "md:ml-0 md:max-w-0 md:opacity-0",
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div
        className={cn(
          "mt-auto hidden shrink-0 flex-col gap-3 border-t border-white/10 px-3 py-4 md:flex",
          process.env.NODE_ENV === "development" && "md:pb-16",
        )}
      >
        {stub && (
          <div
            className={cn(
              "grid transition-[grid-template-rows,opacity]",
              ease,
              collapsed ? "grid-rows-[0fr] opacity-0" : "grid-rows-[1fr] opacity-100",
            )}
            inert={collapsed ? true : undefined}
          >
            <div className="flex flex-col gap-3 overflow-hidden">
            <p className="px-1 text-[11px] leading-4 text-white/55">
              Preview session. Supabase is not configured.
            </p>
            <label className="flex flex-col gap-1 px-1 text-[11px] text-white/70" htmlFor="sidebar-role">
              Preview role
              <select
                id="sidebar-role"
                value={role}
                onChange={(event) => switchRole(event.target.value as AppRole)}
                className="rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-sm text-white outline-none"
              >
                {ROLES.map((value) => (
                  <option key={value} value={value}>
                    {roleLabel(value)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 px-1 text-[11px] text-white/70" htmlFor="sidebar-person">
              Preview person
              <select
                id="sidebar-person"
                value={previewPerson}
                onChange={(event) => switchPerson(event.target.value as PreviewPerson)}
                className="rounded-lg border border-white/15 bg-white/5 px-2 py-2 text-sm text-white outline-none"
              >
                {PREVIEW_PEOPLE.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={signOut}
          title="Sign out"
          className="flex w-full items-center overflow-hidden rounded-lg py-1 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center">
            <LogOut className="h-4 w-4" />
          </span>
          <span
            className={cn(
              "min-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity,margin]",
              ease,
              "ml-2 max-w-[8rem] opacity-100",
              collapsed && "md:ml-0 md:max-w-0 md:opacity-0",
            )}
          >
            Sign out
          </span>
        </button>
      </div>
    </aside>
  );
}
