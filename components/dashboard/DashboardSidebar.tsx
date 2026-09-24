"use client";

import { FolderKanban, LayoutDashboard, Plus, Settings2, Shapes, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./auth-context";
import { Menu, type MenuItem } from "@/components/shared/Menu";
import { LogOut, UserRound, Settings } from "lucide-react";
import { clearMockSession } from "@/lib/auth";
import { useRouter } from "next/navigation";

type DashboardSidebarProps = {
  onNotice: (message: string) => void;
};

const navItems: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Projects", href: "/projects", icon: FolderKanban },
  { label: "Templates", href: "/templates", icon: Shapes },
  { label: "Settings", href: "/settings", icon: Settings2 },
];

export function DashboardSidebar({ onNotice }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, setSession } = useAuth();

  const user = session.user;
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function signOut() {
    clearMockSession();
    setSession({ signedIn: false, user });
    router.replace("/login");
  }

  const accountItems: MenuItem[] = [
    { label: "Profile", icon: UserRound, href: "/settings?section=profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Sign out", icon: LogOut, onSelect: signOut, danger: true },
  ];

  return (
    <aside className="hidden w-[224px] shrink-0 flex-col border-r border-white/[0.07] bg-[#10141d] lg:flex">
      <div className="p-3">
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-coral px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#ff795c]"
          onClick={() => onNotice("New Project opens from the Projects page in this prototype.")}
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          New Project
        </button>
      </div>
      <nav className="flex flex-col gap-0.5 px-2" aria-label="Dashboard navigation">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={`relative flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs transition ${
                active
                  ? "bg-white/[0.07] font-medium text-white"
                  : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
              }`}
            >
              {active && <span className="absolute left-0 top-1/2 h-4 w-0.5 -translate-y-1/2 rounded-full bg-coral" />}
              <Icon aria-hidden="true" className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto border-t border-white/[0.06] p-3">
        <Menu
          label="Account menu"
          align="left"
          items={accountItems}
          trigger={
            <span className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-left transition hover:bg-white/[0.04]">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-coral to-[#ff8b5e] text-[11px] font-semibold text-white">
                {initials}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-xs font-medium text-slate-300">{user.name}</span>
                <span className="block truncate text-[10px] text-slate-600">{user.email}</span>
              </span>
            </span>
          }
        />
      </div>
    </aside>
  );
}