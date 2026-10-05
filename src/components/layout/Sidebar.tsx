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
  const items = NAV_ITEMS.filter((item) => item.roles.includes(role));
  const previewPerson = parsePerson(person);

  useEffect(() => {
    setCollapsed(window.localStorage.getItem(STORAGE_KEY) === "1");
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

  const signOut = () => {
    clearStubSession();
    router.push("/login");
    router.refresh();
  };

  return (
    <aside
      className={cn(
        "sidebar-surface flex w-full shrink-0 flex-col text-white md:h-full md:overflow-y-auto",
        collapsed ? "md:w-[72px]" : "md:w-[248px]",
      )}
    >
      <div className={cn("flex shrink-0 items-center gap-2.5 px-3 py-3", collapsed && "md:flex-col md:px-2 md:py-3.5")}>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Retract sidebar"}
          className="rounded-lg p-2 text-white/80 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/login" title="Kommunicate" className="flex min-w-0 items-center gap-2.5 text-white">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cobalt text-sm font-bold">K</span>
          <span className={cn("min-w-0", collapsed && "md:sr-only")}>
            <span className="block text-[15px] font-bold leading-5">Kommunicate</span>
            <span className="hidden text-[11px] text-white/55 md:block">KGS Consulting</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2 md:hidden">
          <div className="relative h-9 w-9 overflow-hidden rounded-full" title={previewPerson}>
            <Image src={PREVIEW_AVATARS[previewPerson]} alt="" fill sizes="36px" className="object-cover" />
          </div>
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

      {!collapsed && (
        <p className="mb-1.5 mt-1 hidden px-6 text-[10px] font-bold uppercase tracking-[0.16em] text-white/35 md:block">
          Workspace
        </p>
      )}

      <nav className="flex min-w-0 gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:overflow-visible md:px-3 md:pb-4">
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
                "flex shrink-0 items-center gap-2.5 whitespace-nowrap rounded-lg px-3 py-2.5 text-sm leading-5 text-white/75",
                active ? "bg-white/10 text-white" : "hover:bg-white/10 hover:text-white",
                collapsed && "justify-center px-2 md:px-2",
              )}
            >
              <Icon className="h-4 w-4 shrink-0 text-light-blue" />
              <span className={cn(collapsed && "sr-only")}>{item.label}</span>
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
        <div className={cn("flex items-center gap-2.5 px-1", collapsed && "md:justify-center md:px-0")}>
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full" title={previewPerson}>
            <Image src={PREVIEW_AVATARS[previewPerson]} alt="" fill sizes="40px" className="object-cover" />
          </div>
          <div className={cn("min-w-0", collapsed && "sr-only")}>
            <b className="block truncate text-sm">{givenName(previewPerson)}</b>
            <small className="block text-[11px] text-white/55">{roleLabel(role)}</small>
          </div>
        </div>

        {stub && !collapsed && (
          <div className="hidden flex-col gap-3 md:flex">
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
        )}
        <button
          type="button"
          onClick={signOut}
          title="Sign out"
          className={cn(
            "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-white/80 hover:bg-white/10 hover:text-white",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className={cn(collapsed && "sr-only")}>Sign out</span>
        </button>
      </div>
    </aside>
  );
}
