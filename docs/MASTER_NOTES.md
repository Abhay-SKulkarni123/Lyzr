# Architect 2.0 — Master Notes

Single source of truth for the Architect 2.0 prototype. Maintain this file (and `docs/INTERVIEW_PREP.md`) for every future phase. Internal docs are consolidated here; the public `README.md` is separate.

---

## Product Overview

**Architect 2.0** is a next-generation vibe-coding platform: non-technical users describe an application in natural language and get a structured build experience; technical users progressively access plans, agents, files, code, and activity. Tagline: **"Build applications with natural language — simple by default, powerful when needed."**

### Product Vision
Democratize application building by bridging the gap between natural-language prompting and professional-grade developer tooling.

### Problem Statement
- Non-technical users can describe an idea but cannot execute it with traditional developer tools.
- Developers are burdened by boilerplate, configuration, and infrastructure setup.
- Existing tools force a choice between "no-code" (limited control) and "full IDE" (overwhelming). There is no middle ground.

### Target Users
- **Non-technical creators** — idea → prompt → build → preview → deploy; no coding knowledge required.
- **Technical developers** — prompt → plan → agents → files → code → terminal → git → environment → deploy; full control.

### Core Principle
**Progressive complexity** — a single workspace reveals detail as it becomes useful. Default view is Prompt → Build → Result; technical surfaces (plan, agents, files, code, activity) are visible but secondary.

### Product Differentiator
1. Same platform serves both user types without forcing a choice.
2. Unified workspace for everything.
3. Agent transparency — users see what the build is doing.
4. Continuous preview.
5. "Architect doesn't just answer a prompt — it turns intent into a structured build process."

---

## User Journeys (as implemented)

1. Landing (`/`) → Sign in (`/login` or `/signup`) → Dashboard hub (`/dashboard`).
2. Dashboard: greeting + stats → build-from-prompt composer, or browse projects/templates.
3. New Project modal (`/projects`, `/templates`) → routes to `/workspace` seeded with `?project=` + `?prompt=` + `new=1`.
4. `/workspace`: type/for the seeded prompt → watch the simulated agentic build → iterate with another prompt (repeat cycle).
5. `/settings`: profile / preferences / notifications / sign-out.

Guest entry is also available — `/workspace` itself is not auth-gated (it receives context via query params).

---

## Tech Stack & Repo Structure

