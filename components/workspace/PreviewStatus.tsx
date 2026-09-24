import { CheckCheck, LoaderCircle, Rocket, TriangleAlert } from "lucide-react";
import { isBuildPhase, type BuildStatus as Status } from "./types";

type PreviewStatusProps = { status: Status; live?: boolean };

export function PreviewStatus({ status, live = false }: PreviewStatusProps) {
  if (status === "idle") return null;

  const busy = isBuildPhase(status);

  if (busy) {
    return (
      <div
        aria-live="polite"
        className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-amber-400/25 bg-[#0c1018]/90 px-3 py-1.5 shadow-lg backdrop-blur"
      >
        <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-amber-300" />
        <span className="text-[10px] font-medium text-amber-200">Updating preview…</span>
        <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-400" />
      </div>
    );
  }

  if (status === "error") {
    return (
      <div
        aria-live="polite"
        className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full border border-rose-500/25 bg-[#0c1018]/90 px-3 py-1.5 shadow-lg backdrop-blur"
      >
        <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5 text-rose-300" />
        <span className="text-[10px] font-medium text-rose-200">Preview update failed</span>
      </div>
    );
  }

  return (
    <div aria-live="polite" className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 items-center gap-2">
      <div className="flex items-center gap-2 rounded-full border border-emerald-400/25 bg-[#0c1018]/90 px-3 py-1.5 shadow-lg backdrop-blur">
        <CheckCheck aria-hidden="true" className="h-3.5 w-3.5 text-emerald-300" />
        <span className="text-[10px] font-medium text-emerald-200">Preview ready</span>
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-mint" />
      </div>
      {live && (
        <div className="flex items-center gap-1.5 rounded-full border border-coral/30 bg-[#0c1018]/90 px-3 py-1.5 shadow-lg backdrop-blur">
          <Rocket aria-hidden="true" className="h-3 w-3 text-coral" />
          <span className="text-[10px] font-medium text-orange-100">Production · Live</span>
          <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-coral" />
        </div>
      )}
    </div>
  );
}