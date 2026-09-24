import { FileCode2, PanelLeft } from "lucide-react";

const snippets: Record<string, string[]> = {
  "app/page.tsx": [
    'import { Overview } from "@/components/Overview";',
    "",
    "export default function HomePage() {",
    "  return (",
    '    <main className="dashboard-shell">',
    "      <Overview />",
    "    </main>",
    "  );",
    "}",
  ],
  "components/Overview.tsx": [
    'import { KpiCard } from "@/components/dashboard/KpiCard";',
    'import { RevenueChart } from "@/components/dashboard/RevenueChart";',
    "import { analytics } from \"@/lib/analytics\";",
    "",
    "export function Overview() {",
    "  return (",
    "    <>",
    "      <section className=\"kpi-grid\">",
    "        <KpiCard title=\"Total revenue\" value={analytics.revenue} />",
    '        <KpiCard title="Active customers" value={analytics.activeCustomers} />',
    "      </section>",
    "      <RevenueChart data={analytics.revenueSeries} />",
    "    </>",
    "  );",
    "}",
  ],
  "components/dashboard/Sidebar.tsx": [
    'import { Home, Transactions, Users } from "lucide-react";',
    "",
    "const links = [",
    '  { icon: Home, label: "Overview", active: true },',
    '  { icon: Transactions, label: "Transactions" },',
    '  { icon: Users, label: "Customers" },',
    "];",
    "",
    "export function Sidebar() {",
    "  return (",
    "    <nav className=\"sidebar\">",
    "      {links.map(({ icon: Icon, label, active }) => (",
    "        <div key={label} className={active ? \"nav-link active\" : \"nav-link\"}>",
    "          <Icon className=\"w-4\" /> {label}",
    "        </div>",
    "      ))}",
    "    </nav>",
    "  );",
    "}",
  ],
  "components/dashboard/KpiCard.tsx": [
    'import { ArrowUpRight } from "lucide-react";',
    "",
    "type KpiCardProps = {",
    "  title: string;",
    "  value: number | string;",
    "};",
    "",
    "export function KpiCard({ title, value }: KpiCardProps) {",
    "  return (",
    "    <article className=\"kpi-card\">",
    '      <p>{title}</p>',
    '      <p className="kpi-value">{value}</p>',
    '      <p className="kpi-delta">+8.2% vs last month</p>',
    "    </article>",
    "  );",
    "}",
  ],
  "components/dashboard/RevenueChart.tsx": [
    "import { analytics } from \"@/lib/analytics\";",
    "",
    "type RevenueChartProps = { data: number[] };",
    "",
    "export function RevenueChart({ data }: RevenueChartProps) {",
    "  const max = Math.max(...data);",
    "  return (",
    "    <figure className=\"revenue-chart\">",
    "      <svg viewBox=\"0 0 600 120\" aria-label=\"Revenue over time\">",
    "        <polyline",
    "          points={data.map((v, i) => `${(i / (data.length - 1)) * 600},${120 - (v / max) * 100}`).join(\" \")}",
    '          fill="none" stroke="var(--accent)" strokeWidth="2"',
    "        />",
    "      </svg>",
    "    </figure>",
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
    '  title: "Northstar Analytics",',
    '  description: "Your business, at a glance.",',
    "};",
    "",
    "export default function RootLayout({ children }) {",
    "  return <html lang=\"en\"><body>{children}</body></html>;",
    "}",
  ],
  "app/globals.css": [
    ":root {", "  color: #0f172a;", "  background: #ffffff;", "}", "", ".dashboard-shell {", "  min-height: 100vh;", "  display: grid;", "  grid-template-columns: 220px 1fr;", "}", "", "@media (max-width: 720px) {", "  .dashboard-shell { grid-template-columns: 1fr; }", "}",
  ],
  "package.json": [
    "{",
    '  "name": "northstar-analytics",',
    '  "version": "0.1.0",',
    '  "private": true,',
    '  "dependencies": {',
    '    "lucide-react": "^0.469.0",',
    '    "next": "14.2.5",',
    '    "react": "^18.3.1"',
    "  }",
    "}",
  ],
};

const languageLabels: Record<string, string> = {
  tsx: "TSX",
  ts: "TS",
  css: "CSS",
  json: "JSON",
  md: "MD",
  js: "JS",
  jsx: "JSX",
};

