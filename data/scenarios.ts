import {
  getRecipeFiles,
  initialRecipe,
  iterationRecipe,
  type AgentId,
  type BuildRecipe,
  type PlanStep,
} from "./builds";
import {
  codeSamples as analyticsCodeSamples,
  developerFileTree,
  type FileTreeNode,
  type GitChange,
  type GitCommit,
  type TerminalLine,
} from "./developer";

export type ScenarioId =
  | "saas-analytics"
  | "customer-support"
  | "project-management"
  | "personal-finance";

type ActivitySeed = {
  agentId: AgentId;
  message: string;
  filePath?: string;
};

export type BuildScenario = {
  id: ScenarioId;
  name: string;
  prompt: string;
  tagline: string;
  keywords: string[];
  packageName: string;
  previewUrl: string;
  initialRecipe: BuildRecipe;
  iterationRecipe: BuildRecipe;
  codeSamples: Record<string, string[]>;
  fileTree: FileTreeNode[];
};

function makeRecipe(opts: {
  label: string;
  understanding: string;
  planning: string;
  plan: PlanStep[];
  building: ActivitySeed[];
  checking: string[];
}): BuildRecipe {
  return {
    label: opts.label,
    plan: opts.plan,
    phases: [
      {
        phase: "understanding",
        activities: [{ agentId: "architect", message: opts.understanding }],
      },
      {
        phase: "planning",
        activities: [{ agentId: "architect", message: opts.planning }],
      },
      { phase: "building", activities: opts.building },
      {
        phase: "checking",
        activities: opts.checking.map((message) => ({
          agentId: "qa-agent" as AgentId,
          message,
        })),
      },
    ],
  };
}

const customerSupportInitial = makeRecipe({
  label: "Initial build",
  understanding: "Parsing your support inbox brief into build requirements",
  planning: "Shaping the implementation plan for the inbox",
  plan: [
    { id: "shell", title: "Create application shell", agentId: "architect" },
    { id: "nav", title: "Build navigation", agentId: "ui-builder" },
    { id: "layout", title: "Create inbox layout", agentId: "ui-builder" },
    { id: "tickets", title: "Add ticket list", agentId: "ui-builder" },
    { id: "data", title: "Prepare queue data", agentId: "data-agent" },
    { id: "filters", title: "Add status & priority filters", agentId: "data-agent" },
    { id: "responsive", title: "Make layout responsive", agentId: "ui-builder" },
    { id: "preview", title: "Rebuild preview", agentId: "qa-agent" },
    { id: "checks", title: "Run interface checks", agentId: "qa-agent" },
  ],
  building: [
    {
      agentId: "architect",
      message: "Created the application shell",
      filePath: "app/layout.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Built the support sidebar navigation",
      filePath: "components/support/Sidebar.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Laid out the ticket inbox page",
      filePath: "app/page.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Added the ticket list",
      filePath: "components/support/TicketList.tsx",
    },
    {
      agentId: "data-agent",
      message: "Prepared mock support queue data",
      filePath: "lib/support.ts",
    },
    {
      agentId: "data-agent",
      message: "Wired the status and priority filters",
      filePath: "components/support/QueueFilters.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Made the layout responsive",
      filePath: "app/globals.css",
    },
  ],
  checking: [
    "Rendered the inbox in a preview sandbox",
    "Checked queue filtering and empty states",
  ],
});

const customerSupportIteration = makeRecipe({
  label: "Iteration",
  understanding: "Reading your change against the current inbox",
  planning: "Planning the smallest safe change",
  plan: [
    { id: "read", title: "Interpret the change", agentId: "architect" },
    { id: "layout", title: "Refine inbox layout", agentId: "ui-builder" },
    { id: "nav", title: "Update navigation", agentId: "ui-builder" },
    { id: "tickets", title: "Refresh ticket views", agentId: "data-agent" },
    { id: "style", title: "Adjust visual style", agentId: "ui-builder" },
    { id: "checks", title: "Run interface checks", agentId: "qa-agent" },
  ],
  building: [
    {
      agentId: "ui-builder",
      message: "Refined the inbox layout",
      filePath: "app/page.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Updated the support navigation",
      filePath: "components/support/Sidebar.tsx",
    },
    {
      agentId: "data-agent",
      message: "Refreshed the ticket queue data",
      filePath: "lib/support.ts",
    },
    {
      agentId: "ui-builder",
      message: "Adjusted colors and spacing",
      filePath: "app/globals.css",
    },
  ],
  checking: ["Rebuilt the preview and rechecked the inbox flow"],
});

