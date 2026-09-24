import { FileCode2, X } from "lucide-react";
import { basename } from "@/data/developer";

type CodeTabsProps = {
  tabs: string[];
  activePath: string | null;
  modifiedFiles?: ReadonlySet<string>;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
};

export function CodeTabs({ tabs, activePath, modifiedFiles, onSelect, onClose }: CodeTabsProps) {
  if (tabs.length === 0) return null;
  return (
    <div
      className="workspace-scrollbar flex h-9 shrink-0 items-stretch overflow-x-auto border-b border-white/[0.07] bg-[#0c1018]"
      role="tablist"
      aria-label="Open files"
    >
      {tabs.map((path) => {
        const active = path === activePath;
        const modified = modifiedFiles?.has(path) ?? false;
        return (
          <div
            key={path}
            role="tab"
            aria-selected={active}
            className={`group relative flex min-w-0 shrink-0 items-center gap-1.5 border-r border-white/[0.05] py-0 pl-3 pr-1 text-[10px] transition ${
              active ? "bg-white/[0.06] text-white" : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
            }`}
          >
            <button
              aria-label={`Open ${path}`}
              className={`flex min-w-0 max-w-[180px] items-center gap-1.5 py-2 pr-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
                active ? "cursor-default" : "cursor-pointer"
              }`}
              onClick={() => onSelect(path)}
              type="button"
            >
              <FileCode2 aria-hidden="true" className="h-3 w-3 shrink-0 text-coral/80" />
              <span className="truncate">{basename(path)}</span>
              {modified && <span aria-label="Modified" className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />}
            </button>
            <button
              aria-label={`Close ${path}`}
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded text-slate-600 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 hover:bg-white/[0.08] hover:text-white ${
                active ? "" : "opacity-0 group-hover:opacity-100"
              }`}
              onClick={() => onClose(path)}
              type="button"
            >
              <X aria-hidden="true" className="h-3 w-3" />
            </button>
          </div>
        );
      })}
      <span aria-hidden="true" className="flex min-w-0 flex-1 items-center px-3 text-[9px] text-slate-700">
        Read-only prototype
      </span>
    </div>
  );
}