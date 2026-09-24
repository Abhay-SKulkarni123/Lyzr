"use client";

import { LogOut, Settings, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/dashboard/auth-context";
import { clearMockSession } from "@/lib/auth";
import { Menu, type MenuItem } from "./Menu";

export function UserMenu() {
  const router = useRouter();
  const { session, setSession } = useAuth();

  const initials = session.user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function signOut() {
    clearMockSession();
    setSession({ signedIn: false, user: session.user });
    router.replace("/login");
  }

  const items: MenuItem[] = [
    { label: "Profile", icon: UserRound, href: "/settings?section=profile" },
    { label: "Settings", icon: Settings, href: "/settings" },
    { label: "Sign out", icon: LogOut, onSelect: signOut, danger: true },
  ];

  return (
    <Menu
      label="User menu"
      align="right"
      trigger={
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-coral to-[#ff8b5e] text-xs font-semibold text-white shadow-sm transition hover:opacity-90">
          {initials}
        </span>
      }
      items={items}
    />
  );
}