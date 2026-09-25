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
4. `/workspace`: type/fire the seeded prompt → watch the simulated agentic build → iterate with another prompt (repeat cycle). Switching to **Developer mode** reveals code-first tabs (Code/Terminal/Files) plus Git, Environment, and Settings surfaces for inspecting and "committing" the built work.
5. `/settings`: profile / preferences / notifications / sign-out.

Guest entry is also available — `/workspace` itself is not auth-gated (it receives context via query params).

---

## Tech Stack & Repo Structure

- **Framework**: Next.js 14.2.5 (App Router), React 18, strict TypeScript, Tailwind CSS, lucide-react. **No runtime backend, no added dependencies.**
- **Routes**: `/`, `/workspace`, `(auth)/login`, `(auth)/signup`, `(app)/dashboard`, `(app)/projects`, `(app)/templates`, `(app)/settings`, GitHub integration page `/github`, Deployments overview `/deployments`, live application view `/deployments/live`, plus placeholder `/agents`.
- **components/**: `workspace/` (the build experience and all build-centric UI), `github/` (GitHub connection, repository/branch pickers, sync, checks, pull request form/details, shared state hook), `deployment/` (deployment button/dialog/status/progress/logs/config/history/details/panel + shared state hook), `dashboard/` (hub shell + cards + modal), `auth/`, `shared/` (`Menu`, `StatusBadge`, `UserMenu`), empty `ui/`, `layout/`, `agents/` scaffold folders.
- **lib/**: `auth.ts` (mock localStorage session helpers), `github-storage.ts` (GitHub snapshot persistence — key `architect-demo-github`), `deployment-storage.ts` (deployment snapshot persistence — key `architect-demo-deployment`).
- **data/**: typed fixtures — `projects.ts`, `templates.ts`, `builds.ts` (agents, recipes, activities, history), `developer.ts` (file tree, code samples, terminal mock, git mock, env vars, settings), `github.ts` (GitHub identity, mock repositories, branches, checks, pull requests, notes, helpers), `deployment.ts` (deployment types, frameworks, progress steps, seed records, deterministic logs, URL builder, notes).
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
| Build plan, recap, retry (all breakpoints) | `BuildSessionPanel` strip under the toolbar | Functional simulation |
| Agent activity, lifecycle, file activity | Activity panel (`AgentActivity`, `BuildTimeline`, `FileActivity`) | Functional simulation |
| Prompt iteration + recent instructions + build history | `WorkspaceShell` state, `BuildHistory` | Functional local state |
| Build success / error + retry | `WorkspaceShell`, `BuildStatus`, composer | Functional (deterministic trigger) |
| File explorer / code / terminal / files views | `FileExplorer` (recursive tree + filter), `CodeEditor` + `CodeTabs`, `TerminalPanel`, `FilesOverview` | Read-only mock |
| Developer mode toggle + developer toolbar | `DeveloperModeToggle`, `DeveloperToolbar` (Git / Environment / Settings) | Functional local state |
| Code tabs & open-file navigation | `WorkspaceShell` open-tabs model, `CodeTabs`, links from explorer/files/activity | Functional local state |
| Simulated terminal | `TerminalPanel` + `data/developer.ts` whitelist (`npm run *`, `git status`) | Mocked output only |
| Simulated source control | `GitPanel`, `CommitHistory` (branch, stage, commit, push, history) | Mocked, local state only |
| Simulated environment variables | `EnvironmentPanel` (masked values, add/edit/remove) | Mocked, local state only |
| Developer settings | `DeveloperSettingsPanel` | Informational mock |
| Simulated GitHub connection | `GithubConnectionModal`, `GithubConnectionCard`, header chip, `/github` page | Functional simulation, persisted in browser |
| Repository & branch management | `GithubRepositoryPicker`, `GithubBranchPicker` (incl. create-repo / create-branch mocks) | Functional simulation over mock data |
| Sync / push / pull request flow | `GithubSync`, GitPanel push, `PullRequestDialog`, `PullRequestForm`/`PullRequestDetails`, `GithubChecks` | Simulated; remote never touched |
| Preview states (idle/busy/ready) | `PreviewStatus` | Functional overlay |
| Simulated deployment flow | `components/deployment/*`, shared `useDeploymentState` hook on the workspace header button and Deployments developer view | Functional simulation, persisted in browser |
| Deployments overview | `/deployments` page (production card, config, history, retry) | Shared state with workspace |
| Live application view | `/deployments/live` (LIVE · Simulated bar + preview) | Simulated render |
| Deployment failure demo + retry | Deterministic "Simulate deployment failure" toggle | Functional simulation |
| Real agents | Placeholder button/page | Deferred / not connected |
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
`BuildStatus` (pill + summary), `BuildSessionPanel` (full-width build plan/recap/retry strip — see Phase 7), `AgentActivity`, `FileActivity`, `BuildHistory`, `PreviewStatus`, `ActivityPanel`/`ActivitySummary`, reworked `PromptComposer`, `CodeEditor` + `CodeTabs`, `TerminalPanel`, `GitPanel` + `CommitHistory`, `EnvironmentPanel`, `DeveloperSettingsPanel`, `FileExplorer`, `FilesOverview`, `DeveloperModeToggle`, `DeveloperToolbar`. `WorkspaceShell` owns all build + developer state; children are presentational.

### Developer mode (Phase 4)
- **Mode toggle**: `DeveloperModeToggle` is a segmented Architect/Developer control (`md+`), with a compact icon-only button below `md` (header has no room at 320px). Toggling Developer off while a developer-only view (git/environment/settings) is active resets the view to Preview.
- **Views**: `WorkspaceToolbar` renders the four primary views, then — only in Developer mode — a divider-gated `DeveloperToolbar` group (Git / Environment / Settings). The tab strip scrolls horizontally on narrow screens instead of wrapping.
- **Open-tabs model**: `WorkspaceShell` keeps `tabs: string[]` + `activePath`. Opening a file (explorer, Files view, or a clickable `FileActivity` row) adds a tab and switches to Code view. Closing a tab re-activates the last remaining one; closing all shows the empty Code state ("Select a file from the explorer, the Files view, or the build activity to inspect it.").
- **`data/developer.ts`**: the single source for all developer mocks — `developerFileTree`, `codeSamples` + `fileLinesFor`, terminal boot/commands/suggestions/`findTerminalCommand`, env vars, git changes/history/branches, settings. Helpers (`basename`, `dirname`, `languageOf`, `languageLabel`) keep JSX free of mock data.
- **Modified-file union**: `modifiedFiles` = build-touched files (derived from completed activities or the full recipe on `complete`) ∪ developer-mode git `M`/`A` files, so explorer, tabs, and Files view stay consistent.
- **Every simulated surface is labeled** ("Simulated terminal", "Source control is simulated in prototype mode.", "Environment values are simulated in prototype mode.") and every command/commit/env write is local React state — no `child_process`, no real git, no secret retrieval, no filesystem access.

### GitHub integration (Phase 5)
- **Simulation, not integration**: there is no OAuth, no GitHub REST/GraphQL API, no token, no remote repository, no real push/branch/PR/Action. The browser never asks for credentials and never holds dangerous capabilities; every GitHub surface is labeled ("GitHub connection is simulated in prototype mode.", "Pull request is simulated…", "Merge is simulated…").
- **Mock universe in `data/github.ts`**: identity `githubIdentity` (@abhay-demo, "Abhay (Demo)"), 5 repositories (saas-analytics, architect-demo, customer-portal, startup-landing, internal-tools) with public/private visibility, branches, and descriptions; `githubChecks` (TypeScript, ESLint, Production build, Preview validation — all passing); `seedPullRequests` per repo; typed `GithubSnapshot`; note constants and helpers (`repoById`, `repoFullName`, `dedupeBranches`, `mergeBranches`).
- **Shared, persisted state via `useGithubState`** (`components/github/useGithubState.ts` + `lib/github-storage.ts`): the hook owns one snapshot (connected identity, selected repo id, branch, last-synced, pushed-head, created PRs/branches/repositories, demo-failure flag) persisted under localStorage key `architect-demo-github`. The workspace header, GitPanel, connection card/modal, and the standalone `/github` page all read the **same** hook-driven state, so navigating between them preserves connection, repo, branch, and PRs — no disconnected mock universes.
- **Local vs remote boundary**: developer-mode git state stays in `data/developer.ts` / `WorkspaceShell` (working-tree `changes`, `commits`). GitHub state adds only the remote-facing layer. **Single source of branch truth** = `github.branch`; the old separate `gitBranch` was removed. Local `changes`/`commits` were lifted from `GitPanel` into `WorkspaceShell` and passed down as controlled props, keeping the git → GitHub relationship explicit (working tree → commit → push → repo → PR → checks → merge).
- **Entry points**: a compact `GithubHeaderChip` in the workspace header (Connect / Connected / N changes ready / Syncing…), the GitPanel (connect CTA + GitHub-aware Push + Create PR), and the `/github` page (connection card, repo/branch pickers, sync, working tree, recent commits, PR list with expandable details + merge, checks, disconnect). GitHub is intentionally **not** added to the developer toolbar.
- **Deterministic failure demo**: a "Simulate demo failures" toggle in the connection modal makes connect/sync/push/PR actions fail while enabled with a labeled error + retry affordance — a demo/Q&A aid, never random. The toggle is hoisted so it is reachable from both the connected and disconnected states (disconnected users can disable it to recover), and the connect error points at the toggle directly.
- **Error handling & a11y**: dialogs trap Escape, focus the close button, use `role="dialog"`/`aria-modal`/labelled ids, and surface status both visually (dots/labels) and for screen readers (`aria-live` sync status).

### Deployment experience (Phase 6)
- **Simulation, not infrastructure**: no deployment servers, Docker, Vercel/AWS cloud, CI/CD, build execution, shell commands, real secrets, or real hosting. Every deployment surface is labeled ("Deployment is simulated in prototype mode.", "Simulated live URL — this address does not host a real application."). The deploy lifecycle is a deterministic, timer-driven local simulation (preparing → building → deploying → ready).
- **Typed model in `data/deployment.ts`**: `DeploymentEnvironment` (production | preview), `DeploymentStatus` (idle | preparing | building | deploying | ready | failed | cancelled), `DeploymentRecord` (id, projectName, environment, branch, status, commitSha, createdAt, endedAt, duration, url, buildCommand, outputDirectory, framework, autoDeployFromGithub, human-readable `logs`), `DeploymentConfig`, `DeploymentSnapshot`. Realistic defaults: Next.js framework, `npm run build` command, `.next` output, production branch `main`; seed records (dep-1 production `a81d3f2` ready; dep-2 preview `b82c91a` ready); simulated URLs (`https://saas-analytics.architect-demo.app` as Simulated live URL).
- **Progress + logs use the build's visual language**: a 4-step timeline (Preparing/Building/Deploying/Ready) with human-readable detail lines and human-readable logs (✓ Preparing application, Installing dependencies, Running production build, Uploading build, Publishing deployment) — NOT fake technical logs ("POST /api/deploy", docker hashes). Failure keeps the friendly framing: "The build could not be completed."
- **Shared, persisted state via `useDeploymentState`** (`components/deployment/useDeploymentState.ts` + `lib/deployment-storage.ts`, localStorage key `architect-demo-deployment`): the workspace header button, the Deployments developer view, the deploy dialog, `/deployments`, and `/deployments/live` all read the **same** hook, so a deployment started in the workspace appears on `/deployments` and live. `withNormalizedActive` marks any in-progress record "cancelled" on load so browser reloads never strand a running deploy. Deterministic ids (`dep-N`, seeded counter), durations only randomized for realism.
- **Entry points**: a real `DeploymentButton` in the workspace header (Deploy / Deploying… / Live / Redeploy + status dot, replacing the old disabled placeholder), a developer-toolbar "Deployments" view (`DeploymentPanel`: current status, advanced config, Run/logs, grouped history, simulate-failure toggle, reset), and the `/deployments` page (current production deployment card with Open-live/Redeploy, configuration summary, logs while running, grouped history with per-record Details/Logs dialog and Redeploy). Deploy is a **natural product action**, not a DevOps dashboard: the dialogs default to the simple view (Project, Environment, Branch, Commit, "Automatic configuration") with "Advanced settings" (framework, build command, output directory, auto-deploy, masked environment variables) collapsed behind a toggle that opens with `DeploymentConfig`.
- **GitHub → deployment relationship**: deployment records store `branch` + `commitSha` from the existing GitHub hook (single branch source of truth; commit falls back to `github.pushedHead` → latest local commit → seed `a81d3f2`). No branching of state.
- **Preview → deployment relationship**: `PreviewStatus` gains an optional `live` flag — next to the "Preview ready" pill it renders a "Production · Live (simulated)" chip once a production deployment exists, so the preview/production boundary is explicit.
- **Deterministic failure demo**: a "Simulate deployment failure" toggle (dialog + panel) makes the next deploy fail once after the Build step with a labeled error + Retry; Retry (`forceSuccess`) succeeds regardless of the toggle.
- **Progressive disclosure**: non-technical flow shows only Deploy/Deploying…/Ready/Failed in the header; advanced configuration, logs, history, and the failure toggle live in developer surfaces.

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
- **Simple by default, powerful when needed**: Developer mode is opt-in. Unless enabled, the workspace stays the Architect (Prompt → Plan → Agents → Files → Preview) experience — the git/env/settings rails and the Code-first framing only appear when a power user turns them on.
- **Developer affordances feel real but are clearly safe**: tabs, search-in-file, copy, branch staging, masked env values, and simulated command output read like a professional surface, while persistent labels and local-state-only behavior prevent anyone mistaking the mock for real execution.
- **GitHub is an integration, not a clone**: the repo picker/branch picker/PR tooling live inside the Architect chrome and reuse existing surfaces (GitPanel, CommitHistory, working-tree data) rather than building a parallel GitHub UI; the header keeps a one-glance status chip instead of a separate nav item.
- **Connection as a first-class ceremony**: connecting shows a simulated "permissions" screen and OAuth explanation, and disconnecting uses a labeled confirm ("Disconnect GitHub?" · "Your local Architect project will remain unchanged.") — the tap-through UX of a real connection flow with zero real consent.
- **Cause → effect is visible**: working tree → commit → push ("Pushed to GitHub · saas-analytics · main · a81d3f2 … (simulated)") → PR (Base/Compare) → checks → merge is staged as one coherent flow, so an interviewer can narrate the real product loop from a mock.
- **Deployment closes the product loop with restraint**: build → preview → GitHub → deploy → status → live app, but the Deploy action stays a single header/primary CTA and a simple dialog (Project/Environment/Branch/Commit) — "Advanced settings" and logs/history are behind disclosure rather than being a standalone DevOps console. No Vercel/Netlify clone; "Open Live App" ships to a clearly-labeled simulated live page.
- **Visual system**: dark workspace (`#0b0f19`, surfaces `#10141d`, `#0c1018`), coral primary, mint success, amber busy, rose errors, restrained borders, Lucide icons, compact developer typography.

---

## Functional vs Mocked

### Functional
- Routing, auth gating, session persist/restore, dashboard navigation, new-project modal, workspace seeding, prompt submission + duplicate blocking, build lifecycle timeline, agent status derivation, plan/file/history rendering, preview status pills, success & error states, retry, iteration, view switching, file selection/modified markers, responsive collapse, settings section switching, menu dismissal, developer mode toggle + view reset, open-tab lifecycle (add/activate/close, empty-state), file→code links from explorer/Files/file activity, terminal input routing (whitelist only), git stage/commit/push simulation and commit history, env var mask/edit/add/remove, modified-file union (build ∪ git).
- GitHub connection lifecycle (connect with simulated delay, permissions screen, disconnect confirm card, labeled "Connected as @abhay-demo"), repository search/filter/select + "Create repository" mock, branch picker + "Create branch" mock, 4-phase sync (Syncing → Checking → Comparing → done), push tracking (pushed-head vs HEAD → "up to date / N ready to push"), PR creation (Base/Compare/Title/Description/changed-files/checks) flowing into PR details with simulated merge, simulated "Architect checks" list, deterministic demo-failure toggle + retry, shared GitHub state persisted under `architect-demo-github` across workspace and `/github`, error notices for connect/sync/push/PR.
- Deployment lifecycle (deploy with progress timeline + cancel, successful publish with "Deployment ready" + copy link, deterministic failure + retry, redeploy), advanced configuration (framework/build command/output directory/auto-deploy switches + masked env variables), grouped deployment history with per-record Details/Logs + Redeploy dialog, deployment → live app render with "LIVE · Simulated" bar, GitHub branch/commit propagated into records, shared deployment state persisted under `architect-demo-deployment` across workspace, `/deployments`, and `/deployments/live`, reset-demo-data clearing localStorage.

### Mocked / simulated
- Accounts & OAuth, projects/templates data, agents ("Architect", "UI Builder", "Data Agent", "QA Agent"), the entire build lifecycle (timer-driven), file changes (markers only — no files written), plan/recent-instruction/history persistence, preview updates (preview stays the static sample), success metrics, terminal/log output, error trigger, npm/git command execution (whitelist → canned output), commits & pushes (random/static hash, local state only), git branches, environment variable values (mock strings, masked by default), repository file tree & code samples.
- GitHub OAuth handshake, remote repositories, actual branch switching/creation, real pushes, real pull requests and merges, GitHub Actions checks, webhook/status updates, rate limits, GitHub identity (@abhay-demo is fictional), all repository/PR data.
- The entire deployment pipeline (build/deploy commands, dependency install, artifact upload, publishing, durations, logs), production/preview environments, live URLs (`*.architect-demo.app`), cloud/CI/CD infra, auto-deploy event listening, environment variable values (masked placeholders, never real), deployment failure behavior (deterministic toggle).

### Not implemented (later phases)
- Real AI providers, real agents/orchestration, code generation, sandboxed execution, real terminal, real file system writes, real git (commits/pushes/branches), real environment infrastructure, real GitHub (API, OAuth, remote repos, PRs, Actions, webhooks), real deployment (cloud build/deploy, CI/CD, auto-deploy webhooks, env secrets), backend/database, middleware auth.

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

### Phase 4 — Developer Mode (done)
Expanded the workspace Prompt → Plan → Agents → Files → Build → Preview into Prompt → Plan → Agents → Files → Code → Terminal → Git → Environment → Preview. Added an opt-in Architect/Developer toggle, a code-first editor with open tabs (superseded `CodeSurface`), a simulated terminal (whitelisted commands only), simulated source control (stage/commit/push + history), a masked environment-variables panel, an informational settings panel, a recursive filterable file explorer, and clickable file activity linking builds → code. All developer data centralized in `data/developer.ts`; all simulated surfaces clearly labeled (no child-process, no real git/env/filesystem).

### Phase 5 — GitHub Integration (done)
Added a convincing, clearly-labeled GitHub integration on top of the simulated local git: project → git → connect GitHub (simulated permissions + OAuth explanation, identity @abhay-demo) → choose repository (5 mock repos, search/filter/select, Create-repository mock) → choose branch (select + create mock) → review working tree (existing local changes, no duplicated state) → push ("Pushed to GitHub · repo · branch · hash message (simulated)") → create pull request (Base/Compare/Title/Description, changed files, passing checks) → review PR with simulated Architect checks (TypeScript/ESLint/Production build/Preview validation) → simulated merge. Added a compact header GitHub status chip, GitHub-aware GitPanel push/PR, and a standalone `/github` page sharing one persisted hook (`useGithubState` + `lib/github-storage.ts`, key `architect-demo-github`) with the workspace. No OAuth/API/tokens/repo operations: GitHub state is lifted as a remote-facing layer over Phase 4's local git (single branch source of truth; local git `changes`/`commits` lifted into `WorkspaceShell` as controlled props). Deterministic "demo failure" toggle + labeled error/retry; disconnect confirm leaves local git untouched.

### Phase 6 — Deployment Experience (done)
Completed the product loop Build → Preview → GitHub → Deploy → Status → Live app with a clearly-labeled, fully simulated deployment experience that behaves like a natural Architect action rather than a DevOps dashboard. Added `data/deployment.ts` (typed `DeploymentRecord`/`DeploymentConfig`/snapshot model, frameworks, 4-step progress, human-readable logs, deterministic seed records, simulated URLs), `lib/deployment-storage.ts` (key `architect-demo-deployment`, cancels in-progress runs on load), and `components/deployment/*` sharing one `useDeploymentState` hook: workspace header `DeploymentButton` (Deploy/Deploying…/Live/Redeploy — replaced the old disabled placeholder), a simple-first deploy dialog (Project/Environment/Branch/Commit + collapsible Advanced settings incl. masked env vars), progress timeline + logs + cancel while running, success panel ("Deployment ready … is live", simulated URL, Open Preview / Open Live App / Copy link / View all), labeled failure + retry (deterministic simulate-failure toggle; retry force-succeeds), a developer-toolbar "Deployments" view (`DeploymentPanel`), and a standalone `/deployments` overview plus `/deployments/live` (LIVE · Simulated bar over the shared preview). Production records capture the existing GitHub branch/commit; `PreviewStatus` shows a "Production · Live" chip once deployed. Validation: type-check + lint + build clean, production server smoke test on all routes incl. `/deployments` and `/deployments/live`. No real infrastructure, credentials, or builds are ever invoked.

### Phase 7 — Polish & Coherence (done)
A no-new-features pass that makes Phases 0–6 feel evaluated-ready while preserving every functional behavior and the single-source-of-truth design.
- **Build session strip (`BuildSessionPanel`)** — a full-width panel under the workspace toolbar, visible at ALL breakpoints (previously plan/recap/retry lived only in the `xl` Activity panel). Busy → "Here's what I'll build"/"Here's what I'll change" + compact plan grid (done/active/pending/error states shared with the Activity Timeline); complete → "Build complete"/"Updated your app" + what-changed file list + Open preview / Review changes / Deploy; error → labeled failure + Retry build. `isIteration` is derived from `promptStack.length > 1` (NOT `buildIndex`, which increments on completion). The Activity panel was deduped (its `BuildOutcome` card, "Build plan" section, and `onRetry` prop removed; `BuildPlan.tsx` deleted); error copy in `PromptComposer`/`ActivitySummary` now points at the strip's Retry.
- **Landing & first-run**: fixed invisible `text-ink` hero (now `text-white`/`slate-400`) on the dark page; added a session-aware top nav (Sign in / Create account ↔ Open dashboard / Workspace); "Explore Developer Mode" honors `next=/workspace`; New Project modal focuses its name input.
- **Preview vs production clarity**: `PreviewStatus` live chip reads "Production · Live (simulated)" with the coral palette; the live-page details Redeploy now actually calls `deployment.retry()` (and passes real `busy`); live-page header wraps on narrow screens.
- **Dead interactions**: `ProjectCard` menu items (Rename/Duplicate/Archive) now show a self-dismissing "prototype action" notice instead of doing nothing (no false affordances, no dead buttons); `Menu` link items use `next/link`; the failed-deploy "View logs" button was removed (logs are always shown beneath); created GitHub repositories are selectable via `selectRepo`.
- **GitHub recoverability**: the "Simulate demo failures" toggle is hoisted so it is reachable in the disconnected state (kills the demo-failure deadlock); copy now accurately says actions fail while enabled and lists the recovery path; the connect error adds a pointer to the toggle.
- **Auth & state**: GitHub sign-in stores the same email as `DEMO_USER` (was `abhay@users.noreply.github.com` vs `abhay@architect.app`); `RedirectIfAuthed` preserves `?next=`; DashboardHeader's ⌘K hint now has a matching handler (showing a labeled mock notice).
- **Naming & dates**: aligned the default project name to "SaaS Analytics" (app-shell, workspace page, generated-app metadata, files overview heading) and replaced stale 2024 dates (Dashboard preview + generated snippet render Friday, September 25, 2026).
- **Developer surface polish**: terminal page count "(1/1)" (was "12/12" — the generated app has one page), responsive `min-h` on Code/Terminal (kills the small-screen double scroll), "Mock session" is a capsule, Run uses a Play icon, realistic FilesOverview sizes, action-framed DeveloperModeToggle label, DeveloperToolbar padding, CommitHistory uses list semantics instead of listbox/option.
- **Deployment surface polish**: empty states for deployment history and logs, valid `li`/button nesting in history items, staging deployments show an amber tone.
- **Validation**: `type-check`, `lint`, and `next build` all clean; production-server smoke test returned 200 for `/`, `/login`, `/signup`, `/dashboard`, `/projects`, `/templates`, `/settings`, `/workspace`, `/github`, `/deployments`, `/deployments/live`, and the seeded `/workspace?prompt=…&new=1` route.

---

## Important Trade-offs

- **Simulated build over real AI**: identical UX surface for the product story with zero credential/cost/risk; every simulated surface is labeled as prototype.
- **State in one client component**: `WorkspaceShell` owns the machine; simple, no state library, resettable per route. Replaced by a reducer/context or backend stream when state grows or becomes shared.
- **Timed simulation**: deterministic and demo-safe; not an orchestration state machine. A real implementation swaps the timer for a server-driven event stream.
- **Client guards vs middleware**: correct for a browser-only mock session; middleware is the production upgrade.
- **Read-only code/files**: communicates the workflow without fake editing or unsafe writes.
- **Simulated terminal/git/env**: delivers the code-first surface — copy, tabs, masked values, staging, commits — with zero execution risk; every surface is labeled and commands are routed through a whitelist that returns canned output.
- **Simulated GitHub over real GitHub**: reproduces the entire connect → repo → branch → push → PR → checks → merge ceremony as a first-class integration with zero credentials, network calls, or remote side effects; the typed snapshot + localStorage persistence swap cleanly behind a real API adapter.
- **Simulated deployment over real deployment**: the pipeline runs as a deterministic, timer-driven local simulation so Deploy/Deploying…/Ready/Failed behaves like production UX with zero infra, credentials, or risk. A `DeploymentConfig` + snapshot adapter is the seam for swapping in a real provider later.
- **Shared GitHub/deployment state vs isolated mock islands**: the workspace and `/github` read one hook + one localStorage snapshot so presenters can navigate between them without re-connecting; deployment records reuse the same GitHub branch/commit so build → push → deploy reads as one narrative; local git data stays separate so the local/remote boundary mirrors production.
- **Preview is static**: components can narrate changes but not render them; acknowledged in the UI.
- **Route-group layout split** and **query-param seeding** keep each surface decoupled.

---

## Current Limitations

- No persistence beyond `architect-demo-auth`, `architect-demo-github`, and `architect-demo-deployment` (projects, prompts, history, commits, env edits vanish on reload).
- GitHub state is per-browser: navigation between workspace and `/github` shares state through localStorage, but there is no server, no cross-device sync, and no real GitHub account/remote.
- Deployment state is per-browser and fully simulated: no real builds, artifacts, environments, URLs, webhooks, or CI/CD; live URLs (`*.architect-demo.app`) do not resolve to a real service; "Open Live App" renders the same static preview.
- Build does not change the preview, files, or code — all simulated.
- Terminal, git, and environment panels are mock-only: no real execution, no real commits/pushes, no real secrets.
- GitHub integration is fully simulated: no OAuth, no API calls, no real repositories/pushes/branches/PRs/checks/merges, no rate limits or webhooks.
- Deployment is fully simulated: no cloud provider, no real env variables, no auto-deploy event listening, cookie/localStorage only.
- Agents are presentational; no orchestration, no LLM, no tool calls.
- `/workspace`, `/github`, `/deployments`, and `/deployments/live` are the only dynamic routes (query params; client-state).
- Full WCAG audit, automated tests, and the shadcn/ui-style component library are deferred.

---

## Future Production Architecture

- **Next.js API routes / server actions** remain the frontend host; add `/app/api/*` stubs → real services via adapters.
- **Orchestration**: Redis + BullMQ job queue; workers run agents (LLM SDK, tool calling).
- **Sandbox execution**: ephemeral Docker containers for generated code; preview served from a sandboxed build.
- **Real-time**: WebSocket/SSE streaming of agent activity, terminal, and logs.
- **Storage**: PostgreSQL (projects, builds), S3/object store (artifacts), git via GitHub API.
- **GitHub (Phase 5 → production)**: add real OAuth (GitHub App) with a backend token store, replace `data/github.ts`/`lib/github-storage.ts` behind an API adapter (`/app/api/github/*`), poll or subscribe to webhooks for repo/branch/PR/check status, run real `git` in the sandbox, and surface real Actions checks in `GithubChecks`.
- **Auth**: Auth.js (credentials/email or GitHub OAuth) + HTTP-only cookies + middleware.
- **Deployment (Phase 6 → production)**: swap the deterministic timer behind a real adapter — trigger via Vercel/Netlify build hooks or GitHub Actions on push, stream build/deploy logs over SSE/WebSocket, provision preview deployments per pull request/branch, support rollbacks, store secrets server-side with the provider, and resolve the simulated URLs to real hosts. `DeploymentConfig` (`framework`, `buildCommand`, `outputDirectory`) already mirrors a provider's build settings.
- **Monitoring**: Sentry + structured logs.

The mock boundaries (`data/`, `lib/`, typed state models) are designed to be swapped behind adapters, not rewritten.