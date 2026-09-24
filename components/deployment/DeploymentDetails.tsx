import { FolderOutput, GitBranch, GitCommitHorizontal, TerminalSquare, Timer } from "lucide-react";
import type { ReactNode } from "react";
import type { DeploymentRecord } from "@/data/deployment";

export function DeploymentDetails({ record }: { record: DeploymentRecord }) {
  const rows: Array<{ icon: ReactNode; label: string; value: string; mono?: boolean }> = [
    { icon: <GitBranch />, label: "Branch", value: record.branch, mono: true },
    { icon: <GitCommitHorizontal />, label: "Commit", value: record.commitSha, mono: true },
    { icon: <FolderOutput />, label: "Output directory", value: record.outputDirectory, mono: true },
    { icon: <TerminalSquare />, label: "Build command", value: record.buildCommand, mono: true },
    { icon: <Timer />, label: "Duration", value: record.duration ?? "—" },
  ];

  return (
    <dl className="space-y-1.5">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between gap-3 rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2">
          <dt className="flex items-center gap-1.5 text-[9px] uppercase tracking-wide text-slate-500 [&>svg]:h-3 [&>svg]:w-3 [&>svg]:text-slate-600">
            {row.icon}
            {row.label}
          </dt>
          <dd className={`truncate text-[10px] text-slate-300 ${row.mono ? "font-mono" : ""}`}>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}