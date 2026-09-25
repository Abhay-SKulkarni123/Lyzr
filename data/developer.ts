export type FileTreeNode = {
  name: string;
  kind: "file" | "folder";
  path: string;
  language?: string;
  children?: FileTreeNode[];
};

export const developerFileTree: FileTreeNode[] = [
  {
    name: "app",
    kind: "folder",
    path: "app",
    children: [
      { name: "layout.tsx", kind: "file", path: "app/layout.tsx", language: "tsx" },
      { name: "globals.css", kind: "file", path: "app/globals.css", language: "css" },
      { name: "page.tsx", kind: "file", path: "app/page.tsx", language: "tsx" },
    ],
  },
  {
    name: "components",
    kind: "folder",
    path: "components",
    children: [
      { name: "Dashboard.tsx", kind: "file", path: "components/Dashboard.tsx", language: "tsx" },
      {
        name: "dashboard",
        kind: "folder",
        path: "components/dashboard",
        children: [
          { name: "Sidebar.tsx", kind: "file", path: "components/dashboard/Sidebar.tsx", language: "tsx" },
          { name: "KpiCard.tsx", kind: "file", path: "components/dashboard/KpiCard.tsx", language: "tsx" },
          { name: "RevenueChart.tsx", kind: "file", path: "components/dashboard/RevenueChart.tsx", language: "tsx" },
          { name: "Analytics.tsx", kind: "file", path: "components/dashboard/Analytics.tsx", language: "tsx" },
        ],
      },
    ],
  },
  {
    name: "lib",
    kind: "folder",
    path: "lib",
    children: [{ name: "analytics.ts", kind: "file", path: "lib/analytics.ts", language: "ts" }],
  },
  { name: "README.md", kind: "file", path: "README.md", language: "md" },
  { name: "package.json", kind: "file", path: "package.json", language: "json" },
];

export function flattenTree(nodes: FileTreeNode[]): FileTreeNode[] {
  const out: FileTreeNode[] = [];
  nodes.forEach((node) => {
    out.push(node);
    if (node.children) out.push(...flattenTree(node.children));
  });
  return out;
}

export function filePaths(nodes: FileTreeNode[]): string[] {
  return flattenTree(nodes)
    .filter((node) => node.kind === "file")
    .map((node) => node.path);
}

