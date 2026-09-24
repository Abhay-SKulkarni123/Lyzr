# Architect 2.0 — Interview Prep

Interview talking points specific to Architect 2.0. Reflects everything important an interviewer might probe: technical concepts actually used, product/UX reasoning, mocked-vs-real boundaries, and production-readiness. Update with each future phase.

---

## Important Technical Concepts (Used In This Project)

- **Next.js 14 App Router**: file-based routing, route groups (`(auth)`, `(app)`) for layout scoping, server vs client components, pages receive `searchParams` synchronously (Next 14).
- **Typed state machine**: `BuildStatus` union (`idle | understanding | planning | building | checking | complete | error`) drives the workspace; UI derives everything else from a single `activeStep`.
- **Data-driven simulation**: `data/builds.ts` + `data/developer.ts` hold agents, recipes, activities, file tree/code samples, terminal/git/env mocks; components render data, they do not hardcode logic.
- **Whitelist-routed simulated terminal**: `normalizeCommand` → `findTerminalCommand` maps only safe demo commands (`npm run dev/build/lint`, `git status`) to canned output; everything else returns a "simulated" notice — no `child_process`, never user input executed.
- **Open-tabs editor model**: `WorkspaceShell` owns `tabs: string[]` + `activePath`; explorer/Files/file-activity all funnel into `openFileByPath` (dedupe → activate → switch to Code); close re-activates the last tab, all-closed shows an empty state.
- **Extended workspace view union**: `WorkspaceView` = primary (preview/code/terminal/files) + developer-only (git/deployments/environment/settings); `isDeveloperView` guards the mode-off reset.
- **Modified-file union**: build-touched files ∪ git `M`/`A` files drive the emerald "updated" dots consistently across explorer, tabs, and Files view.
- **Client-side guards**: `RequireAuth` / `RedirectIfAuthed` with a mounted gate to avoid hydration mismatch and redirect flashes.
- **Query-parameter seeding**: `/workspace?prompt=&project=` keeps a route stateless and deep-linkable; server resolves project id → name.
- **Mock session**: localStorage flag (`architect-demo-auth`), passwords never stored; `lib/auth.ts` isolates the boundary for a future real provider.
- **Shared persisted GitHub state**: `useGithubState` owns one typed `GithubSnapshot` (connected, repoId, branch, lastSyncedAt, pushedHead, created PRs/branches/repositories, demoFailures) persisted under `architect-demo-github`; the workspace header, GitPanel, connection card/modal, and `/github` page all read the same hook — one state pool, no mock islands.
- **Shared persisted deployment state**: `useDeploymentState` owns one typed `DeploymentSnapshot` (simulateFailure, config, records, activeRecordId) persisted under `architect-demo-deployment`; the workspace header button, Deployments developer view, deploy dialog, `/deployments`, and `/deployments/live` all read the same hook. Deterministic record ids (`dep-N`), timer-driven progress (preparing → building → deploying → ready), in-progress runs cancelled on load, and a `DeploymentConfig` (`framework`, `buildCommand`, `outputDirectory`, `autoDeployFromGithub`) that mirrors a real provider's build settings.
- **Local/remote boundary**: local git lives in `data/developer.ts` (working tree, commits) and `WorkspaceShell`; GitHub adds only the remote-facing layer. Single source of branch truth is `github.branch` (the old separate `gitBranch` was removed), and local `changes`/`commits` were lifted into the shell and passed to `GitPanel` as controlled props.
- **Reusable primitives**: `Menu` (click-outside + Escape + `role`), `StatusBadge`; derivation of statuses (agent/file/plan) from shared state rather than scattered booleans.

## Important Product/UX Concepts