const projectManagementInitial = makeRecipe({
  label: "Initial build",
  understanding: "Parsing your project management brief into build requirements",
  planning: "Shaping the implementation plan for the board",
  plan: [
    { id: "shell", title: "Create application shell", agentId: "architect" },
    { id: "nav", title: "Build workspace navigation", agentId: "ui-builder" },
    { id: "layout", title: "Create board layout", agentId: "ui-builder" },
    { id: "tasks", title: "Add task cards", agentId: "ui-builder" },
    { id: "data", title: "Prepare sprint data", agentId: "data-agent" },
    { id: "columns", title: "Add column & card support", agentId: "data-agent" },
    { id: "responsive", title: "Make board responsive", agentId: "ui-builder" },
    { id: "preview", title: "Rebuild preview", agentId: "qa-agent" },
    { id: "checks", title: "Run interface checks", agentId: "qa-agent" },
  ],
  building: [
    {
      agentId: "architect",
      message: "Created the application shell",
      filePath: "app/layout.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Built the workspace navigation",
      filePath: "components/pm/Sidebar.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Laid out the kanban board",
      filePath: "app/page.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Added task cards under each column",
      filePath: "components/pm/TaskCard.tsx",
    },
    {
      agentId: "data-agent",
      message: "Prepared mock sprint data",
      filePath: "lib/projects.ts",
    },
    {
      agentId: "data-agent",
      message: "Wired column and card drag support",
      filePath: "components/pm/Board.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Made the board responsive",
      filePath: "app/globals.css",
    },
  ],
  checking: [
    "Rendered the board in a preview sandbox",
    "Checked column overflow and empty states",
  ],
});

const projectManagementIteration = makeRecipe({
  label: "Iteration",
  understanding: "Reading your change against the current board",
  planning: "Planning the smallest safe change",
  plan: [
    { id: "read", title: "Interpret the change", agentId: "architect" },
    { id: "layout", title: "Refine board layout", agentId: "ui-builder" },
    { id: "nav", title: "Update navigation", agentId: "ui-builder" },
    { id: "tasks", title: "Refresh sprint data", agentId: "data-agent" },
    { id: "style", title: "Adjust visual style", agentId: "ui-builder" },
    { id: "checks", title: "Run interface checks", agentId: "qa-agent" },
  ],
  building: [
    {
      agentId: "ui-builder",
      message: "Refined the board layout",
      filePath: "app/page.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Updated the workspace navigation",
      filePath: "components/pm/Sidebar.tsx",
    },
    {
      agentId: "data-agent",
      message: "Refreshed the sprint task data",
      filePath: "lib/projects.ts",
    },
    {
      agentId: "ui-builder",
      message: "Adjusted colors and spacing",
      filePath: "app/globals.css",
    },
  ],
  checking: ["Rebuilt the preview and rechecked the board flow"],
});

const personalFinanceInitial = makeRecipe({
  label: "Initial build",
  understanding: "Parsing your personal finance brief into build requirements",
  planning: "Shaping the implementation plan for the overview",
  plan: [
    { id: "shell", title: "Create application shell", agentId: "architect" },
    { id: "nav", title: "Build account navigation", agentId: "ui-builder" },
    { id: "layout", title: "Create account overview layout", agentId: "ui-builder" },
    { id: "summary", title: "Add spending summary cards", agentId: "ui-builder" },
    { id: "data", title: "Prepare transaction data", agentId: "data-agent" },
    { id: "budget", title: "Add budget visualization", agentId: "data-agent" },
    { id: "responsive", title: "Make layout responsive", agentId: "ui-builder" },
    { id: "preview", title: "Rebuild preview", agentId: "qa-agent" },
    { id: "checks", title: "Run interface checks", agentId: "qa-agent" },
  ],
  building: [
    {
      agentId: "architect",
      message: "Created the application shell",
      filePath: "app/layout.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Built the account navigation",
      filePath: "components/finance/Sidebar.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Laid out the account overview page",
      filePath: "app/page.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Added the spending summary cards",
      filePath: "components/finance/SummaryCards.tsx",
    },
    {
      agentId: "data-agent",
      message: "Prepared mock transaction data",
      filePath: "lib/transactions.ts",
    },
    {
      agentId: "data-agent",
      message: "Wired the budget visualization",
      filePath: "components/finance/BudgetChart.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Made the layout responsive",
      filePath: "app/globals.css",
    },
  ],
  checking: [
    "Rendered the overview in a preview sandbox",
    "Checked balances and transaction rows",
  ],
});

const personalFinanceIteration = makeRecipe({
  label: "Iteration",
  understanding: "Reading your change against the current overview",
  planning: "Planning the smallest safe change",
  plan: [
    { id: "read", title: "Interpret the change", agentId: "architect" },
    { id: "layout", title: "Refine overview layout", agentId: "ui-builder" },
    { id: "nav", title: "Update navigation", agentId: "ui-builder" },
    { id: "budget", title: "Refresh budget data", agentId: "data-agent" },
    { id: "style", title: "Adjust visual style", agentId: "ui-builder" },
    { id: "checks", title: "Run interface checks", agentId: "qa-agent" },
  ],
  building: [
    {
      agentId: "ui-builder",
      message: "Refined the overview layout",
      filePath: "app/page.tsx",
    },
    {
      agentId: "ui-builder",
      message: "Updated the account navigation",
      filePath: "components/finance/Sidebar.tsx",
    },
    {
      agentId: "data-agent",
      message: "Refreshed the transaction data",
      filePath: "lib/transactions.ts",
    },
    {
      agentId: "ui-builder",
      message: "Adjusted colors and spacing",
      filePath: "app/globals.css",
    },
  ],
  checking: ["Rebuilt the preview and rechecked the overview flow"],
});

