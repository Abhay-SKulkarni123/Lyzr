import { ArrowRight, FileCode2, FileJson2, FileText, Folder, Layers3 } from "lucide-react";
import type { FilesOverviewEntry } from "@/data/scenarios";

const typeIcon = (type: FilesOverviewEntry["type"]) => {
  if (type === "json") return FileJson2;
  if (type === "css" || type === "md") return FileText;
  return FileCode2;
};

const iconTone = (type: FilesOverviewEntry["type"]) => {
  if (type === "json") return "text-amber-300";
  if (type === "css") return "text-sky-300";
  if (type === "md") return "text-violet-300";
  return "text-coral";
};

type FilesOverviewProps = {
  onOpenFile: (path: string) => void;
  modifiedFiles?: ReadonlySet<string>;
  project: {
    name: string;
    description: string;
    entries: FilesOverviewEntry[];
  };
};

export function FilesOverview({ onOpenFile, modifiedFiles, project }: FilesOverviewProps) {
  const updated = project.entries.filter((entry) => modifiedFiles?.has(entry.path)).length;
  return (
    <section className="mx-auto w-full max-w-[760px] rounded-lg border border-white/[0.08] bg-[#10141d] p-4 sm:p-6" aria-label="Project files overview">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Folder className="h-3.5 w-3.5 text-amber-300" /> {project.name}
          </div>
          <h2 className="mt-2 text-base font-semibold text-white">Project files</h2>
          <p className="mt-1 text-[11px] text-slate-500">{project.description}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {updated > 0 && (
            <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[9px] text-emerald-300">
              <Layers3 className="h-3 w-3" /> {updated} updated
            </span>
          )}
          <span className="flex items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-1 text-[9px] text-slate-500">
            <Layers3 className="h-3 w-3" /> Prototype
          </span>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border border-white/[0.07]">
        {project.entries.map((entry) => {
          const Icon = typeIcon(entry.type);
          const isModified = modifiedFiles?.has(entry.path) ?? false;
          return (
            <button
              key={entry.path}
              className="flex w-full items-center gap-3 border-b border-white/[0.05] px-3 py-3 text-left last:border-0 hover:bg-white/[0.035]"
              onClick={() => onOpenFile(entry.path)}
              type="button"
            >
              <Icon className={`h-4 w-4 shrink-0 ${iconTone(entry.type)}`} />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-[10px] text-slate-300">{entry.path}</span>
                <span className="mt-1 block truncate text-[9px] text-slate-600">{entry.description}</span>
              </span>
              <span className="hidden text-[9px] text-slate-600 sm:block">{entry.size}</span>
              {isModified && (
                <span className="flex shrink-0 items-center gap-1 rounded border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 text-[8px] text-emerald-300">
                  <span className="h-1 w-1 rounded-full bg-emerald-400" />
                  Updated
                </span>
              )}
              <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-700" />
            </button>
          );
        })}
      </div>
      <p className="mt-3 text-[9px] text-slate-600">Selecting a file opens a read-only sample in Code view.</p>
    </section>
  );
}