- **Progressive complexity**: non-technical user sees prompt → build → result; technical user can inspect plan → agents → files → code → terminal → git → environment → preview. Developer mode is an explicit opt-in, keeping the default surface "simple by default, powerful when needed."
- **Transparent activity**: human-readable progress ("Created dashboard navigation") instead of fake logs, builds trust in generated work.
- **Iteration over creation**: the composer persists after a build and invites a change; history treats the project as a living artifact — and Developer mode lets that artifact be inspected (tabs) and "committed" (simulated git).
- **Context retention**: preview never disappears behind a loader during builds.
- **Honesty in a prototype**: every simulated surface is labeled ("Simulated terminal", "Source control is simulated in prototype mode.", "Environment values are simulated in prototype mode.") so nothing is claimed as real.
- **GitHub as an integration, not a clone**: repo/branch pickers and PR tooling live inside Architect chrome and reuse existing surfaces (GitPanel, CommitHistory, working-tree data) instead of building a parallel GitHub UI; a one-glance header chip keeps presence light.
- **Cause → effect is visible**: working tree → commit → push ("Pushed to GitHub · saas-analytics · main · a81d3f2 … (simulated)") → PR (Base/Compare) → checks → merge is one coherent, narratable loop — and deployment now closes it: push → deploy → "Deployment ready" → live app, with GitHub branch/commit carried straight into each deployment record.
- **Deployment as a product action, not a DevOps console**: the Deploy CTA lives in the workspace header with a simple-first dialog (Project/Environment/Branch/Commit); advanced settings, logs, and history sit behind progressive disclosure in developer surfaces, so a non-technical user only ever sees Deploy → Deploying… → Live. The simulated live URL is always labeled so the prototype never claims a real service.

## Why These Decisions Were Made

- **Next.js**: full-stack path without a framework switch; App Router, SSR/static + client interactivity; Vercel-friendly; industry standard.
- **TypeScript strict**: safety for a growing state model, better tooling, interview expectation.
- **Tailwind**: velocity + a deliberate custom palette (ink/coral/mint) that avoids the generic "AI SaaS" look.
- **Simulated agents**: deliver the full product UX and story without credential, cost, or safety risk during a bounded prototype.
- **Client-only state**: the build lifecycle is one-screen interaction; a store/backend is only worth adding once state is shared or persisted. Tabs and git/env local state follow the same rule.
- **No new dependencies**: everything is achievable with React + Next + Tailwind + lucide-react.
- **No dangerous browser capabilities**: dev tools are simulated instead of wired to `child_process`, real git, `.env` files, or the filesystem — the prototype never hands the browser arbitrary execution, secret access, or repo mutation. The GitHub flow extends this rule: no OAuth flow, no token, no API calls from the browser. So does deployment: no build execution, no provider credentials, no real hosting — the Deploy pipeline runs as a labeled, deterministic local simulation.

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

1. **What would production architecture look like?** Next.js API + BullMQ workers + Docker sandbox + Postgres/Redis + object storage + SSE/WebSocket; GitHub for version control; Auth.js for sessions; Vercel/Netlify build hooks or GitHub Actions for deploys; Sentry for monitoring.
2. **Why no middleware in the prototype?** The mock session lives in localStorage; middleware runs server-side and can't read it. The mounted gate prevents redirect flashes. With cookies, `middleware.ts` would handle gating server-side.
3. **How do you keep the prototype swapping to real services?** Adapters: `lib/auth.ts`, `data/`, typed models, and prop-driven components define boundaries; a real integration replaces the implementation behind the same shape.
4. **Data model for builds?** `Project(1) → BuildRun(1→n) → Activity(n)`; activities are the source for plan/agent/file/history projections.
5. **Scalability of the current app?** Static export except `/workspace`; no server state; a backend can be added behind API routes incrementally.

## Mocked-Functionality Questions

