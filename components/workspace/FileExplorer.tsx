import {
  ChevronDown,
  FileCode2,
  FileJson2,
  FileText,
  FolderOpen,
} from "lucide-react";
import type { ProjectFile } from "./types";

const files: ProjectFile[] = [
  { name: "app", path: "app", kind: "folder" },
  { name: "page.tsx", path: "app/page.tsx", kind: "file", language: "tsx" },
  { name: "layout.tsx", path: "app/layout.tsx", kind: "file", language: "tsx" },
  { name: "globals.css", path: "app/globals.css", kind: "file", language: "css" },
  { name: "components", path: "components", kind: "folder" },
  { name: "Overview.tsx", path: "components/Overview.tsx", kind: "file", language: "tsx" },
  { name: "dashboard", path: "components/dashboard", kind: "folder" },
  { name: "Sidebar.tsx", path: "components/dashboard/Sidebar.tsx", kind: "file", language: "tsx" },
  { name: "KpiCard.tsx", path: "components/dashboard/KpiCard.tsx", kind: "file", language: "tsx" },
  { name: "RevenueChart.tsx", path: "components/dashboard/RevenueChart.tsx", kind: "file", language: "tsx" },
  { name: "lib", path: "lib", kind: "folder" },
  { name: "analytics.ts", path: "lib/analytics.ts", kind: "file", language: "ts" },
  { name: "package.json", path: "package.json", kind: "file", language: "json" },
];

const FileIcon = ({ language }: { language?: string }) => {
  if (language === "json") return <FileJson2 className="h-3.5 w-3.5 text-amber-300" />;
  if (language === "css") return <FileText className="h-3.5 w-3.5 text-sky-300" />;
  return <FileCode2 className="h-3.5 w-3.5 text-coral" />;
};

function indentFor(path: string): string {
  if (path.startsWith("components/dashboard/")) return "pl-[50px]";
  if (path.startsWith("app/") || path.startsWith("components/") || path.startsWith("lib/")) return "pl-[34px]";
  return "pl-[18px]";
}

const fileCount = files.filter((file) => file.kind === "file").length;

type FileExplorerProps = {
  selectedFile: string;
  onSelect: (file: ProjectFile) => void;
  modifiedFiles?: ReadonlySet<string>;
};

export function FileExplorer({ selectedFile, onSelect, modifiedFiles }: FileExplorerProps) {
  const modifiedCount = modifiedFiles?.size ?? 0;
  return (
    <aside className="hidden w-[218px] shrink-0 flex-col border-r border-white/[0.07] bg-[#10141d] lg:flex">
      <div className="flex h-11 items-center justify-between border-b border-white/[0.06] px-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Project files</span>
        <span className={`text-[9px] ${modifiedCount > 0 ? "text-emerald-300" : "text-slate-600"}`}>
          {fileCount} files{modifiedCount > 0 ? ` · ${modifiedCount} updated` : ""}
        </span>
      </div>
      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-2 py-3">
        <div className="mb-1 flex items-center gap-1.5 rounded px-2 py-1.5 text-[11px] font-medium text-slate-300">
          <ChevronDown className="h-3 w-3 text-slate-500" />
          <FolderOpen className="h-3.5 w-3.5 text-amber-300" />
          northstar-analytics
        </div>
        {files.map((file) => {
          if (file.kind === "folder") {
            return (
              <div key={file.path} className={`flex items-center gap-1.5 rounded px-2 py-[7px] text-[11px] text-slate-400 ${indentFor(file.path)}`}>
                <ChevronDown className="h-3 w-3 text-slate-600" />
                <FolderOpen className="h-3.5 w-3.5 text-slate-500" />
                {file.name}
              </div>
            );
          }
          const active = selectedFile === file.path;
          const modified = modifiedFiles?.has(file.path) ?? false;
          return (
            <button
              key={file.path}
              className={`flex w-full items-center gap-2 rounded py-[7px] pr-2 text-left text-[11px] transition ${
                active ? "bg-white/[0.08] text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              } ${indentFor(file.path)}`}
              onClick={() => onSelect(file)}
              type="button"
            >
              <FileIcon language={file.language} />
              <span className="truncate">{file.name}</span>
              {modified && (
                <span className="ml-auto flex h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" aria-label="Updated in this build" />
              )}
            </button>
          );
        })}
      </div>
      <div className="border-t border-white/[0.06] px-4 py-3 text-[10px] text-slate-600">
        <span className="font-mono">{fileCount}</span> files · build updates are simulated
      </div>
    </aside>
  );
}