import { CloudCog, GitCommitHorizontal, SlidersHorizontal } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WorkspaceView } from "./types";

const devViews: { id: WorkspaceView; label: string; icon: LucideIcon }[] = [
  { id: "git", label: "Git", icon: GitCommitHorizontal },
  { id: "environment", label: "Environment", icon: CloudCog },
  { id: "settings", label: "Settings", icon: SlidersHorizontal },
];

type DeveloperToolbarProps = {
  activeView: WorkspaceView;
  onChange: (view: WorkspaceView) => void;
};

export function DeveloperToolbar({ activeView, onChange }: DeveloperToolbarProps) {
  return (
    <div className="flex h-full min-w-0 items-center" role="group" aria-label="Developer tools">
      <span aria-hidden="true" className="mx-2 h-4 w-px shrink-0 bg-white/[0.09]" />
      {devViews.map(({ id, label, icon: Icon }) => {
        const active = activeView === id;
        return (
          <button
            key={id}
            aria-current={active ? "page" : undefined}
            className={`relative flex h-full shrink-0 items-center gap-2 px-2.5 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 md:px-2.5 ${
              active ? "text-white" : "text-slate-500 hover:text-slate-200"
            }`}
            onClick={() => onChange(id)}
            type="button"
          >
            <Icon aria-hidden="true" className="h-3.5 w-3.5" />
            {label}
            {active && <span className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-coral" />}
          </button>
        );
      })}
    </div>
  );
}