# Architect 2.0 — Architecture

## Chosen Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 14 (App Router) | Full-stack React with file-based routing |
| Language | TypeScript | Type safety, IDE intelligence, interview-ready code |
| Styling | Tailwind CSS | Utility-first CSS, consistent design system |
| Components | shadcn/ui (planned) | Production-quality, accessible UI primitives |
| Icons | Lucide React | Consistent icon set, tree-shakeable |
| Validation | Zod (planned) | Schema validation for forms and data |
| HTTP | fetch / SWR (planned) | Data fetching with caching |
| Testing | Jest + React Testing Library (planned) | Unit and component tests |
| Git | GitHub CLI / gh CLI | Remote operations |

## Why This Stack

### Why Next.js?
- **Full-stack capabilities**: API routes allow future backend integration without changing frameworks
- **App Router**: File-system-based routing, server components for performance, client components for interactivity
- **Developer experience**: Zero-config setup, fast refresh, built-in CSS support
- **Deployment**: Optimized for Vercel, but works anywhere
- **Interview standard**: Widely used in industry — interviewers will understand it

### Why TypeScript?
- **Type safety**: Critical for complex state management and data flows
- **IDE support**: Autocomplete, refactoring, go-to-definition
- **Interview expectation**: Technical interviews expect typed code

### Why Tailwind CSS?
- **Design velocity**: Rapid UI development without writing custom CSS
- **Consistency**: Enforces a design system (spacing, colors, typography)
- **Coherency**: Avoids "generic AI SaaS look" by allowing precise, custom designs
- **Interview relevance**: Widely used in modern frontend teams

### Why shadcn/ui (where useful)?
- **Accessibility**: Pre-built, accessible components (Dialog, Dropdown, etc.)
- **Customization**: Components are copied into the codebase — full control
- **No lock-in**: Each component is owned by the project, not a black-box package

## High-Level Application Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Browser / Client                  │
│  ┌───────────────────────────────────────────────┐   │
│  │  Next.js App Router (React 18 + Server Comp)  │   │
│  │                                               │   │
│  │  ┌──────────┐  ┌──────────┐  ┌────────────┐  │   │
│  │  │ Dashboard │  │ Workspace │  │ Agent Panel│  │   │
│  │  │ (Browse) │  │ (Canvas)  │  │ (Sidebar)  │  │   │
│  │  └──────────┘  └──────────┘  └────────────┘  │   │
│  │                                               │   │
│  │  ┌──────────────────────────────────────────┐ │   │
│  │  │         Shared Component Library           │ │   │
│  │  │  (ui/, layout/, workspace/, agents/)     │ │   │
│  │  └──────────────────────────────────────────┘ │   │
│  │                                               │   │
│  │  ┌──────────────────────────────────────────┐ │   │
│  │  │              lib/ & types/               │ │   │
│  │  │  (Utilities, schemas, type definitions)  │ │   │
│  │  └──────────────────────────────────────────┘ │   │
│  │                                               │   │
│  │  ┌──────────────────────────────────────────┐ │   │
│  │  │               data/ (Mock)              │ │   │
│  │  │  (Simulated responses, seed data)       │ │   │
│  │  └──────────────────────────────────────────┘ │   │
│  │                                               │   │
│  │  ┌──────────────────────────────────────────┐ │   │
│  │  │         API Layer (Optional)             │ │   │
│  │  │  /app/api/* — stub endpoints for future   │ │   │
│  │  └──────────────────────────────────────────┘ │   │
│  └───────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Folder Structure

```
architect-2.0/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   ├── dashboard/                # Dashboard views
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── workspace/                # Main build/preview environment
│   │   ├── [id]/                 # Project-specific workspace
│   │   │   ├── page.tsx
│   │   │   ├── preview/
│   │   │   ├── code/
│   │   │   ├── terminal/
│   │   │   ├── git/
│   │   │   └── env/
│   │   └── page.tsx
│   ├── agents/                   # Agent management
│   ├── github/                   # GitHub integration
│   ├── deployment/               # Deployment management
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing/dashboard page
│   └── favicon.ico
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   ├── layout/                   # Layout primitives (Header, Sidebar, etc.)
│   ├── workspace/                # Workspace-specific UI
│   │   ├── FileTree.tsx
│   │   ├── CodeEditor.tsx
│   │   ├── Terminal.tsx
│   │   ├── Preview.tsx
│   │   └── PromptInput.tsx
│   ├── dashboard/                # Dashboard cards and widgets
│   ├── agents/                   # Agent activity, orchestration UI
│   ├── github/                   # GitHub connection, repo browser
│   ├── deployment/               # Deployment status, logs
│   └── shared/                   # Cross-cutting UI primitives
├── lib/                          # Utilities and helpers
│   ├── utils.ts                  # General utilities (cn, formatters)
│   ├── api.ts                    # API client
│   ├── mock-api.ts               # Mock API layer
│   ├── types.ts                  # Shared TypeScript types
│   └── constants.ts              # App constants
├── data/                         # Mock data and fixtures
│   ├── projects.ts               # Project list mock data
│   ├── agents.ts                 # Agent definitions
│   ├── files.ts                  # Mock file system
│   └── deployments.ts            # Deployment history
├── types/                        # TypeScript type definitions
├── public/                       # Static assets
├── docs/                         # Project documentation
├── scripts/                      # Utility scripts
├── .env.example                  # Environment variable template
├── .gitignore
├── next.config.js
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
├── package.json
└── README.md
```

## Frontend Architecture

### Component Strategy
- **Page components** (`app/**/*.tsx`): Route-specific, own their data fetching
- **Layout components** (`components/layout/`): Shared structure (header, sidebar, footer)
- **Workspace components** (`components/workspace/`): Reusable UI for the build environment
- **UI primitives** (`components/ui/`): Base building blocks (button, dialog, tabs)
- **Shared utilities** (`lib/utils.ts`): A single `cn()` function for class composition

### State Management Strategy
- **Local state**: `useState` / `useReducer` for component-level state
- **Global state**: React Context for app-wide state (user, active project)
- **Server state**: SWR or React Query for API data (planned for later phases)
- **Mock state**: All data sourced from `data/` files — no database needed

### Routing Strategy
- **App Router**: File-system routing in `app/`
- **Dynamic routes**: `app/workspace/[projectId]/page.tsx`
- **Nested layouts**: Workspace has a layout with sidebar navigation
- **Intercepting routes** (planned): For modals and slide-overs

## Data / State Strategy

### Mock Data Layer
All data comes from static TypeScript files in `data/`:

```typescript
// data/projects.ts
export const mockProjects: Project[] = [
  {
    id: "p1",
    name: "E-commerce Storefront",
    status: "deployed",
    ...
  }
];
```

### Mock API Layer
A `lib/mock-api.ts` module simulates API responses with:
- Delayed resolution (simulates network latency)
- Random success/failure (simulates unreliable APIs)
- Type-safe responses

```typescript
export async function getProject(id: string): Promise<Project | null> {
  await new Promise(resolve => setTimeout(resolve, 350));
  return mockProjects.find(p => p.id === id) ?? null;
}
```

### Mock vs. Real Strategy
| Feature | Current State | Future Path |
|--------|--------------|-------------|
| Data fetching | Mock data files | API routes → external services |
| Authentication | Mock session | NextAuth.js |
| AI generation | Mock responses | LLM provider SDK |
| File system | Mock FS | API route to actual FS |
| Code preview | Static iframe | Live sandbox iframe |
| Terminal | Mock output | WebSocket to backend |
| GitHub | Mock API | GitHub GraphQL API |
| Deployment | Mock status | Vercel / Netlify API |

## Future Backend Architecture (Planned)

When transitioning from prototype to production, the architecture would evolve:

```
┌──────────────────┐
│   Next.js App    │ ← Serves frontend (this project)
└────────┬─────────┘
         │
