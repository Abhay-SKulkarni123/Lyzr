"use client";

import { useMemo, useState } from "react";
import { githubChecks, type GithubPullRequest } from "@/data/github";
import { GithubDialog } from "./GithubDialog";
import { PullRequestDetails } from "./PullRequestDetails";
import { PullRequestForm } from "./PullRequestForm";
import type { GithubState } from "./useGithubState";

type PullRequestDialogProps = {
  github: GithubState;
  changedFiles: number;
  defaultCompare: string;
  onClose: () => void;
  onNotice: (message: string) => void;
};

export function PullRequestDialog({ github, changedFiles, defaultCompare, onClose, onNotice }: PullRequestDialogProps) {
  const [mode, setMode] = useState<"form" | "details">("form");
  const [createdPr, setCreatedPr] = useState<GithubPullRequest | null>(null);
  const [error, setError] = useState<string | null>(null);

  const base = github.repo?.defaultBranch ?? "main";
  const branches = useMemo(() => {
    const union = new Set<string>(github.branches);
    if (github.repo) union.add(github.repo.defaultBranch);
    return Array.from(union);
  }, [github.branches, github.repo]);

  function createPullRequest(input: { base: string; compare: string; title: string; description: string }) {
    const result = github.createPullRequest({ ...input, changedFiles });
    if (!result.ok) {
      setError(result.error ?? "Could not create the pull request.");
      return;
    }
    setError(null);
    setCreatedPr(result.pr!);
    setMode("details");
    onNotice(`Pull request #${result.pr!.number} created (simulated).`);
  }

  function mergePullRequest() {
    if (!createdPr) return;
    github.mergePullRequest(createdPr.number);
    setCreatedPr({ ...createdPr, status: "merged" });
    onNotice(`Pull request #${createdPr.number} merged (simulated).`);
  }

  return (
    <GithubDialog
      title={mode === "form" ? "Create pull request" : `Pull request #${createdPr?.number}`}
      labelledBy="pull-request-dialog-title"
      onClose={onClose}
      wide
    >
      <span className="sr-only" id="pull-request-dialog-title">
        {mode === "form" ? "Create pull request" : `Pull request ${createdPr?.number}`}
      </span>
      {mode === "form" ? (
        <PullRequestForm
          branches={branches}
          changedFiles={changedFiles}
          checks={githubChecks}
          defaultBase={base}
          defaultCompare={defaultCompare}
          onCancel={onClose}
          onCreate={createPullRequest}
        />
      ) : createdPr ? (
        <PullRequestDetails onMerge={mergePullRequest} pr={createdPr} />
      ) : null}
      {mode === "form" && error && (
        <p className="my-3 flex items-start gap-1.5 rounded-md border border-rose-400/20 bg-rose-500/[0.05] p-2.5 text-[9px] leading-4 text-rose-200" role="alert">
          {error}
        </p>
      )}
      <div className="mt-4 flex items-center justify-end">
        <button className="rounded-md px-3 py-1.5 text-[10px] text-slate-400 transition hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60" onClick={onClose} type="button">
          Close
        </button>
      </div>
    </GithubDialog>
  );
}