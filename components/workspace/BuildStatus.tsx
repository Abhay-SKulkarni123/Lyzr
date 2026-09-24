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

function OutcomeIcon({ status }: { status: "complete" | "error" }) {
  if (status === "error") {
    return (
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/15 text-rose-300">
        <TriangleAlert aria-hidden="true" className="h-4 w-4" />
      </span>
    );
  }
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/15 text-emerald-300">
      <CheckCheck aria-hidden="true" className="h-4 w-4" />
    </span>
  );
}

type BuildOutcomeProps = {
  status: "complete" | "error";
  filesUpdated: number;
  onRetry: () => void;
};

export function BuildOutcome({ status, filesUpdated, onRetry }: BuildOutcomeProps) {
  return (
    <div
      className={`rounded-lg border p-3 ${
        status === "error"
          ? "border-rose-500/25 bg-rose-500/[0.07]"
          : "border-emerald-400/20 bg-emerald-400/[0.07]"
      }`}
      role={status === "error" ? "alert" : "status"}
    >
      <div className="flex items-start gap-2.5">
        <OutcomeIcon status={status} />
        <div className="min-w-0">
          <p className={`text-[12px] font-semibold ${status === "error" ? "text-rose-200" : "text-emerald-200"}`}>
            {status === "error" ? "Build failed" : "Build complete"}
          </p>
          <p className="mt-1 text-[10px] leading-[16px] text-slate-400">
            {status === "error"
              ? "Architect hit a snag while building this change."
              : `${filesUpdated} files updated · 0 issues found · preview is ready`}
          </p>
          {status === "error" && (
            <button
              className="mt-2.5 inline-flex h-7 items-center gap-1.5 rounded-md bg-coral px-2.5 text-[10px] font-semibold text-white transition hover:bg-[#ff795c]"
              onClick={onRetry}
              type="button"
            >
              Retry build
            </button>
          )}
        </div>
      </div>
      <p className="mt-2.5 text-[8px] leading-[13px] text-slate-600">
        {status === "error" ? "This failure is part of the simulated build flow." : "Prototype result — no files were generated."}
      </p>
    </div>
  );
}