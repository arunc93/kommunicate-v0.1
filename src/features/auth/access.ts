export const STUB_ROLE_COOKIE = "km_stub_role";
export const STUB_PERSON_COOKIE = "km_stub_person";

export const ROLES = ["stakeholder", "comms", "lead"] as const;
export type AppRole = (typeof ROLES)[number];

export const PREVIEW_PEOPLE = ["Chacko, Arun", "Rakshit, Abhirup", "Tanwar, Dheeraj"] as const;
export type PreviewPerson = (typeof PREVIEW_PEOPLE)[number];
export const DEFAULT_PERSON: PreviewPerson = "Chacko, Arun";

export const PREVIEW_AVATARS: Record<PreviewPerson, string> = {
  "Chacko, Arun": "https://i.pravatar.cc/150?u=arun2",
  "Rakshit, Abhirup": "https://i.pravatar.cc/150?u=abhirup",
  "Tanwar, Dheeraj": "https://i.pravatar.cc/150?u=dheeraj",
};

export function givenName(name: string): string {
  const comma = name.indexOf(",");
  if (comma === -1) return name;
  return name.slice(comma + 1).trim() || name;
}

export function roleLabel(role: AppRole): string {
  if (role === "comms") return "Comms";
  return role[0].toUpperCase() + role.slice(1);
}

const ALL_ROLES: readonly AppRole[] = ["stakeholder", "comms", "lead"];
const COMMS_AND_LEAD: readonly AppRole[] = ["comms", "lead"];

export type NavIcon =
  | "dashboard"
  | "new-request"
  | "my-requests"
  | "templates"
  | "delivery"
  | "release"
  | "metrics"
  | "gallery"
  | "sops"
  | "team";

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function parseRole(value: string | undefined | null): AppRole | null {
  if (value === "stakeholder" || value === "comms" || value === "lead") return value;
  return null;
}

export function parsePerson(value: string | undefined | null): PreviewPerson {
  if (!value) return DEFAULT_PERSON;
  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }
  if ((PREVIEW_PEOPLE as readonly string[]).includes(decoded)) return decoded as PreviewPerson;
  return DEFAULT_PERSON;
}

export function homeForRole(role: AppRole): string {
  if (role === "stakeholder") return "/my-requests";
  return "/dashboard";
}

function isCommsOrLead(role: AppRole): boolean {
  return role === "comms" || role === "lead";
}

export function canAccess(role: AppRole, pathname: string): boolean {
  if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) return isCommsOrLead(role);
  if (pathname === "/my-requests") return role === "stakeholder";
  if (pathname === "/metrics") return isCommsOrLead(role);
  if (pathname === "/add-hours" || pathname.startsWith("/add-hours/")) return isCommsOrLead(role);
  if (pathname === "/hours" || pathname.startsWith("/hours/")) return isCommsOrLead(role);
  if (pathname === "/delivery-calendar") return isCommsOrLead(role);
  if (pathname === "/requests/new") return true;
  if (pathname.startsWith("/requests/")) return true;
  if (
    pathname === "/templates" ||
    pathname === "/release-calendar" ||
    pathname === "/gallery" ||
    pathname === "/sops" ||
    pathname === "/team"
  ) {
    return true;
  }
  return true;
}

export const NAV_ITEMS: {
  href: string;
  label: string;
  icon: NavIcon;
  roles: readonly AppRole[];
}[] = [
  { href: "/dashboard", label: "Dashboard", icon: "dashboard", roles: COMMS_AND_LEAD },
  { href: "/requests/new", label: "New request", icon: "new-request", roles: ALL_ROLES },
  { href: "/my-requests", label: "My requests", icon: "my-requests", roles: ["stakeholder"] },
  { href: "/templates", label: "Templates", icon: "templates", roles: ALL_ROLES },
  { href: "/delivery-calendar", label: "Delivery calendar", icon: "delivery", roles: COMMS_AND_LEAD },
  { href: "/release-calendar", label: "Release calendar", icon: "release", roles: ["stakeholder"] },
  { href: "/metrics", label: "Metrics", icon: "metrics", roles: COMMS_AND_LEAD },
  { href: "/gallery", label: "Gallery", icon: "gallery", roles: ALL_ROLES },
  { href: "/sops", label: "SOPs and TATs", icon: "sops", roles: ALL_ROLES },
  { href: "/team", label: "Our team", icon: "team", roles: ALL_ROLES },
];