1. **What's mocked?** Auth accounts, projects/templates, agents, the build lifecycle, file changes, code/terminal content, npm/git command output, commits/pushes/branches, environment variables, preview updates, metrics, error trigger, the entire GitHub layer (OAuth consent, repositories, branch switching/creation, sync, pushes, pull requests and merges, checks, identity @abhay-demo), and the entire deployment layer (build/deploy commands, environments, live URLs, logs, durations, CI/CD, auto-deploy, env vars, failure).
2. **How do you mark mocks honestly?** UI labels ("Prototype mode", "Build activity is simulated", "Read-only prototype", "Simulated terminal", "Source control is simulated in prototype mode.", "Environment values are simulated in prototype mode.", "GitHub connection is simulated in prototype mode.", "Pull request is simulated…", "Merge is simulated…") and this docs file.
3. **What breaks if you remove the timer?** The lifecycle never advances — which is exactly what a real event source must replace; the component already accepts events conceptually.
4. **Is the preview changed by the prompt?** No. The prompt seeds the initial instruction and composer, but the sample preview stays static; the UI states checks haven't changed it.
5. **Can a user really commit or push?** No — locally simulated only. Commits (random hash prepended to a local history array) and pushes (a `pushedHead` recorded in the GitHub snapshot) live in browser state and reset on a cleared localStorage; nothing touches a real repository and no token is ever requested or stored.

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

## Phase 5 / GitHub Integration Q&A

### Why is GitHub important for an AI-builder product like Architect?
Because AI-generated code only becomes trustworthy and collaborative once it enters a real developer loop. GitHub provides: version history (every build = a commit), review (pull requests + checks) so generated work is vetted before it ships, and a collaboration surface (branches, issues, reviews) for humans and agents to work together. For a product story, "Architect built it" needs to lead to "…and it is versioned, reviewed, and deployable" — that is what the GitHub integration narrates.

### How would real GitHub OAuth work here?
Create a GitHub App (or OAuth App) registered with redirect URL `/api/auth/github/callback`. The Connect button redirects to GitHub's consent screen with the requested scopes; GitHub returns an authorization code to the callback; the backend exchange exchanges it for an access token (PKCE for public clients, or confidential client secret) and stores it server-side; the frontend receives only an identity + a session. The prototype's simulated permission screen mocks exactly this ceremony.

### Why must the browser never hold a GitHub token?
Any token in the browser is exfiltratable by XSS, exposed browser extensions, or devtools, and it can be impersonated by third-party scripts. GitHub tokens grant real write access to repositories. The secure pattern is: frontend talks only to your API, the API holds the user's token (encrypted at rest, scoped, short-lived with refresh), and every mutating call is authorizable server-side. The prototype honors this by never even asking for a token.

### How would repositories be fetched in production?
`GET /api/github/repositories` on your server calls the GitHub API with the stored user token (`GET /user/repos?affiliation=owner,collaborator`), filters on your product's needs, and returns a typed list the picker already renders (`GithubRepository` maps to `{ id, name, owner, visibility, defaultBranch, branches }`). Branches load per repo via `GET /repos/:owner/:name/branches`, cached briefly because that endpoint is chatty.

### How does branch state stay in sync in production?
The single source of branch truth is the server's repo state: when the user selects a repo/branch, the server returns the canonical default branch and the live branch list (the picker's `mergeBranches` handles locally-created names). Switching branches re-fetches the tree/latest commit; a webhook or short poll updates the "pushed head / up to date / N ahead" status instead of the local snapshot.

### How do local git commits map to GitHub?
The local working tree → staged → commit → history model in GitPanel is exactly what a real git integration exposes. In production the sandbox's git repo has the GitHub remote configured; "Commit" runs a real `git commit`, and "Push" runs `git push origin <branch>` using a credential helper, then records the pushed HEAD so the UI can show "Pushed to GitHub · repo · branch · hash message". The prototype just stores `pushedHead` — same shape, no remote.

### How does pull request creation work in production?
The form already collects Base/Compare/Title/Description. Production normalizes the branch refs (protect against `base === compare`), calls `POST /repos/:owner/:name/pulls` with the stored token, then treats the returned PR number as the id — the details view (author, commits, changed files, checks, status) renders from `GET /pulls/:number`. Webhooks (see below) keep that view live.