const supportFolder: FileTreeNode = {
  name: "support",
  kind: "folder",
  path: "components/support",
  children: [
    { name: "Sidebar.tsx", kind: "file", path: "components/support/Sidebar.tsx", language: "tsx" },
    { name: "TicketList.tsx", kind: "file", path: "components/support/TicketList.tsx", language: "tsx" },
    { name: "TicketRow.tsx", kind: "file", path: "components/support/TicketRow.tsx", language: "tsx" },
    { name: "QueueFilters.tsx", kind: "file", path: "components/support/QueueFilters.tsx", language: "tsx" },
  ],
};

const pmFolder: FileTreeNode = {
  name: "pm",
  kind: "folder",
  path: "components/pm",
  children: [
    { name: "Sidebar.tsx", kind: "file", path: "components/pm/Sidebar.tsx", language: "tsx" },
    { name: "Board.tsx", kind: "file", path: "components/pm/Board.tsx", language: "tsx" },
    { name: "TaskCard.tsx", kind: "file", path: "components/pm/TaskCard.tsx", language: "tsx" },
  ],
};

const financeFolder: FileTreeNode = {
  name: "finance",
  kind: "folder",
  path: "components/finance",
  children: [
    { name: "Sidebar.tsx", kind: "file", path: "components/finance/Sidebar.tsx", language: "tsx" },
    { name: "SummaryCards.tsx", kind: "file", path: "components/finance/SummaryCards.tsx", language: "tsx" },
    { name: "BudgetChart.tsx", kind: "file", path: "components/finance/BudgetChart.tsx", language: "tsx" },
    { name: "TransactionList.tsx", kind: "file", path: "components/finance/TransactionList.tsx", language: "tsx" },
  ],
};

const appFolder: FileTreeNode = {
  name: "app",
  kind: "folder",
  path: "app",
  children: [
    { name: "layout.tsx", kind: "file", path: "app/layout.tsx", language: "tsx" },
    { name: "globals.css", kind: "file", path: "app/globals.css", language: "css" },
    { name: "page.tsx", kind: "file", path: "app/page.tsx", language: "tsx" },
  ],
};

const libFolder: FileTreeNode = {
  name: "lib",
  kind: "folder",
  path: "lib",
  children: [],
};

const customerSupportTree: FileTreeNode[] = [
  appFolder,
  {
    name: "components",
    kind: "folder",
    path: "components",
    children: [
      { name: "CustomerPortal.tsx", kind: "file", path: "components/CustomerPortal.tsx", language: "tsx" },
      supportFolder,
    ],
  },
  { ...libFolder, children: [{ name: "support.ts", kind: "file", path: "lib/support.ts", language: "ts" }] },
  { name: "README.md", kind: "file", path: "README.md", language: "md" },
  { name: "package.json", kind: "file", path: "package.json", language: "json" },
];

const projectManagementTree: FileTreeNode[] = [
  appFolder,
  {
    name: "components",
    kind: "folder",
    path: "components",
    children: [
      { name: "Workspace.tsx", kind: "file", path: "components/Workspace.tsx", language: "tsx" },
      pmFolder,
    ],
  },
  { ...libFolder, children: [{ name: "projects.ts", kind: "file", path: "lib/projects.ts", language: "ts" }] },
  { name: "README.md", kind: "file", path: "README.md", language: "md" },
  { name: "package.json", kind: "file", path: "package.json", language: "json" },
];

const personalFinanceTree: FileTreeNode[] = [
  appFolder,
  {
    name: "components",
    kind: "folder",
    path: "components",
    children: [
      { name: "FinanceApp.tsx", kind: "file", path: "components/FinanceApp.tsx", language: "tsx" },
      financeFolder,
    ],
  },
  { ...libFolder, children: [{ name: "transactions.ts", kind: "file", path: "lib/transactions.ts", language: "ts" }] },
  { name: "README.md", kind: "file", path: "README.md", language: "md" },
  { name: "package.json", kind: "file", path: "package.json", language: "json" },
];

