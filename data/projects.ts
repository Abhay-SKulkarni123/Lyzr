export type ProjectStatus = "active" | "building" | "draft";

export type DeploymentStatus = "deployed" | "staging" | "not-deployed";

export type ProjectTone = "coral" | "mint" | "amber" | "indigo" | "sky" | "rose";

export type ProjectType = "dashboard" | "portal" | "landing" | "web-app";

export type Project = {
  id: string;
  name: string;
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
    description:
      "Revenue, traffic, and customer analytics dashboard for a modern startup, with charts and KPI cards.",
    status: "active",
    deploymentStatus: "deployed",
    type: "dashboard",
    framework: "Next.js",
    updatedAt: "2 hours ago",
    tone: "indigo",
  },
  {
    id: "support-portal",
    name: "Customer Support Portal",
    description:
      "Ticket inbox, customer context panel, and response composer for a support team.",
    status: "building",
    deploymentStatus: "staging",
    type: "portal",
    framework: "Next.js",
    updatedAt: "5 hours ago",
    tone: "mint",
  },
  {
    id: "fintech-landing",
    name: "Fintech Landing Page",
    description:
      "Marketing landing page with product sections, pricing, and signup prompts for a payments company.",
    status: "active",
    deploymentStatus: "deployed",
    type: "landing",
    framework: "Next.js",
    updatedAt: "1 day ago",
    tone: "coral",
  },
  {
    id: "ai-research-dashboard",
    name: "AI Research Dashboard",
    description:
      "Experiment tracking and model comparison views for an internal ML research team.",
    status: "draft",
    deploymentStatus: "not-deployed",
    type: "dashboard",
    framework: "Next.js",
    updatedAt: "3 days ago",
    tone: "sky",
  },
  {
    id: "operations-console",
    name: "Operations Console",
    description:
      "Internal workspace for monitoring deployments, service health, and incidents.",
    status: "draft",
    deploymentStatus: "not-deployed",
    type: "web-app",
    framework: "Next.js",
    updatedAt: "1 week ago",
    tone: "rose",
  },
];