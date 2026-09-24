"use client";

import { MoveRight } from "lucide-react";
import { useState } from "react";
import { NewProjectModal } from "@/components/dashboard/NewProjectModal";
import { toneClasses } from "@/components/dashboard/ProjectThumb";
import { templates } from "@/data/templates";

export default function TemplatesPage() {
  const [active, setActive] = useState<{ name: string; prompt: string } | null>(null);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600">Starters</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Templates</h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Pick a scaffold and Architect builds it for you — or describe something custom.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {templates.map((template) => {
          const tone = toneClasses[template.tone];
          return (
            <article
              key={template.id}
              className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#10141d] transition hover:border-white/[0.16] hover:shadow-[0_14px_34px_rgba(0,0,0,0.22)]"
            >
              <div aria-hidden="true" className={`relative h-28 overflow-hidden bg-gradient-to-br ${tone.from} ${tone.to}`}>
                <div className={`absolute inset-x-0 top-0 h-px w-full ${tone.bar}`} />
                <div className="absolute inset-3 flex flex-col gap-1.5">
                  <div className={`h-1.5 w-2/5 rounded-full ${tone.bar}`} />
                  <div className={`h-1.5 w-3/5 rounded-full ${tone.bar}`} />
                  <div className={`mt-auto h-10 w-full rounded-md border border-white/10 bg-white/[0.03]`} />
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-1 flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold text-white">{template.name}</h3>
                  <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.03] px-2 py-0.5 text-[9px] text-slate-500">
                    {template.category}
                  </span>
                </div>
                <p className="mb-4 line-clamp-2 text-xs leading-5 text-slate-500">{template.description}</p>
                <button
                  type="button"
                  onClick={() => setActive({ name: template.name, prompt: template.prompt })}
                  className="mt-auto inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-white/10 text-xs font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/[0.04] group-hover:text-white"
                >
                  Use template
                  <MoveRight aria-hidden="true" className="h-3.5 w-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <NewProjectModal
        open={active !== null}
        onClose={() => setActive(null)}
        initialName={active?.name ?? ""}
        initialPrompt={active?.prompt ?? ""}
      />
    </div>
  );
}