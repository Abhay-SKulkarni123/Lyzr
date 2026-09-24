import {
  Check,
  Circle,
  Database,
  LoaderCircle,
  PanelTop,
  ShieldCheck,
  Sparkles,
  TriangleAlert,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  agents,
  getAgentActivities,
  type AgentId,
  type AgentStatus,
  type BuildActivity,
  type BuildRecipe,
} from "@/data/builds";
import type { BuildStatus as Status } from "./types";

const agentIcons: Record<AgentId, LucideIcon> = {
  architect: Sparkles,
  "ui-builder": PanelTop,
  "data-agent": Database,
  "qa-agent": ShieldCheck,
};

type AgentActivityProps = {
  status: Status;
  activeStep: number;
  recipe: BuildRecipe;
  flat: BuildActivity[];
};

export function AgentActivity({ status, activeStep, recipe, flat }: AgentActivityProps) {
  return (
    <div className="space-y-1.5" aria-label="Build agents">
      {agents.map((agent) => {
        const occurrences = getAgentActivities(recipe, agent.id);
        const activeAt = occurrences.find((index) => index === activeStep);
        const completed = occurrences.filter((index) => index < activeStep).length;
        const Icon = agentIcons[agent.id];

        let agentStatus: AgentStatus;
        let task: string;
        if (status === "idle") {
          agentStatus = "idle";
          task = agent.role;
        } else if (status === "error") {
          if (activeAt !== undefined) {
            agentStatus = "error";
            task = flat[activeStep]?.message ?? agent.role;
          } else if (completed === occurrences.length) {
            agentStatus = "done";
            task = occurrences.length ? (flat[occurrences[completed - 1]]?.message ?? agent.role) : agent.role;
          } else {
            agentStatus = "waiting";
            task = agent.role;
          }
        } else if (activeAt !== undefined) {
          agentStatus = "active";
          task = flat[activeStep]?.message ?? agent.role;
        } else if (status === "complete" || completed === occurrences.length) {
          agentStatus = "done";
          task = occurrences.length ? (flat[occurrences[completed - 1]]?.message ?? agent.role) : agent.role;
        } else {
          agentStatus = "waiting";
          task = occurrences.length ? "Queued for this build" : agent.role;
        }

        const statusWord =
          agentStatus === "active" ? "Working"
          : agentStatus === "done" ? "Done"
          : agentStatus === "error" ? "Failed"
          : agentStatus === "waiting" ? "Queued"
          : "Idle";

        return (
          <div
            key={agent.id}
            className={`rounded-lg border p-2 ${
              agentStatus === "active"
                ? "border-coral/25 bg-coral/[0.06]"
                : agentStatus === "error"
                ? "border-rose-500/20 bg-rose-500/[0.06]"
                : agentStatus === "done"
                ? "border-white/[0.06] bg-white/[0.02]"
                : "border-white/[0.05] bg-white/[0.01]"
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md ${
                  agentStatus === "active"
                    ? "bg-coral/15 text-coral"
                    : agentStatus === "error"
                    ? "bg-rose-500/15 text-rose-300"
                    : agentStatus === "done"
                    ? "bg-emerald-400/10 text-emerald-300"
                    : "bg-white/[0.04] text-slate-400"
                }`}
              >
                <Icon aria-hidden="true" className="h-3 w-3" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[10px] font-semibold text-slate-200">{agent.name}</span>
                  <span className={`shrink-0 text-[8px] font-medium ${statusWordColor(agentStatus)}`}>{statusWord}</span>
                </div>
                <p className="mt-0.5 truncate text-[9px] text-slate-500">{task}</p>
              </div>
            </div>
            <div className="mt-1.5 flex items-center justify-between border-t border-white/[0.05] pt-1.5">
              <span className="text-[8px] text-slate-600">{agent.role}</span>
              <span className="flex items-center gap-1 text-[8px] text-slate-500">
                {agentStatusDot(agentStatus)}
                {occurrences.length} task{occurrences.length === 1 ? "" : "s"}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function statusWordColor(status: AgentStatus): string {
  switch (status) {
    case "active":
      return "text-coral";
    case "done":
      return "text-emerald-300";
    case "error":
      return "text-rose-300";
    case "waiting":
      return "text-slate-500";
    case "idle":
      return "text-slate-600";
  }
}

function agentStatusDot(status: AgentStatus) {
  switch (status) {
    case "active":
      return <LoaderCircle aria-hidden="true" className="h-2.5 w-2.5 animate-spin text-coral" />;
    case "done":
      return <Check aria-hidden="true" className="h-2.5 w-2.5 text-emerald-300" />;
    case "error":
      return <TriangleAlert aria-hidden="true" className="h-2.5 w-2.5 text-rose-400" />;
    case "idle":
    case "waiting":
      return <Circle aria-hidden="true" className="h-2 w-2 text-slate-700" />;
  }
}