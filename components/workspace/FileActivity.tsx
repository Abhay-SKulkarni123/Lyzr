import { Check, Circle, FileCode2, LoaderCircle, TriangleAlert } from "lucide-react";
import type { BuildActivity } from "@/data/builds";
import type { BuildStatus as Status } from "./types";

function fileState(
  firstTouch: number,
  activeStep: number,
  status: Status
): "done" | "active" | "pending" | "error" {
  if (status === "complete") return "done";
  if (status === "error") {
    if (firstTouch === activeStep) return "error";
    return firstTouch < activeStep ? "done" : "pending";
  }
  if (firstTouch < activeStep) return "done";
  if (firstTouch === activeStep) return "active";
  return "pending";
}

type FileActivityProps = {
  status: Status;
  activeStep: number;
  flat: BuildActivity[];
  files: string[];
};

export function FileActivity({ status, activeStep, flat, files }: FileActivityProps) {
  const firstTouch: Record<string, number> = {};
  flat.forEach((activity, index) => {
    if (activity.filePath && firstTouch[activity.filePath] === undefined) {
      firstTouch[activity.filePath] = index;
    }
  });

  const updated = files.filter((file) => {
    const state = fileState(firstTouch[file] ?? -1, activeStep, status);
    return state === "done" || state === "error";
  }).length;

  return (
    <div className="rounded-lg border border-white/[0.06] bg-[#0c1018] p-1.5" aria-label="File activity">
      {files.map((file) => {
        const state = fileState(firstTouch[file] ?? -1, activeStep, status);
        const separator = file.lastIndexOf("/");
        const dir = separator > -1 ? file.slice(0, separator + 1) : "";
        const name = separator > -1 ? file.slice(separator + 1) : file;
        return (
          <div key={file} className="flex items-center gap-2 rounded-md px-2 py-[7px]">
            <span className="w-3.5 shrink-0">
              {state === "done" ? (
                <Check aria-hidden="true" className="h-3 w-3 text-emerald-300" />
              ) : state === "active" ? (
                <LoaderCircle aria-hidden="true" className="h-3 w-3 animate-spin text-coral" />
              ) : state === "error" ? (
                <TriangleAlert aria-hidden="true" className="h-3 w-3 text-rose-400" />
              ) : (
                <Circle aria-hidden="true" className="h-2 w-2 text-slate-700" />
              )}
            </span>
            <FileCode2 aria-hidden="true" className="h-3 w-3 shrink-0 text-slate-600" />
            <span className="min-w-0 flex-1 truncate font-mono text-[9px] leading-4">
              <span className="text-slate-600">{dir}</span>
              <span className={state === "pending" ? "text-slate-700" : "text-slate-400"}>{name}</span>
            </span>
          </div>
        );
      })}
      <div className="mt-1 flex items-center justify-between border-t border-white/[0.05] px-2 pb-1 pt-1.5">
        <span className="text-[8px] text-slate-600">Changes are simulated</span>
        <span className={`text-[8px] font-medium ${updated > 0 ? "text-emerald-300" : "text-slate-600"}`}>
          {updated} updated
        </span>
      </div>
    </div>
  );
}