import { LoaderCircle } from "lucide-react";

export type GithubStatusTone = "neutral" | "success" | "warning" | "active" | "error";

const toneStyles: Record<GithubStatusTone, { dot: string; text: string }> = {
  neutral: { dot: "bg-slate-500", text: "text-slate-300" },
  success: { dot: "bg-emerald-400", text: "text-emerald-300" },
  warning: { dot: "bg-amber-400", text: "text-amber-300" },
  active: { dot: "bg-sky-400", text: "text-sky-300" },
  error: { dot: "bg-rose-400", text: "text-rose-300" },
};

type GithubStatusProps = {
  tone: GithubStatusTone;
  label: string;
  busy?: boolean;
};

export function GithubStatus({ tone, label, busy = false }: GithubStatusProps) {
  const styles = toneStyles[tone];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[9px] font-medium">
      {busy ? (
        <LoaderCircle aria-hidden="true" className={`h-3 w-3 animate-spin ${styles.text}`} />
      ) : (
        <span aria-hidden="true" className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />
      )}
      <span className={styles.text}>{label}</span>
    </span>
  );
}