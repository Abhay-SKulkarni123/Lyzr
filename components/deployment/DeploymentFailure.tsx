"use client";

import { LoaderCircle, TriangleAlert } from "lucide-react";

type DeploymentFailureProps = {
  onRetry: () => void;
  busy?: boolean;
};

export function DeploymentFailure({ onRetry, busy = false }: DeploymentFailureProps) {
  return (
    <div aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
          <TriangleAlert aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Deployment failed</p>
          <p className="mt-0.5 text-[11px] leading-4 text-slate-400">
            The build could not be completed. Your preview and previous deployments are untouched.
          </p>
        </div>
      </div>
      <p className="mt-3 rounded-md border border-rose-400/20 bg-rose-500/[0.05] p-2.5 text-[9px] leading-4 text-rose-200">
        This failure is a simulated demo failure. Retry returns the deployment to the normal deterministic flow.
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          className="flex h-8 items-center gap-1.5 rounded-md bg-coral px-3.5 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          disabled={busy}
          onClick={onRetry}
          type="button"
        >
          {busy ? <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> : <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5" />}
          {busy ? "Deploying…" : "Retry deployment"}
        </button>
        <p className="text-[8px] text-slate-600">Full build logs are shown below.</p>
      </div>
    </div>
  );
}