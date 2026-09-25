"use client";

import { useState } from "react";
import { GithubMark, GoogleMark, OAuthProviderDialog, type SocialProvider } from "./OAuthProviderDialog";

export type { SocialProvider } from "./OAuthProviderDialog";

const baseClass =
  "flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-white/[0.1] bg-[#0b0f19] text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-70";

type SocialProvidersProps = {
  onProvider: (provider: SocialProvider) => void | Promise<void>;
  disabled?: boolean;
};

export function SocialProviders({ onProvider, disabled = false }: SocialProvidersProps) {
  const [provider, setProvider] = useState<SocialProvider | null>(null);

  function open(selected: SocialProvider) {
    if (disabled) return;
    setProvider(selected);
  }

  return (
    <div className="space-y-2.5">
      <button
        type="button"
        disabled={disabled}
        onClick={() => open("google")}
        className={baseClass}
      >
        <GoogleMark />
        Continue with Google
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => open("github")}
        className={baseClass}
      >
        <GithubMark />
        Continue with GitHub
      </button>
      {provider && (
        <OAuthProviderDialog
          provider={provider}
          onClose={() => setProvider(null)}
          onConfirm={() => onProvider(provider)}
        />
      )}
    </div>
  );
}