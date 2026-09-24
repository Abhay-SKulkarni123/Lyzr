"use client";

import { LoaderCircle, RefreshCw, TriangleAlert } from "lucide-react";
import { githubSyncSteps, type GithubSyncPhase } from "@/data/github";

const stepIndex: Record<GithubSyncPhase, number> = {
  idle: -1,
  syncing: 0,
  checking: 1,
  comparing: 2,
  done: 3,
  error: 1,
};

type GithubSyncProps = {
  phase: GithubSyncPhase;
  error: string | null;
  onSync: () => void;
};

export function GithubSync({ phase, error, onSync }: GithubSyncProps) {
  const busy = phase === "syncing" || phase === "checking" || phase === "comparing";
  const index = stepIndex[phase];
  return (
    <div>
      {busy && (
        <div className="mb-2 flex items-center gap-1.5 text-[9px] text-slate-400" aria-live="polite">
          <LoaderCircle aria-hidden="true" className="h-3 w-3 animate-spin text-coral" />
          {githubSyncSteps[index]}
        </div>
      )}
      <div className="flex items-center gap-1.5">
        <button
          aria-label={busy ? "Syncing with GitHub" : "Sync with GitHub"}
          className={`flex h-8 flex-1 items-center justify-center gap-1.5 rounded-md border text-[11px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
            busy
              ? "cursor-wait border-white/[0.08] text-slate-500"
              : "border-white/[0.12] text-slate-200 hover:border-white/25 hover:text-white"
          }`}
          disabled={busy}
          onClick={onSync}
          type="button"
        >
          {busy ? <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw aria-hidden="true" className="h-3.5 w-3.5" />}
          {busy ? githubSyncSteps[index] : "Sync with GitHub"}
        </button>
        {phase === "done" && <span className="text-[9px] font-medium text-emerald-300">Up to date</span>}
        {phase === "error" && (
          <button
            aria-label="Retry sync"
            className="flex h-8 items-center gap-1 rounded-md border border-rose-400/30 px-2.5 text-[10px] font-semibold text-rose-200 transition hover:bg-rose-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
            onClick={onSync}
            type="button"
          >
            <TriangleAlert aria-hidden="true" className="h-3 w-3" />
            Retry
          </button>
        )}
      </div>
      {phase === "error" && error && <p className="mt-2 text-[9px] text-rose-300">{error}</p>}
    </div>
  );
}