### How does GitHub Actions integrate?
Checks are the visible contract: production subscribes to `check_run` and `check_suite` events (or polls `GET /commits/:ref/status`), so `GithubChecks` shows real per-commit statuses (queued/in_progress/completed, per-check) instead of the four static passing "Architect checks". A generated app could even receive a workflow file as part of the build so CI validates each new commit.

### How would webhooks update the UI in real time?
On push, open a PR, or merge, GitHub fires a webhook to your server (`/api/webhooks/github`); the server validates the SHA-256 signature, updates the run/project record, and broadcasts an event over SSE/WebSocket to subscribed clients. The prototypes's `sync()` phases (Syncing → Checking → Comparing) and the PR status badge are the exact points where those pushed events would be rendered.

### What about GitHub rate limits?
Unauthenticated API usage is dead in minutes (60 req/hr); with a token you get 5,000/hr. Repos, branches, and check statuses are chatty, so production caches them (Redis, TTL) and batches stats into a project summary the UI reads instead of firing one call per box. The prototype sidesteps this entirely by never calling the API.

### What permission scopes are needed?
Minimal: `repo` (or narrower `repo` subsets for private-repo read/write + pull requests) and `user:email` if we ever display account emails. Read-only surfaces could use `public_repo`. The connection modal's three permission rows (read repos / create & update PRs / manage deploy keys) are the honest version of this scope ask, shown before consent rather than hidden in a popup.

### Where are tokens stored, and how are they protected?
Server-side only — encrypted at rest, swapped for short-lived access tokens with refresh, scoped to the minimum, deletable (revoke). The browser holds a session cookie or short-lived session token, never the GitHub token. The prototype's "stored only in this browser under `architect-demo-github`" note is the conscious opposite of the production design, chosen precisely because nothing real is stored.

### How does local git state relate to the new GitHub integration?
GitHub is a remote-facing layer over the existing local simulation: local `changes`/`commits` stay in `WorkspaceShell` (lifted from `GitPanel` as controlled props), while `useGithubState` owns everything remote (connection, repo, branch, pushed head, PRs) in one persisted snapshot shared by the header, GitPanel, and `/github`. Both surfaces read the same branch value — that single source of truth is what production would get from the server.

### Why mock GitHub at all instead of leaving a placeholder?
A placeholder tells no product story; a proven integration tells the real flow and lets an interviewer see the exact UX a real GitHub feature will have. Mocking it with a typed snapshot + adapters costs nothing real and keeps the "no tokens in the browser" boundary honest while reproducing the connect → repo → branch → push → PR → checks → merge loop end-to-end.

### What is the production upgrade path for this mock?
1) GitHub App OAuth via `/app/api/github/*` with server-side token storage. 2) Replace `lib/github-storage.ts` persistence with API calls for the same snapshot fields. 3) Real pushes in the sandbox git with a remote; capture pushed HEAD server-side. 4) PR and check endpoints wired to `PullRequestForm`/`PullRequestDetails`/`GithubChecks`. 5) Webhooks + SSE to make `sync()` and status badges live. The data model (`GithubSnapshot`, `GithubPullRequest`, `GithubCheck`) is the API contract, so components change as little as possible.

## Phase 6 / Deployment Q&A

### Why simulate the deployment experience rather than showing a placeholder?
A placeholder tells an interviewer nothing about the product. Deployment is the final beat of the Architect loop — build → preview → version → publish → live — and presenting it as a real, clickable flow shows the exact UX a production feature will have (Deploy → Deploying… → Deployment ready → live app) with zero infrastructure risk: no credentials, no builds run anywhere, no cloud accounts. The typed snapshot + config adapter is the seam a real provider swaps in behind.

### How would a real deployment be implemented?
The deterministic timer would be replaced by a provider adapter: the frontend calls `POST /api/deployments` with the `DeploymentConfig`, the server triggers the build (Vercel/Netlify build hook, GitHub Actions workflow on push, or our own CI runner), and build/deploy status streams back over SSE/WebSocket so the same progress timeline and logs render from real events. Record fields map 1:1 to the provider's deployment object (id, branch, commit, status, url, duration).

