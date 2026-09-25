"use client";

import { ArrowRight, Braces, Database, LayoutTemplate, Plus, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { AgentBuilderModal } from "@/components/agents/AgentBuilderModal";
import { agents, type AgentId } from "@/data/builds";
import { agentFrameworks, type CustomAgentDefinition } from "@/data/agents";

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
  const [builderOpen, setBuilderOpen] = useState(false);
  const [customAgents, setCustomAgents] = useState<CustomAgentDefinition[]>([]);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600">Agents</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Agent Overview
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-400">
            Architect runs coordinated agents during every build. These agents are simulated in the
            prototype. Each one performs its role against mock data so you can watch the flow end to end.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setBuilderOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-coral px-4 text-xs font-semibold text-white transition hover:bg-[#ff795c]"
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          Create agent
        </button>
      </div>

      {customAgents.length > 0 && (
        <div className="mb-8">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-medium text-white">Your agents</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                Custom agents defined for this prototype session.
              </p>
            </div>
            <span className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] text-slate-500">
              Created this session
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {customAgents.map((agent) => {
              const framework = agentFrameworks.find((item) => item.id === agent.frameworkId);
              return (
                <div
                  key={agent.id}
                  className="flex flex-col gap-3 rounded-xl border border-coral/20 bg-[#0c1018]/90 p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-coral/20 bg-coral/10 text-coral">
                      <Braces aria-hidden="true" className="h-4.5 w-4.5" />
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium text-slate-500">
                      Custom
                    </span>
                  </div>
                  <div className="min-w-0">
                    <h2 className="truncate text-sm font-semibold text-white">{agent.name}</h2>
                    <p className="mt-1 text-xs leading-snug text-slate-500">{agent.role}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-slate-500">
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5">
                      {framework?.label ?? "Custom runtime"}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2 py-0.5">
                      {agent.model}
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-600" aria-hidden="true" />
                      Simulated
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

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

      <div className="mb-4">
        <h2 className="text-sm font-medium text-white">Built-in team</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          The agents that power every Architect build. Read-only in this prototype.
        </p>
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

      <AgentBuilderModal
        open={builderOpen}
        onClose={() => setBuilderOpen(false)}
        onCreated={(agent) => setCustomAgents((prev) => [...prev, agent])}
      />
    </div>
  );
}