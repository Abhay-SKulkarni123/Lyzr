"use client";

import { ArrowLeft, Globe, Rocket } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ScenarioPreview } from "@/components/workspace/ScenarioPreview";
import { useDeploymentState } from "@/components/deployment/useDeploymentState";
import { DeploymentStatus } from "@/components/deployment/DeploymentStatus";
import { DeploymentDetailsDialog } from "@/components/deployment/DeploymentDetailsDialog";
import type { DeploymentRecord } from "@/data/deployment";
import { readProjectContext, type ProjectContext } from "@/data/scenarios";

export default function LiveDeploymentPage() {
  const contextFromStorage = readProjectContext();
  const deployment = useDeploymentState({
    project: { name: contextFromStorage.name, previewUrl: contextFromStorage.previewUrl },
  });
  const [details, setDetails] = useState<DeploymentRecord | null>(null);
  const [project, setProject] = useState<ProjectContext | null>(null);
  const liveRecord = deployment.latestReady.production;

  useEffect(() => {
    setProject(readProjectContext());
  }, []);

  const context = project ?? { scenarioId: "saas-analytics", name: "SaaS Analytics", packageName: "northstar-analytics", previewUrl: "https://saas-analytics.architect-demo.app" };

  return (
    <div className="flex h-dvh min-w-[320px] flex-col bg-[#0b0f19] text-slate-200">
      <div className="flex min-h-12 flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-coral/25 bg-coral/[0.04] px-3 py-2 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span aria-hidden="true" className="relative flex h-2 w-2 shrink-0">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-400" />
          </span>
          <span className="truncate text-[11px] font-semibold uppercase tracking-[0.14em] text-rose-300">LIVE · Simulated</span>
          <span className="hidden truncate text-[10px] text-slate-400 sm:inline">
            {liveRecord ? (
              <>
                {liveRecord.url}
                <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
                <span className="font-mono">{liveRecord.branch}</span>
                <span aria-hidden="true" className="mx-1.5 text-slate-600">·</span>
                <span className="font-mono">{liveRecord.commitSha}</span>
              </>
            ) : (
              "No production deployment yet — deploy from the workspace."
            )}
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {liveRecord && (
            <button
              aria-label="View deployment details"
              className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.12] px-2 text-[9px] text-slate-300 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              onClick={() => setDetails(liveRecord)}
              type="button"
            >
              <Globe aria-hidden="true" className="h-3 w-3" />
              Deployment
            </button>
          )}
          <Link aria-label="Back to deployments" className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.12] px-2 text-[9px] text-slate-300 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60" href="/deployments">
            <ArrowLeft aria-hidden="true" className="h-3 w-3" />
            Deployments
          </Link>
          <Link className="flex h-7 items-center gap-1.5 rounded-md bg-coral px-2.5 text-[9px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60" href="/workspace">
            <Rocket aria-hidden="true" className="h-3 w-3" />
            Back to workspace
          </Link>
        </div>
      </div>

      {!liveRecord && (
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] bg-white/[0.02] px-4 py-2">
          <p className="text-[10px] text-slate-500">This page shows the production application after a successful deployment.</p>
          <DeploymentStatus status={deployment.activeStatus} />
        </div>
      )}

      <div className="relative flex min-h-0 flex-1 overflow-hidden p-2 sm:p-3">
        <ScenarioPreview scenarioId={context.scenarioId} />
      </div>

      <p className="flex items-center justify-center gap-1.5 border-t border-white/[0.06] px-4 py-2 text-center text-[8px] text-slate-600">
        {liveRecord?.url ?? context.previewUrl} · Simulated live URL — this address does not host a real application. The page renders the same preview shared with the workspace.
      </p>

      {details && (
        <DeploymentDetailsDialog
          busy={deployment.busy}
          onClose={() => setDetails(null)}
          onRetry={() => {
            setDetails(null);
            deployment.retry();
          }}
          record={details}
        />
      )}
    </div>
  );
}