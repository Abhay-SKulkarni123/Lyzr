export type WorkspaceView =
  | "preview"
  | "code"
  | "terminal"
  | "files"
  | "git"
  | "deployments"
  | "environment"
  | "settings";

export const PRIMARY_VIEWS: WorkspaceView[] = ["preview", "code", "terminal", "files"];

export const DEVELOPER_VIEWS: WorkspaceView[] = ["git", "deployments", "environment", "settings"];

export function isDeveloperView(view: WorkspaceView): boolean {
  return DEVELOPER_VIEWS.includes(view);
}

export type BuildStatus =
  | "idle"
  | "understanding"
  | "planning"
  | "building"
  | "checking"
  | "complete"
  | "error";

export const BUILD_PHASES: BuildStatus[] = [
  "understanding",
  "planning",
  "building",
  "checking",
];

export function isBuildPhase(status: BuildStatus): boolean {
  return BUILD_PHASES.includes(status);
}

export type ProjectFile = {
  name: string;
  path: string;
  kind: "folder" | "file";
  language?: string;
};