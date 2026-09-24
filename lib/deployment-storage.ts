import { defaultDeploymentSnapshot, type DeploymentSnapshot } from "@/data/deployment";

const STORAGE_KEY = "architect-demo-deployment";

export function loadDeploymentSnapshot(): DeploymentSnapshot {
  if (typeof window === "undefined") return withNormalizedActive(defaultDeploymentSnapshot);
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return withNormalizedActive(defaultDeploymentSnapshot);
    const parsed = JSON.parse(raw) as Partial<DeploymentSnapshot>;
    return withNormalizedActive({ ...defaultDeploymentSnapshot, ...parsed });
  } catch {
    return withNormalizedActive(defaultDeploymentSnapshot);
  }
}

function withNormalizedActive(snapshot: DeploymentSnapshot): DeploymentSnapshot {
  const active = snapshot.activeRecordId ? snapshot.records.find((record) => record.id === snapshot.activeRecordId) : undefined;
  if (!active || active.status === "ready" || active.status === "failed" || active.status === "cancelled") {
    return snapshot;
  }
  return {
    ...snapshot,
    records: snapshot.records.map((record) => (record.id === active.id ? { ...record, status: "cancelled" as const } : record)),
  };
}

export function saveDeploymentSnapshot(snapshot: DeploymentSnapshot): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    // Storage unavailable — keep the mock working in memory.
  }
}

export function clearDeploymentSnapshot(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}