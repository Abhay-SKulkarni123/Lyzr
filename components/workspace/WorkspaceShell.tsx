"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { DeploymentDialog } from "@/components/deployment/DeploymentDialog";
import { DeploymentPanel } from "@/components/deployment/DeploymentPanel";
import { useDeploymentState } from "@/components/deployment/useDeploymentState";
import { GithubConnectionModal } from "@/components/github/GithubConnectionModal";
import { PullRequestDialog } from "@/components/github/PullRequestDialog";
import { useGithubState } from "@/components/github/useGithubState";
import { ActivityPanel, ActivitySummary } from "./ActivityPanel";
import { BuildSessionPanel } from "./BuildSessionPanel";
import { CodeEditor } from "./CodeEditor";
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
import { ScenarioPreview } from "./ScenarioPreview";
import {
  getActivityPhase,
  getRecipeActivities,
  getRecipeFiles,
  labelFromPrompt,
} from "@/data/builds";
import type { GitChange, GitCommit } from "@/data/developer";
import {
  changeSummary,
  filesOverviewFor,
  historyFor,
  initialChangesFor,
  resolveScenarioResult,
  scenarioById,
  seedVersionsFor,
  writeProjectContext,
  type ScenarioId,
  type VersionSummary,
} from "@/data/scenarios";

const defaultPrompt = "Build a clean SaaS analytics dashboard for a modern startup.";

const tickDuration = 950;

type WorkspaceShellProps = {
  initialPrompt?: string;
  projectName?: string;
  projectScenarioId?: ScenarioId;
  autoRun?: boolean;
};

