"use client";

import { ArrowUp, LoaderCircle, Paperclip } from "lucide-react";
import { useState, type FormEvent, type KeyboardEvent } from "react";
import { isBuildPhase, type BuildStatus } from "./types";

type PromptComposerProps = {
  status: BuildStatus;
  onSubmit: (prompt: string) => void;
};

export function PromptComposer({ status, onSubmit }: PromptComposerProps) {
  const [value, setValue] = useState("");
  const [includeContext, setIncludeContext] = useState(false);

  const busy = isBuildPhase(status);
  const hasBuilt = status === "complete" || status === "error";

  const placeholder =
    status === "error"
      ? "The last build failed — try again with a tweaked prompt"
      : busy
      ? "Architect is working through your request…"
      : status === "complete"
      ? "Build complete — describe another change to iterate on it"
      : "Describe what you want to build… e.g. make the dashboard more compact";

  const hint =
    status === "error"
      ? "Build failed. You can retry from the activity panel."
      : busy
      ? "Architect is simulating a build · no code is generated"
      : status === "complete"
      ? "Build complete — ask Architect for another change."
      : "Describe an idea, ask for a change, or start with a blank canvas.";

  function submit(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    const prompt = value.trim();
    if (!prompt || busy) return;
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
        <div
          className={`rounded-xl border bg-[#0b0f19] shadow-[0_8px_28px_rgba(0,0,0,0.16)] transition ${
            busy
              ? "border-coral/35"
              : status === "error"
              ? "border-rose-500/30"
              : "border-white/[0.1] focus-within:border-white/20"
          }`}
        >
          <label className="sr-only" htmlFor="workspace-prompt">Describe the change you want</label>
          <textarea
            className="workspace-scrollbar block max-h-28 min-h-[55px] w-full resize-none bg-transparent px-4 pb-2 pt-3 text-[12px] leading-5 text-white outline-none placeholder:text-slate-600 sm:min-h-[58px]"
            disabled={busy}
            id="workspace-prompt"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            value={value}
            rows={2}
          />
          <div className="flex items-center justify-between gap-2 px-2.5 pb-2.5 pl-3">
            <div className="flex items-center gap-1">
              <button
                aria-pressed={includeContext}
                className={`flex h-7 items-center gap-1.5 rounded-md px-2 text-[10px] transition ${
                  includeContext ? "bg-coral/10 text-[#ff9a83]" : "text-slate-500 hover:bg-white/[0.05] hover:text-slate-300"
                }`}
                disabled={busy}
                onClick={() => setIncludeContext(!includeContext)}
                type="button"
              >
                <Paperclip className="h-3 w-3" />
                {includeContext ? "Project context added" : "Add context"}
              </button>
              <span className="hidden text-[9px] text-slate-700 sm:inline">·</span>
              <span className="hidden text-[9px] text-slate-600 sm:inline">
                {includeContext ? "Sample project files included" : "Shift + Enter for a new line"}
              </span>
            </div>
            <button
              className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg bg-coral px-3 text-[10px] font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              disabled={!value.trim() || busy}
              type="submit"
            >
              {busy ? (
                <>
                  <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
                  Building…
                </>
              ) : (
                <>
                  <ArrowUp className="h-3.5 w-3.5" />
                  {hasBuilt ? "Apply change" : "Build"}
                </>
              )}
            </button>
          </div>
        </div>
        <p className="mt-2 text-center text-[9px] text-slate-600">{hint}</p>
      </div>
    </form>
  );
}