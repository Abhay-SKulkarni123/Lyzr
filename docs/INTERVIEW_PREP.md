# Architect 2.0 — Interview Prep

Interview talking points specific to Architect 2.0. Reflects everything important an interviewer might probe: technical concepts actually used, product/UX reasoning, mocked-vs-real boundaries, and production-readiness. Update with each future phase.

---

## Important Technical Concepts (Used In This Project)

- **Next.js 14 App Router**: file-based routing, route groups (`(auth)`, `(app)`) for layout scoping, server vs client components, pages receive `searchParams` synchronously (Next 14).
- **Typed state machine**: `BuildStatus` union (`idle | understanding | planning | building | checking | complete | error`) drives the workspace; UI derives everything else from a single `activeStep`.
- **Data-driven simulation**: `data/builds.ts` + `data/developer.ts` hold agents, recipes, activities, file tree/code samples, terminal/git/env mocks; components render data, they do not hardcode logic.
- **Whitelist-routed simulated terminal**: `normalizeCommand` → `findTerminalCommand` maps only safe demo commands (`npm run dev/build/lint`, `git status`) to canned output; everything else returns a "simulated" notice — no `child_process`, never user input executed.
- **Open-tabs editor model**: `WorkspaceShell` owns `tabs: string[]` + `activePath`; explorer/Files/file-activity all funnel into `openFileByPath` (dedupe → activate → switch to Code); close re-activates the last tab, all-closed shows an empty state.
- **Extended workspace view union**: `WorkspaceView` = primary (preview/code/terminal/files) + developer-only (git/environment/settings); `isDeveloperView` guards the mode-off reset.
- **Modified-file union**: build-touched files ∪ git `M`/`A` files drive the emerald "updated" dots consistently across explorer, tabs, and Files view.
- **Client-side guards**: `RequireAuth` / `RedirectIfAuthed` with a mounted gate to avoid hydration mismatch and redirect flashes.
- **Query-parameter seeding**: `/workspace?prompt=&project=` keeps a route stateless and deep-linkable; server resolves project id → name.
- **Mock session**: localStorage flag (`architect-demo-auth`), passwords never stored; `lib/auth.ts` isolates the boundary for a future real provider.
- **Reusable primitives**: `Menu` (click-outside + Escape + `role`), `StatusBadge`; derivation of statuses (agent/file/plan) from shared state rather than scattered booleans.

## Important Product/UX Concepts

- **Progressive complexity**: non-technical user sees prompt → build → result; technical user can inspect plan → agents → files → code → terminal → git → environment → preview. Developer mode is an explicit opt-in, keeping the default surface "simple by default, powerful when needed."
- **Transparent activity**: human-readable progress ("Created dashboard navigation") instead of fake logs, builds trust in generated work.
- **Iteration over creation**: the composer persists after a build and invites a change; history treats the project as a living artifact — and Developer mode lets that artifact be inspected (tabs) and "committed" (simulated git).
- **Context retention**: preview never disappears behind a loader during builds.
- **Honesty in a prototype**: every simulated surface is labeled ("Simulated terminal", "Source control is simulated in prototype mode.", "Environment values are simulated in prototype mode.") so nothing is claimed as real.

## Why These Decisions Were Made

- **Next.js**: full-stack path without a framework switch; App Router, SSR/static + client interactivity; Vercel-friendly; industry standard.
- **TypeScript strict**: safety for a growing state model, better tooling, interview expectation.
- **Tailwind**: velocity + a deliberate custom palette (ink/coral/mint) that avoids the generic "AI SaaS" look.
- **Simulated agents**: deliver the full product UX and story without credential, cost, or safety risk during a bounded prototype.
- **Client-only state**: the build lifecycle is one-screen interaction; a store/backend is only worth adding once state is shared or persisted. Tabs and git/env local state follow the same rule.
- **No new dependencies**: everything is achievable with React + Next + Tailwind + lucide-react.
- **No dangerous browser capabilities**: dev tools are simulated instead of wired to `child_process`, real git, `.env` files, or the filesystem — the prototype never hands the browser arbitrary execution, secret access, or repo mutation.

---

## Project-Specific Q&A

### Why simulate agents instead of implementing real agents?
Real agents need an orchestration backend, LLM providers, sandboxed execution, and observation of real tool results — all out of scope for a frontend-first prototype. Simulating them reproduces the product experience and the interaction design (plan → agents → files → checks → preview) exactly, with deterministic, demo-safe behavior. The typed state model is built so a real orchestrator can later drive the same UI by pushing activity events instead of a timer.

### How would the build state machine work in production?
A server would own the machine. `POST /api/builds` enqueues a job (BullMQ/Redis). Worker processes persist a run record `{ id, status, activities[] }`. The transition `understand → plan → build → check → complete|error` happens server-side as agents complete; the UI becomes a subscriber that renders whatever phase the server reports. The current union type maps 1:1 to an API status enum.