function languageFor(path: string): string {
  const extension = path.split(".").pop()?.toLowerCase() ?? "";
  return languageLabels[extension] ?? "CODE";
}

type CodeSurfaceProps = {
  selectedFile: string;
  modifiedFiles?: ReadonlySet<string>;
};

export function CodeSurface({ selectedFile, modifiedFiles }: CodeSurfaceProps) {
  const filePath = selectedFile || "app/page.tsx";
  const lines = snippets[filePath] ?? [
    `// ${filePath}`,
    "// Sample project file shown in the prototype explorer.",
    "",
    "export const analytics = {",
    '  period: "last-30-days",',
    "  revenue: 48294,",
    "  activeCustomers: 2847,",
    "};",
  ];
  const modified = modifiedFiles?.has(filePath) ?? false;

  return (
    <section className="flex h-full min-h-[420px] max-h-none flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#0c1018]" aria-label="Code preview">
      <div className="flex h-10 shrink-0 items-center justify-between gap-2 border-b border-white/[0.07] px-3">
        <div className="flex min-w-0 items-center gap-2 text-[10px] text-slate-400">
          <PanelLeft className="h-3.5 w-3.5 text-slate-600" />
          <span className="truncate">{filePath}</span>
          {modified && (
            <span className="flex shrink-0 items-center gap-1 rounded border border-emerald-400/25 bg-emerald-400/10 px-1.5 py-0.5 text-[8px] text-emerald-300">
              <span className="h-1 w-1 rounded-full bg-emerald-400" />
              Updated
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <span className="rounded border border-white/[0.07] px-1.5 py-0.5 text-[8px] text-slate-600">{languageFor(filePath)}</span>
          <span className="rounded border border-white/[0.07] px-1.5 py-0.5 text-[8px] text-slate-600">Read only</span>
        </div>
      </div>
      <div className="workspace-scrollbar flex-1 overflow-auto py-3 font-mono text-[11px] leading-[22px]">
        {lines.map((line, index) => (
          <div key={`${index}-${line}`} className="flex min-w-max px-4 hover:bg-white/[0.025]">
            <span className={`mr-5 inline-block w-5 select-none text-right ${modified ? "text-emerald-400/40" : "text-slate-700"}`}>{index + 1}</span>
            <code className="text-slate-300"><span className={line.trim().startsWith("//") ? "text-slate-600" : line.includes("import") || line.includes("export") ? "text-violet-300" : "text-slate-300"}>{line || " "}</span></code>
          </div>
        ))}
        <div className="mt-5 flex items-center gap-2 border-t border-white/[0.06] px-4 pt-3 text-[9px] text-slate-600">
          <FileCode2 className="h-3 w-3" /> Read-only sample · Editing is not enabled in this phase
        </div>
      </div>
    </section>
  );
}

export function TerminalSurface() {
  const output = [
    { prompt: "$ npm run dev", result: "", color: "text-emerald-300" },
    { prompt: "", result: "> northstar-analytics@0.1.0 dev", color: "text-slate-400" },
    { prompt: "", result: "> next dev", color: "text-slate-400" },
    { prompt: "", result: "  ▲ Next.js 14.2.5", color: "text-slate-300" },
    { prompt: "", result: "  - Local:        http://localhost:3000", color: "text-slate-400" },
    { prompt: "", result: "  ✓ Ready in 1.2s", color: "text-emerald-300" },
  ];
  return (
    <section className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-lg border border-white/[0.08] bg-[#0c1018]" aria-label="Terminal preview">
      <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/[0.07] px-3">
        <span className="text-[10px] font-medium text-slate-400">Terminal <span className="ml-1 text-slate-600">— zsh</span></span>
        <span className="flex items-center gap-1.5 text-[9px] text-slate-600"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />Mock session</span>
      </div>
      <div className="workspace-scrollbar flex-1 overflow-auto p-4 font-mono text-[11px] leading-6">
        {output.map((line, index) => <div className={line.color} key={index}>{line.prompt || line.result}</div>)}
        <div className="mt-4 border-t border-white/[0.06] pt-3 text-[9px] leading-5 text-slate-600">Terminal output is static sample content. Shell commands are not executed.</div>
        <div className="mt-3 flex items-center gap-2 text-emerald-300"><span>$</span><span className="h-3.5 w-px animate-pulse bg-emerald-300" /></div>
      </div>
    </section>
  );
}