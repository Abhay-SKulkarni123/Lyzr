"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityPanel, ActivitySummary } from "./ActivityPanel";
import { CodeSurface, TerminalSurface } from "./CodeSurface";
import { DashboardPreview } from "./DashboardPreview";
import { FileExplorer } from "./FileExplorer";
import { FilesOverview } from "./FilesOverview";
import { PreviewStatus } from "./PreviewStatus";
import { PromptComposer } from "./PromptComposer";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceToolbar } from "./WorkspaceToolbar";
import type { BuildStatus, ProjectFile, WorkspaceView } from "./types";
import {
  getActivityPhase,
  getRecipeActivities,
  getRecipeFiles,
  initialRecipe,
  iterationRecipe,
  labelFromPrompt,
  seedVersions,
  type BuildVersion,
} from "@/data/builds";

const defaultPrompt = "Build a clean SaaS analytics dashboard for a modern startup.";

const tickDuration = 950;

type WorkspaceShellProps = {
  initialPrompt?: string;
  projectName?: string;
  autoRun?: boolean;
};

export function WorkspaceShell({
  initialPrompt = defaultPrompt,
  projectName = "Northstar Analytics",
  autoRun = false,
}: WorkspaceShellProps) {
  const [view, setView] = useState<WorkspaceView>("preview");
  const [buildStatus, setBuildStatus] = useState<BuildStatus>("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [buildIndex, setBuildIndex] = useState(0);
  const [latestPrompt, setLatestPrompt] = useState(initialPrompt);
  const [promptStack, setPromptStack] = useState<string[]>([]);
  const [versions, setVersions] = useState<BuildVersion[]>(seedVersions);
  const [selectedFile, setSelectedFile] = useState("app/page.tsx");
  const [notice, setNotice] = useState("");
  const [shouldFailNext, setShouldFailNext] = useState(false);
  const [failedPrompt, setFailedPrompt] = useState("");

  const latestPromptRef = useRef(latestPrompt);
  latestPromptRef.current = latestPrompt;
  const noticeTimer = useRef<number | null>(null);
  const autoRunHandled = useRef(false);

  const recipe = buildIndex === 0 ? initialRecipe : iterationRecipe;
  const flat = useMemo(() => getRecipeActivities(recipe), [recipe]);
  const files = useMemo(() => getRecipeFiles(recipe), [recipe]);

  const busy = buildStatus === "understanding" || buildStatus === "planning" || buildStatus === "building" || buildStatus === "checking";

  const modifiedFiles = useMemo(() => {
    const set = new Set<string>();
    if (buildStatus === "complete") {
      files.forEach((file) => set.add(file));
      return set;
    }
    const cutoff = buildStatus === "error" ? activeStep + 1 : activeStep;
    flat.forEach((activity, index) => {
      if (index < cutoff && activity.filePath) set.add(activity.filePath);
    });
    return set;
  }, [buildStatus, activeStep, flat, files]);

  // Start a build automatically when arriving with a seeded prompt.
  useEffect(() => {
    if (!autoRun || autoRunHandled.current) return;
    autoRunHandled.current = true;
    const prompt = initialPrompt.trim() || defaultPrompt;
    latestPromptRef.current = prompt;
    setLatestPrompt(prompt);
    setPromptStack([prompt]);
    setActiveStep(0);
    setBuildStatus("understanding");
    setView("preview");
    setNotice("");
  }, [autoRun, initialPrompt]);

  // Advance the simulated agentic build.
  useEffect(() => {
    if (buildStatus !== "understanding" && buildStatus !== "planning" && buildStatus !== "building" && buildStatus !== "checking") return;

    const timer = window.setTimeout(() => {
      const next = activeStep + 1;
      if (shouldFailNext && next >= flat.length - 1) {
        setActiveStep(flat.length - 1);
        setBuildStatus("error");
        setShouldFailNext(false);
        setFailedPrompt(latestPromptRef.current);
        setNotice("Something went wrong while building this change.");
        if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
        noticeTimer.current = window.setTimeout(() => setNotice(""), 3600);
        return;
      }
      if (next < flat.length) {
        setActiveStep(next);
        setBuildStatus(getActivityPhase(recipe, flat[next]));
      } else {
        setActiveStep(flat.length);
        setBuildStatus("complete");
        setBuildIndex((index) => index + 1);
        setVersions((prev) => [
          ...prev,
          { version: `v${prev.length + 1}`, label: labelFromPrompt(latestPromptRef.current) },
        ]);
        setSelectedFile("app/page.tsx");
        setNotice("Build complete — preview is ready.");
        if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
        noticeTimer.current = window.setTimeout(() => setNotice(""), 3600);
      }
    }, tickDuration);

    return () => window.clearTimeout(timer);
  }, [buildStatus, activeStep, recipe, flat, shouldFailNext]);

  useEffect(
    () => () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    },
    []
  );

  function showNotice(message: string) {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3600);
  }

  function startBuild(prompt: string, track = true) {
    latestPromptRef.current = prompt;
    setLatestPrompt(prompt);
    if (track) setPromptStack((prev) => [...prev, prompt]);
    setFailedPrompt("");
    setActiveStep(0);
    setBuildStatus("understanding");
    setView("preview");
    setNotice("");
  }

  function submitPrompt(prompt: string) {
    startBuild(prompt);
  }

  function retryBuild() {
    startBuild(failedPrompt || latestPromptRef.current, false);
  }

  function armFailure() {
    if (busy) return;
    setShouldFailNext(true);
    showNotice("Failure armed — the next build will fail by design.");
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
      <WorkspaceHeader status={buildStatus} projectName={projectName} onNotice={showNotice} />
      <WorkspaceToolbar activeView={view} onChange={setView} status={buildStatus} />

      <div className="relative flex min-h-0 flex-1">
        <FileExplorer selectedFile={selectedFile} onSelect={openFile} modifiedFiles={modifiedFiles} />
        <section className="flex min-w-0 flex-1 flex-col bg-[#0b0f19]" aria-label={`${view} workspace`}>
          {view === "preview" && (
            <div className="relative flex min-h-0 flex-1 items-stretch justify-center overflow-hidden p-2 sm:p-3 lg:p-4">
              <PreviewStatus status={buildStatus} />
              <DashboardPreview />
            </div>
          )}
          {view === "code" && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-2 sm:p-3 lg:p-4">
              <CodeSurface selectedFile={selectedFile} modifiedFiles={modifiedFiles} />
            </div>
          )}
          {view === "terminal" && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-2 sm:p-3 lg:p-4">
              <TerminalSurface />
            </div>
          )}
          {view === "files" && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-3 sm:p-5 lg:p-7">
              <FilesOverview onOpenFile={openFileByPath} modifiedFiles={modifiedFiles} />
            </div>
          )}
        </section>
        <ActivityPanel
          status={buildStatus}
          activeStep={activeStep}
          recipe={recipe}
          flat={flat}
          files={files}
          latestPrompt={latestPrompt}
          promptStack={promptStack}
          versions={versions}
          failureArmed={shouldFailNext}
          onArmFailure={armFailure}
          onRetry={retryBuild}
        />
        {notice && (
          <div className="absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-lg border border-white/10 bg-[#202734] px-3 py-2 text-center text-[10px] text-slate-200 shadow-xl" role="status">
            {notice}
          </div>
        )}
      </div>

      <ActivitySummary status={buildStatus} activeStep={activeStep} flat={flat} />
      <PromptComposer status={buildStatus} onSubmit={submitPrompt} />
    </main>
  );
}