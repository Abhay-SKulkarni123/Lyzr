"use client";

import type { DeploymentRecord } from "@/data/deployment";
import { DeploymentHistoryItem } from "./DeploymentHistoryItem";

type DeploymentHistoryProps = {
  records: DeploymentRecord[];
  onSelect: (record: DeploymentRecord) => void;
  limit?: number;
};

function groupByEnvironment(records: DeploymentRecord[]) {
  const order: Array<"production" | "preview"> = ["production", "preview"];
  const groups = new Map<"production" | "preview", DeploymentRecord[]>();
  for (const environment of order) groups.set(environment, []);
  for (const record of records) groups.get(record.environment)?.push(record);
  return groups;
}

export function DeploymentHistory({ records, onSelect, limit }: DeploymentHistoryProps) {
  const groups = groupByEnvironment(records);
  const hasAny = records.length > 0;

  return (
    <div className="space-y-4" aria-label="Deployment history">
      {!hasAny && (
        <p className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-[10px] text-slate-600">
          No deployments yet. Deploy the project to see its history here.
        </p>
      )}
      {(["production", "preview"] as const).map((environment) => {
        const group = groups.get(environment) ?? [];
        const shown = limit != null ? group.slice(0, limit) : group;
        if (shown.length === 0) return null;
        return (
          <section key={environment}>
            <h2 className="mb-1.5 flex items-center gap-2 px-0.5 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
              {environment}
              <span className="rounded-full border border-white/[0.08] px-1.5 text-[8px] font-normal normal-case text-slate-600">
                {shown.length}
              </span>
            </h2>
            <ul className="space-y-1.5" aria-label={`${environment} deployments`}>
              {shown.map((record) => (
                <li key={record.id}>
                  <button
                    className="block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                    onClick={() => onSelect(record)}
                    type="button"
                  >
                    <DeploymentHistoryItem record={record} />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}