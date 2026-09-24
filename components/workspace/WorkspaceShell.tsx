"use client";

import { useEffect, useRef, useState } from "react";
import { ActivityPanel, ActivitySummary } from "./ActivityPanel";
import { CodeSurface, TerminalSurface } from "./CodeSurface";
import { DashboardPreview } from "./DashboardPreview";
import { FileExplorer } from "./FileExplorer";
import { FilesOverview } from "./FilesOverview";
import { PromptComposer } from "./PromptComposer";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceToolbar } from "./WorkspaceToolbar";
import type { BuildStatus, ProjectFile, WorkspaceView } from "./types";

const initialPrompt = "Build a clean SaaS analytics dashboard for a modern startup.";

export function WorkspaceShell() {
  const [view, setView] = useState<WorkspaceView>("preview");
  const [buildStatus, setBuildStatus] = useState<BuildStatus>("complete");
  const [activeStep, setActiveStep] = useState(3);
  const [latestPrompt, setLatestPrompt] = useState(initialPrompt);
  const [selectedFile, setSelectedFile] = useState("app/page.tsx");
  const [notice, setNotice] = useState("");
  const noticeTimer = useRef<number | null>(null);

  useEffect(() => {
    if (buildStatus !== "building") return;

    const timer = window.setTimeout(() => {
      if (activeStep < 3) {
        setActiveStep((step) => step + 1);
      } else {
        setBuildStatus("complete");
        setNotice("Prototype build complete. The sample preview is unchanged.");
        noticeTimer.current = window.setTimeout(() => setNotice(""), 3200);
      }
    }, 850);

    return () => window.clearTimeout(timer);
  }, [activeStep, buildStatus]);

  useEffect(() => () => {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
  }, []);

  function showNotice(message: string) {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3200);
  }

  function submitPrompt(prompt: string) {
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    setLatestPrompt(prompt);
    setActiveStep(0);
    setBuildStatus("building");
    setView("preview");
    setNotice("");
  }

  function openFile(file: ProjectFile) {
    if (file.kind !== "file") return;
    setSelectedFile(file.path);
    setView("code");
  }

  function openFileByPath(path: string) {
    setSelectedFile(path);
    setView("code");
  }

  return (
    <main className="flex h-dvh min-h-0 min-w-[320px] flex-col overflow-hidden bg-[#0b0f19] text-slate-200">
      <WorkspaceHeader isBuilding={buildStatus === "building"} onNotice={showNotice} />
      <WorkspaceToolbar activeView={view} onChange={setView} />

      <div className="relative flex min-h-0 flex-1">
        <FileExplorer selectedFile={selectedFile} onSelect={openFile} />
        <section className="flex min-w-0 flex-1 flex-col bg-[#0b0f19]" aria-label={`${view} workspace`}>
          {view === "preview" && (
            <div className="flex min-h-0 flex-1 items-stretch justify-center overflow-hidden p-2 sm:p-3 lg:p-4">
              <DashboardPreview />
            </div>
          )}
          {view === "code" && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-2 sm:p-3 lg:p-4">
              <CodeSurface selectedFile={selectedFile} />
            </div>
          )}
          {view === "terminal" && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-2 sm:p-3 lg:p-4">
              <TerminalSurface />
            </div>
          )}
          {view === "files" && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-3 sm:p-5 lg:p-7">
              <FilesOverview onOpenFile={openFileByPath} />
            </div>
          )}
        </section>
        <ActivityPanel status={buildStatus} activeStep={activeStep} prompt={latestPrompt} />
        {notice && (
          <div className="absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-lg border border-white/10 bg-[#202734] px-3 py-2 text-center text-[10px] text-slate-200 shadow-xl" role="status">
            {notice}
          </div>
        )}
      </div>

      <ActivitySummary status={buildStatus} />
      <PromptComposer isBuilding={buildStatus === "building"} onSubmit={submitPrompt} />
    </main>
  );
}
