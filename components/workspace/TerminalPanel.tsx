import { LoaderCircle, TerminalSquare } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import {
  findTerminalCommand,
  simulatedTerminalNote,
  terminalBoot,
  terminalSuggestions,
  type CodeTone,
  type TerminalLine,
} from "@/data/developer";

const toneClass: Record<CodeTone, string> = {
  prompt: "text-emerald-300",
  success: "text-emerald-300",
  muted: "text-slate-500",
  warn: "text-amber-300",
  error: "text-rose-300",
  plain: "text-slate-300",
};

export function TerminalPanel() {
  const [lines, setLines] = useState<TerminalLine[]>(terminalBoot);
  const [input, setInput] = useState("");
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (container) container.scrollTop = container.scrollHeight;
  }, [lines]);

  function run(command: string) {
    const trimmed = command.trim();
    if (!trimmed) return;
    const match = findTerminalCommand(trimmed);
    const next: TerminalLine[] = [
      { text: trimmed, tone: "prompt" },
      ...(match
        ? match.lines
        : [{ text: simulatedTerminalNote, tone: "warn" as const }]),
      { text: "", tone: "plain" as const },
    ];
    setLines((prev) => [...prev, ...next]);
    setInput("");
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(input);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      run(input);
    }
  }

  return (
    <section className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#0c1018]" aria-label="Simulated terminal">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.07] px-3">
        <span className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
          <TerminalSquare aria-hidden="true" className="h-3.5 w-3.5 text-slate-600" />
          Simulated terminal
        </span>
        <span className="flex items-center gap-1.5 text-[9px] text-slate-600">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Mock session
        </span>
      </div>

      <div ref={containerRef} className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto p-4 font-mono text-[11px] leading-6">
        {lines.map((line, index) => (
          <div className={toneClass[line.tone ?? "plain"]} key={index}>
            {line.tone === "prompt" ? `$ ${line.text}` : line.text || "\u00A0"}
          </div>
        ))}
        <div className="mt-1 flex items-center gap-2">
          <span className="text-emerald-300">$</span>
          <input
            aria-label="Terminal command"
            className="w-full bg-transparent text-[11px] text-white outline-none placeholder:text-slate-700"
            onKeyDown={handleKeyDown}
            placeholder="Try npm run build, npm run lint, git status…"
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>
      </div>

      <form className="border-t border-white/[0.06] px-4 py-3" onSubmit={submit}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <span className="text-[9px] text-slate-600">Try:</span>
            {terminalSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                className="rounded border border-white/[0.07] px-2 py-0.5 font-mono text-[9px] text-slate-500 transition hover:border-coral/30 hover:text-coral focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
                onClick={() => run(suggestion)}
                type="button"
              >
                {suggestion}
              </button>
            ))}
          </div>
          <button
            className="flex h-7 shrink-0 items-center gap-1.5 rounded-md border border-white/[0.1] px-3 text-[10px] font-semibold text-slate-300 transition hover:border-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            type="submit"
          >
            <LoaderCircle aria-hidden="true" className="h-3 w-3 text-slate-500" />
            Run
          </button>
        </div>
        <p className="mt-2 text-[8px] text-slate-600">Commands are not executed. Only safe demo commands return mock output.</p>
      </form>
    </section>
  );
}