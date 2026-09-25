import { Info, Wrench } from "lucide-react";
import { developerSettings } from "@/data/developer";

export function DeveloperSettingsPanel() {
  return (
    <section className="mx-auto w-full max-w-[760px] rounded-lg border border-white/[0.08] bg-[#10141d] p-4 sm:p-6" aria-label="Developer settings">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-base font-semibold text-white">
            <Wrench aria-hidden="true" className="h-4 w-4 text-coral" />
            Developer settings
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">Runtime and build configuration for this project.</p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/[0.08] px-2.5 py-1 text-[9px] text-slate-500">
          <Info aria-hidden="true" className="h-3 w-3" />
          Informational
        </span>
      </div>

      <dl className="overflow-hidden rounded-md border border-white/[0.07]">
        {developerSettings.map((setting, index) => (
          <div key={setting.label} className={`flex items-center justify-between gap-3 px-3 py-2.5 ${index !== developerSettings.length - 1 ? "border-b border-white/[0.05]" : ""}`}>
            <dt className="text-[10px] text-slate-500">{setting.label}</dt>
            <dd className="shrink-0 font-mono text-[10px] text-slate-300">{setting.value}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-3 text-[9px] leading-[15px] text-slate-600">
        Values are sample configuration. Nothing here changes a real runtime.
      </p>
    </section>
  );
}