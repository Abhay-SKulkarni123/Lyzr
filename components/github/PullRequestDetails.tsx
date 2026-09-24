"use client";

import { CheckCircle2, GitMerge, GitPullRequest } from "lucide-react";
import { githubMergeSimulatedNote, githubPrSimulatedNote, type GithubPullRequest } from "@/data/github";
import { GithubChecks } from "./GithubChecks";
import { GithubStatus } from "./GithubStatus";

type PullRequestDetailsProps = {
  pr: GithubPullRequest;
  onMerge?: () => void;
};

export function PullRequestDetails({ pr, onMerge }: PullRequestDetailsProps) {
  const merged = pr.status === "merged";
  const closed = pr.status === "closed";
  return (
    <article aria-label={`Pull request ${pr.number}`}>
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
            <GitPullRequest aria-hidden="true" className="h-4 w-4 shrink-0 text-coral" />
            Pull Request <span className="font-mono text-coral">#{pr.number}</span>
          </h3>
          <p className="mt-1 text-[10px] text-slate-400">{pr.title}</p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {merged ? (
            <GithubStatus label="Merged" tone="success" />
          ) : closed ? (
            <GithubStatus label="Closed" tone="neutral" />
          ) : (
            <GithubStatus label="Open" tone="success" />
          )}
          <GithubStatus label="Checks passing" tone="success" />
        </div>
      </div>

      <p className="mt-2 flex items-center gap-1.5 text-[9px] text-slate-500">
        <span className="font-medium text-slate-400">@{pr.author}</span>
        <span aria-hidden="true">·</span>
        opened {pr.createdTime}
        <span aria-hidden="true">·</span>
        {pr.changedFiles} changed file{pr.changedFiles === 1 ? "" : "s"}
      </p>

      {pr.description && (
        <p className="mt-2 rounded-md border border-white/[0.06] bg-[#0b0f19] px-3 py-2 text-[10px] leading-4 text-slate-400">{pr.description}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded border border-white/[0.08] px-2 py-0.5 font-mono text-[9px] text-slate-400">
          {pr.base} <span className="text-slate-600">←</span> {pr.compare}
        </span>
        {Array.from({ length: Math.min(pr.changedFiles, 6) }, (_, index) => (
          <span key={index} className="rounded border border-white/[0.06] px-1.5 py-0.5 font-mono text-[8px] text-slate-600">
            file-{pr.changedFiles - index}.tsx
          </span>
        ))}
        {pr.changedFiles > 6 && <span className="text-[8px] text-slate-600">+{pr.changedFiles - 6} more</span>}
      </div>

      <div className="mt-4">
        <GithubChecks checks={pr.checks} />
      </div>

      {(onMerge || merged) && (
        <div className="mt-4 border-t border-white/[0.07] pt-3">
          {merged ? (
            <p className="flex items-center gap-1.5 text-[10px] text-emerald-300">
              <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
              This pull request was merged (simulated).
            </p>
          ) : (
            <button
              aria-label="Merge pull request (simulated)"
              className="flex h-8 items-center gap-1.5 rounded-md bg-mint/90 px-3 text-[10px] font-semibold text-[#0b0f19] transition hover:bg-mint focus:outline-none focus-visible:ring-2 focus-visible:ring-mint/60"
              onClick={onMerge}
              type="button"
            >
              <GitMerge aria-hidden="true" className="h-3.5 w-3.5" />
              Merge pull request
            </button>
          )}
          <p className="mt-2 text-[8px] leading-4 text-slate-600">
            {githubMergeSimulatedNote} {githubPrSimulatedNote}
          </p>
        </div>
      )}
    </article>
  );
}