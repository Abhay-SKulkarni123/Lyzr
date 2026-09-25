"use client";

import { RotateCcw, Settings2 } from "lucide-react";
import { useState } from "react";
import { deploymentSimulatedNote, type DeploymentRecord } from "@/data/deployment";
import { DeploymentConfig } from "./DeploymentConfig";
import { DeploymentDetailsDialog } from "./DeploymentDetailsDialog";
import { DeploymentHistory } from "./DeploymentHistory";
import { DeploymentLogs } from "./DeploymentLogs";
import { DeploymentProgress } from "./DeploymentProgress";
import { DeploymentStatus } from "./DeploymentStatus";
import type { DeploymentState } from "./useDeploymentState";

type DeploymentPanelProps = {
  deployment: DeploymentState;
  branch: string;
  commitSha: string;
  projectName: string;
  onOpenLiveApp: () => void;
};

export function DeploymentPanel({ deployment, branch, commitSha, projectName, onOpenLiveApp }: DeploymentPanelProps) {
  const [details, setDetails] = useState<DeploymentRecord | null>(null);
  const [showConfig, setShowConfig] = useState(false);
  const status = deployment.activeStatus;
  const busy = ["preparing", "building", "deploying"].includes(status);

  return (
    <div className="workspace-scrollbar h-full space-y-4 overflow-y-auto p-4" aria-live="polite">
      <div className="flex flex-wrap items-center gap-2">
        <h2 className="text-xs font-semibold text-white">Deployment</h2>
        <DeploymentStatus status={status} />
        {busy && (
          <button
            className="rounded-md border border-white/[0.12] px-2 py-0.5 text-[9px] text-slate-300 transition hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
            onClick={deployment.cancel}
            type="button"
          >
            Cancel
          </button>
        )}
        <span className="ml-auto flex items-center gap-1.5">
          <button
            aria-label="Deployment configuration"
            aria-pressed={showConfig}
            className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.1] text-slate-400 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            onClick={() => setShowConfig((prev) => !prev)}
            type="button"
          >
            <Settings2 aria-hidden="true" className="h-3.5 w-3.5" />
          </button>
          <button
            className="flex h-7 items-center gap-1.5 rounded-md bg-coral px-2.5 text-[9px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 disabled:opacity-60"
            disabled={busy}
            onClick={() => deployment.deploy({ projectName, branch, commitSha })}
            type="button"
          >
            {busy ? "Deploying..." : status === "ready" ? "Redeploy" : "Deploy"}
          </button>
        </span>
      </div>

      {busy && deployment.activeRecord && (
        <DeploymentProgress
          branch={deployment.activeRecord.branch}
          commitSha={deployment.activeRecord.commitSha}
          environment={deployment.activeRecord.environment}
          status={status}
        />
      )}
      {!busy && status === "ready" && deployment.activeRecord && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-emerald-400/20 bg-emerald-400/[0.05] px-3 py-2.5">
          <p className="flex-1 text-[10px] text-emerald-200">
            {deployment.activeRecord.projectName} is live · <span className="font-mono">{deployment.activeRecord.url}</span>
          </p>
          <button
            className="rounded-md border border-emerald-400/30 px-2 py-1 text-[9px] font-medium text-emerald-200 transition hover:bg-emerald-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
            onClick={onOpenLiveApp}
            type="button"
          >
            Open live app →
          </button>
        </div>
      )}
      {!busy && (status === "failed" || status === "cancelled") && deployment.activeRecord && (
        <div className="flex flex-wrap items-center gap-2 rounded-md border border-rose-400/25 bg-rose-500/[0.05] px-3 py-2.5">
          <p className="flex-1 text-[10px] text-rose-200">
            The build could not be completed{status === "cancelled" ? " (cancelled)" : ""}.
          </p>
          <button
            className="flex items-center gap-1 rounded-md bg-coral px-2.5 py-1 text-[9px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            onClick={deployment.retry}
            type="button"
          >
            <RotateCcw aria-hidden="true" className="h-3 w-3" />
            Retry deployment
          </button>
        </div>
      )}

      {showConfig && (
        <section className="rounded-md border border-white/[0.07]" aria-label="Deployment configuration">
          <div className="border-b border-white/[0.06] px-3 py-2.5">
            <h3 className="text-[10px] font-semibold text-slate-200">Configuration</h3>
          </div>
          <div className="p-3">
            <DeploymentConfig config={deployment.config} onConfigChange={deployment.setConfiguration} />
          </div>
        </section>
      )}

      <section className="rounded-md border border-white/[0.07]">
        <div className="flex items-center justify-between border-b border-white/[0.06] px-3 py-2.5">
          <h3 className="text-[10px] font-semibold text-slate-200">Run</h3>
          <label className="flex cursor-pointer items-center gap-1.5 text-[9px] text-slate-400">
            Simulate deployment failure
            <input
              className="h-3 w-3 accent-coral"
              checked={deployment.simulateFailure}
              onChange={(event) => deployment.setSimulateFailure(event.target.checked)}
              type="checkbox"
            />
          </label>
        </div>
        <div className="space-y-3 p-3">
          {deployment.activeRecord ? (
            <DeploymentLogs logs={deployment.activeRecord.logs} compact={false} />
          ) : (
            <p className="py-4 text-center text-[9px] text-slate-600">No deployment has run yet in this session.</p>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <button
              className="rounded-md border border-white/[0.12] px-2 py-1 text-[9px] text-slate-400 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              onClick={deployment.resetDemo}
              type="button"
            >
              Reset demo data
            </button>
            <p className="text-[8px] text-slate-600">{deploymentSimulatedNote}</p>
          </div>
        </div>
      </section>

      <section aria-label="Deployment history">
        <DeploymentHistory records={deployment.records} onSelect={setDetails} />
      </section>

      {details && (
        <DeploymentDetailsDialog
          busy={busy}
          onClose={() => setDetails(null)}
          onRetry={deployment.retry}
          record={details}
        />
      )}
    </div>
  );
}