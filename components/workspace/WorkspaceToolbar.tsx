import { Braces, Eye, Files, TerminalSquare } from "lucide-react";
import { isBuildPhase, type BuildStatus, type WorkspaceView } from "./types";
import { DeveloperToolbar } from "./DeveloperToolbar";

const views: { id: WorkspaceView; label: string; icon: typeof Eye }[] = [
  { id: "preview", label: "Preview", icon: Eye },
  { id: "code", label: "Code", icon: Braces },
  { id: "terminal", label: "Terminal", icon: TerminalSquare },
  { id: "files", label: "Files", icon: Files },
];

type WorkspaceToolbarProps = {
  activeView: WorkspaceView;
  onChange: (view: WorkspaceView) => void;
  status?: BuildStatus;
  developerMode?: boolean;
};

export function WorkspaceToolbar({ activeView, onChange, status = "idle", developerMode = false }: WorkspaceToolbarProps) {
  return (
    <nav
      aria-label="Workspace views"
      className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.07] bg-[#10141d]"
    >
      <div className="workspace-scrollbar flex h-full min-w-0 flex-1 items-center overflow-x-auto">
        {views.map(({ id, label, icon: Icon }) => {
          const active = activeView === id;
          return (
            <button
              key={id}
              aria-current={active ? "page" : undefined}
              className={`relative flex h-full shrink-0 items-center gap-2 px-2.5 text-xs transition md:px-3 ${
                active ? "text-white" : "text-slate-500 hover:text-slate-200"
              }`}
              onClick={() => onChange(id)}
              type="button"
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {label}
              {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-coral md:inset-x-3" />}
            </button>
          );
        })}
        {developerMode && <DeveloperToolbar activeView={activeView} onChange={onChange} />}
      </div>
      <div className="hidden shrink-0 items-center gap-2 border-l border-white/[0.06] pl-4 pr-3 text-[11px] text-slate-500 sm:flex">
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            isBuildPhase(status) ? "animate-pulse bg-amber-400" : status === "error" ? "bg-rose-400" : "bg-mint"
          }`}
        />
        {isBuildPhase(status) ? "Agentic build in progress" : status === "error" ? "Build failed" : "Changes saved"}
      </div>
    </nav>
  );
}