const customerSupportSamples: Record<string, string[]> = {
  "app/page.tsx": [
    'import { QueueFilters } from "@/components/support/QueueFilters";',
    'import { Sidebar } from "@/components/support/Sidebar";',
    'import { TicketList } from "@/components/support/TicketList";',
    'import { tickets } from "@/lib/support";',
    "",
    "export default function InboxPage() {",
    "  return (",
    '    <div className="inbox-layout">',
    "      <Sidebar />",
    '      <section className="inbox-content">',
    "        <QueueFilters />",
    "        <TicketList tickets={tickets} />",
    "      </section>",
    "    </div>",
    "  );",
    "}",
  ],
  "components/support/Sidebar.tsx": [
    'import { CheckCircle2, Inbox, LifeBuoy, Users } from "lucide-react";',
    "",
    "const links = [",
    '  { icon: Inbox, label: "Inbox", active: true },',
    '  { icon: Users, label: "Customers" },',
    '  { icon: CheckCircle2, label: "Resolved" },',
    '  { icon: LifeBuoy, label: "Help center" },',
    "];",
    "",
    "export function Sidebar() {",
    "  return (",
    '    <aside className="sidebar">',
    '      <div className="brand">deskflow</div>',
    "      <nav>",
    "        {links.map(({ icon: Icon, label, active }) => (",
    '          <a className={active ? "nav-link active" : "nav-link"} href="#" key={label}>',
    '            <Icon className="icon" />',
    "            {label}",
    "          </a>",
    "        ))}",
    "      </nav>",
    "    </aside>",
    "  );",
    "}",
  ],
  "components/support/TicketList.tsx": [
    'import type { Ticket } from "@/lib/support";',
    "",
    'const statusClass: Record<Ticket["status"], string> = {',
    '  resolved: "tag tag-green",',
    '  open: "tag tag-blue",',
    '  pending: "tag tag-amber",',
    "};",
    "",
    "export function TicketList({ tickets }: { tickets: Ticket[] }) {",
    "  return (",
    '    <div className="ticket-list">',
    "      {tickets.map((ticket) => (",
    '        <article className="ticket-row" key={ticket.id}>',
    '          <span className="avatar">{ticket.sender.slice(0, 2).toUpperCase()}</span>',
    '          <div className="ticket-meta">',
    "            <h3>{ticket.subject}</h3>",
    "            <p>{ticket.sender} · {ticket.updatedAt}</p>",
    "          </div>",
    '          <span className={statusClass[ticket.status]}>{ticket.status}</span>',
    "        </article>",
    "      ))}",
    "    </div>",
    "  );",
    "}",
  ],
  "components/support/TicketRow.tsx": [
    'import type { Ticket } from "@/lib/support";',
    "",
    "export function TicketRow({ ticket }: { ticket: Ticket }) {",
    "  return (",
    '    <article className="ticket-row">',
    '      <span className="avatar">{ticket.sender.slice(0, 2).toUpperCase()}</span>',
    '      <div className="ticket-meta">',
    "        <h3>{ticket.subject}</h3>",
    "        <p>{ticket.priority} priority</p>",
    "      </div>",
    "    </article>",
    "  );",
    "}",
  ],
  "components/support/QueueFilters.tsx": [
    'const priorities = ["All", "Critical", "High", "Medium", "Low"];',
    "",
    "export function QueueFilters() {",
    "  return (",
    '    <div className="queue-filters">',
    "      {priorities.map((priority) => (",
    '        <button className={priority === "All" ? "chip active" : "chip"} key={priority} type="button">',
    "          {priority}",
    "        </button>",
    "      ))}",
    "    </div>",
    "  );",
    "}",
  ],
  "components/CustomerPortal.tsx": [
    'import { Sidebar } from "./support/Sidebar";',
    'import { TicketList } from "./support/TicketList";',
    'import { tickets } from "@/lib/support";',
    "",
    "export function CustomerPortal() {",
    "  return (",
    "    <div>",
    "      <Sidebar />",
    "      <TicketList tickets={tickets} />",
    "    </div>",
    "  );",
    "}",
  ],
  "lib/support.ts": [
    "export type Ticket = {",
    "  id: string;",
    "  subject: string;",
    "  sender: string;",
    '  status: "open" | "pending" | "resolved";',
    '  priority: "low" | "medium" | "high" | "critical";',
    "  updatedAt: string;",
    "};",
    "",
    "export const tickets: Ticket[] = [",
    '  { id: "T-4821", subject: "Login flow broken for Safari users", sender: "mia@nimbus.io", status: "open", priority: "critical", updatedAt: "4m ago" },',
    '  { id: "T-4820", subject: "Billing page won\u2019t export invoices", sender: "leo@frameshift.co", status: "pending", priority: "high", updatedAt: "22m ago" },',
    '  { id: "T-4818", subject: "Email notifications not sending", sender: "ana@driftout.com", status: "open", priority: "high", updatedAt: "1h ago" },',
    '  { id: "T-4814", subject: "Refund request for account #2381", sender: "rudy@storemade.io", status: "resolved", priority: "medium", updatedAt: "3h ago" },',
    "];",
  ],
  "app/layout.tsx": [
    'import type { Metadata } from "next";',
    'import "./globals.css";',
    "",
    "export const metadata: Metadata = {",
    '  title: "Deskflow Support",',
    '  description: "Customer support done right.",',
    "};",
  ],
  "app/globals.css": [
    ":root {",
    "  color: #0f172a;",
    "  background: #ffffff;",
    "  --accent: #10b981;",
    "}",
    "",
    ".inbox-layout { display: grid; grid-template-columns: 220px 1fr; }",
    ".ticket-list { padding: 8px 16px; }",
    ".ticket-row { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }",
    ".tag-green { color: #059669; background: #d1fae5; }",
    ".tag-blue { color: #2563eb; background: #dbeafe; }",
    ".tag-amber { color: #b45309; background: #fef3c7; }",
    "",
    "@media (max-width: 720px) { .inbox-layout { grid-template-columns: 1fr; } .sidebar { display: none; } }",
  ],
  "package.json": [
    "{",
    '  "name": "deskflow",',
    '  "version": "0.1.0",',
    '  "private": true,',
    '  "scripts": {',
    '    "dev": "next dev",',
    '    "build": "next build",',
    '    "lint": "next lint"',
    "  },",
    '  "dependencies": { "next": "14.2.5", "react": "^18.3.1", "react-dom": "^18.3.1" }',
    "}",
  ],
  "README.md": [
    "# deskflow",
    "",
    "A customer support inbox generated by Architect.",
    "",
    "## Stack",
    "- Next.js 14",
    "- React 18",
    "- Tailwind CSS",
  ],
};