- **Framework**: Next.js 14.2.5 (App Router), React 18, strict TypeScript, Tailwind CSS, lucide-react. **No runtime backend, no added dependencies.**
- **Routes**: `/`, `/workspace`, `(auth)/login`, `(auth)/signup`, `(app)/dashboard`, `(app)/projects`, `(app)/templates`, `(app)/settings`, plus placeholder `/agents`, `/github`, `/deployment`.
- **components/**: `workspace/` (the build experience and all build-centric UI), `dashboard/` (hub shell + cards + modal), `auth/`, `shared/` (`Menu`, `StatusBadge`, `UserMenu`), empty `ui/`, `layout/`, `agents/`, `github/`, `deployment/` scaffold folders.
- **lib/**: `auth.ts` (mock localStorage session helpers).
- **data/**: typed fixtures — `projects.ts`, `templates.ts`, `builds.ts` (agents, recipes, activities, history).
- **types/**: reserved; workspace types live in `components/workspace/types.ts`.
- **docs/**: `MASTER_NOTES.md` and `INTERVIEW_PREP.md` only.
- **Validation**: `npm run type-check`, `npm run lint`, `npm run build`.

---

## Current Feature Map

| Feature | Where | Status |
|---|---|---|
| Mock auth (login/signup, session gate) | `(auth)` + `(app)` layouts, `lib/auth.ts` | Functional (mocked accounts) |
| Dashboard hub, projects, templates, settings | `/dashboard`, `/projects`, `/templates`, `/settings` | Functional over mock data |
| New Project modal + workspace seeding (`?prompt=`, `?project=`) | `NewProjectModal`, `app/workspace/page.tsx` | Functional |
| Prompt → Build → Result (agentic lifecycle) | `WorkspaceShell` + `data/builds.ts` | Functional simulation |
| Build plan, agent activity, file activity | Activity panel (`AgentActivity`, `BuildPlan`, `FileActivity`) | Functional simulation |
| Prompt iteration + recent instructions + build history | `WorkspaceShell` state, `BuildHistory` | Functional local state |
| Build success / error + retry | `WorkspaceShell`, `BuildStatus`, composer | Functional (deterministic trigger) |
| File explorer / code / terminal / files views | `FileExplorer`, `CodeSurface`, `TerminalSurface`, `FilesOverview` | Read-only mock |
| Preview states (idle/busy/ready) | `PreviewStatus` | Functional overlay |
| GitHub, deployment, environment, real agents | Placeholder buttons/pages | Deferred / not connected |
| Real AI, code gen, sandbox, terminal exec, backend | — | Deferred / not connected |

---

## Architecture & Key Technical Decisions

### Build state machine
`type BuildStatus = "idle" | "understanding" | "planning" | "building" | "checking" | "complete" | "error"`.

The build lifecycle lives in **`WorkspaceShell`** (client state, one component) and walks through a typed **recipe** (`data/builds.ts`) = ordered phases → activities. A `setTimeout` chain advances `activeStep`; the current activity's phase drives `status`. State is derived, not boolean flags:

- `recipe = buildIndex === 0 ? initialRecipe : iterationRecipe`
- Agent status derived from completed/current activity per agent.
- File states derived from completed/current/pending activities with `filePath`.
- Plan-step status derived from which activities have completed.

### Component strategy
Small, focused components in `components/workspace/` that take props (no shared store):
`BuildStatus` (pill + summary), `BuildPlan`, `AgentActivity`, `FileActivity`, `BuildHistory`, `PreviewStatus`, `ActivityPanel`/`ActivitySummary`, reworked `PromptComposer`, `CodeSurface`, `FileExplorer`, `FilesOverview`. `WorkspaceShell` owns all build state; children are presentational.

### Mock auth (`lib/auth.ts`)
- Storage key `architect-demo-auth`; value `{ signedIn, user:{name,email} }`. Passwords never stored.
- Client guards (`RedirectIfAuthed`, `RequireAuth`) with a mounted-state gate to avoid prerender redirect flashes.
- `?next=` read via `window.location.search` (avoids `useSearchParams`/Suspense).

### Workspace seeding
`app/workspace/page.tsx` reads `searchParams` (server-side, Next 14), resolves project id → display name, and passes `initialPrompt`/`projectName`/`autoRun` into `WorkspaceShell`. Keeps `/workspace` stateless and deep-linkable.

### Folder responsibilities
- `app/workspace/page.tsx` — resolves context only.
- `components/workspace/WorkspaceShell.tsx` — state machine + layout composition.
- `data/builds.ts` — pure data: agents, recipes, plans, activities, seed versions, file labels.
- `components/workspace/*` — presentational build UI.

---

## UX Decisions

- **Prompt-first**: the composer is persistent at the bottom; the largest area is the preview. Progress communicates "turns intent into a structured build".
- **Progressive disclosure**: default shows prompt + preview + build status. Plan, agents, file activity, and history live in the Activity panel (xl widths); it collapses to a compact build-status bar on smaller screens. Files/Code are secondary views.
- **Transparent, human activity**: messages read like "Created dashboard navigation" / "Ran mobile spacing checks" — never fake technical logs.
- **Context retention**: preview stays visible during builds (subtle "Updating preview…" pill) so the user always retains context; no full-screen loaders.
- **Iteration is first-class**: after a build, the composer invites a change ("Ask Architect to make another change…"); each run appends to recent instructions and build history.
- **Visual system**: dark workspace (`#0b0f19`, surfaces `#10141d`, `#0c1018`), coral primary, mint success, amber busy, rose errors, restrained borders, Lucide icons, compact developer typography.

---

## Functional vs Mocked

### Functional
- Routing, auth gating, session persist/restore, dashboard navigation, new-project modal, workspace seeding, prompt submission + duplicate blocking, build lifecycle timeline, agent status derivation, plan/file/history rendering, preview status pills, success & error states, retry, iteration, view switching, file selection/modified markers, responsive collapse, settings section switching, menu dismissal.

### Mocked / simulated
- Accounts & OAuth, projects/templates data, agents ("Architect", "UI Builder", "Data Agent", "QA Agent"), the entire build lifecycle (timer-drive), file changes (markers only — no files written), plan/recent-instruction/history persistence, preview updates (preview stays the static sample), success metrics, terminal/log output, error trigger.

### Not implemented (later phases)
- Real AI providers, real agents/orchestration, code generation, sandboxed execution, real terminal, real file system writes, GitHub integration, deployment, backend/database, middleware auth.

---

## Phase Implementation History

### Phase 0 — Foundation (done)
Next.js 14 + TS + Tailwind scaffold, custom palette, docs, empty repo structure.

### Phase 1 — Architect Workspace (done)
`/workspace` with header/toolbar/file explorer/sample preview/code/terminal/files views, prompt composer, timed 4-step build activity, Tailwind wiring fix, responsive behavior.

### Phase 2 — Authentication & Dashboard Hub (done)
Mock auth (`/login`, `/signup`), route groups `(auth)`/`(app)`, dashboard hub pages (`/dashboard`, `/projects`, `/templates`, `/settings`), New Project modal, workspace seeding via query params, shared primitives (`Menu`, `StatusBadge`, `UserMenu`), landing CTAs → `/login`.

### Phase 3 — Agentic Build Experience (done)
Replaced the 4-step build timer with a full simulated agentic lifecycle: state machine, build plan, four agents, human-readable activity, file activity (explorer + panel), preview states, prompt iteration with recent instructions, build history versions, success summary, deterministic error + retry, context-aware composer. Docs consolidated into `MASTER_NOTES.md` + `INTERVIEW_PREP.md`.

---

## Important Trade-offs

- **Simulated build over real AI**: identical UX surface for the product story with zero credential/cost/risk; every simulated surface is labeled as prototype.
- **State in one client component**: `WorkspaceShell` owns the machine; simple, no state library, resettable per route. Replaced by a reducer/context or backend stream when state grows or becomes shared.
- **Timed simulation**: deterministic and demo-safe; not an orchestration state machine. A real implementation swaps the timer for a server-driven event stream.
- **Client guards vs middleware**: correct for a browser-only mock session; middleware is the production upgrade.
- **Read-only code/files**: communicates the workflow without fake editing or unsafe writes.
- **Preview is static**: components can narrate changes but not render them; acknowledged in the UI.
- **Route-group layout split** and **query-param seeding** keep each surface decoupled.

---

## Current Limitations

- No persistence beyond `architect-demo-auth` (projects, prompts, history vanish on reload).
- Build does not change the preview, files, or code — all simulated.
- Agents are presentational; no orchestration, no LLM, no tool calls.
- `/workspace` is the only dynamic route (reads query params).
- Accessibility/testing/shadcn polish deferred to a later phase.

---

## Future Production Architecture

- **Next.js API routes / server actions** remain the frontend host; add `/app/api/*` stubs → real services via adapters.
- **Orchestration**: Redis + BullMQ job queue; workers run agents (LLM SDK, tool calling).
- **Sandbox execution**: ephemeral Docker containers for generated code; preview served from a sandboxed build.
- **Real-time**: WebSocket/SSE streaming of agent activity, terminal, and logs.
- **Storage**: PostgreSQL (projects, builds), S3/object store (artifacts), git via GitHub API.
- **Auth**: Auth.js (credentials/email or GitHub OAuth) + HTTP-only cookies + middleware.
- **Deployment**: Vercel/Netlify APIs or a custom CI runner.
- **Monitoring**: Sentry + structured logs.

The mock boundaries (`data/`, `lib/`, typed state models) are designed to be swapped behind adapters, not rewritten.