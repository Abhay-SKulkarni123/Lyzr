# LYZR Architect 2.0

Build applications with natural language. Simple by default, powerful when needed.

## Overview

Architect 2.0 is an interactive, frontend-only prototype of a natural-language application builder. It serves two personas on one canvas: non-technical creators describe an app in plain language and watch a structured build, preview, and deployment; technical developers opt into developer tooling to inspect the generated plan, agents, files, code, terminal, version control, environment, and deployment workflow.

Every product surface is a deterministic, locally simulated workflow. Nothing calls a real AI service, backend, git host, or cloud provider. The prototype is built to demonstrate the full product experience with zero credentials, network calls, or external dependencies.

## Product Vision

Democratize application building by bridging natural-language prompting and professional-grade developer tooling. One workspace, progressive complexity: a creator sees prompt to build to result, and a developer can open the hood without forking the experience.

## Core Experience

- **Describe.** Start from a sample prompt on the landing page or type your own. The composer stays available after every build so iteration is first-class.
- **Build.** A simulated agentic lifecycle progresses through understanding, planning, building, and checking, driven by four named agents: Architect, UI Builder, Data Agent, and QA Agent. Progress is transparent and human-readable, never technical log noise.
- **Preview.** A per-scenario mock application renders continuously during and after a build, with preview state clearly communicated.
- **Iterate.** After a build completes, the composer invites the next change. Every run appends to recent instructions and a versioned build history with a human change summary.
- **Go deeper.** An opt-in Developer mode reveals the code-first surface: file explorer, tabbed code editor, simulated terminal, source control, environment variables, and developer settings.
- **Ship.** A simulated Git to GitHub to deployment loop closes the product narrative, ending in a clearly labeled live application view.

## Key Capabilities

- **Natural-language prompting** with a keyword-based scenario resolver and four seeded build scenarios.
- **Import an existing project**: a mocked import flow for GitHub repositories and uploaded code, with framework detection and workspace readiness.
- **Custom agent builder**: create team agents in any framework (LangGraph, CrewAI, OpenAI Agents SDK, and others) with model, tool, and instruction scoping. Simulated.
- **Deterministic build lifecycle** with a typed state machine, plan steps, agent activity, file activity, build history, and retry on a deterministically triggered error state.
- **Continuous preview** shared between the workspace and the live deployment view.
- **IDE-style workspace**: recursive file explorer, tabbed read-only code editor, simulated terminal (whitelist-routed, canned output only), simulated source control, and masked environment variables.
- **Simulated GitHub integration**: connection ceremony, repository and branch pickers, sync, push, pull requests, checks, and merge, backed by one persisted state model.
- **Simulated deployment**: deploy from the workspace header, simple-first configuration dialog, progress timeline with human-readable logs, deterministic failure demo with retry, deployment history, and a live application view.
- **Mock authentication**: simulated Google/GitHub sign-in and an email flow, with a per-tab session.
- **Persistent preferences**: the default build view preference is stored in the browser.

## Product Architecture

**Frontend-first, zero backend.** The application runs entirely in the browser on Next.js App Router, React, and TypeScript. Mock data, typed state models, and browser storage helpers define the seams where real services would be attached.

- **Routes.** Public landing and auth routes, auth-gated dashboard routes, a deep-linkable workspace, and standalone agents, GitHub, and deployments pages.
- **Build state machine.** The workspace owns a typed status union (`idle | understanding | planning | building | checking | complete | error`) and walks a data-driven recipe of ordered phases and activities on a timer. All plan, agent, and file states are derived from a single active step rather than scattered booleans.
- **Data-driven fixtures.** `data/` holds typed recipes, scenarios, file trees, code samples, terminal, git, environment, GitHub, and deployment fixtures. Components render data; they do not hardcode product logic.
- **Shared persisted state.** Single typed snapshots back the GitHub integration and the deployment experience, persisted under `architect-demo-*` keys and shared across routes so navigation never creates disconnected mock universes.
- **Storage contract.** The sign-in session is stored in `sessionStorage`; preferences and the simulated GitHub, deployment, and project-context snapshots use `localStorage`. Nothing is stored on a server.
- **Component strategy.** Small, focused presentational components receive props from a small number of state-owning containers. No shared store library.

