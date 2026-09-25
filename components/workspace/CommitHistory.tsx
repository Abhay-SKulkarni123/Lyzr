import { GitCommitHorizontal } from "lucide-react";
import { useState } from "react";
import { gitSimulatedNote, type GitCommit } from "@/data/developer";

type CommitHistoryProps = {
  commits: GitCommit[];
};

export function CommitHistory({ commits }: CommitHistoryProps) {
  const [selected, setSelected] = useState<string | null>(commits[0]?.hash ?? null);
  if (commits.length === 0) {
    return <p className="px-2 py-4 text-center text-[10px] text-slate-600">No commits yet in this branch.</p>;
  }
  const active = commits.find((commit) => commit.hash === selected) ?? commits[0];
  return (
    <section className="mt-5" aria-label="Commit history">
      <h3 className="flex items-center gap-1.5 px-2 text-[9px] font-semibold uppercase tracking-wide text-slate-500">
        <GitCommitHorizontal aria-hidden="true" className="h-3 w-3" />
        History
      </h3>
      <ul className="mt-2 space-y-1" role="list" aria-label="Commits">
        {commits.map((commit) => (
          <li key={commit.hash}>
            <button
              aria-pressed={commit.hash === active.hash}
              className={`w-full rounded-md border px-3 py-2 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
                commit.hash === active.hash ? "border-coral/25 bg-white/[0.05]" : "border-transparent hover:bg-white/[0.03]"
              }`}
              onClick={() => setSelected(commit.hash)}
              type="button"
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-coral">{commit.hash}</span>
                <span className="truncate text-[10px] text-slate-300">{commit.message}</span>
              </span>
              <span className="mt-0.5 block text-[9px] text-slate-600">
                {commit.author} · {commit.time}
              </span>
            </button>
          </li>
        ))}
      </ul>
      {active && (
        <div className="mt-3 rounded-md border border-white/[0.07] bg-white/[0.02] p-3">
          <p className="text-[10px] text-slate-300">
            <span className="font-mono text-[11px] text-coral">{active.hash}</span> · {active.message}
          </p>
          <p className="mt-1 text-[9px] text-slate-600">
            {active.author} committed {active.time}
          </p>
          <p className="mt-2 text-[8px] text-slate-600">Commit history shown here is sample data. {gitSimulatedNote}</p>
        </div>
      )}
    </section>
  );
}