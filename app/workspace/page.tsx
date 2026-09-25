import { WorkspaceShell } from "@/components/workspace/WorkspaceShell";
import { projects } from "@/data/projects";

const defaultPrompt = "Build a clean SaaS analytics dashboard for a modern startup.";

export default function WorkspacePage({
  searchParams,
}: {
  searchParams: { prompt?: string; project?: string; new?: string };
}) {
  const initialPrompt = searchParams.prompt || defaultPrompt;
  const autoRun = Boolean(searchParams.new && searchParams.prompt);

  let projectName: string | undefined;
  if (searchParams.project) {
    const matched = projects.find((project) => project.id === searchParams.project);
    projectName = matched ? matched.name : searchParams.project;
  }

  return <WorkspaceShell initialPrompt={initialPrompt} projectName={projectName} autoRun={autoRun} />;
}