### Where does GitHub fit in the real deployment flow?
GitHub is the trigger and the artifact source. "Auto deploy from GitHub" listens for pushes on the production branch (via webhook); a push fires the deploy. In production, push → `POST /api/deployments { branch, commitSha }` → CI builds exactly that commit → status events stream back. The prototype already stores `branch` + `commitSha` from shared GitHub state, so the connection between push, PR merge, and deploy is modeled even though no webhook runs.

### How would deployment credentials stay secure?
The browser would never hold them. Build config and provider tokens live server-side, encrypted at rest, issued with short-lived, scoped credentials (deploy permission only, per-project), and revocable. Secrets for the app's runtime (like `OPENAI_API_KEY`) are injected by the provider at build/deploy time from its secret store — the prototype's masked environment-variable rows are the honest, never-stored version of that.

### How would you handle environment variables for deployments?
Per-environment secret sets (production/preview) stored in the provider's encrypted secret store, referenced by name in build config, injected at build and runtime, never returned to the frontend. The UI only ever shows masked placeholder rows ("OPENAI_API_KEY •••••••••• Configured"); no value is ever stored in the browser.

### How would deployment logs stream in real time?
Provider build logs arrive over SSE/WebSocket as line events `{ stream: "stdout"|"stderr", text }` and append to the record. The prototype's human-readable lines ("Preparing application", "Running production build", "Publishing deployment") are the sanitized, user-facing projection of that stream — real logs are verbose and technical, so production would keep raw logs behind a "raw" toggle and keep the product view human.

### How would rollback work?
A deployment record is immutable, so rollback = redeploying any prior ready record (its id, branch, commit, and config are all stored). The "Redeploy" action already models this; production would add a confirm + pinned URL.

### How do preview deployments work?
Every non-production branch gets a preview environment with its own URL (`preview--saas-analytics.architect-demo.app` in the prototype). Production would deploy per pull request/branch, give each a unique preview URL, and wire them to PR checks — the seed preview record (dep-2, feature/dashboard) demonstrates the coexistence of production and preview environments today.

### How do you associate deployments with commits?
Each record stores `commitSha` (+ branch). On production, the server resolves it to a GitHub commit and links it; push/PR events with a sha create the association automatically. The prototype reads the shared GitHub pushed-head/commit rather than duplicating state — a deployment can be traced to the exact push that created it.

### How would you prevent arbitrary code execution during a build?
Builds run in ephemeral, disposable sandboxes: no outbound network after dependency install (or an allowlisted registry proxy), CPU/memory/disk quotas, read-only mounts, no host access, short TTL, image-based toolchains. Deploy steps are an allowlisted pipeline (install → build → artifact upload) — a user-supplied string is never executed on the host. The prototype executes nothing at all.

### What is the difference between production and preview environments?
Same pipeline, different rollouts: production is the stable face (release gate, secrets, rollback, monitoring, no auto-redeploy without approval); previews are cheap, ephemeral, per-branch, deliberately throwaway. The prototype distinguishes them by environment + URL and keeps production as the primary header surface.

### Why does the non-technical flow hide configuration and logs?
To obey "simple by default, powerful when needed." A creator should experience deploy as one click ("Deploy" → "Deployment ready — your app is live"); framework, build command, output directory, auto-deploy, and masked env vars only appear behind "Advanced settings" in developer surfaces. Hiding the machinery is the point — the product translates for them, the developer opens the hood.

### What is the production upgrade path for this mock?
1) `POST /api/deployments` + provider adapters behind `deployment-storage.ts`. 2) Stream real build/deploy status + logs over SSE into `DeploymentProgress`/`DeploymentLogs`. 3) Resolve real per-deployment URLs; label/link Preview and Production environments. 4) Webhook-driven auto-deploy on push/merge with branch+commit association. 5) Server-side secret store + per-environment variables. The `DeploymentSnapshot`/`DeploymentConfig`/`DeploymentRecord` types are the API contract, so the UI changes as little as possible — the same principle the GitHub phase used.