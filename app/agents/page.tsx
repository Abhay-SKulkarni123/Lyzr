import { ArrowRight, Braces, Database, LayoutTemplate, ShieldCheck } from "lucide-react";
import { agents, type AgentId } from "@/data/builds";

const agentIcons: Record<AgentId, typeof Braces> = {
  architect: Braces,
  "ui-builder": LayoutTemplate,
  "data-agent": Database,
  "qa-agent": ShieldCheck,
};

const pipeline = [
  { step: "Plan", detail: "Architect reads the brief and maps the structure" },
  { step: "Build", detail: "UI Builder and Data Agent generate the interface and content" },
  { step: "Check", detail: "QA Agent verifies screens, states, and flows" },
];

export default function AgentsPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600">Agents</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Agent Overview
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Architect runs coordinated agents during every build. These agents are simulated in the
          prototype — each one performs its role against mock data so you can watch the flow end to end.
        </p>
      </div>

      <div className="mb-8 overflow-hidden rounded-xl border border-white/10 bg-[#0c1018]/90">
        <div className="border-b border-white/10 px-4 py-2.5">
          <span className="text-[10px] font-medium uppercase tracking-[0.14em] text-coral">
            Simulated production run · Build orchestration
          </span>
        </div>
        <ul className="divide-y divide-white/10">
          {pipeline.map((item) => (
            <li key={item.step} className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
              <span className="w-14 shrink-0 text-[11px] font-semibold uppercase tracking-wider text-white">
                {item.step}
              </span>
              <span className="h-px w-4 shrink-0 bg-white/15" aria-hidden="true" />
              <span className="min-w-0 text-[13px] text-slate-400">{item.detail}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {agents.map((agent, index) => {
          const Icon = agentIcons[agent.id];
          return (
            <div
              key={agent.id}
              className="flex flex-col gap-3 rounded-xl border border-white/10 bg-[#0c1018]/90 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-coral">
                  <Icon aria-hidden="true" className="h-4.5 w-4.5" />
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-slate-500">
                  0{index + 1}
                </span>
              </div>
              <div className="min-w-0">
                <h2 className="truncate text-sm font-semibold text-white">{agent.name}</h2>
                <p className="mt-1 text-xs leading-snug text-slate-500">{agent.role}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-600" aria-hidden="true" />
                Simulated
                <ArrowRight aria-hidden="true" className="ml-auto h-3 w-3 text-slate-600" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}