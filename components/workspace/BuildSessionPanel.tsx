"use client";

import { Check, CheckCheck, LoaderCircle, Rocket, Sparkles, TriangleAlert } from "lucide-react";
import { getActivityPhase, getPlanWorkIndices, type BuildActivity, type BuildRecipe } from "@/data/builds";
import { BuildStatusPill } from "./BuildStatus";
import { isBuildPhase, type BuildStatus } from "./types";

const MAX_VISIBLE_PLAN = 6;

function stepState(flatIndex: number, activeStep: number, status: BuildStatus): "done" | "active" | "pending" | "error" {
  if (status === "complete") return "done";
  if (status === "error") {
    if (flatIndex === activeStep) return "error";
    return flatIndex < activeStep ? "done" : "pending";
  }
  if (flatIndex < activeStep) return "done";
  if (flatIndex === activeStep) return "active";
  return "pending";
}

type BuildSessionPanelProps = {
  status: BuildStatus;
  activeStep: number;
  recipe: BuildRecipe;
  flat: BuildActivity[];
  isIteration: boolean;
  latestPrompt: string;
  onOpenPreview: () => void;
  onReviewChanges: () => void;
  onOpenDeploy: () => void;
  onRetry: () => void;
};

export function BuildSessionPanel({
  status,
  activeStep,
  recipe,
  flat,
  isIteration,
  latestPrompt,
  onOpenPreview,
  onReviewChanges,
  onOpenDeploy,
  onRetry,
}: BuildSessionPanelProps) {
  if (status === "idle") return null;

  const busy = isBuildPhase(status);
  const finished = status === "complete";
  const failed = status === "error";
  const workIndices = getPlanWorkIndices(recipe);

  const changed = flat
    .slice(0, status === "complete" ? flat.length : failed ? activeStep + 1 : activeStep)
    .filter((activity) => getActivityPhase(recipe, activity) === "building" && activity.filePath);

  const title = busy
    ? isIteration
      ? "Here's what I'll change"
      : "Here's what I'll build"
    : finished
    ? isIteration
      ? "Updated your app"
      : "Build complete"
    : "Build failed";

  let icon;
  if (busy) {
    icon = <Sparkles aria-hidden="true" className="h-4 w-4 text-coral" />;
  } else if (finished) {
    icon = <CheckCheck aria-hidden="true" className="h-4 w-4 text-emerald-300" />;
  } else {
    icon = <TriangleAlert aria-hidden="true" className="h-4 w-4 text-rose-300" />;
  }

  return (
    <div className="shrink-0 border-b border-white/[0.06] bg-[#10141d]" role="status" aria-live="polite">
      <div className="mx-auto max-w-[1400px] px-4 py-3 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            {icon}
            <p className="text-xs font-semibold text-slate-100">{title}</p>
            <BuildStatusPill
              status={status}
              progress={busy ? { current: activeStep, total: flat.length } : undefined}
            />
          </div>

          {finished && (
            <div className="flex shrink-0 items-center gap-2">
              <button
                className="flex h-7 items-center rounded-md bg-coral px-3 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                onClick={onOpenPreview}
                type="button"
              >
                Open preview
              </button>
              <button
                className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.12] px-3 text-[10px] font-semibold text-slate-300 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                onClick={onReviewChanges}
                type="button"
              >
                Review changes
              </button>
              <button
                className="flex h-7 items-center gap-1.5 rounded-md border border-white/[0.12] px-3 text-[10px] font-semibold text-slate-300 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                onClick={onOpenDeploy}
                type="button"
              >
                <Rocket aria-hidden="true" className="h-3 w-3" />
                Deploy
              </button>
            </div>
          )}

          {failed && (
            <button
              className="flex h-7 items-center rounded-md bg-coral px-3 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              onClick={onRetry}
              type="button"
            >
              <LoaderCircle aria-hidden="true" className="mr-1.5 h-3 w-3" />
              Retry build
            </button>
          )}
        </div>

        <p className="mt-1.5 truncate text-[10px] text-slate-500">
          {busy
            ? `“${latestPrompt}”. Architect is working through the plan. The preview updates as each step finishes.`
            : finished
            ? `${changed.length} files updated · checks passed · preview is ready`
            : "Architect hit a snag while making this change. Steps that finished are safe to review."}
        </p>

        {busy ? (
          <ol className={`workspace-scrollbar mt-2.5 grid grid-cols-1 gap-x-5 gap-y-1 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3 ${recipe.plan.length > MAX_VISIBLE_PLAN ? "max-h-[180px]" : ""}`} aria-label="Build plan">
            {recipe.plan.map((step, index) => {
              const state = stepState(workIndices[index] ?? -1, activeStep, status);
              return (
                <li key={step.id} className="flex min-w-0 items-center gap-2 rounded-md px-1.5 py-1">
                  {state === "active" ? (
                    <LoaderCircle aria-hidden="true" className="h-3 w-3 shrink-0 animate-spin text-coral" />
                  ) : state === "done" ? (
                    <Check aria-hidden="true" className="h-3 w-3 shrink-0 text-emerald-300" />
                  ) : state === "error" ? (
                    <TriangleAlert aria-hidden="true" className="h-3 w-3 shrink-0 text-rose-400" />
                  ) : (
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-slate-700" />
                  )}
                  <span
                    className={`truncate text-[10px] leading-4 ${
                      state === "pending" ? "text-slate-600" : state === "active" ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {step.title}
                  </span>
                </li>
              );
            })}
          </ol>
        ) : (
          <>
            {changed.length > 0 && (
              <ul className="mt-2.5 space-y-1" aria-label={finished ? "What changed" : "What was completed"}>
                {changed.map((activity) => (
                  <li key={activity.message} className="flex min-w-0 items-center gap-2">
                    {finished ? (
                      <Check aria-hidden="true" className="h-3 w-3 shrink-0 text-emerald-300" />
                    ) : (
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" />
                    )}
                    <span className="truncate text-[10px] text-slate-300">{activity.message}</span>
                    <span className="ml-auto shrink-0 truncate pl-3 font-mono text-[9px] text-slate-600">
                      {activity.filePath}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {changed.length === 0 && finished && (
              <p className="mt-2.5 text-[10px] text-slate-500">No files were touched by this build.</p>
            )}
          </>
        )}

        <p className="mt-2.5 text-[8px] text-slate-600">
          {busy
            ? "Simulated build. No files are generated on your machine."
            : finished
            ? "Prototype result. Changes are simulated locally."
            : "This failure is part of the simulated build flow."}
        </p>
      </div>
    </div>
  );
}