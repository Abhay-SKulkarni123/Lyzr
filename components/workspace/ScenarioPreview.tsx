import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  CreditCard,
  Inbox,
  Landmark,
  LayoutDashboard,
  LifeBuoy,
  PieChart,
  ReceiptText,
  Search,
  Settings,
  Users,
  Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import type { ScenarioId } from "@/data/scenarios";
import { DashboardPreview } from "./DashboardPreview";

function PreviewChrome({ url, children }: { url: string; children: ReactNode }) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-300 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.18)]">
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-50 px-3">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-[#fb6d68]" />
          <span className="h-2 w-2 rounded-full bg-[#f6be4f]" />
          <span className="h-2 w-2 rounded-full bg-[#53c878]" />
        </div>
        <div className="mx-auto flex h-[22px] w-[min(55%,380px)] items-center justify-center gap-1.5 rounded border border-slate-200 bg-white text-[9px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> {url}
        </div>
        <div className="w-[38px]" />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden bg-white text-slate-900">{children}</div>
    </div>
  );
}

function PreviewSidebar({
  brand,
  links,
  accent,
}: {
  brand: string;
  links: { icon: typeof Inbox; label: string; active?: boolean }[];
  accent: string;
}) {
  return (
    <aside className="hidden w-[154px] shrink-0 flex-col border-r border-slate-200 bg-[#fbfcfe] sm:flex lg:w-[178px]">
      <div className="flex h-[58px] items-center gap-2 border-b border-slate-200 px-3.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
          <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-white" />
        </span>
        <span className="text-[12px] font-bold tracking-tight text-slate-900">{brand}</span>
      </div>
      <nav className="space-y-0.5 p-2.5" aria-label={`${brand} navigation`}>
        <p className="px-2 pb-1 pt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">Workspace</p>
        {links.map(({ icon: Icon, label, active }) => (
          <div
            key={label}
            className={`flex items-center gap-2 rounded-md px-2 py-2 text-[10px] ${active ? `font-semibold ${accent}` : "text-slate-500"}`}
          >
            <Icon className="h-3.5 w-3.5" />
            {label}
          </div>
        ))}
      </nav>
      <div className="mt-auto space-y-0.5 border-t border-slate-200 p-2.5">
        <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-slate-500">
          <Settings className="h-3.5 w-3.5" />
          Settings
        </div>
      </div>
    </aside>
  );
}

const tickets = [
  { initials: "MN", name: "Mia Nguyen", subject: "Login flow broken for Safari users", status: "Open", tone: "bg-indigo-50 text-indigo-700", priority: "Priority: Critical", priorityTone: "text-rose-500" },
  { initials: "LS", name: "Leo Sun", subject: "Billing page won’t export invoices", status: "Pending", tone: "bg-amber-50 text-amber-700", priority: "Priority: High", priorityTone: "text-orange-500" },
  { initials: "AD", name: "Ana Diaz", subject: "Email notifications not sending", status: "Open", tone: "bg-indigo-50 text-indigo-700", priority: "Priority: High", priorityTone: "text-orange-500" },
  { initials: "RW", name: "Rudy West", subject: "Refund request for account #2381", status: "Resolved", tone: "bg-emerald-50 text-emerald-700", priority: "Priority: Medium", priorityTone: "text-amber-500" },
];

