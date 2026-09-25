"use client";

import { GitBranch, GitCommitHorizontal, GitFork, GitPullRequest, LoaderCircle, Settings2, Upload } from "lucide-react";
import { useState } from "react";
import { GithubSync } from "./GithubSync";
import { GithubStatus } from "./GithubStatus";
import type { GithubState } from "./useGithubState";

type GithubConnectionCardProps = {
  github: GithubState;
  changes: number;
  aheadCommits: number;
  headCommit?: { hash: string; message: string };
  onManage: () => void;
  onPush: () => void;
  onOpenPullRequest: (compare: string) => void;
};

export function GithubConnectionCard({ github, changes, aheadCommits, headCommit, onManage, onPush, onOpenPullRequest }: GithubConnectionCardProps) {
  const [confirming, setConfirming] = useState(false);
  const syncing = github.syncPhase === "syncing" || github.syncPhase === "checking" || github.syncPhase === "comparing";
  const syncingError = github.syncPhase === "error";

  const statusLabel = syncing
    ? "Syncing..."
    : syncingError
    ? "Sync failed"
    : changes > 0
    ? `${changes} change${changes === 1 ? "" : "s"} ready to push`
    : aheadCommits > 0
    ? `${aheadCommits} commit${aheadCommits === 1 ? "" : "s"} ahead`
    : "Up to date";

  const canPush = (changes > 0 || aheadCommits > 0) && github.connected && !syncing;
  const canOpenPr = changes > 0 || aheadCommits > 0 || github.branch !== "main";

  const tone = syncing
    ? "active"
    : syncingError
    ? "error"
    : changes > 0 || aheadCommits > 0
    ? "warning"
    : "success";

  return (
    <section className="rounded-xl border border-white/[0.08] bg-[#10141d] p-4 sm:p-5" aria-label="GitHub connection">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-slate-300">
            <GitFork aria-hidden="true" className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              GitHub
              <GithubStatus label={`@${github.identity.login}`} tone="success" />
            </p>
            <p className="truncate text-[9px] text-slate-500">Connected · {github.identity.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            aria-label="Manage GitHub connection"
            className="flex h-8 items-center gap-1.5 rounded-md border border-white/[0.1] px-2.5 text-[10px] text-slate-300 transition hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            onClick={onManage}
            type="button"
          >
            <Settings2 aria-hidden="true" className="h-3.5 w-3.5" />
            Manage
          </button>
          <button
            aria-label="Disconnect GitHub"
            className="flex h-8 items-center rounded-md border border-white/[0.1] px-2.5 text-[10px] text-slate-500 transition hover:border-rose-400/30 hover:text-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
            onClick={() => setConfirming(true)}
            type="button"
          >
            Disconnect
          </button>
        </div>
      </div>

      {confirming && (
        <div className="mt-3 rounded-md border border-rose-400/20 bg-rose-500/[0.05] p-3" role="alert">
          <p className="text-[10px] font-medium text-rose-200">Disconnect GitHub?</p>
          <p className="mt-1 text-[9px] leading-4 text-slate-400">Your local Architect project will remain unchanged.</p>
          <div className="mt-2 flex items-center gap-1.5">
            <button
              className="rounded-md bg-rose-500 px-2.5 py-1 text-[10px] font-semibold text-white transition hover:bg-rose-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
              onClick={() => {
                github.disconnect();
                setConfirming(false);
              }}
              type="button"
            >
              Confirm
            </button>
            <button
              className="rounded-md border border-white/[0.1] px-2.5 py-1 text-[10px] text-slate-300 transition hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              onClick={() => setConfirming(false)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <dl className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-md border border-white/[0.06] bg-[#0b0f19] p-3">
          <dt className="text-[8px] font-semibold uppercase tracking-wide text-slate-600">Repository</dt>
          <dd className="mt-1 truncate font-mono text-[11px] text-slate-200">
            {github.repo ? `${github.repo.owner}/${github.repo.name}` : "—"}
          </dd>
        </div>
        <div className="rounded-md border border-white/[0.06] bg-[#0b0f19] p-3">
          <dt className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wide text-slate-600">
            <GitBranch aria-hidden="true" className="h-2.5 w-2.5" />
            Branch
          </dt>
          <dd className="mt-1 truncate font-mono text-[11px] text-slate-200">{github.branch}</dd>
        </div>
        <div className="rounded-md border border-white/[0.06] bg-[#0b0f19] p-3">
          <dt className="flex items-center gap-1 text-[8px] font-semibold uppercase tracking-wide text-slate-600">
            <GitCommitHorizontal aria-hidden="true" className="h-2.5 w-2.5" />
            <span className="sr-only">Sync</span>
            Sync
          </dt>
          <dd className="mt-1" aria-live="polite">
            <GithubStatus label={statusLabel} tone={tone} busy={syncing} />
          </dd>
        </div>
      </dl>

      {github.lastSyncedAt && (
        <p className="mt-2 text-[8px] text-slate-600">Last synced: {github.lastSyncedAt}</p>
      )}

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <GithubSync error={github.syncError} onSync={github.sync} phase={github.syncPhase} />
        </div>
        <button
          aria-label="Push to GitHub"
          className="flex h-8 items-center justify-center gap-1.5 rounded-md border border-white/[0.12] text-[11px] font-semibold text-slate-200 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:border-white/[0.06] disabled:text-slate-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          disabled={!canPush}
          onClick={onPush}
          type="button"
        >
          {syncing ? <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> : <Upload aria-hidden="true" className="h-3.5 w-3.5" />}
          Push
        </button>
        <button
          aria-label="Create pull request"
          className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-coral text-[11px] font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          disabled={!canOpenPr}
          onClick={() => onOpenPullRequest(github.branch)}
          type="button"
        >
          <GitPullRequest aria-hidden="true" className="h-3.5 w-3.5" />
          Create Pull Request
        </button>
      </div>

      {headCommit && (
        <p className="mt-3 flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
          <GitCommitHorizontal aria-hidden="true" className="h-3 w-3 shrink-0 text-slate-600" />
          <span className="truncate">
            {headCommit.hash} {headCommit.message}
          </span>
        </p>
      )}

      <p className="mt-3 text-[8px] leading-4 text-slate-600">
        GitHub connection is simulated in prototype mode. Nothing on GitHub is created, pushed, or synchronized.
      </p>
    </section>
  );
}