export const codeSamples: Record<string, string[]> = {
  "app/page.tsx": [
    'import { Dashboard } from "@/components/Dashboard";',
    "",
    "export default function HomePage() {",
    "  return (",
    '    <main className="dashboard-shell">',
    "      <Dashboard />",
    "    </main>",
    "  );",
    "}",
  ],
  "components/Dashboard.tsx": [
    'import { Sidebar } from "./dashboard/Sidebar";',
    'import { KpiCard } from "./dashboard/KpiCard";',
    'import { RevenueChart } from "./dashboard/RevenueChart";',
    'import { Analytics } from "./dashboard/Analytics";',
    'import { analytics } from "@/lib/analytics";',
    "",
    "export function Dashboard() {",
    "  return (",
    '    <div className="dashboard-layout">',
    "      <Sidebar />",
    '      <section className="dashboard-content">',
    '        <header className="dashboard-header">',
    "          <div>",
    "            <p>September 25, 2026</p>",
    "            <h1>Good morning, Jordan</h1>",
    "          </div>",
    '          <button>Export report</button>',
    "        </header>",
    '        <div className="kpi-grid">',
    '          <KpiCard title="Total revenue" value={analytics.revenue} delta="+12.8%" />',
    '          <KpiCard title="Active customers" value={analytics.activeCustomers} delta="+8.2%" />',
    '          <KpiCard title="Conversion rate" value={analytics.conversionRate} delta="−0.4%" />',
    "        </div>",
    '        <div className="charts-row">',
    "          <RevenueChart series={analytics.revenueSeries} />",
    "          <Analytics />",
    "        </div>",
    "      </section>",
    "    </div>",
    "  );",
    "}",
  ],
  "components/dashboard/Sidebar.tsx": [
    'import { Home, CreditCard, Users, BarChart3 } from "lucide-react";',
    "",
    "const links = [",
    '  { icon: Home, label: "Overview", active: true },',
    '  { icon: CreditCard, label: "Transactions" },',
    '  { icon: Users, label: "Customers" },',
    '  { icon: BarChart3, label: "Reports" },',
    "];",
    "",
    "export function Sidebar() {",
    "  return (",
    '    <aside className="sidebar">',
    '      <div className="brand">northstar</div>',
    "      <nav>",
    "        {links.map(({ icon: Icon, label, active }) => (",
    '          <div key={label} className={active ? "nav-link active" : "nav-link"}>',
    '            <Icon className="icon" />',
    "            {label}",
    "          </div>",
    "        ))}",
    "      </nav>",
    "    </aside>",
    "  );",
    "}",
  ],
  "components/dashboard/KpiCard.tsx": [
    'import { ArrowUpRight, ArrowDownRight } from "lucide-react";',
    "",
    "type KpiCardProps = {",
    "  title: string;",
    "  value: number | string;",
    "  delta: string;",
    "};",
    "",
    "export function KpiCard({ title, value, delta }: KpiCardProps) {",
    '  const positive = !delta.startsWith("−");',
    "  return (",
    '    <article className="kpi-card">',
    '      <p className="kpi-title">{title}</p>',
    '      <p className="kpi-value">{value}</p>',
    '      <p className={`kpi-delta ${positive ? "up" : "down"}`}>',
    "        {positive ? <ArrowUpRight /> : <ArrowDownRight />} {delta} vs last month",
    "      </p>",
    "    </article>",
    "  );",
    "}",
  ],
  "components/dashboard/RevenueChart.tsx": [
    "type RevenueChartProps = {",
    "  series: number[];",
    "};",
    "",
    "export function RevenueChart({ series }: RevenueChartProps) {",
    "  const max = Math.max(...series);",
    "  const points = series",
    '    .map((value, index) => `${(index / (series.length - 1)) * 600},${120 - (value / max) * 100}`)',
    '    .join(" ");',
    "  return (",
    '    <figure className="revenue-chart">',
    "      <h2>Revenue over time</h2>",
    '      <svg viewBox="0 0 600 120" aria-label="Monthly revenue performance">',
    '        <polyline points={points} fill="none" stroke="var(--accent)" strokeWidth="2" />',
    "      </svg>",
    "    </figure>",
    "  );",
    "}",
  ],
  "components/dashboard/Analytics.tsx": [
    "const sources = [",
    '  { name: "Direct", percent: "42%", color: "indigo" },',
    '  { name: "Social", percent: "28%", color: "sky" },',
    '  { name: "Search", percent: "18%", color: "emerald" },',
    '  { name: "Other", percent: "12%", color: "slate" },',
    "];",
    "",
    "export function Analytics() {",
    "  return (",
    '    <div className="traffic-card">',
    "      <h2>Traffic sources</h2>",
    '      <div className="donut" aria-label="Shares of traffic by channel" />',
    "      <ul>",
    "        {sources.map((source) => (",
    "          <li key={source.name}>",
    '            <span className={`dot ${source.color}`} />',
    "            {source.name}",
    "            <strong>{source.percent}</strong>",
    "          </li>",
    "        ))}",
    "      </ul>",
    "    </div>",
    "  );",
    "}",
  ],
  "lib/analytics.ts": [
    "export const analytics = {",
    '  period: "last-30-days",',
    "  revenue: 48294,",
    "  activeCustomers: 2847,",
    "  conversionRate: 3.64,",
    "  revenueSeries: [820, 1410, 2140, 2860, 3590, 4940],",
    "};",
  ],
  "app/layout.tsx": [
    'import type { Metadata } from "next";',
    'import "./globals.css";',
    "",
    "export const metadata: Metadata = {",
    '  title: "SaaS Analytics",',
    '  description: "Your business, at a glance.",',
    "};",
    "",
    "export default function RootLayout({ children }) {",
    "  return (",
    '    <html lang="en">',
    "      <body>{children}</body>",
    "    </html>",
    "  );",
    "}",
  ],
  "app/globals.css": [
    ":root {",
    "  color: #0f172a;",
    "  background: #ffffff;",
    "  --accent: #6366f1;",
    "}",
    "",
    ".dashboard-shell { min-height: 100vh; }",
    ".dashboard-layout { display: grid; grid-template-columns: 220px 1fr; }",
    ".kpi-grid { display: grid; gap: 12px; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); }",
    ".revenue-chart svg { width: 100%; height: 120px; }",
    "",
    "@media (max-width: 720px) {",
    "  .dashboard-layout { grid-template-columns: 1fr; }",
    "  .sidebar { display: none; }",
    "}",
  ],
  "package.json": [
    "{",
    '  "name": "northstar-analytics",',
    '  "version": "0.1.0",',
    '  "private": true,',
    '  "scripts": {',
    '    "dev": "next dev",',
    '    "build": "next build",',
    '    "lint": "next lint"',
    "  },",
    '  "dependencies": {',
    '    "lucide-react": "^0.469.0",',
    '    "next": "14.2.5",',
    '    "react": "^18.3.1",',
    '    "react-dom": "^18.3.1"',
    "  }",
    "}",
  ],
  "README.md": [
    "# northstar-analytics",
    "",
    "A clean SaaS analytics dashboard generated by Architect.",
    "",
    "## Getting started",
    "",
    "    npm install",
    "    npm run dev",
    "",
    "## Stack",
    "",
    "- Next.js 14",
    "- React 18",
    "- Tailwind CSS",
    "- lucide-react",
  ],
};

