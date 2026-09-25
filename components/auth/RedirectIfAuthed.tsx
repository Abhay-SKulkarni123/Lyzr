"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { getMockSession } from "@/lib/auth";

export function RedirectIfAuthed({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (getMockSession().signedIn) {
      const next = new URLSearchParams(window.location.search).get("next");
      router.replace(next && next.startsWith("/") ? next : "/dashboard");
    }
  }, [mounted, router]);

  if (!mounted) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[#0b0f19] text-xs text-slate-500">
        Loading…
      </div>
    );
  }

  return <>{children}</>;
}