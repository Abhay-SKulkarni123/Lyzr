import { ArrowRight, FileCode2, FileJson2, FileText, Folder, Layers3 } from "lucide-react";

const entries = [
  { path: "app/page.tsx", description: "Dashboard entry point", type: "tsx", size: "2.4 KB" },
  { path: "app/layout.tsx", description: "Application shell and metadata", type: "tsx", size: "1.1 KB" },
  { path: "app/globals.css", description: "Global styles and theme", type: "css", size: "3.8 KB" },
  { path: "components/Dashboard.tsx", description: "Main analytics view", type: "tsx", size: "3.6 KB" },
  { path: "components/dashboard/Sidebar.tsx", description: "App navigation", type: "tsx", size: "2.1 KB" },
  { path: "components/dashboard/KpiCard.tsx", description: "Key performance metric card", type: "tsx", size: "1.4 KB" },
  { path: "components/dashboard/RevenueChart.tsx", description: "Monthly revenue chart", type: "tsx", size: "2.4 KB" },
  { path: "components/dashboard/Analytics.tsx", description: "Traffic source breakdown", type: "tsx", size: "1.7 KB" },
  { path: "lib/analytics.ts", description: "Sample dashboard metrics", type: "ts", size: "1.6 KB" },
  { path: "package.json", description: "Project scripts and dependencies", type: "json", size: "1.0 KB" },
  { path: "README.md", description: "Getting started guide", type: "md", size: "0.7 KB" },
];

const typeIcon = (type: string) => {
  if (type === "json") return FileJson2;
  if (type === "css" || type === "md") return FileText;
  return FileCode2;
};

const iconTone = (type: string) => {
  if (type === "json") return "text-amber-300";
  if (type === "css") return "text-sky-300";
  if (type === "md") return "text-violet-300";
  return "text-coral";
};

type FilesOverviewProps = {
  onOpenFile: (path: string) => void;
  modifiedFiles?: ReadonlySet<string>;
};

export function FilesOverview({ onOpenFile, modifiedFiles }: FilesOverviewProps) {
  const updated = entries.filter((entry) => modifiedFiles?.has(entry.path)).length;
  return (
    <section className="mx-auto w-full max-w-[760px] rounded-lg border border-white/[0.08] bg-[#10141d] p-4 sm:p-6" aria-label="Project files overview">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-[10px] text-slate-500">
            <Folder className="h-3.5 w-3.5 text-amber-300" /> saas-analytics
          </div>
          <h2 className="mt-2 text-base font-semibold text-white">Project files</h2>
          <p className="mt-1 text-[11px] text-slate-500">A sample project structure for the generated dashboard.</p>
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
        {entries.map((entry) => {
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