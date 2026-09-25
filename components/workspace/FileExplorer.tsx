import { ChevronDown, ChevronRight, FileCode2, FileJson2, FileText, Folder, FolderOpen, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { developerFileTree, filePaths, type FileTreeNode } from "@/data/developer";

type ProjectFiles = {
  name: string;
  tree: FileTreeNode[];
};

function defaultExpandedFor(tree: FileTreeNode[]): Set<string> {
  const expanded = new Set<string>();
  tree.forEach((node) => {
    if (node.kind === "folder") {
      expanded.add(node.path);
      node.children?.forEach((child) => {
        if (child.kind === "folder") expanded.add(child.path);
      });
    }
  });
  return expanded;
}

function FileTypeIcon({ node }: { node: FileTreeNode }) {
  if (node.path.endsWith(".json")) return <FileJson2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-amber-300" />;
  if (node.path.endsWith(".css")) return <FileText aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-sky-300" />;
  if (node.path.endsWith(".md")) return <FileText aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-violet-300" />;
  return <FileCode2 aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-coral" />;
}

type TreeRowProps = {
  node: FileTreeNode;
  depth: number;
  isCollapsed: (path: string) => boolean;
  toggle: (path: string) => void;
  selectedFile: string;
  modifiedFiles: ReadonlySet<string>;
  onSelect: (path: string) => void;
};

function TreeRow({ node, depth, isCollapsed, toggle, selectedFile, modifiedFiles, onSelect }: TreeRowProps) {
  if (node.kind === "folder") {
    const closed = isCollapsed(node.path);
    return (
      <div>
        <button
          aria-expanded={!closed}
          aria-label={`${node.name} folder`}
          className="flex w-full items-center gap-1.5 rounded px-1 py-[5px] text-left text-[11px] text-slate-400 transition hover:bg-white/[0.04] hover:text-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60"
          onClick={() => toggle(node.path)}
          style={{ paddingLeft: depth * 14 + 6 }}
          type="button"
        >
          {closed ? (
            <ChevronRight aria-hidden="true" className="h-3 w-3 shrink-0 text-slate-600" />
          ) : (
            <ChevronDown aria-hidden="true" className="h-3 w-3 shrink-0 text-slate-600" />
          )}
          {closed ? (
            <Folder aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-slate-500" />
          ) : (
            <FolderOpen aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-amber-300" />
          )}
          <span className="truncate">{node.name}</span>
        </button>
        {!closed &&
          node.children?.map((child) => (
            <TreeRow
              key={child.path}
              depth={depth + 1}
              isCollapsed={isCollapsed}
              modifiedFiles={modifiedFiles}
              node={child}
              onSelect={onSelect}
              selectedFile={selectedFile}
              toggle={toggle}
            />
          ))}
      </div>
    );
  }
  const active = selectedFile === node.path;
  const modified = modifiedFiles.has(node.path);
  return (
    <button
      aria-current={active ? "true" : undefined}
      className={`flex w-full items-center gap-2 rounded py-[5px] pr-2 text-left text-[11px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
        active ? "bg-white/[0.08] text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
      }`}
      onClick={() => onSelect(node.path)}
      style={{ paddingLeft: depth * 14 + 20 }}
      type="button"
    >
      <FileTypeIcon node={node} />
      <span className="truncate">{node.name}</span>
      {modified && <span aria-label="Updated in this build" className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />}
    </button>
  );
}

type FileExplorerProps = {
  selectedFile: string | null;
  onSelect: (path: string) => void;
  modifiedFiles?: ReadonlySet<string>;
  project?: ProjectFiles;
};

export function FileExplorer({ selectedFile, onSelect, modifiedFiles, project }: FileExplorerProps) {
  const projectFiles = project ?? { name: "northstar-analytics", tree: developerFileTree };
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    defaultExpandedFor(projectFiles.tree).forEach((path) => {
      initial[path] = false;
    });
    return initial;
  });
  const [query, setQuery] = useState("");

  const allFiles = useMemo(() => filePaths(projectFiles.tree), [projectFiles.tree]);
  const matches = useMemo(
    () => (query.trim() ? allFiles.filter((path) => path.toLowerCase().includes(query.trim().toLowerCase())) : null),
    [allFiles, query]
  );

  const isCollapsed = (path: string) => collapsed[path] ?? false;
  const modifiedCount = modifiedFiles?.size ?? 0;

  return (
    <aside className="hidden w-[218px] shrink-0 flex-col border-r border-white/[0.07] bg-[#10141d] lg:flex">
      <div className="flex h-11 shrink-0 items-center justify-between border-b border-white/[0.06] px-4">
        <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-500">Project files</span>
        <span className={`text-[9px] ${modifiedCount > 0 ? "text-emerald-300" : "text-slate-600"}`}>
          {allFiles.length} files{modifiedCount > 0 ? ` · ${modifiedCount} updated` : ""}
        </span>
      </div>
      <div className="workspace-scrollbar min-h-0 flex-1 overflow-y-auto px-2 py-2">
        <label className="relative mb-2 flex items-center">
          <span className="sr-only">Filter project files</span>
          <Search aria-hidden="true" className="pointer-events-none absolute left-2 h-3 w-3 text-slate-600" />
          <input
            className="w-full rounded-md border border-white/[0.07] bg-[#0b0f19] py-1.5 pl-7 pr-2 text-[10px] text-white outline-none placeholder:text-slate-600 focus:border-coral/40 focus:ring-1 focus:ring-coral/30"
            placeholder="Filter files..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="mb-1 flex items-center gap-1.5 rounded px-2 py-1 text-[11px] font-medium text-slate-300">
          <FolderOpen aria-hidden="true" className="h-3.5 w-3.5 text-amber-300" />
          {projectFiles.name}
        </div>
        {matches === null ? (
          projectFiles.tree.map((node) => (
            <TreeRow
              key={node.path}
              depth={0}
              isCollapsed={isCollapsed}
              modifiedFiles={modifiedFiles ?? new Set()}
              node={node}
              onSelect={onSelect}
              selectedFile={selectedFile ?? ""}
              toggle={(path) => setCollapsed((prev) => ({ ...prev, [path]: !prev[path] }))}
            />
          ))
        ) : matches.length === 0 ? (
          <p className="px-2 py-3 text-center text-[10px] text-slate-600">No files match “{query}”.</p>
        ) : (
          matches.map((path) => (
            <button
              key={path}
              className={`flex w-full items-center gap-2 rounded px-2 py-[5px] pr-2 text-left text-[11px] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-coral/60 ${
                selectedFile === path ? "bg-white/[0.08] text-white" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"
              }`}
              onClick={() => onSelect(path)}
              style={{ paddingLeft: 18 }}
              type="button"
            >
              <FileCode2 aria-hidden="true" className="h-3 w-3 shrink-0 text-coral" />
              <span className="truncate font-mono text-[10px]">{path}</span>
              {(modifiedFiles?.has(path) ?? false) && <span aria-label="Updated" className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />}
            </button>
          ))
        )}
      </div>
      <div className="shrink-0 border-t border-white/[0.06] px-4 py-3 text-[10px] text-slate-600">
        <span className="font-mono">{allFiles.length}</span> files · sample project, read-only
      </div>
    </aside>
  );
}