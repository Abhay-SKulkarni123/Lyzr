# Architect 2.0

**Build applications with natural language — simple by default, powerful when needed.**

## Overview

Architect 2.0 is a next-generation vibe-coding platform that serves both non-technical users (who want to build apps through prompts) and technical developers (who want full control over code, files, agents, GitHub, environment, and deployment).

## Product Vision

Democratize application building by bridging the gap between natural-language prompting and professional-grade developer tooling.

## Key Features

- **Natural Language Prompting**: Describe your app in plain English; the system builds it
- **Progressive Complexity**: Simple UI for beginners, deep controls for developers
- **Agent Activity**: Watch AI agents work in real-time with transparent logs
- **Continuous Preview**: Live preview updates as code changes
- **IDE-Style Workspace**: File tree, code editor, terminal, and deployment panel in one view
- **One-Click Deploy**: Deploy to production or staging with a single action

## User Types

### Non-Technical Creators
- Idea → Prompt → Build → Preview → Deploy
- No coding knowledge required

### Technical Developers
- Prompt → Plan → Agents → Files → Code → Terminal → Git → Environment → Deploy
- Full control over every aspect

## Tech Stack

- **Next.js 14** — App Router, server components, API routes
- **TypeScript** — Strict type checking
- **Tailwind CSS** — Custom design system (ink, slate, zinc, sand, coral, mint, amber)
- **Monaco Editor** — VS Code-powered code editing
- **shadcn/ui** — Accessible UI primitives (planned)
- **Lucide React** — Tree-shakeable icon library

## Architecture

- **Frontend-first**: All functionality achievable in the browser
- **Mock data layer**: Type-safe mock data in `data/` folder, adaptable to real APIs
- **Component-based**: Modular, reusable components across features
- **Progressive disclosure**: Advanced features hidden until needed

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

**Phase 1 — Architect Workspace**: The `/workspace` route now demonstrates the prompt → simulated build → sample preview experience, with project files and read-only Code/Terminal views. It is a frontend prototype; prompts do not generate or change the sample app.

## Mocked vs Functional Features

| Feature | Status |
|---------|--------|
| Workspace navigation and responsive layout | ✅ Functional |
| Prompt entry and timed build-state interaction | 🔧 Functional prototype |
| Generated-app preview | 📋 Static sample; not generated from prompts |
| File explorer and read-only code samples | 🔧 Functional prototype over mock data |
| Terminal output | 📋 Static sample; commands do not execute |
| Build activity | 📋 Simulated; no AI agents or real checks |
| GitHub, deployment, authentication, backend | ⏳ Deferred / not connected |

## Future Improvements

- Later phases: editable code and real file state, agent orchestration, executable sandbox/terminal, GitHub, deployment, authentication, and backend services
