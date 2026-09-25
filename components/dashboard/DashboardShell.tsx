"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getMockSession } from "@/lib/auth";
import { AuthProvider } from "./auth-context";
import { DashboardFrame } from "./DashboardFrame";

function RequireAuth({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!getMockSession().signedIn) router.replace("/login");
  }, [mounted, router]);

  if (!mounted || !getMockSession().signedIn) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0b0f19] text-xs text-slate-500">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <AuthProvider>
        <DashboardFrame>{children}</DashboardFrame>
      </AuthProvider>
    </RequireAuth>
  );
}