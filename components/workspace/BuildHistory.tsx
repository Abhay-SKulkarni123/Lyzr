import { Check, History, Layers, MessageSquareText } from "lucide-react";
import type { BuildVersion } from "@/data/builds";

type BuildHistoryProps = {
  promptStack: string[];
  versions: BuildVersion[];
};

export function BuildHistory({ promptStack, versions }: BuildHistoryProps) {
  const recent = promptStack.length ? promptStack.slice().reverse() : [];
  return (
    <div className="space-y-3">
      <section aria-label="Recent instructions">
        <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          <MessageSquareText aria-hidden="true" className="h-3 w-3" />
          Recent instructions
        </div>
        {recent.length === 0 ? (
          <p className="rounded-md border border-dashed border-white/[0.07] px-2.5 py-2 text-[9px] leading-[15px] text-slate-600">
            Submit a prompt below to see it here.
          </p>
        ) : (
          <ol className="space-y-1">
            {recent.map((prompt, index) => (
              <li key={`${prompt}-${index}`} className="flex items-start gap-2 rounded-md border border-white/[0.06] bg-[#0c1018] px-2.5 py-2">
                <span className="mt-[1px] shrink-0 rounded bg-coral/10 px-1 py-px font-mono text-[7px] font-semibold text-coral">
                  #{recent.length - index}
                </span>
                <p className="min-w-0 flex-1 text-[9px] leading-[15px] text-slate-400">“{prompt}”</p>
              </li>
            ))}
          </ol>
        )}
      </section>

      <section aria-label="Build history">
        <div className="mb-1.5 flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-slate-600">
          <History aria-hidden="true" className="h-3 w-3" />
          Build history
        </div>
        <ol className="space-y-1">
          {versions.map((build, index) => {
            const isLatest = index === versions.length - 1;
            return (
              <li key={build.version} className="flex items-center gap-2.5 rounded-md px-2 py-1.5">
                <span
                  className={`flex h-5 w-8 shrink-0 items-center justify-center rounded font-mono text-[8px] font-semibold ${
                    isLatest ? "bg-coral/10 text-coral" : "bg-white/[0.04] text-slate-500"
                  }`}
                >
                  {build.version}
                </span>
                <span className={`min-w-0 flex-1 truncate text-[10px] leading-4 ${isLatest ? "text-slate-300" : "text-slate-500"}`}>
                  {build.label}
                </span>
                {isLatest ? (
                  <Check aria-hidden="true" className="h-3 w-3 shrink-0 text-emerald-300" />
                ) : (
                  <Layers aria-hidden="true" className="h-3 w-3 shrink-0 text-slate-700" />
                )}
              </li>
            );
          })}
        </ol>
      </section>
    </div>
  );
}