## User Experience

- **Progressive complexity.** The default workspace shows prompt, preview, and build status. Plans, agents, file activity, and history are secondary; developer rails are opt-in.
- **Transparent, human activity.** Messages read like "Created dashboard navigation" or "Ran mobile spacing checks", never raw command output.
- **Context retention.** The preview stays visible during builds with a subtle updating indicator instead of a full-screen loader.
- **Iteration as a product.** Ongoing prompts, recent instructions, and a versioned build history treat the application as a living artifact.
- **Honest simulation.** Every simulated surface carries a persistent label ("Simulated terminal", "GitHub connection is simulated in prototype mode.", "Deployment is simulated in prototype mode."). No real capability is claimed.
- **Visual system.** A dark workspace theme (ink/charcoal surfaces) with coral as the primary accent, mint for success, amber for busy, and rose for errors. Inter and JetBrains Mono typography, Lucide icons.

## Scenarios

The scenario engine resolves a prompt to one of four deterministic build experiences:

| Scenario | Package | Simulated preview URL |
|---|---|---|
| SaaS Analytics | northstar-analytics | `https://saas-analytics.architect-demo.app` |
| Customer Support | deskflow | `https://support.architect-demo.app` |
| Project Management | sprintboard | `https://project.architect-demo.app` |
| Personal Finance | ledger-app | `https://finance.architect-demo.app` |

Each scenario provides an initial and an iteration build recipe, a file tree, code samples, a package name, git seed history, and terminal boot lines. Unmatched prompts fall back to the SaaS Analytics scenario.

## Mocked Integrations

All integrations are simulations and are labeled as such in the interface:

- **Authentication and OAuth.** Sign-in is mocked; no account data or passwords are transmitted.
- **Build and AI agents.** The lifecycle is a timer-driven simulation over fixture data. No LLM, no orchestration, no code generation.
- **Terminal.** Commands are routed through a whitelist that returns canned output. User input is never executed.
- **Version control.** Working tree, staging, commits, and history are local state only.
- **GitHub.** Connection, repositories, branches, sync, push, pull requests, checks, and merge are simulated. The browser never holds a token or touches a remote repository.
- **Deployment.** The pipeline, environments, logs, URLs, and failure behavior are deterministic local simulations. Simulated URLs do not resolve to real services.
- **Environment variables.** All values are masked mock strings; no real secrets are read or stored.

## Technology Stack

- **Node.js 18.17 or later** (the Next.js 14 requirement)
- **Next.js 14.2.5** with App Router, server and client components, and one API route
- **React 18.3.1** and **TypeScript 5.4.5** (strict)
- **Tailwind CSS 3.4.4** with a custom design system (ink, slate, zinc, sand, coral, mint, amber) via PostCSS and Autoprefixer
- **lucide-react** for icons
- **ESLint 8.57.0** with `eslint-config-next`
- No additional runtime dependencies, no environment variables, and no database

## Project Structure

```
app/                    Routes: landing, auth, dashboard hub, workspace, agents,
                        GitHub, deployments, live view, API route
components/             workspace/, github/, deployment/, dashboard/, auth/, shared/
data/                   Typed fixtures: scenarios, builds, developer, github,
                        deployment, projects, templates
lib/                    auth session and browser-storage helpers
types/                  Reserved for shared types
docs/                   MASTER_NOTES.md and INTERVIEW_PREP.md (internal)
```

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). No `.env` file or external service is required. Use the simulated sign-in options or the email flow; the session is held in `sessionStorage` for the current browser tab.

### Validation

```bash
npm run type-check   # TypeScript strict check
npm run lint         # ESLint
npm run build        # Production build
```

Run a production server with `npm run start` after building.

## Application Routes

