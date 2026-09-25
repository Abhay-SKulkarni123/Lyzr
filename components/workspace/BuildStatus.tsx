import { CheckCheck, LoaderCircle, TriangleAlert } from "lucide-react";
import { isBuildPhase, type BuildStatus as Status } from "./types";

export function buildStatusLabel(status: Status): string {
  switch (status) {
    case "idle":
      return "Ready";
    case "understanding":
      return "Understanding";
    case "planning":
      return "Planning";
    case "building":
      return "Building";
    case "checking":
      return "Checking";
    case "complete":
      return "Build complete";
    case "error":
      return "Build failed";
  }
}

type BuildStatusPillProps = {
  status: Status;
  progress?: { current: number; total: number };
};

export function BuildStatusPill({ status, progress }: BuildStatusPillProps) {
  const busy = isBuildPhase(status);
  const dot =
    status === "error"
      ? "bg-rose-400"
      : busy
      ? "animate-pulse bg-amber-400"
      : "bg-mint";
  const label = busy && progress ? `Step ${Math.min(progress.current + 1, progress.total)} / ${progress.total}` : buildStatusLabel(status);
  return (
    <span
      className={`flex shrink-0 items-center gap-1.5 rounded-full border text-[9px] ${
        status === "error"
          ? "border-rose-500/25 bg-rose-500/10 text-rose-200"
          : busy
          ? "border-amber-400/20 bg-amber-400/10 text-amber-200"
          : status === "complete"
          ? "border-emerald-400/25 bg-emerald-400/10 text-emerald-200"
          : "border-white/[0.08] bg-white/[0.04] text-slate-400"
      } px-2 py-1`}
    >
      {busy ? (
        <LoaderCircle aria-hidden="true" className="h-2.5 w-2.5 animate-spin" />
      ) : status === "error" ? (
        <TriangleAlert aria-hidden="true" className="h-2.5 w-2.5" />
      ) : (
        <CheckCheck aria-hidden="true" className="h-2.5 w-2.5" />
      )}
      <span>{label}</span>
    </span>
  );
}