import { Check, Circle, LoaderCircle, TriangleAlert } from "lucide-react";
import { getActivityPhase, getRecipeActivities, type BuildRecipe } from "@/data/builds";
import { isBuildPhase, type BuildStatus as Status } from "./types";

const stages: { id: Exclude<Status, "idle" | "error">; title: string }[] = [
  { id: "understanding", title: "Understanding" },
  { id: "planning", title: "Planning" },
  { id: "building", title: "Building" },
  { id: "checking", title: "Checks" },
  { id: "complete", title: "Ready" },
];

const stageOrder: Record<string, number> = {
  idle: -1,
  understanding: 0,
  planning: 1,
  building: 2,
  checking: 3,
  complete: 4,
};

type BuildTimelineProps = {
  status: Status;
  activeStep: number;
  recipe: BuildRecipe;
  showWhenIdle?: boolean;
};

export function BuildTimeline({ status, activeStep, recipe, showWhenIdle }: BuildTimelineProps) {
  const flat = getRecipeActivities(recipe);
  const errorPhase = status === "error" ? getActivityPhase(recipe, flat[activeStep] ?? flat[flat.length - 1]) : undefined;
  const currentIdx = status === "error" ? stageOrder[errorPhase ?? "checking"] : stageOrder[status];

  if (!showWhenIdle && status === "idle") return null;

  return (
    <ol className="space-y-0.5" aria-label="Build lifecycle">
      {stages.map((stage, index) => {
        const done = index < currentIdx || status === "complete";
        const active = isBuildPhase(status) && index === currentIdx;
        const failed = status === "error" && index === currentIdx;
        return (
          <li key={stage.id} className="flex gap-2.5 py-1.5">
            <span className="relative flex w-3.5 shrink-0 justify-center">
              {done ? (
                <Check aria-hidden="true" className="mt-0.5 h-3 w-3 rounded-full bg-emerald-400/15 p-[1.5px] text-emerald-300" />
              ) : active ? (
                <LoaderCircle aria-hidden="true" className="mt-0.5 h-3 w-3 animate-spin text-coral" />
              ) : failed ? (
                <TriangleAlert aria-hidden="true" className="mt-0.5 h-3 w-3 text-rose-400" />
              ) : (
                <Circle aria-hidden="true" className="mt-0.5 h-2.5 w-2.5 text-slate-700" />
              )}
              {index < stages.length - 1 && (
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 top-[15px] h-[calc(100%_-_10px)] w-px -translate-x-1/2 ${
                    done ? "bg-emerald-400/25" : failed ? "bg-rose-400/30" : "bg-white/[0.07]"
                  } ${index < stages.length - 1 ? "block" : "hidden"}`}
                />
              )}
            </span>
            <span
              className={`text-[10px] font-medium leading-4 ${
                done ? "text-slate-400" : active ? "text-white" : failed ? "text-rose-300" : "text-slate-600"
              }`}
            >
              {stage.title}
            </span>
          </li>
        );
      })}
    </ol>
  );
}