const projectManagementSamples: Record<string, string[]> = {
  "app/page.tsx": [
    'import { Board } from "@/components/pm/Board";',
    'import { Sidebar } from "@/components/pm/Sidebar";',
    'import { columns } from "@/lib/projects";',
    "",
    "export default function BoardPage() {",
    "  return (",
    '    <div className="board-layout">',
    "      <Sidebar />",
    '      <main className="board-main">',
    "        <header>Sprint 14 · Mobile release</header>",
    "        <Board columns={columns} />",
    "      </main>",
    "    </div>",
    "  );",
    "}",
  ],
  "components/pm/Sidebar.tsx": [
    'import { CalendarClock, LayoutDashboard, GitBranch, Users } from "lucide-react";',
    "",
    "const links = [",
    '  { icon: LayoutDashboard, label: "Projects", active: true },',
    '  { icon: GitBranch, label: "Roadmap" },',
    '  { icon: CalendarClock, label: "Sprints" },',
    '  { icon: Users, label: "Team" },',
    "];",
    "",
    "export function Sidebar() {",
    "  return (",
    '    <aside className="sidebar">',
    '      <div className="brand">sprintboard</div>',
    "      <nav>",
    "        {links.map(({ icon: Icon, label, active }) => (",
    '          <a className={active ? "nav-link active" : "nav-link"} href="#" key={label}>',
    '            <Icon className="icon" />',
    "            {label}",
    "          </a>",
    "        ))}",
    "      </nav>",
    "    </aside>",
    "  );",
    "}",
  ],
  "components/pm/Board.tsx": [
    'import { TaskCard } from "./TaskCard";',
    'import type { Column } from "@/lib/projects";',
    "",
    "export function Board({ columns }: { columns: Column[] }) {",
    "  return (",
    '    <div className="board-columns">',
    "      {columns.map((column) => (",
    '        <section className="board-column" key={column.id}>',
    '          <h2>{column.title} <span>{column.tasks.length}</span></h2>',
    "          {column.tasks.map((task) => <TaskCard key={task.id} task={task} />)}",
    "        </section>",
    "      ))}",
    "    </div>",
    "  );",
    "}",
  ],
  "components/pm/TaskCard.tsx": [
    'import type { Task } from "@/lib/projects";',
    "",
    'const dot: Record<Task["priority"], string> = { high: "#ef4444", medium: "#f59e0b", low: "#10b981" };',
    "",
    "export function TaskCard({ task }: { task: Task }) {",
    "  return (",
    '    <article className="task-card">',
    '      <span className="task-dot" style={{ background: dot[task.priority] }} key={task.id} />',
    "      <h3>{task.title}</h3>",
    '      <p>#{task.id} · {task.assignee}</p>',
    "    </article>",
    "  );",
    "}",
  ],
  "components/Workspace.tsx": [
    'import { Board } from "./pm/Board";',
    'import { columns } from "@/lib/projects";',
    "",
    "export function Workspace() {",
    "  return <Board columns={columns} />;",
    "}",
  ],
  "lib/projects.ts": [
    "export type Task = {",
    "  id: string;",
    "  title: string;",
    "  assignee: string;",
    '  priority: "low" | "medium" | "high";',
    "};",
    "",
    "export type Column = {",
    "  id: string;",
    "  title: string;",
    "  tasks: Task[];",
    "};",
    "",
    "export const columns: Column[] = [",
    '  { id: "todo", title: "Backlog", tasks: [',
    '    { id: "PM-104", title: "Empty state illustrations", assignee: "Maya", priority: "low" },',
    '    { id: "PM-103", title: "Onboarding checklist", assignee: "Ravi", priority: "medium" },',
    "  ]},",
    '  { id: "doing", title: "In progress", tasks: [',
    '    { id: "PM-98", title: "Task drag & drop", assignee: "Sofia", priority: "high" },',
    '    { id: "PM-96", title: "Board filters", assignee: "Leo", priority: "medium" },',
    "  ]},",
    '  { id: "done", title: "Done", tasks: [',
    '    { id: "PM-89", title: "Sprint report export", assignee: "Maya", priority: "medium" },',
    "  ]},",
    "];",
  ],
  "app/layout.tsx": [
    'import type { Metadata } from "next";',
    'import "./globals.css";',
    "",
    "export const metadata: Metadata = {",
    '  title: "Sprintboard",',
    '  description: "Ship faster with better visibility.",',
    "};",
  ],
  "app/globals.css": [
    ":root {",
    "  color: #0f172a;",
    "  background: #ffffff;",
    "  --accent: #8b5cf6;",
    "}",
    "",
    ".board-layout { display: grid; grid-template-columns: 220px 1fr; }",
    ".board-columns { display: grid; grid-template-columns: repeat(3, minmax(220px, 1fr)); gap: 14px; padding: 16px; }",
    ".board-column { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px; }",
    ".task-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin-top: 8px; }",
    "",
    "@media (max-width: 820px) { .board-columns { grid-template-columns: 1fr; } }",
  ],
  "package.json": [
    "{",
    '  "name": "sprintboard",',
    '  "version": "0.1.0",',
    '  "private": true,',
    '  "scripts": {',
    '    "dev": "next dev",',
    '    "build": "next build",',
    '    "lint": "next lint"',
    "  },",
    '  "dependencies": { "next": "14.2.5", "react": "^18.3.1", "react-dom": "^18.3.1" }',
    "}",
  ],
  "README.md": [
    "# sprintboard",
    "",
    "A kanban project board generated by Architect.",
    "",
    "## Stack",
    "- Next.js 14",
    "- React 18",
    "- Tailwind CSS",
  ],
};

