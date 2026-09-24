export type WorkspaceView = "preview" | "code" | "terminal" | "files";

export type BuildStatus = "ready" | "building" | "complete";

export type ProjectFile = {
  name: string;
  path: string;
  kind: "folder" | "file";
  language?: string;
};
