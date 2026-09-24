"use client";

import {
  ChevronDown,
  CircleHelp,
  GitBranch,
  Hexagon,
  Settings2,
} from "lucide-react";
import Link from "next/link";
import type { DeploymentStatus } from "@/data/deployment";
import { DeploymentButton } from "@/components/deployment/DeploymentButton";
import type { GithubState } from "@/components/github/useGithubState";
import { GithubHeaderChip } from "@/components/github/GithubHeaderChip";
import { DeveloperModeToggle } from "./DeveloperModeToggle";
import { isBuildPhase, type BuildStatus } from "./types";

type WorkspaceHeaderProps = {
  status: BuildStatus;
  projectName: string;
  developerMode: boolean;
  changes: number;
  branch: string;
  github: GithubState;
  onOpenGithub: () => void;
  onDeveloperModeChange: (enabled: boolean) => void;
  onNotice: (message: string) => void;
  deploymentStatus: DeploymentStatus;
  onOpenDeployment: () => void;
};

export function WorkspaceHeader({ status, projectName, developerMode, changes, branch, github, onOpenGithub, onDeveloperModeChange, onNotice, deploymentStatus, onOpenDeployment }: WorkspaceHeaderProps) {
  const busy = isBuildPhase(status);
  const stateText = busy
    ? "Building…"
    : status === "complete"
    ? "Build complete"
    : status === "error"
    ? "Build failed"
    : "Preview running";
  const stateDot = busy
    ? "animate-pulse bg-amber-400"
    : status === "error"
    ? "bg-rose-400"
    : "bg-mint";
  return (
    <header className="relative z-10 flex h-14 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#10141d] px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3 md:gap-5">
        <Link
          className="flex shrink-0 items-center gap-2.5 text-sm font-semibold tracking-tight text-white"
          href="/dashboard"
          aria-label="Architect dashboard"
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
          <span className="truncate font-medium">{projectName}</span>
          <ChevronDown aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        </button>
        <span className="hidden items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-1 text-[11px] text-slate-400 md:inline-flex">
          <GitBranch aria-hidden="true" className="h-3 w-3" />
          {branch}
        </span>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
        <DeveloperModeToggle developerMode={developerMode} onChange={onDeveloperModeChange} />
        <div className="mr-1 hidden items-center gap-1.5 text-[11px] text-slate-400 sm:flex">
          <span className={`h-1.5 w-1.5 rounded-full ${stateDot}`} />
          {stateText}
        </div>
        <GithubHeaderChip changes={changes} github={github} onOpen={onOpenGithub} />
        <DeploymentButton disabled={busy} onDeploy={onOpenDeployment} status={deploymentStatus} />
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
          {busy ? "Architect is building your application" : status === "error" ? "The build failed" : "Architect is ready"}
        </span>
      </div>
    </header>
  );
}