### How would multiple agents communicate?
Agents share a job queue and a run-scoped state (DB rows or a stream). Each agent is a worker with a declared capability and tool access; they exchange messages through the run (e.g., UI Builder emits a *filesUpdated* event; QA consumes finished file paths for checks; Data Agent responds to schema/seed requests). Communication is async and observable — every message feeds the activity log.

### How would you stream agent progress to the frontend?
Server-Sent Events (SSE) or WebSocket on `/api/runs/:id/stream`. The server appends typed events (`activity.completed`, `phase.changed`, `file.updated`) to a channel; the client currently shows a timer advancing steps, and that same rendering code would instead advance on incoming events. This keeps the UI unchanged behind an adapter — the design already isolates "what happened" (events) from "when" (timer).

### How would generated files be persisted?
A project-scoped filesystem keyed by `projectId` in object storage (S3/MinIO), with metadata in Postgres. The runtime build produces diffs in the sandbox; a git commit (via GitHub API or a local git server) records each version. The prototype's per-build "files updated" list is the lightweight stand-in for that commit object model.

### How would you safely execute generated code?
Ephemeral, disposable Docker containers with: no outbound network, read-only system mounts, CPU/memory/disk quotas, no host mount access, and a short TTL. Output is streamed; builds are torn down afterward. Ignition is from an artifact build, never from a user-provided string executed on the host.

### How would you prevent an AI agent from performing unsafe operations?
A policy layer between tool calls and actions: allowlists for file paths (inside the project root only), size limits, command allowlists for the sandbox, secret redaction, and human-approval checkpoints for destructive operations (deletes, env changes, deploys). Agents also get a "read-only during planning/checking" capability so they cannot mutate while analyzing.

### Why expose agent activity to users?
It differentiates "vibe coding" from a black box: users see intent become structure (understand → plan → build → check), can verify progress, and can intervene. Transparency is what makes generated work feel owned — and it is a core UX principle of the product (visible agent activity builds trust).

### Why is progressive disclosure important here?
The two personas have opposite tolerance for complexity. Showing plan/agents/files/code by default overwhelms a creator; hiding them frustrates a developer. Progressive disclosure lets the same canvas serve both — simplest path for non-technical users, deep inspection for technical ones — without a mode fork.

### How would you make the preview genuinely live?
Serve the built app from the sandbox: after `build` completes, the sandbox starts a dev/build server and streams a URL to the frontend for an iframe (or hot-reload via WebSocket). "Updating preview…" becomes a real debounce while the build recompiles; status events drive the same pill UI already present.

### How would prompt iteration work with persisted project state?
A project keeps a mutable "current tree" plus an immutable history of build runs. A new prompt creates a new run whose base snapshot is the previous tree; the plan generator produces a diff, agents apply it, and success pushes a new version. Recent instructions and build history would reload from the DB — the local arrays in the prototype map directly to those API resources.

### What is the difference between UI simulation and actual AI orchestration?
UI simulation renders a deterministic script of states — timing and content are fixed, outcomes cannot vary, and nothing is computed from the prompt. AI orchestration executes tool calls against a real runtime: outputs are nondeterministic, failures are real, files/code genuinely change, and the UI is a mirror of server truth. The prototype ships the mirror's good looks; production attributes the behavior to real systems and clearly re-labels mock surfaces.

---

## Phase 4 / Developer Mode Q&A

### Why keep Terminal, Git, and Environment simulated rather than wired to real systems?
The browser must never receive dangerous capabilities — no arbitrary command execution, no real git mutations, no secret retrieval, no filesystem access. A frontend-only prototype has no secure place to run these, so each surface is a faithful mock: the terminal routes input through a whitelist and returns canned output, git commits/pushes mutate local React state only, and env values are mock strings masked by default. The swap path is the same as everywhere else: a server-side executor (sandbox, git API, real env service) that pushes events to the existing UI.

### How does the simulated terminal stay safe?
`normalizeCommand` canonicalizes input (`trim`, collapse spaces, lowercase) and `findTerminalCommand` matches it against a small whitelist (`npm run dev/build/lint`, `git status`). Unknown commands append the note "Command execution is simulated in prototype mode." — user input is never executed, no `child_process`, nothing beyond string matching happens in the browser.

### Why mask environment variables, and how does that work?
Secret hygiene should be visible even in a prototype. Each variable renders masked (`••••`) with a per-row eye toggle; `OPENAI_API_KEY` ships unconfigured to show the "Not configured" state. All values are mock strings — no real `.env` is read (the server-side workspace page only resolves query params), and edits are local React state with a notice that nothing persists.

### How does the open-tabs model work, and why not a fixed editor?
The shell keeps `tabs: string[]` and an `activePath`. Every entry point — file explorer, Files view, and a now-clickable `FileActivity` row — funnels into one `openFileByPath`: dedupe, append, activate, switch to Code. Closing a tab activates the last remaining; closing all reveals a purposeful empty state. This mirrors a real IDE while staying a small, testable state slice — no router coupling.

