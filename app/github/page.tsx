"use client";

import { ArrowLeft, GitBranch, GitFork, GitPullRequest, History, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { GithubChecks } from "@/components/github/GithubChecks";
import { GithubConnectionCard } from "@/components/github/GithubConnectionCard";
import { GithubConnectionModal } from "@/components/github/GithubConnectionModal";
import { GithubRepositoryPicker } from "@/components/github/GithubRepositoryPicker";
import { GithubBranchPicker } from "@/components/github/GithubBranchPicker";
import { GithubStatus } from "@/components/github/GithubStatus";
import { PullRequestDetails } from "@/components/github/PullRequestDetails";
import { PullRequestDialog } from "@/components/github/PullRequestDialog";
import { useGithubState } from "@/components/github/useGithubState";
import { CommitHistory } from "@/components/workspace/CommitHistory";
import { gitChanges, gitHistory } from "@/data/developer";
import { githubChecks, githubSimulatedNote, repoById, type GithubPullRequest } from "@/data/github";
import { readProjectContext, scenarioById } from "@/data/scenarios";

export default function GitHubPage() {
  const projectContext = readProjectContext();
  const defaultRepoId = scenarioById(projectContext.scenarioId).githubRepoId;
  const defaultRepo = repoById(defaultRepoId);
  const github = useGithubState({ defaultRepoId });
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [prDialog, setPrDialog] = useState<{ open: boolean; compare: string }>({ open: false, compare: "feature/analytics" });
  const [expandedPr, setExpandedPr] = useState<number | null>(null);
  const [mergedPrs, setMergedPrs] = useState<number[]>([]);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    },
    []
  );

  const headCommit = gitHistory[0];
  const aheadCommits = github.connected && headCommit ? (github.pushedHead === headCommit.hash ? 0 : 1) : 0;
  const pullRequests = github.pullRequests.filter((pr) => pr.repoId === (github.repo?.id ?? defaultRepoId));

  function showNotice(message: string) {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3600);
  }

  function pushToGithub() {
    const ok = github.push(headCommit?.hash ?? "");
    if (ok) {
      showNotice(`Pushed to GitHub · ${github.repo ? `${github.repo.owner}/${github.repo.name}` : `${defaultRepo?.owner}/${defaultRepo?.name}`} · ${github.branch}${headCommit ? ` · ${headCommit.hash} ${headCommit.message}` : ""} (simulated).`);
    } else {
      showNotice(github.syncError ?? "Push failed. Try again.");
    }
  }

  function mergePr(pr: GithubPullRequest) {
    if (pr.status === "open") {
      setMergedPrs((prev) => (prev.includes(pr.number) ? prev : [...prev, pr.number]));
      github.mergePullRequest(pr.number);
      showNotice(`Pull request #${pr.number} merged (simulated).`);
    }
  }

  function prStatus(pr: GithubPullRequest): GithubPullRequest["status"] {
    if (mergedPrs.includes(pr.number)) return "merged";
    return pr.status;
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <Link
            className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 transition hover:text-slate-200"
            href="/workspace"
          >
            <ArrowLeft aria-hidden="true" className="h-3 w-3" />
            Back to workspace
          </Link>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600">Integration</p>
          <h1 className="mt-1 flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            <GitFork aria-hidden="true" className="h-7 w-7 text-coral" />
            GitHub
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Repository, branch, and pull request state shared with the workspace.
          </p>
        </div>
        {github.connected && <GithubStatus label={`Connected as @${github.identity.login}`} tone="success" />}
      </div>

      {notice && (
        <div className="sticky top-3 z-20 mb-4 rounded-lg border border-white/10 bg-[#202734] px-3 py-2 text-center text-[10px] text-slate-200 shadow-xl" role="status">
          {notice}
        </div>
      )}

      {!github.connected ? (
        <section className="rounded-xl border border-white/[0.08] bg-[#10141d] p-6 sm:p-8" aria-label="Connect GitHub">
          <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-coral/15 text-coral">
              <GitFork aria-hidden="true" className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-white">Connect GitHub to push and review changes</h2>
              <p className="mt-1 text-xs leading-5 text-slate-500">
                Link the simulated architect-demo account, choose a repository and branch, then push local commits and open pull requests. Prototype integration. No GitHub credentials or repositories are accessed.
              </p>
            </div>
            <button
              className="shrink-0 rounded-lg bg-coral px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              onClick={() => setGithubModalOpen(true)}
              type="button"
            >
              Connect GitHub
            </button>
          </div>
        </section>
      ) : (
        <div className="space-y-5">
          <GithubConnectionCard
            aheadCommits={aheadCommits}
            changes={gitChanges.length}
            github={github}
            headCommit={headCommit}
            onManage={() => setGithubModalOpen(true)}
            onOpenPullRequest={(compare) => setPrDialog({ open: true, compare })}
            onPush={pushToGithub}
          />

          <section className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-xl border border-white/[0.08] bg-[#10141d] p-4 sm:p-5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <GitFork aria-hidden="true" className="h-4 w-4 text-coral" />
                Repository &amp; branches
              </h2>
              <GithubRepositoryPicker
                created={github.createdRepositories}
                selectedId={github.repo?.id ?? null}
                onCreated={(repo) => {
                  github.registerCreatedRepo(repo);
                  github.selectRepo(repo.id);
                }}
                onSelect={github.selectRepo}
              />
              <div className="mt-4 border-t border-white/[0.07] pt-4">
                <GithubBranchPicker
                  branches={github.branches}
                  onCreate={github.createBranch}
                  onSelect={github.selectBranch}
                  selected={github.branch}
                />
              </div>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-[#10141d] p-4 sm:p-5">
              <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                <GitBranch aria-hidden="true" className="h-4 w-4 text-coral" />
                Working tree
              </h2>
              <ul className="space-y-1">
                {gitChanges.map((change) => (
                  <li key={change.file} className="flex items-center gap-2 rounded-md px-2 py-1 font-mono text-[10px] text-slate-400">
                    <span
                      className={`w-4 shrink-0 text-[9px] font-bold ${
                        change.state === "M" ? "text-sky-300" : change.state === "A" ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {change.state}
                    </span>
                    <span className="truncate">{change.file}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[8px] leading-4 text-slate-600">
                Uncommitted local changes. Stage and commit them in the workspace git panel, then push them to this repository.
              </p>
            </div>
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-[#10141d] p-4 sm:p-5" aria-label="Recent commits">
            <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
              <History aria-hidden="true" className="h-4 w-4 text-coral" />
              Recent commits
            </h2>
            <p className="mb-2 text-[9px] text-slate-600">Simulated commit history from the Architect workspace.</p>
            <CommitHistory commits={gitHistory} />
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-[#10141d] p-4 sm:p-5" aria-label="Pull requests">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
                <GitPullRequest aria-hidden="true" className="h-4 w-4 text-coral" />
                Pull requests
              </h2>
              <button
                className="flex h-7 items-center gap-1.5 rounded-md bg-coral px-2.5 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                onClick={() => setPrDialog({ open: true, compare: github.branch })}
                type="button"
              >
                <GitPullRequest aria-hidden="true" className="h-3 w-3" />
                New pull request
              </button>
            </div>
            {pullRequests.length === 0 ? (
              <p className="py-6 text-center text-[10px] text-slate-600">No pull requests for this repository yet.</p>
            ) : (
              <ul className="space-y-2">
                {pullRequests.map((pr) => {
                  const active = expandedPr === pr.number || prStatus(pr) === "open";
                  return (
                    <li key={pr.number} className="rounded-lg border border-white/[0.06] bg-white/[0.02]">
                      <button
                        aria-expanded={active}
                        className="flex w-full flex-wrap items-center gap-2 rounded-lg px-3 py-2.5 text-left transition hover:bg-white/[0.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                        onClick={() => setExpandedPr((prev) => (prev === pr.number ? null : pr.number))}
                        type="button"
                      >
                        <span className="font-mono text-[11px] font-semibold text-coral">#{pr.number}</span>
                        <span className="min-w-0 flex-1 truncate text-[11px] text-slate-300">{pr.title}</span>
                        <GithubStatus
                          label={prStatus(pr) === "merged" ? "Merged" : prStatus(pr) === "closed" ? "Closed" : "Open"}
                          tone={prStatus(pr) === "open" ? "success" : prStatus(pr) === "merged" ? "success" : "neutral"}
                        />
                        <span className="hidden text-[9px] text-slate-600 sm:inline">
                          {pr.base} ← {pr.compare} · {pr.changedFiles} files
                        </span>
                      </button>
                      {active && (
                        <div className="border-t border-white/[0.06] p-3">
                          <PullRequestDetails onMerge={() => mergePr(pr)} pr={{ ...pr, status: prStatus(pr) }} />
                        </div>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
            <p className="mt-3 text-[8px] leading-4 text-slate-600">{githubSimulatedNote} Pull requests shown here are mock or created by you in this browser session.</p>
          </section>

          <section className="rounded-xl border border-white/[0.08] bg-[#10141d] p-4 sm:p-5" aria-label="Architect checks">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Upload aria-hidden="true" className="h-4 w-4 text-coral" />
              Repository status
            </h2>
            <GithubChecks checks={githubChecks} />
            <p className="mt-3 text-[8px] leading-4 text-slate-600">
              State is persisted in this browser under <code className="rounded bg-white/[0.05] px-1 text-coral">architect-demo-github</code> in localStorage and shared with the workspace. No credentials, tokens, or personal data leave this machine.
            </p>
          </section>
        </div>
      )}

      {githubModalOpen && <GithubConnectionModal github={github} onClose={() => setGithubModalOpen(false)} />}
      {prDialog.open && (
        <PullRequestDialog
          changedFiles={gitChanges.length}
          defaultCompare={prDialog.compare}
          github={github}
          onClose={() => setPrDialog((prev) => ({ ...prev, open: false }))}
          onNotice={showNotice}
        />
      )}
    </div>
  );
}