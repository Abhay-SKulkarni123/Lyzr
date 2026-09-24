import { MoreHorizontal, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Menu, type MenuItem } from "@/components/shared/Menu";
import { StatusBadge } from "@/components/shared/StatusBadge";
import type { Project } from "@/data/projects";
import { ProjectThumb } from "./ProjectThumb";

type ProjectCardProps = {
  project: Project;
  onAction?: (message: string) => void;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const items: MenuItem[] = [
    { label: "Rename", onSelect: () => undefined },
    { label: "Duplicate", onSelect: () => undefined },
    { label: "Archive", onSelect: () => undefined, danger: true },
  ];

  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.08] bg-[#10141d] transition hover:border-white/[0.16] hover:shadow-[0_14px_34px_rgba(0,0,0,0.22)]">
      <div className="relative">
        <ProjectThumb project={project} />
        <div className="absolute right-2 top-2">
          <Menu
            label={`Actions for ${project.name}`}
            align="right"
            items={items}
            trigger={
              <span className="flex h-7 w-7 items-center justify-center rounded-md border border-white/10 bg-[#0b0f19]/70 text-slate-400 transition hover:text-white">
                <MoreHorizontal aria-hidden="true" className="h-4 w-4" />
              </span>
            }
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-start justify-between gap-2">
          <h3 className="truncate text-sm font-semibold text-white">{project.name}</h3>
          <span className="mt-0.5 shrink-0 text-[10px] text-slate-600">{project.framework}</span>
        </div>
        <p className="mb-3 line-clamp-2 text-xs leading-5 text-slate-500">{project.description}</p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5">
          <StatusBadge label={project.status} tone={project.status === "active" ? "success" : project.status === "building" ? "warning" : "neutral"} pulse={project.status === "building"} />
          <StatusBadge label={project.deploymentStatus.replace("-", " ")} tone={project.deploymentStatus === "deployed" ? "info" : "neutral"} />
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3">
          <span className="text-[10px] text-slate-600">Updated {project.updatedAt}</span>
          <Link
            href={`/workspace?project=${encodeURIComponent(project.id)}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-300 transition group-hover:text-coral"
          >
            Open
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}