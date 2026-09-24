"use client";

import { ArrowUp, Paperclip, Sparkles } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";

type PromptComposerProps = {
  isBuilding: boolean;
  onSubmit: (prompt: string) => void;
};

export function PromptComposer({ isBuilding, onSubmit }: PromptComposerProps) {
  const [value, setValue] = useState("");
  const [includeContext, setIncludeContext] = useState(false);

  function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const prompt = value.trim();
    if (!prompt || isBuilding) return;
    onSubmit(prompt);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submit();
    }
  }

  return (
    <form className="relative z-10 shrink-0 border-t border-white/[0.07] bg-[#10141d] px-3 pb-3 pt-3 sm:px-5 sm:pb-4 sm:pt-3.5" onSubmit={submit}>
      <div className="mx-auto max-w-[900px]">
        <div className={`rounded-xl border bg-[#0b0f19] shadow-[0_8px_28px_rgba(0,0,0,0.16)] transition ${isBuilding ? "border-coral/35" : "border-white/[0.1] focus-within:border-white/20"}`}>
          <label className="sr-only" htmlFor="workspace-prompt">Describe what you want to build</label>
          <textarea
            className="workspace-scrollbar block max-h-28 min-h-[55px] w-full resize-none bg-transparent px-4 pb-2 pt-3 text-[12px] leading-5 text-white outline-none placeholder:text-slate-600 sm:min-h-[58px]"
            disabled={isBuilding}
            id="workspace-prompt"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe what you want to build… e.g. a clean SaaS analytics dashboard for a modern startup"
            value={value}
            rows={2}
          />
          <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5 pl-3">
            <div className="flex items-center gap-1">
              <button
                aria-pressed={includeContext}
                className={`flex h-7 items-center gap-1.5 rounded-md px-2 text-[10px] transition ${includeContext ? "bg-coral/10 text-[#ff9a83]" : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"}`}
                onClick={() => setIncludeContext(!includeContext)}
                type="button"
              >
                <Paperclip className="h-3 w-3" />
                {includeContext ? "Project context added" : "Add context"}
              </button>
              <span className="hidden text-[9px] text-slate-700 sm:inline">·</span>
              <span className="hidden text-[9px] text-slate-600 sm:inline">{includeContext ? "Sample project files included" : "Prompt to build · Shift + Enter for a new line"}</span>
            </div>
            <button
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-coral px-3 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              disabled={!value.trim() || isBuilding}
              type="submit"
            >
              {isBuilding ? <Sparkles className="h-3.5 w-3.5 animate-pulse" /> : <ArrowUp className="h-3.5 w-3.5" />}
              <span>{isBuilding ? "Building…" : "Build"}</span>
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-[9px] text-slate-600">
          {isBuilding ? "Architect is simulating a build · no code is generated" : "Describe an idea, ask for a change, or start with a blank canvas."}
        </p>
      </div>
    </form>
  );
}
