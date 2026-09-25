"use client";

import { ArrowRight, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { signInMock, DEMO_USER } from "@/lib/auth";
import { SocialProviders, type SocialProvider } from "./SocialProviders";

export function SignupForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    if (!cleanName || !cleanEmail || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setError(null);
    setStatus("loading");
    await new Promise((resolve) => window.setTimeout(resolve, 900));
    signInMock({ name: cleanName, email: cleanEmail });
    router.replace("/dashboard");
  }

  function handleSocial(_provider: SocialProvider) {
    signInMock({ name: DEMO_USER.name, email: DEMO_USER.email });
    router.replace("/dashboard");
  }

  const fieldClass = (invalid = false) =>
    `w-full rounded-lg border bg-[#0b0f19] px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-slate-600 focus:ring-2 ${
      invalid
        ? "border-rose-500/60 focus:ring-rose-500/30"
        : "border-white/10 focus:border-coral/50 focus:ring-coral/20"
    }`;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#10141d] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.25)]">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          <div>
            <label htmlFor="signup-name" className="mb-1.5 block text-xs font-medium text-slate-400">
              Full name
            </label>
            <input
              id="signup-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Abhay Sharma"
              className={fieldClass(!!(error && !name.trim()))}
            />
          </div>
          <div>
            <label htmlFor="signup-email" className="mb-1.5 block text-xs font-medium text-slate-400">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@company.com"
              className={fieldClass(!!(error && !email.trim()))}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="signup-password" className="mb-1.5 block text-xs font-medium text-slate-400">
                Password
              </label>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                className={fieldClass(!!(error && !password))}
              />
            </div>
            <div>
              <label htmlFor="signup-confirm" className="mb-1.5 block text-xs font-medium text-slate-400">
                Confirm password
              </label>
              <input
                id="signup-confirm"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Repeat password"
                className={fieldClass(!!(error && !confirmPassword))}
              />
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
              Creating account...
            </>
          ) : (
            <>
              Create account
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

      <SocialProviders disabled={status !== "idle"} onProvider={handleSocial} />

      <p className="mt-5 text-center text-xs text-slate-500">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-coral transition hover:text-[#ff795c]">
          Sign in
        </Link>
      </p>
    </div>
  );
}