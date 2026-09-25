import type { ProjectTone } from "./projects";

export type Template = {
  id: string;
  name: string;
  description: string;
  category: string;
  tone: ProjectTone;
  prompt: string;
};

export const templates: Template[] = [
  {
    id: "saas-dashboard",
    name: "SaaS Dashboard",
    description:
      "KPI cards, revenue charts, MRR, churn, and a customers table for a subscription business.",
    category: "Dashboard",
    tone: "indigo",
    prompt: "Build a clean SaaS analytics dashboard with KPI cards, revenue charts, MRR, churn, and a recent customers table.",
  },
  {
    id: "customer-portal",
    name: "Customer Support",
    description:
      "Ticket inbox, priority filters, and queue visibility for a support team.",
    category: "Portal",
    tone: "sky",
    prompt: "Build a customer support dashboard with a ticket inbox, priority filters, and queue visibility.",
  },
  {
    id: "project-board",
    name: "Project Board",
    description:
      "Kanban columns, task cards, and sprint tracking for a small engineering team.",
    category: "Internal",
    tone: "mint",
    prompt: "Build a project management app with a kanban board, tasks, and sprint tracking.",
  },
  {
    id: "finance-tracker",
    name: "Finance Tracker",
    description:
      "Balances, a monthly budget, and spending by category for personal finance.",
    category: "Dashboard",
    tone: "amber",
    prompt: "Build a personal finance tracker with account balances, a monthly budget, and spending by category.",
  },
];