import type { Project, ProjectTone, ProjectType } from "@/data/projects";

export const toneClasses: Record<ProjectTone, { from: string; to: string; bar: string }> = {
  coral: { from: "from-[#ff6b4a]/25", to: "to-[#ff6b4a]/5", bar: "bg-[#ff6b4a]/40" },
  mint: { from: "from-[#2dd4bf]/25", to: "to-[#2dd4bf]/5", bar: "bg-[#2dd4bf]/40" },
  amber: { from: "from-[#f59e0b]/25", to: "to-[#f59e0b]/5", bar: "bg-[#f59e0b]/40" },
  indigo: { from: "from-[#6366f1]/25", to: "to-[#6366f1]/5", bar: "bg-[#6366f1]/40" },
  sky: { from: "from-[#38bdf8]/25", to: "to-[#38bdf8]/5", bar: "bg-[#38bdf8]/40" },
  rose: { from: "from-[#fb7185]/25", to: "to-[#fb7185]/5", bar: "bg-[#fb7185]/40" },
};

const bar = "h-1.5 rounded-full";

function DashboardVisual() {
  return (
    <div className="grid h-full grid-cols-[26px_1fr] gap-2">
      <div className="flex flex-col gap-1.5 pt-1">
        <div className={`${bar} w-3/4`} />
        <div className={`${bar} w-2/3`} />
        <div className={`${bar} w-1/2`} />
        <div className={`${bar} w-2/3`} />
        <div className={`${bar} w-1/2`} />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className={`${bar} w-1/3`} />
        <div className="mt-1 grid grid-cols-2 gap-1.5">
          <div className={`${bar} h-8`} />
          <div className={`${bar} h-8`} />
        </div>
        <div className={`${bar} h-10 w-3/4`} />
      </div>
    </div>
  );
}

function LandingVisual() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-1.5">
      <div className={`${bar} w-2/3`} />
      <div className={`${bar} h-2 w-1/2`} />
      <div className={`${bar} h-2 w-2/3`} />
      <div className={`${bar} mt-1 h-2 w-1/3`} />
    </div>
  );
}

function PortalVisual() {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className={`${bar} w-1/4 self-start`} />
      <div className="rounded-md border border-white/10 p-1.5">
        <div className={`${bar} w-1/2`} />
        <div className={`${bar} mt-1 w-2/3`} />
      </div>
      <div className="rounded-md border border-white/10 p-1.5">
        <div className={`${bar} w-1/3`} />
        <div className={`${bar} mt-1 w-1/2`} />
      </div>
    </div>
  );
}

function WebAppVisual() {
  return (
    <div className="flex h-full flex-col gap-1.5">
      <div className={`${bar} w-1/4 self-start`} />
      <div className="grid flex-1 grid-cols-3 gap-1.5">
        <div className={`${bar} h-full`} />
        <div className={`${bar} h-full`} />
        <div className={`${bar} h-full`} />
      </div>
    </div>
  );
}

const visuals: Record<ProjectType, () => React.ReactNode> = {
  dashboard: DashboardVisual,
  landing: LandingVisual,
  portal: PortalVisual,
  "web-app": WebAppVisual,
};

export function ProjectThumb({ project }: { project: Project }) {
  const tone = toneClasses[project.tone];
  const Visual = visuals[project.type];
  return (
    <div
      aria-hidden="true"
      className={`relative h-28 overflow-hidden bg-gradient-to-br ${tone.from} ${tone.to} p-3`}
    >
      <Visual />
      <div className={`absolute inset-x-0 top-0 h-px w-full ${tone.bar}`} />
    </div>
  );
}