┌────────┴─────────┐
│  API Layer       │ ← /app/api/* routes
│  (Next.js API)   │
└────────┬─────────┘
         │
┌────────┴─────────┐     ┌─────────────────┐
│   Orchestration  │ ←→  │  AI Agent Pool   │
│   Engine (BullMQ)  │     │  (LLM workers)   │
└────────┬─────────┘     └─────────────────┘
         │
┌────────┴─────────┐
│  Code Execution   │ ← Docker sandbox
│  Sandbox          │ ← Isolated environment
└────────┬─────────┘
         │
┌────────┴─────────┐
│  External APIs    │
│  (GitHub, LLMs,   │
│   Deployment)     │
└───────────────────┘
```

Key future components:
- **Job Queue**: Redis + BullMQ for AI agent orchestration
- **Sandbox**: Ephemeral Docker containers for code execution
- **Real-time**: WebSocket for terminal and agent activity streams
- **Storage**: PostgreSQL for project metadata, S3 for artifacts

## Scalability Considerations

### What scales today (prototype):
- **Static export**: The app can be fully statically generated
- **Mock data**: Zero runtime data dependencies
- **No backend**: No server-side state to manage

### What scales in production:
- **Incremental adoption**: API routes can be added gradually without rewriting the frontend
- **Component modularity**: Each feature is isolated and independently upgradable
- **Progressive hydration**: Server components reduce client-side bundle size
- **Edge-ready**: API routes are compatible with edge runtimes

### Anti-patterns to avoid:
- Embedding mock data directly in components (keeps data in `data/`)
- Tight coupling between UI and data source (abstract behind interfaces)
- Premature optimization of non-critical paths

## Constraints & Guardrails

1. **No real AI orchestration**: All AI responses are mock/fixed
2. **No real code execution**: Preview is a static or simulated iframe
3. **No real backend services**: No Redis, databases, or message queues
4. **No real GitHub**: API calls are mocked
5. **No real deployment**: Deployment button triggers a mock flow
6. **Frontend-first**: All functionality must be achievable in the browser