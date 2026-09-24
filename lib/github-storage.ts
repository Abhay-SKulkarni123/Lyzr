import { defaultGithubSnapshot, type GithubSnapshot } from "@/data/github";

const STORAGE_KEY = "architect-demo-github";

export function loadGithubSnapshot(): GithubSnapshot {
  if (typeof window === "undefined") return { ...defaultGithubSnapshot };
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaultGithubSnapshot };
    const parsed = JSON.parse(raw) as Partial<GithubSnapshot>;
    return { ...defaultGithubSnapshot, ...parsed };
  } catch {
    return { ...defaultGithubSnapshot };
  }
}

export function saveGithubSnapshot(snapshot: GithubSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage unavailable (private mode / quota) — keep the mock working in memory.
  }
}

export function clearGithubSnapshot(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}