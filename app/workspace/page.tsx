import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { projects } from "@/data/projects";
import type { ScenarioId } from "@/data/scenarios";

const defaultPrompt = "Build a clean SaaS analytics dashboard for a modern startup.";

export default function WorkspacePage({
  searchParams,
}: {
  searchParams: { prompt?: string; project?: string; new?: string };
}) {
  const initialPrompt = searchParams.prompt || defaultPrompt;
  const autoRun = Boolean(searchParams.new && searchParams.prompt);

  let projectName: string | undefined;
  let projectScenarioId: ScenarioId | undefined;
  if (searchParams.project) {
    const matched = projects.find((project) => project.id === searchParams.project);
    if (matched) {
      projectName = matched.name;
      projectScenarioId = matched.scenarioId;
    } else {
      projectName = searchParams.project;
    }
  }

  return (
    <WorkspaceShell
      key={searchParams.project ?? searchParams.prompt ?? "default"}
      initialPrompt={initialPrompt}
      projectName={projectName}
      projectScenarioId={projectScenarioId}
      autoRun={autoRun}
    />
  );
}
