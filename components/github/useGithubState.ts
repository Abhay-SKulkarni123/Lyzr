"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  githubChecks,
  githubIdentity,
  mergeBranches,
  nextPrNumber,
  repoById,
  seedPullRequests,
  type GithubPullRequest,
  type GithubRepository,
  type GithubSyncPhase,
} from "@/data/github";
import { gitMockBranches } from "@/data/developer";
import { loadGithubSnapshot, saveGithubSnapshot } from "@/lib/github-storage";

export type PullRequestInput = {
  base: string;
  compare: string;
  title: string;
  description: string;
  changedFiles: number;
};

type UseGithubStateArgs = {
  onNotice?: (message: string) => void;
  defaultRepoId?: string;
};

export function useGithubState({ onNotice, defaultRepoId = "saas-analytics" }: UseGithubStateArgs) {
  const [snapshot, setSnapshot] = useState(() => loadGithubSnapshot());
  const [connecting, setConnecting] = useState(false);
  const [syncPhase, setSyncPhase] = useState<GithubSyncPhase>("idle");
  const [connectError, setConnectError] = useState<string | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  const timeoutRef = useRef<number | null>(null);
  const demoFailuresRef = useRef(snapshot.demoFailures);
  demoFailuresRef.current = snapshot.demoFailures;

  const schedule = (fn: () => void, ms: number) => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(fn, ms);
  };

  useEffect(() => {
    saveGithubSnapshot(snapshot);
  }, [snapshot]);

  useEffect(
    () => () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    },
    []
  );

  const repo = useMemo(() => {
    const created = snapshot.createdRepositories.find((item) => item.id === snapshot.repoId);
    return repoById(snapshot.repoId) ?? created;
  }, [snapshot.repoId, snapshot.createdRepositories]);
  const branch = snapshot.branch ?? repo?.defaultBranch ?? "main";
  const branches = useMemo(() => {
    const local = repo?.branches ?? gitMockBranches;
    return mergeBranches(local, snapshot.createdBranches);
  }, [repo, snapshot.createdBranches]);

  const pullRequests = useMemo(() => {
    const seeds = repo ? seedPullRequests.filter((pr) => pr.repoId === repo.id) : [];
    return [...snapshot.pullRequests, ...seeds].sort((a, b) => b.number - a.number);
  }, [repo, snapshot.pullRequests]);

  function connect() {
    if (connecting || snapshot.connected) return;
    if (snapshot.demoFailures) {
      setConnectError("Connection failed — GitHub is unavailable in this simulated demo (demo failure mode is on).");
      onNotice?.("GitHub connection failed (simulated).");
      return;
    }
    setConnectError(null);
    setConnecting(true);
    schedule(() => {
      setConnecting(false);
      setSnapshot((prev) => ({
        ...prev,
        connected: true,
        repoId: prev.repoId ?? defaultRepoId,
        branch: prev.branch ?? "main",
        lastSyncedAt: prev.lastSyncedAt ?? "Just now",
      }));
      onNotice?.("Connected to GitHub as @abhay-demo (simulated).");
    }, 700);
  }

  function disconnect() {
    setSnapshot((prev) => ({
      ...prev,
      connected: false,
      repoId: null,
      branch: "main",
      lastSyncedAt: null,
      pushedHead: null,
    }));
    setSyncPhase("idle");
    setConnectError(null);
    onNotice?.("Disconnected from GitHub — your local project remains unchanged.");
  }

  function selectRepo(id: string) {
    const target = repoById(id) ?? snapshot.createdRepositories.find((item) => item.id === id);
    if (!target) return;
    setSnapshot((prev) => {
      const current = prev.branch;
      const valid = current && target.branches.includes(current) ? current : target.defaultBranch;
      return { ...prev, repoId: id, branch: valid };
    });
    onNotice?.(`Selected repository ${id} (simulated).`);
  }

  function clearSelectedRepo() {
    setSnapshot((prev) => ({ ...prev, repoId: null, branch: "main" }));
  }

  function selectBranch(name: string) {
    setSnapshot((prev) => ({ ...prev, branch: name }));
    onNotice?.(`Switched to branch ${name} (simulated).`);
  }

  function createBranch(name: string) {
    const trimmed = name.trim().replace(/\s+/g, "-").toLowerCase();
    if (!trimmed) return;
    setSnapshot((prev) => ({
      ...prev,
      createdBranches: prev.createdBranches.includes(trimmed) ? prev.createdBranches : [...prev.createdBranches, trimmed],
      branch: trimmed,
    }));
    onNotice?.(`Branch ${trimmed} created (simulated).`);
  }

  function registerCreatedRepo(repo: GithubRepository) {
    setSnapshot((prev) =>
      prev.createdRepositories.some((item) => item.id === repo.id)
        ? prev
        : { ...prev, createdRepositories: [...prev.createdRepositories, repo] }
    );
  }

  function sync() {
    if (syncPhase === "syncing" || syncPhase === "checking" || syncPhase === "comparing") return;
    setSyncError(null);
    setSyncPhase("syncing");
    schedule(() => {
      setSyncPhase("checking");
      schedule(() => {
        if (demoFailuresRef.current) {
          setSyncPhase("error");
          setSyncError("Sync failed — repository unreachable (simulated demo failure).");
          onNotice?.("GitHub sync failed (simulated).");
          return;
        }
        setSyncPhase("comparing");
        schedule(() => {
          setSyncPhase("done");
          setSnapshot((prev) => ({ ...prev, lastSyncedAt: "Just now" }));
          onNotice?.("GitHub sync complete — repository is up to date (simulated).");
        }, 450);
      }, 450);
    }, 450);
  }

  function push(headHash: string): boolean {
    if (snapshot.demoFailures) {
      onNotice?.("Push to GitHub failed (simulated demo failure).");
      return false;
    }
    setSnapshot((prev) => ({ ...prev, pushedHead: headHash, lastSyncedAt: "Just now" }));
    return true;
  }

  function createPullRequest(input: PullRequestInput): { ok: boolean; pr?: GithubPullRequest; error?: string } {
    if (!snapshot.connected) {
      return { ok: false, error: "Connect GitHub before creating a pull request." };
    }
    if (snapshot.demoFailures) {
      onNotice?.("Pull request creation failed (simulated demo failure).");
      return { ok: false, error: "Pull request creation failed — the remote rejected the update (simulated)." };
    }
    const number = nextPrNumber(snapshot.pullRequests);
    const pr: GithubPullRequest = {
      number,
      repoId: snapshot.repoId ?? defaultRepoId,
      title: input.title.trim() || "Untitled pull request",
      description: input.description.trim(),
      author: githubIdentity.login,
      base: input.base,
      compare: input.compare,
      changedFiles: input.changedFiles,
      checks: [...githubChecks],
      status: "open",
      createdTime: "Just now",
    };
    setSnapshot((prev) => ({ ...prev, pullRequests: [pr, ...prev.pullRequests] }));
    onNotice?.(`Pull request #${number} created (simulated).`);
    return { ok: true, pr };
  }

  function mergePullRequest(number: number) {
    setSnapshot((prev) => ({
      ...prev,
      pullRequests: prev.pullRequests.map((pr) => (pr.number === number && pr.status === "open" ? { ...pr, status: "merged" } : pr)),
    }));
    onNotice?.("Pull request merged — simulated, no remote merge occurred.");
  }

  function setDemoFailures(enabled: boolean) {
    setSnapshot((prev) => ({ ...prev, demoFailures: enabled }));
  }

  return {
    connected: snapshot.connected,
    connecting,
    identity: githubIdentity,
    repo,
    branch,
    branches,
    createdBranches: snapshot.createdBranches,
    createdRepositories: snapshot.createdRepositories,
    pullRequests,
    lastSyncedAt: snapshot.lastSyncedAt,
    pushedHead: snapshot.pushedHead,
    syncPhase,
    syncStatus: syncPhase === "error" ? ("error" as const) : syncPhase === "done" || syncPhase === "checking" || syncPhase === "comparing" ? ("syncing" as const) : ("idle" as const),
    connectError,
    syncError,
    demoFailures: snapshot.demoFailures,
    connect,
    disconnect,
    selectRepo,
    clearSelectedRepo,
    selectBranch,
    createBranch,
    registerCreatedRepo,
    sync,
    push,
    createPullRequest,
    mergePullRequest,
    setDemoFailures,
  };
}

export type GithubState = ReturnType<typeof useGithubState>;