"use client";

import { FileUp, GitBranch, LoaderCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useDialogFocus } from "@/components/shared/useDialogFocus";

type ImportSource = "github" | "upload";

type ImportProjectModalProps = {
  open: boolean;
  onClose: () => void;
};

const importSteps: string[] = [
  "Connecting to source...",
  "Detecting framework",
  "Indexing files",
  "Preparing workspace",
];

export function ImportProjectModal({ open, onClose }: ImportProjectModalProps) {
  const router = useRouter();
  const [source, setSource] = useState<ImportSource>("github");
  const [repoUrl, setRepoUrl] = useState("");
  const [framework, setFramework] = useState("Next.js");
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState(-1);
  const urlRef = useRef<HTMLInputElement | null>(null);
  const dialogRef = useDialogFocus<HTMLDivElement>(open);

  useEffect(() => {
    if (open) {
      setRepoUrl("");
      setFramework("Next.js");
      setSource("github");
      setError(null);
      setStep(-1);
      requestAnimationFrame(() => urlRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        if (step < 0) onClose();
      }
    }
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, step]);

  if (!open) return null;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const repository = source === "github" ? repoUrl.trim() : "";
    if (source === "github" && !repository) {
      setError("Paste a repository URL to import.");
      return;
    }
    setError(null);
    for (let index = 0; index < importSteps.length; index += 1) {
      setStep(index);
      await new Promise((resolve) => window.setTimeout(resolve, 620));
    }
    const name =
      source === "github"
        ? (repository.split("/").pop()?.replace(/\.git$/, "") || "imported-project")
        : "my-imported-app";
    const prompt = `Continue building on this imported project (${name}).`;
    router.push(`/workspace?project=${encodeURIComponent(name)}&prompt=${encodeURIComponent(prompt)}&imported=1`);
  }

  const importing = step >= 0;
  const frameworks = ["Next.js", "React (Vite)", "Vue", "Svelte", "Astro", "Static HTML"];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="Import an existing project"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && step < 0) onClose();
      }}
    >
      <div className="w-full max-w-[520px] rounded-2xl border border-white/10 bg-[#10141d] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.45)]">
        <div className="mb-5 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">Import existing project</h2>
            <p className="mt-1 text-xs text-slate-500">
              Bring an existing codebase into Architect and keep working on it.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={importing}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        <div className="mb-4 grid grid-cols-2 gap-2">
          {(
            [
              { id: "github", label: "GitHub repository", icon: GitBranch },
              { id: "upload", label: "Upload code", icon: FileUp },
            ] as const
          ).map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              disabled={importing}
              onClick={() => setSource(id)}
              aria-pressed={source === id}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs font-medium transition disabled:opacity-50 ${
                source === id
                  ? "border-coral/40 bg-coral/10 text-white"
                  : "border-white/10 bg-white/[0.02] text-slate-400 hover:border-white/20 hover:text-slate-200"
              }`}
            >
              <Icon aria-hidden="true" className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        {importing ? (
          <ol className="space-y-3 rounded-xl border border-white/10 bg-[#0b0f19] p-4">
            {importSteps.map((label, index) => (
              <li key={label} className="flex items-center gap-2.5 text-xs">
                {index < step ? (
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-mint/15 text-[10px] text-mint">
                    ok
                  </span>
                ) : index === step ? (
                  <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin text-coral" />
                ) : (
                  <span className="h-4 w-4 rounded-full border border-white/10" aria-hidden="true" />
                )}
                <span className={index <= step ? "text-slate-300" : "text-slate-600"}>{label}</span>
              </li>
            ))}
          </ol>
        ) : (
          <form onSubmit={submit}>
            <div className="space-y-4">
              {source === "github" ? (
                <div>
                  <label htmlFor="import-repo-url" className="mb-1.5 block text-xs font-medium text-slate-400">
                    Repository URL
                  </label>
                  <input
                    id="import-repo-url"
                    ref={urlRef}
                    value={repoUrl}
                    onChange={(event) => setRepoUrl(event.target.value)}
                    placeholder="https://github.com/owner/project"
                    autoComplete="off"
                    className="w-full rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-coral/50 focus:ring-2 focus:ring-coral/20"
                  />
                  <p className="mt-1.5 text-[10px] text-slate-600">
                    Import reads the repository metadata only. In this prototype no code is actually fetched.
                  </p>
                </div>
              ) : (
                <div>
                  <label htmlFor="import-framework" className="mb-1.5 block text-xs font-medium text-slate-400">
                    Detect framework
                  </label>
                  <select
                    id="import-framework"
                    value={framework}
                    onChange={(event) => setFramework(event.target.value)}
                    className="w-full appearance-none rounded-lg border border-white/10 bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition focus:border-coral/50 focus:ring-2 focus:ring-coral/20"
                  >
                    {frameworks.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1.5 text-[10px] text-slate-600">
                    Selecting a framework lets Architect preview the import before a real upload flow exists.
                  </p>
                </div>
              )}
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
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-coral px-4 text-xs font-semibold text-white transition hover:bg-[#ff795c]"
              >
                Import project
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}