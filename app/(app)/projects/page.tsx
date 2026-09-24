"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { NewProjectModal } from "@/components/dashboard/NewProjectModal";
import { ProjectGrid } from "@/components/dashboard/ProjectGrid";
import { projects } from "@/data/projects";

export default function ProjectsPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-600">Library</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Projects</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            {projects.length} projects — drawn from mock data for the prototype.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-coral px-4 text-xs font-semibold text-white transition hover:bg-[#ff795c]"
        >
          <Plus aria-hidden="true" className="h-3.5 w-3.5" />
          New Project
        </button>
      </div>

      <ProjectGrid projects={projects} />

      <NewProjectModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}