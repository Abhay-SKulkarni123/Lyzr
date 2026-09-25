"use client";

import { LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDialogFocus } from "@/components/shared/useDialogFocus";
import { templates } from "@/data/templates";

type NewProjectModalProps = {
  open: boolean;
  onClose: () => void;
  initialName?: string;
  initialPrompt?: string;
};

export function NewProjectModal({ open, onClose, initialName = "", initialPrompt = "" }: NewProjectModalProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [prompt, setPrompt] = useState(initialPrompt);
  const [templateId, setTemplateId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useDialogFocus<HTMLDivElement>(open);

  useEffect(() => {
    if (open) {
      setName(initialName);
      setPrompt(initialPrompt);
      setTemplateId("");
      setError(null);
      requestAnimationFrame(() => nameRef.current?.focus());
    }
  }, [open, initialName, initialPrompt]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanPrompt = prompt.trim();
    if (!cleanName || !cleanPrompt) {
      setError("Give your project a name and describe what you want to build.");
      return;
    }
    setError(null);
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    const params = new URLSearchParams({ project: cleanName, prompt: cleanPrompt });
    if (templateId) params.set("template", templateId);
    router.push(`/workspace?${params.toString()}&new=1`);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="New project"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[520px] rounded-2xl border border-white/10 bg-[#10141d] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">New project</h2>
            <p className="mt-1 text-xs text-slate-500">What do you want to build?</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="new-project-name" className="mb-1.5 block text-xs font-medium text-slate-400">
                Project name
              </label>
              <input
                id="new-project-name"
                ref={nameRef}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="e.g. SaaS Analytics"
                className="w-full rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-coral/50 focus:ring-2 focus:ring-coral/20"
              />
            </div>
            <div>
              <label htmlFor="new-project-prompt" className="mb-1.5 block text-xs font-medium text-slate-400">
                Description / prompt
              </label>
              <textarea
                id="new-project-prompt"
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder="Describe what Architect should build…"
                rows={4}
                className="workspace-scrollbar w-full resize-none rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-coral/50 focus:ring-2 focus:ring-coral/20"
              />
            </div>
            <div>
              <label htmlFor="new-project-template" className="mb-1.5 block text-xs font-medium text-slate-400">
                Template <span className="text-slate-600">(optional)</span>
              </label>
              <select
                id="new-project-template"
                value={templateId}
                onChange={(event) => setTemplateId(event.target.value)}
                className="w-full appearance-none rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition focus:border-coral/50 focus:ring-2 focus:ring-coral/20"
              >
                <option value="">No template</option>
                {templates.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-3 text-xs text-rose-400">
              {error}
            </p>
          )}

          <div className="mt-6 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="h-9 rounded-lg border border-white/10 px-4 text-xs font-medium text-slate-400 transition hover:border-white/20 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-coral px-4 text-xs font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (
                <>
                  <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
                  Starting…
                </>
              ) : (
                "Start building"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}