function CustomerSupportPreview() {
  return (
    <PreviewChrome url="preview.architect.local/inbox">
      <PreviewSidebar
        accent="bg-emerald-50 text-emerald-700"
        brand="deskflow"
        links={[
          { icon: Inbox, label: "Inbox", active: true },
          { icon: Users, label: "Customers" },
          { icon: CheckCircle2, label: "Resolved" },
          { icon: LifeBuoy, label: "Help center" },
        ]}
      />
      <div className="preview-scrollbar min-w-0 flex-1 overflow-y-auto bg-white">
        <div className="mx-auto max-w-[760px] px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-slate-400">Support queues</p>
              <h1 className="mt-1 text-[17px] font-semibold tracking-tight text-slate-900 sm:text-[20px]">Inbox</h1>
              <p className="mt-1 text-[10px] text-slate-500">24 conversations · 9 need your reply.</p>
            </div>
            <button className="flex h-7 items-center gap-1.5 rounded-md border border-slate-200 px-2 text-[9px] font-medium text-slate-600 hover:bg-slate-50">
              <Search className="h-3 w-3" />
              Filter
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            {[
              { label: "Open", value: "9", dot: "bg-indigo-500" },
              { label: "Resolved", value: "147", dot: "bg-emerald-500" },
              { label: "Avg first response", value: "1m 42s", dot: "bg-sky-500" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg border border-slate-200 bg-white p-3">
                <div className="flex items-center gap-1.5">
                  <span className={`h-1.5 w-1.5 rounded-full ${item.dot}`} />
                  <p className="text-[9px] font-medium text-slate-500">{item.label}</p>
                </div>
                <p className="mt-1.5 text-[17px] font-semibold tracking-tight text-slate-900">{item.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-lg border border-slate-200 bg-white p-2">
            {tickets.map((ticket) => (
              <div key={ticket.subject} className="flex items-center gap-2.5 border-t border-slate-100 px-1.5 py-2.5 first:border-0">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${ticket.tone}`}>{ticket.initials}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[10px] font-medium text-slate-800">{ticket.subject}</p>
                  <p className="truncate text-[8px] text-slate-400">
                    {ticket.name} · <span className={`font-medium ${ticket.priorityTone}`}>{ticket.priority}</span>
                  </p>
                </div>
                <span className="rounded-full border border-slate-200 px-2 py-0.5 text-[8px] font-medium text-slate-600">{ticket.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PreviewChrome>
  );
}

const boardColumns = [
  { id: "backlog", title: "Backlog", tasks: [{ title: "Empty state illustrations", id: "PM-104", assignee: "Maya", color: "bg-slate-200 text-slate-600" }, { title: "Onboarding checklist", id: "PM-103", assignee: "Ravi", color: "bg-amber-100 text-amber-700" }] },
  { id: "in-progress", title: "In progress", tasks: [{ title: "Task drag & drop", id: "PM-98", assignee: "Sofia", color: "bg-emerald-100 text-emerald-700" }, { title: "Board filters", id: "PM-96", assignee: "Leo", color: "bg-sky-100 text-sky-700" }] },
  { id: "done", title: "Done", tasks: [{ title: "Sprint report export", id: "PM-89", assignee: "Maya", color: "bg-slate-200 text-slate-600" }] },
];

function ProjectManagementPreview() {
  return (
    <PreviewChrome url="preview.architect.local/board">
      <PreviewSidebar
        accent="bg-violet-50 text-violet-700"
        brand="sprintboard"
        links={[
          { icon: LayoutDashboard, label: "Projects", active: true },
          { icon: PieChart, label: "Roadmap" },
          { icon: CalendarClock, label: "Sprints" },
          { icon: Users, label: "Team" },
        ]}
      />
      <div className="preview-scrollbar min-w-0 flex-1 overflow-y-auto bg-[#fafbfc]">
        <div className="px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-slate-400">Engineering</p>
              <h1 className="mt-1 text-[17px] font-semibold tracking-tight text-slate-900 sm:text-[20px]">Sprint 14 · Mobile release</h1>
              <p className="mt-1 text-[10px] text-slate-500">3-day sprint · 12 of 18 points complete.</p>
            </div>
            <button className="flex h-7 items-center gap-1.5 rounded-md bg-slate-900 px-2.5 text-[9px] font-medium text-white hover:bg-slate-800">
              <ReceiptText className="h-3 w-3" />
              New task
            </button>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {boardColumns.map((column) => (
              <section key={column.id} className="rounded-lg border border-slate-200 bg-white p-2.5">
                <div className="mb-2 flex items-center justify-between px-1">
                  <p className="text-[10px] font-semibold text-slate-700">{column.title}</p>
                  <span className="flex h-4 w-4 items-center justify-center rounded bg-slate-100 text-[8px] font-semibold text-slate-500">{column.tasks.length}</span>
                </div>
                <div className="space-y-2">
                  {column.tasks.map((task) => (
                    <article key={task.id} className="rounded-md border border-slate-200 bg-white p-2.5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                      <p className="text-[10px] font-medium leading-[15px] text-slate-800">{task.title}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-mono text-[7px] text-slate-400">{task.id}</span>
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[7px] font-semibold ${task.color}`}>{task.assignee.slice(0, 1)}</span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </PreviewChrome>
  );
}

const financeStats = [
  { title: "Checking", value: "$4,821.40", delta: "+2.1%", positive: true, color: "bg-indigo-500" },
  { title: "Savings", value: "$12,650.00", delta: "+0.4%", positive: true, color: "bg-emerald-500" },
  { title: "Credit card", value: "$1,204.65", delta: "−1.2%", positive: false, color: "bg-amber-500" },
];

const transactions = [
  { initials: "WF", name: "Whole Foods", date: "Today", amount: "−$84.20", tone: "text-rose-500" },
  { initials: "PD", name: "Paycheck deposit", date: "Yesterday", amount: "+$3,400.00", tone: "text-emerald-600" },
  { initials: "UB", name: "Uber", date: "Yesterday", amount: "−$18.45", tone: "text-rose-500" },
  { initials: "SP", name: "Spotify", date: "Sep 20", amount: "−$10.99", tone: "text-rose-500" },
];

function PersonalFinancePreview() {
  return (
    <PreviewChrome url="preview.architect.local/overview">
      <PreviewSidebar
        accent="bg-indigo-50 text-indigo-700"
        brand="ledger"
        links={[
          { icon: Wallet, label: "Overview", active: true },
          { icon: ReceiptText, label: "Transactions" },
          { icon: PieChart, label: "Budgets" },
          { icon: Landmark, label: "Accounts" },
        ]}
      />
      <div className="preview-scrollbar min-w-0 flex-1 overflow-y-auto bg-white">
        <div className="mx-auto max-w-[820px] px-4 py-4 sm:px-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-slate-400">Friday, September 25, 2026</p>
              <h1 className="mt-1 text-[17px] font-semibold tracking-tight text-slate-900 sm:text-[20px]">Good morning, Abhay</h1>
              <p className="mt-1 text-[10px] text-slate-500">Net worth is up 6.2% this month.</p>
            </div>
            <CreditCard className="h-5 w-5 text-slate-400" />
          </div>

          <section aria-label="Account balances" className="mt-4 grid grid-cols-3 gap-2.5 xl:grid-cols-3">
            {financeStats.map((stat) => (
              <article key={stat.title} className="rounded-lg border border-slate-200 bg-white p-3"> 
                <div className="flex items-center justify-between gap-1">
                  <p className="text-[9px] font-medium text-slate-500">{stat.title}</p>
                  <span className={`h-1.5 w-1.5 rounded-full ${stat.color}`} />
                </div>
                <p className="mt-2 text-[16px] font-semibold tracking-tight text-slate-900 sm:text-[18px]">{stat.value}</p>
                <p className="mt-1 flex items-center gap-1 text-[8px] text-slate-400">
                  {stat.positive ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-rose-500" />}
                  <span className={stat.positive ? "font-medium text-emerald-600" : "font-medium text-rose-600"}>{stat.delta}</span>
                  vs last month
                </p>
              </article>
            ))}
          </section>

          <section className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.4fr)_minmax(190px,1fr)]">
            <article className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
              <h2 className="text-[11px] font-semibold text-slate-800">Spending by category</h2>
              <p className="mt-1 text-[8px] text-slate-400">Last 30 days across all accounts</p>
              <div className="mt-3 space-y-2.5">
                {[
                  { name: "Housing", percent: 32, color: "bg-indigo-500" },
                  { name: "Food", percent: 18, color: "bg-emerald-500" },
                  { name: "Transport", percent: 11, color: "bg-amber-500" },
                  { name: "Other", percent: 9, color: "bg-slate-300" },
                ].map((entry) => (
                  <div key={entry.name} className="flex items-center gap-2 text-[8px]">
                    <span className="w-14 shrink-0 truncate text-slate-500">{entry.name}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className={`h-full rounded-full ${entry.color}`} style={{ width: `${entry.percent}%` }} />
                    </div>
                    <span className="w-7 text-right font-medium text-slate-700">{entry.percent}%</span>
                  </div>
                ))}
              </div>
            </article>
            <article className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
              <h2 className="text-[11px] font-semibold text-slate-800">Budget</h2>
              <p className="mt-1 text-[8px] text-slate-400">1,842 of 2026 left</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="relative flex h-[74px] w-[74px] shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(#6366f1 0 70%, #e2e8f0 70% 100%)" }}>
                  <div className="flex h-[50px] w-[50px] flex-col items-center justify-center rounded-full bg-white">
                    <span className="text-[13px] font-semibold text-slate-800">70%</span>
                    <span className="text-[7px] text-slate-400">used</span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-medium text-slate-700">On track</p>
                  <p className="mt-0.5 text-[8px] leading-[13px] text-slate-500">$2,540 of $3,600 spent this month.</p>
                </div>
              </div>
            </article>
          </section>

          <section className="mt-3 rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h2 className="text-[11px] font-semibold text-slate-800">Recent activity</h2>
                <p className="mt-1 text-[8px] text-slate-400">Latest transactions across all accounts</p>
              </div>
              <button className="text-[8px] font-medium text-indigo-600">View all</button>
            </div>
            <div className="space-y-2.5">
              {transactions.map((tx) => (
                <div key={tx.name} className="flex items-center gap-2 border-t border-slate-100 pt-2.5 first:border-0 first:pt-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[8px] font-semibold text-slate-600">{tx.initials}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[9px] font-medium text-slate-700">{tx.name}</p>
                    <p className="truncate text-[8px] text-slate-400">{tx.date}</p>
                  </div>
                  <span className={`text-[9px] font-semibold ${tx.tone}`}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </PreviewChrome>
  );
}

export function ScenarioPreview({ scenarioId }: { scenarioId: ScenarioId }) {
  if (scenarioId === "customer-support") return <CustomerSupportPreview />;
  if (scenarioId === "project-management") return <ProjectManagementPreview />;
  if (scenarioId === "personal-finance") return <PersonalFinancePreview />;
  return <DashboardPreview />;
}