export function fileLinesFor(path: string): string[] {
  return codeSamples[path] ?? [
    `// ${path}`,
    "// Sample project file shown in the prototype explorer.",
    "",
    "export const analytics = {",
    '  period: "last-30-days",',
    "  revenue: 48294,",
    "  activeCustomers: 2847,",
    "};",
  ];
}

export type CodeTone = "prompt" | "success" | "muted" | "warn" | "error" | "plain";

export type TerminalLine = { text: string; tone?: CodeTone };

export type TerminalCommand = {
  command: string;
  lines: TerminalLine[];
};

export const simulatedTerminalNote = "Command execution is simulated in prototype mode.";

export const terminalBoot: TerminalLine[] = [
  { text: "npm run dev", tone: "prompt" },
  { text: "> northstar-analytics@0.1.0 dev", tone: "muted" },
  { text: "> next dev", tone: "muted" },
  { text: "  ▲ Next.js 14.2.5", tone: "plain" },
  { text: "  - Local:        http://localhost:3000", tone: "plain" },
  { text: "  ✓ Ready in 1.8s", tone: "success" },
  { text: "Showing simulated session · prototype mode", tone: "warn" },
];

export const terminalCommands: TerminalCommand[] = [
  {
    command: "npm run dev",
    lines: [
      { text: "npm run dev", tone: "prompt" },
      { text: "> northstar-analytics@0.1.0 dev", tone: "muted" },
      { text: "> next dev", tone: "muted" },
      { text: "  ▲ Next.js 14.2.5", tone: "plain" },
      { text: "  - Local:        http://localhost:3000", tone: "plain" },
      { text: "  ✓ Ready in 1.8s", tone: "success" },
    ],
  },
  {
    command: "npm run build",
    lines: [
      { text: "npm run build", tone: "prompt" },
      { text: "> northstar-analytics@0.1.0 build", tone: "muted" },
      { text: "> next build", tone: "muted" },
      { text: "  ✓ Compiled successfully", tone: "success" },
      { text: "  ✓ Generating static pages (1/1)", tone: "success" },
      { text: "  ✓ Finalizing page optimization", tone: "success" },
    ],
  },
  {
    command: "npm run lint",
    lines: [
      { text: "npm run lint", tone: "prompt" },
      { text: "> northstar-analytics@0.1.0 lint", tone: "muted" },
      { text: "> next lint", tone: "muted" },
      { text: "  ✔ No ESLint warnings or errors", tone: "success" },
    ],
  },
  {
    command: "git status",
    lines: [
      { text: "git status", tone: "prompt" },
      { text: "On branch main", tone: "plain" },
      { text: "Changes not staged for commit:", tone: "muted" },
      { text: "  modified:   components/dashboard/KpiCard.tsx", tone: "plain" },
      { text: "  modified:   app/page.tsx", tone: "plain" },
      { text: "Untracked files:", tone: "muted" },
      { text: "  components/dashboard/Analytics.tsx", tone: "plain" },
    ],
  },
];

