"use client";

import { GitPullRequest } from "lucide-react";
import { useMemo, useState } from "react";
import { githubPrSimulatedNote, type GithubCheck } from "@/data/github";
import { GithubChecks } from "./GithubChecks";

type PullRequestFormProps = {
  branches: string[];
  defaultBase: string;
  defaultCompare: string;
  changedFiles: number;
  checks: GithubCheck[];
  onCancel: () => void;
  onCreate: (input: { base: string; compare: string; title: string; description: string }) => void;
};

export function PullRequestForm({ branches, defaultBase, defaultCompare, changedFiles, checks, onCancel, onCreate }: PullRequestFormProps) {
  const baseOptions = useMemo(() => (branches.length > 0 ? branches : ["main"]), [branches]);
  const initialCompare = defaultCompare !== defaultBase && baseOptions.includes(defaultCompare) ? defaultCompare : baseOptions.find((branch) => branch !== defaultBase) ?? defaultBase;
  const [base, setBase] = useState<string>(baseOptions.includes(defaultBase) ? defaultBase : baseOptions[0]);
  const [compare, setCompare] = useState<string>(initialCompare);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const compareOptions = useMemo(() => baseOptions.filter((branch) => branch !== base), [baseOptions, base]);
  const valid = title.trim().length > 0 && compare !== base && compareOptions.length > 0;

  return (
    <div>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 rounded border border-white/[0.07] px-2 py-1 text-[10px]">
          <span className="text-[9px] font-semibold uppercase text-slate-500">Base</span>
          <select
            aria-label="Base branch"
            className="bg-transparent font-mono text-[10px] text-slate-200 outline-none"
            value={base}
            onChange={(event) => {
              const next = event.target.value;
              setBase(next);
              if (compare === next) setCompare(compareOptions[0] ?? next);
            }}
          >
            {baseOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </span>
        <GitPullRequest aria-hidden="true" className="h-4 w-4 shrink-0 text-coral" />
        <span className="flex items-center gap-1.5 rounded border border-white/[0.07] px-2 py-1 text-[10px]">
          <span className="text-[9px] font-semibold uppercase text-slate-500">Compare</span>
          <select
            aria-label="Compare branch"
            className={compareOptions.length > 0 ? "bg-transparent font-mono text-[10px] text-slate-200 outline-none" : "cursor-not-allowed bg-transparent font-mono text-[10px] text-slate-600 outline-none"}
            disabled={compareOptions.length === 0}
            value={compare}
            onChange={(event) => setCompare(event.target.value)}
          >
            {compareOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </span>
      </div>
      {compareOptions.length === 0 && <p className="mt-2 text-[9px] text-slate-600">Create another branch to compare against.</p>}

      <div className="mt-4 space-y-2">
        <label className="block">
          <span className="mb-1 block text-[9px] text-slate-500">Title</span>
          <input
            className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 text-[11px] text-white outline-none placeholder:text-slate-600 focus:border-coral/40"
            placeholder="Improve analytics dashboard"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-[9px] text-slate-500">Description</span>
          <textarea
            className="workspace-scrollbar min-h-[64px] w-full resize-y rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 text-[10px] leading-4 text-white outline-none placeholder:text-slate-600 focus:border-coral/40"
            placeholder="Add the new analytics dashboard components and responsive layout."
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <span className="rounded-full border border-white/[0.08] px-2 py-1 text-[9px] text-slate-400">{changedFiles} changed file{changedFiles === 1 ? "" : "s"}</span>
        <span className="rounded-full border border-white/[0.08] px-2 py-1 font-mono text-[9px] text-slate-400">+{changedFiles}
          <span className="text-slate-600">/</span>-0</span>
        <span className="rounded-full border border-white/[0.08] px-2 py-1 text-[9px] text-emerald-300">Checks passing</span>
      </div>

      <div className="mt-4">
        <GithubChecks checks={checks} />
      </div>

      <p className="mt-3 text-[8px] leading-4 text-slate-600">{githubPrSimulatedNote}</p>

      <div className="mt-4 flex items-center justify-end gap-2 border-t border-white/[0.07] pt-3">
        <button
          className="rounded-md px-3 py-1.5 text-[10px] text-slate-400 transition hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          onClick={onCancel}
          type="button"
        >
          Cancel
        </button>
        <button
          className="flex h-8 items-center gap-1.5 rounded-md bg-coral px-3.5 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          disabled={!valid}
          onClick={() => onCreate({ base, compare, title, description })}
          type="button"
        >
          <GitPullRequest aria-hidden="true" className="h-3.5 w-3.5" />
          Create Pull Request
        </button>
      </div>
    </div>
  );
}