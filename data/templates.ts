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
      "Analytics overview with KPIs, revenue charts, and a customer table.",
    category: "Dashboard",
    tone: "indigo",
    prompt: "Build a clean SaaS analytics dashboard with KPIs, revenue charts, and a recent customers table.",
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description:
      "Hero, feature sections, pricing, and a signup call to action.",
    category: "Marketing",
    tone: "coral",
    prompt: "Build a modern landing page with hero, features, pricing, and signup sections.",
  },
  {
    id: "admin-panel",
    name: "Admin Panel",
    description:
      "Tables, filters, and detail views for managing data.",
    category: "Internal",
    tone: "mint",
    prompt: "Build an admin panel with data tables, filters, and detail views.",
  },
  {
    id: "customer-portal",
    name: "Customer Portal",
    description:
      "Ticket list, customer context, and a message composer.",
    category: "Portal",
    tone: "sky",
    prompt: "Build a customer support portal with tickets, customer context, and a response composer.",
  },
];