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
  { name: "lib", path: "lib", kind: "folder" },
  { name: "analytics.ts", path: "lib/analytics.ts", kind: "file", language: "ts" },
  { name: "package.json", path: "package.json", kind: "file", language: "json" },
];

const FileIcon = ({ language }: { language?: string }) => {
  if (language === "json") return <FileJson2 className="h-3.5 w-3.5 text-amber-300" />;
  if (language === "css") return <FileText className="h-3.5 w-3.5 text-sky-300" />;
  return <FileCode2 className="h-3.5 w-3.5 text-coral" />;
};

type FileExplorerProps = {
  selectedFile: string;
  onSelect: (file: ProjectFile) => void;
};

export function FileExplorer({ selectedFile, onSelect }: FileExplorerProps) {
  return (
    <aside className="hidden w-[218px] shrink-0 flex-col border-r border-white/[0.07] bg-[#10141d] lg:flex">
      <div className="flex h-11 items-center justify-between border-b border-white/[0.06] px-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Project files</span>
        <span className="text-[9px] text-slate-600">6 files</span>
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
              <div key={file.path} className="flex items-center gap-1.5 rounded px-2 py-[7px] text-[11px] text-slate-400">
                <ChevronDown className="h-3 w-3 text-slate-600" />
                <FolderOpen className="h-3.5 w-3.5 text-slate-500" />
                {file.name}
              </div>
            );
          }
          const isNested = file.path.startsWith("app/") || file.path.startsWith("components/") || file.path.startsWith("lib/");
          const active = selectedFile === file.path;
          return (
            <button
              key={file.path}
              className={`flex w-full items-center gap-2 rounded py-[7px] pr-2 text-left text-[11px] transition ${
                active ? "bg-white/[0.08] text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              } ${isNested ? "pl-[34px]" : "pl-[18px]"}`}
              onClick={() => onSelect(file)}
              type="button"
            >
              <FileIcon language={file.language} />
              <span className="truncate">{file.name}</span>
            </button>
          );
        })}
      </div>
      <div className="border-t border-white/[0.06] px-4 py-3 text-[10px] text-slate-600">
        <span className="font-mono">6</span> files · prototype
      </div>
    </aside>
  );
}
