"use client";

import { GitFork, LoaderCircle, Upload } from "lucide-react";
import { GithubStatus } from "./GithubStatus";
import type { GithubState } from "./useGithubState";

type GithubHeaderChipProps = {
  github: GithubState;
  changes: number;
  onOpen: () => void;
};

export function GithubHeaderChip({ github, changes, onOpen }: GithubHeaderChipProps) {
  const syncing = github.syncPhase === "syncing" || github.syncPhase === "checking" || github.syncPhase === "comparing";

  let label: string;
  let tone: "neutral" | "success" | "warning" | "active" = "neutral";
  if (!github.connected) {
    label = "Connect to GitHub";
  } else if (github.connecting) {
    label = "Connecting...";
  } else if (syncing) {
    label = "Syncing...";
    tone = "active";
  } else if (changes > 0) {
    label = `${changes} change${changes === 1 ? "" : "s"} ready`;
    tone = "warning";
  } else {
    label = github.repo ? `Connected · ${github.repo.name}` : "Connected";
    tone = "success";
  }

  return (
    <button
      aria-label="Open GitHub connection details"
      className="flex h-8 items-center gap-1.5 rounded-md border border-white/[0.09] bg-white/[0.03] px-2.5 text-[10px] font-medium text-slate-300 transition hover:border-white/[0.2] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
      onClick={onOpen}
      type="button"
    >
      {github.connecting || syncing ? (
        <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-coral" />
      ) : github.connected && changes > 0 ? (
        <Upload aria-hidden="true" className="h-3.5 w-3.5 text-coral" />
      ) : (
        <GitFork aria-hidden="true" className="h-3.5 w-3.5 text-slate-400" />
      )}
      <span className="hidden sm:inline">
        <GithubStatus busy={syncing || github.connecting} label={label} tone={tone} />
      </span>
    </button>
  );
}