import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Download,
  Home,
  LifeBuoy,
  Search,
  Settings,
  Users,
} from "lucide-react";

const stats = [
  { title: "Total revenue", value: "$48,294", delta: "+12.8%", positive: true, color: "bg-indigo-500" },
  { title: "Active customers", value: "2,847", delta: "+8.2%", positive: true, color: "bg-sky-500" },
  { title: "Conversion rate", value: "3.64%", delta: "−0.4%", positive: false, color: "bg-amber-500" },
  { title: "Avg. order value", value: "$169.50", delta: "+4.6%", positive: true, color: "bg-emerald-500" },
];

const transactions = [
  { initials: "SC", name: "Sophie Chen", email: "sophie.chen@acme.co", amount: "$1,240.00", state: "Paid", color: "bg-violet-100 text-violet-700" },
  { initials: "JM", name: "James Miller", email: "james.m@northstar.io", amount: "$890.00", state: "Paid", color: "bg-sky-100 text-sky-700" },
  { initials: "AP", name: "Amara Patel", email: "amara.patel@studio.co", amount: "$2,150.00", state: "Pending", color: "bg-orange-100 text-orange-700" },
];

function DashboardSidebar() {
  const items = [
    { icon: Home, label: "Overview", active: true },
    { icon: CreditCard, label: "Transactions", active: false },
    { icon: Users, label: "Customers", active: false },
    { icon: CircleHelp, label: "Reports", active: false },
  ];
  return (
    <aside className="hidden w-[168px] shrink-0 flex-col border-r border-slate-200 bg-[#fbfcfe] sm:flex lg:w-[188px]">
      <div className="flex h-[58px] items-center gap-2 border-b border-slate-200 px-4">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-white">
          <span className="h-2.5 w-2.5 rotate-45 rounded-[2px] bg-white" />
        </span>
        <span className="text-[12px] font-bold tracking-tight text-slate-900">northstar</span>
      </div>
      <div className="flex items-center gap-2.5 border-b border-slate-200 px-3 py-3">
        <span className="flex h-7 w-7 items-center justify-center rounded-md bg-indigo-100 text-[10px] font-semibold text-indigo-700">NS</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-semibold text-slate-800">Northstar Inc.</p>
          <p className="text-[9px] text-slate-500">Free plan</p>
        </div>
        <ChevronDown className="h-3 w-3 text-slate-400" />
      </div>
      <nav className="space-y-0.5 p-2.5" aria-label="Analytics navigation">
        <p className="px-2 pb-1 pt-1 text-[8px] font-semibold uppercase tracking-[0.12em] text-slate-400">Workspace</p>
        {items.map(({ icon: Icon, label, active }) => (
          <div key={label} className={`flex items-center gap-2 rounded-md px-2 py-2 text-[10px] ${active ? "bg-indigo-50 font-semibold text-indigo-700" : "text-slate-500"}`}>
            <Icon className="h-3.5 w-3.5" />
            {label}
          </div>
        ))}
      </nav>
      <div className="mt-auto space-y-0.5 border-t border-slate-200 p-2.5">
        <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-slate-500"><Settings className="h-3.5 w-3.5" />Settings</div>
        <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] text-slate-500"><LifeBuoy className="h-3.5 w-3.5" />Help center</div>
        <div className="mt-2 flex items-center gap-2 border-t border-slate-200 px-2 pt-3">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-rose-100 text-[8px] font-bold text-rose-700">JD</span>
          <div className="min-w-0"><p className="text-[9px] font-semibold text-slate-700">Jordan Davis</p><p className="text-[8px] text-slate-400">Admin</p></div>
        </div>
      </div>
    </aside>
  );
}

