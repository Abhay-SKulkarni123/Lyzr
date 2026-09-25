import type { ScenarioId } from "./scenarios";

export type ProjectStatus = "active" | "building" | "draft";

export type DeploymentStatus = "deployed" | "staging" | "not-deployed";

export type ProjectTone = "coral" | "mint" | "amber" | "indigo" | "sky" | "rose";

export type ProjectType = "dashboard" | "portal" | "landing" | "web-app";

export type Project = {
  id: string;
  name: string;
  scenarioId?: ScenarioId;
  description: string;
  status: ProjectStatus;
  deploymentStatus: DeploymentStatus;
  type: ProjectType;
  framework: string;
  updatedAt: string;
  tone: ProjectTone;
};

export type NewProjectInput = {
  name: string;
  prompt: string;
  templateId?: string;
};

export const projects: Project[] = [
  {
    id: "northstar-analytics",
    name: "SaaS Analytics",
    scenarioId: "saas-analytics",
    description:
      "Revenue, MRR, active users, churn, and plan analytics for a subscription business.",
    status: "active",
    deploymentStatus: "deployed",
    type: "dashboard",
    framework: "Next.js",
    updatedAt: "2 hours ago",
    tone: "indigo",
  },
  {
    id: "support-portal",
    name: "Customer Support",
    scenarioId: "customer-support",
    description:
      "Ticket inbox, status and priority filters, and response-time visibility for a support team.",
    status: "building",
    deploymentStatus: "staging",
    type: "portal",
    framework: "Next.js",
    updatedAt: "5 hours ago",
    tone: "mint",
  },
  {
    id: "project-hub",
    name: "Project Management",
    scenarioId: "project-management",
    description:
      "Kanban board, sprint tracking, and task cards for a small engineering team.",
    status: "active",
    deploymentStatus: "staging",
    type: "web-app",
    framework: "Next.js",
    updatedAt: "1 day ago",
    tone: "sky",
  },
  {
    id: "finance-tracker",
    name: "Personal Finance",
    scenarioId: "personal-finance",
    description:
      "Account balances, budgets, and spending by category for personal money management.",
    status: "draft",
    deploymentStatus: "not-deployed",
    type: "dashboard",
    framework: "Next.js",
    updatedAt: "3 days ago",
    tone: "amber",
  },
];