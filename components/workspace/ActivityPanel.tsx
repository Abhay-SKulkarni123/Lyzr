import { Check, Circle, Cpu, LoaderCircle, Sparkles } from "lucide-react";
import type { BuildStatus } from "./types";

const steps = [
  { title: "Understanding request", detail: "Interpreting your product brief" },
  { title: "Planning application", detail: "Mapping the dashboard structure" },
  { title: "Building interface", detail: "Creating screens and components" },
  { title: "Running checks", detail: "Reviewing layout and responsiveness" },
];

type ActivityPanelProps = {
  status: BuildStatus;
  activeStep: number;
  prompt: string;
};

function ActivityList({ status, activeStep }: Pick<ActivityPanelProps, "status" | "activeStep">) {
  return (
    <ol className="space-y-0.5" aria-label="Build steps">
      {steps.map((step, index) => {
        const complete = status === "complete" || (status === "building" && index < activeStep);
        const active = status === "building" && index === activeStep;
        return (
          <li key={step.title} className="flex gap-3 py-2.5">
            <span className="relative flex w-4 shrink-0 justify-center">
              {complete ? (
                <Check aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 rounded-full bg-emerald-400/15 p-[2px] text-emerald-300" />
              ) : active ? (
                <LoaderCircle aria-hidden="true" className="mt-0.5 h-3.5 w-3.5 animate-spin text-coral" />
              ) : (
                <Circle aria-hidden="true" className="mt-0.5 h-3 w-3 text-slate-700" />
              )}
            </span>
            <div className="min-w-0">
              <p className={`text-[11px] font-medium leading-4 ${complete ? "text-slate-300" : active ? "text-white" : "text-slate-600"}`}>
                {step.title}
              </p>
              <p className={`mt-0.5 text-[10px] leading-4 ${active ? "text-slate-400" : "text-slate-600"}`}>
                {step.detail}
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function ActivityPanel({ status, activeStep, prompt }: ActivityPanelProps) {
  const isBuilding = status === "building";
  return (
    <aside className="hidden w-[260px] shrink-0 flex-col border-l border-white/[0.07] bg-[#10141d] xl:flex">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Build activity</span>
        <span className="flex items-center gap-1.5 rounded-full border border-white/[0.07] px-2 py-1 text-[9px] text-slate-500">
          <span className={`h-1.5 w-1.5 rounded-full ${isBuilding ? "animate-pulse bg-amber-400" : "bg-emerald-400"}`} />
          {isBuilding ? "In progress" : "Mock run"}
        </span>
      </div>
      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-4 py-4">
        <div className="mb-3 flex items-start gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-coral/10 text-coral">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
          <div>
            <p className="text-[11px] font-semibold text-slate-200">Architect</p>
            <p className="mt-1 text-[10px] leading-[17px] text-slate-500">
              {isBuilding ? "Working through your request…" : "Ready for your next instruction."}
            </p>
          </div>
        </div>
        <ActivityList status={status} activeStep={activeStep} />
        <div className="my-4 border-t border-white/[0.06]" />
        <div className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          <Cpu aria-hidden="true" className="h-3 w-3" />
          Latest instruction
        </div>
        <p className="mt-2 rounded-md border border-white/[0.06] bg-[#0c1018] px-2.5 py-2 text-[10px] leading-[17px] text-slate-400">
          “{prompt || "Build a clean SaaS analytics dashboard for a modern startup."}”
        </p>
        <p className="mt-2 text-[9px] leading-4 text-slate-600">
          {status === "complete"
            ? "Simulation complete. The sample preview is unchanged."
            : "Build activity is simulated for this prototype."}
        </p>
      </div>
      <div className="border-t border-white/[0.06] px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-coral/10 text-coral">
              <Sparkles aria-hidden="true" className="h-3 w-3" />
            </span>
            <span className="text-[10px] font-medium text-slate-400">Architect</span>
          </div>
          <span className="text-[9px] text-slate-600">Prototype mode</span>
        </div>
      </div>
    </aside>
  );
}

export function ActivitySummary({ status }: { status: BuildStatus }) {
  return (
    <div className="flex items-center gap-2 border-t border-white/[0.06] bg-[#10141d] px-4 py-2.5 xl:hidden">
      {status === "building" ? (
        <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-coral" />
      ) : (
        <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-coral" />
      )}
      <span className="text-[10px] font-medium text-slate-300">Architect</span>
      <span className="truncate text-[10px] text-slate-500">
        {status === "building" ? "Building your application…" : "Ready for your next instruction"}
      </span>
      <span className="ml-auto shrink-0 text-[9px] text-slate-600">Mock activity</span>
    </div>
  );
}
