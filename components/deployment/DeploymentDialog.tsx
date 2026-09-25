"use client";

import { ChevronDown, Rocket, X } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import type { DeploymentEnvironment } from "@/data/deployment";
import { DeploymentConfig } from "./DeploymentConfig";
import { DeploymentFailure } from "./DeploymentFailure";
import { DeploymentLogs } from "./DeploymentLogs";
import { DeploymentProgress } from "./DeploymentProgress";
import { DeploymentSuccess } from "./DeploymentSuccess";
import type { DeploymentState } from "./useDeploymentState";

type DeploymentDialogProps = {
  deployment: DeploymentState;
  branches: string[];
  projectName: string;
  commitSha: string;
  onClose: () => void;
  onOpenPreview: () => void;
  onOpenLiveApp: () => void;
  onViewDeployments: () => void;
};

const busyStates = ["preparing", "building", "deploying"];

export function DeploymentDialog({ deployment, branches, projectName, commitSha, onClose, onOpenPreview, onOpenLiveApp, onViewDeployments }: DeploymentDialogProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [advanced, setAdvanced] = useState(false);
  const [draft, setDraft] = useState(() => ({ ...deployment.config }));

  const status = deployment.activeStatus;
  const busy = busyStates.includes(status);

  useEffect(() => {
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function onOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  function deployNow() {
    deployment.setConfiguration(draft);
    deployment.deploy(
      {
        projectName,
        environment: draft.environment,
        branch: draft.branch,
        commitSha,
      },
      draft
    );
    setAdvanced(false);
  }

  function toggleEnvironment(environment: DeploymentEnvironment) {
    setDraft((prev) => ({ ...prev, environment }));
  }

  return (
    <div
      aria-label="Deployment dialog"
      aria-modal="true"
      className="fixed inset-0 z-40 flex items-end justify-center bg-black/70 sm:items-center sm:p-4"
      onMouseDown={onOverlayClick}
      role="dialog"
    >
      <div className="workspace-scrollbar max-h-[94dvh] w-full overflow-y-auto rounded-t-2xl border border-white/[0.1] bg-[#10141d] shadow-2xl sm:max-w-lg sm:rounded-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#10141d]/95 px-4 py-3 backdrop-blur">
          <h2 className="text-sm font-semibold text-white" id="deployment-dialog-title">
            {busy ? "Deploying…" : status === "ready" ? "Deployment ready" : status === "failed" || status === "cancelled" ? "Deployment" : "Deploy project"}
          </h2>
          <button
            aria-label="Close deployment dialog"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            onClick={onClose}
            ref={closeRef}
            type="button"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="p-4 sm:p-5">
          {status === "idle" && (
            <DeployForm
              advanced={advanced}
              branches={branches}
              commitSha={commitSha}
              deployment={deployment}
              draft={draft}
              onAdvancedToggle={() => setAdvanced((prev) => !prev)}
              onClose={onClose}
              onConfigChange={(partial) => setDraft((prev) => ({ ...prev, ...partial }))}
              onDeploy={deployNow}
              onEnvironmentChange={toggleEnvironment}
              projectName={projectName}
            />
          )}

          {busy && (
            <div className="space-y-3">
              <DeploymentProgress
                branch={deployment.activeRecord?.branch ?? draft.branch}
                commitSha={deployment.activeRecord?.commitSha ?? commitSha}
                environment={deployment.activeRecord?.environment ?? draft.environment}
                status={status}
              />
              <DeploymentLogs compact logs={deployment.activeRecord?.logs ?? []} />
              <div className="flex items-center justify-between gap-2 border-t border-white/[0.07] pt-3">
                <p className="text-[8px] text-slate-600">You can leave — this view is simulated and pauses locally.</p>
                <button
                  className="rounded-md border border-white/[0.12] px-2.5 py-1 text-[10px] text-slate-300 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60"
                  onClick={deployment.cancel}
                  type="button"
                >
                  Cancel deployment
                </button>
              </div>
            </div>
          )}

          {status === "ready" && deployment.activeRecord && (
            <div className="space-y-3">
              <DeploymentSuccess
                onOpenLiveApp={onOpenLiveApp}
                onOpenPreview={onOpenPreview}
                onViewDeployments={onViewDeployments}
                record={deployment.activeRecord}
              />
              <DeploymentLogs compact logs={deployment.activeRecord.logs} />
              <p className="text-[8px] text-slate-600">
                {projectName} production deployment is simulated and shared with the /deployments page.
              </p>
            </div>
          )}

          {(status === "failed" || status === "cancelled") && (
            <div className="space-y-3">
              <DeploymentFailure busy={busy} onRetry={deployment.retry} />
              <DeploymentLogs compact logs={deployment.activeRecord?.logs ?? []} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DeployForm({
  advanced,
  branches,
  commitSha,
  deployment,
  draft,
  onAdvancedToggle,
  onClose,
  onConfigChange,
  onDeploy,
  onEnvironmentChange,
  projectName,
}: {
  advanced: boolean;
  branches: string[];
  commitSha: string;
  deployment: DeploymentState;
  draft: typeof deployment.config;
  onAdvancedToggle: () => void;
  onClose: () => void;
  onConfigChange: (partial: Partial<typeof deployment.config>) => void;
  onDeploy: () => void;
  onEnvironmentChange: (environment: DeploymentEnvironment) => void;
  projectName: string;
}) {
  return (
    <div>
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <span className="text-[10px] text-slate-500">Project</span>
          <span className="truncate text-[11px] font-medium text-slate-200">{projectName}</span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <span className="text-[10px] text-slate-500">Environment</span>
          <div className="flex items-center rounded-md border border-white/[0.08] p-0.5 text-[9px]" role="group" aria-label="Deployment environment">
            {(["production", "preview"] as DeploymentEnvironment[]).map((option) => (
              <button
                key={option}
                aria-pressed={draft.environment === option}
                className={`rounded px-2 py-1 capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
                  draft.environment === option ? "bg-white/[0.1] text-white" : "text-slate-500 hover:text-slate-300"
                }`}
                onClick={() => onEnvironmentChange(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <span className="text-[10px] text-slate-500">Branch</span>
          <select
            aria-label="Branch to deploy"
            className="rounded-md border border-white/[0.08] bg-[#0b0f19] px-2 py-1 font-mono text-[10px] text-slate-200 outline-none focus:border-coral/40"
            value={draft.branch}
            onChange={(event) => onConfigChange({ branch: event.target.value })}
          >
            {(branches.length > 0 ? branches : ["main"]).map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <span className="text-[10px] text-slate-500">Commit</span>
          <span className="font-mono text-[10px] text-slate-400">{commitSha}</span>
        </div>
        <div className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[10px] text-slate-400">
            <Rocket aria-hidden="true" className="h-3.5 w-3.5 text-coral" />
            Automatic configuration
          </p>
          <p className="mt-0.5 text-[9px] text-slate-600">
            {draft.framework} · {draft.buildCommand} · output: {draft.outputDirectory}
          </p>
        </div>
      </div>

      <button
        aria-expanded={advanced}
        className="mt-3 flex w-full items-center justify-between rounded-md px-1 py-1.5 text-[10px] font-medium text-slate-400 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
        onClick={onAdvancedToggle}
        type="button"
      >
        Advanced settings
        <ChevronDown aria-hidden="true" className={`h-3.5 w-3.5 transition ${advanced ? "rotate-180" : ""}`} />
      </button>
      {advanced && (
        <div className="mt-1 border-t border-white/[0.07] pt-3">
          <DeploymentConfig config={draft} onConfigChange={onConfigChange} />
        </div>
      )}

      <label className="mt-3 flex cursor-pointer items-start gap-2 rounded-md border border-white/[0.06] bg-[#0b0f19] p-3">
        <input
          aria-describedby="deploy-failure-hint"
          className="mt-0.5 h-3 w-3 accent-coral"
          checked={deployment.simulateFailure}
          onChange={(event) => deployment.setSimulateFailure(event.target.checked)}
          type="checkbox"
        />
        <span>
          <span className="block text-[10px] font-medium text-slate-300">Simulate deployment failure</span>
          <span className="mt-0.5 block text-[8px] leading-4 text-slate-600" id="deploy-failure-hint">
            Makes the next deployment fail during the build so the retry flow can be shown. Retry returns to normal.
          </span>
        </span>
      </label>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/[0.07] pt-3">
        <button
          className="rounded-md px-3 py-1.5 text-[10px] text-slate-400 transition hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          onClick={onClose}
          type="button"
        >
          Cancel
        </button>
        <button
          className="flex h-8 items-center gap-1.5 rounded-md bg-coral px-3.5 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          onClick={onDeploy}
          type="button"
        >
          <Rocket aria-hidden="true" className="h-3.5 w-3.5" />
          Deploy
        </button>
      </div>
    </div>
  );
}