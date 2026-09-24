"use client";

import { Check, Plus, Search, X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { githubDemoRepositories, githubSimulatedNote, type GithubRepoVisibility, type GithubRepository } from "@/data/github";

type GithubRepositoryPickerProps = {
  selectedId: string | null;
  created: GithubRepository[];
  onSelect: (id: string) => void;
  onCreated: (repo: GithubRepository) => void;
};

export function GithubRepositoryPicker({ selectedId, created, onSelect, onCreated }: GithubRepositoryPickerProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | GithubRepoVisibility>("all");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState<GithubRepoVisibility>("private");

  const repos = useMemo(() => {
    const all = [...created, ...githubDemoRepositories];
    const normalized = query.trim().toLowerCase();
    return all.filter((repo) => {
      if (filter !== "all" && repo.visibility !== filter) return false;
      if (!normalized) return true;
      return `${repo.owner}/${repo.name}`.toLowerCase().includes(normalized) || (repo.description ?? "").toLowerCase().includes(normalized);
    });
  }, [created, query, filter]);

  function createRepo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = name.trim().toLowerCase().replace(/[^a-z0-9-_]/g, "-");
    if (!trimmed) return;
    const repo: GithubRepository = {
      id: trimmed,
      owner: "Abhay-demo",
      name: trimmed,
      visibility,
      language: "TypeScript",
      updated: "Just now",
      defaultBranch: "main",
      branches: ["main"],
      description: description.trim() || undefined,
    };
    onCreated(repo);
    setName("");
    setDescription("");
    setCreating(false);
  }

  return (
    <div aria-label="Repository picker">
      <div className="flex flex-wrap items-center gap-1.5">
        <label className="relative min-w-0 max-w-[220px] flex-1">
          <span className="sr-only">Search repositories</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-slate-600" />
          <input
            className="h-7 w-full rounded-md border border-white/[0.08] bg-[#0b0f19] pl-7 pr-2 text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-coral/40"
            placeholder="Search repositories…"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="flex items-center rounded-md border border-white/[0.08] p-0.5 text-[9px]" role="group" aria-label="Filter repositories">
          {(["all", "public", "private"] as const).map((option) => (
            <button
              key={option}
              aria-pressed={filter === option}
              className={`rounded px-2 py-1 capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
                filter === option ? "bg-white/[0.1] text-white" : "text-slate-500 hover:text-slate-300"
              }`}
              onClick={() => setFilter(option)}
              type="button"
            >
              {option}
            </button>
          ))}
        </div>
        <button
          aria-pressed={creating}
          className="flex h-7 items-center gap-1 rounded-md border border-white/[0.1] px-2 text-[10px] text-slate-300 transition hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          onClick={() => setCreating((prev) => !prev)}
          type="button"
        >
          {creating ? <X aria-hidden="true" className="h-3 w-3" /> : <Plus aria-hidden="true" className="h-3 w-3" />}
          {creating ? "Cancel" : "Create repository"}
        </button>
      </div>

      {creating && (
        <form className="mt-3 rounded-md border border-white/[0.08] bg-white/[0.02] p-3" onSubmit={createRepo}>
          <div className="grid gap-2">
            <label className="block">
              <span className="mb-1 block text-[9px] text-slate-500">Repository name</span>
              <input
                autoFocus
                className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-coral/40"
                placeholder="my-architect-app"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-[9px] text-slate-500">Description</span>
              <input
                className="w-full rounded-md border border-white/[0.1] bg-[#0b0f19] px-2 py-1.5 text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-coral/40"
                placeholder="Optional description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </label>
            <fieldset>
              <legend className="mb-1 text-[9px] text-slate-500">Visibility</legend>
              <div className="flex gap-1.5">
                {(["public", "private"] as const).map((option) => (
                  <button
                    key={option}
                    aria-pressed={visibility === option}
                    className={`rounded-md border px-2.5 py-1 text-[10px] capitalize transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
                      visibility === option ? "border-coral/40 bg-coral/10 text-white" : "border-white/[0.1] text-slate-400 hover:text-white"
                    }`}
                    onClick={() => setVisibility(option)}
                    type="button"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
          <div className="mt-3 flex items-center justify-end gap-1.5">
            <button
              className="rounded-md px-2.5 py-1 text-[10px] text-slate-400 transition hover:bg-white/[0.05] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              onClick={() => setCreating(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-coral px-3 py-1 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
              disabled={!name.trim()}
              type="submit"
            >
              Create repository
            </button>
          </div>
          <p className="mt-2 text-[8px] text-slate-600">This is a mock — no repository is created on GitHub.</p>
        </form>
      )}

      <ul className="mt-2 space-y-1" role="listbox" aria-label="Repositories">
        {repos.map((repo) => {
          const selected = repo.id === selectedId;
          return (
            <li key={repo.id}>
              <button
                aria-selected={selected}
                className={`flex w-full items-center gap-2 rounded-md border px-3 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
                  selected ? "border-coral/30 bg-white/[0.05]" : "border-transparent hover:bg-white/[0.03]"
                }`}
                onClick={() => onSelect(repo.id)}
                role="option"
                type="button"
              >
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate font-mono text-[11px] text-slate-200">
                      {repo.owner}/{repo.name}
                    </span>
                    <span
                      className={`shrink-0 rounded border px-1 py-0.5 text-[7px] uppercase tracking-wide ${
                        repo.visibility === "public"
                          ? "border-sky-400/25 bg-sky-400/10 text-sky-300"
                          : "border-white/[0.08] text-slate-500"
                      }`}
                    >
                      {repo.visibility}
                    </span>
                  </span>
                  <span className="mt-0.5 block truncate text-[9px] text-slate-600">
                    {repo.language} · updated {repo.updated}
                    {repo.description ? ` · ${repo.description}` : ""}
                  </span>
                </span>
                {selected ? <Check aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-coral" /> : null}
              </button>
            </li>
          );
        })}
        {repos.length === 0 && <li className="px-2 py-4 text-center text-[10px] text-slate-600">No repositories match your search.</li>}
      </ul>
      <p className="mt-2 text-[8px] text-slate-600">{githubSimulatedNote} Repository list is mock data.</p>
    </div>
  );
}