"use client";

import { useEffect, useState, type ReactNode } from "react";
import { reconcileServerScope } from "@/lib/auth";

export function SessionScopeSync({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    async function sync() {
      try {
        const response = await fetch("/api/session-scope", { cache: "no-store" });
        if (response.ok) {
          const data = (await response.json()) as { scope?: string };
          if (active && data.scope) reconcileServerScope(data.scope);
        }
      } catch {
        // Server unavailable — keep the current browser session.
      }
      if (active) setReady(true);
    }
    void sync();
    return () => {
      active = false;
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0b0f19] text-xs text-slate-500">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}