const personalFinanceSamples: Record<string, string[]> = {
  "app/page.tsx": [
    'import { BudgetChart } from "@/components/finance/BudgetChart";',
    'import { Sidebar } from "@/components/finance/Sidebar";',
    'import { SummaryCards } from "@/components/finance/SummaryCards";',
    'import { TransactionList } from "@/components/finance/TransactionList";',
    'import { transactions } from "@/lib/transactions";',
    "",
    "export default function OverviewPage() {",
    "  return (",
    '    <div className="finance-layout">',
    "      <Sidebar />",
    '      <main className="finance-main">',
    "        <SummaryCards />",
    '        <div className="finance-grid">',
    "          <BudgetChart />",
    "          <TransactionList transactions={transactions} />",
    "        </div>",
    "      </main>",
    "    </div>",
    "  );",
    "}",
  ],
  "components/finance/Sidebar.tsx": [
    'import { Landmark, PieChart, ReceiptText, Wallet } from "lucide-react";',
    "",
    "const links = [",
    '  { icon: Wallet, label: "Overview", active: true },',
    '  { icon: ReceiptText, label: "Transactions" },',
    '  { icon: PieChart, label: "Budgets" },',
    '  { icon: Landmark, label: "Accounts" },',
    "];",
    "",
    "export function Sidebar() {",
    "  return (",
    '    <aside className="sidebar">',
    '      <div className="brand">ledger</div>',
    "      <nav>",
    "        {links.map(({ icon: Icon, label, active }) => (",
    '          <a className={active ? "nav-link active" : "nav-link"} href="#" key={label}>',
    '            <Icon className="icon" />',
    "            {label}",
    "          </a>",
    "        ))}",
    "      </nav>",
    "    </aside>",
    "  );",
    "}",
  ],
  "components/finance/SummaryCards.tsx": [
    "const cards = [",
    '  { title: "Checking", value: "$4,821.40", change: "+2.1%", color: "#6366f1" },',
    '  { title: "Savings", value: "$12,650.00", change: "+0.4%", color: "#10b981" },',
    '  { title: "Credit card", value: "$1,204.65", change: "-1.2%", color: "#f59e0b" },',
    "];",
    "",
    "export function SummaryCards() {",
    "  return (",
    '    <div className="summary-cards">',
    "      {cards.map((card) => (",
    '        <article className="summary-card" key={card.title}>',
    "          <h2>{card.title}</h2>",
    "          <p>{card.value}</p>",
    "          <span>{card.change} this month</span>",
    "        </article>",
    "      ))}",
    "    </div>",
    "  );",
    "}",
  ],
  "components/finance/BudgetChart.tsx": [
    "const budget = [",
    '  { name: "Housing", percent: 32, color: "#6366f1" },',
    '  { name: "Food", percent: 18, color: "#10b981" },',
    '  { name: "Transport", percent: 11, color: "#f59e0b" },',
    '  { name: "Other", percent: 9, color: "#e2e8f0" },',
    "];",
    "",
    "export function BudgetChart() {",
    "  return (",
    '    <section className="budget-card">',
    "      <h2>Spending by category</h2>",
    "      {budget.map((entry) => (",
    '        <div className="budget-row" key={entry.name}>',
    "          <span>{entry.name}</span>",
    '          <div className="budget-track">',
    '            <span style={{ width: `${entry.percent}%`, background: entry.color }} />',
    "          </div>",
    "          <strong>{entry.percent}%</strong>",
    "        </div>",
    "      ))}",
    "    </section>",
    "  );",
    "}",
  ],
  "components/finance/TransactionList.tsx": [
    'import type { Transaction } from "@/lib/transactions";',
    "",
    "export function TransactionList({ transactions }: { transactions: Transaction[] }) {",
    "  return (",
    '    <section className="transactions-card">',
    "      <h2>Recent activity</h2>",
    "      {transactions.map((tx) => (",
    '        <div className="txn-row" key={tx.id}>',
    '          <span className="txn-icon">{tx.merchant.slice(0, 1)}</span>',
    '          <div className="txn-meta"><p>{tx.merchant}</p><span>{tx.date}</span></div>',
    '          <strong className={tx.amount.startsWith("+") ? "in" : "out"}>{tx.amount}</strong>',
    "        </div>",
    "      ))}",
    "    </section>",
    "  );",
    "}",
  ],
  "components/FinanceApp.tsx": [
    'import { SummaryCards } from "./finance/SummaryCards";',
    'import { BudgetChart } from "./finance/BudgetChart";',
    "",
    "export function FinanceApp() {",
    "  return (",
    "    <div>",
    "      <SummaryCards />",
    "      <BudgetChart />",
    "    </div>",
    "  );",
    "}",
  ],
  "lib/transactions.ts": [
    "export type Transaction = {",
    "  id: string;",
    "  merchant: string;",
    "  date: string;",
    "  amount: string;",
    "};",
    "",
    "export const transactions: Transaction[] = [",
    '  { id: "T-1", merchant: "Whole Foods", date: "Today", amount: "-$84.20" },',
    '  { id: "T-2", merchant: "Paycheck deposit", date: "Yesterday", amount: "+$3,400.00" },',
    '  { id: "T-3", merchant: "Uber", date: "Yesterday", amount: "-$18.45" },',
    '  { id: "T-4", merchant: "Spotify", date: "Sep 20", amount: "-$10.99" },',
    "];",
  ],
  "app/layout.tsx": [
    'import type { Metadata } from "next";',
    'import "./globals.css";',
    "",
    "export const metadata: Metadata = {",
    '  title: "Ledger Finance",',
    '  description: "Your money, made clear.",',
    "};",
  ],
  "app/globals.css": [
    ":root {",
    "  color: #0f172a;",
    "  background: #ffffff;",
    "  --accent: #6366f1;",
    "}",
    "",
    ".finance-layout { display: grid; grid-template-columns: 220px 1fr; }",
    ".summary-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; padding: 16px; }",
    ".summary-card { border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; }",
    ".budget-track { background: #f1f5f9; height: 8px; border-radius: 999px; }",
    ".txn-row { display: flex; align-items: center; gap: 10px; padding: 8px 0; border-bottom: 1px solid #f1f5f9; }",
    ".txn-meta { flex: 1; } .in { color: #059669; } .out { color: #dc2626; }",
    "",
    "@media (max-width: 720px) { .finance-layout { grid-template-columns: 1fr; } .sidebar { display: none; } }",
  ],
  "package.json": [
    "{",
    '  "name": "ledger-app",',
    '  "version": "0.1.0",',
    '  "private": true,',
    '  "scripts": {',
    '    "dev": "next dev",',
    '    "build": "next build",',
    '    "lint": "next lint"',
    "  },",
    '  "dependencies": { "next": "14.2.5", "react": "^18.3.1", "react-dom": "^18.3.1" }',
    "}",
  ],
  "README.md": [
    "# ledger",
    "",
    "A personal finance tracker generated by Architect.",
    "",
    "## Stack",
    "- Next.js 14",
    "- React 18",
    "- Tailwind CSS",
  ],
};

