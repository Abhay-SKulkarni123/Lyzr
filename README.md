# LYZR Architect 2.0

> Build applications with natural language. Simple by default, powerful when needed.

Architect 2.0 is an interactive prototype of a natural-language application builder. It serves two personas through one product: nontechnical creators describe an application and let it build, preview, and deploy, while technical developers can opt into deeper tooling to inspect plans, agents, files, code, and infrastructure. Both personas use the same workspace, and complexity is revealed progressively instead of being exposed up front.

## Live Demo

**Live Application:** [https://lyzr-architect20.vercel.app/](https://lyzr-architect20.vercel.app/)

**GitHub Repository:** [https://github.com/Abhay-SKulkarni123/Lyzr](https://github.com/Abhay-SKulkarni123/Lyzr)

**Prototype:** AI generation, authentication, terminal execution, GitHub integration, and deployment are simulated in this prototype.

## Overview

Traditional application development forces nontechnical people to navigate implementation detail they should never need to see, while developer-oriented AI tools tend to surface technical concepts too early and confuse new users. Architect 2.0 addresses both problems with progressive complexity: the same product presents a simple creative flow by default and reveals professional tooling only when the user wants it.

For creators, the product takes an idea in natural language, runs a structured build, and leads to a preview, iteration, and deployment. For developers, the same build opens into deeper layers: the plan, agent activity, generated files, source code, developer tooling, Git state, environment variables, GitHub, and deployment. These are two levels of one product, not two products.

## Product Vision

The product principle is simple by default, powerful when needed. Everything else follows from it.

- **Progressive complexity.** The default surface is a prompt, a build, and a preview. Advanced rails are opt-in and stay out of the way until they are useful.
- **Unified workspace.** Both personas live in the same application. A creator and a developer are working with the same project, the same context, and the same outcome.
- **Agent transparency.** The build makes visible what the underlying agents are doing, in language a normal person can read.
- **Continuous preview.** The result of the application is always within reach, not hidden behind source code.
- **Built-in deployment.** Shipping is part of the product rather than a separate skill.

These principles keep the creator path short and the developer path deep, without forcing either to switch products.

## Core Experience

### Creator Journey

`Idea → Prompt → Build → Preview → Iterate → Deploy → Live`

- **Idea.** Users start with a product idea or one of the available sample prompts.
- **Prompt.** Users describe what they want in natural language, with no schema or configuration required.
- **Build.** The prototype presents a structured build lifecycle with understandable activity as it progresses.
- **Preview.** Users see the application result directly, without needing to inspect source code.
- **Iterate.** The prompt composer stays available so users can continue refining the application in follow-up builds.
- **Deploy.** Users move through the simulated deployment flow when the application is ready.
- **Live.** The result is represented through a simulated live application view.

### Developer Journey

`Prompt → Plan → Agents → Files → Code → Terminal → Git → Environment → Deploy`

Developer Mode exposes the deeper application-building controls without replacing the simpler Architect experience. Developers can review the plan the build produced, watch the agents that executed it, and then open the generated file tree, code, simulated terminal, source control, environment variables, and deployment workflow. The creator flow and the developer flow run on the same project state.

## Key Capabilities

### Natural-language prompting

Users describe applications in natural language and start deterministic prototype build experiences. The composer accepts free-form prompts and resolves them to a build scenario.

### Build lifecycle

The build flow represents a structured lifecycle: understanding, planning, building, checking, and complete or error. Each phase is driven by typed state rather than scattered interface flags, and the workspace derives every activity view from the active phase.

### Agent transparency

The prototype includes four built-in simulated agents: Architect, UI Builder, Data Agent, and QA Agent. Agent activity is presented as human-readable product activity such as "Created dashboard navigation" rather than raw logs or command output.

### Continuous preview

The workspace keeps the application preview available throughout the build experience, updating as the build progresses so the user always sees the current result state.

### Developer Mode

Developer Mode exposes the code-facing layers: the file explorer, the code view, the terminal, source control, environment variables, and developer settings. It is a section of the same workspace, enabled deliberately by the user.

### Import Existing Project

An implemented, simulated import flow lets users bring existing work into Architect. It supports:

- a GitHub repository URL
- uploaded project code
- framework detection
- staged import progress
- workspace preparation

The import step recognizes these frameworks: Next.js, React (Vite), Vue, Svelte, Astro, and Static HTML. The imported project lands in the workspace ready for further prompting and is marked as a simulated import in the interface.

### Custom Agent Builder

An implemented flow for creating custom team agents. Users configure:

- framework
- model
- tools
- instructions

Supported agent frameworks are LangGraph, CrewAI, OpenAI Agents SDK, Vercel v0, and Custom runtime. Created agents appear in the agent roster clearly marked as simulated.

### GitHub

A simulated GitHub workflow covers connection, repository selection, branch selection, sync, push, pull request, checks, and merge. The whole flow is local state: no browser token is held and no remote repository is touched.

### Deployment

A simulated deployment workflow covers deployment configuration, environment selection, progress, logs, failure and retry behavior, deployment history, and a live application view. Simulated deployment URLs do not resolve to real services.

### Authentication

Simulated authentication covers email, Google, and GitHub sign-in options. No account is created externally and no credentials leave the browser.

### Projects

Projects can be listed, created, reopened, and carry a scenario identity that keeps the rest of the product coherent with the project that launched it.

### Templates

Scenario-aligned templates are available to seed a project quickly from a predefined starting point.

### Scenario-driven experiences

The prototype ships four distinct application scenarios and maintains scenario identity across workspace, files, code, GitHub, and deployment, so a project stays internally consistent as the user navigates.

## Supported Scenarios

The prompt engine resolves input to one of four seeded scenarios. Each scenario has a distinct build recipe, preview, file tree, code samples, package identity, Git seed state, and deployment context.

| Scenario | Product | Simulated preview URL |
|---|---|---|
| SaaS Analytics | Northstar Analytics | `https://saas-analytics.architect-demo.app` |
| Customer Support | Deskflow | `https://support.architect-demo.app` |
| Project Management | Sprintboard | `https://project.architect-demo.app` |
| Personal Finance | Ledger App | `https://finance.architect-demo.app` |

The URLs above are simulated prototype URLs. Project-level scenario identity keeps the experience consistent across the workspace, files, code, GitHub, and deployment for whichever scenario is active.

## Product Architecture

### Frontend-first architecture

The application is built with Next.js App Router, React, and TypeScript and currently operates without a production backend. Everything runs in the browser against typed fixture data, which defines the seams where real services would attach later.

### Build state

The workspace own a typed build lifecycle: `idle`, `understanding`, `planning`, `building`, `checking`, `complete`, and `error`. Build activity is derived from this structured state rather than from scattered UI flags, so every panel stays consistent with the current phase.

### Data-driven fixtures

The data layer holds typed definitions for scenarios, builds, agents, projects, templates, developer state (files, code, terminal, environment), GitHub, and deployment. Components render this data; product logic lives in the fixtures and helpers rather than in the interface.

### Shared state

Project, GitHub, and deployment context is kept consistent across routes through shared snapshots, so navigating between the workspace, GitHub, and deployment pages never produces disconnected state.

### Browser storage

- The authentication session uses `sessionStorage`, which scopes the session to the current browser tab.
- Persistent prototype preferences and the project, GitHub, and deployment snapshots use `localStorage`.

No state is stored on a server, and the app runs with no environment variables required.

### Component architecture

The interface is composed of focused components grouped by feature, with state-owning containers and shared UI elements where appropriate. There is no shared store library; state flows through a small set of owners and browser-storage helpers.

## User Experience

### Progressive complexity

The default experience prioritizes the prompt, the build state, and the preview. Developer tooling is opt-in and only appears when the user reveals it.

### Preview-first

After a build completes, the user is directed toward the application result rather than being pushed into source code. The code-facing view is a deeper layer, not the default destination.

### Human-readable activity

Build activity describes useful actions in understandable language. Messages such as "Created dashboard navigation" or "Ran mobile spacing checks" replace raw log output.

### Iteration

The prompt remains available after a build, so users can keep refining the application instead of restarting from scratch. Iteration becomes a first-class part of the flow.

### Context retention

The preview and project context remain available as the user moves into deeper product surfaces, so navigation does not lose the thread of what is being built.

### Honest simulation

Simulated functionality is clearly identified in the interface with persistent prototype labels. Nothing real is implied, and every mocked surface states that it is simulated.

## Mocked Integrations

| Capability | Prototype behavior |
|---|---|
| Authentication | Simulated |
| AI/build orchestration | Deterministic simulation |
| Agents | Fixture-driven simulation |
| Terminal | Whitelisted canned output |
| Git | Local simulated state |
| GitHub | Simulated integration |
| Deployment | Deterministic simulation |
| Environment variables | Masked mock values |

The prototype intentionally avoids real credentials, external network calls, arbitrary command execution, remote repository mutations, cloud deployment infrastructure, and production authentication. The purpose is to demonstrate the complete interaction and product architecture while keeping external infrastructure boundaries isolated.

## Technology Stack

Verified against `package.json` and the source:

- **Node.js 18.17 or later** (the Next.js 14 requirement)
- **Next.js 14.2.5** with the App Router
- **React 18.3.1**
- **TypeScript 5.4.5** in strict mode
- **Tailwind CSS 3.4.4** with PostCSS and Autoprefixer
- **lucide-react** for icons
- **ESLint 8.57.0** with `eslint-config-next`

The repository does not include a production database, a backend service, real authentication infrastructure, real AI orchestration, Monaco Editor, a real GitHub SDK, or a real deployment provider. Those surfaces are simulated by design.

## Project Structure

```
app/           Application routes and pages
components/    Reusable UI and feature components
data/          Typed prototype data and scenario definitions
lib/           State and browser-storage helpers
types/         Reserved for shared types
docs/          Product notes and interview preparation
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later (the version Next.js 14 expects)
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The application is available at [http://localhost:3000](http://localhost:3000). No `.env` file is required; the prototype runs entirely on fixture data and browser storage. The optional `.env.example` documents variables reserved for future real integrations and is not used by the mock flows.

### Validation

```bash
npm run type-check
npm run lint
npm run build
```

### Production

```bash
npm run start
```

Run `npm run start` after a production build to serve the optimized application at `localhost:3000`.

## Application Routes

| Route | Purpose |
|---|---|
| `/` | Landing page |
| `/login` | Simulated authentication |
| `/signup` | Simulated authentication |
| `/dashboard` | Project dashboard |
| `/projects` | Project management |
| `/templates` | Template selection |
| `/settings` | Application settings |
| `/workspace` | Main application-building workspace |
| `/agents` | Agent overview and custom agent builder |
| `/github` | Simulated GitHub workflow |
| `/deployments` | Deployment management |
| `/deployments/live` | Simulated live application |

`/api/session-scope` is an internal API route that issues the server-side scope identifier used to bind the browser session.

## Product Decisions

### Progressive complexity

Keep the default product surface simple while allowing developers to reveal deeper tooling. One product serves both personas; the difference is elevation, not segmentation.

### Preview-first workflow

Make the application result the primary destination after a build rather than immediately exposing source code. Code and infrastructure are available below the surface for those who want them.

### Scenario-driven prototype

Use deterministic scenarios to demonstrate complete end-to-end product flows without requiring a real generation backend. The full journey from prompt to live view is reproducible in the prototype.

### Agent transparency

Expose what the simulated agents are doing rather than showing an opaque loading state. Activity is written for people, not for operators.

### Safe terminal

Keep terminal behavior simulated and whitelist-routed instead of executing arbitrary commands. The terminal demonstrates the interaction without any execution risk.

### Honest integrations

Clearly label simulated authentication, GitHub, terminal, Git, and deployment behavior. The interface never implies a real integration that is not there.

### Shared project state

Keep project context consistent across the workspace, GitHub, and deployment surfaces. One project identity spans all of it.

### Import and custom agent flows

Include Import Existing Project and Custom Agent Builder as extensions of the same progressive-complexity model. Both add depth on top of the default prompt-to-live flow.

## Current Status

Architect 2.0 is a complete interactive prototype demonstrating the major end-to-end product workflow: authentication, dashboard, projects, templates, project creation, project import, natural-language prompting, build lifecycle, build activity, agents, custom agent builder, Developer Mode, files, code, terminal, Git, environment variables, GitHub, deployment, and the live application view.

Validated as of the latest pass: TypeScript type-check passes, ESLint passes, the production build passes, and route smoke tests across application routes return successfully.

## Known Limitations

- AI generation is simulated.
- Build outputs are deterministic prototype data.
- Scenario resolution is deterministic and keyword-based.
- Preview, files, and code represent prototype content, not generated artifacts.
- Terminal commands are not executed.
- Git does not interact with a real repository.
- GitHub does not contact GitHub.
- Deployment does not provision real infrastructure.
- Authentication does not create real external accounts.
- There is no production backend or database.

These are deliberate prototype boundaries, not errors.

## Future Direction

- Real AI build orchestration
- Persistent generated projects
- Semantic project understanding
- Sandboxed code execution
- Real-time build events
- Real GitHub integration
- Real deployment providers
- Production authentication

## Assignment Context

Architect 2.0 was built as a product and engineering prototype for the LYZR hiring assignment. It demonstrates product thinking, interaction design, progressive complexity, AI-native workflow design, frontend architecture, and an end-to-end product flow, all within a self-contained, simulated environment.

## Author

**Abhay S Kulkarni**

**Repository:** [https://github.com/Abhay-SKulkarni123/Lyzr](https://github.com/Abhay-SKulkarni123/Lyzr)