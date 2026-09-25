import { Check, GitBranch, GitCommitHorizontal, GitPullRequest, LoaderCircle, RotateCw, Upload } from "lucide-react";
import { useState } from "react";
import { gitSimulatedNote, type GitChange, type GitChangeState, type GitCommit } from "@/data/developer";
import { repoFullName } from "@/data/github";
import type { GithubState } from "@/components/github/useGithubState";
import { GithubStatus } from "@/components/github/GithubStatus";
import { CommitHistory } from "./CommitHistory";

type GitPanelProps = {
  changes: GitChange[];
  onChangesChange: (changes: GitChange[]) => void;
  commits: GitCommit[];
  onCommitsChange: (commits: GitCommit[]) => void;
  github: GithubState;
  onNotice: (message: string) => void;
  onOpenGithub: () => void;
  onOpenPullRequest: (compare: string) => void;
};

const stateStyle: Record<GitChangeState, { label: string; className: string }> = {
  M: { label: "M", className: "text-sky-300" },
  A: { label: "A", className: "text-emerald-300" },
  D: { label: "D", className: "text-rose-300" },
};

function ChangeRow({ change, toggle }: { change: GitChange; toggle: (file: string) => void }) {
  const badge = stateStyle[change.state];
  return (
    <li>
      <button
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-left font-mono text-[10px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
          change.staged ? "bg-emerald-400/[0.06] text-slate-300 hover:bg-emerald-400/[0.1]" : "text-slate-400 hover:bg-white/[0.04]"
        }`}
        onClick={() => toggle(change.file)}
        type="button"
      >
        <span className="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-sm border border-white/[0.15]">
          {change.staged ? <Check aria-hidden="true" className="h-2.5 w-2.5 text-emerald-300" /> : <span className={`text-[8px] font-bold ${badge.className}`}>{badge.label}</span>}
        </span>
        <span className="truncate">{change.file}</span>
      </button>
    </li>
  );
}

export function GitPanel({ changes, onChangesChange, commits, onCommitsChange, github, onNotice, onOpenGithub, onOpenPullRequest }: GitPanelProps) {
  const [message, setMessage] = useState("");
  const [committing, setCommitting] = useState(false);
  const [pushing, setPushing] = useState(false);

  const staged = changes.filter((change) => change.staged).length;
  const unstaged = changes.length - staged;

  function toggle(file: string) {
    onChangesChange(changes.map((change) => (change.file === file ? { ...change, staged: !change.staged } : change)));
  }

  function stageAll() {
    onChangesChange(changes.map((change) => ({ ...change, staged: true })));
  }

  function commit() {
    if (committing || changes.length === 0) return;
    setCommitting(true);
    window.setTimeout(() => {
      const hash = Array.from({ length: 7 }, () => "0123456789abcdef"[Math.floor(Math.random() * 16)]).join("");
      onCommitsChange([
        { hash, message: message.trim() || "Update dashboard components", author: "Abhay Sharma", time: "Just now" },
        ...commits,
      ]);
      onChangesChange([]);
      setMessage("");
      setCommitting(false);
      onNotice(`Committed ${hash} in simulated history.`);
    }, 900);
  }

  function push() {
    if (pushing) return;
    if (!github.connected) {
      onOpenGithub();
      return;
    }
    setPushing(true);
    window.setTimeout(() => {
      const head = commits[0];
      const ok = github.push(head?.hash ?? "");
      setPushing(false);
      if (ok) {
        onNotice(`Pushed to GitHub · ${repoFullName(github.repo)} · ${github.branch}${head ? ` · ${head.hash} ${head.message}` : ""} (simulated).`);
      } else {
        onNotice(github.syncError ?? "Push failed. Try again.");
      }
    }, 600);
  }

  function openPullRequest() {
    if (!github.connected) {
      onOpenGithub();
      return;
    }
    onOpenPullRequest(github.branch);
  }

  return (
    <section className="mx-auto w-full max-w-[760px] rounded-lg border border-white/[0.08] bg-[#10141d] p-4 sm:p-6" aria-label="Source control">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-white">
            <GitBranch aria-hidden="true" className="h-4 w-4 text-coral" />
            Source control
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">Simulated git workflow for this project.</p>
        </div>
        <div className="flex items-center gap-2">
          {github.connected ? (
            <GithubStatus label={`Connected · @${github.identity.login}`} tone="success" />
          ) : (
            <button
              className="rounded-md border border-white/[0.1] px-2 py-1 text-[9px] text-slate-400 transition hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              onClick={onOpenGithub}
              type="button"
            >
              Connect GitHub
            </button>
          )}
          <label className="flex items-center gap-2 text-[9px] text-slate-500">
            <GitBranch aria-hidden="true" className="h-3 w-3" />
            <span className="sr-only">Branch</span>
            <select
              className="h-7 rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 text-[10px] text-slate-300 outline-none focus:border-coral/40"
              value={github.branch}
              onChange={(event) => github.selectBranch(event.target.value)}
            >
              {github.branches.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5 text-[9px] text-slate-500">
        <span className="rounded-full border border-white/[0.08] px-2 py-1">{staged} staged</span>
        <span className="rounded-full border border-white/[0.08] px-2 py-1">{unstaged} changed</span>
        <span className="rounded-full border border-white/[0.08] px-2 py-1">0 conflicts</span>
      </div>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-white/[0.07] bg-white/[0.015] p-3">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">Changes</h3>
            <button
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[8px] text-slate-500 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              onClick={stageAll}
              type="button"
            >
              <RotateCw aria-hidden="true" className="h-2.5 w-2.5" />
              Stage all
            </button>
          </div>
          <ul className="workspace-scrollbar max-h-44 space-y-0.5 overflow-auto">
            {changes.map((change) => (
              <ChangeRow key={change.file} change={change} toggle={toggle} />
            ))}
            {changes.length === 0 && <li className="py-4 text-center text-[9px] text-slate-600">Working tree clean.</li>}
          </ul>
        </div>

        <div className="rounded-md border border-white/[0.07] bg-white/[0.015] p-3">
          <h3 className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-slate-500">Commit &amp; push</h3>
          <label>
            <span className="sr-only">Commit message</span>
            <input
              className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-coral/40"
              placeholder="Commit message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
            />
          </label>
          <div className="mt-2 flex items-center gap-1.5">
            <button
              className="flex h-7 flex-1 items-center justify-center gap-1.5 rounded-md bg-coral text-[10px] font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              disabled={committing || changes.length === 0}
              onClick={commit}
              type="button"
            >
              {committing ? <LoaderCircle aria-hidden="true" className="h-3 w-3 animate-spin" /> : <GitCommitHorizontal aria-hidden="true" className="h-3 w-3" />}
              {committing ? "Committing..." : "Commit"}
            </button>
            <button
              aria-label={github.connected ? "Push to GitHub" : "Connect GitHub to push"}
              className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.12] px-3 text-[10px] font-semibold text-slate-300 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              disabled={pushing}
              onClick={push}
              type="button"
            >
              {pushing ? <LoaderCircle aria-hidden="true" className="h-3 w-3 animate-spin" /> : <Upload aria-hidden="true" className="h-3 w-3" />}
              {pushing ? "Pushing..." : github.connected ? "Push to GitHub" : "Push"}
            </button>
            <button
              aria-label="Create pull request"
              className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.12] px-3 text-[10px] font-semibold text-slate-300 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              onClick={openPullRequest}
              type="button"
            >
              <GitPullRequest aria-hidden="true" className="h-3 w-3" />
              PR
            </button>
          </div>
          {github.connected && (
            <p className="mt-2 flex items-center gap-1.5 font-mono text-[9px] text-slate-600">
              <GitCommitHorizontal aria-hidden="true" className="h-3 w-3 shrink-0" />
              <span className="truncate">
                {github.repo ? repoFullName(github.repo) : "—"} · {github.branch}
              </span>
            </p>
          )}
          <p className="mt-3 text-[8px] leading-4 text-slate-600">{gitSimulatedNote} Commits and pushes are simulated locally and never touch the real repository.</p>
        </div>
      </div>

      <CommitHistory commits={commits} />
    </section>
  );
}