import { Check, Circle, LoaderCircle, TriangleAlert } from "lucide-react";
import { agents, getPlanWorkIndices, type BuildRecipe } from "@/data/builds";
import type { BuildStatus as Status } from "./types";

function agentName(id: string): string {
  return agents.find((agent) => agent.id === id)?.name ?? "Architect";
}

type BuildPlanProps = {
  status: Status;
  activeStep: number;
  recipe: BuildRecipe;
};

function stepState(
  flatIndex: number,
  activeStep: number,
  status: Status
): "done" | "active" | "pending" | "error" {
  if (status === "complete") return "done";
  if (status === "error") {
    if (flatIndex === activeStep) return "error";
    return flatIndex < activeStep ? "done" : "pending";
  }
  if (flatIndex < activeStep) return "done";
  if (flatIndex === activeStep) return "active";
  return "pending";
}

export function BuildPlan({ status, activeStep, recipe }: BuildPlanProps) {
  const workIndices = getPlanWorkIndices(recipe);
  return (
    <ol className="space-y-1" aria-label="Build plan">
      {recipe.plan.map((step, index) => {
        const state = stepState(workIndices[index] ?? -1, activeStep, status);
        return (
          <li
            key={step.id}
            className={`flex items-center gap-2 rounded-md border px-2 py-1.5 ${
              state === "active"
                ? "border-coral/20 bg-coral/[0.05]"
                : state === "error"
                ? "border-rose-500/20 bg-rose-500/[0.05]"
                : state === "done"
                ? "border-white/[0.04] bg-white/[0.015]"
                : "border-transparent"
            }`}
          >
            <span
              className={`flex h-5 w-7 shrink-0 items-center justify-center rounded font-mono text-[8px] ${
                state === "done"
                  ? "bg-emerald-400/10 text-emerald-300"
                  : state === "active"
                  ? "bg-coral/10 text-coral"
                  : state === "error"
                  ? "bg-rose-500/10 text-rose-300"
                  : "bg-white/[0.04] text-slate-600"
              }`}
            >
              {step.id}
            </span>
            <span
              className={`min-w-0 flex-1 truncate text-[10px] leading-4 ${
                state === "pending" ? "text-slate-600" : "text-slate-300"
              }`}
            >
              {step.title}
            </span>
            <span className="hidden shrink-0 text-[8px] text-slate-600 sm:inline">{agentName(step.agentId)}</span>
            {state === "active" ? (
              <LoaderCircle aria-hidden="true" className="h-3 w-3 shrink-0 animate-spin text-coral" />
            ) : state === "done" ? (
              <Check aria-hidden="true" className="h-3 w-3 shrink-0 text-emerald-300" />
            ) : state === "error" ? (
              <TriangleAlert aria-hidden="true" className="h-3 w-3 shrink-0 text-rose-400" />
            ) : (
              <Circle aria-hidden="true" className="h-2 w-2 shrink-0 text-slate-700" />
            )}
          </li>
        );
      })}
    </ol>
  );
}