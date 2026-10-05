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
        "flex w-full shrink-0 flex-row items-center bg-sidebar text-white md:min-h-screen md:flex-col md:items-stretch",
        collapsed ? "md:w-[72px]" : "md:w-60",
      )}
    >
      <div className={cn("flex shrink-0 items-center gap-2 px-3 py-3 md:py-4", collapsed && "md:flex-col md:px-2")}>
        <button
          type="button"
          onClick={toggle}
          aria-label={collapsed ? "Expand sidebar" : "Retract sidebar"}
          className="rounded-md p-2 hover:bg-white/10"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/login" title="Kommunicate" className="min-w-0 text-white">
          {collapsed ? (
            <span className="flex h-8 w-8 items-center justify-center rounded-md border border-white/30 text-sm font-semibold">
              K
            </span>
          ) : (
            <span className="block">
              <span className="block text-base font-semibold leading-5">Kommunicate</span>
              <span className="block text-xs leading-4 text-white/70">KGS Consulting</span>
            </span>
          )}
        </Link>
      </div>

      <div
        className={cn(
          "flex shrink-0 items-center gap-2 px-3 py-1 md:flex-col md:gap-2 md:px-3 md:pb-4 md:pt-1",
          collapsed && "md:px-2",
        )}
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-full",
            collapsed ? "h-10 w-10" : "h-10 w-10 md:h-20 md:w-20",
          )}
          title={previewPerson}
        >
          <Image
            src={PREVIEW_AVATARS[previewPerson]}
            alt=""
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>
        <p className={cn("truncate text-sm text-white md:text-center", collapsed && "sr-only")}>
          {givenName(previewPerson)}
        </p>
      </div>

      <nav className="flex min-w-0 flex-1 gap-1 overflow-x-auto px-2 py-3 md:flex-none md:flex-col md:overflow-visible md:px-3 md:py-0 md:pb-6">
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
                "flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm leading-5 text-white",
                active ? "bg-cobalt" : "hover:bg-white/10",
                collapsed && "justify-center px-2 md:px-2",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className={cn(collapsed && "sr-only")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex shrink-0 items-center gap-2 px-2 py-3 md:mt-auto md:flex-col md:items-stretch md:border-t md:border-white/10 md:px-3 md:py-4">
        {stub && !collapsed && (
          <div className="hidden flex-col gap-3 md:flex">
            <p className="px-1 text-xs leading-4 text-white/70">
              Preview session. Supabase is not configured.
            </p>
            <label className="flex flex-col gap-1 px-1 text-xs leading-4 text-white/80" htmlFor="sidebar-role">
              Preview role
              <select
                id="sidebar-role"
                value={role}
                onChange={(event) => switchRole(event.target.value as AppRole)}
                className="rounded-md border border-white/20 bg-sidebar px-2 py-2 text-sm text-white outline-none"
              >
                {ROLES.map((value) => (
                  <option key={value} value={value}>
                    {value === "comms" ? "Comms" : value[0].toUpperCase() + value.slice(1)}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1 px-1 text-xs leading-4 text-white/80" htmlFor="sidebar-person">
              Preview person
              <select
                id="sidebar-person"
                value={previewPerson}
                onChange={(event) => switchPerson(event.target.value as PreviewPerson)}
                className="rounded-md border border-white/20 bg-sidebar px-2 py-2 text-sm text-white outline-none"
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
            "flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-white hover:bg-white/10",
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
