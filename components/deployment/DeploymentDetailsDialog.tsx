"use client";

import { ChevronUp, Globe, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import type { DeploymentRecord } from "@/data/deployment";
import { DeploymentDetails } from "./DeploymentDetails";
import { DeploymentLogs } from "./DeploymentLogs";
import { DeploymentProgress } from "./DeploymentProgress";

type DeploymentDetailsDialogProps = {
  record: DeploymentRecord;
  busy?: boolean;
  onClose: () => void;
  onRetry: () => void;
};

export function DeploymentDetailsDialog({ record, busy = false, onClose, onRetry }: DeploymentDetailsDialogProps) {
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [tab, setTab] = useState<"details" | "logs">("details");

  useEffect(() => {
    closeRef.current?.focus();
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  function onOverlayClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose();
  }

  const inProgress = ["preparing", "building", "deploying"].includes(record.status);

  return (
    <div
      aria-label="Deployment details dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 sm:items-center sm:p-4"
      onMouseDown={onOverlayClick}
      role="dialog"
    >
      <div className="workspace-scrollbar max-h-[94dvh] w-full overflow-y-auto rounded-t-2xl border border-white/[0.1] bg-[#10141d] shadow-2xl sm:max-w-md sm:rounded-xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.07] bg-[#10141d]/95 px-4 py-3 backdrop-blur">
          <h2 className="text-sm font-semibold text-white" id="deployment-details-title">
            Deployment
          </h2>
          <button
            aria-label="Close details"
            className="flex h-8 w-8 items-center justify-center rounded-md text-slate-400 transition hover:bg-white/[0.06] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
            onClick={onClose}
            ref={closeRef}
            type="button"
          >
            <ChevronUp aria-hidden="true" className="h-4 w-4 rotate-180" />
          </button>
        </div>

        <div className="flex items-center gap-2 border-b border-white/[0.06] px-4 pt-3">
          <TabButton active={tab === "details"} onSelect={() => setTab("details")} label="Details" />
          <TabButton active={tab === "logs"} onSelect={() => setTab("logs")} label="Logs" />
        </div>

        <div className="p-4 sm:p-5">
          {tab === "details" && (
            <div className="space-y-3">
              <DeploymentDetails record={record} />
              {inProgress && (
                <DeploymentProgress
                  branch={record.branch}
                  commitSha={record.commitSha}
                  environment={record.environment}
                  status={record.status}
                />
              )}
              <button
                aria-label={`Redeploy ${record.branch}`}
                className="flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-white/[0.12] text-[10px] font-semibold text-slate-200 transition hover:border-white/25 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 disabled:opacity-50"
                disabled={busy}
                onClick={onRetry}
                type="button"
              >
                <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                Redeploy
              </button>
            </div>
          )}
          {tab === "logs" && (
            <div className="space-y-2">
              <DeploymentLogs logs={record.logs} compact={false} />
              <p className="flex items-center gap-1.5 text-[8px] text-slate-600">
                <Globe aria-hidden="true" className="h-3 w-3" />
                {record.url}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, label, onSelect }: { active: boolean; label: string; onSelect: () => void }) {
  return (
    <button
      aria-selected={active}
      className={`border-b-2 pb-2 text-[10px] font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
        active ? "border-coral text-white" : "border-transparent text-slate-500 hover:text-slate-300"
      }`}
      onClick={onSelect}
      role="tab"
      type="button"
    >
      {label}
    </button>
  );
}