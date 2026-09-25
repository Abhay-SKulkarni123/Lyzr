"use client";

import { ArrowLeft, Globe, Rocket, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { DeploymentDetailsDialog } from "@/components/deployment/DeploymentDetailsDialog";
import { DeploymentDialog } from "@/components/deployment/DeploymentDialog";
import { DeploymentHistory } from "@/components/deployment/DeploymentHistory";
import { DeploymentLogs } from "@/components/deployment/DeploymentLogs";
import { DeploymentProgress } from "@/components/deployment/DeploymentProgress";
import { DeploymentStatus } from "@/components/deployment/DeploymentStatus";
import { useDeploymentState } from "@/components/deployment/useDeploymentState";
import { useGithubState } from "@/components/github/useGithubState";
import { deploymentSimulatedNote, type DeploymentRecord } from "@/data/deployment";
import { readProjectContext } from "@/data/scenarios";

export default function DeploymentsPage() {
  const router = useRouter();
  const context = readProjectContext();
  const github = useGithubState({});
  const deployment = useDeploymentState({ project: { name: context.name, previewUrl: context.previewUrl } });
  const projectName = context.name;
  const [details, setDetails] = useState<DeploymentRecord | null>(null);
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    },
    []
  );

  const headCommit = github.pushedHead ?? "a81d3f2";
  const active = deployment.activeRecord;
  const status = deployment.activeStatus;
  const busy = ["preparing", "building", "deploying"].includes(status);
  const current = deployment.latestReady.production;

  function showNotice(message: string) {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3600);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div className="min-w-0">
          <Link className="mb-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500 transition hover:text-slate-200" href="/workspace">
            <ArrowLeft aria-hidden="true" className="h-3 w-3" />
            Back to workspace
          </Link>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600">Delivery</p>
          <h1 className="mt-1 flex items-center gap-2.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            <Rocket aria-hidden="true" className="h-7 w-7 text-coral" />
            Deployments
          </h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Production and preview deployments, shared with the workspace.
            {deployment.live ? " Your app is live." : " Nothing is live yet. Deploy from the workspace."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {busy && (
            <button className="rounded-md border border-white/[0.12] px-2.5 py-1 text-[10px] text-slate-300 transition hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400/60" onClick={deployment.cancel} type="button">
              Cancel
            </button>
          )}
          <button
            className="flex h-8 items-center gap-1.5 rounded-md bg-coral px-3 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            onClick={() => setDeployDialogOpen(true)}
            type="button"
          >
            <Rocket aria-hidden="true" className="h-3.5 w-3.5" />
            {busy ? "Deploying..." : "New deployment"}
          </button>
        </div>
      </div>

      {notice && (
        <div className="sticky top-3 z-20 mb-4 rounded-lg border border-white/10 bg-[#202734] px-3 py-2 text-center text-[10px] text-slate-200 shadow-xl" role="status">
          {notice}
        </div>
      )}

      <section className="mb-5 grid gap-5 lg:grid-cols-3" aria-label="Current production deployment">
        <div className="rounded-xl border border-white/[0.08] bg-[#10141d] p-4 sm:p-5 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Globe aria-hidden="true" className="h-4 w-4 text-coral" />
              {current ? "Production deployment" : "No production deployment yet"}
            </h2>
            <DeploymentStatus status={status} />
          </div>
          {current && !busy ? (
            <div className="mt-4">
              <p className="font-mono text-[13px] text-emerald-300">{current.url}</p>
              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-slate-500">
                <span className="rounded border border-white/[0.08] px-1.5 py-0.5 uppercase text-slate-400">{current.environment}</span>
                <span className="font-mono">{current.branch}</span>
                <span className="font-mono">{current.commitSha}</span>
                <span>{current.duration}</span>
                <span className="ml-auto flex items-center gap-2">
                  <button
                    className="rounded-md border border-emerald-400/30 px-2.5 py-1 text-[9px] font-medium text-emerald-200 transition hover:bg-emerald-400/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
                    onClick={() => router.push("/deployments/live")}
                    type="button"
                  >
                    Open live app →
                  </button>
                  <button
                    className="flex items-center gap-1 rounded-md border border-white/[0.12] px-2.5 py-1 text-[9px] text-slate-300 transition hover:border-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                    onClick={() => deployment.retry()}
                    type="button"
                  >
                    <RotateCcw aria-hidden="true" className="h-3 w-3" />
                    Redeploy
                  </button>
                </span>
              </p>
            </div>
          ) : busy && active ? (
            <div className="mt-4">
              <DeploymentProgress branch={active.branch} commitSha={active.commitSha} environment={active.environment} status={status} />
            </div>
          ) : (
            <p className="mt-4 text-[10px] text-slate-600">Deploy the project to publish the production environment.</p>
          )}
          {(status === "failed" || status === "cancelled") && active && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-md border border-rose-400/25 bg-rose-500/[0.05] px-3 py-2.5">
              <p className="flex-1 text-[10px] text-rose-200">The build could not be completed{status === "cancelled" ? " (cancelled)" : ""}.</p>
              <button
                className="flex items-center gap-1.5 rounded-md bg-coral px-2.5 py-1 text-[9px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                onClick={deployment.retry}
                type="button"
              >
                <RotateCcw aria-hidden="true" className="h-3 w-3" />
                Retry deployment
              </button>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#10141d] p-4 sm:p-5" aria-label="Deployment configuration">
          <h2 className="mb-3 text-sm font-semibold text-white">Configuration</h2>
          <ul className="space-y-2 text-[10px]">
            <li className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
              <span className="text-slate-500">Framework</span>
              <span className="text-slate-300">{deployment.config.framework}</span>
            </li>
            <li className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
              <span className="text-slate-500">Build command</span>
              <span className="font-mono text-slate-300">{deployment.config.buildCommand}</span>
            </li>
            <li className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
              <span className="text-slate-500">Output directory</span>
              <span className="font-mono text-slate-300">{deployment.config.outputDirectory}</span>
            </li>
            <li className="flex items-center justify-between rounded-md border border-white/[0.06] bg-white/[0.02] px-2.5 py-2">
              <span className="text-slate-500">Branch</span>
              <span className="font-mono text-slate-300">{github.branch}</span>
            </li>
          </ul>
          <label className="mt-3 flex cursor-pointer items-start gap-2 rounded-md border border-white/[0.06] bg-[#0b0f19] p-3">
            <input
              aria-describedby="deploy-failure-hint"
              className="mt-0.5 h-3 w-3 accent-coral"
              checked={deployment.simulateFailure}
              onChange={(event) => deployment.setSimulateFailure(event.target.checked)}
              type="checkbox"
            />
            <span className="text-[9px] leading-4 text-slate-400" id="deploy-failure-hint">
              Simulate deployment failure
            </span>
          </label>
        </div>
      </section>

      {busy && active && (
        <section className="mb-5 rounded-xl border border-white/[0.08] bg-[#10141d] p-4 sm:p-5" aria-label="Deployment logs">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-white">Logs</h2>
            <DeploymentStatus status={status} />
          </div>
          <DeploymentLogs compact logs={active.logs} />
        </section>
      )}

      <section className="rounded-xl border border-white/[0.08] bg-[#10141d] p-4 sm:p-5" aria-label="Deployment history">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold text-white">History</h2>
          <button
            className="rounded-md border border-white/[0.12] px-2 py-1 text-[9px] text-slate-400 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            onClick={() => deployment.resetDemo()}
            type="button"
          >
            Reset demo data
          </button>
        </div>
        <DeploymentHistory records={deployment.records} onSelect={setDetails} />
        <p className="mt-3 text-[8px] leading-4 text-slate-600">
          {deploymentSimulatedNote} State is persisted in this browser under <code className="rounded bg-white/[0.05] px-1 text-coral">architect-demo-deployment</code> in localStorage and shared with the workspace. No real infrastructure, credentials, or builds run during this flow.
        </p>
      </section>

      {details && (
        <DeploymentDetailsDialog
          busy={busy}
          onClose={() => setDetails(null)}
          onRetry={() => {
            setDetails(null);
            deployment.retry();
            showNotice("Deployment restarted (simulated).");
          }}
          record={details}
        />
      )}
      {deployDialogOpen && (
        <DeploymentDialog
          branches={github.branches}
          commitSha={headCommit}
          deployment={deployment}
          onClose={() => setDeployDialogOpen(false)}
          onOpenLiveApp={() => router.push("/deployments/live")}
          onOpenPreview={() => router.push("/workspace")}
          onViewDeployments={() => setDeployDialogOpen(false)}
          projectName={projectName}
        />
      )}
    </div>
  );
}