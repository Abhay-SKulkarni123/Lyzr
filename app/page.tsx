"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Code2, GitFork, Hexagon, Plus, Settings, Terminal, Users } from "lucide-react";
import { getMockSession, signInMock, DEMO_USER } from "@/lib/auth";
import { SocialProviders, type SocialProvider } from "@/components/auth/SocialProviders";

const features = [
  {
    name: "Natural Language Prompting",
    description:
      "Non-technical users can describe application requirements and let the system build UI, components, and functionality",
    icon: Plus,
    path: "/workspace",
  },
  {
    name: "Developer Controls",
    description:
      "Technical users can progressively access code, agents, files, GitHub, environment variables, terminal, and deployment",
    icon: Terminal,
    path: "/workspace",
  },
  {
    name: "Real-time Preview",
    description:
      "Instant visual preview of builds with the ability to switch between code, preview, and deployment modes",
    icon: Code2,
    path: "/workspace",
  },
  {
    name: "Agent Orchestration",
    description:
      "Manage multiple AI agents for different aspects of application building and testing",
    icon: Users,
    path: "/agents",
  },
  {
    name: "GitHub Integration",
    description:
      "Connect to GitHub for version control, repository management, and CI/CD pipelines",
    icon: GitFork,
    path: "/github",
  },
  {
    name: "Deployment & CI/CD",
    description:
      "Deploy applications to production and preview environments with simulated build, status, and live app views",
    icon: Settings,
    path: "/deployments",
  },
];

const examplePrompts = [
  {
    name: "SaaS Analytics",
    description: "Subscription analytics for a SaaS product",
    prompt: "SaaS analytics subscription dashboard",
  },
  {
    name: "Customer Support",
    description: "Tickets, response times, and satisfaction",
    prompt: "Customer support dashboard for SaaS",
  },
  {
    name: "Project Management",
    description: "Tasks, sprints, and workload for a small team",
    prompt: "Project management app for small engineering teams",
  },
  {
    name: "Personal Finance",
    description: "Budgets, expenses, and net worth at a glance",
    prompt: "Personal finance tracker",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    setMounted(true);
    setSignedIn(getMockSession().signedIn);
  }, []);

  async function handleSocial(_provider: SocialProvider) {
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    signInMock({ name: DEMO_USER.name, email: DEMO_USER.email });
    router.push("/workspace");
  }

  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <nav className="mb-14 flex items-center justify-between gap-4">
        <span className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-coral text-white shadow-[0_5px_18px_rgba(255,107,74,0.2)]">
            <Hexagon aria-hidden="true" className="h-4 w-4" strokeWidth={2.4} />
          </span>
          architect
        </span>
        <span className="flex items-center gap-3">
          {mounted && signedIn ? (
            <>
              <Link className="text-xs text-slate-400 transition hover:text-white" href="/workspace">
                Workspace
              </Link>
              <Link
                className="rounded-lg bg-coral px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#ff795c]"
                href="/dashboard"
              >
                Open dashboard
              </Link>
            </>
          ) : (
            <>
              <Link className="text-xs text-slate-400 transition hover:text-white" href="/login">
                Sign in
              </Link>
              <Link
                className="rounded-lg border border-white/15 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-white/30 hover:text-white"
                href="/signup"
              >
                Create account
              </Link>
            </>
          )}
        </span>
      </nav>

      <section className="mb-16 text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-coral/30 bg-coral/10 px-3 py-1 text-[11px] font-medium tracking-wide text-coral">
          AI-native app builder · interactive prototype
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-5xl font-bold tracking-tight text-white md:text-6xl">
          Build anything. Just describe it.
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-slate-400">
          Architect turns plain language into a working app — plan, code, preview, and deploy from one
          workspace.
        </p>
        {mounted && signedIn ? (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/workspace"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-coral px-7 text-sm font-semibold text-white transition hover:bg-[#ff795c]"
            >
              Continue building <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/15 px-7 text-sm font-semibold text-slate-200 transition hover:border-white/30 hover:text-white"
            >
              Open dashboard
            </Link>
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-sm space-y-4">
            <SocialProviders onProvider={handleSocial} />
            <p className="text-xs text-slate-500">
              or{" "}
              <Link className="font-medium text-slate-300 underline underline-offset-2 transition hover:text-white" href="/login">
                log in with email
              </Link>
            </p>
          </div>
        )}
        <p className="mt-5 text-[11px] text-slate-600">
          Prototype — Google/GitHub sign-in is simulated and never leaves your browser.
        </p>
      </section>

      <section className="mb-16">
        <p className="mb-4 text-center text-xs uppercase tracking-[0.16em] text-slate-500">
          Try it — pick a prompt
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {examplePrompts.map((item) => (
            <Link
              key={item.name}
              href={`/workspace?prompt=${encodeURIComponent(item.prompt)}&new=1`}
              className="group flex flex-col rounded-xl border border-white/[0.08] bg-[#0c1019] p-5 transition hover:border-coral/40 hover:bg-[#111621]"
            >
              <span className="text-sm font-semibold text-white">{item.name}</span>
              <span className="mt-1 text-xs text-slate-500">{item.description}</span>
              <span className="mt-4 line-clamp-2 text-[13px] leading-snug text-slate-400">
                &ldquo;{item.prompt}&rdquo;
              </span>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-coral">
                Open in workspace
                <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link
              key={feature.name}
              href={feature.path}
              className="block rounded-xl border border-sand bg-white p-8 shadow-soft transition-all duration-200 hover:shadow-md hover:-translate-y-1"
            >
              <div className="mb-5 inline-flex rounded-lg bg-sand p-3 text-coral">
                <Icon className="h-7 w-7" />
              </div>
              <h2 className="mb-3 text-xl font-semibold text-ink">{feature.name}</h2>
              <p className="text-slate-600">{feature.description}</p>
            </Link>
          );
        })}
      </div>

      <section className="mt-16 rounded-xl border border-white/[0.08] bg-[#0c1019] p-12 text-center">
        <h2 className="text-3xl font-bold text-white">Ready to build?</h2>
        <p className="mt-3 mb-8 text-lg text-slate-400">
          Skip the setup — pick a prompt above or start from a fresh idea.
        </p>
        {mounted && signedIn ? (
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
            <Link
              href="/workspace?new=1"
              className="rounded-lg bg-coral px-8 py-4 font-medium text-white transition-all duration-200 hover:bg-[#ff795c] hover:shadow-lg"
            >
              Start Building (Prompt)
            </Link>
            <Link
              href="/deployments"
              className="rounded-lg border border-white/20 px-8 py-4 font-medium text-white transition-all duration-200 hover:bg-white/10"
            >
              Explore Developer Mode
            </Link>
          </div>
        ) : (
          <div className="mx-auto flex max-w-sm flex-col items-center gap-2.5">
            <SocialProviders onProvider={handleSocial} />
            <Link
              href="/login?next=/workspace"
              className="text-xs text-slate-500 underline underline-offset-2 transition hover:text-white"
            >
              log in with email
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}