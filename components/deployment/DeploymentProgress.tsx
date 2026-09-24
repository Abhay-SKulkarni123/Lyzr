"use client";

import { Check, LoaderCircle } from "lucide-react";
import { deploymentProgressSteps, deploymentStepsById, type DeploymentStatus as Status } from "@/data/deployment";

type DeploymentProgressProps = {
  status: Status;
  environment: string;
  branch: string;
  commitSha: string;
};

export function DeploymentProgress({ status, environment, branch, commitSha }: DeploymentProgressProps) {
  const done = deploymentStepsById(status);
  return (
    <div className="rounded-md border border-white/[0.07] bg-[#0b0f19] p-3" aria-live="polite">
      <p className="mb-3 flex items-center gap-1.5 font-mono text-[9px] text-slate-500">
        <span className="rounded border border-white/[0.08] px-1.5 py-0.5 uppercase text-slate-400">{environment}</span>
        <span aria-hidden="true">·</span>
        {branch}
        <span aria-hidden="true">·</span>
        {commitSha}
      </p>
      <ol className="space-y-2.5">
        {deploymentProgressSteps.map((step) => {
          const active = status === step.id;
          const complete = done.includes(step.id);
          const reached = done.includes(step.id) || active;
          return (
            <li key={step.id} className="flex items-start gap-2.5">
              <span
                aria-hidden="true"
                className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                  complete
                    ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-300"
                    : active
                    ? "border-sky-400/40 bg-sky-400/10 text-sky-300"
                    : reached
                    ? "border-white/[0.14] text-slate-500"
                    : "border-white/[0.08] text-slate-600"
                }`}
              >
                {complete ? (
                  <Check aria-hidden="true" className="h-2.5 w-2.5" />
                ) : active ? (
                  <LoaderCircle aria-hidden="true" className="h-2.5 w-2.5 animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                )}
              </span>
              <div className="min-w-0">
                <p className={`text-[11px] font-medium ${active ? "text-sky-200" : complete ? "text-slate-300" : "text-slate-600"}`}>
                  {step.label}
                </p>
                {reached && <p className="text-[9px] text-slate-500">{step.detail}</p>}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}