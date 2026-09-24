"use client";

import { CheckCircle2, Copy, ExternalLink, Eye } from "lucide-react";
import { useState } from "react";
import { liveUrlSimulatedNote, type DeploymentRecord } from "@/data/deployment";

type DeploymentSuccessProps = {
  record: DeploymentRecord;
  onOpenPreview: () => void;
  onOpenLiveApp: () => void;
  onViewDeployments: () => void;
};

export function DeploymentSuccess({ record, onOpenPreview, onOpenLiveApp, onViewDeployments }: DeploymentSuccessProps) {
  const [copied, setCopied] = useState(false);
  const url = record.url ?? "";

  function copyUrl() {
    try {
      void navigator.clipboard?.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard unavailable — ignore
    }
  }

  return (
    <div aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-400/10 text-emerald-300">
          <CheckCircle2 aria-hidden="true" className="h-5 w-5" />
        </span>
        <div>
          <p className="text-sm font-semibold text-white">Deployment ready</p>
          <p className="text-[11px] text-slate-400">
            {record.projectName} is live.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-md border border-white/[0.07] bg-[#0b0f19] p-3">
        <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-emerald-300">
          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          {url}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-[9px] text-slate-500">
          <span className="rounded border border-white/[0.08] px-1.5 py-0.5 uppercase text-slate-400">{record.environment}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">{record.branch}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono">{record.commitSha}</span>
          {record.duration && (
            <>
              <span aria-hidden="true">·</span>
              {record.duration}
            </>
          )}
        </p>
        <p className="mt-2 text-[8px] text-slate-600">{liveUrlSimulatedNote}</p>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <button
          className="flex h-8 items-center justify-center gap-1.5 rounded-md border border-white/[0.12] text-[10px] font-semibold text-slate-200 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          onClick={onOpenPreview}
          type="button"
        >
          <Eye aria-hidden="true" className="h-3.5 w-3.5" />
          Open Preview
        </button>
        <button
          className="flex h-8 items-center justify-center gap-1.5 rounded-md bg-coral text-[10px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          onClick={onOpenLiveApp}
          type="button"
        >
          <ExternalLink aria-hidden="true" className="h-3.5 w-3.5" />
          Open Live App
        </button>
        <button
          className="flex h-8 items-center gap-1.5 rounded-md border border-white/[0.12] px-3 text-[10px] font-semibold text-slate-200 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 sm:justify-center"
          onClick={copyUrl}
          type="button"
        >
          {copied ? <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 text-emerald-300" /> : <Copy aria-hidden="true" className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>

      <button className="mt-3 text-[9px] text-slate-500 underline-offset-2 transition hover:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60" onClick={onViewDeployments} type="button">
        View all deployments →
      </button>
    </div>
  );
}