export function WorkspaceShell({
  initialPrompt = defaultPrompt,
  projectName,
  projectScenarioId,
  autoRun = false,
}: WorkspaceShellProps) {
  const [view, setView] = useState<WorkspaceView>("preview");
  const [developerMode, setDeveloperMode] = useState(false);
  const developerModeRef = useRef(developerMode);
  developerModeRef.current = developerMode;
  const [tabs, setTabs] = useState<string[]>(["app/page.tsx"]);
  const [activePath, setActivePath] = useState<string | null>("app/page.tsx");
  const [buildStatus, setBuildStatus] = useState<BuildStatus>("idle");
  const [activeStep, setActiveStep] = useState(0);
  const [buildIndex, setBuildIndex] = useState(0);
  const [latestPrompt, setLatestPrompt] = useState(initialPrompt);
  const [promptStack, setPromptStack] = useState<string[]>([]);

  const resolved = useMemo(
    () =>
      projectScenarioId
        ? { scenario: scenarioById(projectScenarioId), matched: true }
        : resolveScenarioResult(promptStack[0] ?? initialPrompt),
    [promptStack, initialPrompt, projectScenarioId]
  );
  const scenario = resolved.scenario;
  const showSamplePreview = !projectScenarioId && !resolved.matched;

  const [versions, setVersions] = useState<VersionSummary[]>(() =>
    seedVersionsFor(resolved.scenario)
  );
  const [notice, setNotice] = useState("");
  const [shouldFailNext, setShouldFailNext] = useState(false);
  const [failedPrompt, setFailedPrompt] = useState("");
  const [changes, setChangesState] = useState<GitChange[]>(() =>
    initialChangesFor(resolved.scenario)
  );
  const [commits, setCommitsState] = useState<GitCommit[]>(() =>
    historyFor(resolved.scenario)
  );
  const [githubModalOpen, setGithubModalOpen] = useState(false);
  const [prDialog, setPrDialog] = useState<{ open: boolean; compare: string }>({ open: false, compare: "feature/analytics" });
  const [deployDialogOpen, setDeployDialogOpen] = useState(false);

  const router = useRouter();

  const latestPromptRef = useRef(latestPrompt);
  latestPromptRef.current = latestPrompt;
  const noticeTimer = useRef<number | null>(null);
  const autoRunHandled = useRef(false);
  const github = useGithubState({ onNotice: showNotice, defaultRepoId: scenario.githubRepoId });
  const deployment = useDeploymentState({
    onNotice: showNotice,
    project: { name: scenario.name, previewUrl: scenario.previewUrl },
  });
  const appName = projectName ?? scenario.name;

  const filesOverview = useMemo(
    () => ({
      name: scenario.packageName,
      description: `A sample project structure for the generated ${scenario.name}.`,
      entries: filesOverviewFor(scenario),
    }),
    [scenario]
  );

  useEffect(() => {
    writeProjectContext({
      scenarioId: scenario.id,
      name: scenario.name,
      packageName: scenario.packageName,
      previewUrl: scenario.previewUrl,
    });
  }, [scenario]);

  const recipe = buildIndex === 0 ? scenario.initialRecipe : scenario.iterationRecipe;
  const flat = useMemo(() => getRecipeActivities(recipe), [recipe]);
  const files = useMemo(() => getRecipeFiles(recipe), [recipe]);

  const busy = buildStatus === "understanding" || buildStatus === "planning" || buildStatus === "building" || buildStatus === "checking";

  const headCommitSha = useMemo(() => {
    return github.pushedHead ?? commits[0]?.hash ?? "a81d3f2";
  }, [github.pushedHead, commits]);

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
    changes.forEach((change) => {
      if (change.state !== "D") set.add(change.file);
    });
    return set;
  }, [buildStatus, activeStep, flat, files, changes]);

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
        const prompt = latestPromptRef.current;
        setVersions((prev) => [
          ...prev,
          {
            version: `v${prev.length + 1}`,
            label: labelFromPrompt(prompt),
            summary: changeSummary(prompt),
            prompt,
          },
        ]);
        setChangesState((prev) => {
          const paths = Array.from(new Set(flat.map((activity) => activity.filePath).filter((path): path is string => Boolean(path))));
          const missing = paths.filter((path) => !prev.some((change) => change.file === path));
          return missing.length > 0 ? [...missing.map((path) => ({ file: path, state: "M" as const, staged: false })), ...prev] : prev;
        });
        setTabs((prev) => (prev.includes("app/page.tsx") ? prev : [...prev, "app/page.tsx"]));
        setActivePath("app/page.tsx");
        setView(developerModeRef.current ? "code" : "preview");
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

  function openLiveApp() {
    setDeployDialogOpen(false);
    router.push("/deployments/live");
  }

  function openDeployments() {
    setDeployDialogOpen(false);
    router.push("/deployments");
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
        branch={github.branch}
        changes={changes.length}
        deploymentStatus={deployment.activeStatus}
        developerMode={developerMode}
        github={github}
        onDeveloperModeChange={toggleDeveloperMode}
        onNotice={showNotice}
        onOpenDeployment={() => setDeployDialogOpen(true)}
        onOpenGithub={() => setGithubModalOpen(true)}
        projectName={appName}
        status={buildStatus}
      />
      <WorkspaceToolbar activeView={view} developerMode={developerMode} onChange={setView} status={buildStatus} />
      <BuildSessionPanel
        activeStep={activeStep}
        flat={flat}
        isIteration={promptStack.length > 1}
        latestPrompt={latestPrompt}
        onOpenDeploy={() => setDeployDialogOpen(true)}
        onOpenPreview={() => setView("preview")}
        onRetry={retryBuild}
        onReviewChanges={() => setView("files")}
        recipe={recipe}
        status={buildStatus}
      />

      <div className="relative flex min-h-0 flex-1">
        <FileExplorer
          modifiedFiles={modifiedFiles}
          onSelect={openFileByPath}
          project={{ name: scenario.name, tree: scenario.fileTree }}
          selectedFile={activePath}
        />
        <section className="flex min-w-0 flex-1 flex-col bg-[#0b0f19]" aria-label={`${view} workspace`}>
          {view === "preview" && (
            <div className="relative flex min-h-0 flex-1 items-stretch justify-center overflow-hidden p-2 sm:p-3 lg:p-4">
              <PreviewStatus live={deployment.live} status={buildStatus} />
              <ScenarioPreview scenarioId={scenario.id} />
              {showSamplePreview && (
                <p className="absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-[#0c1018]/90 px-3 py-1 text-center text-[9px] text-slate-500">
                  Shared sample preview — this prompt didn’t match a bundled scaffold, so the sample app is shown.
                </p>
              )}
            </div>
          )}
          {view === "code" && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-2 sm:p-3 lg:p-4">
              <CodeEditor
                activePath={activePath}
                modifiedFiles={modifiedFiles}
                onClose={closeTab}
                onSelect={selectActivePath}
                samples={scenario.codeSamples}
                tabs={tabs}
              />
            </div>
          )}
          {view === "terminal" && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-2 sm:p-3 lg:p-4">
              <TerminalPanel packageName={scenario.packageName} />
            </div>
          )}
          {(view === "git" || view === "deployments" || view === "environment" || view === "settings" || view === "files") && (
            <div className="workspace-scrollbar min-h-0 flex-1 overflow-auto p-3 sm:p-5 lg:p-7">
              {view === "git" && (
                <GitPanel
                  changes={changes}
                  commits={commits}
                  github={github}
                  onChangesChange={setChangesState}
                  onCommitsChange={setCommitsState}
                  onNotice={showNotice}
                  onOpenGithub={() => setGithubModalOpen(true)}
                  onOpenPullRequest={(compare) => setPrDialog({ open: true, compare })}
                />
              )}
              {view === "deployments" && (
                <DeploymentPanel
                  branch={github.branch}
                  commitSha={headCommitSha}
                  deployment={deployment}
                  onOpenLiveApp={openLiveApp}
                  projectName={appName}
                />
              )}
              {view === "environment" && <EnvironmentPanel onNotice={showNotice} />}
              {view === "settings" && <DeveloperSettingsPanel />}
              {view === "files" && <FilesOverview modifiedFiles={modifiedFiles} onOpenFile={openFileByPath} project={filesOverview} />}
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
        {githubModalOpen && <GithubConnectionModal github={github} onClose={() => setGithubModalOpen(false)} />}
        {deployDialogOpen && (
          <DeploymentDialog
            branches={github.branches}
            commitSha={headCommitSha}
            deployment={deployment}
            onClose={() => setDeployDialogOpen(false)}
            onOpenLiveApp={openLiveApp}
            onOpenPreview={() => {
              setDeployDialogOpen(false);
              setView("preview");
            }}
            onViewDeployments={openDeployments}
            projectName={appName}
          />
        )}
        {prDialog.open && (
          <PullRequestDialog
            changedFiles={changes.length}
            defaultCompare={prDialog.compare}
            github={github}
            onClose={() => setPrDialog((prev) => ({ ...prev, open: false }))}
            onNotice={showNotice}
          />
        )}
      </div>

      <ActivitySummary activeStep={activeStep} flat={flat} status={buildStatus} />
      <PromptComposer developerMode={developerMode} onSubmit={submitPrompt} status={buildStatus} />
    </main>
  );
}