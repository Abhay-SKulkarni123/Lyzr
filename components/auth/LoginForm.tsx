"use client";

import { ArrowRight, Eye, EyeOff, GitBranch, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { nameFromEmail, signInMock, DEMO_USER } from "@/lib/auth";

function nextPath() {
  if (typeof window === "undefined") return "/dashboard";
  const next = new URLSearchParams(window.location.search).get("next");
  return next && next.startsWith("/") ? next : "/dashboard";
}

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "github">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clean = email.trim();
    if (!clean || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(clean)) {
      setError("Enter a valid email address.");
      return;
    }
    setError(null);
    setStatus("loading");
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    signInMock({ name: nameFromEmail(clean), email: clean });
    router.replace(nextPath());
  }

  function handleGitHub() {
    setError(null);
    setStatus("github");
    window.setTimeout(() => {
      signInMock({ name: DEMO_USER.name, email: "abhay@users.noreply.github.com" });
      router.replace(nextPath());
    }, 900);
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#10141d] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div>
            <label htmlFor="login-email" className="mb-1.5 block text-xs font-medium text-slate-400">
              Email
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className={`w-full rounded-lg border bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${
                error && !email.trim()
                  ? "border-rose-500/60 focus:ring-rose-500/30"
                  : "border-white/10 focus:border-coral/50 focus:ring-coral/20"
              }`}
            />
          </div>
          <div>
            <label htmlFor="login-password" className="mb-1.5 block text-xs font-medium text-slate-400">
              Password
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                className={`w-full rounded-lg border bg-[#0b0f19] px-3 py-2.5 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${
                  error && !password
                    ? "border-rose-500/60 focus:ring-rose-500/30"
                    : "border-white/10 focus:border-coral/50 focus:ring-coral/20"
                }`}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded text-slate-500 transition hover:text-slate-300"
                onClick={() => setShowPassword((value) => !value)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-3 text-xs text-rose-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status !== "idle"}
          className="mt-5 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-coral text-sm font-semibold text-white transition hover:bg-[#ff795c] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "loading" ? (
            <>
              <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
              Signing in…
            </>
          ) : (
            <>
              Sign in
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3" aria-hidden="true">
        <span className="h-px flex-1 bg-white/[0.08]" />
        <span className="text-[10px] uppercase tracking-[0.12em] text-slate-600">or</span>
        <span className="h-px flex-1 bg-white/[0.08]" />
      </div>

      <button
        type="button"
        disabled={status !== "idle"}
        onClick={handleGitHub}
        className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-white/[0.1] bg-[#0b0f19] text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/[0.03] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {status === "github" ? (
          <>
            <LoaderCircle aria-hidden="true" className="h-4 w-4 animate-spin" />
            Connecting…
          </>
        ) : (
          <>
            <GitBranch aria-hidden="true" className="h-4 w-4" />
            Continue with GitHub
          </>
        )}
      </button>

      <p className="mt-5 text-center text-xs text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-coral transition hover:text-[#ff795c]">
          Sign up
        </Link>
      </p>
    </div>
  );
}