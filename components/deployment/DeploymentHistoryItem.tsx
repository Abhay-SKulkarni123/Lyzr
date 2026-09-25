"use client";

import { Globe } from "lucide-react";
import type { DeploymentRecord, DeploymentStatus as Status } from "@/data/deployment";
import { DeploymentStatus } from "./DeploymentStatus";

const actionStatus: Record<Status, string> = {
  idle: "Deploy",
  preparing: "Deploying",
  building: "Building",
  deploying: "Publishing",
  ready: "Ready",
  failed: "Failed",
  cancelled: "Cancelled",
};

export function DeploymentHistoryItem({ record }: { record: DeploymentRecord }) {
  return (
    <div className="flex items-center gap-3 rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-2 transition hover:border-white/[0.12]">
      <span
        aria-hidden="true"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/[0.05] text-slate-400"
      >
        <Globe className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[10px] font-medium text-slate-200">
          <span className="uppercase">{record.environment}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono text-slate-400">{record.branch}</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono text-slate-500">{record.commitSha}</span>
        </p>
        <p className="mt-0.5 text-[8px] text-slate-600">
          {record.createdAt}
          {record.duration ? ` · ${record.duration}` : ""}
          {record.url ? ` · ${record.url}` : ""}
        </p>
      </div>
      <DeploymentStatus status={record.status} label={actionStatus[record.status]} />
    </div>
  );
}