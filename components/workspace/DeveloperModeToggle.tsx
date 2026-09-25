import { Code2, Sparkles } from "lucide-react";

type DeveloperModeToggleProps = {
  developerMode: boolean;
  onChange: (enabled: boolean) => void;
};

export function DeveloperModeToggle({ developerMode, onChange }: DeveloperModeToggleProps) {
  return (
    <>
      <div
        className="hidden h-8 items-center gap-0.5 rounded-md border border-white/[0.08] bg-white/[0.03] p-0.5 md:inline-flex"
        role="group"
        aria-label="Workspace mode"
      >
        <button
          aria-pressed={!developerMode}
          className={`flex h-7 items-center gap-1.5 rounded px-2.5 text-[10px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
            developerMode ? "text-slate-500 hover:text-slate-300" : "bg-white/[0.1] text-white"
          }`}
          onClick={() => onChange(false)}
          type="button"
        >
          <Sparkles aria-hidden="true" className="h-3 w-3" />
          Architect
        </button>
        <button
          aria-pressed={developerMode}
          className={`flex h-7 items-center gap-1.5 rounded px-2.5 text-[10px] font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
            developerMode ? "bg-white/[0.1] text-white" : "text-slate-500 hover:text-slate-300"
          }`}
          onClick={() => onChange(true)}
          type="button"
        >
          <Code2 aria-hidden="true" className="h-3 w-3" />
          Developer
        </button>
      </div>
      <button
        aria-pressed={developerMode}
        aria-label={developerMode ? "Turn off developer mode" : "Turn on developer mode"}
        className={`flex h-8 w-8 items-center justify-center rounded-md border text-[10px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 md:hidden ${
          developerMode
            ? "border-coral/30 bg-coral/[0.12] text-coral"
            : "border-white/[0.1] text-slate-400 hover:text-white"
        }`}
        onClick={() => onChange(!developerMode)}
        type="button"
      >
        <Code2 aria-hidden="true" className="h-3.5 w-3.5" />
      </button>
    </>
  );
}