"use client";

import { ArrowRight, CloudDownload, FolderKanban, Import, Sparkles, WandSparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BuildPrompt } from "@/components/dashboard/BuildPrompt";
import { ImportProjectModal } from "@/components/dashboard/ImportProjectModal";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import { useAuth } from "@/components/dashboard/auth-context";
import { projects } from "@/data/projects";
import { templates } from "@/data/templates";

function greeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const stats = [
  { label: "Projects", value: projects.length, icon: FolderKanban, href: "/projects" },
  { label: "Templates", value: templates.length, icon: Sparkles, href: "/templates" },
  { label: "Deployed", value: projects.filter((p) => p.deploymentStatus === "deployed").length, icon: CloudDownload, href: "/projects" },
];

export default function DashboardPage() {
  const { session } = useAuth();
  const firstName = session.user.name.split(" ")[0];
  const [importOpen, setImportOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8">
        <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600">Dashboard</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {greeting()}, {firstName}.
        </h1>
        <p className="mt-1.5 text-sm text-slate-500">
          Describe what you want to build, or pick up where you left off.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-white/[0.08] bg-[#10141d] p-4 transition hover:border-white/[0.16]"
          >
            <div className="flex items-center justify-between">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.05] text-coral">
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <ArrowRight aria-hidden="true" className="h-3.5 w-3.5 text-slate-700 transition group-hover:translate-x-0.5 group-hover:text-slate-400" />
            </div>
            <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
            <p className="text-xs text-slate-500">{label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-slate-400">Build something new</h2>
          <button
            type="button"
            onClick={() => setImportOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs font-medium text-slate-400 transition hover:border-white/25 hover:text-slate-200"
          >
            <Import aria-hidden="true" className="h-3.5 w-3.5" />
            Import a project
          </button>
        </div>
        <BuildPrompt />
      </div>

      <div className="mt-10 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-white">Recent projects</h2>
          <p className="mt-0.5 text-xs text-slate-500">Jump back into a workspace.</p>
        </div>
        <Link
          href="/projects"
          className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-coral transition hover:text-[#ff795c]"
        >
          View all
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </div>
      <div className="mt-4">
        <ProjectGrid projects={projects.slice(0, 3)} />
      </div>

      <div className="mt-8 rounded-xl border border-white/[0.08] bg-gradient-to-r from-white/[0.03] to-transparent p-5 sm:flex sm:items-center sm:justify-between sm:gap-6">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-coral">
            <WandSparkles aria-hidden="true" className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-white">Start from a template</p>
            <p className="mt-0.5 text-xs text-slate-500">
              Ready-made starting points for dashboards, landing pages, admin panels, and portals.
            </p>
          </div>
        </div>
        <Link
          href="/templates"
          className="mt-4 inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-2 text-xs font-medium text-slate-200 transition hover:border-white/25 hover:bg-white/[0.04] sm:mt-0"
        >
          Browse templates
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </div>

      <ImportProjectModal open={importOpen} onClose={() => setImportOpen(false)} />
    </div>
  );
}