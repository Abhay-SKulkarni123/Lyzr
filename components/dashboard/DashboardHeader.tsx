"use client";

import { Command, Hash, Hexagon, Search } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { UserMenu } from "@/components/shared/UserMenu";

type DashboardHeaderProps = {
  onNotice: (message: string) => void;
};

export function DashboardHeader({ onNotice }: DashboardHeaderProps) {
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        onNotice("Search is mocked in this prototype.");
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onNotice]);

  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#10141d] px-4 md:px-6">
      <Link
        href="/dashboard"
        aria-label="Architect dashboard"
        className="flex shrink-0 items-center gap-2.5 text-sm font-semibold tracking-tight text-white"
      >
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-coral text-white shadow-[0_5px_18px_rgba(255,107,74,0.2)]">
          <Hexagon aria-hidden="true" className="h-4 w-4" strokeWidth={2.4} />
        </span>
        <span>architect</span>
      </Link>

      <div className="flex items-center gap-1.5 md:gap-2">
        <button
          type="button"
          onClick={() => onNotice("Search is mocked in this prototype.")}
          className="hidden h-8 items-center gap-2 rounded-md border border-white/[0.08] bg-[#0b0f19] px-3 text-xs text-slate-500 transition hover:border-white/15 hover:text-slate-300 sm:flex"
          aria-label="Search"
        >
          <Search aria-hidden="true" className="h-3.5 w-3.5" />
          Search...
          <kbd className="ml-6 hidden rounded border border-white/[0.08] bg-white/[0.03] px-1 font-mono text-[9px] text-slate-600 md:inline">
            ⌘K
          </kbd>
        </button>
        <button
          type="button"
          onClick={() => onNotice("The command palette is a prototype placeholder.")}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
          aria-label="Command palette"
        >
          <Command aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => onNotice("Help content is mocked for the prototype.")}
          className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.05] hover:text-white lg:inline-flex"
          aria-label="Help"
        >
          <Hash aria-hidden="true" className="h-4 w-4" />
        </button>
        <UserMenu />
      </div>
    </header>
  );
}