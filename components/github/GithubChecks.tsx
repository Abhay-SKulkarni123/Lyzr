import { CheckCircle2, CircleX } from "lucide-react";
import { githubSimulatedNote, type GithubCheck } from "@/data/github";

type GithubChecksProps = {
  checks: GithubCheck[];
};

export function GithubChecks({ checks }: GithubChecksProps) {
  return (
    <div className="rounded-md border border-white/[0.07] bg-[#0b0f19] p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-[9px] font-semibold uppercase tracking-wide text-slate-500">Architect checks</h3>
        <span className="text-[8px] text-slate-600">Simulated checks</span>
      </div>
      <ul className="space-y-1.5">
        {checks.map((check) => (
          <li key={check.label} className="flex items-center gap-2 text-[10px]">
            {check.status === "passing" ? (
              <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-emerald-300" />
            ) : (
              <CircleX aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-rose-300" />
            )}
            <span className={check.status === "passing" ? "text-slate-300" : "text-rose-200"}>{check.label}</span>
            <span className="ml-auto text-slate-500">{check.status}</span>
          </li>
        ))}
      </ul>
      <p className="mt-2.5 text-[8px] leading-4 text-slate-600">{githubSimulatedNote} No remote workflow actually ran.</p>
    </div>
  );
}