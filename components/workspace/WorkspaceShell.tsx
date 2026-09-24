"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityPanel, ActivitySummary } from "./ActivityPanel";
import { CodeEditor } from "./CodeEditor";
import { DashboardPreview } from "./DashboardPreview";
import { DeveloperSettingsPanel } from "./DeveloperSettingsPanel";
import { EnvironmentPanel } from "./EnvironmentPanel";
import { FileExplorer } from "./FileExplorer";
import { FilesOverview } from "./FilesOverview";
import { GitPanel } from "./GitPanel";
import { PreviewStatus } from "./PreviewStatus";
import { PromptComposer } from "./PromptComposer";
import { TerminalPanel } from "./TerminalPanel";
import { WorkspaceHeader } from "./WorkspaceHeader";
import { WorkspaceToolbar } from "./WorkspaceToolbar";
import { isDeveloperView, type BuildStatus, type WorkspaceView } from "./types";
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
import { gitChanges } from "@/data/developer";

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
  const [developerMode, setDeveloperMode] = useState(false);
  const [tabs, setTabs] = useState<string[]>(["app/page.tsx"]);
  const [activePath, setActivePath] = useState<string | null>("app/page.tsx");
  const [buildStatus, setBuildStatus] = useState<BuildStatus>("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [buildIndex, setBuildIndex] = useState(0);
  const [latestPrompt, setLatestPrompt] = useState(initialPrompt);
  const [promptStack, setPromptStack] = useState<string[]>([]);
  const [versions, setVersions] = useState<BuildVersion[]>(seedVersions);
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
    } else {
      const cutoff = buildStatus === "error" ? activeStep + 1 : activeStep;
      flat.forEach((activity, index) => {
        if (index < cutoff && activity.filePath) set.add(activity.filePath);
      });
    }
    gitChanges.forEach((change) => {
      if (change.state !== "D") set.add(change.file);
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
        setVersions((prev) => [...prev, { version: `v${prev.length + 1}`, label: labelFromPrompt(latestPromptRef.current) }]);
        setTabs((prev) => (prev.includes("app/page.tsx") ? prev : [...prev, "app/page.tsx"]));
        setActivePath("app/page.tsx");
        setView("code");
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

  function toggleDeveloperMode(enabled: boolean) {
    setDeveloperMode(enabled);
    if (!enabled && isDeveloperView(view)) setView("preview");
  }

  function openFileByPath(path: string) {
    setTabs((prev) => (prev.includes(path) ? prev : [...prev, path]));
    setActivePath(path);
    setView("code");
  }

  function selectActivePath(path: string) {
    setActivePath(path);
  }

  function closeTab(path: string) {
    setTabs((prev) => {
      const next = prev.filter((tab) => tab !== path);
      if (path === activePath) setActivePath(next.length > 0 ? next[next.length - 1] : null);
      return next.length > 0 ? next : [];
    });
  }

  return (
    <main className="flex h-dvh min-h-0 min-w-[320px] flex-col overflow-hidden bg-[#0b0f19] text-slate-200">
      <WorkspaceHeader
        developerMode={developerMode}
        onDeveloperModeChange={toggleDeveloperMode}
        onNotice={showNotice}
        projectName={projectName}
        status={buildStatus}
      />
      <WorkspaceToolbar activeView={view} developerMode={developerMode} onChange={setView} status={buildStatus} />

      <div className="relative flex min-h-0 flex-1">
        <FileExplorer onSelect={openFileByPath} modifiedFiles={modifiedFiles} selectedFile={activePath} />
        <section className="flex min-w-0 flex-1 flex-col bg-[#0b0f19]" aria-label={`${view} workspace`}>
          {view === "preview" && (
            <div className="relative flex min-h-0 flex-1 items-stretch justify-center overflow-hidden p-2 sm:p-3 lg:p-4">
              <PreviewStatus status={buildStatus} />
              <DashboardPreview />
            </div>
          )}
          {view === "code" && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-2 sm:p-3 lg:p-4">
              <CodeEditor
                activePath={activePath}
                modifiedFiles={modifiedFiles}
                onClose={closeTab}
                onSelect={selectActivePath}
                tabs={tabs}
              />
            </div>
          )}
          {view === "terminal" && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-2 sm:p-3 lg:p-4">
              <TerminalPanel />
            </div>
          )}
          {(view === "git" || view === "environment" || view === "settings" || view === "files") && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-3 sm:p-5 lg:p-7">
              {view === "git" && <GitPanel onNotice={showNotice} />}
              {view === "environment" && <EnvironmentPanel onNotice={showNotice} />}
              {view === "settings" && <DeveloperSettingsPanel />}
              {view === "files" && <FilesOverview modifiedFiles={modifiedFiles} onOpenFile={openFileByPath} />}
            </div>
          )}
        </section>
        <ActivityPanel
          activeStep={activeStep}
          failureArmed={shouldFailNext}
          files={files}
          flat={flat}
          latestPrompt={latestPrompt}
          onArmFailure={armFailure}
          onOpenFile={openFileByPath}
          onRetry={retryBuild}
          promptStack={promptStack}
          recipe={recipe}
          status={buildStatus}
          versions={versions}
        />
        {notice && (
          <div className="absolute left-1/2 top-3 z-30 -translate-x-1/2 rounded-lg border border-white/10 bg-[#202734] px-3 py-2 text-center text-[10px] text-slate-200 shadow-xl" role="status">
            {notice}
          </div>
        )}
      </div>

      <ActivitySummary activeStep={activeStep} flat={flat} status={buildStatus} />
      <PromptComposer developerMode={developerMode} onSubmit={submitPrompt} status={buildStatus} />
    </main>
  );
}