"use client";

import { Bot, ChevronDown, LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDialogFocus } from "@/components/shared/useDialogFocus";
import {
  agentFrameworks,
  agentModels,
  agentTools,
  type AgentFrameworkId,
  type CustomAgentDefinition,
} from "@/data/agents";

type AgentBuilderModalProps = {
  open: boolean;
  onClose: () => void;
  onCreated: (agent: CustomAgentDefinition) => void;
};

const registerSteps = ["Registering agent identity", "Wiring framework runtime", "Scoping tools", "Ready"];

export function AgentBuilderModal({ open, onClose, onCreated }: AgentBuilderModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [frameworkId, setFrameworkId] = useState<AgentFrameworkId>("langgraph");
  const [model, setModel] = useState(agentModels[0]);
  const [tools, setTools] = useState<string[]>(["Read files", "Run commands"]);
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useDialogFocus<HTMLDivElement>(open);

  useEffect(() => {
    if (open) {
      setName("");
      setRole("");
      setFrameworkId("langgraph");
      setModel(agentModels[0]);
      setTools(["Read files", "Run commands"]);
      setInstructions("");
      setError(null);
      setStep(-1);
      requestAnimationFrame(() => nameRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (step < 0) onClose();
      }
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  if (!open) return null;

  function toggleTool(tool: string) {
    setTools((prev) => (prev.includes(tool) ? prev.filter((item) => item !== tool) : [...prev, tool]));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError("Give your agent a name.");
      return;
    }
    if (tools.length === 0) {
      setError("Select at least one tool.");
      return;
    }
    setError(null);
    for (let index = 0; index < registerSteps.length; index += 1) {
      setStep(index);
      await new Promise((resolve) => window.setTimeout(resolve, 560));
    }
    onCreated({
      id: `custom-${Date.now().toString(36)}`,
      name: cleanName,
      role: role.trim() || "Custom agent",
      frameworkId,
      model,
      tools,
      instructions: instructions.trim(),
    });
    onClose();
  }

  const registering = step >= 0;
  const selectedFramework = agentFrameworks.find((item) => item.id === frameworkId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Create a new agent"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && step < 0) onClose();
      }}
    >
      <div className="workspace-scrollbar max-h-[90dvh] w-full max-w-[560px] overflow-y-auto rounded-2xl border border-white/10 bg-[#10141d] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Create agent</h2>
            <p className="mt-1 text-xs text-slate-500">
              Define an agent for your team. Agent creation is simulated in this prototype.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={registering}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {registering ? (
          <ol className="space-y-3 rounded-xl border border-white/10 bg-[#0b0f19] p-4">
            {registerSteps.map((label, index) => (
              <li key={label} className="flex items-center gap-2.5 text-xs">
                {index < step ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-mint/15 text-[10px] text-mint">
                    ok
                  </span>
                ) : index === step ? (
                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin text-coral" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-white/10" aria-hidden="true" />
                )}
                <span className={index <= step ? "text-slate-300" : "text-slate-600"}>{label}</span>
              </li>
            ))}
          </ol>
        ) : (
          <form onSubmit={submit}>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="agent-name" className="mb-1.5 block text-xs font-medium text-slate-400">
                    Agent name
                  </label>
                  <input
                    id="agent-name"
                    ref={nameRef}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="e.g. Release Copilot"
                    className="w-full rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-coral/50 focus:ring-2 focus:ring-coral/20"
                  />
                </div>
                <div>
                  <label htmlFor="agent-role" className="mb-1.5 block text-xs font-medium text-slate-400">
                    Role
                  </label>
                  <input
                    id="agent-role"
                    value={role}
                    onChange={(event) => setRole(event.target.value)}
                    placeholder="e.g. Handles releases and rollbacks"
                    className="w-full rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-coral/50 focus:ring-2 focus:ring-coral/20"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="agent-framework" className="mb-1.5 block text-xs font-medium text-slate-400">
                  Framework
                </label>
                <div className="relative">
                  <select
                    id="agent-framework"
                    value={frameworkId}
                    onChange={(event) => setFrameworkId(event.target.value as AgentFrameworkId)}
                    className="w-full appearance-none rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition focus:border-coral/50 focus:ring-2 focus:ring-coral/20"
                  >
                    {agentFrameworks.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown aria-hidden="true" className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                </div>
                <p className="mt-1.5 text-[10px] text-slate-600">{selectedFramework?.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="agent-model" className="mb-1.5 block text-xs font-medium text-slate-400">
                    Backing model
                  </label>
                  <select
                    id="agent-model"
                    value={model}
                    onChange={(event) => setModel(event.target.value)}
                    className="w-full appearance-none rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition focus:border-coral/50 focus:ring-2 focus:ring-coral/20"
                  >
                    {agentModels.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-slate-400">Identity</label>
                  <span className="flex h-[38px] items-center gap-2 rounded-lg border border-white/10 bg-[#0b0f19] px-3 text-xs text-slate-500">
                    <Bot aria-hidden="true" className="h-3.5 w-3.5" />
                    Custom agent
                  </span>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-xs font-medium text-slate-400">Tools</p>
                <div className="flex flex-wrap gap-2">
                  {agentTools.map((tool) => {
                    const active = tools.includes(tool);
                    return (
                      <button
                        key={tool}
                        type="button"
                        onClick={() => toggleTool(tool)}
                        aria-pressed={active}
                        className={`rounded-full border px-2.5 py-1 text-[10px] transition ${
                          active
                            ? "border-coral/40 bg-coral/10 text-white"
                            : "border-white/10 bg-white/[0.02] text-slate-500 hover:border-white/20 hover:text-slate-300"
                        }`}
                      >
                        {tool}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label htmlFor="agent-instructions" className="mb-1.5 block text-xs font-medium text-slate-400">
                  Instructions <span className="text-slate-600">(optional)</span>
                </label>
                <textarea
                  id="agent-instructions"
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  placeholder="How should this agent behave?"
                  rows={3}
                  className="workspace-scrollbar w-full resize-none rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-coral/50 focus:ring-2 focus:ring-coral/20"
                />
              </div>
            </div>

            {error && (
              <p role="alert" className="mt-3 text-xs text-rose-400">
                {error}
              </p>
            )}

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="h-9 rounded-lg border border-white/10 px-4 text-xs font-medium text-slate-400 transition hover:border-white/20 hover:text-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-coral px-4 text-xs font-semibold text-white transition hover:bg-[#ff795c]"
              >
                Create agent
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}