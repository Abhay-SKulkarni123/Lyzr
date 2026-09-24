import { Check, Copy, FileCode2, Search, ShieldCheck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { basename, dirname, fileLinesFor, languageLabel, languageOf } from "@/data/developer";
import { CodeTabs } from "./CodeTabs";

function toneForLine(line: string): string {
  const trimmed = line.trim();
  if (trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("/*")) return "text-slate-600";
  if (line.includes("import ") || trimmed.startsWith("export ") || trimmed.startsWith("type ")) return "text-violet-300";
  return "text-slate-300";
}

type CodeEditorProps = {
  tabs: string[];
  activePath: string | null;
  modifiedFiles?: ReadonlySet<string>;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
};

export function CodeEditor({ tabs, activePath, modifiedFiles, onSelect, onClose }: CodeEditorProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  const lines = useMemo(() => (activePath ? fileLinesFor(activePath) : []), [activePath]);
  const filtered = useMemo(() => {
    const source = lines.map((line, lineIndex) => ({ line, lineIndex }));
    if (!query.trim()) return source;
    const normalized = query.trim().toLowerCase();
    return source.filter(({ line }) => line.toLowerCase().includes(normalized));
  }, [lines, query]);

  useEffect(
    () => () => {
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
    },
    []
  );

  if (!activePath) {
    return (
      <section className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#0c1018]" aria-label="Code editor">
        <CodeTabs tabs={tabs} activePath={activePath} modifiedFiles={modifiedFiles} onSelect={onSelect} onClose={onClose} />
        <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.04] text-slate-500">
            <FileCode2 aria-hidden="true" className="h-5 w-5" />
          </span>
          <p className="max-w-[300px] text-[11px] leading-5 text-slate-500">
            Select a file from the explorer, the Files view, or the build activity to inspect it.
          </p>
          <p className="text-[9px] text-slate-600">Files are read-only in this prototype.</p>
        </div>
      </section>
    );
  }

  const language = languageOf(activePath);
  const modified = modifiedFiles?.has(activePath) ?? false;
  const content = lines.join("\n");

  function copyContent() {
    if (!activePath) return;
    void navigator.clipboard?.writeText(content).then(() => {
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 1600);
    });
  }

  return (
    <section className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#0c1018]" aria-label="Code editor">
      <CodeTabs tabs={tabs} activePath={activePath} modifiedFiles={modifiedFiles} onSelect={onSelect} onClose={onClose} />
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-white/[0.07] px-3">
        <div className="flex min-w-0 items-center gap-2 text-[10px] text-slate-400">
          <FileCode2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-coral" />
          <span className="truncate text-slate-300">
            <span className="text-slate-600">{dirname(activePath)}</span>
            {basename(activePath)}
          </span>
          <span className="hidden shrink-0 rounded border border-white/[0.07] px-1.5 py-0.5 text-[8px] text-slate-600 sm:inline">
            {languageLabel(language)}
          </span>
          {modified && (
            <span className="flex shrink-0 items-center gap-1 rounded border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 text-[8px] text-emerald-300">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Updated
            </span>
          )}
          <span className="hidden shrink-0 items-center gap-1 rounded border border-white/[0.07] px-1.5 py-0.5 text-[8px] text-slate-600 md:inline-flex">
            <ShieldCheck aria-hidden="true" className="h-2.5 w-2.5" />
            Read-only prototype
          </span>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <label className="relative flex items-center">
            <span className="sr-only">Search in file</span>
            <Search aria-hidden="true" className={`pointer-events-none absolute left-2 h-3 w-3 ${searchOpen ? "text-coral" : "text-slate-600"}`} />
            <input
              className={`h-6 rounded border border-white/[0.08] bg-[#0b0f19] pl-7 pr-2 text-[9px] text-white outline-none transition-all placeholder:text-slate-600 focus:border-coral/40 focus:ring-1 focus:ring-coral/30 ${
                searchOpen ? "w-36" : "w-7 cursor-pointer focus:w-36"
              }`}
              placeholder="Find…"
              value={query}
              role="searchbox"
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={(event) => {
                if (!event.target.value) setSearchOpen(false);
              }}
            />
          </label>
          <button
            aria-label="Copy file contents"
            className="flex h-6 w-6 items-center justify-center rounded text-slate-500 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 hover:bg-white/[0.05] hover:text-white"
            onClick={copyContent}
            type="button"
          >
            {copied ? <Check aria-hidden="true" className="h-3 w-3 text-emerald-300" /> : <Copy aria-hidden="true" className="h-3 w-3" />}
          </button>
        </div>
      </div>
      <div className="workspace-scrollbar flex-1 overflow-auto py-3 font-mono text-[11px] leading-[22px]">
        {query.trim() && (
          <div className="flex items-center gap-2 px-4 pb-2 text-[9px] text-slate-500" aria-live="polite">
            <Search aria-hidden="true" className="h-3 w-3" />
            {filtered.length} match{filtered.length === 1 ? "" : "es"} for “{query}”
          </div>
        )}
        {query.trim() && filtered.length === 0 ? (
          <p className="px-4 text-[10px] text-slate-600">No matches found in this file.</p>
        ) : (
          filtered.map(({ line, lineIndex }) => (
            <div key={`${lineIndex}-${line}`} className="flex min-w-max px-4 hover:bg-white/[0.025]">
              <span className={`mr-5 inline-block w-5 select-none text-right ${modified ? "text-emerald-400/40" : "text-slate-700"}`}>
                {lineIndex + 1}
              </span>
              <code className={toneForLine(line)}>{line || " "}</code>
            </div>
          ))
        )}
      </div>
    </section>
  );
}