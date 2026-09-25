import { LoaderCircle } from "lucide-react";
import type { DeploymentStatus as Status } from "@/data/deployment";

const tone: Record<Status, { dot: string; text: string; busy?: boolean }> = {
  idle: { dot: "bg-slate-500", text: "text-slate-300" },
  preparing: { dot: "bg-sky-400", text: "text-sky-300", busy: true },
  building: { dot: "bg-sky-400", text: "text-sky-300", busy: true },
  deploying: { dot: "bg-sky-400", text: "text-sky-300", busy: true },
  ready: { dot: "bg-emerald-400", text: "text-emerald-300" },
  failed: { dot: "bg-rose-400", text: "text-rose-300" },
  cancelled: { dot: "bg-slate-500", text: "text-slate-300" },
};

const statusLabel: Record<Status, string> = {
  idle: "Idle",
  preparing: "Preparing...",
  building: "Building...",
  deploying: "Deploying...",
  ready: "Ready",
  failed: "Failed",
  cancelled: "Cancelled",
};

type DeploymentStatusProps = {
  status: Status;
  label?: string;
};

export function DeploymentStatus({ status, label }: DeploymentStatusProps) {
  const styles = tone[status];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[9px] font-medium">
      {styles.busy ? (
        <LoaderCircle aria-hidden="true" className={`h-3 w-3 animate-spin ${styles.text}`} />
      ) : (
        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      )}
      <span className={styles.text}>{label ?? statusLabel[status]}</span>
    </span>
  );
}