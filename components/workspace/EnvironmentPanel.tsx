import { Check, Eye, EyeOff, KeyRound, Pencil, Plus, Trash2, X } from "lucide-react";
import { useState } from "react";
import { envSimulatedNote, environmentVariables, type EnvVar } from "@/data/developer";

const mask = "•".repeat(12);

type EnvironmentPanelProps = {
  onNotice: (message: string) => void;
};

export function EnvironmentPanel({ onNotice }: EnvironmentPanelProps) {
  const [vars, setVars] = useState<EnvVar[]>(environmentVariables);
  const [visible, setVisible] = useState<Record<string, boolean>>({});
  const [adding, setAdding] = useState(false);
  const [addName, setAddName] = useState("");
  const [addValue, setAddValue] = useState("");
  const [editing, setEditing] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editValue, setEditValue] = useState("");

  function toggleVisible(name: string) {
    setVisible((prev) => ({ ...prev, [name]: !prev[name] }));
  }

  function startEdit(index: number) {
    const variable = vars[index];
    setEditing(index);
    setEditName(variable.name);
    setEditValue(variable.value ?? "");
  }

  function saveEdit() {
    if (editing === null) return;
    const name = editName.trim();
    if (!name) return;
    setVars((prev) => prev.map((variable, index) => (index === editing ? { ...variable, name, value: editValue.trim() || undefined, configured: Boolean(editValue.trim()) } : variable)));
    setEditing(null);
    onNotice("Environment variable updated (local state only).");
  }

  function remove(index: number) {
    setVars((prev) => prev.filter((_, i) => i !== index));
    setEditing(null);
    onNotice("Environment variable removed (local state only).");
  }

  function addVariable() {
    const name = addName.trim();
    if (!name) return;
    setVars((prev) => [...prev, { name, configured: Boolean(addValue.trim()), value: addValue.trim() || undefined }]);
    setAddName("");
    setAddValue("");
    setAdding(false);
    onNotice("Environment variable added (local state only).");
  }

  const configuredCount = vars.filter((variable) => variable.configured).length;

  return (
    <section className="mx-auto w-full max-w-[760px] rounded-lg border border-white/[0.08] bg-[#10141d] p-4 sm:p-6" aria-label="Environment variables">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-white">Environment variables</h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Mock configuration for this project. Values are masked by default.
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-1 text-[9px] text-slate-500">
          {configuredCount} configured
        </span>
      </div>

      <div className="overflow-hidden rounded-md border border-white/[0.07]">
        {vars.length === 0 && (
          <p className="px-4 py-6 text-center text-[10px] text-slate-600">No variables yet. Add one below.</p>
        )}
        {vars.map((variable, index) => {
          if (editing === index) {
            return (
              <div key={`${variable.name}-edit`} className="flex flex-col gap-2 border-b border-white/[0.05] bg-white/[0.02] px-3 py-3 last:border-0 sm:flex-row sm:items-center">
                <label className="min-w-0 flex-1">
                  <span className="sr-only">Variable name</span>
                  <input
                    className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 font-mono text-[10px] text-white outline-none focus:border-coral/40"
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                  />
                </label>
                <input
                  aria-label="Variable value"
                  className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 font-mono text-[10px] text-white outline-none focus:border-coral/40 sm:max-w-[240px]"
                  value={editValue}
                  onChange={(event) => setEditValue(event.target.value)}
                />
                <div className="flex shrink-0 items-center gap-1">
                  <button aria-label="Save variable" className="flex h-6 w-6 items-center justify-center rounded text-emerald-300 transition hover:bg-white/[0.06]" onClick={saveEdit} type="button">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                  <button aria-label="Cancel editing" className="flex h-6 w-6 items-center justify-center rounded text-slate-500 transition hover:bg-white/[0.06]" onClick={() => setEditing(null)} type="button">
                    <X aria-hidden="true" className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          }
          return (
            <div key={variable.name} className="flex items-center gap-3 border-b border-white/[0.05] px-3 py-2.5 last:border-0 hover:bg-white/[0.02]">
              <KeyRound aria-hidden="true" className={`h-3.5 w-3.5 shrink-0 ${variable.configured ? "text-amber-300" : "text-slate-600"}`} />
              <span className="min-w-0 flex-1 truncate font-mono text-[10px] text-slate-300">{variable.name}</span>
              {variable.configured ? (
                <span className="hidden shrink-0 rounded border border-emerald-400/20 bg-emerald-400/5 px-1.5 py-0.5 text-[8px] text-emerald-300 sm:inline">Configured</span>
              ) : (
                <span className="hidden shrink-0 rounded border border-white/[0.08] px-1.5 py-0.5 text-[8px] text-slate-500 sm:inline">Not configured</span>
              )}
              <code className="shrink-0 font-mono text-[10px] text-slate-500">
                {variable.configured ? (visible[variable.name] ? variable.value : mask) : "—"}
              </code>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  aria-label={variable.configured ? (visible[variable.name] ? "Hide variable value" : "Reveal variable value") : "No value"}
                  aria-disabled={!variable.configured}
                  className={`flex h-6 w-6 items-center justify-center rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 hover:bg-white/[0.06] ${variable.configured ? "text-slate-400 hover:text-white" : "cursor-not-allowed text-slate-700"}`}
                  disabled={!variable.configured}
                  onClick={() => toggleVisible(variable.name)}
                  type="button"
                >
                  {visible[variable.name] ? <EyeOff aria-hidden="true" className="h-3 w-3" /> : <Eye aria-hidden="true" className="h-3 w-3" />}
                </button>
                <button
                  aria-label={`Edit ${variable.name}`}
                  aria-disabled={!variable.configured}
                  className={`flex h-6 w-6 items-center justify-center rounded transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 hover:bg-white/[0.06] ${variable.configured ? "text-slate-400 hover:text-white" : "cursor-not-allowed text-slate-700"}`}
                  disabled={!variable.configured}
                  onClick={() => startEdit(index)}
                  type="button"
                >
                  <Pencil aria-hidden="true" className="h-3 w-3" />
                </button>
                <button
                  aria-label={`Remove ${variable.name}`}
                  className="flex h-6 w-6 items-center justify-center rounded text-slate-500 transition hover:bg-rose-500/10 hover:text-rose-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                  onClick={() => remove(index)}
                  type="button"
                >
                  <Trash2 aria-hidden="true" className="h-3 w-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {adding ? (
        <div className="mt-3 flex flex-col gap-2 rounded-md border border-white/[0.08] bg-white/[0.02] p-3 sm:flex-row">
          <label className="min-w-0 flex-1">
            <span className="sr-only">Variable name</span>
            <input
              autoFocus
              className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 font-mono text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-coral/40"
              placeholder="VARIABLE_NAME"
              value={addName}
              onChange={(event) => setAddName(event.target.value)}
            />
          </label>
          <input
            aria-label="Variable value"
            className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 font-mono text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-coral/40 sm:max-w-[260px]"
            placeholder="value (optional)"
            value={addValue}
            onChange={(event) => setAddValue(event.target.value)}
          />
          <div className="flex shrink-0 items-center gap-1">
            <button
              className="flex h-7 items-center gap-1 rounded-md bg-coral px-2.5 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              disabled={!addName.trim()}
              onClick={addVariable}
              type="button"
            >
              Add
            </button>
            <button className="flex h-7 items-center rounded-md px-2 text-[10px] text-slate-400 transition hover:bg-white/[0.05]" onClick={() => setAdding(false)} type="button">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="mt-3 flex h-7 items-center gap-1.5 rounded-md border border-white/[0.08] px-2.5 text-[10px] text-slate-400 transition hover:border-white/15 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          onClick={() => setAdding(true)}
          type="button"
        >
          <Plus aria-hidden="true" className="h-3 w-3" />
          Add variable
        </button>
      )}

      <p className="mt-3 text-[9px] leading-[15px] text-slate-600">
        {envSimulatedNote} Values are mock strings only. No real secrets are stored or sent to the browser.
      </p>
    </section>
  );
}