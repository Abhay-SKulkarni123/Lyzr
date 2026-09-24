"use client";

import { LoaderCircle, Rocket } from "lucide-react";
import type { DeploymentStatus as Status } from "@/data/deployment";

type DeploymentButtonProps = {
  status: Status;
  disabled?: boolean;
  onDeploy: () => void;
};

const busyStates: Status[] = ["preparing", "building", "deploying"];

export function DeploymentButton({ status, disabled = false, onDeploy }: DeploymentButtonProps) {
  const busy = busyStates.includes(status);
  const label = busy ? "Deploying…" : status === "ready" ? "Live" : status === "failed" ? "Redeploy" : "Deploy";
  const ariaLabel =
    busy ? "Deployment in progress — open deployment details"
    : status === "ready" ? "Live — open deployment details"
    : `${label} — open deployment details`;

  return (
    <button
      aria-label={ariaLabel}
      className={`inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-semibold transition disabled:cursor-not-allowed sm:px-3 ${
        status === "ready"
          ? "border border-emerald-400/30 bg-emerald-400/10 text-emerald-200 hover:border-emerald-400/50 hover:bg-emerald-400/15"
          : status === "failed"
          ? "border border-rose-400/40 bg-rose-500/10 text-rose-200 hover:bg-rose-500/20"
          : "bg-coral text-white shadow-sm hover:bg-[#ff795c]"
      } disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60`}
      disabled={disabled}
      onClick={onDeploy}
      type="button"
    >
      {busy ? <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" /> : <Rocket aria-hidden="true" className="h-3.5 w-3.5" />}
      <span>{label}</span>
    </button>
  );
}