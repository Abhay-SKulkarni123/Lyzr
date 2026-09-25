"use client";

import { ArrowUp, LoaderCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const suggestions = [
  "Build a SaaS analytics dashboard",
  "Create a customer support portal",
  "Build a landing page for my startup",
];

export function BuildPrompt() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  async function build() {
    const prompt = value.trim();
    if (!prompt || loading) return;
    setLoading(true);
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    router.push(`/workspace?prompt=${encodeURIComponent(prompt)}&new=1`);
  }

  return (
    <section aria-label="Build from a prompt" className="w-full">
      <div className={`rounded-2xl border bg-[#10141d] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition sm:p-5 ${loading ? "border-coral/40" : "border-white/[0.08] focus-within:border-white/15"}`}>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            build();
          }}
        >
          <label htmlFor="dashboard-prompt" className="sr-only">
            Describe what you want to build
          </label>
          <textarea
            id="dashboard-prompt"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="Describe the product you want to build..."
            rows={3}
            disabled={loading}
            className="workspace-scrollbar w-full resize-none bg-transparent text-sm leading-6 text-white outline-none placeholder:text-slate-600"
          />
          <div className="mt-3 flex items-center justify-between gap-2">
            <span className="hidden text-[10px] text-slate-600 sm:block">
              Start with an idea. Architect scaffolds the project for you.
            </span>
            <button
              type="submit"
              disabled={!value.trim() || loading}
              className="ml-auto inline-flex h-9 items-center gap-2 rounded-lg bg-coral px-4 text-xs font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
            >
              {loading ? (
                <>
                  <LoaderCircle aria-hidden="true" className="h-3.5 w-3.5 animate-spin" />
                  Building...
                </>
              ) : (
                <>
                  Build
                  <ArrowUp aria-hidden="true" className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            disabled={loading}
            onClick={() => setValue(suggestion)}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-white/[0.02] px-2.5 py-1 text-[10px] text-slate-500 transition hover:border-white/15 hover:text-slate-300 disabled:opacity-60"
          >
            <Sparkles aria-hidden="true" className="h-3 w-3 text-coral/70" />
            {suggestion}
          </button>
        ))}
      </div>
    </section>
  );
}