"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Plus,
  Search,
  List,
  Calendar,
  BarChart3,
  Camera,
  FileText,
  Users,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

const navItems = [
  { href: "/dashboard/new-request", label: "New request", icon: Plus, prefix: "+" },
  { href: "/dashboard/track-request", label: "Track request", icon: Search },
  { href: "/dashboard/templates", label: "Templates", icon: List },
  { href: "/dashboard/delivery-calendar", label: "Delivery calendar", icon: Calendar },
  { href: "/dashboard/metrics", label: "Metrics", icon: BarChart3 },
  { href: "/dashboard/gallery", label: "Gallery", icon: Camera },
  { href: "/dashboard/sops", label: "SOPs and TATs", icon: FileText },
  { href: "/dashboard/team", label: "Our team", icon: Users },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[200px] min-h-screen bg-[#0a192f] flex flex-col shrink-0">
      <div className="p-4">
        <button className="text-white/80 hover:text-white transition-colors">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col items-center px-4 mb-6">
        <div className="relative w-16 h-16 rounded-full overflow-hidden mb-2 border-2 border-white/20">
          <Image
            src="https://i.pravatar.cc/150?u=sam"
            alt="Sam"
            fill
            className="object-cover"
          />
        </div>
        <span className="text-white text-sm font-medium">Sam</span>
      </div>

      <nav className="flex flex-col gap-1.5 px-3 pb-6">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard/new-request" && pathname.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded text-sm text-white transition-colors",
                isActive
                  ? "bg-[#2d4a6f]"
                  : "bg-[#1e3a5f]/60 hover:bg-[#2d4a6f]/80"
              )}
            >
              {item.prefix ? (
                <span className="text-base font-light">{item.prefix}</span>
              ) : (
                <Icon className="h-4 w-4 shrink-0" />
              )}
              <span className="leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
