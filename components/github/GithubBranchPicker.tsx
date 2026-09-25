"use client";

import { GitBranch, Plus, X } from "lucide-react";
import { useState, type FormEvent } from "react";

type GithubBranchPickerProps = {
  branches: string[];
  selected: string;
  onSelect: (branch: string) => void;
  onCreate: (branch: string) => void;
};

export function GithubBranchPicker({ branches, selected, onSelect, onCreate }: GithubBranchPickerProps) {
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");

  function createBranch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
    setCreating(false);
  }

  return (
    <div aria-label="Branch picker">
      <div className="flex items-center gap-1.5">
        <label className="flex min-w-0 flex-1 items-center gap-1.5">
          <GitBranch aria-hidden="true" className="h-3 w-3 shrink-0 text-slate-500" />
          <span className="sr-only">Branch</span>
          <select
            className="min-w-0 flex-1 rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 text-[10px] text-slate-200 outline-none focus:border-coral/40"
            value={selected}
            onChange={(event) => onSelect(event.target.value)}
          >
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </label>
        <button
          aria-pressed={creating}
          className="flex h-7 shrink-0 items-center gap-1 rounded-md border border-white/[0.1] px-2 text-[10px] text-slate-300 transition hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          onClick={() => setCreating((prev) => !prev)}
          type="button"
        >
          {creating ? <X aria-hidden="true" className="h-3 w-3" /> : <Plus aria-hidden="true" className="h-3 w-3" />}
          {creating ? "Cancel" : "New branch"}
        </button>
      </div>

      {creating && (
        <form className="mt-2 flex items-center gap-1.5" onSubmit={createBranch}>
          <label className="min-w-0 flex-1">
            <span className="sr-only">New branch name</span>
            <input
              autoFocus
              className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-coral/40"
              placeholder="feature/my-change"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <button
            className="rounded-md bg-coral px-2.5 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            disabled={!name.trim()}
            type="submit"
          >
            Create
          </button>
        </form>
      )}
      <p className="mt-2 text-[8px] text-slate-600">Branch switching is simulated. No real git operation runs.</p>
    </div>
  );
}