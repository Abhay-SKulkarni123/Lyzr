"use client";

import { ArrowLeft, ChevronRight, LoaderCircle, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export type SocialProvider = "google" | "github";

export const DEMO_OAUTH_ACCOUNT = {
  name: "Abhay Sharma",
  email: "abhay@architect.app",
  handle: "abhay-demo",
};

export function GoogleMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24">
      <path fill="#ea4335" d="M12 5.04c1.6 0 3.04.55 4.17 1.63l3.11-3.11C17.48 1.21 14.95 0 12 0 7.31 0 3.26 2.71 1.32 6.64l3.65 2.83C5.98 6.63 8.75 5.04 12 5.04z" />
      <path fill="#4285f4" d="M23.79 12.27c0-.85-.08-1.67-.22-2.45H12v4.63h6.62c-.29 1.52-1.15 2.8-2.44 3.66v3.02h3.94c2.31-2.12 3.67-5.23 3.67-8.86z" />
      <path fill="#34a853" d="M4.97 14.53c-.27-.84-.42-1.74-.42-2.53s.16-1.69.42-2.53L1.32 6.64A11.93 11.93 0 0 0 0 12c0 1.93.47 3.76 1.32 5.36l3.65-2.83z" />
      <path fill="#fbbc05" d="M12 24c3.25 0 5.97-1.07 7.96-2.9l-3.94-3.02c-1.09.73-2.47 1.16-4.02 1.16-3.24 0-6.02-1.6-7.01-4.02L1.33 17.63C3.26 21.29 7.31 24 12 24z" />
    </svg>
  );
}

export function GithubMark({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.44 9.82 8.2 11.41.6.11.82-.26.82-.58 0-.28-.01-1.05-.02-2.05-3.34.73-4.04-1.6-4.04-1.6-.54-1.39-1.33-1.76-1.33-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49.99.11-.77.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.14 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.25 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22 0 1.6-.01 2.89-.01 3.28 0 .32.21.7.82.58C20.56 21.82 24 17.31 24 12 24 5.37 18.63 0 12 0z" />
    </svg>
  );
}

type OAuthProviderDialogProps = {
  provider: SocialProvider;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export function OAuthProviderDialog({ provider, onClose, onConfirm }: OAuthProviderDialogProps) {
  const [step, setStep] = useState<"select" | "confirm">("select");
  const [busy, setBusy] = useState(false);
  const [showOtherAccountNote, setShowOtherAccountNote] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const busyRef = useRef(false);

  const isGoogle = provider === "google";
  const account = DEMO_OAUTH_ACCOUNT;

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    if (dialogRef.current) dialogRef.current.focus();
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  async function confirm() {
    if (busyRef.current) return;
    busyRef.current = true;
    setBusy(true);
    await new Promise((resolve) => window.setTimeout(resolve, 750));
    await onConfirm();
    busyRef.current = false;
    setBusy(false);
    onClose();
  }

  const brandIcon = isGoogle ? <GoogleMark className="h-5 w-5" /> : <GithubMark className="h-5 w-5" />;
  const brandName = isGoogle ? "Google" : "GitHub";
  const continueLabel = isGoogle ? "Sign in" : "Authorize";
  const busyLabel = isGoogle ? "Signing in…" : "Authorizing…";
  const continueClass = isGoogle
    ? "rounded-lg bg-[#4285f4] text-white transition hover:bg-[#3367d6] disabled:cursor-not-allowed disabled:opacity-70"
    : "rounded-lg bg-slate-100 text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-70";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={busy ? undefined : onClose}
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${brandName} sign in`}
        tabIndex={-1}
        className="w-full max-w-sm rounded-2xl border border-white/[0.1] bg-[#11151f] p-5 shadow-2xl outline-none sm:p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {brandIcon}
            <div>
              <p className="text-sm font-semibold text-white">{brandName}</p>
              {step === "select" && (
                <p className="text-[11px] text-slate-500">to continue to Architect</p>
              )}
            </div>
          </div>
          <button
            type="button"
            aria-label="Close sign in"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-slate-300"
            onClick={onClose}
          >
            <X aria-hidden="true" className="h-4 w-4" />
          </button>
        </div>

        {step === "select" && (
          <div>
            <p className="mb-3 text-[12px] text-slate-400">
              {isGoogle ? "Choose an account to sign in to Architect" : "Choose an account to continue to Architect"}
            </p>
            <div className="space-y-2">
              <button
                type="button"
                className="flex w-full items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3 text-left transition hover:border-white/20 hover:bg-white/[0.05]"
                onClick={() => setStep("confirm")}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-coral to-amber-400 text-[12px] font-bold text-white">
                  {account.name.slice(0, 1)}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-medium text-slate-200">{account.name}</span>
                  <span className="block truncate text-[10px] text-slate-500">{account.email}</span>
                </span>
                <ChevronRight aria-hidden="true" className="h-4 w-4 shrink-0 text-slate-600" />
              </button>
              <button
                type="button"
                className="w-full text-center text-[11px] font-medium text-slate-400 underline decoration-dotted underline-offset-2 transition hover:text-slate-200"
                onClick={() => setShowOtherAccountNote((value) => !value)}
              >
                Use another account
              </button>
              {showOtherAccountNote && (
                <p className="rounded-md border border-white/[0.06] bg-white/[0.02] px-3 py-2 text-center text-[10px] text-slate-500">
                  Only the demo account is available in this prototype.
                </p>
              )}
            </div>
            <p className="mt-5 border-t border-white/[0.06] pt-3 text-center text-[9px] tracking-wide text-slate-600">
              Simulated {brandName} sign-in — no real account is connected, and no request leaves your browser.
            </p>
          </div>
        )}

        {step === "confirm" && (
          <div>
            <button
              type="button"
              aria-label="Back to account selection"
              className="mb-4 flex h-7 w-7 items-center justify-center rounded-md text-slate-500 transition hover:bg-white/[0.06] hover:text-slate-300"
              onClick={() => setStep("select")}
            >
              <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            </button>
            <div className="mb-4 flex items-center gap-3 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[12px] font-bold text-white ${
                  isGoogle ? "bg-gradient-to-br from-coral to-amber-400" : "bg-slate-700"
                }`}
              >
                {account.name.slice(0, 1)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-medium text-slate-200">{account.name}</p>
                <p className="truncate text-[10px] text-slate-500">{account.email}</p>
              </div>
            </div>
            <h2 className="text-sm font-semibold text-white">
              {isGoogle ? "Continue to Architect?" : "Authorize Architect"}
            </h2>
            <p className="mt-1 text-[11px] leading-5 text-slate-400">
              {isGoogle
                ? "Architect will use this demo profile for your workspace session."
                : "Architect will have access to your public demo profile for this workspace session."}
            </p>
            <div className="mt-5 flex items-center justify-end gap-2.5">
              <button
                type="button"
                disabled={busy}
                className="rounded-lg border border-white/[0.12] px-4 py-2 text-[12px] font-medium text-slate-300 transition hover:border-white/25 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                className={`flex h-9 items-center gap-2 px-4 text-[12px] font-semibold disabled:cursor-not-allowed disabled:opacity-70 ${continueClass}`}
                onClick={() => void confirm()}
              >
                {busy ? (
                  <>
                    <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
                    {busyLabel}
                  </>
                ) : (
                  continueLabel
                )}
              </button>
            </div>
            <p className="mt-4 border-t border-white/[0.06] pt-3 text-center text-[9px] tracking-wide text-slate-600">
              Simulated {brandName} sign-in — no real account is connected, and no request leaves your browser.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}