function RevenueChart() {
  return (
    <div className="relative mt-4 h-[142px] w-full">
      <div className="absolute inset-0 flex flex-col justify-between pb-5">
        {["$50k", "$40k", "$30k", "$20k", "$10k"].map((label) => (
          <div key={label} className="flex items-center gap-2">
            <span className="w-7 text-[8px] text-slate-400">{label}</span>
            <span className="h-px flex-1 border-t border-dashed border-slate-200" />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-8 bottom-5 top-0">
        <svg aria-label="Revenue increased over the last six months" className="h-full w-full overflow-visible" preserveAspectRatio="none" role="img" viewBox="0 0 600 120">
          <defs>
            <linearGradient id="revenue-fill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d="M0 100 C35 87 48 92 75 78 S125 88 150 64 S192 70 225 55 S267 66 300 44 S346 53 375 36 S417 47 450 25 S490 38 525 17 S565 26 600 8 L600 120 L0 120Z" fill="url(#revenue-fill)" />
          <path d="M0 100 C35 87 48 92 75 78 S125 88 150 64 S192 70 225 55 S267 66 300 44 S346 53 375 36 S417 47 450 25 S490 38 525 17 S565 26 600 8" fill="none" stroke="#6366f1" strokeLinecap="round" strokeWidth="2.5" />
          <circle cx="600" cy="8" r="4" fill="white" stroke="#6366f1" strokeWidth="2" />
        </svg>
      </div>
      <div className="absolute inset-x-8 bottom-0 flex justify-between text-[8px] text-slate-400">
        {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month) => <span key={month}>{month}</span>)}
      </div>
    </div>
  );
}

export function DashboardPreview() {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-slate-300 bg-white shadow-[0_16px_45px_rgba(0,0,0,0.18)]">
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-slate-200 bg-slate-50 px-3">
        <div className="flex gap-1.5" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-[#fb6d68]" /><span className="h-2 w-2 rounded-full bg-[#f6be4f]" /><span className="h-2 w-2 rounded-full bg-[#53c878]" /></div>
        <div className="mx-auto flex h-[22px] w-[min(55%,380px)] items-center justify-center gap-1.5 rounded border border-slate-200 bg-white text-[9px] text-slate-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> preview.architect.local
        </div>
        <div className="w-[38px]" />
      </div>
      <div className="flex min-h-0 flex-1 overflow-hidden bg-white text-slate-900">
        <DashboardSidebar />
        <div className="preview-scrollbar min-w-0 flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 lg:px-7">
          <div className="mx-auto max-w-[920px]">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[8px] font-medium uppercase tracking-[0.12em] text-slate-400">Monday, June 24, 2024</p>
                <h1 className="mt-1 text-[17px] font-semibold tracking-tight text-slate-900 sm:text-[20px]">Good morning, Jordan <span aria-hidden="true">👋</span></h1>
                <p className="mt-1 text-[10px] text-slate-500">Here&apos;s what&apos;s happening with your store today.</p>
              </div>
              <div className="hidden items-center gap-2 sm:flex">
                <button className="flex h-7 items-center gap-1.5 rounded-md border border-slate-200 px-2 text-[9px] font-medium text-slate-600"><ChevronDown className="h-3 w-3" />Last 30 days</button>
                <button className="flex h-7 items-center gap-1.5 rounded-md bg-slate-900 px-2 text-[9px] font-medium text-white"><Download className="h-3 w-3" />Export</button>
              </div>
            </div>

            <section aria-label="Key performance indicators" className="grid grid-cols-2 gap-2.5 xl:grid-cols-4">
              {stats.map((stat) => (
                <article key={stat.title} className="rounded-lg border border-slate-200 bg-white p-3 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-[9px] font-medium text-slate-500">{stat.title}</p>
                    <span className={`h-1.5 w-1.5 rounded-full ${stat.color}`} />
                  </div>
                  <p className="mt-2 text-[17px] font-semibold tracking-tight text-slate-900 sm:text-[20px]">{stat.value}</p>
                  <p className="mt-1 flex items-center gap-1 text-[8px] text-slate-400">
                    {stat.positive ? <ArrowUpRight className="h-3 w-3 text-emerald-500" /> : <ArrowDownRight className="h-3 w-3 text-rose-500" />}
                    <span className={stat.positive ? "font-medium text-emerald-600" : "font-medium text-rose-600"}>{stat.delta}</span>
                    vs. last month
                  </p>
                </article>
              ))}
            </section>

            <section className="mt-3 grid gap-3 lg:grid-cols-[minmax(0,1.7fr)_minmax(190px,1fr)]">
              <article className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
                <div className="flex items-start justify-between">
                  <div><h2 className="text-[11px] font-semibold text-slate-800">Revenue over time</h2><p className="mt-1 text-[8px] text-slate-400">Monthly revenue performance</p></div>
                  <button aria-label="Search analytics" className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-50"><Search className="h-3.5 w-3.5" /></button>
                </div>
                <RevenueChart />
              </article>
              <article className="rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
                <div className="flex items-start justify-between"><div><h2 className="text-[11px] font-semibold text-slate-800">Traffic sources</h2><p className="mt-1 text-[8px] text-slate-400">Visitors by channel</p></div><Bell className="h-3.5 w-3.5 text-slate-400" /></div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-full" style={{ background: "conic-gradient(#6366f1 0 42%, #38bdf8 42% 70%, #34d399 70% 88%, #e2e8f0 88% 100%)" }}>
                    <div className="flex h-[54px] w-[54px] flex-col items-center justify-center rounded-full bg-white"><span className="text-[13px] font-semibold text-slate-800">8.4k</span><span className="text-[7px] text-slate-400">visitors</span></div>
                  </div>
                  <div className="min-w-0 flex-1 space-y-2">
                    {[["Direct", "42%", "bg-indigo-500"], ["Social", "28%", "bg-sky-400"], ["Search", "18%", "bg-emerald-400"], ["Other", "12%", "bg-slate-300"]].map(([name, percent, color]) => (
                      <div key={name} className="flex items-center gap-1.5 text-[8px]"><span className={`h-1.5 w-1.5 rounded-full ${color}`} /><span className="min-w-0 flex-1 truncate text-slate-500">{name}</span><span className="font-medium text-slate-700">{percent}</span></div>
                    ))}
                  </div>
                </div>
              </article>
            </section>

            <section className="mt-3 rounded-lg border border-slate-200 bg-white p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between"><div><h2 className="text-[11px] font-semibold text-slate-800">Recent transactions</h2><p className="mt-1 text-[8px] text-slate-400">Your latest customer activity</p></div><button className="text-[8px] font-medium text-indigo-600">View all</button></div>
              <div className="space-y-2.5">
                {transactions.map((transaction) => (
                  <div key={transaction.email} className="flex items-center gap-2 border-t border-slate-100 pt-2.5 first:border-0 first:pt-0">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[8px] font-semibold ${transaction.color}`}>{transaction.initials}</span>
                    <div className="min-w-0 flex-1"><p className="truncate text-[9px] font-medium text-slate-700">{transaction.name}</p><p className="truncate text-[8px] text-slate-400">{transaction.email}</p></div>
                    <span className="hidden text-[8px] text-slate-500 sm:block">{transaction.state}</span>
                    <span className="text-[9px] font-semibold text-slate-800">{transaction.amount}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