export const terminalSuggestions = ["npm run dev", "git status", "npm run build", "npm run lint"];

export type EnvVar = {
  name: string;
  configured: boolean;
  value?: string;
};

export const environmentVariables: EnvVar[] = [
  { name: "NEXT_PUBLIC_APP_URL", configured: true, value: "https://app.architect.local" },
  { name: "DATABASE_URL", configured: true, value: "postgres://app:mock@localhost:5432/northstar" },
  { name: "OPENAI_API_KEY", configured: false },
  { name: "NODE_ENV", configured: true, value: "development" },
];

export const envSimulatedNote = "Environment values are simulated in prototype mode.";

export type GitChangeState = "M" | "A" | "D";

export type GitChange = {
  file: string;
  state: GitChangeState;
  staged: boolean;
};

export const gitChanges: GitChange[] = [
  { file: "app/page.tsx", state: "M", staged: false },
  { file: "components/dashboard/KpiCard.tsx", state: "M", staged: true },
  { file: "components/dashboard/RevenueChart.tsx", state: "M", staged: false },
  { file: "components/dashboard/Sidebar.tsx", state: "M", staged: false },
  { file: "components/dashboard/Analytics.tsx", state: "A", staged: true },
];

export type GitCommit = {
  hash: string;
  message: string;
  time: string;
  author: string;
};

export const gitHistory: GitCommit[] = [
  { hash: "a81d3f2", message: "Add analytics dashboard", time: "2 minutes ago", author: "Abhay Sharma" },
  { hash: "7ce21ab", message: "Create dashboard shell", time: "18 minutes ago", author: "Abhay Sharma" },
  { hash: "9f0a1bd", message: "Scaffold northstar-analytics", time: "1 day ago", author: "Abhay Sharma" },
];

export const gitMockBranches = ["main", "feature/analytics", "release/1.0"];

export const gitSimulatedNote = "Source control is simulated in prototype mode.";

export type DevSetting = {
  label: string;
  value: string;
};

export const developerSettings: DevSetting[] = [
  { label: "Runtime", value: "Next.js" },
  { label: "Node.js", value: "20.11.0" },
  { label: "Package manager", value: "npm" },
  { label: "Environment", value: "Development" },
  { label: "Preview", value: "localhost:3000" },
  { label: "Build command", value: "npm run build" },
  { label: "TypeScript", value: "Strict mode" },
];

export function normalizeCommand(input: string): string {
  return input.trim().replace(/\s+/g, " ").toLowerCase();
}

export function findTerminalCommand(command: string): TerminalCommand | undefined {
  const normalized = normalizeCommand(command);
  return terminalCommands.find((entry) => normalizeCommand(entry.command) === normalized);
}

export function basename(path: string): string {
  const separator = path.lastIndexOf("/");
  return separator > -1 ? path.slice(separator + 1) : path;
}

export function dirname(path: string): string {
  const separator = path.lastIndexOf("/");
  return separator > -1 ? path.slice(0, separator + 1) : "";
}

export function languageOf(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase() ?? "";
  return ["tsx", "ts", "css", "json", "md", "js", "jsx"].includes(extension) ? extension : "txt";
}

export function languageLabel(language: string): string {
  const labels: Record<string, string> = {
    tsx: "TSX",
    ts: "TS",
    css: "CSS",
    json: "JSON",
    md: "MD",
    js: "JS",
    jsx: "JSX",
    txt: "TXT",
  };
  return labels[language] ?? "CODE";
}