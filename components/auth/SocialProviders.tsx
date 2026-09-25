"use client";

import { LoaderCircle } from "lucide-react";
import { useState } from "react";

export type SocialProvider = "google" | "github";

function GoogleMark() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path fill="#ea4335" d="M12 5.04c1.6 0 3.04.55 4.17 1.63l3.11-3.11C17.48 1.21 14.95 0 12 0 7.31 0 3.26 2.71 1.32 6.64l3.65 2.83C5.98 6.63 8.75 5.04 12 5.04z" />
      <path fill="#4285f4" d="M23.79 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.62c-.29 1.52-1.15 2.8-2.44 3.66v3.02h3.94c2.31-2.12 3.67-5.23 3.67-8.86z" />
      <path fill="#34a853" d="M4.97 14.53c-.27-.84-.42-1.74-.42-2.53s.16-1.69.42-2.53L1.32 6.64A11.93 11.93 0 0 0 0 12c0 1.93.47 3.76 1.32 5.36l3.65-2.83z" />
      <path fill="#fbbc05" d="M12 24c3.25 0 5.97-1.07 7.96-2.9l-3.94-3.02c-1.09.73-2.47 1.16-4.02 1.16-3.24 0-6.02-1.6-7.01-4.02L1.33 17.63C3.26 21.29 7.31 24 12 24z" />
    </svg>
  );
}

function GithubMark() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.2 11.41.6.11.82-.26.82-.58 0-.28-.01-1.05-.02-2.05-3.34.73-4.04-1.6-4.04-1.6-.54-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.14 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.21.7.82.58C20.56 21.82 24 17.31 24 12 24 5.37 18.63 0 12 0z" />
    </svg>
  );
}

const baseClass =
  "flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-white/[0.1] bg-[#0b0f19] text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-70";

type SocialProvidersProps = {
  onProvider: (provider: SocialProvider) => void | Promise<void>;
  disabled?: boolean;
};

export function SocialProviders({ onProvider, disabled = false }: SocialProvidersProps) {
  const [active, setActive] = useState<SocialProvider | null>(null);

  async function choose(provider: SocialProvider) {
    if (active || disabled) return;
    setActive(provider);
    try {
      await onProvider(provider);
    } finally {
      setActive(null);
    }
  }

  return (
    <div className="space-y-2.5">
      <button
        type="button"
        disabled={disabled || active !== null}
        onClick={() => void choose("google")}
        className={baseClass}
      >
        {active === "google" ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <GoogleMark />
        )}
        Continue with Google
      </button>
      <button
        type="button"
        disabled={disabled || active !== null}
        onClick={() => void choose("github")}
        className={baseClass}
      >
        {active === "github" ? (
          <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
        ) : (
          <GithubMark />
        )}
        Continue with GitHub
      </button>
    </div>
  );
}