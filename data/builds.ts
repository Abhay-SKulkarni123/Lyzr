import type { BuildStatus } from "@/components/workspace/types";

export type AgentId = "architect" | "ui-builder" | "data-agent" | "qa-agent";

export type AgentStatus = "idle" | "active" | "waiting" | "done" | "error";

export type AgentDefinition = {
  id: AgentId;
  name: string;
  role: string;
};

export const agents: AgentDefinition[] = [
  { id: "architect", name: "Architect", role: "Plans structure and flow" },
  { id: "ui-builder", name: "UI Builder", role: "Creates components and layout" },
  { id: "data-agent", name: "Data Agent", role: "Prepares mock data and charts" },
  { id: "qa-agent", name: "QA Agent", role: "Runs interface checks" },
];

export type BuildActivity = {
  agentId: AgentId;
  message: string;
  filePath?: string;
};

export type RecipePhase = {
  phase: Exclude<BuildStatus, "idle" | "complete" | "error">;
  activities: BuildActivity[];
};

export type PlanStep = {
  id: string;
  title: string;
  agentId: AgentId;
};

export type BuildRecipe = {
  label: string;
  plan: PlanStep[];
  phases: RecipePhase[];
};

export type BuildVersion = {
  version: string;
  label: string;
};

export const seedVersions: BuildVersion[] = [
  { version: "v1", label: "Initial dashboard" },
  { version: "v2", label: "Added analytics section" },
  { version: "v3", label: "Updated visual style" },
];

export const initialRecipe: BuildRecipe = {
  label: "Initial build",
  plan: [
    { id: "shell", title: "Create application shell", agentId: "architect" },
    { id: "nav", title: "Build navigation", agentId: "ui-builder" },
    { id: "layout", title: "Create dashboard layout", agentId: "ui-builder" },
    { id: "kpi", title: "Add KPI cards", agentId: "ui-builder" },
    { id: "data", title: "Prepare analytics data", agentId: "data-agent" },
    { id: "chart", title: "Add revenue visualization", agentId: "data-agent" },
    { id: "responsive", title: "Make layout responsive", agentId: "ui-builder" },
    { id: "preview", title: "Rebuild preview", agentId: "qa-agent" },
    { id: "checks", title: "Run interface checks", agentId: "qa-agent" },
  ],
  phases: [
    {
      phase: "understanding",
      activities: [
        {
          agentId: "architect",
          message: "Parsing your brief into build requirements",
        },
      ],
    },
    {
      phase: "planning",
      activities: [
        { agentId: "architect", message: "Shaping the implementation plan" },
      ],
    },
    {
      phase: "building",
      activities: [
        {
          agentId: "architect",
          message: "Created the application shell",
          filePath: "app/layout.tsx",
        },
        {
          agentId: "ui-builder",
          message: "Built the app navigation sidebar",
          filePath: "components/dashboard/Sidebar.tsx",
        },
        {
          agentId: "ui-builder",
          message: "Layed out the main dashboard page",
          filePath: "app/page.tsx",
        },
        {
          agentId: "ui-builder",
          message: "Added the KPI cards",
          filePath: "components/dashboard/KpiCard.tsx",
        },
        {
          agentId: "data-agent",
          message: "Prepared mock analytics data",
          filePath: "lib/analytics.ts",
        },
        {
          agentId: "data-agent",
          message: "Wired the revenue visualization",
          filePath: "components/dashboard/RevenueChart.tsx",
        },
        {
          agentId: "ui-builder",
          message: "Made the layout responsive",
          filePath: "app/globals.css",
        },
      ],
    },
    {
      phase: "checking",
      activities: [
        { agentId: "qa-agent", message: "Rendered the app in a preview sandbox" },
        { agentId: "qa-agent", message: "Checked responsive behavior and spacing" },
      ],
    },
  ],
};

export const iterationRecipe: BuildRecipe = {
  label: "Iteration",
  plan: [
    { id: "read", title: "Interpret the change", agentId: "architect" },
    { id: "layout", title: "Refine dashboard layout", agentId: "ui-builder" },
    { id: "nav", title: "Update navigation", agentId: "ui-builder" },
    { id: "chart", title: "Refresh analytics view", agentId: "data-agent" },
    { id: "style", title: "Adjust visual style", agentId: "ui-builder" },
    { id: "preview", title: "Rebuild preview", agentId: "qa-agent" },
    { id: "checks", title: "Run interface checks", agentId: "qa-agent" },
  ],
  phases: [
    {
      phase: "understanding",
      activities: [
        { agentId: "architect", message: "Reading your change against the current app" },
      ],
    },
    {
      phase: "planning",
      activities: [
        { agentId: "architect", message: "Planning the smallest safe change" },
      ],
    },
    {
      phase: "building",
      activities: [
        {
          agentId: "ui-builder",
          message: "Refined the dashboard layout",
          filePath: "app/page.tsx",
        },
        {
          agentId: "ui-builder",
          message: "Updated the app navigation",
          filePath: "components/dashboard/Sidebar.tsx",
        },
        {
          agentId: "data-agent",
          message: "Refreshed the revenue visualization",
          filePath: "components/dashboard/RevenueChart.tsx",
        },
        {
          agentId: "ui-builder",
          message: "Adjusted colors and spacing",
          filePath: "app/globals.css",
        },
      ],
    },
    {
      phase: "checking",
      activities: [
        { agentId: "qa-agent", message: "Rebuilt the preview sandbox" },
        { agentId: "qa-agent", message: "Rechecked responsiveness and contrast" },
      ],
    },
  ],
};

export function getRecipeActivities(recipe: BuildRecipe): BuildActivity[] {
  return recipe.phases.flatMap((phase) => phase.activities);
}

export function getActivityPhase(
  recipe: BuildRecipe,
  activity: BuildActivity
): Exclude<BuildStatus, "idle" | "complete" | "error"> {
  return (
    recipe.phases.find((phase) => phase.activities.includes(activity))?.phase ??
    "building"
  );
}

export function getPlanWorkIndices(recipe: BuildRecipe): number[] {
  const flat = getRecipeActivities(recipe);
  const indices: number[] = [];
  flat.forEach((activity, index) => {
    const phase = getActivityPhase(recipe, activity);
    if (phase === "building" || phase === "checking") indices.push(index);
  });
  return indices;
}

export function getRecipeFiles(recipe: BuildRecipe): string[] {
  const seen = new Set<string>();
  const files: string[] = [];
  for (const activity of getRecipeActivities(recipe)) {
    if (activity.filePath && !seen.has(activity.filePath)) {
      seen.add(activity.filePath);
      files.push(activity.filePath);
    }
  }
  return files;
}

export function getAgentActivities(
  recipe: BuildRecipe,
  agentId: AgentId
): number[] {
  return getRecipeActivities(recipe)
    .map((activity, index) => ({ activity, index }))
    .filter(({ activity }) => activity.agentId === agentId)
    .map(({ index }) => index);
}

export function labelFromPrompt(prompt: string): string {
  const words = prompt.trim().split(/\s+/).slice(0, 5).join(" ");
  if (!words) return "Build change";
  return words.length > 34 ? `${words.slice(0, 34)}…` : words;
}