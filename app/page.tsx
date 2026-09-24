"use client";

import Link from "next/link";
import { Plus, Terminal, Users, GitFork, Settings, Code2 } from "lucide-react";

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
      "Deploy applications to various environments with built-in CI/CD pipelines",
    icon: Settings,
    path: "/deployment",
  },
];

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-7xl px-6 py-12">
      <div className="mb-16 text-center">
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-ink md:text-6xl">
          Architect 2.0
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-slate-600 md:text-xl">
          One platform for everyone. Simple by default. Powerful when needed.
        </p>
      </div>

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
              <h2 className="mb-3 text-xl font-semibold text-ink">
                {feature.name}
              </h2>
              <p className="text-slate-600">{feature.description}</p>
            </Link>
          );
        })}
      </div>

      <div className="mt-16 rounded-xl bg-gradient-to-r from-ink to-slate-900 p-12 text-center text-white">
        <h2 className="mb-6 text-3xl font-bold">Ready to build?</h2>
        <p className="mb-8 text-lg text-slate-300">
          Choose your path: start with a natural language prompt or explore developer controls
        </p>
        <div className="flex flex-col items-center justify-center gap-4 md:flex-row">
          <Link
            href="/login?next=/workspace"
            className="rounded-lg bg-coral px-8 py-4 font-medium text-white transition-all duration-200 hover:bg-coral/90 hover:shadow-lg"
          >
            Start Building (Prompt)
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-white/20 bg-white/10 px-8 py-4 font-medium text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
          >
            Explore Developer Mode
          </Link>
        </div>
      </div>
    </div>
  );
}