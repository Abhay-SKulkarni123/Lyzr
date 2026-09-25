# Architect 2.0

**Build applications with natural language — simple by default, powerful when needed.**

## Overview

Architect 2.0 is a next-generation vibe-coding prototype that serves both non-technical users (who want to build apps through prompts) and technical developers (who want full control over code, files, agents, GitHub, environment, and deployment).

## Product Vision

Democratize application building by bridging the gap between natural-language prompting and professional-grade developer tooling.

## Key Features

- **Natural Language Prompting**: Describe your app in plain English; the system builds it
- **Progressive Complexity**: Simple UI for beginners, deep controls for developers (developer mode)
- **Scenario-Driven Builds**: Seeded demos simulate a build lifecycle — prompt, plan, activity, status, and result
- **Continuous Preview**: Live preview of the built app with code/preview switching after a build
- **IDE-Style Workspace**: File tree, simulated code editor, terminal, environment, and Git panels
- **Simulated Deploy & GitHub**: Mocked deploy flows and GitHub connection with honest "simulated" labels
- **Persistence**: Auth session and the build-view preference persist in the browser

## User Types

### Non-Technical Creators
- Idea → Prompt → Build → Preview → Deploy
- No coding knowledge required

### Technical Developers
- Prompt → Plan → Agents → Files → Code → Terminal → Git → Environment → Deploy
- Progressive access behind a developer-mode toggle, still fully simulated

## Tech Stack

- **Next.js 14** — App Router, client components, and API routes
- **TypeScript** — Strict type checking
- **Tailwind CSS** — Custom design system (ink, slate, zinc, sand, coral, mint, amber)
- **Lucide React** — Tree-shakeable icon library
- **React** — Components, hooks, and context for mock state

## Architecture

- **Frontend-first**: Everything runs in the browser — no backend required
- **Mock data layer**: Type-safe mock data in `data/`, adaptable to real APIs later
- **Component-based**: Modular, reusable components across features
- **Progressive disclosure**: Developer features hidden until the toggle is enabled
- **Scenario identity**: Each project has a fixed scenario id; previews and version history are derived deterministically from mock data

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Type check
npm run type-check

# Lint
npm run lint

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Current Status

The full product flow is in place as an interactive prototype: the landing page, a mocked sign-in/sign-up flow, a dashboard hub (`/dashboard`, `/projects`, `/templates`, `/settings`), a workspace that simulates build activity and previews, an agents page, a GitHub page, and a deployments page. All simulations are labeled honestly; nothing calls a real backend, AI model, GitHub, or deploy service.

## Mocked vs Functional Features

| Feature | Status |
|---------|--------|
| Landing, navigation, responsive layout | ✅ Functional |
| Prompt entry and seeded build-state interaction | 🔧 Functional prototype |
| Mock sign-in / sign-up (`/login`, `/signup`) | 🔧 Functional prototype (sessionStorage session) |
| Dashboard hub, projects, templates, settings | 🔧 Functional prototype over mock data |
| New Project modal and workspace seeding (`?prompt=`/`?project=`) | 🔧 Functional prototype |
| Settings "default view after build" preference | 🔧 Functional prototype (localStorage) |
| Generated-app preview | 📋 Static sample; not generated from prompts |
| File explorer and read-only code samples | 🔧 Functional prototype over mock data |
| Terminal output | 📋 Static sample; commands do not execute |
| Build activity | 📋 Simulated; no AI agents or real checks |
| Agents orchestration page | 🔧 Simulated over mock data; no real agents |
| GitHub connection and pull requests | 🔧 Simulated over mock data; not connected |
| Deployment to preview/production | 🔧 Simulated over mock data; not deployed |
| Real accounts, backend services | ⏳ Deferred / not connected |

## Future Improvements

- Editable code and a real sandbox/terminal
- Real AI agent orchestration and generated (not seeded) app output
- Real GitHub integration, deployment, authentication, and backend services