import { Hexagon } from "lucide-react";
import Link from "next/link";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-dvh flex-col bg-[#0b0f19] text-slate-200">
      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6">
        <div className="w-full max-w-[420px]">
          <div className="mb-8 flex flex-col items-center text-center">
            <Link
              href="/"
              aria-label="Architect home"
              className="inline-flex items-center gap-2.5 text-sm font-semibold tracking-tight text-white"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-coral text-white shadow-[0_8px_24px_rgba(255,107,74,0.25)]">
                <Hexagon aria-hidden="true" className="h-5 w-5" strokeWidth={2.4} />
              </span>
              architect
            </Link>
            <h1 className="mt-6 text-2xl font-semibold tracking-tight text-white sm:text-[26px]">
              Build software with your intent.
            </h1>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              Describe what you want to build. Architect plans, builds, and helps you ship it.
            </p>
          </div>
          {children}
          <p className="mt-6 text-center text-[11px] text-slate-600">
            Prototype — authentication and accounts are mocked.
          </p>
        </div>
      </div>
    </main>
  );
}