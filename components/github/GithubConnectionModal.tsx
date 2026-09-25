"use client";

import { GitFork, GitPullRequest, KeyRound, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { githubConnectedNote, githubOAuthNote } from "@/data/github";
import { GithubBranchPicker } from "./GithubBranchPicker";
import { GithubDialog } from "./GithubDialog";
import { GithubRepositoryPicker } from "./GithubRepositoryPicker";
import { GithubStatus } from "./GithubStatus";
import type { GithubState } from "./useGithubState";

type GithubConnectionModalProps = {
  github: GithubState;
  onClose: () => void;
};

const permissions = [
  { icon: GitFork, label: "Read your repositories" },
  { icon: GitPullRequest, label: "Create and update pull requests on your behalf" },
  { icon: KeyRound, label: "Manage deploy keys for repositories" },
];

export function GithubConnectionModal({ github, onClose }: GithubConnectionModalProps) {
  const [clearing, setClearing] = useState(false);

  return (
    <GithubDialog title="Connect GitHub" labelledBy="github-connect-title" onClose={onClose} wide>
      <span className="sr-only" id="github-connect-title">
        Connect GitHub
      </span>

      {!github.connected ? (
        <div>
          <div className="flex items-center gap-3 rounded-md border border-white/[0.07] bg-[#0b0f19] p-3">
            <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-coral/15 text-sm font-semibold text-coral">
              {github.identity.name
                .split(" ")
                .map((part) => part[0])
                .join("")}
            </span>
            <div className="min-w-0">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                {github.identity.name}
                <GithubStatus label={`@${github.identity.login}`} tone="neutral" />
              </p>
              <p className="text-[9px] text-slate-500">This is a simulated tester account — not a real GitHub identity.</p>
            </div>
          </div>

          <div className="mt-4">
            <h3 className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">
              Architect would like to permission your GitHub account
            </h3>
            <ul className="mt-2 space-y-1.5">
              {permissions.map((permission) => (
                <li key={permission.label} className="flex items-center gap-2 text-[10px] text-slate-300">
                  <permission.icon aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                  {permission.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-4 rounded-md border border-sky-400/20 bg-sky-400/[0.06] p-3">
            <p className="text-[9px] leading-4 text-sky-200">{githubOAuthNote}</p>
            <p className="mt-1.5 text-[8px] leading-4 text-slate-500">
              If this were production, starting the OAuth flow would open GitHub&#39;s own consent screen. Here it is simulated end-to-end.
            </p>
          </div>

          {github.connectError && (
            <div className="mt-3 rounded-md border border-rose-400/20 bg-rose-500/[0.05] p-2.5 text-[9px] leading-4 text-rose-200" role="alert">
              <p>{github.connectError}</p>
              <p className="mt-1 text-[8px] leading-4 text-slate-500">
                Turn off &#8220;Simulate demo failures&#8221; below, then connect again.
              </p>
            </div>
          )}

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/[0.07] pt-3">
            <button className="rounded-md px-3 py-1.5 text-[10px] text-slate-400 transition hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60" onClick={onClose} type="button">
              Cancel
            </button>
            <button
              className="flex h-8 items-center gap-1.5 rounded-md bg-coral px-3.5 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              disabled={github.connecting}
              onClick={() => github.connect()}
              type="button"
            >
              {github.connecting ? <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> : null}
              {github.connecting ? "Connecting…" : "Connect with GitHub"}
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-white">
              <GithubStatus label={`@${github.identity.login}`} tone="success" />
              Connected
            </p>
            <button
              className="flex items-center gap-1.5 rounded-md border border-white/[0.1] px-2 py-1 text-[9px] text-slate-400 transition hover:border-rose-400/30 hover:text-rose-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
              onClick={() => {
                github.disconnect();
                setClearing(false);
              }}
              type="button"
            >
              Disconnect
            </button>
          </div>
          <p className="mt-1 text-[8px] text-slate-600">{githubConnectedNote}</p>

          <div className="mt-4">
            <h3 className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-slate-500">Repository</h3>
            <GithubRepositoryPicker
              created={github.createdRepositories}
              selectedId={github.repo?.id ?? null}
              onSelect={(id) => {
                setClearing(false);
                github.selectRepo(id);
              }}
              onCreated={(repo) => {
                github.registerCreatedRepo(repo);
                github.selectRepo(repo.id);
              }}
            />
            {clearing ? (
              <p className="mt-2 flex items-center gap-1.5 text-[9px]">
                <span className="text-slate-500">Repository connection cleared in browser state.</span>
                <button
                  className="text-coral underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                  onClick={() => setClearing(false)}
                  type="button"
                >
                  Dismiss
                </button>
              </p>
            ) : (
              <button
                className="mt-2 text-[9px] text-slate-500 underline-offset-2 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                onClick={() => {
                  github.clearSelectedRepo();
                  setClearing(true);
                }}
                type="button"
              >
                Clear repository selection
              </button>
            )}
          </div>

          <div className="mt-4">
            <h3 className="mb-2 text-[9px] font-semibold uppercase tracking-wide text-slate-500">Branch</h3>
            <GithubBranchPicker
              branches={github.branches}
              onSelect={github.selectBranch}
              onCreate={github.createBranch}
              selected={github.branch}
            />
          </div>
        </div>
      )}

      <div className="mt-4">
        <label className="flex cursor-pointer items-start gap-2 rounded-md border border-white/[0.07] bg-[#0b0f19] p-3">
          <input
            aria-describedby="demo-failure-hint"
            className="mt-0.5 h-3 w-3 accent-coral"
            checked={github.demoFailures}
            onChange={(event) => github.setDemoFailures(event.target.checked)}
            type="checkbox"
          />
          <span>
            <span className="block text-[10px] font-medium text-slate-300">Simulate demo failures</span>
            <span className="mt-0.5 block text-[8px] leading-4 text-slate-600" id="demo-failure-hint">
              While enabled, connect, sync, push, and pull request actions fail so the error + retry flow can be shown. Turn it off to recover.
            </span>
          </span>
        </label>
      </div>

      <p className="mt-3 text-[8px] leading-4 text-slate-600">
        Your connection state is stored only in this browser (localStorage, key{" "}
        <code className="rounded bg-white/[0.05] px-1 text-coral">architect-demo-github</code>). No credentials, tokens, or personal data leave this machine.
      </p>
    </GithubDialog>
  );
}