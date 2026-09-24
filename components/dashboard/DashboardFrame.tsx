"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "./auth-context";
import { clearMockSession } from "@/lib/auth";
import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardHeader } from "./DashboardHeader";
import { Menu, type MenuItem } from "@/components/shared/Menu";
import { LogOut, Settings, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";

export function DashboardFrame({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { session, setSession } = useAuth();
  const [notice, setNotice] = useState("");
  const timer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (timer.current) window.clearTimeout(timer.current);
    },
    []
  );

  function showNotice(message: string) {
    setNotice(message);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setNotice(""), 2400);
  }

  function signOut() {
    clearMockSession();
    setSession({ signedIn: false, user: session.user });
    router.replace("/login");
  }

  const menuItems: MenuItem[] = [
    { label: "Profile", icon: UserRound, href: "/settings?section=profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Sign out", icon: LogOut, onSelect: signOut, danger: true },
  ];

  const initials = session.user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="flex h-dvh min-h-0 flex-col bg-[#0b0f19] text-slate-200">
      <DashboardHeader onNotice={showNotice} />
      <div className="relative flex min-h-0 flex-1">
        <DashboardSidebar onNotice={showNotice} />
        <main className="workspace-scrollbar min-w-0 flex-1 overflow-y-auto bg-[#0b0f19]">
          {children}
        </main>
        {notice && (
          <div
            role="status"
            className="absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-lg border border-white/10 bg-[#202734] px-3 py-2 text-center text-[10px] text-slate-200 shadow-xl"
          >
            {notice}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] bg-[#10141d] px-4 py-2.5 lg:hidden">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-coral to-[#ff8b5e] text-[10px] font-semibold text-white">
            {initials}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[11px] font-medium text-slate-300">{session.user.name}</p>
            <p className="truncate text-[9px] text-slate-600">{session.user.email}</p>
          </div>
        </div>
        <Menu label="Account menu" align="right" items={menuItems} trigger={<span className="text-slate-400">Account</span>} />
      </div>
    </div>
  );
}