| Route | Purpose |
|---|---|
| `/` | Landing page with sample prompts and sign-in |
| `/login`, `/signup` | Mock authentication |
| `/dashboard`, `/projects`, `/templates`, `/settings` | Dashboard hub over fixture data |
| `/workspace` | The build experience; deep-linkable via `?prompt=` and `?new=` |
| `/agents` | Agent overview over fixture data |
| `/github` | Simulated GitHub integration workspace |
| `/deployments` | Deployment overview, configuration, history |
| `/deployments/live` | Live application view (clearly labeled as simulated) |
| `/api/session-scope` | Server-side scope id used to bind the browser session |

## Product Decisions

- **Simulated over real.** A deterministic, labeled simulation delivers the full product and interaction design with zero credential, cost, or safety risk. Typed models are the seams where real services attach later.
- **Progressive complexity.** Developer tooling is opt-in; the default surface stays simple for non-technical users.
- **Single client-owned state machine.** One container owns the build lifecycle; the UI derives statuses from a single active step. A reducer or backend stream is the upgrade path.
- **No dangerous browser capabilities.** The prototype never executes commands, mutates files, or holds secrets. The terminal is whitelist-routed, and git, environment, GitHub, and deployment surfaces are labeled simulations.
- **One shared state model per integration.** The GitHub and deployment experiences each use a single persisted snapshot shared across routes, so navigation preserves connection, repository, branch, and deployment records.
- **Data-driven fixtures.** All product content lives in typed `data/` files, keeping components presentational and testable.
- **Honest labeling.** Every simulated surface states its prototype status so nothing is mistaken for real infrastructure.
- **No feature bloat.** No new dependencies, no dead controls, and a small palette keep the prototype focused and maintainable.

## Current Status

The complete product loop is implemented as an interactive, clearly labeled prototype: landing, mock authentication, dashboard hub, a workspace that simulates the full build experience, agents, GitHub, deployments, and a live application view. The codebase is validated with strict TypeScript checks, ESLint, a production build, and a production-server smoke test across all routes.

## Known Limitations

- Build activity, agent behavior, preview updates, file changes, and code samples are simulated; prompts seed the experience but never drive real generation.
- Scenario selection is keyword-based and deterministic; four seeded scenarios are the only prompts that change which application is built.
- The preview, files, and code are read-only and static; builds do not alter them.
- Terminal, git, environment variables, GitHub, and deployment are fully simulated: no execution, no network, no remote repositories, no cloud infrastructure, and no real credentials.
- State is per-browser and mostly volatile. Only the `architect-demo-*` keys (session, preferences, GitHub snapshot, deployment snapshot, project context) persist.
- There is no backend, database, authentication middleware, automated test suite, or full accessibility audit.

## Future Direction

- **Real build orchestration**: a server-driven state machine streaming events over SSE or WebSocket to the existing UI.
- **Semantic scenario resolution**: replace keyword matching with an LLM classifier or an explicit project picker.
- **Sandboxed execution**: ephemeral containers for generated code, real file persistence, and a genuinely live preview.
- **Real GitHub**: OAuth with server-side token storage, real repositories, pushes, pull requests, and checks behind the existing typed adapter.
- **Real deployment**: provider adapters (Vercel, Netlify, GitHub Actions), streamed build logs, and production environments behind the existing configuration model.
- **Real authentication**: Auth.js with HTTP-only cookies and middleware gating.

The mock boundaries in `data/`, `lib/`, and the typed state models are designed to be replaced by adapters, not rewritten.

## Assignment Context

Architect 2.0 is a self-contained frontend engineering exercise: a deliberately scoped, interactive prototype built to demonstrate product thinking, interaction design, and application architecture without requiring external services, credentials, or infrastructure. Master notes and interview preparation material live in `docs/`.

## Author / Repository

**Author:** Abhay S Kulkarni

**Repository:** [https://github.com/Abhay-SKulkarni123/Lyzr](https://github.com/Abhay-SKulkarni123/Lyzr)