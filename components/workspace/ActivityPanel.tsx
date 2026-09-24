import { Check, LoaderCircle, Sparkles, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { AgentActivity } from "./AgentActivity";
import { BuildHistory } from "./BuildHistory";
import { BuildPlan } from "./BuildPlan";
import { BuildOutcome, BuildStatusPill } from "./BuildStatus";
import { BuildTimeline } from "./BuildTimeline";
import { FileActivity } from "./FileActivity";
import { isBuildPhase, type BuildStatus } from "./types";
import { agents, type AgentId, type BuildActivity, type BuildRecipe, type BuildVersion } from "@/data/builds";

function agentName(id: AgentId): string {
  return agents.find((agent) => agent.id === id)?.name ?? "Architect";
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
      {children}
    </div>
  );
}

type ActivityPanelProps = {
  status: BuildStatus;
  activeStep: number;
  recipe: BuildRecipe;
  flat: BuildActivity[];
  files: string[];
  latestPrompt: string;
  promptStack: string[];
  versions: BuildVersion[];
  failureArmed: boolean;
  onArmFailure: () => void;
  onRetry: () => void;
  onOpenFile?: (path: string) => void;
};

export function ActivityPanel({
  status,
  activeStep,
  recipe,
  flat,
  files,
  latestPrompt,
  promptStack,
  versions,
  failureArmed,
  onArmFailure,
  onRetry,
  onOpenFile,
}: ActivityPanelProps) {
  const busy = isBuildPhase(status);
  const hasBuild = promptStack.length > 0;
  const showOutcome = status === "complete" || status === "error";

  return (
    <aside className="hidden w-[300px] shrink-0 flex-col border-l border-white/[0.07] bg-[#10141d] xl:flex" aria-label="Build activity">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Build activity</span>
        <BuildStatusPill status={status} progress={busy ? { current: activeStep, total: flat.length } : undefined} />
      </div>

      <div className="workspace-scrollbar min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {showOutcome && (
          <BuildOutcome status={status} filesUpdated={files.length} onRetry={onRetry} />
        )}

        <div className="flex items-start gap-2.5 rounded-lg border border-white/[0.07] bg-white/[0.025] p-3">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-coral/10 text-coral">
            <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-200">Architect</p>
            <p className="mt-1 text-[10px] leading-[16px] text-slate-400">“{latestPrompt}”</p>
          </div>
        </div>

        <div>
          <SectionLabel>
            <span className="h-1.5 w-1.5 rounded-full bg-coral" /> Agents
          </SectionLabel>
          <AgentActivity status={status} activeStep={activeStep} recipe={recipe} flat={flat} />
        </div>

        {hasBuild && (
          <div>
            <SectionLabel>Lifecycle</SectionLabel>
            <BuildTimeline status={status} activeStep={activeStep} recipe={recipe} />
          </div>
        )}

        {hasBuild && (
          <div>
            <SectionLabel>Files</SectionLabel>
            <FileActivity status={status} activeStep={activeStep} flat={flat} files={files} onOpenFile={onOpenFile} />
          </div>
        )}

        {hasBuild && (
          <div>
            <SectionLabel>Build plan</SectionLabel>
            <div className="rounded-lg border border-white/[0.06] bg-[#0c1018] p-1.5">
              <BuildPlan status={status} activeStep={activeStep} recipe={recipe} />
            </div>
          </div>
        )}

        <div>
          <SectionLabel>History</SectionLabel>
          <BuildHistory promptStack={promptStack} versions={versions} />
        </div>

        <p className="text-[8px] leading-[14px] text-slate-700">
          Build activity is simulated for this prototype — no files are generated.
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-white/[0.06] px-4 py-2.5">
        <span className="flex items-center gap-1.5 text-[9px] text-slate-600">
          <Sparkles aria-hidden="true" className="h-3 w-3 text-coral" />
          Prototype mode
        </span>
        {failureArmed ? (
          <span className="rounded-full border border-amber-400/25 bg-amber-400/10 px-2 py-0.5 text-[8px] text-amber-200">
            Failure armed
          </span>
        ) : (
          <button
            className="text-[8px] text-slate-600 underline decoration-dotted underline-offset-2 transition hover:text-slate-300 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy || status === "error"}
            onClick={onArmFailure}
            type="button"
            title="Demo trigger — makes the next build fail so you can test retry"
          >
            Arm failure for next build
          </button>
        )}
      </div>
    </aside>
  );
}

type ActivitySummaryProps = {
  status: BuildStatus;
  activeStep: number;
  flat: BuildActivity[];
};

export function ActivitySummary({ status, activeStep, flat }: ActivitySummaryProps) {
  const busy = isBuildPhase(status);
  const current = flat[activeStep];

  let icon;
  let title: string;
  let subtitle: string;
  if (busy) {
    icon = <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin text-coral" />;
    title = current ? agentName(current.agentId) : "Architect";
    subtitle = current?.message ?? "Working through your request…";
  } else if (status === "complete") {
    icon = <Check aria-hidden="true" className="h-3.5 w-3.5 text-emerald-300" />;
    title = "Build complete";
    subtitle = "Preview is ready";
  } else if (status === "error") {
    icon = <TriangleAlert aria-hidden="true" className="h-3.5 w-3.5 text-rose-400" />;
    title = "Build failed";
    subtitle = "Use Retry build from the activity panel";
  } else {
    icon = <Sparkles aria-hidden="true" className="h-3.5 w-3.5 text-coral" />;
    title = "Architect";
    subtitle = "Ready for your next instruction";
  }

  return (
    <div className="flex items-center gap-2 border-t border-white/[0.06] bg-[#10141d] px-4 py-2.5 xl:hidden" role="status">
      {icon}
      <span className="shrink-0 text-[10px] font-medium text-slate-300">{title}</span>
      <span className="min-w-0 flex-1 truncate text-[10px] text-slate-500">{subtitle}</span>
      {busy && flat.length > 0 && (
        <span className="shrink-0 text-[9px] text-slate-600">
          {Math.min(activeStep + 1, flat.length)}/{flat.length}
        </span>
      )}
      <span className="ml-auto shrink-0 text-[9px] text-slate-600">Simulated</span>
    </div>
  );
}