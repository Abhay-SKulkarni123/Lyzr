"use client";

import {
  ChevronDown,
  CircleHelp,
  GitBranch,
  GitFork,
  Hexagon,
  Settings2,
  Upload,
} from "lucide-react";
import Link from "next/link";

type WorkspaceHeaderProps = {
  isBuilding: boolean;
  onNotice: (message: string) => void;
};

export function WorkspaceHeader({ isBuilding, onNotice }: WorkspaceHeaderProps) {
  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#10141d] px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3 md:gap-5">
        <Link
          className="flex shrink-0 items-center gap-2.5 text-sm font-semibold tracking-tight text-white"
          href="/"
          aria-label="Architect home"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-coral text-white shadow-[0_5px_18px_rgba(255,107,74,0.2)]">
            <Hexagon aria-hidden="true" className="h-4 w-4" strokeWidth={2.4} />
          </span>
          <span className="hidden sm:inline">architect</span>
        </Link>
        <span aria-hidden="true" className="hidden h-5 w-px bg-white/10 sm:block" />
        <button
          className="flex min-w-0 items-center gap-1.5 rounded-md px-1.5 py-1 text-left text-sm text-slate-200 transition hover:bg-white/[0.05]"
          onClick={() => onNotice("Project switching is a prototype placeholder.")}
          type="button"
          aria-label="Select project"
        >
          <span className="truncate font-medium">Northstar Analytics</span>
          <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        </button>
        <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11px] text-slate-400 md:inline-flex">
          <GitBranch aria-hidden="true" className="h-3 w-3" />
          main
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        <div className="mr-1 hidden items-center gap-1.5 text-[11px] text-slate-400 sm:flex">
          <span className={`h-1.5 w-1.5 rounded-full ${isBuilding ? "animate-pulse bg-amber-400" : "bg-mint"}`} />
          {isBuilding ? "Building" : "Preview running"}
        </div>
        <button
          className="hidden h-8 items-center gap-1.5 rounded-md border border-white/[0.08] px-2.5 text-xs text-slate-300 transition hover:border-white/15 hover:bg-white/[0.04] sm:inline-flex"
          onClick={() => onNotice("GitHub connection is not enabled in this prototype.")}
          type="button"
        >
          <GitFork aria-hidden="true" className="h-3.5 w-3.5" />
          <span className="hidden md:inline">GitHub</span>
        </button>
        <button
          className="inline-flex h-8 items-center gap-1.5 rounded-md bg-coral px-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:opacity-60 sm:px-3"
          disabled={isBuilding}
          onClick={() => onNotice("Deployment is planned for a later phase.")}
          type="button"
        >
          <Upload aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Deploy</span>
        </button>
        <button
          aria-label="Workspace settings"
          className="hidden h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/[0.05] hover:text-white sm:inline-flex"
          onClick={() => onNotice("Workspace settings are a prototype placeholder.")}
          type="button"
        >
          <Settings2 aria-hidden="true" className="h-4 w-4" />
        </button>
        <button
          aria-label="Help"
          className="hidden h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.05] hover:text-white lg:inline-flex"
          onClick={() => onNotice("Tip: describe a change below and press Build.")}
          type="button"
        >
          <CircleHelp aria-hidden="true" className="h-4 w-4" />
        </button>
        <span className="sr-only" aria-live="polite">
          {isBuilding ? "Architect is building your application" : "Architect is ready"}
        </span>
      </div>
    </header>
  );
}
