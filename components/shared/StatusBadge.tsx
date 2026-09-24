export type StatusTone = "success" | "warning" | "neutral" | "info";

const toneStyles: Record<StatusTone, { dot: string; text: string }> = {
  success: { dot: "bg-emerald-400", text: "text-emerald-300" },
  warning: { dot: "bg-amber-400", text: "text-amber-300" },
  neutral: { dot: "bg-slate-500", text: "text-slate-400" },
  info: { dot: "bg-sky-400", text: "text-sky-300" },
};

type StatusBadgeProps = {
  label: string;
  tone: StatusTone;
  pulse?: boolean;
};

export function StatusBadge({ label, tone, pulse = false }: StatusBadgeProps) {
  const styles = toneStyles[tone];
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[10px] font-medium">
      <span
        aria-hidden="true"
        className={`h-1.5 w-1.5 rounded-full ${styles.dot} ${pulse ? "animate-pulse" : ""}`}
      />
      <span className={styles.text}>{label}</span>
    </span>
  );
}