export const scenarios: BuildScenario[] = [
  {
    id: "saas-analytics",
    name: "SaaS Analytics",
    prompt: "Build a clean SaaS analytics dashboard for a modern startup.",
    tagline: "Revenue, traffic, and customer analytics in one dashboard.",
    keywords: ["analytics", "analytic", "saas", "kpi", "revenue", "dashboard", "startup"],
    packageName: "northstar-analytics",
    previewUrl: "https://saas-analytics.architect-demo.app",
    initialRecipe,
    iterationRecipe,
    codeSamples: analyticsCodeSamples,
    fileTree: developerFileTree,
  },
  {
    id: "customer-support",
    name: "Customer Support",
    prompt: "Build a customer support dashboard for a modern SaaS company.",
    tagline: "Ticket inbox, filters, and queue visibility for support teams.",
    keywords: ["support", "customer service", "helpdesk", "help desk", "ticket", "inbox", "queue", "zendesk"],
    packageName: "deskflow",
    previewUrl: "https://support.architect-demo.app",
    initialRecipe: customerSupportInitial,
    iterationRecipe: customerSupportIteration,
    codeSamples: customerSupportSamples,
    fileTree: customerSupportTree,
  },
  {
    id: "project-management",
    name: "Project Management",
    prompt: "Build a project management app for a small engineering team.",
    tagline: "Kanban board, tasks, and sprints for small teams.",
    keywords: ["project management", "project", "kanban board", "kanban", "sprint", "tasks", "task", "engineering", "roadmap"],
    packageName: "sprintboard",
    previewUrl: "https://project.architect-demo.app",
    initialRecipe: projectManagementInitial,
    iterationRecipe: projectManagementIteration,
    codeSamples: projectManagementSamples,
    fileTree: projectManagementTree,
  },
  {
    id: "personal-finance",
    name: "Personal Finance",
    prompt: "Build a personal finance tracker to manage my monthly budget.",
    tagline: "Balances, budgets, and transaction activity at a glance.",
    keywords: ["personal finance", "finance", "money", "budget", "expense", "expenses", "spending", "wealth", "saving", "tracker"],
    packageName: "ledger-app",
    previewUrl: "https://finance.architect-demo.app",
    initialRecipe: personalFinanceInitial,
    iterationRecipe: personalFinanceIteration,
    codeSamples: personalFinanceSamples,
    fileTree: personalFinanceTree,
  },
];

