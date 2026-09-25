"use client";

import { CheckCircle2, ChevronDown, CircleX } from "lucide-react";
import { useState } from "react";
import { deploymentSimulatedNote, type DeploymentLog } from "@/data/deployment";

type DeploymentLogsProps = {
  logs: DeploymentLog[];
  compact?: boolean;
};

export function DeploymentLogs({ logs, compact = false }: DeploymentLogsProps) {
  const [open, setOpen] = useState(!compact);
  return (
    <div className="rounded-md border border-white/[0.07] bg-[#0b0f19]">
      <button
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-3 py-2.5 text-left transition hover:bg-white/[0.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        <span className="flex items-center gap-2 text-[10px] font-medium text-slate-300">
          Deployment logs
          <span className="hidden rounded-full border border-white/[0.07] px-1.5 py-0.5 text-[8px] font-normal text-slate-500 sm:inline">
            Simulated deployment
          </span>
        </span>
        <span aria-hidden="true" className={`flex items-center text-slate-500 transition ${open ? "rotate-180" : ""}`}>
          <ChevronDown className="h-3.5 w-3.5" />
        </span>
      </button>
      {open && (
        <ul className="workspace-scrollbar max-h-44 space-y-1 overflow-y-auto border-t border-white/[0.06] px-3 py-2.5">
          {logs.length === 0 && (
            <li className="text-[9px] text-slate-600">No log output for this deployment yet.</li>
          )}
          {logs.map((log, index) => (
            <li key={index} className="flex items-start gap-2 text-[9px]">
              {log.level === "error" ? (
                <CircleX aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 text-rose-300" />
              ) : log.level === "success" ? (
                <CheckCircle2 aria-hidden="true" className="mt-0.5 h-3 w-3 shrink-0 text-emerald-300" />
              ) : (
                <span aria-hidden="true" className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400/70" />
              )}
              <span className={log.level === "error" ? "text-rose-200" : log.level === "success" ? "text-slate-300" : "text-slate-400"}>
                {log.message}
              </span>
              <span className="ml-auto shrink-0 pl-2 font-mono text-[8px] text-slate-600">{log.timestamp}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="border-t border-white/[0.04] px-3 py-2 text-[8px] leading-4 text-slate-600">{deploymentSimulatedNote} No real infrastructure runs during this flow.</p>
    </div>
  );
}