### Why do FileActivity rows now open files?
It closes the loop between the build narrative and the developer output: the agent "changed" a file in activity, and a developer clicks it to see what changed (a modified dot + read-only sample). This is the concrete Agent → Code connection the phase was about — artifact inspection instead of a flat status list.

### Why is Developer mode opt-in, and why reset to Preview when toggled off?
The product has two personas on one canvas. Defaulting to the Architect experience keeps it "simple by default"; Developer mode adds the code-first framing plus Git/Environment/Settings rails ("powerful when needed"). Because developer-only views are meaningless without the mode, turning it off while on one resets to Preview — a small guard that keeps the UI states mutually consistent.

### Related: does the git panel really commit anything?
No. "Commit" generates a random 7-hex hash, prepends it to a local commit-history list, and clears the working-tree list — all client state. Push and PR fire simulated notices. The data model (working tree → staged → commit → history) is exactly what a real git integration would expose, so the UI is not thrown away when a GitHub API is added.

---

## Production-Readiness / Architecture Questions

1. **What would production architecture look like?** Next.js API + BullMQ workers + Docker sandbox + Postgres/Redis + object storage + SSE/WebSocket; GitHub for version control; Auth.js for sessions; Vercel/Netlify for deploys; Sentry for monitoring.
2. **Why no middleware in the prototype?** The mock session lives in localStorage; middleware runs server-side and can't read it. The mounted gate prevents redirect flashes. With cookies, `middleware.ts` would handle gating server-side.
3. **How do you keep the prototype swapping to real services?** Adapters: `lib/auth.ts`, `data/`, typed models, and prop-driven components define boundaries; a real integration replaces the implementation behind the same shape.
4. **Data model for builds?** `Project(1) → BuildRun(1→n) → Activity(n)`; activities are the source for plan/agent/file/history projections.
5. **Scalability of the current app?** Static export except `/workspace`; no server state; a backend can be added behind API routes incrementally.

## Mocked-Functionality Questions

1. **What's mocked?** Auth accounts, projects/templates, agents, the build lifecycle, file changes, code/terminal content, npm/git command output, commits/pushes/branches, environment variables, preview updates, metrics, error trigger.
2. **How do you mark mocks honestly?** UI labels ("Prototype mode", "Build activity is simulated", "Read-only prototype", "Simulated terminal", "Source control is simulated in prototype mode.", "Environment values are simulated in prototype mode.") and this docs file.
3. **What breaks if you remove the timer?** The lifecycle never advances — which is exactly what a real event source must replace; the component already accepts events conceptually.
4. **Is the preview changed by the prompt?** No. The prompt seeds the initial instruction and composer, but the sample preview stays static; the UI states checks haven't changed it.
5. **Can a user really commit or push?** Only locally: simulated commits (random hash prepended to history) and push notices live in React state and reset on reload; nothing touches the real repository.

## Agent Questions

1. Why those four agents? Architect/UI Builder/Data Agent/QA Agent map to the visible stages (plan, build UI, prepare data, check) without implying capability breadth.
2. What does an agent "know"? A role, a plan step, tool scopes — modeled as typed definitions; production adds an LLM system prompt + tools.
3. How is the active agent indicated? Activity panel shows the currently running agent's row as active with the latest human message; others show done/waiting.

## Frontend Architecture Questions

1. Why is all build state in `WorkspaceShell`? Single-screen lifecycle; child components stay presentational; a reducer/context is the next step if state grows.
2. Why types in `components/workspace/types.ts` vs `types/`? Co-located with the feature; shared types can move to `types/` when other surfaces consume them.
3. How is status derived rather than duplicated? One `activeStep` + recipe → agent/file/plan statuses computed via helpers; avoids boolean flag drift.
4. Route groups? `(auth)` public chrome, `(app)` authenticated chrome — layout separation without URL segments.

## Authentication & State Questions

1. How does the session persist? `getMockSession()` reads localStorage each load; `AuthProvider` initializes from it; guards re-check post-mount.
2. Where do passwords go? Nowhere — form state only, never stored/transmitted.
3. How would you add real auth? Auth.js + HTTP-only cookie `session` + middleware `matcher` on `(app)`, swap `signInMock` for server actions/API.
4. How is project state shared? Not yet — workspace receives a seed via query params; a real app uses project context loaded per run.

## GitHub / Deployment Questions (relevant)

1. Are GitHub/Deploy real? No — header affordances explain placeholder status; `/github` and `/deployment` are scaffold stubs; the workspace Git panel is a simulated surface on top of mock data.
2. How would Git fit? Each completed build maps to a commit (version = v4, v5…); the Git panel already models the working tree → staged → commit → history pipeline, foreshadowing a real GitHub integration and CI/CD reacting to commits.
3. What would "Deploy" do? Point the build artifact at a target (Vercel/Netlify API) and stream status; today it's a disabled-during-build button plus a notice.