export function scenarioById(id: ScenarioId): BuildScenario {
  const scenario = scenarios.find((entry) => entry.id === id);
  return scenario ?? scenarios[0];
}

export function resolveScenario(prompt: string): BuildScenario {
  const normalized = prompt.trim().toLowerCase();
  const ordered: BuildScenario[] = [scenarios[1], scenarios[2], scenarios[3], scenarios[0]];
  for (const scenario of ordered) {
    if (scenario && scenario.keywords.some((keyword) => normalized.includes(keyword))) {
      return scenario;
    }
  }
  return scenarios[0];
}

export function changeSummary(prompt: string): string {
  const text = prompt.trim().toLowerCase();
  if (/(date ?range|filters?|filter by)/.test(text)) return "Added date-range filtering; the views now respect the selected period.";
  if (/(chart|graph|plot|visuali[sz]ation)/.test(text)) return "Refreshed the charts with the latest data and a cleaner layout.";
  if (/(dark ?mode|light ?mode|theme|colors?)/.test(text)) return "Adjusted the visual theme, colors, and spacing.";
  if (/(sidebar|navigation|menu|tabs)/.test(text)) return "Reorganized the main navigation for faster access.";
  if (/(mobile|responsive|tablet|small screens)/.test(text)) return "Improved responsive behavior on smaller screens.";
  if (/(export|download|print)/.test(text)) return "Added an export action to the primary view.";
  if (/(remove|delete|drop|clean|declutter)/.test(text)) return "Simplified the layout and removed visual clutter.";
  if (/(sort|order|priority|status)/.test(text)) return "Added sorting and status controls to the main view.";
  if (/^(add|create|build|include|new)\b/.test(text)) return "Added the requested section to the app.";
  return "Updated the application based on your latest instruction.";
}

export function initialChangesFor(scenario: BuildScenario): GitChange[] {
  const files = getRecipeFiles(scenario.initialRecipe);
  return files.map((file, index) => ({
    file,
    state: (index === files.length - 1 ? "A" : "M") as GitChange["state"],
    staged: index === files.length - 1 || index === files.length - 2,
  }));
}

export function historyFor(scenario: BuildScenario): GitCommit[] {
  return [
    { hash: "a81d3f2", message: `Add ${scenario.name}`, time: "2 minutes ago", author: "Abhay Sharma" },
    { hash: "7ce21ab", message: "Create application shell", time: "18 minutes ago", author: "Abhay Sharma" },
    { hash: "9f0a1bd", message: `Scaffold ${scenario.packageName}`, time: "1 day ago", author: "Abhay Sharma" },
  ];
}

export type VersionSummary = {
  version: string;
  label: string;
  summary: string;
  prompt?: string;
};

export function seedVersionsFor(scenario: BuildScenario): VersionSummary[] {
  return [
    {
      version: "v1",
      label: `Scaffold ${scenario.name}`,
      summary: `Created the ${scenario.name} app shell and core layout.`,
    },
    {
      version: "v2",
      label: `Add ${scenario.name} views`,
      summary: `Wired the primary ${scenario.name} screens and data.`,
    },
    {
      version: "v3",
      label: "Updated visual style",
      summary: "Refreshed the visual style and spacing.",
    },
  ];
}

export function terminalBootFor(packageName: string): TerminalLine[] {
  return [
    { text: "npm run dev", tone: "prompt" },
    { text: `> ${packageName}@0.1.0 dev`, tone: "muted" },
    { text: "> next dev", tone: "muted" },
    { text: "  ▲ Next.js 14.2.5", tone: "plain" },
    { text: "  - Local:        http://localhost:3000", tone: "plain" },
    { text: "  ✓ Ready in 1.8s", tone: "success" },
    { text: "Showing simulated session · prototype mode", tone: "warn" },
  ];
}

export const PROJECT_CONTEXT_KEY = "architect-demo-project";

export type ProjectContext = {
  scenarioId: ScenarioId;
  name: string;
  packageName: string;
  previewUrl: string;
};

const DEFAULT_CONTEXT: ProjectContext = {
  scenarioId: "saas-analytics",
  name: scenarios[0].name,
  packageName: scenarios[0].packageName,
  previewUrl: scenarios[0].previewUrl,
};

export function readProjectContext(): ProjectContext {
  if (typeof window === "undefined") return DEFAULT_CONTEXT;
  try {
    const raw = window.localStorage.getItem(PROJECT_CONTEXT_KEY);
    if (!raw) return DEFAULT_CONTEXT;
    const parsed = JSON.parse(raw) as Partial<ProjectContext> | null;
    const scenario = scenarioById(parsed?.scenarioId ?? "saas-analytics");
    return {
      scenarioId: scenario.id,
      name: scenario.name,
      packageName: scenario.packageName,
      previewUrl: scenario.previewUrl,
    };
  } catch {
    return DEFAULT_CONTEXT;
  }
}

export function writeProjectContext(context: ProjectContext): void {
  try {
    window.localStorage.setItem(PROJECT_CONTEXT_KEY, JSON.stringify(context));
  } catch {
    // Ignore storage failures in private browsing modes.
  }
}